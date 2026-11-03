import {
  AIModelCategory,
  BugiCanonicalProfile,
  CodexCompleteExportPackage,
  Episode,
  EpisodeStage,
  EPISODE_STAGES,
  NarrationTrack,
  ScriptSegment,
  ScriptVersion,
  StoryboardScene,
  StudioAsset,
  TemporalMarker,
} from '../types/studio';

export const BUGI_CANONICAL_PROFILE: BugiCanonicalProfile = {
  name: 'Bugi',
  hair: 'Cabelo coral (#FF6B50), espetado com pontas arredondadas expressivas',
  eyes: 'Olhos pretos (#09131C) grandes e muito expressivos com brilho vivo',
  jacket: 'Jaqueta azul-petróleo (#122638) com gola e detalhe ciano (#39C8D5)',
  shirt: 'Camiseta creme (#FFF7E9)',
  pants: 'Calça escura (#0A1520)',
  sneakers: 'Tênis claros (#FFF7E9) com solado coral (#FF6B50)',
  outlineStyle: 'Contornos arredondados uniformes e expressões faciais intensas',
  personality:
    'Curioso, divertido, confiante demais e frequentemente surpreendido pelas consequências dos experimentos. Não fala; a narração conduz enquanto Bugi vive o caos.',
  speaks: false,
  palette: {
    hairCoral: '#FF6B50',
    jacketPetrol: '#122638',
    trimCyan: '#39C8D5',
    shirtCream: '#FFF7E9',
    pantsDark: '#0A1520',
    sneakersLight: '#FFF7E9',
    eyesBlack: '#09131C',
  },
};

export const DEPRECATED_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-2.0-flash',
  'gemini-2.0-pro',
  'gemini-2.0-flash-thinking',
];

export const ALLOWED_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-4-argon',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts',
  'gemini-3.5-transcribe',
  'gemini-3.1-flash-image',
  'gemini-3.1-flash-lite-image',
  'gemini-nano-banana-2.1',
  'gemini-3-pro-image',
  'gemini-omni-1.1-flash',
];

export function normalizeGeminiModelId(modelId: string): string {
  const clean = (modelId || '').trim();
  if (clean === 'gemini-3.1-flash-image') {
    return 'gemini-3.1-flash-lite-image';
  }
  return clean;
}

export function isAllowedGeminiModel(modelId: string): boolean {
  const normalized = (modelId || '').trim();
  if (!normalized) return false;
  if (DEPRECATED_MODELS.includes(normalized)) return false;
  return ALLOWED_GEMINI_MODELS.includes(normalized);
}

export function validateHookText(hookText: string): {
  valid: boolean;
  reason?: string;
} {
  const trimmed = (hookText || '').trim();
  if (trimmed.length < 8) {
    return { valid: false, reason: 'O gancho deve ter pelo menos 8 caracteres.' };
  }
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('você sabia que') || lower.startsWith('voce sabia que')) {
    return {
      valid: false,
      reason:
        'Padrão proibido: o gancho nunca deve começar com "Você sabia que..." por padrão.',
    };
  }
  return { valid: true };
}

