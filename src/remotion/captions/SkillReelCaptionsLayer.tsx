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
      className="absolute left-[56px] right-[56px] flex items-center justify-center pointer-events-none"
      style={{
        top: 1465,
        height: 235,
        zIndex: 80,
      }}
      data-testid="skill-reel-captions-safe-zone"
    >
      <div className="w-full px-8 py-6 rounded-3xl bg-[#08121B]/92 border-[3px] border-[#FFD166] shadow-2xl flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-center">
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
                transform: isSpeakingNow ? 'scale(1.1)' : 'scale(1.0)',
                textShadow: '0 4px 0 #050B11',
              }}
              className="font-display font-extrabold text-[44px] leading-tight transition-transform inline-block"
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
