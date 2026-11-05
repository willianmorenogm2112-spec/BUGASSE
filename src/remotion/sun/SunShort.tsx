import React from 'react';
import {AbsoluteFill,Audio,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {computeSunBugiKinematics,SunBeatId} from './sunBugiMotion';
import timing from '../../../public/assets/sol/timing.json';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const SunShort:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const beat=timing.beats.filter(b=>t>=b.start).at(-1)??timing.beats[0];
 const local=t-beat.start,space=['luz','orbita'].includes(beat.id),dark=t>=timing.dark;
 const characterBeat=(beat.id==='escuro'||beat.id==='gravidade'||beat.id==='frio'||beat.id==='plantas'||beat.id==='final'||beat.id==='gancho'||beat.id==='espera'?beat.id:'espera') as SunBeatId;
 const k=computeSunBugiKinematics(characterBeat,local*fps,fps,t<4.2);
 const cap=timing.words.filter(w=>t>=w.start&&t<w.end+.08).at(-1);
 const ci=cap?timing.words.indexOf(cap):-1,group=ci<0?[]:timing.words.slice(Math.floor(ci/4)*4,Math.floor(ci/4)*4+4);
 const reveal=interpolate(local,[0,.28],[0,1],clamp);
 const night=interpolate(t,[timing.dark-.15,timing.dark+.35],[0,1],clamp);
 return <AbsoluteFill style={{background:'#122638',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('assets/sol/narracao-original.wav')}/>
  <svg viewBox="0 0 1080 1920" width="100%" height="100%">
   <defs><linearGradient id="sunSky" x2="0" y2="1"><stop stopColor={dark?'#102439':'#69CADB'}/><stop offset="1" stopColor={dark?'#274659':'#FFF0CB'}/></linearGradient></defs>
   <rect width="1080" height="1920" fill="url(#sunSky)"/>
   {!space&&<>
    <circle cx="835" cy="480" r="92" fill="#FFD166" opacity={1-night}/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${i*390-80},0)`}><path d="M0 1020V680L130 605 290 680V1020Z" fill={dark?'#203B50':'#D5C7AE'} stroke="#122638" strokeWidth="8"/>{[0,1,2].map(j=><rect key={j} x={30+j*85} y="755" width="45" height="90" rx="8" fill={dark?'#FFD166':'#5B8E99'}/>)}<rect x="98" y="880" width="83" height="140" fill="#395B68"/></g>)}
    <path d="M0 1010H1080V1920H0Z" fill={dark?'#304A59':'#D6C9B4'}/>
    <path d="M0 1200H1080M0 1560H1080M170 1010L80 1920M800 1010L1020 1920" stroke={dark?'#4A6571':'#B7A58B'} strokeWidth="8"/>
    <g transform="translate(900 850)"><path d="M0 0V350" stroke="#122638" strokeWidth="18"/><path d="M-70 350H70" stroke="#122638" strokeWidth="22"/><circle r="100" fill="#FFF7E9" stroke="#122638" strokeWidth="14"/><g transform={`rotate(${beat.id==='final'?local*500:0})`} fill="#39C8D5">{[0,120,240].map(a=><path key={a} transform={`rotate(${a})`} d="M0 0Q-80-100 0-80Q60-30 0 0Z"/>)}</g><circle r="16" fill="#122638"/></g>
    <g transform="translate(55 300) scale(1.5)"><BugiArticulatedSvgFigure kinematics={k}/></g>
    {!dark&&[0,1,2].map(i=><path key={i} d={`M${275+i*140} 650q${Math.sin(t*4+i)*18} -40 0 -80`} stroke="#FF6B50" strokeWidth="9" fill="none" opacity=".6"/>)}
    {beat.id==='frio'&&Array.from({length:28},(_,i)=><circle key={i} cx={(i*191+frame*.6)%1080} cy={(i*211+frame*2)%1700} r={3+i%5} fill="#FFF7E9" opacity=".65"/>)}
   </>}
   {space&&<>
    <rect width="1080" height="1920" fill="#102236"/>
    {Array.from({length:55},(_,i)=><circle key={i} cx={(i*173)%1080} cy={(i*257)%1800} r={i%3+1} fill="#FFF7E9" opacity=".5"/>)}
    <circle cx="290" cy="830" r="100" fill="#FFD166" opacity={beat.id==='orbita'?.12:1}/>
    {beat.id==='orbita'?<><ellipse cx="440" cy="900" rx="290" ry="220" fill="none" stroke="#607B85" strokeWidth="5" strokeDasharray="16 15"/><path d="M730 900V560" stroke="#39C8D5" strokeWidth="12"/><path d="M710 590l20-35 20 35" fill="none" stroke="#39C8D5" strokeWidth="12"/></>:<><path d="M420 830H790" stroke="#FFD166" strokeWidth="6" strokeDasharray="20 20"/>{Array.from({length:5},(_,i)=><circle key={i} cx={420+(local*90+i*80)%350} cy="830" r="9" fill="#FFF7E9"/>)}</>}
    <g transform={`translate(${beat.id==='orbita'?730:850} ${beat.id==='orbita'?900-Math.min(local*25,220):830})`}><circle r="72" fill="#39C8D5"/><path d="M-30-55l38 15-15 30 28 15-12 50-35-20-20-48Z" fill="#5D9C6D"/></g>
    <text x="540" y="1220" textAnchor="middle" fill="#FFF7E9" fontSize="49" fontWeight="bold">{beat.id==='luz'?'A ÚLTIMA LUZ AINDA ESTÁ A CAMINHO':'TRAJETÓRIA ILUSTRATIVA'}</text>
   </>}
  </svg>
  <div style={{position:'absolute',top:140,left:90,color:'#39C8D5',fontWeight:800,fontSize:27,letterSpacing:5}}>E SE BUGASSE?</div>
  <div style={{position:'absolute',top:220,left:90,right:120,color:dark||space?'#FFF7E9':'#122638',fontWeight:900,fontSize:64,lineHeight:1.04,opacity:reveal,transform:`translateY(${(1-reveal)*25}px)`}}>{beat.title}</div>
  <div style={{position:'absolute',top:410,left:90,maxWidth:790,padding:'15px 24px',background:'#FF6B50',color:'#FFF7E9',borderRadius:16,fontSize:29,fontWeight:800}}>{beat.label}</div>
  {group.length>0&&<div style={{position:'absolute',top:1480,left:85,right:135,background:'#FFF7E9',borderRadius:22,padding:'24px 26px',textAlign:'center',fontSize:48,fontWeight:800,lineHeight:1.14}}>{group.map((w,i)=><span key={i} style={{color:w===cap?'#C34C35':'#122638'}}>{w.word} </span>)}</div>}
  <div style={{position:'absolute',bottom:210,left:90,color:space||dark?'#FFF7E9':'#122638',fontSize:21,fontWeight:700}}>HIPÓTESE IMPOSSÍVEL • ANIMAÇÃO ILUSTRATIVA</div>
 </AbsoluteFill>;
};