export function createNewEpisode(params: {
  id?: string;
  ownerId: string;
  title: string;
  hypothesis: string;
  scientificSummary?: string;
}): Episode {
  const cleanTitle = (params.title || '').trim();
  const cleanHypothesis = (params.hypothesis || '').trim();
  const cleanOwner = (params.ownerId || '').trim();

  if (cleanTitle.length < 3 || cleanTitle.length > 200) {
    throw new Error('O título do episódio deve ter entre 3 e 200 caracteres.');
  }
  if (cleanHypothesis.length < 5 || cleanHypothesis.length > 500) {
    throw new Error('A hipótese física deve ter entre 5 e 500 caracteres.');
  }
  if (!cleanOwner) {
    throw new Error('O identificador do criador (ownerId) é obrigatório.');
  }

  const now = new Date().toISOString();
  const episodeId =
    params.id || `ep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const scriptVersionId = `sv-${episodeId}-v1`;

  const initialSegments: ScriptSegment[] = [
    {
      id: `seg-${episodeId}-1`,
      order: 1,
      sentenceText: `${cleanTitle} O Bugi resolveu testar isso na prática agora mesmo!`,
      speakingDirection: 'Entrada rápida, energia lá no alto, pausa dramática no final.',
      visualPlanning:
        'Bugi no centro do quadro com expressão confiante, cronômetro de 5 segundos piscando no topo.',
      estimatedDurationSec: 7,
      scientificNote: cleanHypothesis,
    },
    {
      id: `seg-${episodeId}-2`,
      order: 2,
      sentenceText:
        'No primeiro segundo, tudo parece normal, até a física cobrar o preço imediatamente.',
      speakingDirection: 'Tom curioso e crescente, preparando a virada cômica.',
      visualPlanning:
        'Bugi dá o primeiro passo confiante e seus olhos arregalam quando o ambiente reage.',
      estimatedDurationSec: 10,
    },
    {
      id: `seg-${episodeId}-3`,
      order: 3,
      sentenceText:
        'Sem a regra habitual da física, qualquer movimento simples vira um efeito dominó impossível de frear.',
      speakingDirection: 'Ritmo dinâmico de Shorts, articulando bem os termos físicos.',
      visualPlanning:
        'Vetores ciano e amarelos aparecem ao redor do Bugi enquanto objetos flutuam ou deslizam.',
      estimatedDurationSec: 12,
    },
    {
      id: `seg-${episodeId}-4`,
      order: 4,
      sentenceText:
        'Quando os 5 segundos acabam de repente, a regra volta de uma vez só — e o Bugi descobre por que a natureza não aceita gambiarra!',
      speakingDirection: 'Final memorável, bem-humorado e com impacto sonoro.',
      visualPlanning:
        'Corte rápido para Bugi despencando no colchão de segurança com o cabelo coral ainda mais espetado.',
      estimatedDurationSec: 11,
    },
  ];

  const initialScript: ScriptVersion = {
    id: scriptVersionId,
    versionNumber: 1,
    createdAt: now,
    authorNote: 'Versão base estruturada automaticamente',
    status: 'rascunho',
    targetDurationRangeSec: [35, 55],
    alternativeTitles: [
      cleanTitle,
      `${cleanTitle} (O Bugi Testou!)`,
      `5 Segundos de Caos: ${cleanTitle}`,
    ],
    selectedTitle: cleanTitle,
    hookProposals: [
      {
        id: `hook-${episodeId}-1`,
        label: 'Gancho de Ação Imediata',
        hookText: `Se essa regra mudasse por 5 segundos agora, o seu corpo não teria tempo nem de piscar!`,
        firstSecondVisual: 'Bugi em close extremo segurando um cronômetro vermelho que zera.',
        selected: true,
      },
      {
        id: `hook-${episodeId}-2`,
        label: 'Gancho de Consequência Absurda',
        hookText: `Olha o que acontece com o Bugi no exato milissegundo em que essa lei da física falha!`,
        firstSecondVisual: 'Bugi caminhando tranquilo até o chão brilhar em ciano.',
        selected: false,
      },
      {
        id: `hook-${episodeId}-3`,
        label: 'Gancho de Desafio Físico',
        hookText: `Cinco segundos parecem pouco? Tenta sobreviver a esse bug da física junto com o Bugi!`,
        firstSecondVisual: 'Tela dividida: regra normal vs regra bugada com o Bugi no meio.',
        selected: false,
      },
    ],
    segments: initialSegments,
    scientificNotes: [cleanHypothesis, params.scientificSummary || 'Análise física inicial.'],
    references: [],
  };

  const initialScenes = buildScenesFromScript(episodeId, initialScript);

  return {
    id: episodeId,
    ownerId: cleanOwner,
    title: cleanTitle,
    hypothesis: cleanHypothesis,
    slogan: 'Muda uma regra. Começa o caos.',
    stage: 'Ideia',
    createdAt: now,
    updatedAt: now,
    scientificSummary:
      params.scientificSummary ||
      `Experimento hipotético avaliando: ${cleanHypothesis}`,
    verifiedReferences: [],
    scriptVersions: [initialScript],
    activeScriptVersionId: scriptVersionId,
    narrationTracks: [],
    scenes: initialScenes,
    assetIds: ['asset-bugi-rig-v1', 'asset-bg-calcada-v1'],
    exportCount: 0,
    hasRealRenderedMp4: false,
    history: [
      {
        id: `hist-${Date.now()}`,
        timestamp: now,
        fromStage: 'Ideia',
        toStage: 'Ideia',
        actionSummary: 'Episódio criado no E Se Bugasse? Studio.',
      },
    ],
  };
}

export function buildScenesFromScript(
  episodeId: string,
  script: ScriptVersion
): StoryboardScene[] {
  let cursor = 0;
  return script.segments.map((seg, idx) => {
    const dur = Math.max(2, seg.estimatedDurationSec);
    const start = Number(cursor.toFixed(2));
    const end = Number((cursor + dur).toFixed(2));
    cursor = end;

    const poses: StoryboardScene['bugiPose'][] = [
      'caminhando',
      'escorregando',
      'equilibrando',
      'caindo',
      'confiante_parado',
      'investigando',
    ];
    const expressions: StoryboardScene['bugiExpression'][] = [
      'confiante',
      'surpreso',
      'panico_divertido',
      'deslumbrado',
      'curioso',
      'determinado',
    ];

    return {
      id: `scene-${episodeId}-${idx + 1}`,
      order: idx + 1,
      scriptSegmentId: seg.id,
      correspondingText: seg.sentenceText,
      approxDurationSec: dur,
      startTimeSec: start,
      endTimeSec: end,
      timeCalculationMode: 'estimado_roteiro',
      charactersPresent: ['Bugi'],
      scenario: idx % 2 === 0 ? 'Calçada Urbana Brasileira' : 'Laboratório do Bugi',
      scenarioPreset: idx % 2 === 0 ? 'calcada_urbana' : 'laboratorio_bugi',
      mainAction: seg.visualPlanning,
      bugiPose: poses[idx % poses.length],
      bugiExpression: expressions[idx % expressions.length],
      cameraMovement: idx === 0 ? 'Zoom in rápido (Punch-in 1.15x)' : 'Pan horizontal acompanhando Bugi',
      animations: [
        'Rig 2D do Bugi com squash & stretch suave',
        'Partículas e vetores ciano (#39C8D5) indicando a física alterada',
      ],
      subtitlesText: seg.sentenceText,
      soundEffects: ['SFX Whoosh Transição', 'SFX Cartoon Slip / Impacto'],
      transitionInstruction: idx < script.segments.length - 1 ? 'Whip pan 6 frames' : 'Freeze frame + selo final',
      scientificObservations: seg.scientificNote || 'Preservar proporções e inércia nas curvas do Remotion.',
    };
  });
}

export function recalculateSceneTimings(scenes: StoryboardScene[]): StoryboardScene[] {
  const sorted = [...scenes].sort((a, b) => a.order - b.order);
  let currentStart = 0;

  return sorted.map((scene, index) => {
    const effectiveDuration =
      scene.timeCalculationMode === 'calculado_audio_real' &&
      scene.definitiveDurationSec &&
      scene.definitiveDurationSec > 0
        ? scene.definitiveDurationSec
        : Math.max(1, scene.approxDurationSec);

    const startTimeSec = Number(currentStart.toFixed(2));
    const endTimeSec = Number((currentStart + effectiveDuration).toFixed(2));
    currentStart = endTimeSec;

    return {
      ...scene,
      order: index + 1,
      startTimeSec,
      endTimeSec,
    };
  });
}

export function reorderScenes(
  scenes: StoryboardScene[],
  fromIndex: number,
  toIndex: number
): StoryboardScene[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= scenes.length ||
    toIndex >= scenes.length
  ) {
    return recalculateSceneTimings(scenes);
  }
  const clone = [...scenes].sort((a, b) => a.order - b.order);
  const [moved] = clone.splice(fromIndex, 1);
  clone.splice(toIndex, 0, moved);
  const reindexed = clone.map((s, idx) => ({ ...s, order: idx + 1 }));
  return recalculateSceneTimings(reindexed);
}

export function duplicateScene(
  scenes: StoryboardScene[],
  sceneId: string
): StoryboardScene[] {
  const sorted = [...scenes].sort((a, b) => a.order - b.order);
  const targetIdx = sorted.findIndex((s) => s.id === sceneId);
  if (targetIdx === -1) return sorted;

  const original = sorted[targetIdx];
  const copy: StoryboardScene = {
    ...original,
    id: `${original.id}-copy-${Date.now().toString(36).slice(-4)}`,
    correspondingText: `${original.correspondingText} (Variação)`,
    animations: [...original.animations],
    soundEffects: [...original.soundEffects],
    charactersPresent: [...original.charactersPresent],
  };

  sorted.splice(targetIdx + 1, 0, copy);
  const reindexed = sorted.map((s, idx) => ({ ...s, order: idx + 1 }));
  return recalculateSceneTimings(reindexed);
}

export function deleteScene(
  scenes: StoryboardScene[],
  sceneId: string
): StoryboardScene[] {
  if (scenes.length <= 1) {
    throw new Error('O storyboard precisa manter pelo menos 1 cena ativa.');
  }
  const filtered = scenes
    .filter((s) => s.id !== sceneId)
    .sort((a, b) => a.order - b.order)
    .map((s, idx) => ({ ...s, order: idx + 1 }));
  return recalculateSceneTimings(filtered);
}

export function calibrateScenesWithRealAudio(
  scenes: StoryboardScene[],
  realAudioDurationSec: number
): {
  scenes: StoryboardScene[];
  markers: TemporalMarker[];
} {
  if (realAudioDurationSec <= 0 || Number.isNaN(realAudioDurationSec)) {
    throw new Error('A duração do áudio deve ser um número positivo em segundos.');
  }

  const sorted = [...scenes].sort((a, b) => a.order - b.order);
  const totalWordWeight = sorted.reduce((acc, s) => {
    const words = s.correspondingText.trim().split(/\s+/).filter(Boolean).length;
    return acc + Math.max(3, words);
  }, 0);

  let cursor = 0;
  const calibratedScenes: StoryboardScene[] = [];
  const markers: TemporalMarker[] = [];

  sorted.forEach((scene, index) => {
    const words = Math.max(
      3,
      scene.correspondingText.trim().split(/\s+/).filter(Boolean).length
    );
    const isLast = index === sorted.length - 1;
    const rawDuration = (words / totalWordWeight) * realAudioDurationSec;
    const definitiveDurationSec = isLast
      ? Number(Math.max(0.5, realAudioDurationSec - cursor).toFixed(2))
      : Number(Math.max(0.5, rawDuration).toFixed(2));

    const startTimeSec = Number(cursor.toFixed(2));
    const endTimeSec = isLast
      ? Number(realAudioDurationSec.toFixed(2))
      : Number((cursor + definitiveDurationSec).toFixed(2));
    cursor = endTimeSec;

    calibratedScenes.push({
      ...scene,
      order: index + 1,
      definitiveDurationSec,
      startTimeSec,
      endTimeSec,
      timeCalculationMode: 'calculado_audio_real',
    });

    markers.push({
      id: `tm-${scene.id}`,
      segmentId: scene.scriptSegmentId || scene.id,
      label: `Cena ${index + 1}`,
      startSec: startTimeSec,
      endSec: endTimeSec,
      text: scene.correspondingText,
      alignmentSource: 'estimated_from_duration',
    });
  });

  return { scenes: calibratedScenes, markers };
}

export function validateStoryboardTimings(scenes: StoryboardScene[]): {
  valid: boolean;
  totalDurationSec: number;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!scenes || scenes.length === 0) {
    return {
      valid: false,
      totalDurationSec: 0,
      errors: ['O storyboard não possui cenas cadastradas.'],
      warnings,
    };
  }

  let expectedStart = 0;
  scenes.forEach((scene, idx) => {
    const duration = Number((scene.endTimeSec - scene.startTimeSec).toFixed(2));
    if (duration <= 0) {
      errors.push(`Cena ${idx + 1} (${scene.id}) possui duração inválida (${duration}s).`);
    }
    if (Math.abs(scene.startTimeSec - expectedStart) > 0.05) {
      errors.push(
        `Cena ${idx + 1} inicia em ${scene.startTimeSec}s, mas deveria iniciar em ${expectedStart}s.`
      );
    }
    if (!scene.charactersPresent.includes('Bugi')) {
      warnings.push(`Cena ${idx + 1} não lista explicitamente o personagem fixo Bugi.`);
    }
    expectedStart = scene.endTimeSec;
  });

  const totalDurationSec = Number(expectedStart.toFixed(2));
  if (totalDurationSec < 35 || totalDurationSec > 55) {
    warnings.push(
      `Duração total (${totalDurationSec}s) está fora da janela ideal de Shorts (35s a 55s).`
    );
  }

  return {
    valid: errors.length === 0,
    totalDurationSec,
    errors,
    warnings,
  };
}

export function transitionEpisodeStage(
  episode: Episode,
  targetStage: EpisodeStage,
  reason = 'Atualização manual de etapa no fluxo do estúdio'
): Episode {
  if (!EPISODE_STAGES.includes(targetStage)) {
    throw new Error(`Etapa inválida: ${targetStage}`);
  }
  if (targetStage === 'Concluido' && !episode.hasRealRenderedMp4) {
    throw new Error(
      'Não é permitido marcar como "Concluído" sem um arquivo MP4 real renderizado pelo Codex/Remotion.'
    );
  }

  const now = new Date().toISOString();
  return {
    ...episode,
    stage: targetStage,
    updatedAt: now,
    history: [
      {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        fromStage: episode.stage,
        toStage: targetStage,
        actionSummary: `${reason} (Arquivos aprovados preservados)`,
      },
      ...episode.history,
    ],
  };
}

export function buildCodexExportPackage(
  episode: Episode,
  allAssets: StudioAsset[]
): CodexCompleteExportPackage {
  const activeScript =
    episode.scriptVersions.find((v) => v.id === episode.activeScriptVersionId) ||
    episode.scriptVersions[0];

  if (!activeScript) {
    throw new Error('O episódio não possui uma versão de roteiro ativa para exportar.');
  }

  const normalizedScenes = recalculateSceneTimings(episode.scenes);
  const timingValidation = validateStoryboardTimings(normalizedScenes);
  if (!timingValidation.valid) {
    throw new Error(
      `Falha na validação de tempos do storyboard: ${timingValidation.errors.join('; ')}`
    );
  }

  const activeNarration: NarrationTrack | undefined = episode.narrationTracks.find(
    (n) => n.id === episode.activeNarrationId
  ) || episode.narrationTracks[0];

  const fps = 30;
  const totalDurationSec = timingValidation.totalDurationSec;
  const totalFrames = Math.max(30, Math.round(totalDurationSec * fps));
  const exportedAt = new Date().toISOString();

  const selectedHookObj =
    activeScript.hookProposals.find((h) => h.selected) || activeScript.hookProposals[0];

  const episodeAssets = allAssets.filter(
    (a) => episode.assetIds.includes(a.id) || a.preservesBugiIdentity
  );

  const timingSource = normalizedScenes.some(
    (s) => s.timeCalculationMode === 'calculado_audio_real'
  )
    ? 'calculado_audio_real'
    : 'estimado_roteiro';

  const episodeJson: CodexCompleteExportPackage['episode.json'] = {
    schemaVersion: '1.0.0',
    studio: 'E Se Bugasse? Studio',
    channelSlogan: 'Muda uma regra. Começa o caos.',
    exportedAt,
    episode: {
      id: episode.id,
      title: episode.title,
      hypothesis: episode.hypothesis,
      stage: episode.stage,
      totalDurationSec,
      timingSource,
      hasRealRenderedMp4: Boolean(episode.hasRealRenderedMp4),
    },
    characterCanonicalSpec: BUGI_CANONICAL_PROFILE,
    scientificReferences: episode.verifiedReferences,
  };

  const scriptJson: CodexCompleteExportPackage['script.json'] = {
    schemaVersion: '1.0.0',
    episodeId: episode.id,
    scriptVersionId: activeScript.id,
    versionNumber: activeScript.versionNumber,
    status: activeScript.status,
    selectedTitle: activeScript.selectedTitle || episode.title,
    alternativeTitles: activeScript.alternativeTitles,
    selectedHook: selectedHookObj ? selectedHookObj.hookText : episode.title,
    allHookProposals: activeScript.hookProposals,
    segments: activeScript.segments,
    scientificNotes: activeScript.scientificNotes,
  };

  const storyboardJson: CodexCompleteExportPackage['storyboard.json'] = {
    schemaVersion: '1.0.0',
    episodeId: episode.id,
    totalDurationSec,
    fps: 30,
    totalFrames,
    scenes: normalizedScenes.map((scene) => {
      const startFrame = Math.round(scene.startTimeSec * fps);
      const endFrame = Math.round(scene.endTimeSec * fps);
      return {
        ...scene,
        startFrame,
        endFrame,
        durationFrames: Math.max(1, endFrame - startFrame),
      };
    }),
  };

  const renderConfigJson: CodexCompleteExportPackage['render-config.json'] = {
    schemaVersion: '1.0.0',
    engine: 'Remotion',
    compositionId: 'ESeBugasseShort',
    width: 1080,
    height: 1920,
    fps: 30,
    codec: 'h264',
    container: 'mp4',
    pixelFormat: 'yuv420p',
    audioBitrate: '192k',
    synchronizedNarrationFile: activeNarration ? `audio/narration-${episode.id}.wav` : null,
    editableProject: true,
    renderStatus: episode.hasRealRenderedMp4
      ? 'mp4_verificado'
      : 'aguardando_render_local_codex',
  };

  const animationInstructionsJson: CodexCompleteExportPackage['animation-instructions.json'] =
    {
      schemaVersion: '1.0.0',
      episodeId: episode.id,
      characterRig: 'BugiCanonical2DSvgRig',
      preserveFixedAppearance: true,
      sceneDirectives: storyboardJson.scenes.map((s) => ({
        sceneId: s.id,
        startFrame: s.startFrame,
        endFrame: s.endFrame,
        bugiPose: s.bugiPose,
        bugiExpression: s.bugiExpression,
        scenarioPreset: s.scenarioPreset,
        cameraMovement: s.cameraMovement,
        springConfig: { damping: 14, stiffness: 120, mass: 0.9 },
        layerAnimations: s.animations,
        transitionOut: s.transitionInstruction,
      })),
    };

  const subtitlesInstructionsJson: CodexCompleteExportPackage['subtitles-instructions.json'] =
    {
      schemaVersion: '1.0.0',
      episodeId: episode.id,
      style: {
        fontFamily: 'Bricolage Grotesque',
        fontSizePx: 68,
        primaryColor: '#FFF7E9',
        highlightColor: '#FFD166',
        accentColor: '#39C8D5',
        strokeColor: '#08121B',
        strokeWidthPx: 8,
        safeZoneBottomPx: 380,
      },
      cues: storyboardJson.scenes.map((s) => ({
        sceneId: s.id,
        startSec: s.startTimeSec,
        endSec: s.endTimeSec,
        startFrame: s.startFrame,
        endFrame: s.endFrame,
        text: s.subtitlesText,
        alignmentSource: activeNarration?.alignmentType || 'estimated_from_duration',
      })),
    };

  const readmeCodex = `# Pacote de Produção Codex & Remotion — ${episode.title}

- **Estúdio**: E Se Bugasse? Studio
- **Slogan**: Muda uma regra. Começa o caos.
- **ID do Episódio**: \`${episode.id}\`
- **Resolução**: 1080 × 1920 (9:16 Vertical Shorts/Reels/TikTok)
- **Taxa de Quadros**: 30 FPS (\`${totalFrames}\` frames totais / \`${totalDurationSec}s\`)
- **Codec**: MP4 H.264 (\`yuv420p\`)
- **Status do Render MP4**: ${
    episode.hasRealRenderedMp4
      ? 'MP4 Real Verificado'
      : 'Aguardando renderização local pelo Codex + Remotion no Windows'
  }

## Como Renderizar Localmente no Windows (Codex + Remotion)

1. Extraia este pacote na pasta \`packages/remotion-studio/episodes/${episode.id}/\`
2. Verifique se o rig canônico \`assets/bugi-canonical-rig.svg\` está presente.
3. Execute o comando local do Remotion:
   \`\`\`powershell
   npx remotion render src/index.ts ESeBugasseShort out/${episode.id}.mp4 --props=./episode.json --codec=h264
   \`\`\`
`;

  return {
    'episode.json': episodeJson,
    'script.json': scriptJson,
    'storyboard.json': storyboardJson,
    'render-config.json': renderConfigJson,
    'animation-instructions.json': animationInstructionsJson,
    'subtitles-instructions.json': subtitlesInstructionsJson,
    'assets-manifest.json': {
      characterRigSvgFile: 'assets/bugi-canonical-rig.svg',
      narrationAudioFile: activeNarration ? `audio/narration-${episode.id}.wav` : null,
      assets: episodeAssets.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        version: a.version,
        license: a.license,
        origin: a.origin,
        fileFormat: a.fileFormat,
        preservesBugiIdentity: a.preservesBugiIdentity,
      })),
    },
    'README-CODEX.md': readmeCodex,
  };
}

