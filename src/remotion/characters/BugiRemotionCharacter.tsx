import React from 'react';
import {
  BugiAnimationState,
  BugiExpression,
  BugiPose,
} from '../../types/studio';
import {
  BugiArticulatedSvgFigure,
  computeBugiArticulatedKinematics,
} from '../../components/BugiCharacterSvg';

interface BugiRemotionCharacterProps {
  pose: BugiPose;
  expression: BugiExpression;
  stateOverride?: BugiAnimationState;
  frameInScene: number;
  fps: number;
  speechIntensity: number;
}

/**
 * Camada 6 (zIndex 60): Personagem Principal Canônico Bugi no Canvas 1080 × 1920
 * Renderiza o rig multi-articulado SVG com pivôs independentes para:
 * - Pescoço e cabeça + mechas do cabelo coral com follow-through
 * - Ombros, cotovelos, punhos e mãos
 * - Quadris, joelhos, tornozelos e tênis (com contato no chão Y=685)
 * - Olhos, pupilas, piscadas naturais, sobrancelhas e expressões de boca
 */
export const BugiRemotionCharacter: React.FC<BugiRemotionCharacterProps> = ({
  pose,
  expression,
  stateOverride,
  frameInScene,
  fps,
  speechIntensity,
}) => {
  const k = computeBugiArticulatedKinematics(
    pose,
    frameInScene,
    fps,
    speechIntensity,
    expression,
    stateOverride
  );

  return (
    <svg
      viewBox="0 0 540 960"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 60 }}
    >
      <BugiArticulatedSvgFigure kinematics={k} />
    </svg>
  );
};
