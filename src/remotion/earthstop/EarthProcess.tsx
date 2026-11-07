import React from 'react';
import {EC as C,CaptionLabel as Label,DynamicCup as Cup,Street,BugiActor} from './EarthWorld';
import {phase} from './earthDirection';
import {mix} from './earthMotion';

export const EnvironmentChain=({u,waterAt,structuresAt}:{u:number;waterAt:number;structuresAt:number})=><>
 <Label y={300} size={55} color={C.cream}>O chão para. O restante reage.</Label>
 <g opacity={phase(u,0,.3)}>
   <rect x="100" y="430" width="880" height="260" rx="30" fill="#24465A"/>
   <Label x={220} y={580} size={40} color={C.cream}>AR</Label>
   {[0,1].map(j=><path key={j} d={`M${390+(u*160+j*270)%360} ${530+j*70}h150q45 0 25-25`} fill="none" stroke={C.cyan} strokeWidth="10"/>)}
 </g>
 <g opacity={phase(u,waterAt,.35)}>
   <rect x="100" y="750" width="880" height="260" rx="30" fill="#24465A"/>
   <Label x={220} y={900} size={40} color={C.cream}>ÁGUA</Label>
   <path d="M380 800v170h510V800" fill="none" stroke={C.cream} strokeWidth="9"/>
   <path d={`M390 890 Q520 ${850+Math.sin((u-waterAt)*3)*30} 630 890 T880 875V960H390Z`} fill={C.cyan}/>
 </g>
 <g opacity={phase(u,structuresAt,.4)}>
   <rect x="100" y="1070" width="880" height="290" rx="30" fill="#24465A"/>
   <Label x={275} y={1230} size={32} color={C.cream}>ESTRUTURAS</Label>
   <path d="M470 1310h430" stroke={C.cream} strokeWidth="9"/>
   {[0,1,2].map(j=><g key={j} transform={`translate(${550+j*130} 1300) skewX(${phase(u,structuresAt,1)*(3+j)*Math.sin(Math.min(Math.max(0,u-structuresAt),1.2)*2)})`}>
     <rect x="-45" y={-140-j*30} width="90" height={140+j*30} fill={C.gold}/>
     <path d="M-25-110h15m20 0h15m-50 40h15m20 0h15" stroke={C.ink} strokeWidth="13"/>
   </g>)}
 </g>
 <Label y={1430} size={25} color={C.cream}>Esquemas ilustrativos • não calculam danos reais</Label>
</>;

export const PlanetBrakeStreet=({u}:{u:number})=>{
 const p=phase(u,.15,1.6);
 return <>
   <Street time={u} travel={p*480} wind={p} brakingIntensity={p} broken/>
   <BugiActor x={mix(330,650,p)} action={u<.5?'brake':'drift'} local={Math.max(0,u-.5)}/>
   <Cup x={mix(470,940,p)} y={850-Math.sin(p*Math.PI)*160} rotation={p*180} spill={p} scale={1.8}/>
   <path d={`M100 1370h${800*p}`} stroke={C.coral} strokeWidth="15"/>
   <Label y={320} size={57}>Agora, o chão inteiro freia.</Label>
 </>;
};

export const AftermathProcess=({u,gravityAt}:{u:number;gravityAt:number})=>{
 const falling=phase(u,gravityAt,.85),restarted=phase(u,.3,1.1);
 return <>
   <path d="M140 1270h800" stroke={C.cream} strokeWidth="13"/>
   <Cup x={620} y={1230} scale={2.7} shattered/>
   <g opacity={1-phase(u,gravityAt,.4)}>
     <path d={`M180 620 A220 220 0 1 1 180 1020`} fill="none" stroke={C.cyan} strokeWidth="14" strokeDasharray="850" strokeDashoffset={850*(1-restarted)}/>
     <path d="M150 970l30 50 55-25" fill="none" stroke={C.cyan} strokeWidth="14"/>
     <Label y={1400} color={C.cream} size={43}>Voltar a girar ≠ desfazer impactos</Label>
   </g>
   <g opacity={phase(u,gravityAt,.25)}>
     <circle cx="400" cy={mix(650,1225,falling*falling)} r="33" fill={C.gold}/>
     <path d="M400 760v260m-30-35 30 35 30-35" fill="none" stroke={C.coral} strokeWidth="13" opacity={1-falling}/>
     <Label y={1400} color={C.gold} size={49}>A gravidade continua.</Label>
   </g>
 </>;
};
