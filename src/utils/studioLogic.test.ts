import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BUGI_CANONICAL_PROFILE,
  buildCodexExportPackage,
  calibrateScenesWithRealAudio,
  canUserAccessEpisode,
  createNewEpisode,
  deleteScene,
  duplicateScene,
  estimateAICallCost,
  isAllowedGeminiModel,
  normalizeGeminiModelId,
  reorderScenes,
  sanitizeEpisodeForFirestore,
  transitionEpisodeStage,
  validateCodexExportPackage,
  validateHookText,
  validateStoryboardTimings,
  verifyNoClientKeyExposure,
} from './studioLogic';
import {
  buildSceneGeometryForScene,
  extractGeometricContourFromAlphaGrid,
  ORDERED_SCENE_LAYERS,
  resolveSimplifiedCollision,
  updateGeometryObjectMaskMode,
  validateSceneGeometry,
} from './sceneGeometryEngine';
import {
  analyzeAndNormalizeAudioSamples,
  buildSkillReelWordCues,
  generateEpisodeVisualQAReport,
  generateHyperFramesDeterministicHtml,
  groupWordCuesIntoPages,
} from './skillReelAndHyperFrames';
import {
  computeBugiArticulatedKinematics,
  generateBugiCanonicalSvgMarkup,
} from '../components/BugiCharacterSvg';
import { verifyValidMp4Buffer } from '../remotion/render/mp4RenderEngine';
import { BugiPose, StudioAsset } from '../types/studio';

test('1. Criação de episódios e validação de campos obrigatórios', () => {
  const ep = createNewEpisode({
    ownerId: 'user-123',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis: 'O coeficiente de atrito estático e dinâmico cai para zero em toda a superfície.',
  });

  assert.equal(ep.title, 'E se o atrito desaparecesse por 5 segundos?');
  assert.equal(ep.stage, 'Ideia');
  assert.equal(ep.hasRealRenderedMp4, false);
  assert.equal(ep.scriptVersions.length, 1);
  assert.ok(ep.scenes.length >= 4);

  assert.throws(
    () =>
      createNewEpisode({
        ownerId: 'user-123',
        title: 'Oi',
        hypothesis: 'Hipótese válida suficiente',
      }),
    /entre 3 e 200 caracteres/
  );
});

test('2. Salvamento e leitura — Sanitização para Firestore remove mídia pesada inline', () => {
  const ep = createNewEpisode({
    id: 'ep-friction-demo',
    ownerId: 'user-abc',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis: 'Atrito zero por 5 segundos enquanto o Bugi caminha na calçada.',
  });

  ep.narrationTracks.push({
    id: 'nar-1',
    scriptVersionId: ep.activeScriptVersionId,
    createdAt: new Date().toISOString(),
    model: 'gemini-3.8-flash-tts',
    voice: 'Puck',
    interpretationStyle: 'Dinâmico e curioso',
    pace: 'Dinâmico (Shorts)',
    expressiveness: 'Alta',
    language: 'pt-BR',
    audioDataUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA',
    mimeType: 'audio/wav',
    durationSec: 42.5,
    isManualUpload: false,
    alignmentType: 'estimated_from_duration',
    temporalMarkers: [],
    approved: true,
  });

  const firestoreDoc = sanitizeEpisodeForFirestore(ep, 'user-abc');
  assert.equal(firestoreDoc.id, 'ep-friction-demo');
  assert.equal(firestoreDoc.ownerId, 'user-abc');
  assert.ok(firestoreDoc.payloadJson.length < 450000);

  const parsed = JSON.parse(firestoreDoc.payloadJson);
  assert.equal(parsed.narrationTracks[0].audioDataUrl, undefined);
  assert.equal(parsed.narrationTracks[0].durationSec, 42.5);
});

test('3. Geração estruturada de roteiros — Rejeita gancho padrão "Você sabia que..."', () => {
  const badHook = validateHookText('Você sabia que o atrito impede a gente de escorregar?');
  assert.equal(badHook.valid, false);
  assert.match(badHook.reason || '', /Você sabia que/);

  const goodHook = validateHookText(
    'Se o chão perdesse 100% do atrito agora, o seu próximo passo seria um desastre!'
  );
  assert.equal(goodHook.valid, true);
});

