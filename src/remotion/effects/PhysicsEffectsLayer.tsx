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
      {/* Intervenção de Impacto Cômico / Narrativo (Pop-in rápido nos frames 25..75 ao perder atrito) */}
      {frameInScene >= 25 && frameInScene <= 75 && (
        <div
          className="absolute left-[80px] right-[80px] top-[90px] flex items-center justify-center pointer-events-none"
          style={{
            transform: `scale(${
              frameInScene < 35
                ? 0.7 + ((frameInScene - 25) / 10) * 0.4
                : frameInScene > 65
                ? 1.1 - ((frameInScene - 65) / 10) * 0.3
                : 1.1
            }) rotate(-2deg)`,
            opacity:
              frameInScene < 30
                ? (frameInScene - 25) / 5
                : frameInScene > 70
                ? 1 - (frameInScene - 70) / 5
                : 1,
          }}
        >
          <div className="px-8 py-3 rounded-2xl bg-[#FF6B50] border-[4px] border-[#FFF7E9] shadow-2xl flex items-center gap-3">
            <span className="text-[34px] font-display font-extrabold text-[#FFF7E9] tracking-wider uppercase drop-shadow-[0_3px_0_#060D14]">
              ⚡ SEM ATRITO?!
            </span>
          </div>
        </div>
      )}

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
