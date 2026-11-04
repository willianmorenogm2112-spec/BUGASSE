import React from 'react';
import {Composition, registerRoot, staticFile} from 'remotion';
import {ESeBugasseVideoComposition} from './compositions/ESeBugasseVideoComposition';
import {pilotEpisode} from './pilot/fixture';
import {TimeShort} from './time/TimeShort';
import {CarDebate} from './car/CarDebate';

const PilotRoot = () => <><Composition
  id="Bugi-Atrito-12s" component={ESeBugasseVideoComposition}
  width={1080} height={1920} fps={30} durationInFrames={375}
  defaultProps={{episode: pilotEpisode, mode: 'pilot_12s' as const, enableAudio: true,
    pilotAssets:{narrationUrl:staticFile('assets/pilot-atrito-v5/pilot-mix.wav'),
      technicalPreview:false}}}
/><Composition id="Bugi-Tempo-51s" component={TimeShort}
  width={1080} height={1920} fps={30} durationInFrames={1515}/><Composition id="Debate-Ar-Condicionado" component={CarDebate} width={1080} height={1920} fps={30} durationInFrames={1014}/></>;
registerRoot(PilotRoot);