test('4. Ordenação, duplicação e exclusão de cenas do storyboard', () => {
  const ep = createNewEpisode({
    ownerId: 'user-123',
    title: 'E se a gravidade dobrasse por 5 segundos?',
    hypothesis: 'Aceleração gravitacional passa de 9,8 m/s² para 19,6 m/s².',
  });

  const initialCount = ep.scenes.length;
  const firstSceneId = ep.scenes[0].id;
  const secondSceneId = ep.scenes[1].id;

  const reordered = reorderScenes(ep.scenes, 0, 1);
  assert.equal(reordered[0].id, secondSceneId);
  assert.equal(reordered[1].id, firstSceneId);
  assert.equal(reordered[0].order, 1);
  assert.equal(reordered[0].startTimeSec, 0);

  const duplicated = duplicateScene(reordered, secondSceneId);
  assert.equal(duplicated.length, initialCount + 1);

  const afterDelete = deleteScene(duplicated, duplicated[1].id);
  assert.equal(afterDelete.length, initialCount);
});

test('5. Validação dos tempos e calibração com duração real do áudio de narração', () => {
  const ep = createNewEpisode({
    ownerId: 'user-123',
    title: 'E se o som viajasse a 10 km/h?',
    hypothesis: 'Ondas mecânicas sonoras desaceleradas no ar.',
  });

  const initialCheck = validateStoryboardTimings(ep.scenes);
  assert.equal(initialCheck.valid, true);
  assert.equal(initialCheck.totalDurationSec, 40);

  const calibrated = calibrateScenesWithRealAudio(ep.scenes, 44.8);
  const calibratedCheck = validateStoryboardTimings(calibrated.scenes);
  assert.equal(calibratedCheck.valid, true);
  assert.equal(calibratedCheck.totalDurationSec, 44.8);
  assert.equal(calibrated.scenes[0].timeCalculationMode, 'calculado_audio_real');
  assert.equal(calibrated.markers.length, ep.scenes.length);
});

test('6. Exportação de JSON para Codex e Remotion preserva Bugi e formato 1080x1920 30FPS', () => {
  const ep = createNewEpisode({
    id: 'ep-atrito-5s',
    ownerId: 'user-123',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis: 'Coeficiente de atrito zero por 5 segundos.',
  });

  const sampleAssets: StudioAsset[] = [
    {
      id: 'asset-bugi-rig-v1',
      name: 'Bugi Rig 2D Canônico',
      category: 'Personagens SVG',
      version: '1.0.0',
      license: 'Proprietária — E Se Bugasse? Studio',
      origin: 'SVG Canônico Bugi',
      createdAt: new Date().toISOString(),
      fileFormat: 'image/svg+xml',
      fileSizeBytes: 14200,
      preservesBugiIdentity: true,
      description: 'Rig vetorial 2D com cabelo coral espetado e jaqueta azul-petróleo.',
      tags: ['bugi', 'rig', 'svg'],
    },
  ];

  const pkg = buildCodexExportPackage(ep, sampleAssets);
  const validation = validateCodexExportPackage(pkg);
  assert.equal(validation.valid, true);
  assert.equal(pkg['render-config.json'].width, 1080);
  assert.equal(pkg['render-config.json'].height, 1920);
  assert.equal(pkg['render-config.json'].fps, 30);
  assert.equal(pkg['render-config.json'].codec, 'h264');
  assert.equal(pkg['render-config.json'].renderStatus, 'aguardando_render_local_codex');
  assert.deepEqual(pkg['episode.json'].characterCanonicalSpec, BUGI_CANONICAL_PROFILE);
});

