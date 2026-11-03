import React from 'react';
import {
  AnimationBeat,
  StoryboardScene,
  WordTimestampCue,
} from '../../types/studio';
import { buildDefaultHyperFramesOverlay } from '../../utils/skillReelAndHyperFrames';
import {
  buildBeatForStoryboardScene,
  cameraTracking,
} from '../animation/bugiRigAndBeatsEngine';
import { SceneBackgroundLayer } from '../backgrounds/SceneBackgroundLayer';
import { BugiRemotionCharacter } from '../characters/BugiRemotionCharacter';
import { PhysicsEffectsLayer } from '../effects/PhysicsEffectsLayer';
import { SkillReelCaptionsLayer } from '../captions/SkillReelCaptionsLayer';
import { SceneTransitionWrapper } from '../transitions/SceneTransitionWrapper';

interface RemotionSceneComposerProps {
  scene: StoryboardScene;
  activeBeat?: AnimationBeat;
  frameInScene: number;
  durationInFrames: number;
  fps: number;
  currentEpisodeTimeSec: number;
  wordCues?: WordTimestampCue[];
  timerSeconds: number;
}

/**
 * Compõe todas as 8 camadas do SceneGeometryEngine para uma cena ou AnimationBeat em 1080 × 1920,
 * aplicando cameraTracking (panX, panY, zoom, dutchAngle), parallax de 4 camadas e rig multi-articulado.
 */
export const RemotionSceneComposer: React.FC<RemotionSceneComposerProps> = ({
  scene,
  activeBeat,
  frameInScene,
  durationInFrames,
  fps,
  currentEpisodeTimeSec,
  wordCues,
  timerSeconds,
}) => {
  const beat = activeBeat || buildBeatForStoryboardScene(scene, fps);
  const cam = cameraTracking(
    beat.startFrame + frameInScene,
    fps,
    beat
  );

  // Intensidade reativa da fala a partir da cadência das palavras
  const speechIntensity =
    0.35 +
    Math.abs(Math.sin((frameInScene / Math.max(1, fps)) * Math.PI * 3.5)) * 0.55;

  const hfOverlay =
    scene.hyperFramesOverlay || buildDefaultHyperFramesOverlay(scene);

  const poseToRender = activeBeat ? activeBeat.characterPose : scene.bugiPose;
  const expressionToRender = activeBeat
    ? activeBeat.facialExpression
    : scene.bugiExpression;
  const stateOverride = activeBeat ? activeBeat.characterState : undefined;
  const subtitleToRender = activeBeat
    ? activeBeat.caption.text
    : scene.subtitlesText;

  return (
    <SceneTransitionWrapper
      frameInScene={frameInScene}
      durationInFrames={durationInFrames}
      transitionInstruction={scene.transitionInstruction}
    >
      <div className="relative w-[1080px] h-[1920px] overflow-hidden bg-[#08121B]">
        {/* Stage controlado pelo cameraTracking determinístico */}
        <div
          className="absolute inset-0 w-[1080px] h-[1920px]"
          style={{
            transform: `translate(${(cam.panX * 0.45).toFixed(1)}px, ${(
              cam.panY * 0.45
            ).toFixed(1)}px) scale(${cam.zoom.toFixed(3)}) rotate(${cam.dutchAngleDeg.toFixed(
              2
            )}deg)`,
            transformOrigin: '540px 1120px',
          }}
        >
          {/* Camadas 1 a 5: Cenário Ilustrado em 4 Planos + Objetos Interativos */}
          <SceneBackgroundLayer
            scenarioPreset={scene.scenarioPreset}
            customBackgroundUrl={scene.generatedBackgroundUrl}
            frameInScene={frameInScene}
            isSlidingParallax={
              poseToRender === 'escorregando' ||
              poseToRender === 'equilibrando' ||
              poseToRender === 'correndo'
            }
            cameraPanX={cam.panX}
            activeBeat={beat}
          />

          {/* Camada 6: Personagem Principal Canônico Bugi (Rig Multi-Articulado) */}
          <BugiRemotionCharacter
            pose={poseToRender}
            expression={expressionToRender}
            stateOverride={stateOverride}
            frameInScene={frameInScene}
            fps={fps}
            speechIntensity={speechIntensity}
          />
        </div>

        {/* Camada 7: HUD de Regra Física e Infográfico Determinístico HyperFrames */}
        <PhysicsEffectsLayer
          frameInScene={frameInScene}
          fps={fps}
          timerSeconds={timerSeconds}
          hyperFramesOverlay={hfOverlay}
          scientificNote={
            activeBeat
              ? `μ = ${activeBeat.physicsParameters.frictionMu.toFixed(2)} · v = ${activeBeat.physicsParameters.velocityPxPerSec} px/s`
              : scene.scientificObservations
          }
        />

        {/* Camada 8: Legendas Dinâmicas Skill Reel na Zona Segura */}
        <SkillReelCaptionsLayer
          subtitlesText={subtitleToRender}
          sceneStartSec={activeBeat ? activeBeat.startTimeSec : scene.startTimeSec}
          sceneEndSec={activeBeat ? activeBeat.endTimeSec : scene.endTimeSec}
          currentEpisodeTimeSec={currentEpisodeTimeSec}
          wordCuesOverride={wordCues}
        />
      </div>
    </SceneTransitionWrapper>
  );
};
