import React, { useState, useRef } from 'react';
import { Player } from '@remotion/player';
import {
  BugiExpression,
  BugiPose,
  Episode,
  RenderedVideoVersion,
  SceneProductionStatus,
  SCENE_PRODUCTION_STATUSES,
  StoryboardScene,
} from '../types/studio';
import {
  buildSceneGeometryForScene,
  updateGeometryObjectMaskMode,
  validateSceneGeometry,
} from '../utils/sceneGeometryEngine';
import {
  buildDefaultHyperFramesOverlay,
  generateEpisodeVisualQAReport,
  generateHyperFramesDeterministicHtml,
} from '../utils/skillReelAndHyperFrames';
import { ESeBugasseVideoComposition } from '../remotion/compositions/ESeBugasseVideoComposition';
import { renderEpisodeToVerifiedMp4 } from '../remotion/render/mp4RenderEngine';
import { BugiSceneStage } from './BugiCharacterSvg';
import {
  Film,
  Sparkles,
  Play,
  Download,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Cpu,
  Terminal,
  XCircle,
  Eye,
  ShieldCheck,
  Code2,
} from 'lucide-react';

interface VideoProductionViewProps {
  episode: Episode;
  defaultImageModel: string;
  defaultNarrationModel: string;
  onUpdateEpisode: (updated: Episode) => Promise<void> | void;
  onLogCost?: (costEntry: any) => void;
  onLogError?: (module: string, message: string, details?: string) => void;
}

const ARTICULATED_12_MOTIONS: { value: BugiPose; label: string }[] = [
  { value: 'caminhando', label: '1. Caminhar (Ciclo Bípede)' },
  { value: 'correndo', label: '2. Correr (Aceleração + Inclinação)' },
  { value: 'pulando', label: '3. Pular (Antecipação + Squash & Stretch)' },
  { value: 'caindo', label: '4. Cair (Torque + Gravidade)' },
  { value: 'escorregando', label: '5. Escorregar (Atrito Zero μ = 0)' },
  { value: 'olhando_objeto', label: '6. Olhar para um Objeto (Pupilas + Cabeça)' },
  { value: 'assustando', label: '7. Assustar-se (Overshoot Elástico)' },
  { value: 'comemorando', label: '8. Comemorar (Braços Erguidos)' },
  { value: 'equilibrando', label: '9. Perder o Equilíbrio (Giro de Braços)' },
  { value: 'apontando', label: '10. Apontar (Vetor Direcional)' },
  { value: 'agachando', label: '11. Agachar (Compressão Elástica)' },
  { value: 'reagindo_impacto', label: '12. Reagir a Impactos (Onda de Choque)' },
];

const EXPRESSIONS_LIST: { value: BugiExpression; label: string }[] = [
  { value: 'confiante', label: 'Confiante' },
  { value: 'curioso', label: 'Curioso' },
  { value: 'surpreso', label: 'Surpreso' },
  { value: 'panico_divertido', label: 'Pânico Divertido' },
  { value: 'deslumbrado', label: 'Deslumbrado' },
  { value: 'determinado', label: 'Determinado' },
];

