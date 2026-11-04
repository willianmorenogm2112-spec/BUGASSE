import React from 'react';
import {AbsoluteFill,Audio,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure,computeBugiArticulatedKinematics} from '../../components/BugiCharacterSvg';
import rawWords from '../../../public/assets/short-tempo/transcript-asr.json';
import type {BugiExpression,BugiPose} from '../../types/studio';

const fix:Record<number,string>={0:'E se',1:'o tempo',4:'cinco',102:'poste.',113:'PÁ!',124:'cinco'};
const words=rawWords.map((w,i)=>({...w,text:fix[i]??w.text}));
const captions=[] as Array<{start:number;end:number;words:typeof words}>;
for(let i=0;i<words.length;i+=3){const slice=words.slice(i,i+3);captions.push({start:slice[0].start,end:slice.at(-1)!.end+.16,words:slice});}
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const chapters=[
  [0,5.16,'A REGRA','E SE O TEMPO','PARASSE?'],[5.16,12.76,'1º SEGUNDO','TUDO','CONGELA.'],
  [12.76,20.16,'2º SEGUNDO','ATÉ O RELÓGIO','PAROU.'],[20.16,25.66,'3º SEGUNDO','A BOLA VINHA','NELE.'],
  [25.66,34.46,'4º SEGUNDO','FALTA SÓ','UM.'],[34.46,42.62,'5º SEGUNDO','O TEMPO','VOLTOU.'],
  [42.62,47.54,'ELE ESQUECEU','BOLAS TAMBÉM','QUICAM.'],[47.54,51,'SUA VEZ','O QUE VOCÊ','FARIA?'],
] as const;
const poseFor=(t:number):{pose:BugiPose;expression:BugiExpression}=>t<5.16?{pose:'olhando_objeto',expression:'curioso'}:t<8.3?{pose:'apontando',expression:'determinado'}:t<20.16?{pose:'investigando',expression:'deslumbrado'}:t<25.66?{pose:'assustando',expression:'surpreso'}:t<34.46?{pose:'equilibrando',expression:'determinado'}:t<39.94?{pose:'comemorando',expression:'confiante'}:t<44.62?{pose:'assustando',expression:'panico_divertido'}:t<47.54?{pose:'reagindo_impacto',expression:'comico'}:{pose:'confiante_parado',expression:'curioso'};

