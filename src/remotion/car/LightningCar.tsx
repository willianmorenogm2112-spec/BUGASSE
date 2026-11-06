import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {computeSunBugiKinematics} from '../sun/sunBugiMotion';
import estimatedTiming from '../../../public/assets/raio-carro/technical-timing.json';
type LightningTiming=typeof estimatedTiming;

const C={ink:'#122638',cream:'#FFF7E9',coral:'#FF6B50',cyan:'#39C8D5',gold:'#FFD166'};
const smooth=(x:number)=>{const p=Math.max(0,Math.min(1,x));return p*p*(3-2*p);};

export const LightningCarShape:React.FC<{current?:boolean;roof?:boolean;damaged?:boolean;t:number}>=({current=false,roof=true,damaged=false,t})=><g stroke={C.ink} strokeWidth="7" strokeLinejoin="round">
 <ellipse cx="500" cy="385" rx="420" ry="30" fill="#071824" stroke="none" opacity=".5"/>
 <path d="M65 230L95 179L265 143L365 38H610L741 155L858 188L915 250V330H60Z" fill={C.coral}/>
 <path d="M79 264H904v61H66Z" fill="#C84637" stroke="none"/>
 {roof?<path d="M290 143L378 56H474V143ZM496 56H598L699 143H496Z" fill="#A9D8DF"/>:<path d="M290 143h409" fill="none" strokeWidth="13"/>}
 {roof&&<path d="M475 49v102" strokeWidth="13"/>}
 <path d="M270 170v126M490 163v135M721 167v131" fill="none" opacity=".45" strokeWidth="4"/>
 <path d="M400 178h38m170 0h38" strokeWidth="8" strokeLinecap="round"/>
 <path d="M76 221h78m650-1h72" stroke={C.gold} strokeWidth="22"/>
 <path d="M715 139l24 15-5 20-27-5" fill={C.coral}/>
 {[244,740].map((x,j)=><g key={x}><circle cx={x} cy="324" r="76" fill="#142432"/><circle cx={x} cy="324" r="43" fill="#CAD3D4"/><circle cx={x} cy="324" r="13" fill={C.ink}/>{[0,60,120].map(a=><path key={a} d={`M${x-32} 324h64`} transform={`rotate(${a} ${x} 324)`} stroke="#68818D" strokeWidth="9"/>)}{damaged&&j===0&&<path d={`M${x-55} 363q55 13 110 0`} stroke={C.coral} strokeWidth="12"/>}</g>)}
 {damaged&&<><path d="M520 65l30 20-18 22 45 35M590 68l-30 28 19 22" fill="none" stroke={C.cream} strokeWidth="6"/><path d="M805 200l-18 23 26 13-25 15" fill="none" stroke={C.gold}/></>}
 {current&&<g fill="none" stroke={C.cyan} strokeWidth="12" strokeLinecap="round" strokeDasharray="25 35" strokeDashoffset={-t*180}><path d="M483 35H365L262 141 95 180 62 230V300L180 315 240 395"/><path d="M483 35H610L741 155 858 188 915 250V325L800 327 740 398"/></g>}
</g>;

const Storm:React.FC<{t:number}>=({t})=><g>
 <defs><linearGradient id="stormSky" x2="0" y2="1"><stop stopColor="#142C42"/><stop offset="1" stopColor="#517B89"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#stormSky)"/>
 {[0,1,2,3].map(i=><g key={i} transform={`translate(${i*340-90} ${370+(i%2)*90})`} fill="#1E394B"><ellipse rx="210" ry="75"/><circle cx="-80" cy="-35" r="75"/><circle cx="45" cy="-55" r="90"/></g>)}
 <path d="M0 1080l170-80 120 55 200-80 220 80 150-80 120 60v260H0Z" fill="#345765"/>
 <rect y="1235" width="1080" height="685" fill="#253D4A"/>
 <path d="M0 1350H1080M0 1575H1080" stroke="#8CB1B9" strokeWidth="8" opacity=".25"/>
 {[0,1,2,3].map(i=><path key={i} d={`M${i*360-100} 1460h170`} stroke={C.cream} strokeWidth="13" opacity=".5"/>)}
 {Array.from({length:45},(_,i)=>{const x=(i*137+t*75)%1250-100,y=(i*193+t*650)%1800;return <path key={i} d={`M${x} ${y}l-14 46`} stroke="#A7D5E1" strokeWidth="3" opacity=".26"/>;})}
</g>;

