import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import timing from '../../../public/assets/regeneracao/timing.json';
import {captionPages} from '../gravity/GravityCaptions';
import {fluidPose,flow,ease,Point} from './fluidMotion';
const C={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',gold:'#FFD166',cream:'#FFF7E9',skin:'#F7D5B8'};
const pages=captionPages(timing.words);
const line=(a:Point,b:Point,c:Point)=>`M${a.x} ${a.y}L${b.x} ${b.y}L${c.x} ${c.y}`;
const Limb=({d,color,width}:{d:string;color:string;width:number})=><g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={d} stroke={C.ink} strokeWidth={width+10}/><path d={d} stroke={color} strokeWidth={width}/></g>;
const Marks=({heal=0,scale=1}:{heal?:number;scale?:number})=><g transform={`scale(${scale})`} fill="none" stroke={C.coral} strokeWidth="4" strokeLinecap="round">{[0,1,2].map(j=><path key={j} opacity={1-heal} d={`M${-14+j*11} -12q${8*(1-heal)} ${10*(1-heal)} ${12*(1-heal)} ${23*(1-heal)}`}/>)}</g>;
export const FluidBugi=({time}:{time:number})=>{
 const p=fluidPose(time),heal=ease((time-5.48)/.85);
 const h=p.hip,c=p.chest;
 const look=time>=6.9?Math.max(0,1-ease((time-8.8)/.5)):0;
 const blink=(time>1.62&&time<1.72)||(time>6.94&&time<7.02)||(time>9.8&&time<9.9);
 return <g strokeLinejoin="round" strokeLinecap="round">
  <ellipse cx={h.x} cy="1329" rx={90+p.drop*.25} ry="16" fill={C.ink} opacity=".16"/>
  {(['left','right'] as const).map(side=><g key={side}><Limb d={line(p.hips[side],p.legs[side].elbow,p.legs[side].end)} color={side==='left'?'#193449':'#223E50'} width={30}/><g transform={`translate(${p.legs[side].end.x} ${p.legs[side].end.y})`}><path d="M-16-12h37q30 0 31 22h-70q-8-2 2-22Z" fill={C.cream} stroke={C.ink} strokeWidth="7"/><path d="M-13 10h62" stroke={C.coral} strokeWidth="6"/><path d="M8-11l8 7m7-7 8 7" stroke={C.cyan} strokeWidth="4"/></g></g>)}
  <Limb d={line(p.shoulders.left,p.arms.left.elbow,p.arms.left.end)} color="#193449" width={25}/>
  <path d={`M${c.x-50} ${c.y}Q${c.x-67} ${c.y-15} ${c.x-40} ${c.y-28}L${c.x+35} ${c.y-25}Q${c.x+62} ${c.y-16} ${c.x+52} ${c.y+20}L${h.x+43} ${h.y+14}Q${h.x} ${h.y+30} ${h.x-43} ${h.y+12}Z`} fill={C.ink} stroke={C.ink} strokeWidth="9"/>
  <path d={`M${c.x-20} ${c.y-23}L${c.x+22} ${c.y-22}Q${c.x+8} ${c.y+75} ${h.x+19} ${h.y+17}L${h.x-19} ${h.y+17}Q${c.x-9} ${c.y+65} ${c.x-20} ${c.y-23}Z`} fill={C.cream}/>
  <path d={`M${c.x-25} ${c.y-20}Q${c.x-21} ${c.y+75} ${h.x-24} ${h.y+15}M${c.x+27} ${c.y-20}Q${c.x+16} ${c.y+75} ${h.x+24} ${h.y+15}`} stroke={C.cyan} strokeWidth="5" fill="none"/>
  <circle cx={c.x} cy={c.y+60} r="13" fill={C.gold}/><circle cx={c.x} cy={c.y+60} r="5" fill={C.coral}/>
  <Limb d={line(p.shoulders.right,p.arms.right.elbow,p.arms.right.end)} color="#244356" width={25}/>
  {(['left','right'] as const).map(side=>{
   const a=p.arms[side].elbow,b=p.arms[side].end;
   const skinStart={x:a.x+(b.x-a.x)*.43,y:a.y+(b.y-a.y)*.43};
   return <g key={side}>
    {side==='left'&&<><path d={`M${skinStart.x} ${skinStart.y}L${b.x} ${b.y}`} stroke={C.ink} strokeWidth="31"/><path d={`M${skinStart.x} ${skinStart.y}L${b.x} ${b.y}`} stroke={C.skin} strokeWidth="21"/>
     {time>4.1&&time<6.34&&<g transform={`translate(${a.x+(b.x-a.x)*.72} ${a.y+(b.y-a.y)*.72}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI-90})`}><Marks heal={heal}/></g>}
    </>}
    <circle cx={b.x} cy={b.y} r="16" fill={C.skin} stroke={C.ink} strokeWidth="6"/>
    <path d={`M${b.x-8} ${b.y-4}q-13-8-14 4t15 9`} stroke={C.ink} strokeWidth="4" fill={C.skin}/>
   </g>;
  })}
  <path d={`M${p.neck.x} ${p.neck.y-40}L${p.neck.x} ${p.neck.y+4}`} stroke={C.ink} strokeWidth="38"/>
  <path d={`M${p.neck.x} ${p.neck.y-40}L${p.neck.x} ${p.neck.y+4}`} stroke={C.skin} strokeWidth="25"/>
  <g transform={`translate(${p.head.x} ${p.head.y}) rotate(${p.headAngle})`}>
   <circle cx="-82" cy="5" r="18" fill={C.skin} stroke={C.ink} strokeWidth="7"/><circle cx="82" cy="5" r="18" fill={C.skin} stroke={C.ink} strokeWidth="7"/>
   <rect x="-82" y="-82" width="164" height="167" rx="66" fill={C.skin} stroke={C.ink} strokeWidth="8"/>
   <g transform={`translate(0 145) scale(1.35) rotate(${flow(time-.09,[[0,0],[3,-2],[4.15,5],[4.45,-4],[4.8,0],[9,0],[9.4,-2],[10,0],[12,0]])})`}>
    <path d="M-60-134C-80-176-42-188-30-168C-24-212 10-208 16-170C34-206 72-190 54-152C80-156 78-124 56-118C30-144-28-144-60-134Z" fill={C.coral} stroke={C.ink} strokeWidth="6"/>
    <path d="M-27-169q20-24 40-2" stroke={C.gold} strokeWidth="4" fill="none" opacity=".7"/>
   </g>
   {[-1,1].map(sign=><g key={sign} transform={`translate(${sign*31} -9)`}>
    {blink?<path d="M-17 0h34" stroke={C.ink} strokeWidth="7"/>:<><ellipse cx={p.lookX*.6} cy={p.lookY*.5} rx="20" ry={25+p.worry*3} fill={C.ink}/><circle cx={-6+p.lookX*.6} cy={-10+p.lookY*.5} r="7" fill={C.cream}/></>}
    <path d={`M-17 ${-42+sign*(p.worry*9-look*6)}q17 ${-9-p.worry*5} 34 ${-sign*(p.worry*9-look*6)}`} fill="none" stroke={C.ink} strokeWidth="7"/>
   </g>)}
   <ellipse cx="-57" cy="32" rx="14" ry="8" fill={C.coral} opacity=".24"/><ellipse cx="57" cy="32" rx="14" ry="8" fill={C.coral} opacity=".24"/>
   {p.worry>.7?<ellipse cy="50" rx="15" ry="13" fill={C.ink}/>:look>.3?<path d="M-18 54q18-11 36 0" stroke={C.ink} strokeWidth="6" fill="none"/>:<path d="M-23 45q20 27 47-2" stroke={C.ink} strokeWidth="6" fill="none"/>}
  </g>
 </g>;
};
const Courtyard=({time}:{time:number})=><>
 <defs><linearGradient id="courtyard" x2="0" y2="1"><stop stopColor="#9CC6C8"/><stop offset="1" stopColor="#F5E3BC"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#courtyard)"/>
 <rect x="-40" y="400" width="1150" height="910" fill="#E5D0AE"/>
 <path d="M0 410H1080M0 1285H1080" stroke="#C3A689" strokeWidth="30"/>
 {[0,1,2].map(j=><g key={j} transform={`translate(${j*390-40} 560)`}><rect width="280" height="430" rx="70" fill="#406B77" stroke="#B69B7D" strokeWidth="14"/><path d="M140 0v430M0 190h280" stroke="#D9C39C" strokeWidth="14"/><path d="M15 390 265 30m-250 100 90-110" stroke="#79ADB4" strokeWidth="35" opacity=".35"/></g>)}
 <path d="M0 360Q540 300 1080 360" stroke={C.ink} strokeWidth="5" fill="none"/>
 {[0,1,2,3,4,5,6].map(j=><g key={j} transform={`translate(${70+j*160} ${355+25*Math.sin(j/2)}) rotate(${Math.sin(time*.7+j)*1.1})`}><path d="M0 0v50" stroke={C.ink} strokeWidth="5"/><ellipse cy="61" rx="15" ry="20" fill={C.gold}/></g>)}
 <rect y="1290" width="1080" height="630" fill="#55717B"/>
 <path d="M0 1320H1080" stroke="#D1C1A2" strokeWidth="28"/>
 {[0,1,2,3,4,5].map(j=><path key={j} d={`M${j*240-100} 1920l180-600`} stroke="#6E8991" strokeWidth="4"/>)}
 <path d="M0 1730H1080" stroke="#6E8991" strokeWidth="4"/>
 <g transform="translate(950 1190)"><path d="M-55 0h110l-15 120h-80Z" fill="#B8795E" stroke={C.ink} strokeWidth="7"/>{[-1,0,1].map(j=><path key={j} d={`M0 10q${j*120} -80 ${j*65+Math.sin(time+j)*4} -190q${-j*100} 5 ${-j*40} 190`} fill={j%2?'#467B66':'#649179'}/>)}</g>
 <path d="M540 1320q35-12 60-3t65 4" fill="none" stroke={C.ink} strokeWidth="12"/>
 <path d="M570 1318l12-17 55 4 13 16Z" fill="#A8B8B5" stroke={C.ink} strokeWidth="5"/>
</>;
const MacroSkin=({time}:{time:number})=>{
 const heal=ease((time-5.48)/.85),entry=ease((time-4.75)/.3);
 return <g>
  <rect width="1080" height="1920" fill="#152D40"/>
  <circle cx="540" cy="850" r="480" fill="#23475B" opacity=".6"/>
  <g transform={`translate(540 940) rotate(${flow(time,[[4.75,-8],[5.1,-3],[5.8,0],[6.9,2]])}) scale(${.85+.15*entry}) translate(-540 -940)`}>
   <path d="M80 825H760Q805 770 850 800L967 875Q1000 900 960 925L940 970Q930 1050 850 1050H80Z" fill={C.skin} stroke={C.ink} strokeWidth="14"/>
   <path d="M840 870l90 50m-105-15 89 46m-103-6 83 42" stroke="#DCAD95" strokeWidth="7" fill="none"/>
   {[0,1,2].map(j=><g key={j} transform={`translate(${420+j*85} 934) rotate(-17)`}>
     <path d={`M-10 -70Q${10*(1-heal)} -20 ${-8*(1-heal)} 20T12 76`} stroke="#EAA794" strokeWidth={26*(1-heal)} fill="none" strokeLinecap="round" opacity={1-heal}/>
     <path d={`M-10 -70Q${10*(1-heal)} -20 ${-8*(1-heal)} 20T12 76`} stroke={C.coral} strokeWidth={7*(1-heal)} fill="none" strokeLinecap="round" opacity={1-heal}/>
     <path d={`M-10 ${-70+146*heal}q16 2 25-7`} stroke={C.cream} strokeWidth="7" fill="none" opacity={Math.sin(heal*Math.PI)}/>
   </g>)}
  </g>
  <path d={`M${300+heal*450} 770v340`} stroke={C.cyan} strokeWidth="5" opacity={Math.sin(heal*Math.PI)*.6}/>
  <text x="540" y="450" textAnchor="middle" fill={C.cream} fontSize="56" fontWeight="900">Em segundos…</text>
  <g opacity={ease((time-6.3)/.22)}><text x="540" y="1240" fill={C.gold} fontSize="48" fontWeight="900" textAnchor="middle">O arranhão desapareceu.</text></g>
 </g>;
};
export const FluidPilot:React.FC=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const macro=t>=4.75&&t<6.9;
 const page=pages.find((p,j)=>t>=p[0].start&&t<(pages[j+1]?.[0].start??12)&&t<=p.at(-1)!.end+.17);
 return <AbsoluteFill style={{background:C.ink,fontFamily:'Arial',overflow:'hidden'}}>
  <Audio src={staticFile('assets/regeneracao/mix-final.wav')}/>
  <svg width="100%" height="100%" viewBox="0 0 1080 1920">
   {!macro?<><Courtyard time={t}/><FluidBugi time={t}/></>:<MacroSkin time={t}/>}
   <g transform="translate(95 160)"><circle r={10+(timing.envelope[f]??0)*4} fill={C.cyan}/>{[0,1,2].map(j=><path key={j} d={`M${27+j*18} ${-6-(timing.envelope[f]??0)*12}v${12+(timing.envelope[f]??0)*24}`} stroke={C.cyan} strokeWidth="5" strokeLinecap="round"/>)}</g>
   <text x="540" y="1800" fill={C.cream} opacity=".65" fontSize="26" textAnchor="middle">Hipótese fictícia</text>
  </svg>
  {page&&<div style={{position:'absolute',top:1485,left:85,right:130,textAlign:'center',fontSize:66,fontWeight:900,lineHeight:1.15,color:C.cream,textShadow:'0 4px 0 #122638, 3px 0 0 #122638, -3px 0 0 #122638'}}>{page.map((w,i)=><React.Fragment key={i}><span style={{color:t>=w.start&&t<w.end?C.cyan:C.cream}}>{w.word}</span>{i<page.length-1?' ':''}</React.Fragment>)}</div>}
 </AbsoluteFill>;
};
