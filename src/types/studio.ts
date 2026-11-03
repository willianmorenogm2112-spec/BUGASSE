/**
 * Schemas TypeScript oficiais — E Se Bugasse? Studio
 * Cobre episódios, pesquisa fundamentada, roteiros versionados, narração PT-BR,
 * storyboard 2D do Bugi, SceneGeometryEngine, Remotion, Skill Reel, HyperFrames,
 * folha de quadros de QA e pacotes de exportação para Codex e Remotion.
 */

export type EpisodeStage =
  | 'Ideia'
  | 'Pesquisa'
  | 'Roteiro'
  | 'Revisao'
  | 'Narracao'
  | 'Storyboard'
  | 'Pronto para Codex'
  | 'Renderizando'
  | 'Revisao final'
  | 'Concluido';

export const EPISODE_STAGES: EpisodeStage[] = [
  'Ideia',
  'Pesquisa',
  'Roteiro',
  'Revisao',
  'Narracao',
  'Storyboard',
  'Pronto para Codex',
  'Renderizando',
  'Revisao final',
  'Concluido',
];

/**
 * Estados individuais de produção automática por cena (Seção 10)
 */
export type SceneProductionStatus =
  | 'Aguardando assets'
  | 'Gerando fundo'
  | 'Separando camadas'
  | 'Preparando animação'
  | 'Prévia pronta'
  | 'Aprovada'
  | 'Renderizando'
  | 'Concluída'
  | 'Erro';

export const SCENE_PRODUCTION_STATUSES: SceneProductionStatus[] = [
  'Aguardando assets',
  'Gerando fundo',
  'Separando camadas',
  'Preparando animação',
  'Prévia pronta',
  'Aprovada',
  'Renderizando',
  'Concluída',
  'Erro',
];

/**
 * Máquina de estados de animação do Bugi (Seção 3 — Reconstrução da Qualidade Visual)
 */
export type BugiAnimationState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'anticipation'
  | 'surprise'
  | 'panic'
  | 'sliding'
  | 'grabbing_stretch'
  | 'falling'
  | 'impact'
  | 'recovery'
  | 'celebrating';

/**
 * Poses e movimentos articulados do Bugi (cobre os movimentos físicos obrigatórios + esticamento elástico em objeto fixo)
 */
export type BugiPose =
  | 'caminhando'
  | 'correndo'
  | 'pulando'
  | 'caindo'
  | 'escorregando'
  | 'agarrando_objeto'
  | 'olhando_objeto'
  | 'assustando'
  | 'comemorando'
  | 'equilibrando'
  | 'apontando'
  | 'agachando'
  | 'reagindo_impacto'
  | 'flutuando'
  | 'investigando'
  | 'confiante_parado';

export type BugiExpression =
  | 'confiante'
  | 'curioso'
  | 'surpreso'
  | 'panico_divertido'
  | 'desespero'
  | 'comico'
  | 'deslumbrado'
  | 'determinado';

export type ScenarioPreset =
  | 'calcada_urbana'
  | 'laboratorio_bugi'
  | 'parque_gravidade'
  | 'cozinha_caos'
  | 'cruzamento_transito';

/**
 * Estrutura de Direção por Beats Narrativos (Seção 5)
 * Controla simultaneamente personagem, cenário, câmera, texto, efeitos e física.
 */
export interface AnimationBeat {
  id: string;
  beatIndex: number;
  startFrame: number;
  endFrame: number;
  startTimeSec: number;
  endTimeSec: number;
  narrationText: string;
  action: string;
  anticipation: {
    enabled: boolean;
    frames: number;
    crouchPx: number;
    leanAngleDeg: number;
  };
  characterState: BugiAnimationState;
  characterPose: BugiPose;
  facialExpression: BugiExpression;
  camera: {
    mode: 'static' | 'tracking_pan' | 'dramatic_push' | 'impact_shake' | 'payoff_reframe';
    panXStart: number;
    panXEnd: number;
    panYStart: number;
    panYEnd: number;
    zoomStart: number;
    zoomEnd: number;
    dutchAngleDeg: number;
  };
  backgroundAnimation: {
    parallaxSpeed: number;
    groundGlossIntensity: number;
    propMotion: 'none' | 'sliding_props' | 'floating_props' | 'impact_vibration';
  };
  soundEffect: {
    type: 'footsteps' | 'slip_whoosh' | 'cartoon_skid' | 'body_thud' | 'boing_recovery' | 'chime_payoff';
    label: string;
    triggerFrameOffset: number;
    gainDb: number;
  };
  caption: {
    text: string;
    highlightWords: string[];
  };
  transition: 'cut' | 'whip_pan' | 'elastic_wipe' | 'match_action';
  physicsParameters: {
    frictionMu: number;
    gravityMps2: number;
    velocityPxPerSec: number;
    centerOfMassOffsetPx: number;
  };
}