const ActingBugi:React.FC<{index:number;local:number;speaking:boolean;amplitude:number;scale?:number;x?:number;y?:number}>=({index,local,speaking,amplitude,scale=1.65,x=540,y=1350})=>{
 const k=computeSunBugiKinematics(index===0||index===1?'escuro':index===5||index===9?'espera':index===7?'frio':index===11?'final':'plantas',local*30,30,false);
 k.mouthOpenness=speaking?amplitude:0;k.mouthShape=speaking?'open_o':index===1?'panic_wave':'smile';
 k.isBlinking=Math.floor(local*30)%125<4;
 if(index===1||index===5){k.leftBrowDeg=18;k.rightBrowDeg=-18;}
 return <g transform={`translate(${x-270*scale} ${y-685*scale}) scale(${scale})`}><BugiArticulatedSvgFigure kinematics={k}/></g>;
};

const titles=['RAIO NO CARRO!','O PNEU TE SALVOU?','A PROTEÇÃO ESTÁ NA CARROCERIA.','ARMADURA PARCELADA.','GAIOLA DE FARADAY','E O CONVERSÍVEL?','ABERTO NÃO É IGUAL.','QUIETINHO AQUI.','VIDROS FECHADOS.','E O PREJUÍZO?','PROTEÇÃO ≠ CARRO INTACTO','A OFICINA VEM AÍ.','ESPERE O ÚLTIMO TROVÃO.'];

