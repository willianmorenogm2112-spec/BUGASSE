import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {pilotMotion} from './motion';
import {onset,reelTime,reelCaptions,reelHeadlines} from './reel';

export interface PilotAssets {
  backgroundUrl?: string;
  narrationUrl?: string;
  technicalPreview: boolean;
  hideReelOverlays?: boolean;
}


export const FrictionPilot:React.FC<{assets:PilotAssets;enableAudio:boolean}>=({assets,enableAudio})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const motionTime=reelTime(t);
  const k=pilotMotion(motionTime),cameraX=interpolate(motionTime,[0,1.8,4,7.3,9.5,10.5,12.5],[0,0,65,190,270,300,300],{extrapolateRight:'clamp'});
  const active=motionTime>=2&&motionTime<7;
  const caption=reelCaptions.find(c=>t>=c.start&&t<c.end);
  const headline=reelHeadlines.find(h=>t>=h.start&&t<h.end)!;
  const reveal=interpolate(t-headline.start,[0,.24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const impact=onset('chão');
  const shake=t>impact&&t<impact+.4?Math.sin((t-impact)*65)*5*Math.exp(-(t-impact)*8):0;
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
    {!assets.hideReelOverlays&&<>
    <div data-reel-safe="brand" style={{position:'absolute',left:108,top:230,color:'#122638',fontSize:25,lineHeight:'32px',fontWeight:800,letterSpacing:5}}>E SE BUGASSE?</div>
    <div key={headline.start} data-reel-safe="headline" style={{position:'absolute',left:108,top:300,width:810,height:236,opacity:reveal,transform:`translateY(${(1-reveal)*18}px)`,filter:`blur(${(1-reveal)*5}px)`,color:'#122638'}}>
      <div style={{fontSize:21,fontWeight:800,letterSpacing:2,marginBottom:22}}>{headline.kicker}</div>
      <div style={{fontSize:62,lineHeight:1.08,fontWeight:800,letterSpacing:-2}}>{headline.lines[0]}<br/><span style={{color:'#D95943'}}>{headline.lines[1]}</span></div>
    </div>
    {t>=onset('cinco')&&motionTime<7&&<div data-reel-safe="rule" style={{position:'absolute',left:108,top:570,width:760,height:45,color:'#122638',fontSize:23,fontWeight:800,display:'flex',alignItems:'center',gap:14}}>
      <span>SEM ATRITO</span><div style={{width:210,height:8,background:'#B9D9D1',borderRadius:4,overflow:'hidden'}}><div style={{width:`${Math.max(0,1-(motionTime-2)/5)*100}%`,height:'100%',background:'#D95943'}}/></div><span>5s</span>
    </div>}
    {caption&&<div data-reel-safe="caption" style={{position:'absolute',left:108,top:1410,width:810,height:90,display:'flex',justifyContent:'center',alignItems:'center',gap:14,fontSize:54,lineHeight:1.15,fontWeight:800,color:'#122638'}}>
      {caption.words.map((word,i)=>{
        const speaking=t>=word.start&&t<word.end;
        return <span key={i} style={{color:speaking?'#C54835':'#122638',transform:`translateY(${speaking?-3:0}px)`,whiteSpace:'nowrap'}}>{word.text}</span>;
      })}
    </div>}
    </>}
  </AbsoluteFill>;
};