export function validateCodexExportPackage(pkg: CodexCompleteExportPackage): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (pkg['render-config.json'].width !== 1080) {
    errors.push('Largura de render-config.json deve ser 1080px.');
  }
  if (pkg['render-config.json'].height !== 1920) {
    errors.push('Altura de render-config.json deve ser 1920px.');
  }
  if (pkg['render-config.json'].fps !== 30) {
    errors.push('FPS de render-config.json deve ser 30.');
  }
  if (pkg['render-config.json'].codec !== 'h264') {
    errors.push('Codec de render-config.json deve ser h264.');
  }
  if (pkg['episode.json'].characterCanonicalSpec.name !== 'Bugi') {
    errors.push('A identidade canônica do personagem deve ser Bugi.');
  }
  if (!pkg['animation-instructions.json'].preserveFixedAppearance) {
    errors.push('preserveFixedAppearance deve ser obrigatoriamente true.');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function estimateAICallCost(
  category: AIModelCategory,
  modelId: string,
  inputChars = 1500
): {
  estimatedCostUsd: number;
  requiresPaidKey: boolean;
  warningMessage?: string;
} {
  const paidModels = [
    'gemini-4-argon',
    'gemini-3-pro-image',
    'gemini-nano-banana-2.1',
    'gemini-3.1-flash-lite-image',
    'gemini-omni-1.1-flash',
  ];
  const requiresPaidKey = paidModels.includes(modelId);

  const baseRatesUsd: Record<string, number> = {
    'gemini-3.8-flash': 0.0012,
    'gemini-3.1-flash-lite': 0.0005,
    'gemini-4-argon': 0.014,
    'gemini-3.8-flash-tts': 0.0045,
    'gemini-3.8-flash-lite-tts': 0.0018,
    'gemini-3.1-flash-lite-image': 0.018,
    'gemini-nano-banana-2.1': 0.035,
    'gemini-3-pro-image': 0.04,
    'gemini-omni-1.1-flash': 0.12,
  };

  const base = baseRatesUsd[modelId] ?? 0.002;
  const scale = Math.max(1, inputChars / 1200);
  const estimatedCostUsd = Number((base * scale).toFixed(4));

  return {
    estimatedCostUsd,
    requiresPaidKey,
    warningMessage:
      category === 'video_opcional' || estimatedCostUsd >= 0.02
        ? 'Operação com custo estimado elevado. Confirme antes de executar.'
        : undefined,
  };
}

export function canUserAccessEpisode(
  episode: Pick<Episode, 'ownerId'>,
  currentUserId: string | null | undefined
): boolean {
  if (!currentUserId) return false;
  return episode.ownerId === currentUserId || episode.ownerId === 'local-studio-owner';
}

export function verifyNoClientKeyExposure(bundleSourceSample: string): {
  safe: boolean;
  findings: string[];
} {
  const findings: string[] = [];
  if (bundleSourceSample.includes('process.env.GEMINI_API_KEY')) {
    findings.push('Referência direta a process.env.GEMINI_API_KEY encontrada no cliente.');
  }
  if (/AIza[0-9A-Za-z\-_]{35}/.test(bundleSourceSample)) {
    // Note: Firebase public web apiKey starts with AIza, so we check specifically for GEMINI_API_KEY assignments
    if (/GEMINI_API_KEY\s*[:=]\s*["']AIza/.test(bundleSourceSample)) {
      findings.push('Chave GEMINI_API_KEY hardcoded encontrada no bundle cliente.');
    }
  }
  return {
    safe: findings.length === 0,
    findings,
  };
}

export function sanitizeEpisodeForFirestore(episode: Episode, ownerId: string): {
  id: string;
  ownerId: string;
  title: string;
  hypothesis: string;
  stage: EpisodeStage;
  payloadJson: string;
  updatedAtIso: string;
} {
  // Never store large base64 audio or video inside Firestore documents (1MB limit)
  const lightweightEpisode: Episode = {
    ...episode,
    ownerId,
    title: episode.title.slice(0, 200),
    hypothesis: episode.hypothesis.slice(0, 500),
    renderedMp4Url: undefined,
    narrationTracks: episode.narrationTracks.map((track) => ({
      ...track,
      // Strip inline base64 audio from Firestore document payload
      audioDataUrl:
        track.audioDataUrl && track.audioDataUrl.startsWith('data:')
          ? undefined
          : track.audioDataUrl,
    })),
  };

  const payloadJson = JSON.stringify(lightweightEpisode).slice(0, 440000);
  return {
    id: episode.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128),
    ownerId: ownerId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128),
    title: lightweightEpisode.title,
    hypothesis: lightweightEpisode.hypothesis,
    stage: lightweightEpisode.stage,
    payloadJson,
    updatedAtIso: new Date().toISOString(),
  };
}