export interface BugiCanonicalProfile {
  name: 'Bugi';
  hair: string;
  eyes: string;
  jacket: string;
  shirt: string;
  pants: string;
  sneakers: string;
  outlineStyle: string;
  personality: string;
  speaks: false;
  palette: {
    hairCoral: '#FF6B50';
    jacketPetrol: '#122638';
    trimCyan: '#39C8D5';
    shirtCream: '#FFF7E9';
    pantsDark: '#0A1520';
    sneakersLight: '#FFF7E9';
    eyesBlack: '#09131C';
  };
}

export interface VerifiedReferenceLink {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  consultedAt: string;
  isGroundedBySearch: boolean;
  verifiedSummary: string;
}

export interface ResearchIdea {
  id: string;
  provisionalTitle: string;
  suggestedHook: string;
  scientificSummary: string;
  verifiedFacts: string[];
  /** Avaliações estimadas (claramente diferenciadas dos fatos verificados) */
  estimatedVisualPotential: 'Baixo' | 'Médio' | 'Alto' | 'Altíssimo';
  estimatedAnimationComplexity: 'Baixa' | 'Média' | 'Alta';
  estimatedAudienceAppealNote: string;
  scientificRisks: string[];
  references: VerifiedReferenceLink[];
  createdAt: string;
  approvedForEpisodeId?: string;
  status: 'aguardando_aprovacao' | 'aprovada' | 'arquivada';
}

export interface ScriptSegment {
  id: string;
  order: number;
  sentenceText: string;
  speakingDirection: string;
  visualPlanning: string;
  estimatedDurationSec: number;
  scientificNote?: string;
}

export interface ScriptHookProposal {
  id: string;
  label: string;
  hookText: string;
  firstSecondVisual: string;
  selected: boolean;
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  authorNote: string;
  status: 'rascunho' | 'em_revisao' | 'aprovado' | 'rejeitado';
  targetDurationRangeSec: [number, number];
  alternativeTitles: string[];
  selectedTitle: string;
  hookProposals: ScriptHookProposal[];
  segments: ScriptSegment[];
  scientificNotes: string[];
  references: VerifiedReferenceLink[];
}

export interface WordTimestampCue {
  word: string;
  startSec: number;
  endSec: number;
  isKeyword: boolean;
  highlightColor?: '#39C8D5' | '#FFD166';
}

export interface TemporalMarker {
  id: string;
  segmentId: string;
  label: string;
  startSec: number;
  endSec: number;
  text: string;
  alignmentSource: 'estimated_from_duration' | 'word_aligned';
  wordCues?: WordTimestampCue[];
}

export interface NarrationTrack {
  id: string;
  scriptVersionId: string;
  createdAt: string;
  model: string;
  voice: 'Puck' | 'Kore' | 'Charon' | 'Fenrir' | 'Zephyr';
  interpretationStyle: string;
  pace: 'Lento' | 'Natural' | 'Dinâmico (Shorts)' | 'Acelerado';
  expressiveness: 'Moderada' | 'Alta' | 'Cinematográfica';
  language: 'pt-BR';
  audioDataUrl?: string;
  mimeType: string;
  durationSec: number;
  isManualUpload: boolean;
  fileName?: string;
  alignmentType: 'estimated_from_duration' | 'word_aligned';
  temporalMarkers: TemporalMarker[];
  wordTimestamps?: WordTimestampCue[];
  measuredLufs?: number;
  normalizedToTargetLufs?: boolean;
  pauseCount?: number;
  approved: boolean;
}

