import React from 'react';
import {Composition, registerRoot, staticFile} from 'remotion';
import {ESeBugasseVideoComposition} from './compositions/ESeBugasseVideoComposition';
import {pilotEpisode} from './pilot/fixture';
import {TimeShort} from './time/TimeShort';
import {CarDebate} from './car/CarDebate';
import {FirstCarDebate} from './car/FirstCarDebate';
import {SunShort} from './sun/SunShort';

const PilotRoot = () => <><Composition id="Bugi-Sol-Desapareceu" component={SunShort} width={1080} height={1920} fps={30} durationInFrames={1464}/><Composition
  id="Bugi-Atrito-12s" component={ESeBugasseVideoComposition}
  width={1080} height={1920} fps={30} durationInFrames={375}
  defaultProps={{episode: pilotEpisode, mode: 'pilot_12s' as const, enableAudio: true,
    pilotAssets:{narrationUrl:staticFile('assets/pilot-atrito-v5/pilot-mix.wav'),
      technicalPreview:false}}}
/><Composition id="Bugi-Tempo-51s" component={TimeShort}
  width={1080} height={1920} fps={30} durationInFrames={1515}/><Composition id="Debate-Ar-Condicionado" component={CarDebate} width={1080} height={1920} fps={30} durationInFrames={1014}/><Composition id="Primeiro-Bugi-Ar-Condicionado" component={FirstCarDebate} width={1080} height={1920} fps={30} durationInFrames={1578}/></>;
registerRoot(PilotRoot);