export const TimeShort:React.FC=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,state=poseFor(t);
  const k=computeBugiArticulatedKinematics(state.pose,frame,fps,.35,state.expression);
  k.rootX=interpolate(t,[0,20,25.6,30,34.5,44.6,51],[215,230,280,355,360,350,355],clamp);
  k.rootY=interpolate(t,[0,34.5,44.6,45.1,47.5,51],[510,500,510,545,525,515],clamp);
  if(t>=44.62&&t<47.2){k.torsoRotation=k.torsoRotationDeg=interpolate(t,[44.62,44.85,45.5,47.2],[-8,-38,-22,-5],clamp);k.impactShockwave=t<45.15;}
  const frozen=t>=8.3&&t<35.9;
  const ballX=frozen?410:interpolate(t,[0,8.3,35.9,38.5,43.38,44.62,47],[620,410,410,305,440,355,120],clamp);
  const ballY=frozen?445:interpolate(t,[0,8.3,35.9,38.5,43.38,44.62,47],[390,445,445,500,620,480,760],clamp);
  const dropY=frozen?525:interpolate(t,[0,8.3,35.9,41],[400,525,525,665],clamp);
  const ch=chapters.find(x=>t>=x[0]&&t<x[1])??chapters.at(-1)!;
  const enter=interpolate(t-ch[0],[0,.3],[0,1],clamp),cap=captions.find(x=>t>=x.start&&t<x.end);
  const countdown=t>=25.66&&t<35.9?Math.max(0,5-Math.floor((t-25.66)/2.05)):null;
  const shake=t>=44.62&&t<45.2?Math.sin((t-44.62)*70)*9*Math.exp(-(t-44.62)*5):0;
  return <AbsoluteFill style={{background:'#D8EFEB',fontFamily:'PilotJakarta,Arial,sans-serif',overflow:'hidden',transform:`translate(${shake}px,0)`}}>
    <style>{`@font-face{font-family:PilotJakarta;src:url('${staticFile('assets/pilot-atrito-v1/PlusJakartaSans.ttf')}') format('truetype');font-weight:200 800}`}</style>
    <Audio src={staticFile('assets/short-tempo/mix-final.wav')}/>
    <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute'}}>
      <rect width="540" height="960" fill={frozen?'#C8D8D5':'#D8EFEB'}/><circle cx="452" cy="276" r="42" fill="#FFD166" opacity={frozen?.45:.85}/>
      <g opacity={frozen?.65:1} stroke="#244D55" strokeWidth="2.5"><rect x="-20" y="420" width="220" height="230" rx="8" fill="#F0D5AB"/><rect x="195" y="390" width="205" height="260" rx="8" fill="#EFAE95"/><rect x="395" y="438" width="170" height="212" rx="8" fill="#9ECABF"/>{[20,92,232,310,430,490].map(x=><rect key={x} x={x} y="470" width="42" height="52" rx="15" fill="#396C72"/>)}<path d="M0 555H540V960H0Z" fill="#EFDCC0"/><path d="M0 559H540" stroke="#FFF8E8" strokeWidth="12"/><g opacity=".35" stroke="#B89E79" strokeWidth="1"><path d="M0 680H540M0 790H540M0 900H540"/>{[40,150,260,370,480].map(x=><path key={x} d={`M${x} 560l-75 400`}/>)}</g></g>
      <g transform="translate(76 518)"><rect x="-34" width="70" height="105" rx="12" fill="#244D55" stroke="#122638" strokeWidth="5"/><circle cy="10" r="22" fill={t>=5.16&&t<8.5?'#FFD166':'#FF6B50'} stroke="#122638" strokeWidth="5"/></g>
      <g transform="translate(450 414)"><circle r="62" fill="#FFF7E9" stroke="#122638" strokeWidth="7"/><circle r="50" fill="none" stroke="#39C8D5" strokeWidth="4"/><g stroke="#122638" strokeWidth="5" strokeLinecap="round" transform={`rotate(${frozen?0:t*36})`}><path d="M0 0V-30"/><path d="M0 0L22 10"/></g>{Array.from({length:12},(_,i)=><path key={i} d="M0-44V-51" stroke="#122638" strokeWidth="3" transform={`rotate(${i*30})`}/>)}</g>
      <path d={`M112 390V${dropY}`} stroke="#39C8D5" strokeWidth="3" strokeDasharray="4 8" opacity=".5"/><path d={`M112 ${dropY}q-15 22 0 31q15-9 0-31`} fill="#39C8D5" stroke="#122638" strokeWidth="3"/>
      <g transform={`translate(${ballX} ${ballY}) rotate(${frozen?18:t*150})`}><circle r="31" fill="#FF6B50" stroke="#122638" strokeWidth="5"/><path d="M-24-12Q0 4 24-12M-24 12Q0-4 24 12" fill="none" stroke="#FFF7E9" strokeWidth="5"/></g>
      <g transform="translate(-5,116) scale(.78)"><BugiArticulatedSvgFigure kinematics={k}/></g>
    </svg>
    <div style={{position:'absolute',left:108,top:230,color:'#122638',fontSize:25,fontWeight:800,letterSpacing:5}}>E SE BUGASSE?</div>
    <div key={ch[0]} style={{position:'absolute',left:108,top:300,width:820,opacity:enter,transform:`translateY(${(1-enter)*20}px)`,filter:`blur(${(1-enter)*5}px)`}}><div style={{fontSize:22,fontWeight:800,letterSpacing:3,color:'#122638',marginBottom:20}}>{ch[2]}</div><div style={{fontSize:66,lineHeight:1.05,fontWeight:800,color:'#122638',letterSpacing:-2}}>{ch[3]}<br/><span style={{color:'#D95943'}}>{ch[4]}</span></div></div>
    {countdown!==null&&<div style={{position:'absolute',right:104,top:570,width:165,height:165,borderRadius:'50%',background:'#122638',color:'#FFD166',display:'grid',placeItems:'center',fontSize:90,fontWeight:800,boxShadow:'0 0 0 12px rgba(57,200,213,.25)'}}>{countdown}</div>}
    {frozen&&<div style={{position:'absolute',left:108,top:590,padding:'13px 22px',borderRadius:28,background:'#122638',color:'#FFF7E9',fontSize:22,fontWeight:800,letterSpacing:2}}>TEMPO CONGELADO</div>}
    {cap&&<div style={{position:'absolute',left:92,right:92,top:1430,height:92,display:'flex',justifyContent:'center',alignItems:'center',gap:13,fontSize:51,fontWeight:800,color:'#122638'}}>{cap.words.map((w,i)=><span key={i} style={{color:t>=w.start&&t<w.end?'#C54835':'#122638',transform:t>=w.start&&t<w.end?'translateY(-3px)':'none',whiteSpace:'nowrap'}}>{w.text}</span>)}</div>}
  </AbsoluteFill>;
};