export const LightningCar:React.FC<{timing?:LightningTiming;technical?:boolean}>=({timing=estimatedTiming,technical=true})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const turn=timing.turns.filter(q=>q.start<=t).at(-1)??timing.turns[0];
 const i=turn.index,local=t-turn.start,bugi=turn.speaker==='bugi';
 const speaking=bugi&&timing.words.some(w=>w.turn===i&&t>=w.start&&t<w.end);
 const amplitude=timing.envelope[frame]??0;
 const words=timing.words.filter(w=>w.turn===i),wi=words.reduce((a,w,j)=>t>=w.start?j:a,0),page=words.slice(Math.floor(wi/4)*4,Math.floor(wi/4)*4+4);
 const inside=bugi;
 const current=i===2||i===4;
 const strike=i===0&&local<.65;
 return <AbsoluteFill style={{fontFamily:'Arial',background:C.ink,overflow:'hidden'}}>
 {!technical&&<Audio src={staticFile('assets/raio-carro/mix-final.wav')}/>}
 <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute'}}>
 <Storm t={t}/>
 {!inside&&i!==6&&i!==12&&<g transform={`translate(0 ${850+(i===0?Math.sin(local*28)*Math.exp(-local*6)*12:0)}) scale(1.1)`}><LightningCarShape current={current} damaged={i===10} t={local}/></g>}
 {strike&&<g><path d="M560 400L480 590 570 575 455 850 535 825 530 905" fill="none" stroke={C.gold} strokeWidth="23"/><path d="M560 400L480 590 570 575 455 850 535 825 530 905" fill="none" stroke={C.cream} strokeWidth="8"/></g>}
 {i===0&&<g transform="translate(130 650)"><rect width="300" height="110" rx="22" fill={C.gold}/><text x="150" y="72" textAnchor="middle" fontSize="60" fontWeight="900" fill={C.ink}>CRAC!</text></g>}
 {inside&&<g>
  <path d="M30 625Q540 380 1050 625V1430H30Z" fill="#44707C" stroke={C.ink} strokeWidth="28"/>
  <path d="M100 660Q540 460 980 660V1180H100Z" fill="#6A94A2" stroke={C.ink} strokeWidth="14"/>
  <path d="M128 1110l220-160 230 80 170-110 205 120v180H128Z" fill="#355867"/>
  <path d="M620 660V1200" stroke={C.ink} strokeWidth="28"/>
  <path d="M270 800q190-50 290 0v570H230Z" fill="#18384C" stroke={C.ink} strokeWidth="12"/>
  <clipPath id="seatCrop"><rect x="120" y="520" width="780" height="850"/></clipPath>
  <g clipPath="url(#seatCrop)"><ActingBugi index={i} local={local} speaking={speaking} amplitude={amplitude} x={510} y={1630} scale={2.7}/></g>
  <path d="M260 1130l330 230" stroke={C.cream} strokeWidth="24"/>
  <path d="M0 1350Q540 1210 1080 1350V1920H0Z" fill="#163343" stroke={C.ink} strokeWidth="20"/>
  <ellipse cx="550" cy="1360" rx="155" ry="100" fill="none" stroke={C.ink} strokeWidth="35"/><path d="M420 1360h260m-130 0v90" stroke={C.ink} strokeWidth="22"/>
  <rect x="805" y="1355" width="150" height="95" rx="15" fill="#091F2D" stroke="#628899" strokeWidth="5"/><path d="M825 1400h35l15-22 14 42 13-20h29" stroke={C.cyan} strokeWidth="5" fill="none"/>
 </g>}
 {current&&<g><rect x="100" y="595" width="880" height="170" rx="25" fill={C.ink} stroke={C.cyan} strokeWidth="4"/><text x="540" y="660" textAnchor="middle" fill={C.cyan} fontSize="36" fontWeight="800">DESCARGA PELO EXTERIOR</text><text x="540" y="720" textAnchor="middle" fill={C.cream} fontSize="27">Trajeto ilustrativo • pode haver danos no veículo</text><path d="M530 770v80m-20-25 20 25 20-25" stroke={C.cyan} strokeWidth="9" fill="none"/></g>}
 {i===6&&<g>
  <g transform="translate(100 620) scale(.86)"><LightningCarShape t={t}/></g>
  <rect x="110" y="1010" width="860" height="75" rx="18" fill={C.cyan}/><text x="540" y="1060" textAnchor="middle" fill={C.ink} fontWeight="800" fontSize="35">FECHADO • TETO E ESTRUTURA METÁLICOS</text>
  <g transform="translate(100 1110) scale(.86)"><LightningCarShape roof={false} t={t}/></g>
  <path d="M450 1110l150 150m0-150-150 150" stroke={C.gold} strokeWidth="20"/>
 </g>}
 {i===8&&<g><rect x="105" y="580" width="870" height="220" rx="25" fill={C.cream}/>{['VIDROS FECHADOS','EVITE PARTES METÁLICAS','PARE EM LOCAL SEGURO'].map((s,j)=><g key={s} opacity={smooth((local-j*.4)/.3)}><circle cx="150" cy={625+j*62} r="15" fill={C.cyan}/><text x="185" y={637+j*62} fill={C.ink} fontSize="32" fontWeight="800">{s}</text></g>)}</g>}
 {i===10&&<g>{['PNEUS','VIDROS','ELETRÔNICOS'].map((s,j)=><g key={s} transform={`translate(${110+j*310} 650)`} opacity={smooth((local-j*.45)/.3)}><rect width="280" height="105" rx="20" fill={C.gold}/><text x="140" y="65" textAnchor="middle" fill={C.ink} fontSize="30" fontWeight="800">{s}</text></g>)}</g>}
 {i===12&&<g><circle cx="540" cy="900" r="250" fill={C.cream} stroke={C.cyan} strokeWidth="14"/>{Array.from({length:12},(_,j)=><path key={j} d="M540 680v23" transform={`rotate(${j*30} 540 900)`} stroke={C.ink} strokeWidth="9"/>)}<path d="M540 900V740" transform={`rotate(${smooth(local/3)*180} 540 900)`} stroke={C.coral} strokeWidth="18" strokeLinecap="round"/><text x="540" y="1010" textAnchor="middle" fill={C.ink} fontSize="100" fontWeight="900">30 MIN</text><text x="540" y="1265" textAnchor="middle" fill={C.cream} fontSize="42" fontWeight="800">APÓS O ÚLTIMO TROVÃO</text></g>}
 </svg>
 <div style={{position:'absolute',left:80,top:140,fontSize:24,letterSpacing:4,fontWeight:800,color:C.cyan}}>E SE BUGASSE? • BUGI 2D</div>
 <div style={{position:'absolute',left:80,right:115,top:230,fontSize:58,lineHeight:1.1,fontWeight:900,color:C.cream}}>{titles[i]}</div>
 <div style={{position:'absolute',left:80,top:435,padding:'12px 22px',borderRadius:14,background:bugi?C.coral:C.cream,color:C.ink,fontWeight:800,fontSize:27}}>{bugi?'BUGI • NO SUSTO':'NARRADOR • EXPLICANDO'}</div>
 {t<turn.end&&<div style={{position:'absolute',top:1510,left:80,right:130,padding:25,borderRadius:24,background:C.ink,border:`4px solid ${bugi?C.coral:C.cyan}`,fontSize:43,fontWeight:800,color:C.cream,textAlign:'center',lineHeight:1.25}}>{page.map((w,j)=><span key={j} style={{color:t>=w.start&&t<w.end?(bugi?C.coral:C.cyan):undefined}}>{w.word} </span>)}</div>}
 <div style={{position:'absolute',left:80,right:130,bottom:195,color:'#BCD4DC',fontSize:21}}>{technical?'PRÉVIA TÉCNICA SEM VOZ • TEMPOS ESTIMADOS':'Fontes: NWS / CDC • Ilustração simplificada'}</div>
 </AbsoluteFill>;
};
