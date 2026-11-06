import React from 'react';
import {SC as C,Plant} from './SleepRoom';
import {smooth,travelMeters} from './sleepMotion';
const Txt:React.FC<{x?:number;y:number;size?:number;color?:string;children:React.ReactNode}>=({x=540,y,size=46,color=C.cream,children})=><text x={x} y={y} textAnchor="middle" fill={color} fontSize={size} fontWeight="800">{children}</text>;
export const Brain:React.FC<{x:number;y:number;scale?:number;time?:number}>=({x,y,scale=1,time=0})=><g transform={`translate(${x} ${y}) scale(${scale})`} stroke={C.ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d="M0-85C-80-130-150-60-110-10C-157 50-81 110 0 80C81 110 157 50 110-10C150-60 80-130 0-85Z" fill="#EFA295"/><path d="M0-85V80M-68-62q-35 35 0 55m-11 36q29 0 27 37m-6-65q48-24 58 12m66-71q-31 23-9 51m17 29q28 33-12 43m-41-78q29-9 38 7" fill="none" stroke="#B45D63" strokeWidth="6"/>{[[-55,-35],[55,-20],[-34,42],[50,50]].map(([a,b],j)=><circle key={j} cx={a} cy={b} r={5+3*Math.max(0,Math.sin(time*2+j))} fill={C.gold} stroke="none"/>)}</g>;
const Card:React.FC<{local:number;children:React.ReactNode}>=({local,children})=><g opacity={smooth(local/.28)} transform={`translate(0 ${20*(1-smooth(local/.4))})`}><rect x="70" y="345" width="940" height="1040" rx="45" fill={C.ink} stroke="#477481" strokeWidth="4"/>{children}</g>;
export const Performance:React.FC<{local:number;compareAt?:number;clarifyAt?:number;noAlcoholAt?:number}>=({local,compareAt=2,clarifyAt=5,noAlcoholAt=9})=><Card local={local}>
 <Txt y={438} size={43}>CERCA DE 24 h ACORDADO</Txt><Brain x={280} y={675} scale={1.05} time={local}/>
 <g opacity={smooth((local-compareAt)/.4)}><path d="M447 660h140m-140 28h140" stroke={C.cyan} strokeWidth="12" strokeLinecap="round"/><Txt x={778} y={674} size={86} color={C.gold}>0,10%</Txt><Txt x={778} y={729} size={30}>álcool no sangue</Txt></g>
 <g opacity={smooth((local-clarifyAt)/.5)}><rect x="134" y="837" width="812" height="125" rx="24" fill="#244957"/><Txt y={893} size={37}>Comparação em certos testes</Txt><Txt y={938} size={32} color={C.cyan}>de desempenho</Txt></g>
 <g opacity={smooth((local-noAlcoholAt)/.4)}><path d="M235 1085l65 65m0-65-65 65" stroke={C.coral} strokeWidth="10"/><Txt x={607} y={1120} size={34}>Sem álcool surgindo no corpo</Txt></g>
 <Txt y={1300} size={26} color="#9FC0C3">CDC/NIOSH • não é equivalência individual universal</Txt>
 </Card>;
export const Micro:React.FC<{local:number}>=({local})=>{
 const lapse=local>1.85&&local<2.7,p=smooth((local-3)/3);
 return <g opacity={smooth(local/.3)}>
 <rect x="112" y="500" width="800" height="265" rx="28" fill={C.ink}/>
 {[0,1,2,3,4,5,6,7].map(j=><g key={j} opacity={j===3||j===4?lapse?.12:.4:1}><rect x={146+j*91} y="540" width="73" height="103" rx="12" fill={j===3||j===4?'#52747B':C.cyan}/><path d={`M${157+j*91} 579h50m-50 23h35`} stroke={C.ink} strokeWidth="6"/></g>)}
 <text x="510" y="714" textAnchor="middle" fill={C.cream} fontSize="35" fontWeight="800">Pedaços que você não percebe</text>
 <path d="M164 751h690" stroke={C.cyan} strokeWidth="5" strokeDasharray="690" strokeDashoffset={690*(1-p)}/>
 </g>;
};
export const Road:React.FC<{local:number;driveAt?:number}>=({local,driveAt=3})=>{
 const u=Math.max(0,Math.min(3,local-driveAt)),distance=travelMeters(100,u),x=175+distance/83.333*695;
 return <Card local={local}>
 <Txt y={447} size={44}>100 km/h</Txt><Txt y={517} size={33} color={C.cyan}>Exemplo: 3 s sem atenção</Txt>
 <rect x="123" y="720" width="834" height="230" rx="24" fill="#45616D"/><path d="M133 835h810" stroke={C.cream} strokeWidth="8" strokeDasharray="36 25"/>
 <path d={`M170 1020h${distance/83.333*690}`} stroke={C.gold} strokeWidth="10" strokeLinecap="round"/>
 <path d="M170 997v47m695-47v47" stroke={C.gold} strokeWidth="5"/>
 <g transform={`translate(${x} 805)`} stroke={C.ink} strokeWidth="6"><path d="M-60-20l25-40h70l25 40 20 14v52H-80V-6Z" fill={C.coral}/><path d="M-28-49h56l15 29h-86Z" fill="#ADE6E5"/><circle cx="-49" cy="42" r="17" fill={C.ink}/><circle cx="49" cy="42" r="17" fill={C.ink}/><path d="M-20 2h39" stroke="#F9B49B"/></g>
 <Txt y={1142} size={92} color={C.gold}>{Math.round(distance)} m</Txt><Txt y={1220} size={30}>Distância percorrida • não é frenagem</Txt>
 </Card>;
};
export const Coffee:React.FC<{local:number;alarm?:boolean}>=({local,alarm=false})=><g opacity={smooth(local/.25)} transform="translate(783 803)">
 <ellipse cy="224" rx="135" ry="22" fill={C.ink} opacity=".16"/>
 <g stroke={C.ink} strokeWidth="8"><path d="M-83-40h166v165q0 48-83 48t-83-48Z" fill={C.cream}/><path d="M83-20h32q53 57-32 91" fill="none"/><ellipse cy="-40" rx="83" ry="19" fill="#80594B"/><path d={`M-36-75q${18*Math.sin(local*2)}-26 0-52m70 52q${-18*Math.sin(local*2)}-26 0-52`} fill="none" stroke="#6F9495" strokeWidth="6"/></g>
 {alarm&&<g transform="translate(0 58)"><circle r="48" fill={C.gold} stroke={C.ink} strokeWidth="6"/><path d="M0-32V0l20 17" fill="none" stroke={C.ink} strokeWidth="6"/><path d="M-46-44l-13-13m105 13 13-13" stroke={C.coral} strokeWidth="8"/></g>}
 </g>;
export const Perception:React.FC<{local:number;judging:boolean}>=({local,judging})=><g opacity={smooth(local/.3)}>
 <g transform="translate(812 1040) scale(1.85)"><Plant judging={judging?smooth(local/.4):smooth((local-2)/.5)}/></g>
 {!judging&&<g opacity={smooth((local-4)/.4)}><rect x="130" y="475" width="800" height="110" rx="24" fill={C.ink}/><Txt y={546} size={35}>Percepção pode se distorcer</Txt></g>}
 </g>;
export const Variation:React.FC<{local:number}>=({local})=><Card local={local}>
 <Txt y={468} size={43}>NÃO É UM CRONÔMETRO</Txt>
 {[0,1,2].map((j)=><g key={j} opacity={smooth((local-j*.3)/.4)}><circle cx="196" cy={670+j*176} r="38" fill={j===0?C.cyan:j===1?C.gold:C.coral}/><path d={`M270 ${670+j*176}h${(390+j*60)*smooth(local/1.8)}`} stroke={j===0?C.cyan:j===1?C.gold:C.coral} strokeWidth="18" strokeLinecap="round"/><circle cx={270+(390+j*60)*smooth(local/1.8)} cy={670+j*176} r="16" fill={C.cream}/></g>)}
 <Txt y={1225} size={33}>Efeitos e horários variam entre pessoas</Txt><Txt y={1300} size={26} color="#9FC0C3">Esquema ilustrativo • não representa dados individuais</Txt>
 </Card>;
export const Risk:React.FC<{local:number}>=({local})=><Card local={local}>
 <Txt y={463} size={42}>SEM PRAZO HUMANO CONFIÁVEL</Txt>
 <g transform="translate(540 800)" stroke={C.coral} strokeWidth="13" strokeLinejoin="round"><path d="M0-176 192 150H-192Z" fill="#3E3945"/><path d="M0-72v105m0 50v13" stroke={C.gold} strokeLinecap="round"/></g>
 <Txt y={1090} size={39}>Erros e acidentes já são riscos</Txt><Txt y={1160} size={34} color={C.cyan}>antes de qualquer “limite”</Txt>
 </Card>;
