import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import timing from '../../../public/assets/gravidade/timing.json';
import {gravityActing,smooth} from './gravityMotion';
import {GravityRoom} from './GravityRoom';
const C={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',gold:'#FFD166',cream:'#FFF7E9'};
const headings=['MEU JOELHO PEDIU DEMISSÃO!','E SE A GRAVIDADE DOBRASSE?','ENGORDEI SEM COMER?!','MESMA MASSA. DOBRO DO PESO.','ACADEMIA SEM MATRÍCULA.','LEVANTAR DÁ MAIS TRABALHO.','EU TENHO UM PLANO!','O SALTO ENCOLHE.','ATLETA DO SOFÁ.','A QUEDA ACELERA.','MEU CELULAR, NÃO!','DEZ SEGUNDOS DEPOIS…','TREINO DO ANO: FEITO.'];
const Arrow:React.FC<{x:number;y:number;length:number;color:string}>=({x,y,length,color})=><g stroke={color} strokeWidth="12" fill="none" strokeLinecap="round"><path d={`M${x} ${y}v${length}m-20-22 20 22 20-22`}/></g>;
const Phone:React.FC<{x:number;y:number;rot?:number;color?:string}>=({x,y,rot=0,color=C.ink})=><g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-31" y="-52" width="62" height="104" rx="12" fill={color} stroke={C.cream} strokeWidth="5"/><rect x="-22" y="-39" width="44" height="68" rx="4" fill={C.cyan}/><circle cy="40" r="4" fill={C.cream}/></g>;

const MassDiagram:React.FC<{local:number}>=({local})=>{
 const reveal=smooth((local-.1)/.35),p=smooth((local-7.6)/1.1);
 return <g opacity={reveal}>
 <rect x="100" y="585" width="850" height="825" rx="45" fill={C.ink}/>
 <text x="525" y="666" textAnchor="middle" fill={C.cream} fontSize="38" fontWeight="800">MASSA NÃO MUDA</text>
 <text x="525" y="754" textAnchor="middle" fill={C.gold} fontSize="80" fontWeight="900">80 kg</text>
 {[0,1].map(j=><g key={j} opacity={smooth((local-(j?7.2:3.6))/.4)} transform={`translate(${j*395} 0)`}><rect x="142" y="850" width="370" height="460" rx="25" fill={j?'#294C5A':'#203C4B'}/><text x="327" y="924" textAnchor="middle" fill={j?C.coral:C.cyan} fontSize="50" fontWeight="900">{j?'2g':'1g'}</text><Arrow x={327} y={965} length={j?80+95*p:80} color={j?C.coral:C.cyan}/><text x="327" y="1220" textAnchor="middle" fill={C.cream} fontSize="48" fontWeight="800">{j?Math.round(785+785*p):785} N</text><text x="327" y="1270" textAnchor="middle" fill="#BDD3D4" fontSize="25">FORÇA DO PESO</text></g>)}
 <text x="525" y="1370" textAnchor="middle" fill={C.cream} fontSize="25">P = massa × gravidade • valores aproximados</text>
 </g>;
};
const JumpDiagram:React.FC<{local:number}>=({local})=>{
 const phase=Math.max(0,(local-1.4)/3);
 return <g><rect x="90" y="570" width="880" height="885" rx="40" fill={C.ink}/><text x="530" y="655" textAnchor="middle" fill={C.gold} fontSize="37" fontWeight="800">MESMA VELOCIDADE DE SAÍDA</text>
 {[0,1].map(j=>{const u=Math.min(1,phase*(j?2:1));return <g key={j}><path d={`M${275+j*440} 1270v-${j?220:440}`} stroke={j?C.coral:C.cyan} strokeWidth="9" strokeDasharray="15 12"/><circle cx={275+j*440} cy={1270-(j?220:440)*4*u*(1-u)} r="30" fill={j?C.coral:C.cyan}/><text x={275+j*440} y="1370" textAnchor="middle" fill={C.cream} fontSize="46" fontWeight="800">{j?'2g • ½ altura':'1g • altura'}</text></g>;})}
 <path d="M150 1300H900" stroke={C.cream} strokeWidth="7"/><text x="530" y="1420" textAnchor="middle" fill="#BDD3D4" fontSize="25">Comparação idealizada • movimento em câmera lenta</text></g>;
};
const DropDiagram:React.FC<{local:number}>=({local})=>{
 const t=Math.max(0,(local-1)/5);
 return <g><rect x="90" y="570" width="880" height="885" rx="40" fill={C.ink}/><text x="530" y="655" textAnchor="middle" fill={C.gold} fontSize="38" fontWeight="800">SOLTO DO REPOUSO • 1 METRO</text>
 {[0,1].map(j=>{const g=j?19.62:9.81,fall=Math.sqrt(2/g),d=Math.min(1,.5*g*t*t);return <g key={j}><text x={285+j*430} y="750" textAnchor="middle" fill={j?C.coral:C.cyan} fontSize="50" fontWeight="800">{j?'2g':'1g'}</text><path d={`M${180+j*430} 820v410m-15-410h30m-30 410h30`} stroke="#70939E" strokeWidth="5"/><Phone x={285+j*430} y={860+d*360} color={j?C.coral:C.ink}/><path d={`M${210+j*430} 1280h160`} stroke={C.cream} strokeWidth="8"/><text x={285+j*430} y="1360" textAnchor="middle" fill={C.cream} fontSize="47" fontWeight="800">{Math.min(t,fall).toFixed(2).replace('.',',')} s</text></g>;})}
 <text x="530" y="1420" textAnchor="middle" fill="#BDD3D4" fontSize="25">Sem resistência do ar • tempo ampliado 5×</text></g>;
};

export const GravityEpisode:React.FC<{technical?:boolean}>=({technical=false})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const turn=timing.turns.filter(q=>q.start<=t).at(-1)??timing.turns[0],i=turn.index,local=t-turn.start;
 const bugi=turn.speaker==='bugi',active=timing.words.some(w=>w.turn===i&&t>=w.start&&t<w.end);
 const amp:number=(timing.envelope as number[])[Math.floor(t*30)]??0;
 const words=timing.words.filter(w=>w.turn===i),wi=words.reduce((n,w,j)=>t>=w.start?j:n,0),page=words.slice(Math.floor(wi/4)*4,Math.floor(wi/4)*4+4);
 const diagram=i===3||i===7||i===9;
 const k=gravityActing(i,local,bugi&&active?amp:0);
 const zoom=i===2||i===4||i===8||i===10||i===12?1.19:1;
 return <AbsoluteFill style={{background:C.ink,fontFamily:'Arial',overflow:'hidden'}}>
 {!technical&&<Audio src={staticFile('assets/gravidade/mix-final.wav')}/>}
 <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute'}}>
 <g transform={`translate(${540*(1-zoom)} ${1130*(1-zoom)}) scale(${zoom})`}>
 <GravityRoom index={i} local={local}/>
 {!diagram&&<g transform="translate(-10 155) scale(1.8)"><BugiArticulatedSvgFigure kinematics={k}/></g>}
 {i===0&&local>.55&&local<1.15&&<g opacity={1-smooth((local-.8)/.35)}><path d="M190 1200l-50-30m600 30 50-30" stroke={C.gold} strokeWidth="10"/><text x="740" y="1070" fill={C.ink} fontSize="54" fontWeight="900" transform="rotate(9 740 1070)">UF!</text></g>}
 {i===1&&<g opacity={smooth((local-.6)/.3)}><g opacity={smooth((local-4.3)/.3)}><Arrow x={640} y={730} length={100+80*smooth(local-6.7)} color={C.coral}/></g><rect x="705" y="745" width="210" height="105" rx="24" fill={C.ink}/><text x="810" y="815" textAnchor="middle" fontSize="60" fontWeight="900" fill={C.gold}>2g</text><g opacity={smooth((local-2.5)/.3)}><rect x="660" y="915" width="300" height="105" rx="20" fill={C.cream}/><text x="810" y="978" textAnchor="middle" fontSize="30" fontWeight="800" fill={C.ink}>MASSA IGUAL</text></g></g>}
 {i===8&&<Phone x={588} y={1100} rot={-8}/>}
 {i===10&&<Phone x={588+41*smooth(local/.35)+35*smooth((local-.55)/.45)} y={1100-150*smooth(local/.35)+380*smooth((local-.55)/.45)} rot={-8+28*smooth((local-.55)/.45)}/>}
 </g>
 {diagram&&<rect width="1080" height="1920" fill={C.ink} opacity=".18"/>}
 <g opacity={smooth(local/.2)} transform={`translate(0 ${22*(1-smooth(local/.3))})`}>
 {i===3&&<MassDiagram local={local}/>} {i===7&&<JumpDiagram local={local}/>} {i===9&&<DropDiagram local={local}/>}
 </g>
 </svg>
 <div style={{position:'absolute',left:70,right:115,top:155,fontSize:59,fontWeight:900,lineHeight:1.07,color:C.ink,background:C.cream,padding:'23px 27px',borderRadius:25,boxShadow:'0 9px 0 #12263825'}}>{headings[i]}</div>
 <div style={{position:'absolute',left:75,top:400,fontSize:25,fontWeight:800,color:C.cream,background:bugi?C.coral:C.ink,padding:'12px 20px',borderRadius:13}}>{bugi?'BUGI • PENSOU ALTO':'NARRADOR • A FÍSICA RESPONDE'}</div>
 <div style={{position:'absolute',right:120,top:465,fontSize:23,color:C.ink,fontWeight:800}}>{i<11?'10 s DE SIMULAÇÃO • TEMPO EXPANDIDO':'GRAVIDADE NORMAL • 1g'}</div>
 <div style={{position:'absolute',left:75,right:135,bottom:240,minHeight:110,padding:'22px 25px',borderRadius:22,background:'#122638F0',fontSize:46,fontWeight:800,lineHeight:1.17,textAlign:'center',color:C.cream}}>{page.map((w,j)=><span key={j} style={{color:active&&t>=w.start&&t<w.end?C.gold:C.cream}}>{w.word} </span>)}</div>
 <div style={{position:'absolute',left:75,bottom:190,fontSize:20,color:C.ink,fontWeight:800}}>E SE BUGASSE? • {technical?'PRÉVIA TÉCNICA • TEMPOS ESTIMADOS':diagram?'TEMPO EXPANDIDO PARA EXPLICAR':'SIMULAÇÃO CARTOON'}</div>
 </AbsoluteFill>;
};