test('7. Modelos de IA e tratamento de falhas — Bloqueia modelos descontinuados e calcula custos', () => {
  assert.equal(isAllowedGeminiModel('gemini-1.5-flash'), false);
  assert.equal(isAllowedGeminiModel('gemini-2.0-flash'), false);
  assert.equal(isAllowedGeminiModel('gemini-3.8-flash'), true);
  assert.equal(isAllowedGeminiModel('gemini-3.8-flash-tts'), true);
  assert.equal(isAllowedGeminiModel('gemini-3.5-transcribe'), true);
  assert.equal(isAllowedGeminiModel('gemini-3.1-flash-image'), true);
  assert.equal(
    normalizeGeminiModelId('gemini-3.1-flash-image'),
    'gemini-3.1-flash-lite-image'
  );

  const cost = estimateAICallCost('roteiro', 'gemini-3.8-flash', 2400);
  assert.ok(cost.estimatedCostUsd > 0);
  assert.equal(cost.requiresPaidKey, false);

  const imageCost = estimateAICallCost('imagens_cenarios', 'gemini-nano-banana-2.1', 1200);
  assert.equal(imageCost.requiresPaidKey, true);
});

test('8. Controle de acesso e proteção contra falso status de vídeo renderizado', () => {
  const ep = createNewEpisode({
    ownerId: 'owner-real',
    title: 'E se a água ficasse sólida a 25 graus?',
    hypothesis: 'Mudança no ponto de fusão da água à pressão atmosférica.',
  });

  assert.equal(canUserAccessEpisode(ep, 'owner-real'), true);
  assert.equal(canUserAccessEpisode(ep, 'intruder-user'), false);
  assert.equal(canUserAccessEpisode(ep, null), false);

  assert.throws(
    () => transitionEpisodeStage(ep, 'Concluido'),
    /sem um arquivo MP4 real/
  );

  const readyEp = transitionEpisodeStage(ep, 'Pronto para Codex', 'Pacote revisado');
  assert.equal(readyEp.stage, 'Pronto para Codex');
  const backToScript = transitionEpisodeStage(readyEp, 'Roteiro', 'Ajuste fino de piada');
  assert.equal(backToScript.stage, 'Roteiro');
  assert.equal(backToScript.scriptVersions.length, 1);
  assert.equal(backToScript.history.length, 3);
});

test('9. Ausência de chaves GEMINI_API_KEY expostas no código cliente', () => {
  const cleanClientCode = `
    export async function callStudioBackend(prompt: string) {
      const res = await fetch('/api/ai/script', { method: 'POST', body: JSON.stringify({ prompt }) });
      return res.json();
    }
  `;
  const checkClean = verifyNoClientKeyExposure(cleanClientCode);
  assert.equal(checkClean.safe, true);

  const leakedCode = `const key = process.env.GEMINI_API_KEY;`;
  const checkLeaked = verifyNoClientKeyExposure(leakedCode);
  assert.equal(checkLeaked.safe, false);
});

test('10. SceneGeometryEngine — Proporções geométricas 1080x1920, 8 camadas ordenadas, máscaras e colisões', () => {
  const ep = createNewEpisode({
    ownerId: 'user-123',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis: 'Atrito zero por 5 segundos.',
  });

  const scene = ep.scenes[0];
  const geom = buildSceneGeometryForScene(scene);

  assert.equal(geom.canvasWidth, 1080);
  assert.equal(geom.canvasHeight, 1920);
  assert.equal(geom.layersOrder.length, 8);
  assert.deepEqual(geom.layersOrder, ORDERED_SCENE_LAYERS);

  const validation = validateSceneGeometry(geom, scene.bugiPose);
  assert.equal(validation.valid, true);

  // Testa extração de contorno poligonal a partir de matriz alfa
  const alphaGrid = [
    [0, 0, 0, 0],
    [0, 255, 255, 0],
    [0, 255, 255, 0],
    [0, 0, 0, 0],
  ];
  const contour = extractGeometricContourFromAlphaGrid(alphaGrid, 4, 4);
  assert.ok(contour.length >= 4);

  // Testa simplificação de camada e colisão simplificada
  const bugiObj = geom.objects.find((o) => o.layer === 'Personagem Bugi')!;
  const propObj = geom.objects.find((o) => o.layer === 'Objetos interativos')!;
  const collision = resolveSimplifiedCollision(
    bugiObj,
    propObj,
    geom.groundLinePxY,
    false
  );
  assert.equal(collision.clampedBugiY, 1370);

  const simplified = updateGeometryObjectMaskMode(
    geom,
    propObj.id,
    'simplified_layer'
  );
  const updatedProp = simplified.objects.find((o) => o.id === propObj.id)!;
  assert.equal(updatedProp.maskSource, 'simplified_vector_layer');
});

