import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {pilotMotion} from './motion';
import type {Caption} from '@remotion/captions';
import estimatedCaptions from './captions.json';

export interface PilotAssets {
  backgroundUrl?: string;
  narrationUrl?: string;
  technicalPreview: boolean;
}
// Timing is explicitly estimated pending acoustic alignment; this is not word-aligned.
const captions:Caption[]=estimatedCaptions;

export const FrictionPilot:React.FC<{assets:PilotAssets;enableAudio:boolean}>=({assets,enableAudio})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const k=pilotMotion(t),cameraX=interpolate(t,[0,1.8,4,7.3,9.5,10.5,12.5],[0,0,125,350,470,495,495],{extrapolateRight:'clamp'});
  const active=t>=2&&t<7;
  const phrase=captions.find(p=>t*1000>=p.startMs&&t*1000<p.endMs)?.text.split('\n');
  const shake=t>10&&t<10.45?Math.sin((t-10)*65)*7*Math.exp(-(t-10)*7):0;
  return <AbsoluteFill style={{background:'#FFF7E9',fontFamily:'PilotJakarta, sans-serif',overflow:'hidden'}}>
    <style>{`@font-face{font-family:PilotJakarta;src:url('${staticFile('assets/pilot-atrito-v1/PlusJakartaSans.ttf')}') format('truetype');font-weight:200 800}`}</style>
    {enableAudio&&assets.narrationUrl&&<Audio src={assets.narrationUrl}/>}
    {assets.backgroundUrl?<Img src={assets.backgroundUrl} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',transform:`scale(1.08) translateX(${-cameraX*.018}px)`}}/>:
      <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute'}}>
        <rect width="540" height="960" fill="#C8E8E3"/>
        <circle cx="440" cy="180" r="58" fill="#FFD166"/>
        <path d="M-40 360 Q80 210 190 370 Q310 190 570 330 L570 640 H-40Z" fill="#87B9AD"/>
        <g transform={`translate(${-cameraX*.22},0)`}>
          {[0,330,660,990].map((x,i)=><g key={x} transform={`translate(${x},0)`}>
            <rect x="-30" y="350" width="250" height="290" rx="14" fill={i%2?'#E8B389':'#F1D8AC'}/>
            <path d="M-45 365 L100 298 L235 365Z" fill="#DC795E" stroke="#122638" strokeWidth="4"/>
            {[20,110].map(wx=><g key={wx}><rect x={wx} y="400" width="57" height="80" rx="23" fill="#244D5B"/>
              <path d={`M${wx+28} 400V480M${wx} 439H${wx+57}`} stroke="#FFF7E9" strokeWidth="5"/></g>)}
            <path d="M-30 529H220L238 562H-44Z" fill="#122638"/><rect x="56" y="562" width="75" height="78" fill="#244D5B"/>
          </g>)}
        </g>
      </svg>}
    <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute',transform:`translateY(${shake}px)`}}>
      <g transform="translate(0,-80)">
        {/* The ground and props share world coordinates with the actor. */}
        {!assets.backgroundUrl&&<g>
        <path d="M0 685H540V1040H0Z" fill="#E1C7A4"/>
        <path d="M0 685H540" stroke="#FFF7E9" strokeWidth="14"/>
        <path d="M0 695H540" stroke="#B7A383" strokeWidth="5"/>
        <g opacity=".27" stroke="#917E65" strokeWidth="2">
          {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${i*120-cameraX%120} 700 l-90 300`}/>)}
          <path d="M0 760H540M0 864H540"/>
        </g>
        </g>}
        {active&&<g opacity=".55" stroke="#39C8D5" strokeWidth="3" strokeLinecap="round">
          {[0,1,2,3].map(i=><path key={i} d={`M${(i*180-t*220)%720} ${697+i*8}h70`}/>)}</g>}
        <g transform={`translate(${-cameraX},0)`}>
          {/* Pole exists for the whole take. It never pops in at contact. */}
          <ellipse cx="620" cy="687" rx="35" ry="9" fill="#122638" opacity=".17"/>
          <path d="M620 685V435Q620 417 638 417H653" fill="none" stroke="#122638" strokeWidth="17" strokeLinecap="round"/>
          <path d="M620 685V435Q620 417 638 417H653" fill="none" stroke="#2C6670" strokeWidth="9" strokeLinecap="round"/>
          <path d="M635 411H667L678 437H628Z" fill="#FFD166" stroke="#122638" strokeWidth="4"/>
          <path d="M606 685H634" stroke="#122638" strokeWidth="9" strokeLinecap="round"/>
          <BugiArticulatedSvgFigure kinematics={k}/>
        </g>
      </g>
    </svg>
    <div style={{position:'absolute',left:108,top:195,color:'#122638',fontSize:25,fontWeight:800,letterSpacing:5}}>E SE BUGASSE?</div>
    {t<3.8&&<div style={{position:'absolute',left:108,top:252,fontSize:72,lineHeight:1.02,fontWeight:800,color:'#122638',letterSpacing:-3}}>CADÊ O<br/><span style={{color:'#E85D48'}}>ATRITO?</span></div>}
    {t>=3.8&&t<7&&<div style={{position:'absolute',left:108,top:260,fontSize:40,fontWeight:800,color:'#122638'}}>O chão não freia.<br/><span style={{color:'#D95943',fontSize:64}}>Bugi continua.</span></div>}
    {t>=7&&t<10&&<div style={{position:'absolute',left:108,top:260,fontSize:40,fontWeight:800,color:'#122638'}}>Uma última<br/><span style={{color:'#D95943',fontSize:64}}>tentativa.</span></div>}
    {t>=10&&<div style={{position:'absolute',left:108,top:260,fontSize:76,lineHeight:1.05,fontWeight:800,color:'#122638'}}>A INÉRCIA<br/><span style={{color:'#D95943'}}>GANHOU.</span></div>}
    {phrase&&<div style={{position:'absolute',left:100,right:130,top:1270,textAlign:'center',fontSize:59,lineHeight:1.22,fontWeight:800,color:'#122638'}}>
      <div>{phrase[0]}</div><div style={{color:'#C54835',fontSize:66}}>{phrase[1]}</div>
    </div>}
    <div style={{position:'absolute',left:108,bottom:182,color:'#122638',opacity:.65,fontSize:24,fontWeight:700}}>{assets.technicalPreview?'ESTUDO DE MOVIMENTO · CENÁRIO PROVISÓRIO':'MUDA UMA REGRA. COMEÇA O CAOS.'}</div>
  </AbsoluteFill>;
};
