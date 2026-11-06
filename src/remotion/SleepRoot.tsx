import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {SleepEpisode} from './sleep/SleepEpisode';
import timing from '../../public/assets/sono/timing.json';
registerRoot(()=><>
 <Composition id="Bugi-Nunca-Mais-Dormir" component={SleepEpisode} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)}/>
 <Composition id="Bugi-Sono-Piloto-12s" component={SleepEpisode} width={1080} height={1920} fps={30} durationInFrames={360}/>
</>);
