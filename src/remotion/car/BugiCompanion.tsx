import React from 'react';

/** Original companion, authored in the same local scale as Bugi's seated rig. */
export const BugiCompanion:React.FC<{x:number;t:number;talk:boolean;turn:number;hot:boolean}>=({x,t,talk,turn,hot})=>{
 const angry=[0,6,10].includes(turn),ironic=[2,8].includes(turn),blink=(t*30+18)%117<3;
 const tilt=(angry?-5:ironic?7:0)+Math.sin(t*2)*1.2;
 const jaw=talk?3+Math.abs(Math.sin(t*19))*11:1.5;
 const gesture=talk?Math.sin(t*4)*7:0;
 return <g transform={`translate(${x},549) scale(.66)`} stroke="#060D14" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M-62-145Q-75-235 0-235Q75-230 65-140L70-25L-64-28Z" fill="#56363E"/>
  <path d="M-46-24Q0-48 46-24L57 67Q0 88-57 67Z" fill="#FF816A"/>
  <path d="M-15-39V-15Q0 0 15-15V-39" fill="#F6CFB2"/>
  <path d="M-32-20L-20 18M32-20L20 18" stroke="#FFF7E9" strokeWidth="8"/>
  <circle cy="34" r="12" fill="#FFD166"/><circle cy="34" r="4" fill="#FF6B50" stroke="none"/>
  <path d={`M-45-17Q-84 ${12+gesture}-84 ${-36+gesture}`} fill="none" stroke="#060D14" strokeWidth="28"/>
  <path d={`M-45-17Q-84 ${12+gesture}-84 ${-36+gesture}`} fill="none" stroke="#FF816A" strokeWidth="19"/>
  <circle cx="-84" cy={-36+gesture} r="13" fill="#F6CFB2"/>
  <path d="M45-16Q76 24 48 63" fill="none" stroke="#060D14" strokeWidth="28"/><path d="M45-16Q76 24 48 63" fill="none" stroke="#FF816A" strokeWidth="19"/><circle cx="48" cy="63" r="13" fill="#F6CFB2"/>
  <path d="M38-22L-43 68" stroke="#122638" strokeWidth="15"/>
  <g transform={`rotate(${tilt} 0 -120)`}>
   <ellipse cx="-64" cy="-132" rx="12" ry="16" fill="#F6CFB2"/><ellipse cx="64" cy="-132" rx="12" ry="16" fill="#F6CFB2"/>
   <path d="M-65-175Q-59-216 0-216Q61-216 65-175L62-109Q43-65 0-62Q-43-65-62-109Z" fill="#F6CFB2"/>
   <path d="M-64-159Q-79-232-9-235Q57-245 68-189L61-148Q19-170-9-203Q-29-169-64-159Z" fill="#70434A"/>
   <path d="M-44-193Q-24-218 0-214" stroke="#AC7370" strokeWidth="8" fill="none"/>
   <path d="M40-207l20 11-13 15-18-13Z" fill="#39C8D5"/>
   <g transform={`translate(0,-3) scale(1,${blink?.08:1}) translate(0,3)`}>
    <ellipse cx="-27" cy="-137" rx="18" ry={ironic?18:23} fill="#FFF7E9"/><ellipse cx="27" cy="-137" rx="18" ry="23" fill="#FFF7E9"/>
    <ellipse cx="-30" cy="-135" rx="10" ry="15" fill="#122638" stroke="none"/><ellipse cx="24" cy="-135" rx="10" ry="15" fill="#122638" stroke="none"/>
    <circle cx="-33" cy="-142" r="4.5" fill="white" stroke="none"/><circle cx="21" cy="-142" r="4.5" fill="white" stroke="none"/>
    <path d="M-45-147l-8-5M43-147l8-5" fill="none"/>
   </g>
   <path d={angry?'M-45-172l29 12M16-160l29-12':ironic?'M-45-177q16-14 31-2M17-166h27':'M-44-171q15-10 28-2M17-173q14-8 28 2'} fill="none" strokeWidth="6"/>
   <ellipse cx="-45" cy="-109" rx="11" ry="6" fill="#EE9B8F" stroke="none"/><ellipse cx="45" cy="-109" rx="11" ry="6" fill="#EE9B8F" stroke="none"/>
   {talk?<g><ellipse cy="-88" rx="13" ry={jaw} fill="#612C39" strokeWidth="3"/><path d="M-7-92h14" stroke="#FFF7E9" strokeWidth="4"/></g>:<path d={angry?'M-13-88q13-6 26 0':ironic?'M-13-91q13 14 29-4':'M-13-91q13 13 26 0'} fill="none" strokeWidth="4"/>}
   {hot&&<path d="M68-154q-9 14 0 17q9-3 0-17" fill="#39C8D5" strokeWidth="2"/>}
  </g>
 </g>;
};
