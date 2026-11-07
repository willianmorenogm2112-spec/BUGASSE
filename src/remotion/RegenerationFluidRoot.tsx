import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {FluidPilot} from './regeneration-fluid/FluidPilot';
registerRoot(()=><Composition id="Regeneracao-NovaBase" component={FluidPilot} width={1080} height={1920} fps={30} durationInFrames={360}/>);
