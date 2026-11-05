import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {TimeDialogue} from './time/TimeDialogue';
import timing from '../../public/assets/tempo-interacao/timing.json';
registerRoot(()=> <Composition id="Bugi-Tempo-Dialogo" component={TimeDialogue} width={1080} height={1920} fps={30} durationInFrames={Math.ceil((timing.duration+.25)*30)}/>);
