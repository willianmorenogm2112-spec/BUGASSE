/**
 * ProductionOrchestrator (Seção 3) & Organizador das 12 Pastas Lógicas (Seção 4)
 *
 * Responsável por:
 * 1. Pesquisar informações e validar o tema.
 * 2. Gerar roteiro com gancho forte.
 * 3. Preparar storyboard e planejamento das ações.
 * 4. Gerar a narração.
 * 5. Alinhar palavras, frases e duração do áudio.
 * 6. Gerar cenários e objetos com Nano Banana.
 * 7. Criar ou recuperar camadas e máscaras.
 * 8. Aplicar ações específicas ao rig articulado do Bugi.
 * 9. Montar as cenas no Remotion.
 * 10. Sincronizar legendas, música, SFX e câmera.
 * 11. Gerar prévia.
 * 12. Realizar verificações automáticas.
 * 13. Exportar o MP4 final.
 * 14. Gerar capa, título e descrição.
 * 15. Salvar tudo no episódio correspondente.
 */

import {
  CreatorDefaultPreferences,
  Episode,
  EpisodeLogicalFolders,
  EpisodePublishingPackage,
  OrchestratorJobState,
  OrchestratorStepId,
  OrchestratorStepRecord,
} from '../types/studio';
import {
  mapPoseToAnimationState,
  PILOT_12S_FRICTION_BEATS,
  PILOT_8S_FRICTION_BEATS,
} from '../remotion/animation/bugiRigAndBeatsEngine';

export const DEFAULT_CREATOR_PREFERENCES: CreatorDefaultPreferences = {
  format: '1080x1920',
  fps: 30,
  character: 'Bugi Oficial',
  style: 'Animação 2D Premium',
  defaultDurationMode: 'pilot_12s',
  defaultTargetDurationSec: 12,
  defaultProductionMode: 'automatico',
  qualityProfile: 'maxima_qualidade',
  budgetCapPerEpisodeUsd: 0.5,
  autoReuseApprovedAssets: true,
  enableHyperFramesOverlay: true,
  enableSkillReelCaptions: true,
};

export const ORCHESTRATOR_15_STEPS_TEMPLATE: Omit<
  OrchestratorStepRecord,
  'status' | 'attempts' | 'realizedCostUsd' | 'paidCallCompleted'
