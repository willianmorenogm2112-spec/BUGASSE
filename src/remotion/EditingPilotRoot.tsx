import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {EditingPilot} from './sun/EditingPilot';
registerRoot(()=> <Composition id="Bugi-Edicao-12s" component={EditingPilot} width={1080} height={1920} fps={30} durationInFrames={360}/>);
