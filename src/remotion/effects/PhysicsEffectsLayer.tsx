import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HyperFramesOverlayConfig } from '../../types/studio';

interface PhysicsEffectsLayerProps {
  frameInScene: number;
  fps: number;
  timerSeconds: number;
  hyperFramesOverlay?: HyperFramesOverlayConfig;
  scientificNote: string;
}

declare global {
  interface Window {
    __timelines?: Record<string, gsap.core.Timeline>;
  }
}

/**
 * Camada 7 (zIndex 70): Partículas Físicas + HUD Regra Bugada + Adaptador Determinístico HyperFrames (GSAP)
 * Registra a timeline GSAP pausada em window.__timelines[compositionId] e faz seek exato por frame.
 */
export const PhysicsEffectsLayer: React.FC<PhysicsEffectsLayerProps> = ({
  frameInScene,
  fps,
  timerSeconds,
  hyperFramesOverlay,
  scientificNote,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const compId = hyperFramesOverlay?.compositionId || 'hf-default-overlay';

  useEffect(() => {
    if (!cardRef.current || !hyperFramesOverlay?.enabled) return;
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: -26, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
      0
    );
    window.__timelines = window.__timelines || {};
    window.__timelines[compId] = tl;
    return () => {
      tl.kill();
    };
  }, [compId, hyperFramesOverlay?.enabled]);

  useEffect(() => {
    const tl = window.__timelines?.[compId];
    if (tl) {
      tl.time(frameInScene / Math.max(1, fps));
    }
  }, [compId, frameInScene, fps]);

  const entryProgress = Math.min(1, frameInScene / 12);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 70 }}
    >
      {/* HUD Superior da Regra Física Bugada (Zona Segura Topo) */}
      <div
        className="absolute left-[64px] right-[64px] top-[64px] flex items-center justify-between px-7 py-4 rounded-3xl bg-[#08121B]/90 border-[3px] border-[#39C8D5]"
        style={{
          transform: `scale(${0.94 + entryProgress * 0.06})`,
        }}
      >
        <div>
          <div className="text-[20px] font-mono font-bold text-[#39C8D5] tracking-wider uppercase">
            REGRA ALTERADA · E SE BUGASSE?
          </div>
          <div className="text-[28px] font-display font-bold text-[#FFF7E9] leading-tight">
            {hyperFramesOverlay?.headlineText || 'Atrito = 0.00 μ · Inércia Pura'}
          </div>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-[#FF6B50] text-[#FFF7E9] font-mono font-bold text-[32px] tabular-nums">
          0{timerSeconds}.0s
        </div>
      </div>

      {/* Infográfico Determinístico HyperFrames (HTML + GSAP) */}
      {hyperFramesOverlay?.enabled && (
        <div
          ref={cardRef}
          data-composition-id={compId}
          className="absolute left-[64px] right-[64px] top-[210px] px-7 py-4 rounded-2xl bg-[#122638]/92 border-2 border-[#FFD166] flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <div className="text-[18px] font-mono text-[#FFD166] uppercase">
              HYPERFRAMES INFOGRÁFICO GSAP · {hyperFramesOverlay.templateType.toUpperCase()}
            </div>
            <div className="text-[23px] font-sans text-[#FFF7E9]/90 truncate max-w-[580px]">
              {scientificNote}
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#08121B] border border-[#39C8D5] font-mono font-bold text-[24px] text-[#39C8D5] shrink-0">
            {hyperFramesOverlay.formulaText}
          </div>
        </div>
      )}
    </div>
  );
};