/**
 * Camadas ordenadas do SceneGeometryEngine (Canvas de referência 1080 × 1920)
 */
export type SceneLayerName =
  | 'Fundo distante'
  | 'Cenário intermediário'
  | 'Elementos próximos'
  | 'Superfície do chão'
  | 'Objetos interativos'
  | 'Personagem Bugi'
  | 'Partículas e efeitos'
  | 'Legendas';

export type ObjectInteractionType =
  | 'estatico'
  | 'deslizante'
  | 'colisivel'
  | 'flutuante'
  | 'personagem_principal'
  | 'hud_safe_zone';

export interface NormalizedPoint2D {
  x: number;
  y: number;
}

export interface SceneBoundingBox {
  /** Coordenadas normalizadas (0..1) em relação a 1080x1920 */
  normX: number;
  normY: number;
  normWidth: number;
  normHeight: number;
  /** Coordenadas lógicas em pixels no canvas 1080x1920 */
  pxX: number;
  pxY: number;
  pxWidth: number;
  pxHeight: number;
}

export interface SceneGeometryObject {
  id: string;
  name: string;
  layer: SceneLayerName;
  assetIdOrUrl: string;
  boundingBox: SceneBoundingBox;
  polygonMask: NormalizedPoint2D[];
  maskSource: 'geometric_alpha_contour' | 'sam2_segmented' | 'simplified_vector_layer';
  depth: number;
  anchorPoint: NormalizedPoint2D;
  originalScale: number;
  scaleLimits: [number, number];
  position: { x: number; y: number };
  rotation: number;
  groundContactPoint: { x: number; y: number };
  proportionToBugi: number;
  interactionType: ObjectInteractionType;
}

export interface SceneGeometrySpec {
  sceneId: string;
  canvasWidth: 1080;
  canvasHeight: 1920;
  groundLinePxY: number;
  safeZoneTopPx: number;
  safeZoneBottomPx: number;
  layersOrder: SceneLayerName[];
  objects: SceneGeometryObject[];
}

export interface HyperFramesOverlayConfig {
  enabled: boolean;
  compositionId: string;
  templateType: 'medidor_fisico' | 'alerta_regra' | 'vetor_inercia' | 'equacao_cinematica';
  headlineText: string;
  formulaText: string;
  durationSec: number;
  transparentBackground: true;
}

export interface StoryboardScene {
  id: string;
  order: number;
  scriptSegmentId?: string;
  correspondingText: string;
  approxDurationSec: number;
  definitiveDurationSec?: number;
  startTimeSec: number;
  endTimeSec: number;
  timeCalculationMode: 'estimado_roteiro' | 'calculado_audio_real';
  charactersPresent: string[];
  scenario: string;
  scenarioPreset: ScenarioPreset;
  mainAction: string;
  bugiPose: BugiPose;
  bugiExpression: BugiExpression;
  cameraMovement: string;
  animations: string[];
  subtitlesText: string;
  soundEffects: string[];
  transitionInstruction: string;
  scientificObservations: string;
  /** Novos campos de Produção Automática + Geometria + HyperFrames + Beats */
  productionStatus?: SceneProductionStatus;
  generatedBackgroundUrl?: string;
  backgroundGenerationSource?: 'gemini_ai' | 'unknown_legacy';
  isolatedObjectUrls?: string[];
  geometry?: SceneGeometrySpec;
  hyperFramesOverlay?: HyperFramesOverlayConfig;
  animationBeats?: AnimationBeat[];
  lastErrorDetails?: string;
}

export interface RenderedVideoVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  episodeId: string;
  mode: 'pilot_12s' | 'pilot_8s' | 'pilot_5s' | 'full_episode' | 'single_scene';
  sceneId?: string;
  engine: 'remotion_webcodecs' | 'server_mp4_muxer';
  url: string;
  fileName: string;
  fileSizeBytes: number;
  durationSec: number;
  width: 1080;
  height: 1920;
  fps: 30;
  codec: 'h264';
  hasAudioTrack: boolean;
  targetLufs: -14;
  qaPassed: boolean;
  notes: string;
}

