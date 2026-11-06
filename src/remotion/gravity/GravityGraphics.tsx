import React from 'react';
import {smooth} from './gravityMotion';
export const GC={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',gold:'#FFD166',cream:'#FFF7E9'};
export const Phone:React.FC<{x:number;y:number;rot?:number;color?:string}>=({x,y,rot=0,color=GC.ink})=><g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-31" y="-52" width="62" height="104" rx="12" fill={color} stroke={GC.cream} strokeWidth="5"/><rect x="-22" y="-39" width="44" height="68" rx="4" fill={GC.cyan}/><circle cy="40" r="4" fill={GC.cream}/></g>;
export const ForceArrow:React.FC<{x:number;y:number;length:number;color:string}>=({x,y,length,color})=><g stroke={color} strokeWidth="12" fill="none" strokeLinecap="round"><path d={`M${x} ${y}v${length}m-20-22 20 22 20-22`}/></g>;
const Panel:React.FC<{children:React.ReactNode}>=({children})=><g><rect x="82" y="380" width="886" height="970" rx="45" fill="#071B29" opacity=".98"/><rect x="101" y="400" width="848" height="930" rx="33" fill="none" stroke="#365769" strokeWidth="2"/>{children}</g>;
export const MassDiagram:React.FC<{local:number}>=({local})=>{
 const force=smooth((local-3.5)/.6),double=smooth((local-7.3)/.8);
 return <Panel>
 <text x="525" y="490" textAnchor="middle" fill={GC.cream} fontSize="42" fontWeight="800">MESMA MASSA</text>
 <g transform={`translate(525 560) scale(${.94+.06*smooth(local/.4)})`}><path d="M-80 0H80" stroke={GC.cyan} strokeWidth="16"/><rect x="-122" y="-42" width="43" height="84" rx="10" fill={GC.cyan}/><rect x="79" y="-42" width="43" height="84" rx="10" fill={GC.cyan}/></g>
 <text x="525" y="710" textAnchor="middle" fill={GC.gold} fontSize="80" fontWeight="900">80 kg</text>
 <g opacity={force}>
 <path d="M190 1150H860" stroke="#65818E" strokeWidth="4"/>
 {[0,1].map(j=>{const growth=j?double:force,height=j?330:165,x=j?640:240;return <g key={j} opacity={j?smooth((local-6.8)/.4):1}>
 <rect x={x} y={1150-height*growth} width="160" height={height*growth} rx="14" fill={j?GC.coral:GC.cyan}/>
 <text x={x+80} y={1120-height*growth} fill={GC.cream} fontSize="47" fontWeight="900" textAnchor="middle">{j?'1570 N':'785 N'}</text>
 <text x={x+80} y="1220" fill={j?GC.coral:GC.cyan} fontSize="46" fontWeight="900" textAnchor="middle">{j?'2g':'1g'}</text>
 </g>;})}
 </g>
 <text x="525" y="1300" textAnchor="middle" fill="#BCD1D5" fontSize="25">Peso = massa × gravidade • valores aproximados</text>
 </Panel>;
};
export const JumpDiagram:React.FC<{local:number}>=({local})=>{
 const phase=Math.max(0,(local-1.2)/3);
 return <Panel><text x="525" y="475" textAnchor="middle" fill={GC.cream} fontSize="44" fontWeight="800">METADE DA ALTURA</text>
 {[0,1].map(j=>{const u=Math.min(1,phase*(j?2:1)),height=j?215:430,x=300+j*420;return <g key={j}><path d={`M${x} 1110v-${height}`} stroke={j?GC.coral:GC.cyan} strokeWidth="7" strokeDasharray="12 14" opacity=".6"/>
 <circle cx={x} cy={1110-height*4*u*(1-u)} r="43" fill={j?GC.coral:GC.cyan}/><path d={`M${x-100} 1160h200`} stroke={GC.cream} strokeWidth="7"/>
 <text x={x} y="1230" textAnchor="middle" fill={j?GC.coral:GC.cyan} fontSize="46" fontWeight="900">{j?'2g • ½ altura':'1g'}</text></g>;})}
 <text x="525" y="1295" textAnchor="middle" fill="#BCD1D5" fontSize="25">Mesma velocidade de saída • câmera lenta</text></Panel>;
};
export const DropDiagram:React.FC<{local:number}>=({local})=>{
 const t=Math.max(0,(local-.8)/5);
 return <Panel><text x="525" y="480" textAnchor="middle" fill={GC.cream} fontSize="46" fontWeight="800">QUEDA DE 1 METRO</text>
 {[0,1].map(j=>{const g=j?19.62:9.81,fall=Math.sqrt(2/g),d=Math.min(1,.5*g*t*t),x=300+j*420;return <g key={j}>
 <text x={x} y="585" textAnchor="middle" fill={j?GC.coral:GC.cyan} fontSize="48" fontWeight="900">{j?'2g':'1g'}</text>
 <path d={`M${x-95} 660v440m-12-440h24m-24 440h24`} stroke="#66858F" strokeWidth="5"/>
 <Phone x={x} y={710+d*350} color={j?GC.coral:GC.ink}/>
 <path d={`M${x-85} 1130h170`} stroke={GC.cream} strokeWidth="7"/>
 {d===1&&<ellipse cx={x} cy="1130" rx={55+20*smooth((t-fall)*5)} ry="12" fill="none" stroke={j?GC.coral:GC.cyan} strokeWidth="4" opacity={1-smooth((t-fall)*3)}/>}
 <text x={x} y="1220" textAnchor="middle" fill={GC.cream} fontSize="58" fontWeight="900">{Math.min(t,fall).toFixed(2).replace('.',',')} s</text></g>;})}
 <text x="525" y="1300" textAnchor="middle" fill="#BCD1D5" fontSize="25">Do repouso • sem arrasto • tempo ampliado 5×</text></Panel>;
};
