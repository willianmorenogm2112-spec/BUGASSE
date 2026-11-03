import React from 'react';
import { Audio } from '@remotion/media';

interface EpisodeAudioControllerProps {
  narrationAudioUrl?: string;
  enableAudio?: boolean;
}

/**
 * Controla a reprodução sincronizada da faixa de narração (normalizada em -14 LUFS
 * com trilha instrumental em ducking e efeitos sonoros mixados).
 */
export const EpisodeAudioController: React.FC<EpisodeAudioControllerProps> = ({
  narrationAudioUrl,
  enableAudio = true,
}) => {
  if (!enableAudio || !narrationAudioUrl) {
    return null;
  }

  return <Audio src={narrationAudioUrl} volume={1.0} onError={() => 'fail'} />;
};