export interface ContactSheetFrame {
  sceneId: string;
  sceneOrder: number;
  frameNumber: number;
  timestampSec: number;
  characterState?: BugiAnimationState;
  bugiPose: BugiPose;
  bugiExpression: BugiExpression;
  subtitleSample: string;
  cameraMovement: string;
  layerCount: number;
  safeZoneValid: boolean;
  proportionsValid: boolean;
  jointMetrics?: {
    leftKneeAngleDeg: number;
    rightKneeAngleDeg: number;
    leftElbowAngleDeg: number;
    rightElbowAngleDeg: number;
    torsoAngleDeg: number;
    footGroundContactValid: boolean;
  };
}

export interface EpisodeVisualQAReport {
  episodeId: string;
  generatedAt: string;
  overallPassed: boolean;
  checks: {
    bugiRealMovement: boolean;
    proportionsAndPositions: boolean;
    backgroundsAndLayers: boolean;
    narrationSync: boolean;
    subtitlesAndSafeZones: boolean;
    cutsAndTransitions: boolean;
    reactionTiming: boolean;
    soundEffectsPresent: boolean;
    musicDuckingBelowVoice: boolean;
    noFrozenOrDeformedElements: boolean;
    realMp4RenderedAndVerified: boolean;
  };
  pilotApprovalCriteria?: {
    visibleExpressiveArticulation: boolean;
    walkCycleLegsAndArms: boolean;
    balanceLossAnticipationAndReaction: boolean;
    fallOwnKinematicsNotRotation: boolean;
    professionalIllustratedBackground: boolean;
    cameraTracksEvents: boolean;
    soundCharacterNarrationSync: boolean;
    noDeformationOrGroundPenetration: boolean;
    playableMp4WithImageAndSound: boolean;
    contactSheetPoseVariety: boolean;
  };
  visionAnalysisSummary?: string;
  contactSheet: ContactSheetFrame[];
  pilotHalfSecondCaptures?: ContactSheetFrame[];
  issues: string[];
}

export type AssetCategory =
  | 'Personagens SVG'
  | 'Expressoes'
  | 'Poses'
  | 'Cenarios'
  | 'Objetos'
  | 'Referencias visuais'
  | 'Narracoes'
  | 'Trilhas'
  | 'Efeitos sonoros'
  | 'Capas'
  | 'Videos finais';

export interface StudioAsset {
  id: string;
  name: string;
  category: AssetCategory;
  version: string;
  license: string;
  origin: 'Autal / Estúdio' | 'SVG Canônico Bugi' | 'Gerado por IA' | 'Upload Manual';
  createdAt: string;
  fileFormat: string;
  fileSizeBytes: number;
  preservesBugiIdentity: boolean;
  svgContent?: string;
  previewUrl?: string;
  bugiPose?: BugiPose;
  bugiExpression?: BugiExpression;
  scenarioPreset?: ScenarioPreset;
  description: string;
  tags: string[];
}

export type AIModelCategory =
  | 'pesquisa'
  | 'roteiro'
  | 'revisao_cientifica'
  | 'imagens_cenarios'
  | 'narracao'
  | 'video_opcional';

export interface AIModelSlotConfig {
  category: AIModelCategory;
  label: string;
  selectedModel: string;
  availableModels: {
    id: string;
    name: string;
    requiresPaidKey: boolean;
    estimatedCostPerCallUsd: number;
    description: string;
  }[];
  systemPromptOverride?: string;
  requireApprovalAboveUsd: number;
}

export interface AICallCostEntry {
  id: string;
  timestamp: string;
  category: AIModelCategory;
  model: string;
  operationDescription: string;
  episodeId?: string;
  estimatedCostUsd: number;
  recordedCostUsd: number;
  tokensOrUnitsSummary: string;
  status: 'sucesso' | 'falha';
}

export interface StudioErrorLogEntry {
  id: string;
  timestamp: string;
  module: string;
  episodeId?: string;
  message: string;
  technicalDetails?: string;
  resolved: boolean;
}

export interface EpisodeHistoryEntry {
  id: string;
  timestamp: string;
  fromStage: EpisodeStage;
  toStage: EpisodeStage;
  actionSummary: string;
}

