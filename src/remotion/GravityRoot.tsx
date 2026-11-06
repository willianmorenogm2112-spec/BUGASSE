import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {GravityFinal} from './gravity/GravityFinal';
import timing from '../../public/assets/gravidade/timing.json';
registerRoot(()=><>
 <Composition id="Bugi-Gravidade-Dobrada" component={GravityFinal} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)} defaultProps={{technical:false}}/>
 <Composition id="Bugi-Gravidade-Piloto-12s" component={GravityFinal} width={1080} height={1920} fps={30} durationInFrames={360} defaultProps={{technical:false}}/>
</>);