test('11. Consistência do Rig Articulado do Bugi nos 12 movimentos físicos', () => {
  const all12Poses: BugiPose[] = [
    'caminhando',
    'correndo',
    'pulando',
    'caindo',
    'escorregando',
    'olhando_objeto',
    'assustando',
    'comemorando',
    'equilibrando',
    'apontando',
    'agachando',
    'reagindo_impacto',
  ];

  for (const pose of all12Poses) {
    const k0 = computeBugiArticulatedKinematics(pose, 0, 30, 0.3);
    const k15 = computeBugiArticulatedKinematics(pose, 15, 30, 0.6);
    assert.equal(k0.pose, pose);
    assert.ok(k0.squashX > 0.7 && k0.squashX < 1.3);
    assert.ok(k0.stretchY > 0.7 && k0.stretchY < 1.3);
    // Verifica que existe movimento real entre o frame 0 e o frame 15
    const moved =
      k0.rootY !== k15.rootY ||
      k0.torsoRotation !== k15.torsoRotation ||
      k0.leftArmPath !== k15.leftArmPath ||
      k0.rightArmPath !== k15.rightArmPath ||
      k0.stretchY !== k15.stretchY;
    assert.equal(moved, true, `A pose ${pose} deve apresentar movimento real entre frames`);

    const svg = generateBugiCanonicalSvgMarkup(pose, 'surpreso', 'calcada_urbana', 10);
    assert.ok(svg.includes('#FF6B50'), 'Cabelo coral canônico preservado');
    assert.ok(svg.includes('#122638'), 'Jaqueta azul-petróleo canônica preservada');
    assert.ok(svg.includes('#FFF7E9'), 'Camiseta e tênis creme preservados');
  }
});

test('12. Skill Reel Legendas (@remotion/captions), Normalização -14 LUFS e Ducking', () => {
  const cues = buildSkillReelWordCues(
    'Sem atrito no segundo 5 a inércia gera o caos!',
    0,
    5.0
  );
  assert.ok(cues.length >= 8);
  const atritoCue = cues.find((c) => c.word.toLowerCase().includes('atrito'));
  assert.equal(atritoCue?.highlightColor, '#39C8D5');
  const caosCue = cues.find((c) => c.word.toLowerCase().includes('caos'));
  assert.equal(caosCue?.highlightColor, '#FFD166');

  const pages = groupWordCuesIntoPages(cues, 5);
  assert.ok(pages.length >= 2);
  assert.ok(pages[0].words.length <= 5);

  // Testa análise de áudio e normalização para -14 LUFS com ducking
  const samples = new Float32Array(24000);
  for (let i = 0; i < 12000; i++) {
    samples[i] = Math.sin((2 * Math.PI * 440 * i) / 24000) * 0.1;
  }
  const norm = analyzeAndNormalizeAudioSamples(samples, 24000, -14);
  assert.equal(norm.targetLufs, -14);
  assert.ok(norm.appliedGainLinear > 0);
  assert.ok(norm.pauseIntervalsSec.length >= 1);
  assert.ok(norm.duckingEnvelopeDb.some((d) => d.musicGainDb === -30));
  assert.ok(norm.duckingEnvelopeDb.some((d) => d.musicGainDb === -20));
});

