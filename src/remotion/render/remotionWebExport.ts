/**
 * Exportação REAL da mesma composição React/Remotion exibida no Player.
 * Nunca substitui cenas por uma implementação Canvas ou cria uma voz artificial.
 * Documentação: https://www.remotion.dev/docs/web-renderer/render-media-on-web
 */
import { renderMediaOnWeb } from '@remotion/web-renderer';
import type { Episode, RenderedVideoVersion } from '../../types/studio';
import { ESeBugasseVideoComposition } from '../compositions/ESeBugasseVideoComposition';
import { verifyValidMp4Buffer, type RenderProgressCallback } from './mp4RenderEngine';

export type ProductionRenderMode =
  | 'pilot_12s' | 'pilot_8s' | 'pilot_5s' | 'full_episode' | 'single_scene';

export async function renderEpisodeWithRemotion(params: {
  episode: Episode;
  mode: ProductionRenderMode;
  targetSceneId?: string;
  onProgress: RenderProgressCallback;
  abortSignal?: AbortSignal;
}): Promise<{
  renderedVersion: RenderedVideoVersion;
  mp4Url: string;
  contactSheetUrl?: string;
  sizeBytes: number;
}> {
  const { episode, mode, targetSceneId, onProgress, abortSignal } = params;
  const fps = 30;
  const narration = episode.narrationTracks.find(
    (n) => n.id === episode.activeNarrationId
  ) || episode.narrationTracks[0];

  // Os WAVs sintéticos do seed não são uma narração real.
  if (!narration?.audioDataUrl ||
      (narration.audioDataUrl.startsWith('data:') && !narration.isManualUpload)) {
    throw new Error(
      'Não há narração real aprovada. Gere o áudio pelo Gemini TTS ou envie um áudio antes de renderizar.'
    );
  }

  if (episode.scenes.length === 0) {
    throw new Error('O episódio não tem cenas. Gere o storyboard antes da exportação.');
  }

  const sceneToRender = mode === 'single_scene'
    ? episode.scenes.find((s) => s.id === targetSceneId)
    : undefined;
  if (mode === 'single_scene' && !sceneToRender) {
    throw new Error('A cena selecionada para renderização não foi encontrada.');
  }

  const targetScenes = sceneToRender ? [sceneToRender] : episode.scenes;
  const missingBackground = targetScenes.find((s) => !s.generatedBackgroundUrl);
  if (missingBackground) {
    throw new Error(
      `A cena "${missingBackground.id}" não possui cenário gerado pela IA. Não será substituída silenciosamente por desenhos geométricos.`
    );
  }

  const durationSec = mode === 'pilot_12s' ? 12 :
    mode === 'pilot_8s' ? 8 :
    mode === 'pilot_5s' ? 5 :
    sceneToRender ? Math.max(1, sceneToRender.endTimeSec - sceneToRender.startTimeSec) :
    Math.max(1, episode.scenes[episode.scenes.length - 1]?.endTimeSec || 1);
  const totalFrames = Math.max(1, Math.round(durationSec * fps));

  if (abortSignal?.aborted) {
    throw new Error('Renderização cancelada.');
  }

  onProgress({
    percent: 0, renderedFrames: 0, totalFrames,
    stageLabel: 'Iniciando a renderização real da composição Remotion...',
  });

  const { getBlob } = await renderMediaOnWeb({
    composition: {
      id: 'ESeBugasse-Producao',
      component: ESeBugasseVideoComposition,
      durationInFrames: totalFrames,
      fps,
      width: 1080,
      height: 1920,
      defaultProps: { episode, mode, targetSceneId, enableAudio: true },
    },
    inputProps: { episode, mode, targetSceneId, enableAudio: true },
    container: 'mp4',
    videoCodec: 'h264',
    videoBitrate: 'high',
    signal: abortSignal,
    onProgress: (state) => {
      onProgress({
        percent: Math.min(90, Math.round(state.progress * 90)),
        renderedFrames: Math.min(totalFrames, state.encodedFrames),
        totalFrames,
        stageLabel: 'Renderizando cenas, personagem e áudio pelo Remotion...',
      });
    },
  });

  const blob = await getBlob();
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const validation = verifyValidMp4Buffer(bytes);
  if (!validation.valid || validation.sizeBytes < 1024) {
    throw new Error(validation.reason || 'O Remotion retornou um MP4 inválido.');
  }

  // A API persiste o MP4 REAL do Remotion; ela não gera novos quadros nem voz.
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  onProgress({
    percent: 92, renderedFrames: totalFrames, totalFrames,
    stageLabel: 'Verificando e salvando o MP4 real...',
  });

  const response = await fetch('/api/video/render-mp4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: abortSignal,
    body: JSON.stringify({
      episodeId: episode.id,
      mode,
      durationSec,
      fps,
      clientEncodedMp4Base64: btoa(binary),
    }),
  });
  const result = await response.json();
  if (!response.ok || !result?.mp4Url || result?.engine !== 'remotion_webcodecs') {
    throw new Error(result?.details || result?.error ||
      'Falha na validação do MP4 renderizado pelo Remotion.');
  }

  const renderedVersion: RenderedVideoVersion = {
    id: `rv-${episode.id}-${Date.now()}`,
    versionNumber: (episode.renderedVersions?.length || 0) + 1,
    createdAt: new Date().toISOString(),
    episodeId: episode.id,
    mode,
    sceneId: targetSceneId,
    engine: 'remotion_webcodecs',
    url: result.mp4Url,
    fileName: result.fileName,
    fileSizeBytes: result.sizeBytes,
    durationSec: result.durationSec ?? durationSec,
    width: 1080, height: 1920, fps: 30,
    codec: 'h264',
    hasAudioTrack: true,
    targetLufs: -14,
    qaPassed: false, // QA visual/artístico não é provado por checagem de contêiner.
    notes: 'Composição Remotion real, áudio fornecido pelo usuário/Gemini. Revisão visual pendente.',
  };

  onProgress({
    percent: 100, renderedFrames: totalFrames, totalFrames,
    stageLabel: 'MP4 real salvo. Revise o resultado visual antes da publicação.',
  });

  return {
    renderedVersion,
    mp4Url: result.mp4Url,
    contactSheetUrl: result.contactSheetUrl,
    sizeBytes: result.sizeBytes,
  };
}
