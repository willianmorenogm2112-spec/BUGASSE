import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {GravityEpisode} from './gravity/GravityEpisode';
import timing from '../../public/assets/gravidade/timing.json';
registerRoot(()=><>
 <Composition id="Bugi-Gravidade-Dobrada" component={GravityEpisode} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)} defaultProps={{technical:timing.alignmentType==='estimated'}}/>
 <Composition id="Bugi-Gravidade-Piloto-12s" component={GravityEpisode} width={1080} height={1920} fps={30} durationInFrames={360} defaultProps={{technical:timing.alignmentType==='estimated'}}/>
</>);
