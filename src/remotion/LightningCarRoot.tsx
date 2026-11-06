import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {LightningCar} from './car/LightningCar';
import timing from '../../public/assets/raio-carro/technical-timing.json';
import actualTiming from '../../public/assets/raio-carro/timing.json';
registerRoot(()=> <>
 <Composition id="Bugi-Raio-No-Carro" component={LightningCar} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(actualTiming.duration*30)} defaultProps={{technical:false,timing:actualTiming}}/>
 <Composition id="Bugi-Raio-No-Carro-Tecnico" component={LightningCar} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)}/>
</>);
