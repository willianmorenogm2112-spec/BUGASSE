import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
  const k=pilotMotion(t),cameraX=interpolate(t,[0,1.8,4,7.3,9.5,10.5,12.5],[0,0,65,190,270,300,300],{extrapolateRight:'clamp'});
  const active=t>=2&&t<7;
  const phrase=captions.find(p=>t*1000>=p.startMs&&t*1000<p.endMs)?.text.split('\n');
  const shake=t>10&&t<10.45?Math.sin((t-10)*65)*7*Math.exp(-(t-10)*7):0;
  return <AbsoluteFill style={{background:'#FFF7E9',fontFamily:'PilotJakarta, sans-serif',overflow:'hidden'}}>
    <style>{`@font-face{font-family:PilotJakarta;src:url('${staticFile('assets/pilot-atrito-v1/PlusJakartaSans.ttf')}') format('truetype');font-weight:200 800}`}</style>
    {enableAudio&&assets.narrationUrl&&<Audio src={assets.narrationUrl}/>}
    <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute'}}>
      <rect width="540" height="960" fill="#D8EFEB"/>
      <circle cx="445" cy="330" r="38" fill="#FFD166" opacity=".7"/>
      <g fill="#F8FCF5" opacity=".8"><path d="M30 385q20-30 40-8q28-26 48 8Z"/><path d="M330 405q22-30 43-9q27-23 49 9Z"/></g>
      <g transform={`translate(${-cameraX*.12},0)`} fill="#AFCDC2">
        {[0,120,270,390,540,690].map((x,i)=><path key={x} d={`M${x} 570V${455-i%3*18}h76v115Z`}/>)}
      </g>
      <g transform={`translate(${-cameraX*.35},0)`} stroke="#294A50" strokeWidth="2.5" strokeLinejoin="round">
        {[{x:-45,w:185,c:'#F0D5AB'},{x:155,w:170,c:'#EFAE95'},{x:340,w:180,c:'#9ECABF'},{x:535,w:175,c:'#F0D5AB'}].map(({x,w,c},i)=><g key={x}>
          <rect x={x} y={440+i%2*15} width={w} height={205-i%2*15} rx="5" fill={c}/>
          <path d={`M${x-5} ${447+i%2*15}h${w+10}v-12h-${w+10}Z`} fill="#FFF7E9"/>
          <path d={`M${x+8} 530h${w-16}v18h-${w-16}Z`} fill="#FFF0CD" stroke="none"/>
          {[x+24,x+101].map(wx=><g key={wx}>
            <rect x={wx} y="470" width="44" height="48" rx="17" fill="#3C6970"/>
            <path d={`M${wx+22} 471v46M${wx+2} 495h40`} stroke="#F8E9C9" strokeWidth="3"/>
          </g>)}
          <rect x={x+24} y="562" width="54" height="83" rx="4" fill="#365C62"/>
          <rect x={x+93} y="562" width="63" height="54" rx="3" fill="#365C62"/>
          <path d={`M${x+12} 550h${w-24}l12 17h-${w}Z`} fill={i%2?'#FFF7E9':'#E66D51'}/>
          <path d={`M${x+10} 640h${w-20}`} stroke="#C69473" strokeWidth="7"/>
          <circle cx={x+67} cy="606" r="2" fill="#FFD166" stroke="none"/>
        </g>)}
      </g>
      <path d="M0 645H540V960H0Z" fill="#EFDCC0"/>
      <path d="M0 651H540" stroke="#FFF8E8" strokeWidth="12"/>
      <path d="M0 659H540" stroke="#B6AC92" strokeWidth="3"/>
      <g stroke="#CEB997" strokeWidth="1.2" opacity=".55">
        <path d="M0 714H540M0 790H540M0 890H540"/>
        {Array.from({length:10},(_,i)=><path key={i} d={`M${i*100-cameraX*.78%100} 662l-75 298`}/>)}
      </g>
    </svg>
    <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute',transform:`translateY(${shake}px)`}}>
      <g transform="translate(-25,135) scale(.78)">
        {/* The ground and props share world coordinates with the actor. */}
        {active&&<g opacity=".55" stroke="#39C8D5" strokeWidth="3" strokeLinecap="round">
          {[0,1,2,3].map(i=><path key={i} d={`M${(i*180-t*220)%720} ${697+i*8}h70`}/>)}</g>}
        <g transform={`translate(${-cameraX},0)`}>
          {/* Pole exists for the whole take. It never pops in at contact. */}
          <ellipse cx="620" cy="687" rx="35" ry="9" fill="#122638" opacity=".17"/>
          <path d="M620 685V270Q620 252 638 252H653" fill="none" stroke="#122638" strokeWidth="17" strokeLinecap="round"/>
          <path d="M620 685V270Q620 252 638 252H653" fill="none" stroke="#2C6670" strokeWidth="9" strokeLinecap="round"/>
          <path d="M635 246H667L678 272H628Z" fill="#FFD166" stroke="#122638" strokeWidth="4"/>
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
    {phrase&&<div style={{position:'absolute',left:100,right:130,top:1430,textAlign:'center',fontSize:59,lineHeight:1.22,fontWeight:800,color:'#122638'}}>
      <div>{phrase[0]}</div><div style={{color:'#C54835',fontSize:66}}>{phrase[1]}</div>
    </div>}
    <div style={{position:'absolute',left:108,bottom:155,color:'#122638',opacity:.65,fontSize:24,fontWeight:700}}>{assets.technicalPreview?'ESTUDO DE MOVIMENTO · CENÁRIO PROVISÓRIO':'MUDA UMA REGRA. COMEÇA O CAOS.'}</div>
  </AbsoluteFill>;
};