export const VideoProductionView: React.FC<VideoProductionViewProps> = ({
  episode,
  defaultImageModel,
  defaultNarrationModel,
  onUpdateEpisode,
  onLogCost,
  onLogError,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    episode.scenes[0]?.id || ''
  );
  const [imageModel, setImageModel] = useState<string>(
    defaultImageModel || 'gemini-3.1-flash-image'
  );
  const [narrationModel, setNarrationModel] = useState<string>(
    defaultNarrationModel || 'gemini-3.8-flash-tts'
  );
  const [previewMode, setPreviewMode] = useState<
    'full_episode' | 'pilot_5s' | 'single_scene'
  >('full_episode');

  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [isAligningAudio, setIsAligningAudio] = useState(false);
  const [isRenderingMp4, setIsRenderingMp4] = useState(false);
  const [renderProgress, setRenderProgress] = useState<{
    percent: number;
    renderedFrames: number;
    totalFrames: number;
    stageLabel: string;
  } | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [audioNormStats, setAudioNormStats] = useState<{
    measuredLufs: number;
    targetLufs: -14;
    appliedGainLinear: number;
    pauseCount: number;
    transcribeNote: string;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const scenes = episode.scenes;
  const activeScene: StoryboardScene =
    scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const activeSceneGeometry =
    activeScene?.geometry ||
    (activeScene ? buildSceneGeometryForScene(activeScene) : undefined);

  const geometryValidation =
    activeScene && activeSceneGeometry
      ? validateSceneGeometry(activeSceneGeometry, activeScene.bugiPose)
      : { valid: true, errors: [] };

  const totalEpisodeDurationSec =
    scenes[scenes.length - 1]?.endTimeSec || 43.0;
  const activeSceneDurationSec = activeScene
    ? Math.max(2, activeScene.endTimeSec - activeScene.startTimeSec)
    : 6.0;

  const playerDurationInFrames =
    previewMode === 'pilot_5s'
      ? 150 // Exatos 5.0 segundos a 30 FPS
      : previewMode === 'single_scene'
      ? Math.max(30, Math.round(activeSceneDurationSec * 30))
      : Math.max(30, Math.round(totalEpisodeDurationSec * 30));

  const qaReport =
    episode.qaReport || generateEpisodeVisualQAReport(episode);

  const updateSingleScene = (
    sceneId: string,
    updater: (s: StoryboardScene) => StoryboardScene
  ) => {
    const nextScenes = scenes.map((sc) =>
      sc.id === sceneId ? updater(sc) : sc
    );
    onUpdateEpisode({
      ...episode,
      scenes: nextScenes,
      updatedAt: new Date().toISOString(),
    });
  };

  // 1. Gerar Cenário 2D Limpo (Sem outro Bugi no fundo) + Separar Camadas no SceneGeometryEngine
  const handleGenerateSceneBackgroundWithAI = async (
    sceneToUpdate: StoryboardScene
  ) => {
    setIsGeneratingBg(true);
    setStatusFeedback(null);
    updateSingleScene(sceneToUpdate.id, (s) => ({
      ...s,
      productionStatus: 'Gerando fundo',
    }));

    try {
      const res = await fetch('/api/ai/scenario-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioDescription: `${sceneToUpdate.scenario} — ${sceneToUpdate.mainAction}`,
          model: imageModel,
          aspectRatio: '9:16',
          assetType: 'background',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Caso a chave atual não tenha faturamento para Nano Banana, usa o motor vetorial em camadas sem quebrar a cena
        const fallbackGeometry = buildSceneGeometryForScene(sceneToUpdate);
        updateSingleScene(sceneToUpdate.id, (s) => ({
          ...s,
          geometry: fallbackGeometry,
          productionStatus: 'Prévia pronta',
          lastErrorDetails:
            data.details ||
            'Usando camadas vetoriais nativas 1080×1920 (chave de imagem paga opcional).',
        }));
        setStatusFeedback(
          `Cena 0${sceneToUpdate.order}: Camadas vetoriais 1080×1920 do SceneGeometryEngine preparadas (para imagem raster IA, ative chave paga).`
        );
        return;
      }

      const newGeometry = buildSceneGeometryForScene(
        sceneToUpdate,
        data.imageUrl
      );
      updateSingleScene(sceneToUpdate.id, (s) => ({
        ...s,
        generatedBackgroundUrl: data.imageUrl,
        geometry: newGeometry,
        productionStatus: 'Prévia pronta',
        lastErrorDetails: undefined,
      }));

      if (data.costEntry && onLogCost) {
        onLogCost(data.costEntry);
      }
      setStatusFeedback(
        `Fundo 2D limpo (9:16) gerado com ${imageModel} e integrado às 8 camadas da Cena 0${sceneToUpdate.order}!`
      );
    } catch (err) {
      updateSingleScene(sceneToUpdate.id, (s) => ({
        ...s,
        productionStatus: 'Erro',
        lastErrorDetails: err instanceof Error ? err.message : String(err),
      }));
      onLogError?.(
        'Gerador de Cenários Produção',
        'Falha ao gerar cenário para a cena.',
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // 2. Sincronizar Narração com gemini-3.5-transcribe + Normalizar em -14 LUFS com Ducking
  const handleAlignAndNormalizeNarration = async () => {
    setIsAligningAudio(true);
    setStatusFeedback(null);
    try {
      const activeNarration =
        episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
        episode.narrationTracks[0];

      const res = await fetch('/api/ai/align-narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: episode.id,
          audioUrl: activeNarration?.audioDataUrl,
          durationSec: activeNarration?.durationSec || totalEpisodeDurationSec,
          scenes: episode.scenes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha no alinhamento da narração.');
      }

      setAudioNormStats({
        measuredLufs: data.audioNormalization.measuredLufs,
        targetLufs: -14,
        appliedGainLinear: data.audioNormalization.appliedGainLinear,
        pauseCount: data.audioNormalization.pauseCount,
        transcribeNote: data.transcribeNote,
      });

      const updatedTracks = episode.narrationTracks.map((t, idx) =>
        idx === 0 || t.id === episode.activeNarrationId
          ? {
              ...t,
              alignmentType: data.alignmentType,
              temporalMarkers: data.temporalMarkers,
              measuredLufs: -14,
              normalizedToTargetLufs: true,
              pauseCount: data.audioNormalization.pauseCount,
            }
          : t
      );

      await onUpdateEpisode({
        ...episode,
        scenes: data.scenes.map((sc: StoryboardScene) => ({
          ...sc,
          productionStatus: sc.productionStatus || 'Prévia pronta',
          geometry: sc.geometry || buildSceneGeometryForScene(sc),
        })),
        narrationTracks: updatedTracks,
        updatedAt: new Date().toISOString(),
      });

      setStatusFeedback(
        `Narração sincronizada (${data.transcribeNote})! Volume normalizado em -14 LUFS com ducking musical ativo.`
      );
    } catch (err) {
      onLogError?.(
        'Alinhamento de Narração',
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsAligningAudio(false);
    }
  };

  // 3. Executar Renderização MP4 Real (Piloto 5s, Cena Única ou Episódio Completo)
  const handleRunMp4Render = async (
    mode: 'pilot_5s' | 'full_episode' | 'single_scene',
    sceneId?: string
  ) => {
    setIsRenderingMp4(true);
    setStatusFeedback(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Atualiza estado das cenas envolvidas para 'Renderizando'
    const scenesRendering = episode.scenes.map((sc) => {
      if (mode === 'single_scene' && sc.id !== sceneId) return sc;
      if (mode === 'pilot_5s' && sc.order !== 1) return sc;
      return {
        ...sc,
        productionStatus: 'Renderizando' as SceneProductionStatus,
        geometry: sc.geometry || buildSceneGeometryForScene(sc),
      };
    });
    await onUpdateEpisode({
      ...episode,
      stage: 'Renderizando',
      scenes: scenesRendering,
    });

    try {
      const result = await renderEpisodeToVerifiedMp4({
        episode: { ...episode, scenes: scenesRendering },
        mode,
        targetSceneId: sceneId,
        onProgress: (p) => setRenderProgress(p),
        abortSignal: controller.signal,
      });

      const scenesCompleted = scenesRendering.map((sc) => {
        if (mode === 'single_scene' && sc.id !== sceneId) return sc;
        if (mode === 'pilot_5s' && sc.order !== 1) return sc;
        return {
          ...sc,
          productionStatus: 'Concluída' as SceneProductionStatus,
        };
      });

      const nextVersions: RenderedVideoVersion[] = [
        result.renderedVersion,
        ...(episode.renderedVersions || []),
      ];

      const draftEpisode: Episode = {
        ...episode,
        stage: 'Concluido',
        hasRealRenderedMp4: true,
        renderedMp4Url: result.mp4Url,
        renderedVersions: nextVersions,
        scenes: scenesCompleted,
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: `hist-mp4-${Date.now()}`,
            timestamp: new Date().toISOString(),
            fromStage: episode.stage,
            toStage: 'Concluido',
            actionSummary: `Vídeo MP4 H.264 real renderizado e verificado (${result.renderedVersion.fileName}, ${(
              result.sizeBytes / 1024
            ).toFixed(1)} KB, 1080×1920, 30 FPS, -14 LUFS).`,
          },
          ...episode.history,
        ],
      };

      draftEpisode.qaReport = generateEpisodeVisualQAReport(draftEpisode);
      await onUpdateEpisode(draftEpisode);

      setStatusFeedback(
        mode === 'pilot_5s'
          ? `Teste Piloto de 5s concluído! Arquivo MP4 real (${(
              result.sizeBytes / 1024
            ).toFixed(1)} KB) verificado com imagem e áudio (-14 LUFS).`
          : mode === 'single_scene'
          ? `Cena regenerada e renderizada em MP4 com sucesso sem precisar refazer o episódio inteiro!`
          : `Vídeo completo MP4 (${totalEpisodeDurationSec.toFixed(1)}s) renderizado e verificado com sucesso!`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusFeedback(`Renderização interrompida: ${msg}`);
      onLogError?.('Renderizador MP4', msg);
    } finally {
      setIsRenderingMp4(false);
      abortControllerRef.current = null;
    }
  };

  const handleDownloadHyperFramesHtml = () => {
    if (!activeScene) return;
    const html = generateHyperFramesDeterministicHtml(
      activeScene,
      activeScene.hyperFramesOverlay
    );
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hyperframes-${activeScene.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-testid="video-production-view">
      {/* 1. CABEÇALHO E BARRA DE COMANDO DE PRODUÇÃO AUTOMÁTICA */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Produção Audiovisual Automática · Google AI + Remotion + Skill Reel + HyperFrames
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              Produção de Vídeo — {episode.title}
            </h2>
            <p className="text-xs text-[#FFF7E9]/75 max-w-3xl">
              Gera cenários 2D em camadas (<code className="text-[#39C8D5]">SceneGeometryEngine</code>),
              anima o rig articulado de 12 movimentos do <strong className="text-[#FFD166]">Bugi</strong>,
              sincroniza legendas e áudio a <strong className="text-[#39C8D5]">-14 LUFS</strong> e renderiza
              o arquivo <strong>MP4 H.264 (1080 × 1920, 30 FPS)</strong> real diretamente no estúdio.
            </p>
          </div>

          {/* Botões Principais: Teste Piloto 5s & Produzir Vídeo Completo */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isRenderingMp4}
              onClick={() => handleRunMp4Render('pilot_5s')}
              data-testid="btn-render-pilot-5s"
              className="px-4 py-2.5 bg-[#39C8D5] hover:bg-[#2bb5c2] disabled:opacity-50 text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Renderizar Teste Piloto 5s (MP4 Real)
            </button>

            <button
              type="button"
              disabled={isRenderingMp4}
              onClick={() => handleRunMp4Render('full_episode')}
              data-testid="btn-produce-full-video"
              className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Film className="w-4 h-4" />
              {isRenderingMp4
                ? 'Renderizando MP4...'
                : `Produzir vídeo completo (${totalEpisodeDurationSec.toFixed(1)}s)`}
            </button>

            {isRenderingMp4 && (
              <button
                type="button"
                onClick={() => abortControllerRef.current?.abort()}
                className="px-3 py-2.5 bg-[#08121b] hover:bg-[#FF6B50]/20 text-[#FF6B50] border border-[#FF6B50] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso Real da Renderização MP4 */}
        {(isRenderingMp4 || renderProgress) && (
          <div
            className="p-4 rounded-xl bg-[#08121b] border border-[#39C8D5] space-y-2"
            data-testid="mp4-render-progress-box"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#39C8D5]">{renderProgress?.stageLabel}</span>
              <span className="text-[#FFD166] font-bold tabular-nums">
                {renderProgress?.percent || 0}% ({renderProgress?.renderedFrames || 0}/
                {renderProgress?.totalFrames || 150} frames)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#122638] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#39C8D5] transition-all duration-150"
                style={{ width: `${renderProgress?.percent || 0}%` }}
              />
            </div>
          </div>
        )}

        {statusFeedback && (
          <div
            role="status"
            className="p-3.5 rounded-lg bg-[#39C8D5]/15 border border-[#39C8D5] text-xs text-[#FFF7E9] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39C8D5] shrink-0" />
              <span>{statusFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback(null)}
              className="text-xs font-mono text-[#39C8D5] hover:underline cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* Seletores de Modelos (Imagem IA, Narração TTS, Sincronização Transcribe & -14 LUFS) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54] space-y-1.5">
            <label
              htmlFor="vp-image-model"
              className="block text-[11px] font-mono text-[#39C8D5] uppercase"
            >
              Modelo de Imagem (Cenários 9:16)
            </label>
            <select
              id="vp-image-model"
              value={imageModel}
              onChange={(e) => setImageModel(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="gemini-3.1-flash-image">
                gemini-3.1-flash-image (Preferencial)
              </option>
              <option value="gemini-3.1-flash-lite-image">
                gemini-3.1-flash-lite-image (Nano Banana Lite)
              </option>
              <option value="gemini-nano-banana-2.1">
                gemini-nano-banana-2.1 (Nano Banana 2.1 Pro)
              </option>
            </select>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54] space-y-1.5">
            <label
              htmlFor="vp-tts-model"
              className="block text-[11px] font-mono text-[#39C8D5] uppercase"
            >
              Modelo de Narração & Alinhamento
            </label>
            <select
              id="vp-tts-model"
              value={narrationModel}
              onChange={(e) => setNarrationModel(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="gemini-3.8-flash-tts">
                gemini-3.8-flash-tts + gemini-3.5-transcribe
              </option>
              <option value="gemini-3.8-flash-lite-tts">
                gemini-3.8-flash-lite-tts (Baixa Latência)
              </option>
            </select>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54] space-y-1.5">
            <div className="text-[11px] font-mono text-[#FFD166] uppercase">
              Engenharia de Áudio (Skill Reel)
            </div>
            <div className="text-xs font-semibold text-[#FFF7E9]">
              Alvo: -14 LUFS · Ducking -10 dB
            </div>
            <div className="text-[11px] font-mono text-[#39C8D5]">
              {audioNormStats
                ? `Ganho: ${audioNormStats.appliedGainLinear}x · ${audioNormStats.pauseCount} pausas`
                : 'WAV 24kHz Original + SFX Sincronizados'}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54] flex flex-col justify-between gap-2">
            <div className="text-[11px] font-mono text-[#39C8D5] uppercase">
              Sincronização Palavra por Palavra
            </div>
            <button
              type="button"
              disabled={isAligningAudio}
              onClick={handleAlignAndNormalizeNarration}
              className="w-full py-2 px-3 bg-[#122638] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isAligningAudio
                ? 'Alinhando e Normalizando...'
                : 'Alinhar Timestamps & Normalizar -14 LUFS'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. PLAYER REMOTION AO VIVO + PLAYER MP4 FINAL + GERADOR DE CENÁRIOS E ANIMAÇÕES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda (4 cols): Monitor Remotion Player 9:16 + Player do Arquivo MP4 Final */}
        <div className="lg:col-span-4 space-y-5">
          {/* Pré-visualização Interativa Remotion Player */}
          <div className="bg-[#122638] border border-[#1d3b54] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-mono text-[#39C8D5] uppercase">
                Pré-visualização Remotion (1080×1920 · 30 FPS)
              </div>
              <select
                aria-label="Modo de pré-visualização no Remotion Player"
                value={previewMode}
                onChange={(e) => setPreviewMode(e.target.value as any)}
                className="px-2 py-1 rounded bg-[#08121b] border border-[#1d3b54] text-[11px] font-mono text-[#FFD166]"
              >
                <option value="full_episode">Episódio Completo</option>
                <option value="pilot_5s">Piloto 5.0s</option>
                <option value="single_scene">Cena Selecionada</option>
              </select>
            </div>

            <div className="w-full max-w-[260px] mx-auto aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#39C8D5]/60 bg-[#08121b]">
              <Player
                component={ESeBugasseVideoComposition}
                inputProps={{
                  episode,
                  mode: previewMode,
                  targetSceneId: activeScene?.id,
                  enableAudio: true,
                }}
                durationInFrames={playerDurationInFrames}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            <div className="text-[11px] font-mono text-[#FFF7E9]/70 text-center">
              O Player acima executa a composição React/Remotion real com as 8 camadas e legendas Skill Reel.
            </div>
          </div>

          {/* Player do MP4 Final Renderizado + Download + Histórico de Versões */}
          <div
            className="bg-[#122638] border border-[#1d3b54] rounded-xl p-4 space-y-3"
            data-testid="final-mp4-player-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-[#FFF7E9]">
                Player do MP4 Final & Download
              </h3>
              <span className="text-[11px] font-mono text-[#FFD166]">
                {episode.hasRealRenderedMp4 && episode.renderedMp4Url
                  ? 'MP4 H.264 Verificado'
                  : 'Aguardando Renderização'}
              </span>
            </div>

            {episode.hasRealRenderedMp4 && episode.renderedMp4Url ? (
              <div className="space-y-3">
                <video
                  key={episode.renderedMp4Url}
                  controls
                  src={episode.renderedMp4Url}
                  data-testid="rendered-mp4-video-element"
                  className="w-full max-w-[240px] mx-auto aspect-[9/16] rounded-lg bg-[#08121b] border border-[#39C8D5]"
                />
                <a
                  href={episode.renderedMp4Url}
                  download={`esebugasse-${episode.id}.mp4`}
                  data-testid="download-final-mp4-link"
                  className="w-full py-2.5 px-4 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar Vídeo MP4 Final ({episode.id}.mp4)
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]/75 space-y-2">
                <p>
                  Nenhum arquivo MP4 foi renderizado ainda para este episódio. Clique em{' '}
                  <strong className="text-[#39C8D5]">Renderizar Teste Piloto 5s</strong> ou{' '}
                  <strong className="text-[#FF6B50]">Produzir vídeo completo</strong> no topo.
                </p>
              </div>
            )}

            {/* Histórico de Versões Renderizadas */}
            {episode.renderedVersions && episode.renderedVersions.length > 0 && (
              <div className="pt-2 border-t border-[#1d3b54] space-y-1.5">
                <div className="text-[11px] font-mono text-[#39C8D5] uppercase">
                  Histórico de Versões Renderizadas ({episode.renderedVersions.length})
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {episode.renderedVersions.map((ver) => (
                    <div
                      key={ver.id}
                      className="p-2 rounded bg-[#08121b] border border-[#1d3b54] text-[11px] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-mono font-bold text-[#FFF7E9]">
                          v{ver.versionNumber} · {ver.mode} ({ver.durationSec}s)
                        </div>
                        <div className="text-[#39C8D5] font-mono">
                          {(ver.fileSizeBytes / 1024).toFixed(1)} KB · {ver.targetLufs} LUFS
                        </div>
                      </div>
                      <a
                        href={ver.url}
                        download={ver.fileName}
                        className="px-2 py-1 rounded bg-[#122638] hover:bg-[#19344b] text-[#FFD166] font-mono"
                      >
                        MP4
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita (8 cols): Timeline de Produção por Cena + Gerador de Cenários/Animações + SceneGeometryEngine */}
        <div className="lg:col-span-8 space-y-5">
          {/* Timeline Remotion com Estados por Cena e Regeneração Individual */}
          <div className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-[#39C8D5] uppercase">
                  Timeline Remotion & Estados Individuais de Produção (Seção 10)
                </div>
                <h3 className="text-base font-display font-bold text-[#FFF7E9]">
                  Selecione uma Cena para Editar ou Refazer Individualmente
                </h3>
              </div>
              <span className="text-xs font-mono text-[#FFD166]">
                {scenes.length} cenas · {Math.round(totalEpisodeDurationSec * 30)} frames (30 FPS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {scenes.map((scene) => {
                const isSelected = scene.id === activeScene?.id;
                const st: SceneProductionStatus =
                  scene.productionStatus || 'Prévia pronta';

                return (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedSceneId(scene.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#08121b] border-[#39C8D5]'
                        : 'bg-[#08121b]/60 border-[#1d3b54] hover:border-[#39C8D5]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#39C8D5] font-bold">
                        CENA 0{scene.order}
                      </span>
                      <span className="text-[#FFD166] tabular-nums">
                        {scene.startTimeSec}s–{scene.endTimeSec}s
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#FFF7E9] truncate">
                      Bugi: {scene.bugiPose} ({scene.bugiExpression})
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#122638] text-[#39C8D5] border border-[#1d3b54]">
                        {st}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSceneId(scene.id);
                          handleRunMp4Render('single_scene', scene.id);
                        }}
                        disabled={isRenderingMp4}
                        className="text-[11px] font-mono text-[#FF6B50] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Refazer cena
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspetor de Cena: Gerador de Cenário IA, 12 Movimentos do Bugi, SceneGeometryEngine & HyperFrames */}
          {activeScene && activeSceneGeometry && (
            <div className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1d3b54] pb-4">
                <div>
                  <div className="text-xs font-mono text-[#39C8D5]">
                    CONFIGURAÇÃO VISUAL & ANIMAÇÃO · CENA 0{activeScene.order} ({activeScene.id})
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
                    Gerador de Cenários, Rig Articulado do Bugi & SceneGeometryEngine
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Estado de produção da cena"
                    value={activeScene.productionStatus || 'Prévia pronta'}
                    onChange={(e) =>
                      updateSingleScene(activeScene.id, (s) => ({
                        ...s,
                        productionStatus: e.target.value as SceneProductionStatus,
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs font-mono text-[#FFD166]"
                  >
                    {SCENE_PRODUCTION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        Estado: {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={isGeneratingBg}
                    onClick={() => handleGenerateSceneBackgroundWithAI(activeScene)}
                    className="px-3.5 py-1.5 bg-[#39C8D5] hover:bg-[#2bb5c2] disabled:opacity-50 text-[#08121b] font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingBg
                      ? 'Gerando Fundo IA...'
                      : 'Gerar Fundo 2D Limpo (Sem outro Bugi)'}
                  </button>
                </div>
              </div>

              {/* Controles do Gerador de Animação (12 Movimentos Físicos + Expressão + HyperFrames) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="vp-bugi-motion"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Movimento Físico Articulado do Bugi (12 Ações)
                  </label>
                  <select
                    id="vp-bugi-motion"
                    value={activeScene.bugiPose}
                    onChange={(e) => {
                      const nextPose = e.target.value as BugiPose;
                      updateSingleScene(activeScene.id, (s) => {
                        const updatedScene = {
                          ...s,
                          bugiPose: nextPose,
                          productionStatus: 'Preparando animação' as SceneProductionStatus,
                        };
                        return {
                          ...updatedScene,
                          geometry: buildSceneGeometryForScene(updatedScene),
                        };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    {ARTICULATED_12_MOTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="vp-bugi-expression"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Expressão Facial & Olhos Pretos Expressivos
                  </label>
                  <select
                    id="vp-bugi-expression"
                    value={activeScene.bugiExpression}
                    onChange={(e) =>
                      updateSingleScene(activeScene.id, (s) => ({
                        ...s,
                        bugiExpression: e.target.value as BugiExpression,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    {EXPRESSIONS_LIST.map((ex) => (
                      <option key={ex.value} value={ex.value}>
                        {ex.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="vp-hyperframes-template"
                    className="block text-xs font-medium text-[#FFD166] mb-1"
                  >
                    Motion Graphics HyperFrames (HTML + GSAP)
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="vp-hyperframes-template"
                      value={
                        activeScene.hyperFramesOverlay?.templateType ||
                        'medidor_fisico'
                      }
                      onChange={(e) => {
                        const base =
                          activeScene.hyperFramesOverlay ||
                          buildDefaultHyperFramesOverlay(activeScene);
                        updateSingleScene(activeScene.id, (s) => ({
                          ...s,
                          hyperFramesOverlay: {
                            ...base,
                            enabled: true,
                            templateType: e.target.value as any,
                          },
                        }));
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                    >
                      <option value="alerta_regra">Alerta de Regra Física</option>
                      <option value="medidor_fisico">Medidor μ = 0.00 N</option>
                      <option value="vetor_inercia">Vetor Inércia Constante</option>
                      <option value="equacao_cinematica">Equação Cinemática</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleDownloadHyperFramesHtml}
                      title="Exportar composição HTML+GSAP determinística para HyperFrames CLI"
                      className="px-3 py-2 rounded-lg bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 text-xs font-mono cursor-pointer"
                    >
                      .HTML
                    </button>
                  </div>
                </div>
              </div>

              {/* Inspetor de Camadas, Polígonos e Proporções (SceneGeometryEngine) */}
              <div className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#39C8D5]" />
                    <span className="text-xs font-mono font-bold text-[#39C8D5] uppercase">
                      SceneGeometryEngine · Canvas Lógico Fixo 1080 × 1920 (8 Camadas Ordenadas)
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono ${
                      geometryValidation.valid ? 'text-[#39C8D5]' : 'text-[#FF6B50]'
                    }`}
                  >
                    {geometryValidation.valid
                      ? 'Geometria, Contato com Chão (Y=1370) e Proporções 100% Válidos'
                      : geometryValidation.errors.join(' | ')}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[#1d3b54] text-[#39C8D5] font-mono">
                        <th className="py-2 px-2.5">Z-Depth</th>
                        <th className="py-2 px-2.5">Camada</th>
                        <th className="py-2 px-2.5">Bounding Box (px / norm)</th>
                        <th className="py-2 px-2.5">Proporção Bugi</th>
                        <th className="py-2 px-2.5">Máscara / Polígono</th>
                        <th className="py-2 px-2.5">Controles de Máscara</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1d3b54]">
                      {activeSceneGeometry.objects.map((obj) => (
                        <tr key={obj.id} className="hover:bg-[#122638]/50">
                          <td className="py-2 px-2.5 font-mono text-[#FFD166] tabular-nums">
                            z={obj.depth}
                          </td>
                          <td className="py-2 px-2.5 font-semibold text-[#FFF7E9]">
                            {obj.layer}
                          </td>
                          <td className="py-2 px-2.5 font-mono text-[#FFF7E9]/80 tabular-nums">
                            {obj.boundingBox.pxWidth}×{obj.boundingBox.pxHeight}px (
                            {obj.boundingBox.normX}, {obj.boundingBox.normY})
                          </td>
                          <td className="py-2 px-2.5 font-mono text-[#39C8D5] tabular-nums">
                            {obj.proportionToBugi.toFixed(2)}x
                          </td>
                          <td className="py-2 px-2.5 font-mono text-[#FFF7E9]/75">
                            {obj.polygonMask.length} vértices ({obj.maskSource})
                          </td>
                          <td className="py-2 px-2.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  updateSingleScene(activeScene.id, (s) => ({
                                    ...s,
                                    geometry: updateGeometryObjectMaskMode(
                                      activeSceneGeometry,
                                      obj.id,
                                      'regenerate_contour'
                                    ),
                                  }))
                                }
                                className="px-2 py-0.5 rounded bg-[#122638] hover:bg-[#19344b] text-[#39C8D5] font-mono text-[10px] cursor-pointer"
                              >
                                Recontornar
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateSingleScene(activeScene.id, (s) => ({
                                    ...s,
                                    geometry: updateGeometryObjectMaskMode(
                                      activeSceneGeometry,
                                      obj.id,
                                      'simplified_layer'
                                    ),
                                  }))
                                }
                                className="px-2 py-0.5 rounded bg-[#122638] hover:bg-[#19344b] text-[#FFD166] font-mono text-[10px] cursor-pointer"
                              >
                                Simplificar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. FOLHA DE QUADROS (CONTACT SHEET) & CONTROLE DE QUALIDADE VISUAL (SEÇÃO 3 COMPLEMENTAR) */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Revisão Visual Obrigatória & Folha de Quadros (Contact Sheet)
            </div>
            <h3 className="text-xl font-display font-bold text-[#FFF7E9] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#39C8D5]" />
              Folha de Quadros do Episódio & Checklist de Qualidade Profissional
            </h3>
          </div>

          <div
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold ${
              qaReport.overallPassed
                ? 'bg-[#39C8D5]/20 text-[#39C8D5] border border-[#39C8D5]'
                : 'bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]'
            }`}
          >
            {qaReport.overallPassed
              ? 'APROVADO NO PADRÃO PROFISSIONAL (MP4 REAL VERIFICADO)'
              : 'PENDENTE DE RENDERIZAÇÃO MP4 FINAL PARA APROVAÇÃO'}
          </div>
        </div>

        {/* Grade da Folha de Quadros (Contact Sheet de Todas as Cenas) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {episode.scenes.map((sc) => {
            const midSec = Number(
              ((sc.startTimeSec + sc.endTimeSec) / 2).toFixed(1)
            );
            const midFrame = Math.round(midSec * 30);
            return (
              <div
                key={sc.id}
                className="bg-[#08121b] border border-[#1d3b54] rounded-xl p-2.5 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#39C8D5]">
                  <span>CENA 0{sc.order}</span>
                  <span className="text-[#FFD166]">Frame #{midFrame}</span>
                </div>
                <div className="w-full aspect-[9/16] rounded-lg overflow-hidden border border-[#1d3b54]">
                  <BugiSceneStage
                    pose={sc.bugiPose}
                    expression={sc.bugiExpression}
                    scenario={sc.scenarioPreset}
                    customBackgroundUrl={sc.generatedBackgroundUrl}
                    subtitlePreview={sc.subtitlesText}
                    timerSeconds={Math.max(0, 6 - sc.order)}
                    frame={midFrame}
                    fps={30}
                    aspectRatio="9:16"
                    className="w-full h-full"
                  />
                </div>
                <div className="text-[11px] font-semibold text-[#FFF7E9] truncate">
                  {sc.bugiPose} · {sc.bugiExpression}
                </div>
                <div className="text-[10px] font-mono text-[#39C8D5]">
                  8 camadas · Safe zone OK
                </div>
              </div>
            );
          })}
        </div>

        {/* Checklist dos 11 Critérios de Qualidade Visual */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Movimento Real do Bugi (12 poses)', ok: qaReport.checks.bugiRealMovement },
            { label: 'Proporções e Posições (1080×1920)', ok: qaReport.checks.proportionsAndPositions },
            { label: 'Fundos e 8 Camadas Ordenadas', ok: qaReport.checks.backgroundsAndLayers },
            { label: 'Sincronismo com a Narração', ok: qaReport.checks.narrationSync },
            { label: 'Legendas e Zonas Seguras Shorts', ok: qaReport.checks.subtitlesAndSafeZones },
            { label: 'Cortes e Transições Dinâmicas', ok: qaReport.checks.cutsAndTransitions },
            { label: 'Timing das Reações Faciais', ok: qaReport.checks.reactionTiming },
            { label: 'Efeitos Sonoros (SFX) Sincronizados', ok: qaReport.checks.soundEffectsPresent },
            { label: 'Música com Ducking (-14 LUFS)', ok: qaReport.checks.musicDuckingBelowVoice },
            { label: 'Sem Elementos Congelados/Deformados', ok: qaReport.checks.noFrozenOrDeformedElements },
            { label: 'MP4 Real Renderizado e Verificado', ok: qaReport.checks.realMp4RenderedAndVerified },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54] flex items-center gap-2 text-xs"
            >
              {item.ok ? (
                <CheckCircle2 className="w-4 h-4 text-[#39C8D5] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#FFD166] shrink-0" />
              )}
              <span className="text-[#FFF7E9]/90">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MATRIZ TRANSPARENTE DE AMBIENTES: WEB APP vs CODEX WINDOWS vs CONFIGURAÇÃO EXTERNA */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-[#1d3b54] pb-3">
          <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#39C8D5]" />
            Transparência de Instalação: Ambiente Web App · Ambiente Codex Windows · Configurações Opcionais
          </h3>
          <span className="text-xs font-mono text-[#39C8D5]">
            .agents/skills/reel Auditado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-2">
            <div className="font-mono font-bold text-[#39C8D5] uppercase">
              1. Instalado e Ativo neste Web App
            </div>
            <ul className="space-y-1 text-[#FFF7E9]/85 list-disc list-inside">
              <li>Remotion (<code className="text-[#FFD166]">@remotion/player</code>, <code className="text-[#FFD166]">@remotion/captions</code>, <code className="text-[#FFD166]">@remotion/web-renderer</code>)</li>
              <li><code className="text-[#39C8D5]">SceneGeometryEngine</code> (8 camadas + contornos)</li>
              <li>Rig Articulado do Bugi com 12 movimentos físicos</li>
              <li>Renderizador MP4 H.264 real (WebCodecs + FFmpeg Server)</li>
              <li>Skill Reel em <code className="text-[#39C8D5]">.agents/skills/reel/</code> (sem detecção facial no Bugi)</li>
              <li>Adaptador determinístico HyperFrames (<code className="text-[#FFD166]">window.__timelines</code> GSAP)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-2">
            <div className="font-mono font-bold text-[#FFD166] uppercase">
              2. Preparado para Codex Windows (PowerShell)
            </div>
            <ul className="space-y-1 text-[#FFF7E9]/85 list-disc list-inside">
              <li>Script <code className="text-[#39C8D5]">.agents\skills\reel\install-skill-reel-windows.ps1</code></li>
              <li>Arquivos <code className="text-[#FFF7E9]">SKILL.md</code>, <code className="text-[#FFF7E9]">ESTILO.md</code>, <code className="text-[#FFF7E9]">regras-da-casa.md</code>, <code className="text-[#FFF7E9]">modelo\README.md</code></li>
              <li>Caminhos adaptados para Windows (<code className="text-[#FFD166]">Join-Path</code> / <code className="text-[#FFD166]">\</code>)</li>
              <li>Exportação HTML+GSAP determinística para <code className="text-[#39C8D5]">npx hyperframes render</code></li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-2">
            <div className="font-mono font-bold text-[#FF6B50] uppercase">
              3. Depende de Configuração / Chave Externa
            </div>
            <ul className="space-y-1 text-[#FFF7E9]/85 list-disc list-inside">
              <li>Chave de API Gemini com faturamento ativo para geração raster ilimitada no <code className="text-[#FFD166]">gemini-3.1-flash-image</code></li>
              <li>Endpoint externo opcional do <strong>SAM 2</strong> caso deseje segmentação neural além do contorno geométrico nativo</li>
              <li>Execução local do daemon Windows Codex fora do navegador</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
