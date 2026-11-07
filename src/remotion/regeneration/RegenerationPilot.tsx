import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import timing from '../../../public/assets/regeneracao/timing.json';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {captionPages} from '../gravity/GravityCaptions';
import {regenPose,track,clamp,Variant} from './regenMotion';
const C={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',gold:'#FFD166',cream:'#FFF7E9'};
const pages=captionPages(timing.words);
export function choreographyTime(t:number){
 const anchors=timing.choreographyAnchors;
 const i=anchors.findIndex(p=>p[0]>t);
 if(i<0)return 12;if(i===0)return 0;
 const [a,x]=anchors[i-1],[b,y]=anchors[i];return x+(y-x)*(t-a)/(b-a);
}
const Scratch=({heal}:{heal:number})=><g stroke={C.coral} strokeWidth="3.5" strokeLinecap="round" opacity={1-heal}>
 {[0,1,2].map(j=><path key={j} d={`M${-14+j*9} -6l${7*(1-heal)} ${13*(1-heal)}`}/>)}
</g>;
const Forearm=({k,s}:{k:ReturnType<typeof regenPose>;s:number})=>{
 const a=k.leftElbow,b=k.leftWrist,x=a.x+(b.x-a.x)*.66,y=a.y+(b.y-a.y)*.66;
 const rotation=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
 const heal=track(s,[[0,0],[6,0],[8.3,1],[12,1]]);
 return <g transform={`translate(${k.rootX} ${k.rootY}) rotate(${k.torsoRotation})`}>
   <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
     <rect x="-9" y="-10" width="25" height="20" rx="9" fill="#F7D5B8" stroke={C.ink} strokeWidth="3"/>
     {s>3.5&&s<8.3&&<Scratch heal={heal}/>}
   </g>
 </g>;
};
const Park=({t}:{t:number})=><>
 <defs><linearGradient id="regen-sky" x2="0" y2="1"><stop stopColor="#A0D4CC"/><stop offset="1" stopColor="#FFF0D5"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#regen-sky)"/>
 <circle cx="880" cy="300" r="110" fill={C.gold} opacity=".85"/>
 {[0,1,2].map(j=><g key={j} transform={`translate(${120+j*450+t*6} ${330+(j%2)*100})`} fill={C.cream}><ellipse rx="100" ry="28"/><circle cx="-25" cy="-25" r="42"/><circle cx="30" cy="-20" r="34"/></g>)}
 <path d="M0 1020Q200 760 460 1030T1080 1000V1430H0Z" fill="#80ACA0"/>
 {[0,1,2,3].map(j=><g key={j} transform={`translate(${j*360-80} 1100)`}>
   <path d="M0 190V-220" stroke="#65847B" strokeWidth="25"/>
   <g transform={`rotate(${Math.sin(t*.8+j)*.7})`} fill={j%2?'#568D83':'#659A87'}><ellipse cy="-220" rx="150" ry="190"/><ellipse cx="90" cy="-160" rx="90" ry="120"/></g>
 </g>)}
 <rect y="1220" width="1080" height="250" fill="#B9AE8C"/>
 <path d="M0 1330H1080" stroke="#E8D8B8" strokeWidth="34"/>
 <rect y="1360" width="1080" height="560" fill={C.ink}/>
 {[0,1,2,3,4,5,6,7].map(j=><path key={j} d={`M${j*170} 1250l-80 100m80-100h170`} stroke="#9E987D" strokeWidth="3" fill="none"/>)}
 <path d="M590 1341l10-24 58-9 22 33Z" fill="#948D79" stroke="#746F61" strokeWidth="5"/>
 <path d="M604 1317l48-7" stroke="#E8DDC3" strokeWidth="5"/>
</>;
export const RegenerationPilot:React.FC<{variant:Variant;audible?:boolean}>=({variant,audible=true})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps,s=choreographyTime(t),k=regenPose(s,variant);
 const zoom=track(s,[[0,0],[5,0],[5.7,1],[8.8,1],[9.5,0],[12,0]]),scale=1+.15*zoom;
 const page=pages.find((p,j)=>t>=p[0].start&&t<(pages[j+1]?.[0].start??12)&&t<=p.at(-1)!.end+.18);
 const inset=track(s,[[0,0],[5.5,0],[6,1],[8.3,1],[9,0],[12,0]]),heal=track(s,[[0,0],[6,0],[8.3,1],[12,1]]);
 const amp=timing.envelope[f]??0;
 return <AbsoluteFill style={{background:C.ink,fontFamily:'Arial',overflow:'hidden'}}>
   {audible&&<Audio src={staticFile('assets/regeneracao/mix-final.wav')}/>}
   <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute'}}>
     <g transform={`translate(540 960) scale(${scale}) translate(${-540-60*zoom} ${-960+60*zoom})`}>
       <Park t={t}/>
       <g transform="translate(250 97) scale(1.8)">
         <BugiArticulatedSvgFigure kinematics={k}/>
         <Forearm k={k} s={s}/>
       </g>
       <g opacity={track(s,[[0,0],[3.45,0],[3.5,.6],[3.85,0],[12,0]])} fill="none" stroke={C.gold} strokeWidth="8" strokeLinecap="round">
         <path d="M640 1280l-30-20m80 15v-30m45 40 30-20"/>
       </g>
     </g>
     <g opacity={inset} transform={`translate(90 ${360+(1-inset)*25})`}>
       <rect width="600" height="210" rx="30" fill={C.ink} opacity=".94"/>
       <rect x="70" y="63" width="460" height="100" rx="50" fill="#F7D5B8"/>
       <g transform="translate(300 110) scale(4)"><Scratch heal={heal}/></g>
       <text x="300" y="195" textAnchor="middle" fill={C.cream} fontSize="25" fontWeight="700">{heal<.98?'Regeneração em segundos':'Pele restaurada — hipótese fictícia'}</text>
     </g>
     <g transform="translate(95 170)"><rect x="-30" y="-35" width="150" height="70" rx="35" fill={C.ink}/><circle r={11+amp*4} fill={C.cyan}/>{[0,1,2].map(j=><path key={j} d={`M${30+j*22} ${-5-amp*(14+j*4)}v${10+amp*(28+j*8)}`} stroke={C.cyan} strokeWidth="6" strokeLinecap="round"/>)}</g>
     <text x="940" y="195" fontWeight="900" fontSize="55" textAnchor="middle" fill={C.ink}>{variant}</text>
     <text x="540" y="1780" textAnchor="middle" fontSize="28" fill={C.cream} opacity=".65">Hipótese fictícia • piloto de animação</text>
   </svg>
   {page&&<div style={{position:'absolute',top:1500,left:85,right:125,display:'flex',justifyContent:'center'}}>
     <div style={{fontSize:59,fontWeight:900,lineHeight:1.15,textAlign:'center',color:C.cream,background:'#122638EE',padding:'16px 24px',borderRadius:22,boxShadow:`0 5px 0 ${C.cyan}`}}>
       {page.map((w,j)=><React.Fragment key={j}><span style={{color:t>=w.start&&t<w.end?C.cyan:C.cream}}>{w.word}</span>{j<page.length-1?' ':''}</React.Fragment>)}
     </div>
   </div>}
 </AbsoluteFill>;
};
export const RegenerationComparison:React.FC=()=> <AbsoluteFill style={{background:C.ink}}>
 <Audio src={staticFile('assets/regeneracao/mix-final.wav')}/>
 <div style={{position:'absolute',width:1080,height:1920,left:0,top:0}}><RegenerationPilot variant="A" audible={false}/></div>
 <div style={{position:'absolute',width:1080,height:1920,left:1080,top:0}}><RegenerationPilot variant="B" audible={false}/></div>
 <div style={{position:'absolute',left:1077,width:6,top:0,bottom:0,background:C.cream}}/>
</AbsoluteFill>;
