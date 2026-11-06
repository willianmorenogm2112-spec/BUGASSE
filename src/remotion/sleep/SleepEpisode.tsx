import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import timing from '../../../public/assets/sono/timing.json';
import {captionPages} from '../gravity/GravityCaptions';
import {sleepActing,smooth,sleepNight} from './sleepMotion';
import {SleepRoom,SC as C} from './SleepRoom';
import {Micro,Road,Perception,Brain} from './SleepGraphics';
import {SleepDemonstrations,hasDemonstration} from './SleepDemonstrations';
const pages=timing.turns.flatMap(turn=>captionPages(timing.words.filter(w=>w.turn===turn.index)));
export const SleepEpisode:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const turn=timing.turns.filter(q=>q.start<=t).at(-1)??timing.turns[0],i=turn.index,local=t-turn.start,bugi=turn.speaker==='bugi';
 const active=t>=turn.start&&t<turn.end,wordActive=timing.words.some(w=>w.turn===i&&t>=w.start&&t<w.end),amp=(timing.envelope as number[])[Math.floor(t*30)]??0;
 const technical=timing.alignmentType==='estimated';
 const cue=(token:string,fallback=0)=>{const word=timing.words.find(w=>w.turn===i&&w.word.toLocaleLowerCase('pt-BR').replace(/[.,!?;:]/g,'')===token);return word?word.start-turn.start:fallback;};
 const k=sleepActing(i,Math.max(0,local),turn.end-turn.start,bugi&&wordActive?amp:0,cue('microssonos',1.85));
 if(i===0){const tired=smooth((local-cue('zumbi',3))/.4);k.eyeScaleY=1-.48*tired;k.headRotation=k.headRotationDeg=6*tired;k.pupilOffsetX=5*tired;}
 if(i===1){const blend=smooth(local/.38);k.headRotation=k.headRotationDeg=6+(k.headRotationDeg-6)*blend;k.eyeScaleY=.52+(k.eyeScaleY-.52)*blend;}
 if(i===2){const irritated=smooth((local-cue('humor',6))/.4);k.leftBrowDeg=18*irritated;k.rightBrowDeg=-18*irritated;k.mouthShape='determined';}
 const diagram=[4,8,14,16].includes(i),close=bugi&&![1,9,13,19].includes(i),zoom=close?1.28:1;
 const demo=hasDemonstration(i)&&!(i===3&&local>=cue('merda',4))&&!(i===18&&local>=cue('bugi',7));
 const page=pages.find((p,j)=>t>=p[0].start&&t<(pages[j+1]?.[0].start??timing.duration)&&t<=p.at(-1)!.end+.16);
 return <AbsoluteFill style={{background:C.ink,fontFamily:'Arial',overflow:'hidden'}}>
 {!technical&&<Audio src={staticFile('assets/sono/mix-final.wav')}/>}
 <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute'}}>
 <g transform={`translate(${440*(1-zoom)} ${1040*(1-zoom)}) scale(${zoom})`}>
 <SleepRoom index={i} local={local} time={t} nightLevel={sleepNight(t,timing.turns[2].start,timing.turns[12].start)} bedReturnAt={i===18?cue('devolve'):0}/>
 {i===6&&local>=cue('microssonos',1.7)&&<Micro local={local-cue('microssonos',1.7)}/>}
 {i===12&&local>=cue('distorções',2)&&<Perception local={local-cue('distorções',2)} judging={false}/>}
 <g opacity={diagram?.14:1} transform="translate(-45 180) scale(1.8)"><BugiArticulatedSvgFigure kinematics={k}/></g>
 {i===0&&<g opacity={smooth((local-cue('confiança',5))/.35)}><Brain x={785} y={805} scale={.8} time={local}/>{[0,1,2].map(j=><path key={j} d={`M${720+j*58} ${921+24*smooth((local-5-j*.15)/.8)}l-12 22`} stroke={C.coral} strokeWidth="7" strokeLinecap="round"/>)}</g>}
 {i===13&&<Perception local={local} judging/>}
 {i===11&&<g transform={`translate(${-45+1.8*(k.rootX+k.rightWrist.x)} ${180+1.8*(k.rootY+k.rightWrist.y)})`} stroke={C.ink} strokeWidth="6">
 <path d="M-10-64h70v65q0 17-35 17T-10 1Z" fill={C.cream}/><path d="M60-51q43 0 0 44" fill="none"/>
 {local>=cue('alarme',1.5)&&<g><circle cx="25" cy="-28" r="22" fill={C.gold}/><path d="M25-43v15l10 8" fill="none" strokeWidth="4"/></g>}
 </g>}
 {i===2&&<g opacity={smooth((local-3)/.4)}><Brain x={775} y={780} scale={.77} time={local}/><path d="M730 887l-20 40m65-32v45m45-52 20 40" stroke={C.coral} strokeWidth="7" strokeLinecap="round"/></g>}
 {i===3&&<g opacity={smooth(local/.3)}><rect x="618" y="740" width="340" height="160" rx="22" fill={C.cream} stroke={C.ink} strokeWidth="7"/><path d="M648 784h250m-250 36h190m-190 36h250" stroke={C.ink} strokeWidth="7"/><path d="M647 784h250" stroke={C.coral} strokeWidth="10" opacity={.45+.25*Math.sin(local*2)}/></g>}
 {i===9&&(()=>{const release=smooth((local-cue('aqui',2.8))/.55),hx=-45+1.8*(k.rootX+k.rightWrist.x),hy=180+1.8*(k.rootY+k.rightWrist.y);return <g transform={`translate(${hx+(654-hx)*release} ${hy+(1045-hy)*release-55*Math.sin(Math.PI*release)}) scale(.65)`} stroke={C.ink} strokeWidth="9"><circle r="23" fill={C.gold}/><path d="M17 17l58 58m-16-16 17-17m-1 33 17-17" stroke={C.gold}/></g>;})()}

 {i===0&&<g opacity={1-smooth((local-3.8)/.4)}><rect x="100" y="302" width="510" height="88" rx="25" fill={C.ink}/><text x="355" y="361" textAnchor="middle" fill={C.gold} fontSize="43" fontWeight="900">SEM DORMIR</text></g>}
 {i===1&&<g opacity={smooth(local/.3)}><rect x="600" y="590" width="300" height="190" rx="27" fill={C.ink}/><text x="750" y="684" textAnchor="middle" fill={C.gold} fontSize="83" fontWeight="900">+8 h</text><text x="750" y="737" textAnchor="middle" fill={C.cream} fontSize="29" fontWeight="700">a conta do Bugi</text></g>}
 </g>
 {diagram&&<rect width="1080" height="1920" fill={C.ink} opacity=".52"/>}
 {i===8&&<Road local={local} driveAt={cue('três',3)}/>}
 {demo&&<SleepDemonstrations index={i} local={local} cue={cue}/>}
 {!bugi&&active&&<g opacity={smooth(local/.18)}><rect x="89" y="196" width="177" height="82" rx="41" fill={C.ink}/><circle cx="132" cy="237" r={15+amp*4} fill={C.cyan}/>{[0,1,2,3,4].map(j=><path key={j} d={`M${172+j*15} ${237-(5+amp*(12+j%3*6))}v${10+amp*(24+j%3*12)}`} stroke={C.cyan} strokeWidth="6" strokeLinecap="round"/>)}</g>}
 </svg>
 {page&&<div style={{position:'absolute',left:90,right:150,top:1480,height:155,display:'flex',alignItems:'center',justifyContent:'center'}}>
 <div style={{fontSize:59,fontWeight:900,lineHeight:1.13,textAlign:'center',color:C.cream,padding:'15px 23px',borderRadius:22,background:'#122638EB',boxShadow:`0 5px 0 ${bugi?C.coral:C.cyan}`,opacity:smooth((t-page[0].start)/.09)}}>
 {page.map((w,j)=><React.Fragment key={j}><span style={{color:t>=w.start&&t<w.end?(bugi?C.gold:C.cyan):C.cream}}>{w.word}</span>{j<page.length-1?' ':''}</React.Fragment>)}
 </div></div>}
 {technical&&<div style={{position:'absolute',bottom:190,left:90,color:C.coral,fontSize:27,fontWeight:800}}>PRÉVIA TÉCNICA • TEMPOS ESTIMADOS • SEM VOZ FINAL</div>}
 </AbsoluteFill>;
};
