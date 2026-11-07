import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {RegenerationPilot,RegenerationComparison} from './regeneration/RegenerationPilot';
registerRoot(()=><>
 <Composition id="Regeneracao-A" component={RegenerationPilot} defaultProps={{variant:'A' as const}} width={1080} height={1920} fps={30} durationInFrames={360}/>
 <Composition id="Regeneracao-B" component={RegenerationPilot} defaultProps={{variant:'B' as const}} width={1080} height={1920} fps={30} durationInFrames={360}/>
 <Composition id="Regeneracao-Comparacao" component={RegenerationComparison} width={2160} height={1920} fps={30} durationInFrames={360}/>
</>);
