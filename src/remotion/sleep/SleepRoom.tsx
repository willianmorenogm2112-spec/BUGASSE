import React from 'react';
import {smooth} from './sleepMotion';
export const SC={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',gold:'#FFD166',cream:'#FFF7E9',muted:'#82A4A6'};
export const Plant:React.FC<{judging?:number}>=({judging=0})=><g stroke="#203C3D" strokeWidth="7" strokeLinejoin="round">
 <ellipse cx="0" cy="139" rx="90" ry="20" fill="#122638" opacity=".14" stroke="none"/>
 <path d="M-55 30h110L40 133h-80Z" fill="#C97B62"/><path d="M-63 25H63v25H-63Z" fill="#DF9A79"/>
 <path d="M0 25V-139" stroke="#497B68"/><path d="M0-70Q-100-180-85-80Q-63-29 0-70" fill="#72A484"/><path d="M0-35Q100-139 88-49Q62 1 0-35" fill="#5D9479"/><path d="M0-102Q-47-210 19-186Q65-160 0-102" fill="#7FB194"/>
 {judging>0&&<g opacity={judging}><path d="M-55-98l28 8m58 33 28-10" strokeWidth="6"/><circle cx="-40" cy="-81" r="5" fill={SC.ink}/><circle cx="43" cy="-43" r="5" fill={SC.ink}/><path d="M-12-42q10-10 20 0" fill="none"/></g>}
 </g>;
export const Bed:React.FC<{x:number}>=({x})=><g transform={`translate(${x} 1120)`} stroke="#3E5960" strokeWidth="8" strokeLinejoin="round">
 <ellipse cx="210" cy="235" rx="255" ry="35" fill="#122638" opacity=".16" stroke="none"/>
 <path d="M-20 220v-205q0-20 20-20h65q20 0 20 20v90" fill="#C58770"/><path d="M25 150h430v78H25Z" fill="#9A6B5F"/><path d="M10 94h460v95H10Z" fill="#FFF7E9"/><rect x="26" y="76" width="150" height="75" rx="30" fill="#E3D8C2"/><path d="M174 95h292v100H174Z" fill="#39A8AD"/><path d="M200 111v57m30-57v57m30-57v57m30-57v57m30-57v57m30-57v57m30-57v57m30-57v57" stroke="#8AD2CD" strokeWidth="4"/><path d="M35 227v22m390-22v22" strokeWidth="15"/>
 </g>;
export const SleepRoom:React.FC<{index:number;local:number;time:number;bedReturnAt?:number}>=({index:i,local,time,bedReturnAt=0})=>{
 const night=i<2?1:i<4?1-smooth(local/3):i<12?.3:.85;
 const bedX=i===0?50-640*smooth((local-.15)/1):i===18?-590+640*smooth((local-bedReturnAt)/1):i>=19?50:-590;
 return <g strokeLinejoin="round">
 <defs>
 <linearGradient id="sleep-wall" x2=".8" y2="1"><stop stopColor="#DFE1D1"/><stop offset="1" stopColor="#A6BFC0"/></linearGradient>
 <pattern id="sleep-floor" width="220" height="120" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)"><rect width="220" height="120" fill="#BA977B"/><path d="M0 0H220V120" stroke="#937763" strokeWidth="3" fill="none"/></pattern>
 </defs>
 <rect width="1080" height="1920" fill="url(#sleep-wall)"/><path d="M0 0h65v1220L0 1260" fill="#8CA8A5"/>
 <path d="M0 1240h1080v680H0Z" fill="url(#sleep-floor)"/><path d="M0 1230h1080" stroke="#6A8D8D" strokeWidth="15"/>
 <rect x="115" y="340" width="345" height="525" rx="18" fill="#355D6A"/><rect x="133" y="359" width="309" height="488" fill="#A8DAD9"/>
 <rect x="133" y="359" width="309" height="488" fill="#192D4B" opacity={night}/>
 {[0,1,2,3,4].map(j=><g key={j}><rect x={138+j*62} y={650-(j%3)*48} width="53" height="195" fill="#527783"/><path d={`M${152+j*62} ${685-(j%3)*48}v12m0 24v12m19-48v12m0 24v12`} stroke="#FFD166" strokeWidth="7" opacity={.2+night*.7}/></g>)}
 <circle cx="372" cy="439" r="35" fill={SC.cream}/><circle cx="385" cy="427" r="34" fill="#192D4B" opacity={night}/>
 <path d="M285 360v487M133 608h309" stroke="#355D6A" strokeWidth="12"/>
 <path d="M98 325v559m362-559v559" stroke="#577D7A" strokeWidth="32"/>
 <g transform="translate(807 400)" stroke={SC.ink} strokeWidth="7"><circle r="91" fill={SC.cream}/>{Array.from({length:12},(_,j)=><path key={j} d="M0-69v11" transform={`rotate(${j*30})`}/>)}<path d="M0 0V-58" transform={`rotate(${time*20})`} strokeWidth="5"/><path d="M0 0V-39" transform={`rotate(${time*1.6+70})`}/><circle r="6" fill={SC.coral}/></g>
 <g transform="translate(625 680)" stroke="#44686A" strokeWidth="7"><path d="M0 0h320v30H0Z" fill="#A9836C"/><path d="M20-10v-85h42v85m8 0v-115h45v115m8 0v-98h37v98" fill="#39A9AE"/><path d="M185-10v-75h90v75" fill="#DA9F7B"/><path d="M185-85l45-40 45 40" fill={SC.gold}/></g>
 <ellipse cx="500" cy="1390" rx="430" ry="112" fill="#6D9290"/><ellipse cx="500" cy="1390" rx="405" ry="93" fill="none" stroke="#A2BDB0" strokeWidth="5" strokeDasharray="10 12"/>
 <Bed x={bedX}/>
 <g stroke="#36535B" strokeWidth="9"><path d="M645 1098v230m280-230v230" strokeWidth="19"/><rect x="605" y="1060" width="365" height="50" rx="12" fill="#C99B76"/><rect x="665" y="883" width="210" height="147" rx="13" fill={SC.ink}/><rect x="680" y="898" width="180" height="116" rx="5" fill="#3D6972"/><path d="M770 1030v30m-70 0h140" strokeWidth="13"/><path d="M703 934h105m-105 25h75m-75 25h120" stroke={SC.cyan} strokeWidth="6" opacity=".55"/></g>
 {i!==12&&i!==13&&<g transform="translate(927 1230) scale(.78)"><Plant/></g>}
 <rect width="1080" height="1920" fill="#132A44" opacity={night*.13}/>
 </g>;
};