export type OrchestratorStepStatus =
  | 'aguardando'
  | 'executando'
  | 'concluída'
  | 'falhou'
  | 'precisa de aprovação';

export type OrchestratorStepId =
  | '01_research'
  | '02_script'
  | '03_storyboard'
  | '04_narration'
  | '05_alignment'
  | '06_backgrounds'
  | '07_layers_masks'
  | '08_bugi_rig_actions'
  | '09_remotion_assembly'
  | '10_sync_audio_sfx_camera'
  | '11_preview_generation'
  | '12_quality_checks'
  | '13_export_mp4'
  | '14_publishing_assets'
  | '15_save_episode';

export interface OrchestratorStepRecord {
  id: OrchestratorStepId;
  stepNumber: number;
  label: string;
  folderTarget: keyof EpisodeLogicalFolders;
  weightPercent: number;
  status: OrchestratorStepStatus;
  attempts: number;
  maxAttempts: 3;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  estimatedCostUsd: number;
  realizedCostUsd: number;
  paidCallCompleted: boolean;
  outputSummary?: string;
  errorMessage?: string;
}

export interface OrchestratorJobState {
  runId: string;
  episodeId: string;
  mode: 'automatico' | 'revisao_roteiro';
  targetDurationMode: 'pilot_12s' | 'pilot_8s' | 'full_35_55s';
  targetDurationSec: number;
  budgetCapUsd: number;
  status: 'ocioso' | 'executando' | 'pausado' | 'aguardando_aprovacao' | 'concluído' | 'falhou' | 'cancelado';
  currentStepId?: OrchestratorStepId;
  completedWeightPercent: number;
  startedAt: string;
  updatedAt: string;
  elapsedSec: number;
  totalEstimatedCostUsd: number;
  totalRealizedCostUsd: number;
  steps: OrchestratorStepRecord[];
  warnings: string[];
  errors: string[];
}

export interface EpisodePublishingPackage {
  thumbnailSvgDataUrl?: string;
  thumbnailPrompt?: string;
  finalTitle: string;
  descriptionText: string;
  hashtags: string[];
  platforms: ('YouTube Shorts' | 'TikTok' | 'Facebook Reels')[];
  createdAt: string;
}

/**
 * Seção 4: Organização dos Dados — 12 Pastas Lógicas por Episódio
 */
export interface EpisodeLogicalFolders {
  research: {
    verifiedCount: number;
    hypothesis: string;
    scientificSummary: string;
    updatedAt: string;
  };
  script: {
    activeVersionId: string;
    versionCount: number;
    hookText: string;
    segmentCount: number;
    approved: boolean;
  };
  narration: {
    activeTrackId?: string;
    audioUrl?: string;
    durationSec: number;
    voice: string;
    model: string;
  };
  storyboard: {
    sceneCount: number;
    totalDurationSec: number;
    scenariosUsed: ScenarioPreset[];
  };
  backgrounds: {
    aiGeneratedCount: number;
    vectorMultiLayerCount: number;
    backgroundUrls: string[];
  };
  characters: {
    canonicalCharacter: 'Bugi';
    articulatedJointsCount: 11;
    statesUsed: BugiAnimationState[];
  };
  animation: {
    beatCount: number;
    deterministicFunctionsUsed: string[];
    fps: 30;
  };
  editing: {
    remotionCompositionId: string;
    hyperFramesEnabled: boolean;
    skillReelCaptionsEnabled: boolean;
  };
  audio: {
    targetLufs: -14;
    duckingDb: -10;
    sfxCount: number;
    wordAligned: boolean;
  };
  renders: {
    hasVerifiedMp4: boolean;
    latestMp4Url?: string;
    versionsCount: number;
  };
  thumbnail: {
    generated: boolean;
    headline: string;
    previewUrl?: string;
  };
  publishing: EpisodePublishingPackage;
}

export type QualityProfileMode = 'rapido' | 'equilibrado' | 'maxima_qualidade';