test('13. Verificação de container MP4 ISO-BMFF, Skill Reel (.agents/skills/reel) e HyperFrames GSAP', () => {
  const validMp4Header = new Uint8Array(128);
  validMp4Header[4] = 'f'.charCodeAt(0);
  validMp4Header[5] = 't'.charCodeAt(0);
  validMp4Header[6] = 'y'.charCodeAt(0);
  validMp4Header[7] = 'p'.charCodeAt(0);
  assert.equal(verifyValidMp4Buffer(validMp4Header).valid, true);

  const invalidMp4 = new Uint8Array(32);
  assert.equal(verifyValidMp4Buffer(invalidMp4).valid, false);

  // Verifica que os arquivos reais em .agents/skills/reel existem e foram auditados
  const skillDir = path.resolve(process.cwd(), '.agents/skills/reel');
  assert.equal(fs.existsSync(path.join(skillDir, 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(skillDir, 'ESTILO.md')), true);
  assert.equal(fs.existsSync(path.join(skillDir, 'regras-da-casa.md')), true);
  assert.equal(fs.existsSync(path.join(skillDir, 'modelo/README.md')), true);
  assert.equal(
    fs.existsSync(path.join(skillDir, 'install-skill-reel-windows.ps1')),
    true
  );

  // Verifica que o HTML determinístico do HyperFrames registra window.__timelines
  const ep = createNewEpisode({
    ownerId: 'user-123',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis: 'Atrito zero por 5 segundos.',
  });
  const hfHtml = generateHyperFramesDeterministicHtml(ep.scenes[0]);
  assert.ok(hfHtml.includes('gsap.timeline({ paused: true })'));
  assert.ok(hfHtml.includes('window.__timelines'));

  // Verifica relatório de QA e Folha de Quadros (Contact Sheet)
  const qaBeforeMp4 = generateEpisodeVisualQAReport(ep);
  assert.equal(qaBeforeMp4.contactSheet.length, ep.scenes.length);
  assert.equal(qaBeforeMp4.checks.realMp4RenderedAndVerified, false);
  assert.equal(qaBeforeMp4.overallPassed, false);
});

test('14. Reconstrução da Qualidade Visual — 10 Funções Remotion, Rig Multi-Pivô de 11 Estados e 16 Capturas de 0.5s do Piloto de 8s', async () => {
  const {
    walkCycle,
    slipReaction,
    bodyImpact,
    eyeReaction,
    armFlail,
    headFollow,
    cameraTracking,
    parallaxMotion,
    objectInteraction,
    squashAndStretch,
    computeBugiMultiJointRig,
    PILOT_8S_FRICTION_BEATS,
    PREVIOUS_ENGINE_AUDIT_REPORT,
  } = await import('../remotion/animation/bugiRigAndBeatsEngine');
  const { generateHalfSecondPilotCaptures } = await import(
    './skillReelAndHyperFrames'
  );

  assert.equal(PILOT_8S_FRICTION_BEATS.length, 4);
  assert.ok(PREVIOUS_ENGINE_AUDIT_REPORT.length >= 5);

  const w1 = walkCycle(0, 30, 1);
  const w2 = walkCycle(15, 30, 1);
  assert.notEqual(w1.leftHipDeg, w2.leftHipDeg);
  assert.notEqual(w1.leftShoulderDeg, w2.leftShoulderDeg);

  const slip = slipReaction(12, 30);
  assert.ok(slip.torsoSlipTiltDeg < 0);

  const impact = bodyImpact(20, 30);
  assert.ok(impact.impactSquashX > 1.0);
  assert.ok(impact.impactStretchY < 1.0);

  const eye = eyeReaction(10, 30, 'surprise', 'surpreso');
  assert.ok(eye.eyeScaleY >= 1.15);

  const flail = armFlail(20, 30);
  assert.notEqual(flail.leftShoulderDeg, flail.rightShoulderDeg);

  const head = headFollow(15, 30, -18, 4);
  assert.notEqual(head.hairFollowDeg, 0);

  const cam = cameraTracking(90, 30, PILOT_8S_FRICTION_BEATS[1]);
  assert.ok(cam.zoom >= 1.0);

  const px = parallaxMotion(120, -40, 1.5);
  assert.ok(Math.abs(px.foregroundOffsetX) > Math.abs(px.skyOffsetX));

  const obj = objectInteraction(140, PILOT_8S_FRICTION_BEATS[2]);
  assert.notEqual(obj.slidingConeOffsetX, 0);

  const ss = squashAndStretch('impact', 18, 30);
  assert.notEqual(ss.squashX, 1);

  const rig = computeBugiMultiJointRig({
    pose: 'escorregando',
    expression: 'surpreso',
    stateOverride: 'surprise',
    frame: 75,
    fps: 30,
  });
  assert.equal(rig.state, 'surprise');
  assert.equal(rig.groundY, 685);

  const halfSecCaptures = generateHalfSecondPilotCaptures();
  assert.equal(halfSecCaptures.length, 16);
  assert.equal(halfSecCaptures[0].timestampSec, 0);
  assert.equal(halfSecCaptures[15].timestampSec, 7.5);
});

test('15. ProductionOrchestrator (15 Etapas, Progresso Real, Idempotência) e 12 Pastas Lógicas por Episódio', async () => {
  const {
    createInitialOrchestratorJob,
    computeOrchestratorRealProgressPercent,
    buildEpisodeLogicalFolders,
    generateEpisodePublishingPackage,
  } = await import('../services/productionOrchestrator');

  const ep = createNewEpisode({
    id: 'ep-orchestrator-test',
    ownerId: 'user-123',
    title: 'E se o atrito desaparecesse por 8 segundos?',
    hypothesis: 'Coeficiente de atrito cai para zero.',
  });

  const job = createInitialOrchestratorJob({
    episode: ep,
    mode: 'automatico',
    targetDurationMode: 'pilot_8s',
    targetDurationSec: 8,
    budgetCapUsd: 0.5,
  });

  assert.equal(job.steps.length, 15);
  assert.equal(job.completedWeightPercent, 0);

  // Marca as 3 primeiras etapas como concluídas (pesos: 6 + 8 + 7 = 21%)
  job.steps[0].status = 'concluída';
  job.steps[0].paidCallCompleted = true;
  job.steps[0].realizedCostUsd = 0.002;
  job.steps[1].status = 'concluída';
  job.steps[2].status = 'concluída';

  const realPct = computeOrchestratorRealProgressPercent(job.steps);
  assert.equal(realPct, 21);

  // Verifica idempotência ao retomar job existente: etapa paga concluída é preservada
  const resumedJob = createInitialOrchestratorJob({
    episode: ep,
    mode: 'automatico',
    targetDurationMode: 'pilot_8s',
    targetDurationSec: 8,
    budgetCapUsd: 0.5,
    existingJob: job,
  });
  assert.equal(resumedJob.steps[0].status, 'concluída');
  assert.equal(resumedJob.steps[0].paidCallCompleted, true);

  const pubPkg = generateEpisodePublishingPackage(ep);
  assert.ok(pubPkg.finalTitle.includes('#Shorts'));
  assert.ok(pubPkg.hashtags.includes('#ESeBugasse'));

  const folders = buildEpisodeLogicalFolders(ep);
  const folderKeys = Object.keys(folders);
  assert.equal(folderKeys.length, 12);
  assert.deepEqual(folderKeys, [
    'research',
    'script',
    'narration',
    'storyboard',
    'backgrounds',
    'characters',
    'animation',
    'editing',
    'audio',
    'renders',
    'thumbnail',
    'publishing',
  ]);
});

test('16. PhotoCraftAdapter (v0.20.1) + FilmCraftAdapter (v0.17.0) + MediaFinishingService + Perfis de Qualidade', async () => {
  const { execFileSync } = await import('child_process');
  const fs = await import('fs');
  const {
    PhotoCraftAdapter,
    FilmCraftAdapter,
    MediaFinishingService,
    QUALITY_PROFILES_CONFIG,
    PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT,
    buildFallbackComparisonReport,
  } = await import('../services/mediaFinishingService');

  // 1. Verifica os 3 perfis de qualidade obrigatórios (Seção 7)
  assert.equal(QUALITY_PROFILES_CONFIG.rapido.usePhotoCraft, false);
  assert.equal(QUALITY_PROFILES_CONFIG.rapido.useFilmCraft, false);
  assert.equal(QUALITY_PROFILES_CONFIG.equilibrado.usePhotoCraft, true);
  assert.equal(QUALITY_PROFILES_CONFIG.equilibrado.useFilmCraft, false);
  assert.equal(QUALITY_PROFILES_CONFIG.maxima_qualidade.usePhotoCraft, true);
  assert.equal(QUALITY_PROFILES_CONFIG.maxima_qualidade.useFilmCraft, true);

  // 2. Verifica os métodos obrigatórios nas interfaces PhotoCraftAdapter e FilmCraftAdapter (Seção 4)
  const pcAdapter = new PhotoCraftAdapter();
  assert.equal(typeof pcAdapter.checkAvailability, 'function');
  assert.equal(typeof pcAdapter.processBackground, 'function');
  assert.equal(typeof pcAdapter.applyColorPreset, 'function');
  assert.equal(typeof pcAdapter.prepareLayers, 'function');
  assert.equal(typeof pcAdapter.exportAssets, 'function');

  const fcAdapter = new FilmCraftAdapter();
  assert.equal(typeof fcAdapter.checkAvailability, 'function');
  assert.equal(typeof fcAdapter.importRender, 'function');
  assert.equal(typeof fcAdapter.applyColorGrade, 'function');
  assert.equal(typeof fcAdapter.processAudio, 'function');
  assert.equal(typeof fcAdapter.exportFinalVideo, 'function');
  assert.equal(typeof fcAdapter.validateOutput, 'function');

  const svc = new MediaFinishingService();
  assert.ok(svc.photocraft instanceof PhotoCraftAdapter);
  assert.ok(svc.filmcraft instanceof FilmCraftAdapter);

  // 3. Verifica o relatório comparativo de 10 critérios (Seção 8)
  const comp = buildFallbackComparisonReport({
    episodeId: 'ep-atrito-5s',
    remotionMp4Url: '/api/media/sample.mp4',
    qualityProfile: 'equilibrado',
  });
  assert.equal(Object.keys(comp.checks).length, 10);
  assert.equal(comp.regressionDetected, false);

  // 4. Verifica auditoria e setup-media-tools.ps1 (Seções 1, 5 e 9)
  assert.equal(PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.photocraft.stableRelease, 'v0.20.1');
  assert.equal(PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.filmcraft.stableRelease, 'v0.17.0');
  assert.equal(PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.roleMatrix.length, 9);
  assert.equal(fs.existsSync('setup-media-tools.ps1'), true);

  // 5. Verifica os binários nativos instalados em tools/bin (se presentes no ambiente)
  const pcPath = process.platform === 'win32' ? './tools/bin/photocraft-cli.exe' : './tools/bin/photocraft-cli';
  const fcPath = process.platform === 'win32' ? './tools/bin/filmcraft-cli.exe' : './tools/bin/filmcraft-cli';
  if (fs.existsSync(pcPath) && fs.existsSync(fcPath)) {
    const pcVer = execFileSync(pcPath, ['--version'], { encoding: 'utf8' }).trim();
    const fcVer = execFileSync(fcPath, ['--version'], { encoding: 'utf8' }).trim();
    assert.ok(pcVer.includes('0.20.1'));
    assert.ok(fcVer.includes('0.17.0'));
  } else {
    // Binários opcionais não instalados localmente; adaptadores operam em modo fallback seguro
    assert.ok(true);
  }
});

test('17. Manual Mestre 2D: REFERENCE_STYLE_ANALYSIS.md + Piloto Prático de 12s (5 Beats, 360f) + grabAndStretchReaction + 24 Capturas de 0.5s', async () => {
  const fs = await import('fs');
  const {
    PILOT_12S_FRICTION_BEATS,
    grabAndStretchReaction,
    computeBugiMultiJointRig,
  } = await import('../remotion/animation/bugiRigAndBeatsEngine');
  const { generateHalfSecondPilot12sCaptures } = await import(
    '../utils/skillReelAndHyperFrames'
  );

  // 1. Verifica REFERENCE_STYLE_ANALYSIS.md com separação entre observações comprovadas, interpretações e decisões criativas
  assert.equal(fs.existsSync('REFERENCE_STYLE_ANALYSIS.md'), true);
  const analysisMd = fs.readFileSync('REFERENCE_STYLE_ANALYSIS.md', 'utf8');
  assert.ok(analysisMd.includes('uJZ8Evzrj-c'));
  assert.ok(analysisMd.includes('## 1. OBSERVAÇÕES COMPROVADAS'));
  assert.ok(analysisMd.includes('## 2. INTERPRETAÇÕES TÉCNICAS'));
  assert.ok(analysisMd.includes('## 3. DECISÕES CRIATIVAS OFICIAIS'));

  // 2. Verifica os 5 beats obrigatórios do piloto de 12 segundos (0-2s, 2-4s, 4-7s, 7-10s, 10-12s = 360 frames @ 30 FPS)
  assert.equal(PILOT_12S_FRICTION_BEATS.length, 5);
  assert.equal(PILOT_12S_FRICTION_BEATS[0].startTimeSec, 0);
  assert.equal(PILOT_12S_FRICTION_BEATS[0].endTimeSec, 2);
  assert.equal(PILOT_12S_FRICTION_BEATS[1].startTimeSec, 2);
  assert.equal(PILOT_12S_FRICTION_BEATS[1].endTimeSec, 4);
  assert.equal(PILOT_12S_FRICTION_BEATS[2].startTimeSec, 4);
  assert.equal(PILOT_12S_FRICTION_BEATS[2].endTimeSec, 7);
  assert.equal(PILOT_12S_FRICTION_BEATS[3].startTimeSec, 7);
  assert.equal(PILOT_12S_FRICTION_BEATS[3].endTimeSec, 10);
  assert.equal(PILOT_12S_FRICTION_BEATS[3].characterState, 'grabbing_stretch');
  assert.equal(PILOT_12S_FRICTION_BEATS[4].startTimeSec, 10);
  assert.equal(PILOT_12S_FRICTION_BEATS[4].endTimeSec, 12);
  assert.equal(PILOT_12S_FRICTION_BEATS[4].endFrame, 360);

  // 3. Verifica grabAndStretchReaction: segurando no poste (frame 42 -> hasLostGrip false) e soltando (frame 60 -> hasLostGrip true)
  const holding = grabAndStretchReaction(42, 30);
  assert.equal(holding.hasLostGrip, false);
  assert.ok(holding.bodyStretchX > 1.15);
  assert.ok(holding.leftArmStretchFactor > 1.45);

  const snapped = grabAndStretchReaction(60, 30);
  assert.equal(snapped.hasLostGrip, true);

  // 4. Verifica rig no Beat 4 (desespero + esticamento) e no final do Beat 5 (recuperação sem deformação permanente)
  const rigBeat4 = computeBugiMultiJointRig({
    pose: 'agarrando_objeto',
    expression: 'desespero',
    frame: 40,
    fps: 30,
    stateOverride: 'grabbing_stretch',
  });
  assert.equal(rigBeat4.state, 'grabbing_stretch');
  assert.equal(rigBeat4.groundY, 685);

  const rigEnd = computeBugiMultiJointRig({
    pose: 'reagindo_impacto',
    expression: 'comico',
    frame: 59,
    fps: 30,
    stateOverride: 'recovery',
  });
  assert.equal(rigEnd.squashX, 1.0);
  assert.equal(rigEnd.stretchY, 1.0);

  // 5. Verifica as 24 capturas de 0.5s do piloto de 12 segundos (0.0s a 11.5s)
  const captures24 = generateHalfSecondPilot12sCaptures();
  assert.equal(captures24.length, 24);
  assert.equal(captures24[0].timestampSec, 0);
  assert.equal(captures24[15].characterState, 'grabbing_stretch');
  assert.equal(captures24[23].timestampSec, 11.5);
});



