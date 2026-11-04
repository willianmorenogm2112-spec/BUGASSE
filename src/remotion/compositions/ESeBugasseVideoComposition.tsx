import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Episode,
  StoryboardScene,
  WordTimestampCue,
} from '../../types/studio';
import {
  PILOT_12S_FRICTION_BEATS,
  PILOT_8S_FRICTION_BEATS,
} from '../animation/bugiRigAndBeatsEngine';
import { RemotionSceneComposer } from '../scenes/RemotionSceneComposer';
import { EpisodeAudioController } from '../audio/EpisodeAudioController';
import {FrictionPilot, type PilotAssets} from '../pilot/FrictionPilot';

export interface ESeBugasseVideoCompositionProps extends Record<string, unknown> {
  episode: Episode;
  mode?: 'full_episode' | 'pilot_12s' | 'pilot_8s' | 'pilot_5s' | 'single_scene';
  targetSceneId?: string;
  enableAudio?: boolean;
  pilotAssets?: PilotAssets;
}

/**
 * Composição Principal Remotion (1080 × 1920, 30 FPS) do E Se Bugasse? Studio.
 * Suporta:
 * - Piloto Prático Completo de 12 Segundos guiado por 5 AnimationBeats (pilot_12s — 0–2s, 2–4s, 4–7s, 7–10s, 10–12s)
 * - Piloto de 8 Segundos guiado por 4 AnimationBeats (pilot_8s)
 * - Teste Piloto de 5 Segundos (pilot_5s)
 * - Episódio Completo 35s–55s (full_episode)
 * - Cena Individual Isolada (single_scene)
 */
export const ESeBugasseVideoComposition: React.FC<
  ESeBugasseVideoCompositionProps
> = ({
  episode,
  mode = 'full_episode',
  targetSceneId,
  enableAudio = true,
  pilotAssets,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentEpisodeTimeSec = frame / Math.max(1, fps);

  if (mode === 'pilot_12s' && pilotAssets) {
    return <FrictionPilot assets={pilotAssets} enableAudio={enableAudio}/>;
  }

  const activeNarration =
    episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
    episode.narrationTracks[0];

  if (mode === 'pilot_12s' || mode === 'pilot_8s') {
    const beatsToUse =
      mode === 'pilot_12s' ? PILOT_12S_FRICTION_BEATS : PILOT_8S_FRICTION_BEATS;
    const totalPilotSec = mode === 'pilot_12s' ? 12 : 8;
    const baseScene = episode.scenes[0] || {
      id: `pilot-scene-${totalPilotSec}s`,
      order: 1,
      correspondingText: 'E se o atrito desaparecesse por 5 segundos?',
      approxDurationSec: totalPilotSec,
      startTimeSec: 0,
      endTimeSec: totalPilotSec,
      timeCalculationMode: 'calculado_audio_real' as const,
      charactersPresent: ['Bugi'],
      scenario: 'Rua urbana colorida ilustrada',
      scenarioPreset: 'calcada_urbana' as const,
      mainAction: `Piloto ${totalPilotSec}s com ${beatsToUse.length} beats cinematográficos`,
      bugiPose: 'caminhando' as const,
      bugiExpression: 'confiante' as const,
      cameraMovement: 'Tracking pan cinematográfico',
      animations: [
        'walkCycle',
        'slipReaction',
        'armFlail',
        'grabAndStretchReaction',
        'bodyImpact',
      ],
      subtitlesText: '',
      soundEffects: [
        'footsteps',
        'slip_whoosh',
        'cartoon_skid',
        'boing_recovery',
        'body_thud',
      ],
      transitionInstruction: 'Match action',
      scientificObservations: 'μ = 0.00 N · 1ª Lei de Newton',
    };

    return (
      <AbsoluteFill className="bg-[#08121B]">
        <EpisodeAudioController
          narrationAudioUrl={activeNarration?.audioDataUrl}
          enableAudio={enableAudio}
        />

        {beatsToUse.map((beat) => {
          const durationInFrames = Math.max(1, beat.endFrame - beat.startFrame);
          const frameInScene = Math.max(0, frame - beat.startFrame);
          const timerSeconds = Math.max(
            0,
            Math.ceil(5 - (beat.startTimeSec / totalPilotSec) * 5)
          );

          return (
            <Sequence
              key={beat.id}
              from={beat.startFrame}
              durationInFrames={durationInFrames}
              name={`Beat 0${beat.beatIndex} - ${beat.characterState}`}
            >
              <RemotionSceneComposer
                scene={{
                  ...baseScene,
                  startTimeSec: beat.startTimeSec,
                  endTimeSec: beat.endTimeSec,
                  bugiPose: beat.characterPose,
                  bugiExpression: beat.facialExpression,
                  subtitlesText: beat.caption.text,
                }}
                activeBeat={beat}
                frameInScene={frameInScene}
                durationInFrames={durationInFrames}
                fps={fps}
                currentEpisodeTimeSec={currentEpisodeTimeSec}
                timerSeconds={timerSeconds}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  }

  let scenesToRender: StoryboardScene[] = episode.scenes;
  if (mode === 'single_scene' && targetSceneId) {
    const found = episode.scenes.find((s) => s.id === targetSceneId);
    if (found) {
      const dur = Math.max(2, found.endTimeSec - found.startTimeSec);
      scenesToRender = [
        {
          ...found,
          startTimeSec: 0,
          endTimeSec: dur,
        },
      ];
    }
  } else if (mode === 'pilot_5s') {
    const first = episode.scenes[0];
    if (first) {
      scenesToRender = [
        {
          ...first,
          startTimeSec: 0,
          endTimeSec: 5.0,
          definitiveDurationSec: 5.0,
          approxDurationSec: 5.0,
        },
      ];
    }
  }

  return (
    <AbsoluteFill className="bg-[#08121B]">
      <EpisodeAudioController
        narrationAudioUrl={activeNarration?.audioDataUrl}
        enableAudio={enableAudio}
      />

      {scenesToRender.map((scene, idx) => {
        const startFrame = Math.max(0, Math.round(scene.startTimeSec * fps));
        const endFrame = Math.max(
          startFrame + 1,
          Math.round(scene.endTimeSec * fps)
        );
        const durationInFrames = Math.max(1, endFrame - startFrame);
        const frameInScene = Math.max(0, frame - startFrame);
        const timerSeconds = Math.max(0, Math.ceil(5 - idx));

        const markerForScene = activeNarration?.temporalMarkers.find(
          (m) =>
            m.segmentId === scene.scriptSegmentId ||
            m.label.includes(String(scene.order))
        );
        const wordCues: WordTimestampCue[] | undefined =
          markerForScene?.wordCues;

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={`Cena 0${scene.order} - ${scene.bugiPose}`}
          >
            <RemotionSceneComposer
              scene={scene}
              frameInScene={frameInScene}
              durationInFrames={durationInFrames}
              fps={fps}
              currentEpisodeTimeSec={
                mode === 'single_scene'
                  ? scene.startTimeSec + frameInScene / fps
                  : currentEpisodeTimeSec
              }
              wordCues={wordCues}
              timerSeconds={timerSeconds}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