export interface PhotoCraftOperationRecord {
  id: string;
  timestamp: string;
  episodeId: string;
  sceneId?: string;
  operation: 'processBackground' | 'applyColorPreset' | 'prepareLayers' | 'exportAssets' | 'batch';
  cliCommandExecuted: string;
  inputUrl: string;
  outputUrl: string;
  width: number;
  height: number;
  depthBits: number;
  layersCount: number;
  hasMask: boolean;
  status: 'sucesso' | 'falha' | 'ignorado';
  logs: string[];
  errorMessage?: string;
}

export interface FilmCraftFinishingRecord {
  id: string;
  timestamp: string;
  episodeId: string;
  operation: 'importRender' | 'applyColorGrade' | 'processAudio' | 'exportFinalVideo' | 'validateOutput';
  cliCommandExecuted: string;
  inputMp4Url: string;
  outputMp4Url: string;
  otioTimelineUrl?: string;
  projectFileUrl?: string;
  durationSec: number;
  width: number;
  height: number;
  fps: number;
  videoCodec: string;
  colorSpace: string;
  audioCodec: string;
  audioChannels: number;
  audioSampleRate: number;
  audioGainAppliedDb: number;
  peakAfterDb: number;
  status: 'sucesso' | 'falha' | 'rollback_regressao';
  logs: string[];
  errorMessage?: string;
}

export interface FinishingQualityComparisonReport {
  id: string;
  timestamp: string;
  episodeId: string;
  qualityProfile: QualityProfileMode;
  remotionOriginalUrl: string;
  filmcraftFinishedUrl?: string;
  selectedFinalUrl: string;
  selectedEngine: 'remotion_original' | 'filmcraft_finished';
  regressionDetected: boolean;
  regressionReason?: string;
  checks: {
    sharpnessPreserved: boolean;
    colorConsistency: boolean;
    bugiAppearanceIntact: boolean;
    maskEdgesClean: boolean;
    layersNotDeformed: boolean;
    audioSyncPreserved: boolean;
    subtitlesReadable: boolean;
    durationUnchanged: boolean;
    noBlackOrFrozenFrames: boolean;
    validVideoAndAudioStreams: boolean;
  };
  metrics: {
    beforeSizeBytes: number;
    afterSizeBytes: number;
    beforeDurationSec: number;
    afterDurationSec: number;
    beforeCodec: string;
    afterCodec: string;
    beforeColorSpace: string;
    afterColorSpace: string;
    beforeAudioChannels: number;
    afterAudioChannels: number;
    audioGainDbApplied: number;
  };
  summary: string;
}

export interface CreatorDefaultPreferences {
  format: '1080x1920';
  fps: 30;
  character: 'Bugi Oficial';
  style: 'Animação 2D Premium';
  defaultDurationMode: 'pilot_12s' | 'pilot_8s' | 'full_35_55s';
  defaultTargetDurationSec: number;
  defaultProductionMode: 'automatico' | 'revisao_roteiro';
  qualityProfile?: QualityProfileMode;
  budgetCapPerEpisodeUsd: number;
  autoReuseApprovedAssets: boolean;
  enableHyperFramesOverlay: boolean;
  enableSkillReelCaptions: boolean;
}

export interface Episode {
  id: string;
  ownerId: string;
  title: string;
  hypothesis: string;
  slogan: string;
  stage: EpisodeStage;
  createdAt: string;
  updatedAt: string;
  scientificSummary: string;
  verifiedReferences: VerifiedReferenceLink[];
  scriptVersions: ScriptVersion[];
  activeScriptVersionId: string;
  narrationTracks: NarrationTrack[];
  activeNarrationId?: string;
  scenes: StoryboardScene[];
  assetIds: string[];
  exportedToCodexAt?: string;
  exportCount: number;
  hasRealRenderedMp4: boolean;
  renderedMp4Url?: string;
  remotionIntermediateMp4Url?: string;
  filmcraftFinishedMp4Url?: string;
  otioTimelineUrl?: string;
  renderedVersions?: RenderedVideoVersion[];
  qaReport?: EpisodeVisualQAReport;
  qualityProfile?: QualityProfileMode;
  photocraftHistory?: PhotoCraftOperationRecord[];
  filmcraftHistory?: FilmCraftFinishingRecord[];
  finishingComparisonReport?: FinishingQualityComparisonReport;
  orchestratorJob?: OrchestratorJobState;
  logicalFolders?: EpisodeLogicalFolders;
  publishingPackage?: EpisodePublishingPackage;
  history: EpisodeHistoryEntry[];
}

