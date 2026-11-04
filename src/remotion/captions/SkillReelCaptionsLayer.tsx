import React from 'react';
import { WordTimestampCue } from '../../types/studio';
import {
  buildSkillReelWordCues,
  groupWordCuesIntoPages,
} from '../../utils/skillReelAndHyperFrames';

interface SkillReelCaptionsLayerProps {
  subtitlesText: string;
  sceneStartSec: number;
  sceneEndSec: number;
  currentEpisodeTimeSec: number;
  wordCuesOverride?: WordTimestampCue[];
}

/**
 * Camada 8 (zIndex 80): Legendas Dinâmicas no Padrão Skill Reel (@remotion/captions)
 * - Respeita rigorosamente a Zona Segura Inferior (top: 1460px..1710px em 1080x1920)
 * - Blocos curtos (máx. 5 palavras por página)
 * - Destaque automático em Ciano (#39C8D5) para física e Amarelo (#FFD166) para impacto
 */
export const SkillReelCaptionsLayer: React.FC<SkillReelCaptionsLayerProps> = ({
  subtitlesText,
  sceneStartSec,
  sceneEndSec,
  currentEpisodeTimeSec,
  wordCuesOverride,
}) => {
  const cues =
    wordCuesOverride && wordCuesOverride.length > 0
      ? wordCuesOverride
      : buildSkillReelWordCues(subtitlesText, sceneStartSec, sceneEndSec);

  const pages = groupWordCuesIntoPages(cues, 5);
  const activePage =
    pages.find(
      (p) =>
        currentEpisodeTimeSec >= p.startSec && currentEpisodeTimeSec <= p.endSec
    ) || pages[0];

  if (!activePage) return null;

  return (
    <div
      className="absolute left-[40px] right-[40px] flex items-center justify-center pointer-events-none"
      style={{
        top: 1480,
        height: 190,
        zIndex: 80,
      }}
      data-testid="skill-reel-captions-safe-zone"
    >
      <div className="w-full px-6 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
        {activePage.words.map((w, idx) => {
          const isSpeakingNow =
            currentEpisodeTimeSec >= w.startSec &&
            currentEpisodeTimeSec <= w.endSec;
          const color = isSpeakingNow
            ? w.highlightColor || '#FFD166'
            : w.highlightColor || '#FFF7E9';

          return (
            <span
              key={`${w.word}-${idx}`}
              style={{
                color,
                transform: isSpeakingNow ? 'scale(1.15)' : 'scale(1.0)',
                textShadow:
                  '-3px -3px 0 #050B11, 3px -3px 0 #050B11, -3px 3px 0 #050B11, 3px 3px 0 #050B11, 0 6px 12px rgba(0,0,0,0.8)',
              }}
              className="font-display font-black text-[54px] tracking-wide leading-none transition-transform inline-block uppercase"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
