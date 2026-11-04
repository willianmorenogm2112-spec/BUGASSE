import React from 'react';
import {AbsoluteFill,Audio,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import transcript from '../../../public/assets/debate-ar/transcript.json';

const norm=(s:string)=>s.toLocaleLowerCase('pt-BR').replace(/[^a-záéíóúâêôãõç]/g,'');
const anchor=(s:string,fallback:number)=>transcript.find(w=>norm(w.text)===s)?.start??fallback;
const turns=[0,anchor('abre',2),anchor('e',5),anchor('ué',8),anchor('então',15),anchor('depende',17),anchor('ótimo',27),anchor('tá',29),34];
// Correct phrase anchors with context to avoid matching the opening "Tá" again.
const phrase=(text:string[],fallback:number)=>{const i=transcript.findIndex((_,i)=>text.every((w,j)=>norm(transcript[i+j]?.text??'')===w));return i<0?fallback:transcript[i].start;};
turns[2]=phrase(['e','esse'],5);turns[7]=phrase(['tá','bom'],29);
const captions=Array.from({length:Math.ceil(transcript.length/3)},(_,i)=>{
 const words=transcript.slice(i*3,i*3+3);return {words,start:words[0].start,end:Math.min(words.at(-1)!.end+.12,transcript[i*3+3]?.start??34)};
});
const cl={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

const Person:React.FC<{x:number;woman:boolean;talk:boolean;t:number;hot:boolean}>=({x,woman,talk,t,hot})=>{
 const sway=Math.sin(t*2.1+(woman?1:0))*1.4;
 const mouth=talk?3+Math.abs(Math.sin(t*15))*9:1.5;
 return <g transform={`translate(${x},465) rotate(${sway})`} stroke="#132B3B" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
  <path d="M-69 161V85Q-61 46 0 46Q61 46 69 85V161" fill={woman?'#E5745F':'#24737D'}/>
  <path d="M-14 36V58Q0 70 14 58V36" fill="#E9AD88"/>
  {woman&&<path d="M-48 11Q-65-91 1-94Q68-88 47 60L30 86L-46 66Z" fill="#57342D"/>}
  <ellipse cy="-12" rx="43" ry="56" fill={hot?'#F1AD90':'#F4C49F'}/>
  {woman?<path d="M-43-17Q-53-82 4-81Q43-82 44-32Q3-38-17-61Q-30-32-43-17" fill="#57342D"/>:<path d="M-44-26Q-54-78 4-80L36-69L49-37L15-47L-6-57L-26-32Z" fill="#253441"/>}
  <path d="M-28-18q9-7 17-2M11-20q10-5 18 2" fill="none"/>
  <ellipse cx="-20" cy="-6" rx="4" ry="5" fill="#132B3B" stroke="none"/><ellipse cx="21" cy="-6" rx="4" ry="5" fill="#132B3B" stroke="none"/>
  <path d="M1-2l-4 15h8" fill="none" stroke="#BD8269" strokeWidth="2"/>
  <ellipse cy="29" rx={talk?12:10} ry={mouth} fill={talk?'#7C3436':'#D88276'} strokeWidth="2"/>
  {talk&&<path d="M-7 25h14" stroke="#FFF7E9" strokeWidth="3"/>}
  <path d={woman?'M-51 84Q-87 95-90 30':'M-50 88Q-70 119-45 144'} fill="none" stroke={woman?'#E5745F':'#24737D'} strokeWidth="25"/>
  <circle cx={woman?-90:-45} cy={woman?30:144} r="11" fill="#F4C49F"/>
  <path d="M43 78L-35 154" stroke="#132B3B" strokeWidth="12"/>
  {hot&&woman&&<path d="M47-8q-9 13 0 14q9-1 0-14" fill="#39C8D5" strokeWidth="1.5"/>}
 </g>;
};

export const CarDebate:React.FC=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const turn=Math.max(0,turns.findIndex((a,i)=>t>=a&&t<turns[i+1]));
 const woman=turn%2===0;const speaking=transcript.some(w=>t>=w.start&&t<w.end);
 const cap=captions.find(c=>t>=c.start&&t<c.end);
 const explaining=(turn===3||turn===5),road=turn===5,ac=t>=turns[6];
 const title=turn===0?'LIGA O AR!':turn===1?'GASTA MAIS?':turn===2?'E O VENTO?':turn===3?'OS DOIS GASTAM.':turn===4?'QUEM TEM RAZÃO?':turn===5?'DEPENDE.':turn===6?'AGORA LIGA!':'CONTA DIVIDIDA!';
 const zoom=explaining?1:1.035;const focus=woman?-7:7;
 return <AbsoluteFill style={{background:'#FFF4DF',fontFamily:'CarJakarta,Arial,sans-serif',overflow:'hidden'}}>
  <style>{`@font-face{font-family:CarJakarta;src:url('${staticFile('assets/pilot-atrito-v1/PlusJakartaSans.ttf')}') format('truetype');font-weight:200 800}`}</style>
  <Audio src={staticFile('assets/debate-ar/mix.wav')} volume={1.109}/>
  <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute'}}>
   <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#A9DEE0"/><stop offset="1" stopColor="#E9F0D3"/></linearGradient><linearGradient id="dash" x2="0" y2="1"><stop stopColor="#34505D"/><stop offset="1" stopColor="#132B3B"/></linearGradient></defs>
   <rect width="540" height="960" fill="#F7E5C7"/>
   <rect y="255" width="540" height="475" fill="url(#sky)"/>
   <circle cx="463" cy="320" r="44" fill="#FFD166"/>
   <g transform={`translate(${-t*(road?48:20)%180} 0)`} fill="#80AA96">{Array.from({length:6},(_,i)=><g key={i}><rect x={i*180-20} y="450" width="105" height="150"/><path d={`M${i*180-25} 450l58-36 57 36Z`}/><rect x={i*180+10} y="473" width="22" height="35" fill="#EAD7B4"/><circle cx={i*180+120} cy="475" r="42" fill="#507E6E"/></g>)}</g>
   <path d="M0 574H540V720H0Z" fill="#B9B3A5"/><path d="M0 607H540" stroke="#F3E9D1" strokeWidth="6" strokeDasharray="45 45" strokeDashoffset={-t*65}/>
   <g transform={`translate(${focus},0) translate(270 500) scale(${zoom}) translate(-270 -500)`}>
    <path d="M0 285Q270 245 540 285V328Q270 294 0 328Z" fill="#132B3B"/>
    <path d="M5 302L36 655M535 302L504 655" stroke="#203E4E" strokeWidth="29"/>
    <path d="M255 303V623" stroke="#203E4E" strokeWidth="14"/>
    {[139,399].map(x=><g key={x}><rect x={x-68} y="427" width="136" height="204" rx="40" fill="#405763" stroke="#132B3B" strokeWidth="5"/><rect x={x-48} y="382" width="96" height="64" rx="22" fill="#405763" stroke="#132B3B" strokeWidth="5"/></g>)}
    <Person x={145} woman={false} talk={!woman&&speaking} t={t} hot={!ac}/><Person x={395} woman talk={woman&&speaking} t={t} hot={!ac}/>
    <ellipse cx="145" cy="602" rx="53" ry="39" fill="none" stroke="#102837" strokeWidth="13"/><path d="M97 603H193M145 603V636" stroke="#102837" strokeWidth="9"/>
    <path d="M-5 638Q270 603 545 638V745H-5Z" fill="url(#dash)"/>
    {[76,192,348,464].map(x=><g key={x}><rect x={x-32} y="649" width="64" height="34" rx="8" fill="#102837"/>{[-10,0,10].map(y=><path key={y} d={`M${x-22} ${665+y}h44`} stroke="#5C8990" strokeWidth="2"/>)}</g>)}
    <rect x="228" y="647" width="84" height="51" rx="9" fill="#102837" stroke="#5C8990" strokeWidth="2"/><text x="270" y="680" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="27" fill={ac?'#39C8D5':'#7B9295'}>{ac?'A/C ON':'A/C OFF'}</text>
   </g>
   {ac&&<g fill="none" stroke="#39C8D5" strokeWidth="4" opacity=".65">{[65,195,348,473].map((x,i)=><path key={i} d={`M${x} 640q${Math.sin(t*5+i)*12} -30 0 -65`}/>)}</g>}
   {turn===2&&<g fill="none" stroke="#FFF7E9" strokeWidth="4" opacity=".8">{[0,1,2].map(i=><path key={i} d={`M530 ${390+i*25}q-80 ${Math.sin(t*6+i)*15} -130 0`}/>)}</g>}
  </svg>
  <div style={{position:'absolute',left:104,top:228,fontWeight:800,fontSize:23,letterSpacing:4,color:'#183342'}}>E SE BUGASSE?</div>
  <div key={turn} style={{position:'absolute',left:104,top:291,right:100,color:'#183342',fontSize:59,fontWeight:800,letterSpacing:-2,lineHeight:1.05}}>{title}</div>
  <div style={{position:'absolute',left:104,top:386,color:'#A34E3A',fontSize:23,fontWeight:800}}>{explaining?'MITO OU VERDADE?':'UMA VIAGEM. DUAS OPINIÕES.'}</div>
  {explaining&&<div style={{position:'absolute',left:104,right:104,top:450,padding:'22px 26px',background:'#183342',borderRadius:22,color:'#FFF7E9',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:27,fontWeight:800}}><span>{road?'CARRO + VELOCIDADE':'COMPRESSOR'}</span><span style={{color:'#FFD166'}}>↔</span><span style={{color:'#39C8D5'}}>{road?'CALOR':'RESISTÊNCIA DO AR'}</span></div>}
  {cap&&<div style={{position:'absolute',left:100,right:140,top:1390,minHeight:105,padding:'18px 10px',boxSizing:'border-box',background:'#F7E5C7',borderRadius:16,textAlign:'center',fontSize:47,lineHeight:1.15,fontWeight:800,color:'#183342'}}>{cap.words.map((w,i)=><React.Fragment key={i}><span style={{color:t>=w.start&&t<w.end?'#C4553C':'#183342'}}>{w.text}</span>{' '}</React.Fragment>)}</div>}
 </AbsoluteFill>;
};