/**
 * ============================================================================
 * SCHEMAS DE EXPORTAÇÃO CODEX & REMOTION (Pacote de Produção Windows)
 * ============================================================================
 */

export interface CodexEpisodeJsonSchema {
  schemaVersion: '1.0.0';
  studio: 'E Se Bugasse? Studio';
  channelSlogan: 'Muda uma regra. Começa o caos.';
  exportedAt: string;
  episode: {
    id: string;
    title: string;
    hypothesis: string;
    stage: EpisodeStage;
    totalDurationSec: number;
    timingSource: 'estimado_roteiro' | 'calculado_audio_real';
    hasRealRenderedMp4: boolean;
  };
  characterCanonicalSpec: BugiCanonicalProfile;
  scientificReferences: VerifiedReferenceLink[];
}

export interface CodexScriptJsonSchema {
  schemaVersion: '1.0.0';
  episodeId: string;
  scriptVersionId: string;
  versionNumber: number;
  status: string;
  selectedTitle: string;
  alternativeTitles: string[];
  selectedHook: string;
  allHookProposals: ScriptHookProposal[];
  segments: ScriptSegment[];
  scientificNotes: string[];
}

export interface CodexStoryboardJsonSchema {
  schemaVersion: '1.0.0';
  episodeId: string;
  totalDurationSec: number;
  fps: 30;
  totalFrames: number;
  scenes: (StoryboardScene & {
    startFrame: number;
    endFrame: number;
    durationFrames: number;
  })[];
}

export interface CodexRenderConfigJsonSchema {
  schemaVersion: '1.0.0';
  engine: 'Remotion';
  compositionId: 'ESeBugasseShort';
  width: 1080;
  height: 1920;
  fps: 30;
  codec: 'h264';
  container: 'mp4';
  pixelFormat: 'yuv420p';
  audioBitrate: '192k';
  synchronizedNarrationFile: string | null;
  editableProject: true;
  renderStatus: 'aguardando_render_local_codex' | 'mp4_verificado';
}

export interface CodexAnimationInstructionsJsonSchema {
  schemaVersion: '1.0.0';
  episodeId: string;
  characterRig: 'BugiCanonical2DSvgRig';
  preserveFixedAppearance: true;
  sceneDirectives: {
    sceneId: string;
    startFrame: number;
    endFrame: number;
    bugiPose: BugiPose;
    bugiExpression: BugiExpression;
    scenarioPreset: ScenarioPreset;
    cameraMovement: string;
    springConfig: { damping: number; stiffness: number; mass: number };
    layerAnimations: string[];
    transitionOut: string;
  }[];
}

export interface CodexSubtitleInstructionsJsonSchema {
  schemaVersion: '1.0.0';
  episodeId: string;
  style: {
    fontFamily: 'Bricolage Grotesque';
    fontSizePx: 68;
    primaryColor: '#FFF7E9';
    highlightColor: '#FFD166';
    accentColor: '#39C8D5';
    strokeColor: '#08121B';
    strokeWidthPx: 8;
    safeZoneBottomPx: 380;
  };
  cues: {
    sceneId: string;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
    text: string;
    alignmentSource: 'estimated_from_duration' | 'word_aligned';
  }[];
}

export interface CodexCompleteExportPackage {
  'episode.json': CodexEpisodeJsonSchema;
  'script.json': CodexScriptJsonSchema;
  'storyboard.json': CodexStoryboardJsonSchema;
  'render-config.json': CodexRenderConfigJsonSchema;
  'animation-instructions.json': CodexAnimationInstructionsJsonSchema;
  'subtitles-instructions.json': CodexSubtitleInstructionsJsonSchema;
  'assets-manifest.json': {
    characterRigSvgFile: string;
    narrationAudioFile: string | null;
    assets: Pick<
      StudioAsset,
      'id' | 'name' | 'category' | 'version' | 'license' | 'origin' | 'fileFormat' | 'preservesBugiIdentity'
    >[];
  };
  'README-CODEX.md': string;
}
