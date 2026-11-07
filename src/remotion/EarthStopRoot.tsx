import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {EarthStopEpisode} from './earthstop/EarthStopEpisode';
import timing from '../../public/assets/terra-1s/timing.json';
registerRoot(()=><>
 <Composition id="Bugi-Terra-Para-1s" component={EarthStopEpisode} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)}/>
 <Composition id="Bugi-Terra-Piloto-12s" component={EarthStopEpisode} width={1080} height={1920} fps={30} durationInFrames={360}/>
</>);