>[] = [
  {
    id: '01_research',
    stepNumber: 1,
    label: '1. Pesquisar informações e validar o tema',
    folderTarget: 'research',
    weightPercent: 6,
    maxAttempts: 3,
    estimatedCostUsd: 0.002,
  },
  {
    id: '02_script',
    stepNumber: 2,
    label: '2. Gerar roteiro com gancho forte no 1º segundo',
    folderTarget: 'script',
    weightPercent: 8,
    maxAttempts: 3,
    estimatedCostUsd: 0.0025,
  },
  {
    id: '03_storyboard',
    stepNumber: 3,
    label: '3. Preparar storyboard e planejamento de AnimationBeats',
    folderTarget: 'storyboard',
    weightPercent: 7,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '04_narration',
    stepNumber: 4,
    label: '4. Gerar narração PT-BR (Gemini TTS)',
    folderTarget: 'narration',
    weightPercent: 9,
    maxAttempts: 3,
    estimatedCostUsd: 0.004,
  },
  {
    id: '05_alignment',
    stepNumber: 5,
    label: '5. Alinhar palavras, frases e duração do áudio (-14 LUFS)',
    folderTarget: 'audio',
    weightPercent: 6,
    maxAttempts: 3,
    estimatedCostUsd: 0.0015,
  },
  {
    id: '06_backgrounds',
    stepNumber: 6,
    label: '6. Gerar fundos (Nano Banana) + Pós-processamento PhotoCraft CLI',
    folderTarget: 'backgrounds',
    weightPercent: 9,
    maxAttempts: 3,
    estimatedCostUsd: 0.015,
  },
  {
    id: '07_layers_masks',
    stepNumber: 7,
    label: '7. Preparar camadas, transparências e máscaras (PhotoCraft + SceneGeometryEngine)',
    folderTarget: 'backgrounds',
    weightPercent: 6,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '08_bugi_rig_actions',
    stepNumber: 8,
    label: '8. Aplicar ações específicas ao rig multi-articulado do Bugi',
    folderTarget: 'characters',
    weightPercent: 7,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '09_remotion_assembly',
    stepNumber: 9,
    label: '9. Montar as cenas e beats na composição Remotion',
    folderTarget: 'animation',
    weightPercent: 7,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '10_sync_audio_sfx_camera',
    stepNumber: 10,
    label: '10. Sincronizar legendas, música, SFX e cameraTracking',
    folderTarget: 'editing',
    weightPercent: 6,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '11_preview_generation',
    stepNumber: 11,
    label: '11. Gerar prévia interativa com áudio e folha de quadros 0,5s',
    folderTarget: 'editing',
    weightPercent: 5,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '12_quality_checks',
    stepNumber: 12,
    label: '12. Realizar verificações automáticas de qualidade (10 critérios)',
    folderTarget: 'renders',
    weightPercent: 6,
    maxAttempts: 3,
    estimatedCostUsd: 0.001,
  },
  {
    id: '13_export_mp4',
    stepNumber: 13,
    label: '13. Render Remotion + Finalização FilmCraft CLI + Comparação Antes/Depois',
    folderTarget: 'renders',
    weightPercent: 10,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '14_publishing_assets',
    stepNumber: 14,
    label: '14. Gerar capa (Thumbnail SVG), título e descrição',
    folderTarget: 'thumbnail',
    weightPercent: 4,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
  {
    id: '15_save_episode',
    stepNumber: 15,
    label: '15. Salvar pacote completo nas 12 pastas do episódio',
    folderTarget: 'publishing',
    weightPercent: 4,
    maxAttempts: 3,
    estimatedCostUsd: 0.0,
  },
];

/**
 * Calcula o percentual real baseado exclusivamente no peso das etapas concluídas (sem porcentagens fictícias)
 */
export function computeOrchestratorRealProgressPercent(
  steps: OrchestratorStepRecord[]
): number {
  const sum = steps.reduce(
    (acc, st) => (st.status === 'concluída' ? acc + st.weightPercent : acc),
    0
  );
  return Math.max(0, Math.min(100, Math.round(sum)));
}

/**
 * Cria o estado inicial de uma fila persistente do ProductionOrchestrator para um episódio
 */
export function createInitialOrchestratorJob(params: {
  episode: Episode;
  mode: 'automatico' | 'revisao_roteiro';
  targetDurationMode: 'pilot_12s' | 'pilot_8s' | 'full_35_55s';
  targetDurationSec: number;
  budgetCapUsd: number;
  existingJob?: OrchestratorJobState;
}): OrchestratorJobState {
  const {
    episode,
    mode,
    targetDurationMode,
    targetDurationSec,
    budgetCapUsd,
    existingJob,
  } = params;

  const now = new Date().toISOString();

  // Preserva etapas pagas já concluídas caso esteja retomando um job existente
  const steps: OrchestratorStepRecord[] = ORCHESTRATOR_15_STEPS_TEMPLATE.map(
    (tpl) => {
      const prev = existingJob?.steps.find((s) => s.id === tpl.id);
      if (prev && prev.status === 'concluída' && prev.paidCallCompleted) {
        return { ...prev };
      }
      return {
        ...tpl,
        status: 'aguardando',
        attempts: 0,
        realizedCostUsd: 0,
        paidCallCompleted: false,
      };
    }
  );

  const totalEstimatedCostUsd = Number(
    steps.reduce((acc, s) => acc + s.estimatedCostUsd, 0).toFixed(4)
  );
  const totalRealizedCostUsd = Number(
    steps.reduce((acc, s) => acc + s.realizedCostUsd, 0).toFixed(4)
  );

  return {
    runId:
      existingJob?.runId ||
      `run-${episode.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    episodeId: episode.id,
    mode,
    targetDurationMode,
    targetDurationSec,
    budgetCapUsd,
    status: 'ocioso',
    currentStepId: steps.find((s) => s.status !== 'concluída')?.id || '01_research',
    completedWeightPercent: computeOrchestratorRealProgressPercent(steps),
    startedAt: existingJob?.startedAt || now,
    updatedAt: now,
    elapsedSec: existingJob?.elapsedSec || 0,
    totalEstimatedCostUsd,
    totalRealizedCostUsd,
    steps,
    warnings: existingJob?.warnings || [],
    errors: [],
  };
}

/**
 * Gera a Thumbnail oficial em SVG (1080×1920), título otimizado e descrição para Shorts/TikTok/Reels (Etapa 14)
 */
export function generateEpisodePublishingPackage(
  episode: Episode
): EpisodePublishingPackage {
  const cleanTitle = episode.title.trim();
  const shortHook =
    episode.scriptVersions[0]?.hookProposals.find((h) => h.selected)?.hookText ||
    'Muda uma regra. Começa o caos!';

  const svgThumb = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="1080" height="1920">
    <rect width="540" height="960" fill="#091624"/>
    <circle cx="430" cy="180" r="85" fill="#FFD166" opacity="0.22"/>
    <rect y="685" width="540" height="275" fill="#122638"/>
    <line x1="0" y1="685" x2="540" y2="685" stroke="#39C8D5" stroke-width="8"/>
    <rect x="34" y="54" width="472" height="135" rx="22" fill="#122638" stroke="#39C8D5" stroke-width="5"/>
    <text x="270" y="102" text-anchor="middle" fill="#FFD166" font-family="sans-serif" font-weight="800" font-size="24">E SE BUGASSE?</text>
    <text x="270" y="148" text-anchor="middle" fill="#FFF7E9" font-family="sans-serif" font-weight="800" font-size="22">${cleanTitle.slice(0, 34)}</text>
    <g transform="translate(270, 515) rotate(-18)">
      <rect x="-52" y="-44" width="104" height="120" rx="28" fill="#122638" stroke="#060D14" stroke-width="5"/>
      <rect x="-20" y="-42" width="40" height="114" fill="#FFF7E9"/>
      <rect x="-56" y="-164" width="112" height="112" rx="45" fill="#F7D5B8" stroke="#060D14" stroke-width="5"/>
      <path d="M -60 -134 C -82 -176 -44 -188 -32 -168 C -26 -212 10 -208 16 -170 C 34 -206 72 -190 54 -152 C 80 -156 78 -124 56 -118 Z" fill="#FF6B50" stroke="#060D14" stroke-width="5"/>
      <ellipse cx="-20" cy="-108" rx="14" ry="18" fill="#09131C"/>
      <ellipse cx="22" cy="-108" rx="14" ry="18" fill="#09131C"/>
      <ellipse cx="0" cy="-74" rx="12" ry="15" fill="#09131C"/>
    </g>
    <rect x="44" y="760" width="452" height="86" rx="18" fill="#FF6B50"/>
    <text x="270" y="814" text-anchor="middle" fill="#FFF7E9" font-family="sans-serif" font-weight="800" font-size="28">MUDA UMA REGRA. COMEÇA O CAOS.</text>
  </svg>`;

  const thumbnailSvgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
    svgThumb
  )}`;

  return {
    thumbnailSvgDataUrl,
    thumbnailPrompt: `Capa vertical 9:16 cartoon 2D do Bugi surpreso: ${cleanTitle}`,
    finalTitle: `${cleanTitle} #Shorts`,
    descriptionText: `${shortHook}\n\n${episode.scientificSummary}\n\nCanal E Se Bugasse? — Muda uma regra. Começa o caos.`,
    hashtags: [
      '#ESeBugasse',
      '#Bugi',
      '#Fisica',
      '#Curiosidades',
      '#Animacao2D',
      '#Shorts',
    ],
    platforms: ['YouTube Shorts', 'TikTok', 'Facebook Reels'],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Seção 4: Constrói e sincroniza as 12 Pastas Lógicas do Episódio
 * (research, script, narration, storyboard, backgrounds, characters, animation, editing, audio, renders, thumbnail, publishing)
 */
export function buildEpisodeLogicalFolders(
  episode: Episode
): EpisodeLogicalFolders {
  const activeScript =
    episode.scriptVersions.find(
      (sv) => sv.id === episode.activeScriptVersionId
    ) || episode.scriptVersions[0];
  const activeNarration =
    episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
    episode.narrationTracks[0];
  const pub =
    episode.publishingPackage || generateEpisodePublishingPackage(episode);

  const aiGeneratedBgs = episode.scenes
    .map((s) => s.generatedBackgroundUrl)
    .filter((u): u is string => Boolean(u));

  const statesUsed = Array.from(
    new Set(
      episode.scenes.map((s) => mapPoseToAnimationState(s.bugiPose))
    )
  );

  return {
    research: {
      verifiedCount: episode.verifiedReferences?.length || 0,
      hypothesis: episode.hypothesis,
      scientificSummary: episode.scientificSummary,
      updatedAt: episode.updatedAt,
    },
    script: {
      activeVersionId: activeScript?.id || 'sv-1',
      versionCount: episode.scriptVersions.length,
      hookText:
        activeScript?.hookProposals.find((h) => h.selected)?.hookText ||
        activeScript?.segments[0]?.sentenceText ||
        '',
      segmentCount: activeScript?.segments.length || 0,
      approved: activeScript?.status === 'aprovado',
    },
    narration: {
      activeTrackId: activeNarration?.id,
      audioUrl: activeNarration?.audioDataUrl,
      durationSec: activeNarration?.durationSec || 8,
      voice: activeNarration?.voice || 'Puck',
      model: activeNarration?.model || 'gemini-3.8-flash-tts',
    },
    storyboard: {
      sceneCount: episode.scenes.length,
      totalDurationSec:
        episode.scenes[episode.scenes.length - 1]?.endTimeSec || 8,
      scenariosUsed: Array.from(
        new Set(episode.scenes.map((s) => s.scenarioPreset))
      ),
    },
    backgrounds: {
      aiGeneratedCount: aiGeneratedBgs.length,
      vectorMultiLayerCount: episode.scenes.length,
      backgroundUrls: aiGeneratedBgs,
    },
    characters: {
      canonicalCharacter: 'Bugi',
      articulatedJointsCount: 11,
      statesUsed:
        statesUsed.length > 0
          ? statesUsed
          : ['walking', 'surprise', 'sliding', 'grabbing_stretch', 'impact', 'recovery'],
    },
    animation: {
      beatCount: Math.max(
        PILOT_12S_FRICTION_BEATS.length,
        PILOT_8S_FRICTION_BEATS.length,
        episode.scenes.length
      ),
      deterministicFunctionsUsed: [
        'walkCycle',
        'slipReaction',
        'grabAndStretchReaction',
        'bodyImpact',
        'eyeReaction',
        'armFlail',
        'headFollow',
        'cameraTracking',
        'parallaxMotion',
        'objectInteraction',
        'squashAndStretch',
      ],
      fps: 30,
    },
    editing: {
      remotionCompositionId: 'ESeBugasseShort',
      hyperFramesEnabled: true,
      skillReelCaptionsEnabled: true,
    },
    audio: {
      targetLufs: -14,
      duckingDb: -10,
      sfxCount: episode.scenes.reduce(
        (acc, s) => acc + (s.soundEffects?.length || 1),
        0
      ),
      wordAligned: activeNarration?.alignmentType === 'word_aligned',
    },
    renders: {
      hasVerifiedMp4: Boolean(
        episode.hasRealRenderedMp4 && episode.renderedMp4Url
      ),
      latestMp4Url: episode.renderedMp4Url,
      versionsCount: episode.renderedVersions?.length || 0,
    },
    thumbnail: {
      generated: Boolean(pub.thumbnailSvgDataUrl),
      headline: episode.title,
      previewUrl: pub.thumbnailSvgDataUrl,
    },
    publishing: pub,
  };
}
