import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import timing from '../../../public/assets/gravidade/timing.json';
import {gravityActing,smooth} from './gravityMotion';
import {GravityRoom} from './GravityRoom';
import {GravityCaptions} from './GravityCaptions';
import {GC as C,Phone,ForceArrow,MassDiagram,JumpDiagram,DropDiagram} from './GravityGraphics';

/** Narrator is identified by sound-reactive graphics, without repetitive speaker labels. */
const NarratorSignal:React.FC<{amplitude:number;local:number;diagram:boolean}>=({amplitude,local,diagram})=>{
 const enter=smooth(local/.2),a=Math.min(1,amplitude);
 return <g opacity={enter}>
 <rect x="89" y="195" width="177" height="82" rx="41" fill={C.ink}/>
 <circle cx="132" cy="236" r={15+a*4} fill={C.cyan}/>
 {[0,1,2,3,4].map(j=><path key={j} d={`M${172+j*15} ${236-(5+a*(12+(j%3)*6))}v${10+a*(24+(j%3)*12)}`} stroke={C.cyan} strokeWidth="6" strokeLinecap="round"/>)}
 <circle cx="132" cy="236" r={25+a*10} stroke={C.cyan} strokeWidth="2" fill="none" opacity={.18+a*.35}/>
 {diagram&&<path d="M132 288v35q0 25 25 25h140" stroke={C.cyan} strokeWidth="3" fill="none" strokeDasharray="260" strokeDashoffset={260*(1-smooth(local/.4))} opacity=".55"/>}
 </g>;
};

export const GravityFinal:React.FC<{technical?:boolean}>=({technical=false})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const turn=timing.turns.filter(q=>q.start<=t).at(-1)??timing.turns[0],i=turn.index,local=t-turn.start;
 const bugi=turn.speaker==='bugi',active=t>=turn.start&&t<=turn.end;
 const wordActive=timing.words.some(w=>w.turn===i&&t>=w.start&&t<w.end);
 const amp:number=(timing.envelope as number[])[Math.floor(t*30)]??0;
 const diagram=i===3||i===7||i===9;
 const k=gravityActing(i,local,bugi&&wordActive?amp:0);
 if(!bugi){k.pupilOffsetX=-3;k.pupilOffsetY=-2;k.mouthShape=i===5?'determined':'smile';}
 const emphasis=[2,4,8,10,12].includes(i);
 const zoom=diagram?1:emphasis?1.27:1.12;
 const cameraY=diagram?0:-110;
 const hand={x:-10+(k.rootX+k.rightWrist.x)*1.8,y:155+(k.rootY+k.rightWrist.y)*1.8-28};
 const release=gravityActing(10,.55,0),releaseY=155+(release.rootY+release.rightWrist.y)*1.8-28;
 const drop=Math.max(0,Math.min(1,(local-.55)/.45));
 return <AbsoluteFill style={{background:C.ink,fontFamily:'Arial',overflow:'hidden'}}>
 {!technical&&<Audio src={staticFile('assets/gravidade/mix-final.wav')}/>}
 <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute'}}>
 <g transform={`translate(${480*(1-zoom)} ${1020*(1-zoom)+cameraY}) scale(${zoom})`}>
 <GravityRoom index={i} local={local}/>
 {!diagram&&<g transform="translate(-10 155) scale(1.8)"><BugiArticulatedSvgFigure kinematics={k}/></g>}
 {i===0&&local>.55&&local<1.05&&<g opacity={1-smooth((local-.73)/.32)}><path d="M190 1200l-40-24m550 24 40-24" stroke={C.gold} strokeWidth="9"/></g>}
 {i===1&&<g opacity={smooth((local-.6)/.3)}>
  <rect x="706" y="675" width="175" height="100" rx="25" fill={C.ink}/><text x="793" y="747" textAnchor="middle" fontSize="61" fontWeight="900" fill={C.cyan}>2g</text>
  <g opacity={smooth((local-4.3)/.3)}><ForceArrow x={680} y={880} length={80+95*smooth(local-6.7)} color={C.coral}/></g>
 </g>}
 {i===8&&<Phone x={hand.x} y={hand.y} rot={-8}/>}
 {i===10&&<Phone x={local<.55?hand.x:629+35*drop} y={local<.55?hand.y:releaseY+(1318-releaseY)*drop*drop} rot={-8+28*drop}/>}
 </g>
 {diagram&&<rect width="1080" height="1920" fill={C.ink} opacity=".36"/>}
 <g opacity={smooth(local/.2)} transform={`translate(0 ${18*(1-smooth(local/.3))})`}>
 {i===3&&<MassDiagram local={local}/>} {i===7&&<JumpDiagram local={local}/>} {i===9&&<DropDiagram local={local}/>}
 </g>
 {!bugi&&active&&<NarratorSignal amplitude={amp} local={local} diagram={diagram}/>}
 {!bugi&&active&&<path d="M15 390v-65q0-35 35-35h23M1065 390v-65q0-35-35-35h-23" stroke={C.cyan} strokeWidth="4" fill="none" opacity={.08+.16*amp}/>}
 {i===0&&<g opacity={1-smooth((local-2.5)/.4)}><rect x="90" y="220" width="400" height="95" rx="23" fill={C.ink}/><text x="290" y="285" textAnchor="middle" fill={C.gold} fontSize="42" fontWeight="900">GRAVIDADE ×2</text></g>}
 {i===11&&<g opacity={smooth(local/.2)*(1-smooth((local-2)/.5))}><rect x="710" y="200" width="200" height="100" rx="25" fill={C.ink}/><text x="810" y="272" textAnchor="middle" fill={C.cyan} fontSize="64" fontWeight="900">1g</text></g>}
 </svg>
 {i===1&&<div style={{position:'absolute',right:160,top:213,color:C.ink,background:'#FFF7E9DD',padding:'12px 17px',borderRadius:14,fontSize:26,fontWeight:700,opacity:smooth(local/.2)*(1-smooth((local-3.2)/.4))}}>10 s • tempo ampliado</div>}
 <GravityCaptions time={t} bugi={bugi}/>
 {technical&&<div style={{position:'absolute',left:90,bottom:210,color:C.coral,fontSize:26,fontWeight:800}}>PRÉVIA TÉCNICA • TEMPOS ESTIMADOS</div>}
 </AbsoluteFill>;
};
