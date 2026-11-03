import React from 'react';
import { interpolate } from 'remotion';

interface SceneTransitionWrapperProps {
  frameInScene: number;
  durationInFrames: number;
  transitionInstruction: string;
  children: React.ReactNode;
}

/**
 * Aplica transições dinâmicas estilo Shorts/Skill Reel (Zoom punch-in no 1º segundo,
 * whip pan nos últimos 5 frames ou flash de alerta físico).
 */
export const SceneTransitionWrapper: React.FC<SceneTransitionWrapperProps> = ({
  frameInScene,
  durationInFrames,
  transitionInstruction,
  children,
}) => {
  const lower = (transitionInstruction || '').toLowerCase();
  const isWhipPan = lower.includes('whip') || lower.includes('pan');
  const isFlash = lower.includes('flash');

  // Punch-in sutil nos primeiros 12 frames da cena
  const entryScale = interpolate(frameInScene, [0, 12], [1.05, 1.0], {
    extrapolateRight: 'clamp',
  });

  // Saída whip-pan nos últimos 5 frames
  const exitStart = Math.max(1, durationInFrames - 5);
  const exitOffsetX = isWhipPan
    ? interpolate(frameInScene, [exitStart, durationInFrames], [0, -90], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const flashOpacity =
    isFlash && frameInScene >= exitStart
      ? interpolate(frameInScene, [exitStart, durationInFrames], [0, 0.45], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        transform: `scale(${entryScale.toFixed(3)}) translateX(${exitOffsetX.toFixed(1)}px)`,
      }}
    >
      {children}
      {flashOpacity > 0 && (
        <div
          className="absolute inset-0 bg-[#FFD166] pointer-events-none"
          style={{ opacity: flashOpacity, zIndex: 90 }}
        />
      )}
    </div>
  );
};
