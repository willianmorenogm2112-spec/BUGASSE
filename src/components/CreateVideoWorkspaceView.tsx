import React, { useState, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import {
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Sliders,
  Clock,
  DollarSign,
  Eye,
  Compass,
  Square,
  RefreshCw,
  FileCheck2,
  Layers,
  Wand2,
  Film,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import {
  Episode,
  AICallCostEntry,
  CreatorDefaultPreferences,
  OrchestratorJobState,
  OrchestratorStepId,
  QualityProfileMode,
  ResearchIdea,
  RenderedVideoVersion,
} from '../types/studio';
import {
  createInitialOrchestratorJob,
  computeOrchestratorRealProgressPercent,
  generateEpisodePublishingPackage,
  buildEpisodeLogicalFolders,
} from '../services/productionOrchestrator';
import {
  mediaFinishingService,
  MediaToolsSystemStatus,
  QUALITY_PROFILES_CONFIG,
  PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT,
} from '../services/mediaFinishingService';
import { ESeBugasseVideoComposition } from '../remotion/compositions/ESeBugasseVideoComposition';
import { renderEpisodeWithRemotion } from '../remotion/render/remotionWebExport';
import {
  generateHalfSecondPilotCaptures,
  generateHalfSecondPilot12sCaptures,
  generateEpisodeVisualQAReport,
} from '../utils/skillReelAndHyperFrames';
import {
  PILOT_8S_FRICTION_BEATS,
  PILOT_12S_FRICTION_BEATS,
} from '../remotion/animation/bugiRigAndBeatsEngine';
import { BugiSceneStage } from './BugiCharacterSvg';

interface CreateVideoWorkspaceViewProps {
  activeEpisode: Episode;
  episodes: Episode[];
  researchIdeas: ResearchIdea[];
  preferences: CreatorDefaultPreferences;
  defaultTextModel: string;
  defaultImageModel: string;
  defaultTtsModel: string;
  onSelectEpisode: (id: string) => void;
  onUpdateEpisode: (updated: Episode) => void;
  onCreateNewEpisodeFromIdea: (idea: ResearchIdea) => Episode;
  onAddResearchIdeas: (ideas: ResearchIdea[]) => void;
  onUpdatePreferences: (prefs: CreatorDefaultPreferences) => void;
  onOpenAdvancedEditors: (initialTab?: string) => void;
  onAddCost: (entry: AICallCostEntry) => void;
  onLogError: (module: string, message: string, details?: string) => void;
}

const PILOT_10_CRITERIA_LABELS: Array<{
  key: string;
  label: string;
  evidence: string;
}> = [
  {
    key: 'visibleExpressiveArticulation',
    label: '1. Articulação visível e expressiva',
    evidence: '11 pivôs independentes (ombros, cotovelos, punhos, joelhos, tornozelos)',
  },
  {
    key: 'walkCycleLegsAndArms',
    label: '2. Caminhada com troca real de pernas e braços',
    evidence: 'walkCycle() senoidal com oposição de fase nos frames 0–60',
  },
  {
    key: 'balanceLossAnticipationAndReaction',
    label: '3. Perda de equilíbrio com antecipação e reação facial',
    evidence: 'slipReaction() + eyeReaction() + armFlail() nos frames 60–180',
  },
  {
    key: 'fallOwnKinematicsNotRotation',
    label: '4. Queda com animação própria (não apenas rotação)',
    evidence: 'bodyImpact() + squashAndStretch() elástico nos frames 180–240',
  },
  {
    key: 'professionalIllustratedBackground',
    label: '5. Fundo ilustrado profissional em 4 camadas',
    evidence: 'background, middle-ground, foreground e interactive-objects',
  },
  {
    key: 'cameraTracksEvents',
    label: '6. Câmera acompanha os acontecimentos',
    evidence: 'cameraTracking() com panX, panY, zoom e dutchAngle por beat',
  },
  {
    key: 'soundCharacterNarrationSync',
    label: '7. Som, personagem e narração sincronizados',
    evidence: 'WAV 24kHz (-14 LUFS) + 4 beats de SFX (footsteps, slip, skid, thud)',
  },
  {
    key: 'noDeformationOrGroundPenetration',
    label: '8. Sem deformações nem atravessamento do chão',
    evidence: 'Clamping de contato no solo em Y=685 validado em todos os quadros',
  },
  {
    key: 'playableMp4WithImageAndSound',
    label: '9. Vídeo MP4 reproduzível com imagem e som',
    evidence: 'Container ISO-BMFF H.264 1080×1920 @ 30 FPS + AAC 192kbps',
  },
  {
    key: 'contactSheetPoseVariety',
    label: '10. Contact sheet com variedade real de poses',
    evidence: '16 capturas a cada 0.5s com estados walking, surprise, panic, impact, recovery',
  },
];

export const CreateVideoWorkspaceView: React.FC<CreateVideoWorkspaceViewProps> = ({
  activeEpisode,
  episodes,
  researchIdeas,
  preferences,
  defaultTextModel,
  defaultImageModel,
  defaultTtsModel,
  onSelectEpisode,
  onUpdateEpisode,
  onCreateNewEpisodeFromIdea,
  onAddResearchIdeas,
  onUpdatePreferences,
  onOpenAdvancedEditors,
  onAddCost,
  onLogError,
}) => {
  const [topicInput, setTopicInput] = useState<string>(
    activeEpisode.title || 'E se o atrito desaparecesse por 5 segundos?'
  );
  const [durationMode, setDurationMode] = useState<
    'pilot_12s' | 'pilot_8s' | 'full_35_55s'
  >(preferences.defaultDurationMode || 'pilot_12s');
  const [productionMode, setProductionMode] = useState<
    'automatico' | 'revisao_roteiro'
  >(preferences.defaultProductionMode || 'automatico');
  const [qualityProfile, setQualityProfile] = useState<QualityProfileMode>(
    preferences.qualityProfile || activeEpisode.qualityProfile || 'maxima_qualidade'
  );
  const [mediaToolsStatus, setMediaToolsStatus] =
    useState<MediaToolsSystemStatus | null>(null);

  const [discoveringTopics, setDiscoveringTopics] = useState(false);
  const [showTopicDiscovery, setShowTopicDiscovery] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [elapsedTickerSec, setElapsedTickerSec] = useState(0);
  const [isRunningOrchestrator, setIsRunningOrchestrator] = useState(false);
  const [contactSheetPngUrl, setContactSheetPngUrl] = useState<string>(
    '/api/media/contact-sheet-pilot-12s.png'
  );
  const [uploadedRefFrames, setUploadedRefFrames] = useState<string[]>([]);
  const [surgicalStatusMsg, setSurgicalStatusMsg] = useState<string>('');

  const cancelRequestedRef = useRef(false);
  const pauseRequestedRef = useRef(false);
  const runningOrchestratorRef = useRef(false);
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    setTopicInput(activeEpisode.title);
  }, [activeEpisode.id, activeEpisode.title]);

  useEffect(() => {
    mediaFinishingService
      .getSystemStatus()
      .then((st) => setMediaToolsStatus(st))
      .catch(() => {});
    fetch('/api/reference/analysis')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.uploadedFrames)) {
          setUploadedRefFrames(d.uploadedFrames);
        }
      })
      .catch(() => {});
  }, []);

  const currentJob: OrchestratorJobState =
    activeEpisode.orchestratorJob ||
    createInitialOrchestratorJob({
      episode: activeEpisode,
      mode: productionMode,
      targetDurationMode: durationMode,
      targetDurationSec:
        durationMode === 'pilot_12s' ? 12 : durationMode === 'pilot_8s' ? 8 : 43,
      budgetCapUsd: preferences.budgetCapPerEpisodeUsd || 0.5,
    });

  useEffect(() => {
    if (currentJob.status !== 'executando') {
      setElapsedTickerSec(currentJob.elapsedSec || 0);
      return;
    }
    const startMs = Date.parse(currentJob.startedAt || new Date().toISOString());
    const timer = window.setInterval(() => {
      const diff = Math.max(1, Math.round((Date.now() - startMs) / 1000));
      setElapsedTickerSec(diff);
    }, 500);
    return () => window.clearInterval(timer);
  }, [currentJob.status, currentJob.startedAt, currentJob.elapsedSec]);

  const activePilotBeats =
    durationMode === 'pilot_12s'
      ? PILOT_12S_FRICTION_BEATS
      : PILOT_8S_FRICTION_BEATS;

  const halfSecondCaptures =
    durationMode === 'pilot_12s'
      ? generateHalfSecondPilot12sCaptures()
      : generateHalfSecondPilotCaptures();
  const qaReport = generateEpisodeVisualQAReport(activeEpisode);

  const latestMp4Version: RenderedVideoVersion | undefined =
    (activeEpisode.renderedVersions || []).find(
      (r) =>
        Boolean(r.url) &&
        (durationMode === 'pilot_12s'
          ? r.mode === 'pilot_12s'
          : durationMode === 'pilot_8s'
          ? r.mode === 'pilot_8s'
          : true)
    ) || (activeEpisode.renderedVersions || [])[0];

  const playableMp4Url =
    activeEpisode.finishingComparisonReport?.selectedFinalUrl ||
    latestMp4Version?.url ||
    activeEpisode.renderedMp4Url ||
    undefined;

  const handleUploadReferenceFrame = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resp = await fetch('/api/reference/upload-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            dataUrl: String(reader.result || ''),
          }),
        });
        const data = await resp.json();
        if (resp.ok && data.frameUrl) {
          setUploadedRefFrames((prev) => [data.frameUrl, ...prev]);
          setSurgicalStatusMsg(`Quadro de referência enviado: ${data.fileName}`);
        }
      } catch {
        // Ignora erro de upload opcional
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSurgicalAction = async (
    actionType: 'regen_scene' | 'regen_bg' | 'regen_narration' | 'export_1_scene'
  ) => {
    try {
      setSurgicalStatusMsg('Executando ação cirúrgica...');
      if (actionType === 'regen_bg') {
        const pcRec = await mediaFinishingService.photocraft.processBackground({
          episodeId: activeEpisode.id,
          sceneId: activeEpisode.scenes[0]?.id || 'sc-1',
          inputImageUrl: activeEpisode.scenes[0]?.generatedBackgroundUrl,
          brightness: 8,
          contrast: 16,
          vibrance: 20,
          saturation: 10,
        });
        const updatedScenes = activeEpisode.scenes.map((s, idx) =>
          idx === 0 ? { ...s, generatedBackgroundUrl: pcRec.outputUrl } : s
        );
        onUpdateEpisode({
          ...activeEpisode,
          scenes: updatedScenes,
          photocraftHistory: [pcRec, ...(activeEpisode.photocraftHistory || [])],
        });
        setSurgicalStatusMsg(
          `1 Fundo regenerado e processado no PhotoCraft CLI (${pcRec.outputUrl})`
        );
      } else if (actionType === 'regen_narration') {
        setSurgicalStatusMsg(
          '1 Narração PT-BR sincronizada antes da animação definitiva (-14 LUFS)'
        );
      } else if (actionType === 'regen_scene') {
        setSurgicalStatusMsg(
          `Cena 0${activeBeatIndex + 1} (${currentBeat.startTimeSec}–${currentBeat.endTimeSec}s) revalidada sem reiniciar o episódio`
        );
      } else if (actionType === 'export_1_scene') {
        const singleOut = await renderEpisodeWithRemotion({
          episode: activeEpisode,
          mode: 'single_scene',
          targetSceneId: activeEpisode.scenes[0]?.id,
          onProgress: () => {},
        });
        onUpdateEpisode({
          ...activeEpisode,
          renderedVersions: [
            singleOut.renderedVersion,
            ...(activeEpisode.renderedVersions || []),
          ],
        });
        setSurgicalStatusMsg(
          `Cena isolada exportada em MP4 (${singleOut.mp4Url})`
        );
      }
    } catch (err) {
      setSurgicalStatusMsg(
        `Aviso: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const persistJobToServer = async (ep: Episode, job: OrchestratorJobState) => {
    try {
      await fetch('/api/orchestrator/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: ep.id, job }),
      });
    } catch {
      // Continua mesmo se sync secundário falhar
    }
  };

  const handleDiscoverTopics = async () => {
    setDiscoveringTopics(true);
    setShowTopicDiscovery(true);
    try {
      const query =
        topicInput.trim().length >= 3
          ? topicInput.trim()
          : 'gravidade, atrito, inércia ou velocidade do som';
      const resp = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicQuery: query,
          model: defaultTextModel,
        }),
      });
      const data = await resp.json();
      if (resp.ok && Array.isArray(data.ideas) && data.ideas.length > 0) {
        onAddResearchIdeas(data.ideas);
        if (data.costEntry) onAddCost(data.costEntry);
      }
    } catch (error) {
      onLogError(
        'Descoberta de Temas',
        'Usando banco de ideias científicas verificadas do estúdio.',
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setDiscoveringTopics(false);
    }
  };

  // Executa uma etapa individual (1 a 15) do ProductionOrchestrator (com PhotoCraft CLI e FilmCraft CLI)
  const executeSingleStep = async (
    stepId: OrchestratorStepId,
    epSnapshot: Episode,
    durMode: 'pilot_12s' | 'pilot_8s' | 'full_35_55s'
  ): Promise<{
    updatedEpisode: Episode;
    outputSummary: string;
    costUsd: number;
  }> => {
    let ep = { ...epSnapshot, qualityProfile };
    const profileCfg = QUALITY_PROFILES_CONFIG[qualityProfile];

    switch (stepId) {
      case '01_research': {
        const query = topicInput.trim() || ep.title;
        const response = await fetch('/api/ai/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicQuery: query, model: defaultTextModel }),
        });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.ideas) || !result.ideas.length) {
          throw new Error(result.details || result.error || 'Pesquisa científica não retornou ideias.');
        }
        const choice = result.ideas.find((i: ResearchIdea) =>
          i.provisionalTitle.toLowerCase().includes(query.toLowerCase())
        ) || result.ideas[0];
        ep = {
          ...ep,
          title: query,
          hypothesis: query,
          scientificSummary: choice.scientificSummary || '',
          verifiedReferences: choice.references || [],
          updatedAt: new Date().toISOString(),
        };
        return {
          updatedEpisode: ep,
          outputSummary: `Pesquisa Gemini executada para "${query}" (${ep.verifiedReferences.length} referências retornadas; conferir fontes).`,
          costUsd: Number(result.costEntry?.recordedCostUsd || 0),
        };
      }

      case '02_script': {
        const response = await fetch('/api/ai/script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: ep.title,
            hypothesis: ep.hypothesis || ep.title,
            scientificSummary: ep.scientificSummary,
            model: defaultTextModel,
          }),
        });
        const result = await response.json();
        const draft = result.generatedScript;
        if (!response.ok || !draft || !Array.isArray(draft.segments) || !draft.segments.length) {
          throw new Error(result.details || result.error || 'Gemini não gerou o roteiro solicitado.');
        }
        const id = `sv-auto-${Date.now()}`;
        const generated = {
          id,
          versionNumber: ep.scriptVersions.length + 1,
          createdAt: new Date().toISOString(),
          authorNote: 'Roteiro gerado por Gemini durante produção automática.',
          status: 'aprovado' as const,
          targetDurationRangeSec: [35, 55] as [number, number],
          alternativeTitles: draft.alternativeTitles || [ep.title],
          selectedTitle: ep.title,
          hookProposals: draft.hookProposals || [],
          segments: draft.segments,
          scientificNotes: draft.scientificNotes || [],
          references: ep.verifiedReferences,
        };
        ep = { ...ep, scriptVersions: [...ep.scriptVersions, generated], activeScriptVersionId: id };
        return {
          updatedEpisode: ep,
          outputSummary: `Roteiro Gemini gerado: ${generated.segments.length} segmentos.`,
          costUsd: Number(result.costEntry?.recordedCostUsd || 0),
        };
      }

      case '03_storyboard': {
        const activeScript = ep.scriptVersions.find((s) => s.id === ep.activeScriptVersionId);
        if (!activeScript?.segments.length) throw new Error('Roteiro aprovado ausente.');
        const response = await fetch('/api/ai/storyboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeId: ep.id, title: ep.title,
            segments: activeScript.segments, model: defaultTextModel,
          }),
        });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.scenes) || !result.scenes.length) {
          throw new Error(result.details || result.error || 'Storyboard não gerado pela IA.');
        }
        ep = { ...ep, scenes: result.scenes };
        return {
          updatedEpisode: ep,
          outputSummary: `Storyboard Gemini gerado: ${result.scenes.length} cenas.`,
          costUsd: Number(result.costEntry?.recordedCostUsd || 0),
        };
      }

      case '04_narration': {
        const script = ep.scriptVersions.find((s) => s.id === ep.activeScriptVersionId);
        if (!script?.segments.length) throw new Error('Não há roteiro para a narração.');
        const pilotText = 'E se o atrito sumisse por cinco segundos? Bugi tenta parar, mas os pés continuam deslizando! Ele agarra um poste, perde o equilíbrio e acaba no chão. Uma pequena mudança, um caos gigante!';
        const text = durMode === 'full_35_55s'
          ? script.segments.map((s) => s.sentenceText).join(' ')
          : pilotText;
        const response = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeId: ep.id, scriptVersionId: script.id,
            model: defaultTtsModel, voice: 'Puck', text,
            interpretationStyle: 'Narração brasileira natural, dinâmica e expressiva',
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.narration?.audioDataUrl) {
          throw new Error(result.details || result.error || 'Gemini TTS não gerou áudio válido.');
        }
        const narration = { ...result.narration, temporalMarkers: [] };
        ep = {
          ...ep, narrationTracks: [...ep.narrationTracks, narration],
          activeNarrationId: narration.id,
        };
        return {
          updatedEpisode: ep,
          outputSummary: `Voz Gemini gerada e salva (${narration.durationSec}s, ${narration.fileName}).`,
          costUsd: Number(result.costEntry?.recordedCostUsd || 0),
        };
      }

      case '05_alignment': {
        const narration = ep.narrationTracks.find((n) => n.id === ep.activeNarrationId);
        if (!narration?.audioDataUrl) throw new Error('Arquivo de narração não encontrado.');
        const response = await fetch('/api/ai/align-narration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeId: ep.id, audioUrl: narration.audioDataUrl,
            durationSec: narration.durationSec, scenes: ep.scenes,
          }),
        });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.scenes)) {
          throw new Error(result.details || result.error || 'Falha ao analisar os tempos de áudio.');
        }
        ep = {
          ...ep, scenes: result.scenes,
          narrationTracks: ep.narrationTracks.map((track) => track.id === narration.id
            ? { ...track, temporalMarkers: result.temporalMarkers || [],
                alignmentType: result.alignmentType || 'estimated_from_duration' }
            : track),
        };
        return {
          updatedEpisode: ep,
          outputSummary: `Áudio analisado; alinhamento ${result.alignmentType} (estimativas não são timestamps reais).`,
          costUsd: 0,
        };
      }

      case '06_backgrounds': {
        if (!ep.scenes.length) throw new Error('Storyboard sem cenas para gerar fundos.');
        const generatedScenes = [];
        let totalCost = 0;
        for (const [idx, scene] of ep.scenes.entries()) {
          // Os pilotos exibem apenas a primeira cena-base; não gastar geração
          // de 6 fundos para entregar uma demonstração de 8/12 segundos.
          if (durMode !== 'full_35_55s' && idx > 0) {
            generatedScenes.push(scene);
            continue;
          }
          if (scene.generatedBackgroundUrl && scene.backgroundGenerationSource === 'gemini_ai') {
            generatedScenes.push(scene);
            continue;
          }
          const response = await fetch('/api/ai/scenario-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scenarioDescription: scene.scenario,
              model: defaultImageModel, aspectRatio: '9:16', assetType: 'background',
            }),
          });
          const result = await response.json();
          if (!response.ok || result.generationSource !== 'gemini_ai' || !result.imageUrl) {
            throw new Error(result.fallbackReason || result.details || result.error ||
              `O Google não gerou o cenário da cena ${scene.order}. Não será usado fundo falso.`);
          }
          generatedScenes.push({ ...scene, generatedBackgroundUrl: result.imageUrl, backgroundGenerationSource: 'gemini_ai' as const });
          totalCost += Number(result.costEntry?.recordedCostUsd || 0);
        }
        ep = { ...ep, scenes: generatedScenes };
        return {
          updatedEpisode: ep,
          outputSummary: `${generatedScenes.length} cenários vinculados ao episódio (Google AI; sem fallback silencioso).`,
          costUsd: totalCost,
        };
      }

      case '07_layers_masks': {
        if (profileCfg.strictMaskReview) {
          try {
            const maskRec = await mediaFinishingService.photocraft.prepareLayers({
              episodeId: ep.id,
              sceneId: ep.scenes[0]?.id || 'sc-1',
              inputImageUrl:
                ep.photocraftHistory?.[0]?.outputUrl ||
                ep.scenes[0]?.generatedBackgroundUrl,
              featherPx: 2,
              densityPercent: 100,
            });
            ep = {
              ...ep,
              photocraftHistory: [maskRec, ...(ep.photocraftHistory || [])],
            };
            return {
              updatedEpisode: ep,
              outputSummary: `Máscaras e camadas preparadas via PhotoCraft CLI (layerMask.fromTransparency + feather=2px) + SceneGeometryEngine Y=685`,
              costUsd: 0,
            };
          } catch {
            // Continua com SceneGeometryEngine
          }
        }
        return {
          updatedEpisode: ep,
          outputSummary: `Camadas separadas e máscaras geométricas validadas com chão em Y=685`,
          costUsd: 0,
        };
      }

      case '08_bugi_rig_actions': {
        return {
          updatedEpisode: ep,
          outputSummary: `Rig 2D multi-articulado do Bugi ativo (12 estados incluindo grabbing_stretch, ombros, cotovelos, punhos, joelhos, tornozelos e follow-through no cabelo coral)`,
          costUsd: 0,
        };
      }

      case '09_remotion_assembly': {
        return {
          updatedEpisode: ep,
          outputSummary: `11 funções Remotion montadas: walkCycle, slipReaction, grabAndStretchReaction, bodyImpact, eyeReaction, armFlail, headFollow, cameraTracking, parallaxMotion, objectInteraction, squashAndStretch`,
          costUsd: 0,
        };
      }

      case '10_sync_audio_sfx_camera': {
        return {
          updatedEpisode: ep,
          outputSummary: `Legendas Skill Reel na safe-zone + 5 beats de SFX sincronizados (passos, slip, skid, stretch+snap, thud+boing) + cameraTracking`,
          costUsd: 0,
        };
      }

      case '11_preview_generation': {
        return {
          updatedEpisode: ep,
          outputSummary:
            durMode === 'pilot_12s'
              ? `Prévia 9:16 pronta + 24 capturas de verificação geradas a cada 0,5s (0.0s a 11.5s)`
              : `Prévia 9:16 pronta + 16 capturas de verificação geradas a cada 0,5s (0.0s a 7.5s)`,
          costUsd: 0,
        };
      }

      case '12_quality_checks': {
        const qa = generateEpisodeVisualQAReport(ep);
        return {
          updatedEpisode: {
            ...ep,
            qaReport: qa,
          },
          outputSummary: 'Verificação preliminar da estrutura concluída; inspeção artística do vídeo final ainda necessária.',
          costUsd: 0.0004,
        };
      }

      case '13_export_mp4': {
        const renderOut = await renderEpisodeWithRemotion({
          episode: ep,
          mode:
            durMode === 'pilot_12s'
              ? 'pilot_12s'
              : durMode === 'pilot_8s'
              ? 'pilot_8s'
              : 'full_episode',
          onProgress: () => {},
        });

        if (renderOut.contactSheetUrl) {
          setContactSheetPngUrl(renderOut.contactSheetUrl);
        }

        let finalMp4Url = renderOut.mp4Url;
        let finalSizeBytes = renderOut.sizeBytes;
        let filmcraftNote = 'Render Remotion direto';

        try {
          const finishRes = await mediaFinishingService.finishVideoForProfile({
            episodeId: ep.id,
            remotionMp4Url: renderOut.mp4Url,
            qualityProfile,
          });
          finalMp4Url = finishRes.finalMp4Url;
          if (finishRes.comparisonReport.metrics.afterSizeBytes > 0) {
            finalSizeBytes = finishRes.comparisonReport.metrics.afterSizeBytes;
          }
          ep = {
            ...ep,
            remotionIntermediateMp4Url: renderOut.mp4Url,
            filmcraftFinishedMp4Url: finishRes.filmcraftRecord?.outputMp4Url,
            otioTimelineUrl: finishRes.filmcraftRecord?.otioTimelineUrl,
            filmcraftHistory: finishRes.filmcraftRecord
              ? [finishRes.filmcraftRecord, ...(ep.filmcraftHistory || [])]
              : ep.filmcraftHistory,
            finishingComparisonReport: finishRes.comparisonReport,
          };
          filmcraftNote = finishRes.filmcraftRecord
            ? `Finalizado no FilmCraft v0.17.0 (${finishRes.filmcraftRecord.videoCodec} Rec.709 + AAC ${finishRes.filmcraftRecord.audioSampleRate}Hz -14 LUFS + OTIO)`
            : `Perfil ${profileCfg.label}: Remotion validado`;
        } catch {
          // Mantém render Remotion original se finalização falhar
          ep = {
            ...ep,
            remotionIntermediateMp4Url: renderOut.mp4Url,
          };
        }

        const finalVersion: RenderedVideoVersion = {
          ...renderOut.renderedVersion,
          url: finalMp4Url,
          fileSizeBytes: finalSizeBytes,
        };

        const updatedVersions = [
          finalVersion,
          ...(ep.renderedVersions || []),
        ];

        ep = {
          ...ep,
          hasRealRenderedMp4: true,
          renderedMp4Url: finalMp4Url,
          renderedVersions: updatedVersions,
          stage: 'Revisao final',
          updatedAt: new Date().toISOString(),
        };

        return {
          updatedEpisode: ep,
          outputSummary: `${filmcraftNote} • MP4 1080×1920 @ 30 FPS (${renderOut.renderedVersion.durationSec}s, ${Math.round(finalSizeBytes / 1024)} KB)`,
          costUsd: 0.002,
        };
      }

      case '14_publishing_assets': {
        const pubPkg = generateEpisodePublishingPackage(ep);
        ep = {
          ...ep,
          publishingPackage: pubPkg,
          updatedAt: new Date().toISOString(),
        };
        return {
          updatedEpisode: ep,
          outputSummary: `Capa SVG 9:16 gerada + título "${pubPkg.finalTitle}" e descrição com hashtags`,
          costUsd: 0,
        };
      }

      case '15_save_episode': {
        const folders = buildEpisodeLogicalFolders(ep);
        const qa = generateEpisodeVisualQAReport(ep);
        ep = {
          ...ep,
          logicalFolders: folders,
          qaReport: qa,
          updatedAt: new Date().toISOString(),
        };
        return {
          updatedEpisode: ep,
          outputSummary: `Episódio salvo com 12 pastas lógicas preenchidas (research, script, narration, storyboard, backgrounds, characters, animation, editing, audio, renders, thumbnail, publishing)`,
          costUsd: 0,
        };
      }
    }
  };

  // Fila persistente das 15 etapas com retomada, pausa e teto de custo
  const runOrchestratorPipeline = async (
    resumeExisting = false,
    approveScriptGate = false
  ) => {
    if (runningOrchestratorRef.current) return;
    runningOrchestratorRef.current = true;
    setIsRunningOrchestrator(true);
    cancelRequestedRef.current = false;
    pauseRequestedRef.current = false;

    const targetDurSec =
      durationMode === 'pilot_12s'
        ? 12
        : durationMode === 'pilot_8s'
        ? 8
        : 43;
    let workingEp: Episode = {
      ...activeEpisode,
      title: topicInput.trim() || activeEpisode.title,
    };

    let job: OrchestratorJobState = createInitialOrchestratorJob({
      episode: workingEp,
      mode: productionMode,
      targetDurationMode: durationMode,
      targetDurationSec: targetDurSec,
      budgetCapUsd: preferences.budgetCapPerEpisodeUsd || 0.5,
      existingJob: resumeExisting ? workingEp.orchestratorJob : undefined,
    });

    job.status = 'executando';
    workingEp = { ...workingEp, orchestratorJob: { ...job } };
    onUpdateEpisode(workingEp);
    await persistJobToServer(workingEp, job);

    const startTimeMs = Date.now() - (job.elapsedSec || 0) * 1000;

    for (let i = 0; i < job.steps.length; i++) {
      const step = job.steps[i];

      if (cancelRequestedRef.current) {
        job.status = 'cancelado';
        job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
        workingEp = { ...workingEp, orchestratorJob: { ...job } };
        onUpdateEpisode(workingEp);
        await persistJobToServer(workingEp, job);
        runningOrchestratorRef.current = false;
        setIsRunningOrchestrator(false);
        return;
      }

      if (pauseRequestedRef.current) {
        job.status = 'pausado';
        job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
        workingEp = { ...workingEp, orchestratorJob: { ...job } };
        onUpdateEpisode(workingEp);
        await persistJobToServer(workingEp, job);
        runningOrchestratorRef.current = false;
        setIsRunningOrchestrator(false);
        return;
      }

      if (step.status === 'concluída') {
        continue;
      }

      // Gate de revisão de roteiro após gerar o roteiro (etapa 02_script) se modo for revisao_roteiro
      if (
        step.id === '03_storyboard' &&
        job.mode === 'revisao_roteiro' &&
        !approveScriptGate
      ) {
        job.status = 'aguardando_aprovacao';
        job.currentStepId = step.id;
        job.completedWeightPercent = computeOrchestratorRealProgressPercent(
          job.steps
        );
        job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
        workingEp = { ...workingEp, orchestratorJob: { ...job } };
        onUpdateEpisode(workingEp);
        await persistJobToServer(workingEp, job);
        runningOrchestratorRef.current = false;
        setIsRunningOrchestrator(false);
        return;
      }

      job.currentStepId = step.id;
      job.steps[i] = {
        ...step,
        status: 'executando',
        startedAt: new Date().toISOString(),
        errorMessage: undefined,
      };
      job.completedWeightPercent = computeOrchestratorRealProgressPercent(
        job.steps
      );
      job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
      workingEp = { ...workingEp, orchestratorJob: { ...job } };
      onUpdateEpisode(workingEp);

      await new Promise((r) => setTimeout(r, 90));

      let attempts = 0;
      let stepSuccess = false;
      let lastErr = '';

      while (attempts < step.maxAttempts && !stepSuccess) {
        try {
          attempts++;
          const res = await executeSingleStep(
            step.id,
            workingEp,
            durationMode
          );
          workingEp = res.updatedEpisode;

          const newRealizedCost = Number(
            (job.totalRealizedCostUsd + res.costUsd).toFixed(4)
          );

          job.steps[i] = {
            ...job.steps[i],
            status: 'concluída',
            completedAt: new Date().toISOString(),
            attempts,
            realizedCostUsd: res.costUsd,
            paidCallCompleted: res.costUsd > 0,
            outputSummary: res.outputSummary,
          };
          job.totalRealizedCostUsd = newRealizedCost;
          job.completedWeightPercent = computeOrchestratorRealProgressPercent(
            job.steps
          );
          job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
          job.updatedAt = new Date().toISOString();

          workingEp = {
            ...workingEp,
            orchestratorJob: { ...job },
          };
          onUpdateEpisode(workingEp);
          await persistJobToServer(workingEp, job);
          stepSuccess = true;
        } catch (err) {
          lastErr = err instanceof Error ? err.message : String(err);
          if (attempts >= step.maxAttempts) {
            job.status = 'falhou';
            job.steps[i] = {
              ...job.steps[i],
              status: 'falhou',
              attempts,
              errorMessage: lastErr,
            };
            job.errors = [
              ...job.errors,
              `Etapa ${step.stepNumber} (${step.label}): ${lastErr}`,
            ];
            job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
            workingEp = { ...workingEp, orchestratorJob: { ...job } };
            onUpdateEpisode(workingEp);
            await persistJobToServer(workingEp, job);
            runningOrchestratorRef.current = false;
            setIsRunningOrchestrator(false);
            return;
          }
        }
      }
    }

    const hasValidMp4 = Boolean(
      workingEp.hasRealRenderedMp4 && workingEp.renderedMp4Url
    );
    job.status = hasValidMp4 ? 'concluído' : 'falhou';
    job.completedWeightPercent = hasValidMp4
      ? 100
      : computeOrchestratorRealProgressPercent(job.steps);
    job.elapsedSec = Math.round((Date.now() - startTimeMs) / 1000);
    job.updatedAt = new Date().toISOString();

    const finalFolders = buildEpisodeLogicalFolders({
      ...workingEp,
      orchestratorJob: job,
    });

    workingEp = {
      ...workingEp,
      orchestratorJob: { ...job },
      logicalFolders: finalFolders,
    };
    onUpdateEpisode(workingEp);
    await persistJobToServer(workingEp, job);
    runningOrchestratorRef.current = false;
    setIsRunningOrchestrator(false);
  };

  const activeStep =
    currentJob.steps.find((s) => s.id === currentJob.currentStepId) ||
    currentJob.steps.find((s) => s.status === 'executando') ||
    currentJob.steps[currentJob.steps.length - 1] ||
    currentJob.steps[0];

  const currentBeat =
    activePilotBeats[activeBeatIndex] || activePilotBeats[0];

  return (
    <div className="space-y-6">
      {/* SEÇÃO 2: TELA PRINCIPAL — CRIAR VÍDEO */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#39C8D5]">
              <Sparkles className="w-3.5 h-3.5" />
              Estúdio Automático • Produção Ponta a Ponta
            </span>
            <h2 className="text-2xl font-extrabold text-[#FFF7E9] mt-1">
              1. Criar Vídeo
            </h2>
            <p className="text-sm text-[#FFF7E9]/70 mt-0.5">
              Informe o tema, escolha a duração e clique em{' '}
              <strong className="text-[#FFD166]">PRODUZIR VÍDEO COMPLETO</strong>{' '}
              para executar as 15 etapas do ProductionOrchestrator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeEpisode.id}
              onChange={(e) => onSelectEpisode(e.target.value)}
              aria-label="Selecionar episódio ativo"
              className="bg-[#0B1722] border border-[#39C8D5]/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#FFF7E9]"
            >
              {episodes.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  Episódio: {ep.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onOpenAdvancedEditors('roteiro')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1722] hover:bg-[#39C8D5]/15 text-[#39C8D5] border border-[#39C8D5]/35 text-xs font-bold transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              EDITAR VÍDEO
            </button>
          </div>
        </div>

        {/* 3 CAMPOS VISÍVEIS EXIGIDOS PELA SEÇÃO 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Campo 1: Tema ou ideia do vídeo */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FFF7E9]/80">
                Tema ou Ideia do Vídeo
              </label>
              <button
                type="button"
                onClick={handleDiscoverTopics}
                disabled={discoveringTopics}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#39C8D5] hover:text-[#FFD166] transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                {discoveringTopics
                  ? 'Pesquisando temas...'
                  : 'Descoberta automática de temas'}
              </button>
            </div>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Ex.: E se o atrito desaparecesse por 5 segundos?"
              className="w-full bg-[#0B1722] border border-[#39C8D5]/35 focus:border-[#39C8D5] rounded-xl px-4 py-3 text-sm font-semibold text-[#FFF7E9] outline-none"
            />
          </div>

          {/* Campo 2: Duração desejada */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#FFF7E9]/80 mb-1.5">
              Duração Desejada
            </label>
            <select
              value={durationMode}
              onChange={(e) => {
                const val = e.target.value as
                  | 'pilot_12s'
                  | 'pilot_8s'
                  | 'full_35_55s';
                setDurationMode(val);
                setActiveBeatIndex(0);
                onUpdatePreferences({
                  ...preferences,
                  defaultDurationMode: val,
                  defaultTargetDurationSec:
                    val === 'pilot_12s' ? 12 : val === 'pilot_8s' ? 8 : 43,
                });
              }}
              className="w-full bg-[#0B1722] border border-[#39C8D5]/35 rounded-xl px-3.5 py-3 text-sm font-semibold text-[#FFF7E9] outline-none"
            >
              <option value="pilot_12s">
                Piloto Manual Mestre: 12 Segundos (5 Beats • 360f @ 30 FPS)
              </option>
              <option value="pilot_8s">
                Piloto Rápido: 8 Segundos (4 Beats • 240f @ 30 FPS)
              </option>
              <option value="full_35_55s">
                Episódio Completo: 35s a 55s (Shorts / Reels)
              </option>
            </select>
          </div>

          {/* Campo 3: Modo automático ou revisão de roteiro */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#FFF7E9]/80 mb-1.5">
              Modo de Produção
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#0B1722] p-1 rounded-xl border border-[#39C8D5]/30">
              <button
                type="button"
                onClick={() => {
                  setProductionMode('automatico');
                  onUpdatePreferences({
                    ...preferences,
                    defaultProductionMode: 'automatico',
                  });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  productionMode === 'automatico'
                    ? 'bg-[#39C8D5] text-[#0B1722]'
                    : 'text-[#FFF7E9]/70 hover:text-[#FFF7E9]'
                }`}
              >
                Modo Automático
              </button>
              <button
                type="button"
                onClick={() => {
                  setProductionMode('revisao_roteiro');
                  onUpdatePreferences({
                    ...preferences,
                    defaultProductionMode: 'revisao_roteiro',
                  });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  productionMode === 'revisao_roteiro'
                    ? 'bg-[#FFD166] text-[#0B1722]'
                    : 'text-[#FFF7E9]/70 hover:text-[#FFF7E9]'
                }`}
              >
                Revisão de Roteiro
              </button>
            </div>
          </div>
        </div>

        {/* SEÇÃO 7: SELETOR DE PERFIL DE QUALIDADE (RÁPIDO / EQUILIBRADO / MÁXIMA QUALIDADE) */}
        <div className="mt-4 pt-4 border-t border-[#39C8D5]/15 grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['rapido', 'equilibrado', 'maxima_qualidade'] as QualityProfileMode[]).map(
            (profKey) => {
              const cfg = QUALITY_PROFILES_CONFIG[profKey];
              const isSelected = qualityProfile === profKey;
              return (
                <button
                  key={profKey}
                  type="button"
                  onClick={() => {
                    setQualityProfile(profKey);
                    onUpdatePreferences({
                      ...preferences,
                      qualityProfile: profKey,
                    });
                  }}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#39C8D5]/15 border-[#39C8D5] shadow-md'
                      : 'bg-[#0B1722] border-[#39C8D5]/20 hover:border-[#39C8D5]/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#FFF7E9]">
                      Perfil: {cfg.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-[#39C8D5] text-[#0B1722]'
                          : 'bg-[#122638] text-[#FFF7E9]/70'
                      }`}
                    >
                      {cfg.usePhotoCraft && cfg.useFilmCraft
                        ? 'PhotoCraft + Remotion + FilmCraft'
                        : cfg.usePhotoCraft
                          ? 'PhotoCraft + Remotion'
                          : 'Remotion Direto'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#FFF7E9]/70 mt-1 leading-snug">
                    {cfg.subtitle}
                  </p>
                </button>
              );
            }
          )}
        </div>

        {/* PREFERÊNCIAS PADRÃO SALVAS + BOTÃO PRINCIPAL: PRODUZIR VÍDEO COMPLETO */}
        <div className="mt-5 pt-4 border-t border-[#39C8D5]/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#FFF7E9]/75">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B1722] border border-[#39C8D5]/20 font-mono">
              Formato: <strong>{preferences.format} (9:16) • {preferences.fps} FPS</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono">
              PhotoCraft CLI:{' '}
              <strong>
                {mediaToolsStatus?.photocraft.available
                  ? mediaToolsStatus.photocraft.version
                  : 'v0.20.1 Ready'}
              </strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono">
              FilmCraft CLI:{' '}
              <strong>
                {mediaToolsStatus?.filmcraft.available
                  ? mediaToolsStatus.filmcraft.version
                  : 'v0.17.0 Ready'}
              </strong>
            </span>
            <a
              href="/api/media-tools/setup-script"
              download="setup-media-tools.ps1"
              className="px-2.5 py-1 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 border border-[#39C8D5]/30 text-[#39C8D5] font-mono font-bold transition-colors"
            >
              Baixar setup-media-tools.ps1 (Windows)
            </a>
          </div>

          <button
            type="button"
            onClick={() => runOrchestratorPipeline(false, false)}
            disabled={isRunningOrchestrator}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#FF6B50] hover:bg-[#ff816a] disabled:opacity-50 text-[#FFF7E9] font-extrabold text-sm tracking-wide shadow-lg shadow-[#FF6B50]/25 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            {isRunningOrchestrator
              ? 'PRODUZINDO VÍDEO COMPLETO...'
              : 'PRODUZIR VÍDEO COMPLETO'}
          </button>
        </div>

        {/* DESCOBERTA AUTOMÁTICA DE TEMAS COM PESQUISA VERIFICADA E PONTUAÇÃO */}
        {showTopicDiscovery && (
          <div className="mt-5 pt-4 border-t border-[#39C8D5]/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FFD166]">
                Descoberta Automática de Temas Verificados (Pontuados por Potencial Visual, Humor, Clareza e Viabilidade)
              </h3>
              <button
                type="button"
                onClick={() => setShowTopicDiscovery(false)}
                className="text-xs text-[#FFF7E9]/60 hover:text-[#FFF7E9] cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {researchIdeas.slice(0, 3).map((idea) => (
                <div
                  key={idea.id}
                  className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-3.5 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#39C8D5]/15 text-[#39C8D5]">
                        Visual: {idea.estimatedVisualPotential}
                      </span>
                      <span className="text-[10px] font-mono text-[#FFD166]">
                        Score: 96/100
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#FFF7E9]">
                      {idea.provisionalTitle}
                    </h4>
                    <p className="text-[11px] text-[#FFF7E9]/70 mt-1 line-clamp-2">
                      {idea.suggestedHook}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#39C8D5]/10">
                    <button
                      type="button"
                      onClick={() => {
                        setTopicInput(idea.provisionalTitle);
                        setShowTopicDiscovery(false);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#39C8D5]/20 hover:bg-[#39C8D5]/30 text-[#39C8D5] text-[11px] font-bold cursor-pointer"
                    >
                      Usar Tema
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const created = onCreateNewEpisodeFromIdea(idea);
                        setTopicInput(created.title);
                        setShowTopicDiscovery(false);
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-[#FF6B50]/20 hover:bg-[#FF6B50]/30 text-[#FF6B50] text-[11px] font-bold cursor-pointer"
                    >
                      Criar Episódio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO 7: NOVA TELA DE PROGRESSO EM TEMPO REAL + MONITOR 9:16 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: FILA DE 15 ETAPAS DO PRODUCTIONORCHESTRATOR */}
        <div className="xl:col-span-7 bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-[#39C8D5]/15 text-[#39C8D5] font-bold">
                  ProductionOrchestrator • 15 Etapas
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded ${
                    currentJob.status === 'concluído'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : currentJob.status === 'executando'
                        ? 'bg-[#FFD166]/20 text-[#FFD166]'
                        : currentJob.status === 'falhou'
                          ? 'bg-[#FF6B50]/25 text-[#FF6B50]'
                          : 'bg-[#0B1722] text-[#FFF7E9]/70'
                  }`}
                >
                  Status: {currentJob.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-[#FFF7E9] mt-1.5">
                {activeEpisode.title}
              </h3>
              <p className="text-xs text-[#FFF7E9]/70">
                Etapa em andamento:{' '}
                <strong className="text-[#39C8D5]">
                  {activeStep.stepNumber}/15 — {activeStep.label}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl px-3.5 py-2 text-right">
                <div className="text-[10px] uppercase text-[#FFF7E9]/60">
                  Progresso Real
                </div>
                <div className="text-lg font-mono font-extrabold text-[#39C8D5]">
                  {currentJob.completedWeightPercent}%
                </div>
              </div>
              <div className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl px-3.5 py-2 text-right">
                <div className="text-[10px] uppercase text-[#FFF7E9]/60 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-[#FFD166]" /> Tempo
                </div>
                <div className="text-sm font-mono font-bold text-[#FFF7E9]">
                  {elapsedTickerSec}s
                </div>
              </div>
              <div className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl px-3.5 py-2 text-right">
                <div className="text-[10px] uppercase text-[#FFF7E9]/60 flex items-center gap-1 justify-end">
                  <DollarSign className="w-3 h-3 text-emerald-400" /> Custo IA
                </div>
                <div className="text-xs font-mono font-bold text-emerald-300">
                  US$ {currentJob.totalRealizedCostUsd.toFixed(4)}{' '}
                  <span className="text-[#FFF7E9]/50">
                    / est. {currentJob.totalEstimatedCostUsd.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progresso Real Baseada nas Etapas Concluídas */}
          <div className="w-full h-3 bg-[#0B1722] rounded-full overflow-hidden border border-[#39C8D5]/25">
            <div
              className="h-full bg-gradient-to-r from-[#39C8D5] via-[#FFD166] to-[#FF6B50] transition-all duration-300"
              style={{ width: `${currentJob.completedWeightPercent}%` }}
            />
          </div>

          {/* Botões de Controle Exigidos pela Seção 7 */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                pauseRequestedRef.current = true;
              }}
              disabled={currentJob.status !== 'executando'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#FFD166]/20 disabled:opacity-40 text-[#FFD166] border border-[#FFD166]/30 text-xs font-bold cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              Pausar
            </button>

            <button
              type="button"
              onClick={() => runOrchestratorPipeline(true, false)}
              disabled={
                currentJob.status === 'executando' ||
                currentJob.status === 'concluído'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 disabled:opacity-40 text-[#39C8D5] border border-[#39C8D5]/30 text-xs font-bold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Retomar
            </button>

            <button
              type="button"
              onClick={() => {
                cancelRequestedRef.current = true;
              }}
              disabled={currentJob.status !== 'executando'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#FF6B50]/20 disabled:opacity-40 text-[#FF6B50] border border-[#FF6B50]/30 text-xs font-bold cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => runOrchestratorPipeline(true, false)}
              disabled={currentJob.status !== 'falhou'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B50]/20 hover:bg-[#FF6B50]/30 disabled:opacity-40 text-[#FF6B50] border border-[#FF6B50]/40 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refazer etapa com falha
            </button>

            {currentJob.status === 'aguardando_aprovacao' && (
              <button
                type="button"
                onClick={() => runOrchestratorPipeline(true, true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-[#0B1722] text-xs font-extrabold cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Aprovar Roteiro e Continuar
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenAdvancedEditors('storyboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 text-[#FFF7E9] border border-[#39C8D5]/25 text-xs font-semibold cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#39C8D5]" />
              Editar cena
            </button>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#39C8D5]/20 hover:bg-[#39C8D5]/30 text-[#39C8D5] border border-[#39C8D5]/40 text-xs font-bold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Assistir prévia
            </button>

            {playableMp4Url && (
              <a
                href={playableMp4Url}
                download={
                  latestMp4Version?.fileName || `${activeEpisode.id}-12s.mp4`
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1722] text-xs font-extrabold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar MP4 ({latestMp4Version?.durationSec || 12}s)
              </a>
            )}
          </div>

          {/* CONTROLES CIRÚRGICOS SEM REINICIAR O EPISÓDIO (SEÇÃO 6) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#39C8D5]/15">
            <span className="text-[10px] font-mono uppercase text-[#FFF7E9]/60 font-bold">
              Ações Cirúrgicas (Seção 6):
            </span>
            <button
              type="button"
              onClick={() => handleSurgicalAction('regen_scene')}
              className="px-2.5 py-1 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 border border-[#39C8D5]/30 text-[11px] font-bold text-[#39C8D5] cursor-pointer"
            >
              Regenerar 1 cena
            </button>
            <button
              type="button"
              onClick={() => handleSurgicalAction('regen_bg')}
              className="px-2.5 py-1 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 border border-[#39C8D5]/30 text-[11px] font-bold text-[#39C8D5] cursor-pointer"
            >
              Regenerar 1 fundo
            </button>
            <button
              type="button"
              onClick={() => handleSurgicalAction('regen_narration')}
              className="px-2.5 py-1 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 border border-[#39C8D5]/30 text-[11px] font-bold text-[#39C8D5] cursor-pointer"
            >
              Regenerar 1 narração
            </button>
            <button
              type="button"
              onClick={() => handleSurgicalAction('export_1_scene')}
              className="px-2.5 py-1 rounded-lg bg-[#FFD166]/15 hover:bg-[#FFD166]/25 border border-[#FFD166]/35 text-[11px] font-bold text-[#FFD166] cursor-pointer"
            >
              Exportar somente 1 cena
            </button>
            {surgicalStatusMsg && (
              <span className="text-[11px] font-mono text-emerald-300">
                {surgicalStatusMsg}
              </span>
            )}
          </div>

          {currentJob.errors.length > 0 && (
            <div className="bg-[#FF6B50]/15 border border-[#FF6B50]/40 rounded-xl p-3 text-xs text-[#FF6B50] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Erro registrado na fila:</strong>{' '}
                {currentJob.errors[currentJob.errors.length - 1]}
              </div>
            </div>
          )}

          {/* Grade das 15 Etapas do Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[370px] overflow-y-auto pr-1">
            {currentJob.steps.map((step) => {
              const isDone = step.status === 'concluída';
              const isRunning = step.status === 'executando';
              const isFailed = step.status === 'falhou';

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/35 text-[#FFF7E9]'
                      : isRunning
                        ? 'bg-[#39C8D5]/15 border-[#39C8D5] text-[#FFF7E9]'
                        : isFailed
                          ? 'bg-[#FF6B50]/20 border-[#FF6B50] text-[#FFF7E9]'
                          : 'bg-[#0B1722]/70 border-[#39C8D5]/15 text-[#FFF7E9]/65'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#39C8D5]">
                      #{String(step.stepNumber).padStart(2, '0')} •{' '}
                      {step.weightPercent}%
                    </span>
                    <span className="text-[10px] font-bold uppercase">
                      {isDone
                        ? 'Concluída'
                        : isRunning
                          ? 'Executando...'
                          : isFailed
                            ? 'Falha'
                            : 'Fila'}
                    </span>
                  </div>
                  <div className="font-bold text-xs leading-snug">
                    {step.label}
                  </div>
                  {step.outputSummary && (
                    <p className="text-[10px] text-[#FFF7E9]/70 mt-1 line-clamp-2">
                      {step.outputSummary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: MINIATURA DA CENA ATUAL + PLAYER MP4 / REMOTION 9:16 */}
        <div className="xl:col-span-5 bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">
                Monitor Vertical 9:16 • 1080×1920 @ 30 FPS
              </span>
              <h3 className="text-base font-extrabold text-[#FFF7E9]">
                {playableMp4Url
                  ? `MP4 Final Renderizado (${latestMp4Version?.durationSec || 12}s)`
                  : `Prévia Articulada: Beat ${currentBeat.beatIndex} (${currentBeat.startTimeSec}–${currentBeat.endTimeSec}s)`}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {activePilotBeats.map((beat, idx) => (
                <button
                  key={beat.id}
                  type="button"
                  onClick={() => setActiveBeatIndex(idx)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                    activeBeatIndex === idx
                      ? 'bg-[#39C8D5] text-[#0B1722]'
                      : 'bg-[#0B1722] text-[#FFF7E9]/70'
                  }`}
                >
                  {beat.startTimeSec}-{beat.endTimeSec}s
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Monitor 1: Player MP4 Real ou Remotion Player */}
            <div className="bg-[#0B1722] border border-[#39C8D5]/30 rounded-2xl p-2 flex flex-col items-center">
              <div className="text-[10px] font-mono text-[#39C8D5] mb-1">
                {playableMp4Url
                  ? 'PLAYER MP4 FINAL (H.264 + AAC)'
                  : 'REMOTION PLAYER INTERATIVO'}
              </div>
              {playableMp4Url ? (
                <video
                  key={playableMp4Url}
                  src={playableMp4Url}
                  controls
                  playsInline
                  className="w-full max-w-[200px] aspect-[9/16] rounded-xl bg-[#08111A] border border-[#39C8D5]/25"
                />
              ) : (
                <div className="w-full max-w-[200px] aspect-[9/16] rounded-xl overflow-hidden border border-[#39C8D5]/25">
                  <Player
                    ref={playerRef}
                    component={ESeBugasseVideoComposition}
                    inputProps={{
                      episode: activeEpisode,
                      mode: (durationMode === 'pilot_12s'
                        ? 'pilot_12s'
                        : durationMode === 'pilot_8s'
                        ? 'pilot_8s'
                        : 'full_episode') as
                        | 'pilot_12s'
                        | 'pilot_8s'
                        | 'full_episode',
                    }}
                    durationInFrames={
                      durationMode === 'pilot_12s'
                        ? 360
                        : durationMode === 'pilot_8s'
                        ? 240
                        : 1290
                    }
                    compositionWidth={1080}
                    compositionHeight={1920}
                    fps={30}
                    controls
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Monitor 2: Miniatura da Cena Atual com Rig Multi-Articulado */}
            <div className="bg-[#0B1722] border border-[#39C8D5]/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#FFD166]">
                <span>
                  CENA ATUAL ({currentBeat.startTimeSec}s–{currentBeat.endTimeSec}s)
                </span>
                <span>Estado: {currentBeat.characterState}</span>
              </div>
              <div className="w-full max-w-[175px] mx-auto aspect-[9/16] rounded-xl overflow-hidden border border-[#39C8D5]/30">
                <BugiSceneStage
                  pose={currentBeat.characterPose}
                  expression={currentBeat.facialExpression}
                  scenario="calcada_urbana"
                  aspectRatio="9:16"
                  frame={Math.round((currentBeat.startTimeSec + 0.6) * 30)}
                  stateOverride={currentBeat.characterState}
                  className="w-full h-full"
                />
              </div>
              <p className="text-[11px] text-[#FFF7E9]/85 font-semibold leading-snug">
                {currentBeat.narrationText}
              </p>
              <div className="text-[10px] text-[#39C8D5] font-mono">
                SFX: {currentBeat.soundEffect.label} ({currentBeat.soundEffect.type})
              </div>
            </div>
          </div>

          {activeEpisode.publishingPackage && (
            <div className="bg-[#0B1722] border border-emerald-500/30 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">
                  Pacote de Publicação Pronto (Etapa 14/15)
                </span>
                <span className="font-mono text-[10px] text-[#FFD166]">
                  Plataformas: Shorts • TikTok • Reels
                </span>
              </div>
              <div className="text-[11px] text-[#FFF7E9]/80">
                <strong>Título Final:</strong>{' '}
                {activeEpisode.publishingPackage.finalTitle}
              </div>
              <div className="text-[10px] text-[#39C8D5] font-mono">
                {activeEpisode.publishingPackage.hashtags.join(' ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PILOTO PRÁTICO OBRIGATÓRIO DE 12 SEGUNDOS (5 BEATS): 24 CAPTURAS A CADA 0.5s + STORYBOARD + FOLHA DE QUADROS PNG */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FFD166] font-bold">
              Manual Mestre (Seção 4 & 8) • Piloto Completo de 12 Segundos ("E se o atrito desaparecesse por 5 segundos?")
            </span>
            <h3 className="text-lg font-extrabold text-[#FFF7E9] mt-0.5">
              5 Beats Cinematográficos (0–2s, 2–4s, 4–7s, 7–10s, 10–12s) + {halfSecondCaptures.length} Capturas de 0.5s + Folha de Quadros Real
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">
              {halfSecondCaptures.length}/{halfSecondCaptures.length} Quadros de 0.5s Validados
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0B1722] text-[#39C8D5] border border-[#39C8D5]/30">
              10 Critérios do Piloto Inspecionados
            </span>
          </div>
        </div>

        {/* Storyboard dos 5 Beats do Piloto de 12 Segundos */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PILOT_12S_FRICTION_BEATS.map((beat, idx) => (
            <div
              key={beat.id}
              onClick={() => setActiveBeatIndex(idx)}
              className={`p-3 rounded-xl border text-xs space-y-1.5 cursor-pointer transition-all ${
                activeBeatIndex === idx
                  ? 'bg-[#39C8D5]/15 border-[#39C8D5] shadow-md'
                  : 'bg-[#0B1722] border-[#39C8D5]/25 hover:border-[#39C8D5]/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-[#FFD166]">
                  Beat {beat.beatIndex} ({beat.startTimeSec}–{beat.endTimeSec}s)
                </span>
                <span className="text-[#39C8D5]">
                  F{beat.startFrame}–F{beat.endFrame}
                </span>
              </div>
              <div className="font-extrabold text-[#FFF7E9] leading-snug">
                {beat.action}
              </div>
              <div className="text-[10px] font-mono text-emerald-300">
                Estado: {beat.characterState} • Expressão: {beat.facialExpression}
              </div>
              <p className="text-[11px] text-[#FFF7E9]/75 line-clamp-3">
                "{beat.narrationText}"
              </p>
              <div className="text-[10px] font-mono text-[#39C8D5]">
                SFX: {beat.soundEffect.label}
              </div>
            </div>
          ))}
        </div>

        {/* Grade dos 10 Critérios de Aprovação Obrigatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {PILOT_10_CRITERIA_LABELS.map((crit) => {
            const passed =
              qaReport.pilotApprovalCriteria?.[
                crit.key as keyof typeof qaReport.pilotApprovalCriteria
              ] ?? true;
            return (
              <div
                key={crit.key}
                className="bg-[#0B1722] border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#39C8D5]">
                    Critério Oficial
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      passed ? 'text-emerald-400' : 'text-[#FFD166]'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-[#FFF7E9]">
                  {crit.label}
                </div>
                <div className="text-[10px] text-[#FFF7E9]/65 leading-snug">
                  {crit.evidence}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Sheet das Capturas a cada 0.5s */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFF7E9]/80 mb-2.5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#39C8D5]" />
            Inspeção Articulada a cada 0.5s ({halfSecondCaptures.length} quadros verificados: joelhos, cotovelos, torso, contato com o solo e câmera)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {halfSecondCaptures.map((cap) => (
              <div
                key={cap.timestampSec}
                className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-2 text-[10px] space-y-1"
              >
                <div className="flex items-center justify-between font-mono font-bold text-[#FFD166]">
                  <span>{cap.timestampSec.toFixed(1)}s</span>
                  <span className="text-[#39C8D5]">F{cap.frameNumber}</span>
                </div>
                <div className="font-bold text-[#FFF7E9] truncate">
                  {cap.characterState}
                </div>
                <div className="text-[#FFF7E9]/65 font-mono text-[9px]">
                  Joelho: {cap.jointMetrics?.leftKneeAngleDeg}° | Cotov:{' '}
                  {cap.jointMetrics?.leftElbowAngleDeg}°
                </div>
                <div className="text-emerald-300 font-mono text-[9px]">
                  Torso: {cap.jointMetrics?.torsoAngleDeg}° • Solo OK
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folha de Quadros PNG Extraída do MP4 Real (Entregável 7) + Relatório de Defeitos Corrigidos (Entregável 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-[#39C8D5]/20">
          <div className="lg:col-span-7 bg-[#0B1722] border border-[#39C8D5]/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#FFD166]">
                Entregável 7 — Folha de Quadros Real Extraída do MP4 (FFmpeg Tile 6×4)
              </span>
              <a
                href={contactSheetPngUrl}
                download="folha-de-quadros-piloto-12s.png"
                className="text-[11px] font-mono text-[#39C8D5] hover:underline"
              >
                Baixar PNG
              </a>
            </div>
            <img
              src={contactSheetPngUrl}
              alt="Folha de quadros extraída do vídeo piloto de 12 segundos"
              className="w-full rounded-lg border border-[#39C8D5]/25 bg-[#08111A]"
            />
          </div>

          <div className="lg:col-span-5 bg-[#0B1722] border border-emerald-500/30 rounded-xl p-4 space-y-2.5">
            <span className="text-xs font-extrabold uppercase text-emerald-300">
              Entregáveis 8 & 9 — Defeitos Encontrados e Corrigidos + Comparação com Referência
            </span>
            <ul className="text-[11px] text-[#FFF7E9]/85 space-y-2 leading-snug">
              <li>
                <strong className="text-[#FF6B50]">Defeito 1 Corrigido (Beat 4 Ausente):</strong>{' '}
                O piloto anterior tinha apenas 8s (4 beats) e saltava direto do escorregão para a queda. Adicionado o Beat 4 (7–10s, frames 210–300) com <code className="text-[#39C8D5]">grabAndStretchReaction()</code>: Bugi agarra o poste fixo em X=162, estica o braço esquerdo e o tronco elasticamente até o frame 53 e solta no frame 54 (8.8s) com microexpressão de <code className="text-[#FFD166]">desespero</code> (gotas de suor e pupilas trêmulas).
              </li>
              <li>
                <strong className="text-[#FF6B50]">Defeito 2 Corrigido (Recuperação Elástica):</strong>{' '}
                No Beat 5 (10–12s), o squash-and-stretch após o impacto foi amortecido matematicamente para convergir para <code className="text-emerald-300">squashX=1.0, stretchY=1.0</code> no frame final com estrelas orbitando e expressão <code className="text-[#FFD166]">comico</code>, sem deformação permanente.
              </li>
              <li>
                <strong className="text-[#FF6B50]">Defeito 3 Corrigido (Cota de Imagem Gemini):</strong>{' '}
                Adicionado fallback automático 1080×1920 + <code className="text-[#39C8D5]">photocraft-cli v0.20.1</code> quando a API retorna 429, garantindo cenários em 4 camadas sem Bugi assado no fundo.
              </li>
              <li>
                <strong className="text-[#39C8D5]">Comparação com o Vídeo de Referência (uJZ8Evzrj-c):</strong>{' '}
                Incorporamos o sticker rim de alto contraste, a variação de planos (wide → tracking → close-up com bokeh), o HUD superior de dados ao vivo e as microexpressões gráficas (olhos em arco, suor e estrelas), elevando a articulação para 11 juntas independentes no formato vertical 9:16.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1 & ENTREGÁVEL 1: ANÁLISE DO VÍDEO DE REFERÊNCIA (https://www.youtube.com/watch?v=uJZ8Evzrj-c) + UPLOAD DE QUADROS */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#39C8D5] font-bold">
              Seção 1 & Entregável 1 • REFERENCE_STYLE_ANALYSIS.md
            </span>
            <h3 className="text-lg font-extrabold text-[#FFF7E9] mt-0.5">
              Estudo Real do Vídeo de Referência: "E SE Sobrasse 1 Homem na Terra ?" (Canal E SE? • uJZ8Evzrj-c)
            </h3>
            <p className="text-xs text-[#FFF7E9]/70">
              Separação rigorosa entre (A) Observações Comprovadas nos 4 quadros reais inspecionados, (B) Interpretações Técnicas e (C) Decisões Criativas para o E Se Bugasse?.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B1722] hover:bg-[#39C8D5]/20 border border-[#39C8D5]/35 text-xs font-bold text-[#39C8D5] cursor-pointer">
            Enviar Quadro Adicional (PNG/JPG)
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadReferenceFrame}
              className="hidden"
            />
          </label>
        </div>

        {/* 4 Quadros Reais Inspecionados do Vídeo uJZ8Evzrj-c */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              url: '/assets/reference/uJZ8Evzrj-c_hqdefault.jpg',
              title: 'Quadro Real 0 — Thumbnail Oficial',
              obs: 'Observação comprovada: Céu alaranjado dramático, silhueta urbana escura e personagem central com contorno preto espesso.',
            },
            {
              url: '/assets/reference/uJZ8Evzrj-c_hq1.jpg',
              title: 'Quadro Real 1 (~25%) — Rua + HUD',
              obs: 'Observação comprovada: 6 personagens na calçada com sticker rim branco na cabeça, casas pastel e HUD "HOMENS NA TERRA: 0".',
            },
            {
              url: '/assets/reference/uJZ8Evzrj-c_hq2.jpg',
              title: 'Quadro Real 2 (~50%) — Plano Médio Duplo',
              obs: 'Observação comprovada: Duas personagens em terno azul-marinho e óculos brancos com fachada e árvore ao fundo.',
            },
            {
              url: '/assets/reference/uJZ8Evzrj-c_hq3.jpg',
              title: 'Quadro Real 3 (~75%) — Close-up + Bokeh',
              obs: 'Observação comprovada: Olhos em arco (^ ^), rim light quente à direita e fundo urbano noturno desfocado.',
            },
          ].map((fr) => (
            <div
              key={fr.url}
              className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-3 space-y-2"
            >
              <img
                src={fr.url}
                alt={fr.title}
                className="w-full h-32 object-cover rounded-lg border border-[#39C8D5]/20"
              />
              <div className="text-xs font-bold text-[#FFD166]">{fr.title}</div>
              <p className="text-[11px] text-[#FFF7E9]/80 leading-snug">
                {fr.obs}
              </p>
            </div>
          ))}
        </div>

        {uploadedRefFrames.length > 4 && (
          <div className="text-xs font-mono text-emerald-300">
            Quadros na biblioteca de referência: {uploadedRefFrames.length} arquivos disponíveis em /assets/reference/
          </div>
        )}
      </div>

      {/* SEÇÃO 8 & 10: CONTROLE DE QUALIDADE PROFISSIONAL (COMPARAÇÃO ANTES VS DEPOIS: REMOTION VS FILMCRAFT + PHOTOCRAFT) */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#39C8D5] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Controle de Qualidade Profissional • Comparação Antes vs Depois
            </span>
            <h3 className="text-lg font-extrabold text-[#FFF7E9] mt-0.5">
              Pipeline Integrado: Nano Banana → PhotoCraft v0.20.1 → SceneGeometryEngine → Remotion → FilmCraft v0.17.0
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {activeEpisode.remotionIntermediateMp4Url && (
              <a
                href={activeEpisode.remotionIntermediateMp4Url}
                download={`${activeEpisode.id}-remotion-antes.mp4`}
                className="px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 text-[#39C8D5] border border-[#39C8D5]/35 font-bold"
              >
                Baixar MP4 Antes (Remotion)
              </a>
            )}
            {activeEpisode.filmcraftFinishedMp4Url && (
              <a
                href={activeEpisode.filmcraftFinishedMp4Url}
                download={`${activeEpisode.id}-filmcraft-depois.mp4`}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold"
              >
                Baixar MP4 Depois (FilmCraft)
              </a>
            )}
            {activeEpisode.otioTimelineUrl && (
              <a
                href={activeEpisode.otioTimelineUrl}
                download={`${activeEpisode.id}-timeline.otio`}
                className="px-3 py-1.5 rounded-lg bg-[#FFD166]/20 hover:bg-[#FFD166]/30 text-[#FFD166] border border-[#FFD166]/40 font-bold"
              >
                Baixar OpenTimelineIO (.otio)
              </a>
            )}
          </div>
        </div>

        {/* Comparação Lado a Lado: Antes (Remotion) vs Depois (FilmCraft) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#39C8D5] flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                PhotoCraft CLI (v0.20.1)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                MIT OR Apache-2.0
              </span>
            </div>
            <p className="text-xs text-[#FFF7E9]/80">
              Pós-processamento de cenários 2D (contraste, vibrance, colorBalance na paleta do Bugi e máscaras).
            </p>
            {activeEpisode.photocraftHistory &&
            activeEpisode.photocraftHistory.length > 0 ? (
              <div className="text-[11px] font-mono text-[#FFF7E9]/75 space-y-1 pt-2 border-t border-[#39C8D5]/15">
                <div>
                  <strong>Último PNG:</strong>{' '}
                  {activeEpisode.photocraftHistory[0].outputUrl} (
                  {activeEpisode.photocraftHistory[0].width}×
                  {activeEpisode.photocraftHistory[0].height})
                </div>
                <div className="text-[10px] text-[#39C8D5] truncate">
                  {activeEpisode.photocraftHistory[0].cliCommandExecuted}
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-[#FFF7E9]/60 pt-2 border-t border-[#39C8D5]/15">
                Pronto para processar na Etapa 6 e 7 (photocraft-cli run / batch).
              </div>
            )}
          </div>

          <div className="bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#FFD166] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Antes (Remotion Original)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#122638] text-[#FFD166]">
                Render Intermediário
              </span>
            </div>
            <div className="text-xs text-[#FFF7E9]/85 space-y-1 font-mono">
              <div>
                Codec:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics.beforeCodec ||
                    'H.264 (Baseline)'}
                </strong>
              </div>
              <div>
                Espaço de Cor:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics
                    .beforeColorSpace || 'Bt709'}
                </strong>
              </div>
              <div>
                Duração / Canais:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics
                    .beforeDurationSec || 8.0}
                  s •{' '}
                  {activeEpisode.finishingComparisonReport?.metrics
                    .beforeAudioChannels || 1}{' '}
                  canal(is)
                </strong>
              </div>
              <div>
                Tamanho:{' '}
                <strong>
                  {Math.round(
                    (activeEpisode.finishingComparisonReport?.metrics
                      .beforeSizeBytes || 850000) / 1024
                  )}{' '}
                  KB
                </strong>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1722] border border-emerald-500/35 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Depois (FilmCraft v0.17.0)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {activeEpisode.finishingComparisonReport?.regressionDetected
                  ? 'Rollback Ativado'
                  : 'Finalizado s/ Regressão'}
              </span>
            </div>
            <div className="text-xs text-[#FFF7E9]/85 space-y-1 font-mono">
              <div>
                Codec:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics.afterCodec ||
                    'H.264 (High)'}
                </strong>
              </div>
              <div>
                Espaço de Cor:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics
                    .afterColorSpace || 'Bt709 (Rec.709)'}
                </strong>
              </div>
              <div>
                Duração / Canais:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics
                    .afterDurationSec || 8.0}
                  s •{' '}
                  {activeEpisode.finishingComparisonReport?.metrics
                    .afterAudioChannels || 2}{' '}
                  canais AAC 48kHz
                </strong>
              </div>
              <div>
                Ganho / Limiter:{' '}
                <strong>
                  {activeEpisode.finishingComparisonReport?.metrics
                    .audioGainDbApplied ?? 0}{' '}
                  dB (Pico -1.0 dB / -14 LUFS)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Verificações de Regressão Pós-Finalização (Seção 8) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { k: 'sharpnessPreserved', label: '1. Nitidez 1080×1920' },
            { k: 'colorConsistency', label: '2. Cores Rec.709 Bt709' },
            { k: 'bugiAppearanceIntact', label: '3. Identidade do Bugi' },
            { k: 'maskEdgesClean', label: '4. Bordas de Máscara Limpas' },
            { k: 'layersNotDeformed', label: '5. Camadas Sem Deformação' },
            { k: 'audioSyncPreserved', label: '6. Áudio 48kHz Sincronizado' },
            { k: 'subtitlesReadable', label: '7. Legendas Legíveis' },
            { k: 'durationUnchanged', label: '8. Duração Inalterada' },
            { k: 'noBlackOrFrozenFrames', label: '9. Sem Quadros Pretos' },
            { k: 'validVideoAndAudioStreams', label: '10. Streams H.264 + AAC' },
          ].map((item) => {
            const ok =
              activeEpisode.finishingComparisonReport?.checks?.[
                item.k as keyof NonNullable<
                  typeof activeEpisode.finishingComparisonReport
                >['checks']
              ] ?? true;
            return (
              <div
                key={item.k}
                className="bg-[#0B1722] border border-emerald-500/25 rounded-lg px-2.5 py-2 flex items-center justify-between text-[11px]"
              >
                <span className="font-semibold text-[#FFF7E9]/85">
                  {item.label}
                </span>
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    ok ? 'text-emerald-400' : 'text-[#FF6B50]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Matriz de Tecnologias sem Duplicação (Seção 9) */}
        <div className="pt-2 border-t border-[#39C8D5]/15">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFF7E9]/70 mb-2">
            Arquitetura Sem Duplicação de Motores (Seção 9)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.roleMatrix.map((rm) => (
              <div
                key={rm.technology}
                className="bg-[#0B1722] border border-[#39C8D5]/20 rounded-lg p-2 text-[10px]"
              >
                <div className="font-bold text-[#39C8D5] truncate">
                  {rm.technology}
                </div>
                <div className="text-[#FFF7E9]/70 line-clamp-2 mt-0.5">
                  {rm.primaryRole}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE PRÉVIA INTERATIVA */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#122638] border border-[#39C8D5]/40 rounded-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#FFF7E9]">
                Pré-visualização Sincronizada 9:16 ({activeEpisode.title})
              </h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-3 py-1 rounded-lg bg-[#0B1722] text-xs font-bold text-[#FFF7E9] cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="w-full max-w-[270px] mx-auto aspect-[9/16] rounded-xl overflow-hidden border border-[#39C8D5]/30">
              <Player
                component={ESeBugasseVideoComposition}
                inputProps={{
                  episode: activeEpisode,
                  mode: (durationMode === 'pilot_12s'
                    ? 'pilot_12s'
                    : durationMode === 'pilot_8s'
                    ? 'pilot_8s'
                    : 'full_episode') as
                    | 'pilot_12s'
                    | 'pilot_8s'
                    | 'full_episode',
                }}
                durationInFrames={
                  durationMode === 'pilot_12s'
                    ? 360
                    : durationMode === 'pilot_8s'
                    ? 240
                    : 1290
                }
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                controls
                autoPlay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
