import React from 'react';
import {smooth} from './gravityMotion';
export const GravityRoom:React.FC<{index:number;local:number}>=({index,local})=>{
 const compress=index===0?12*smooth((local-.5)/.18)*(1-smooth((local-.75)/.35)):0;
 return <g strokeLinejoin="round">
 <defs>
  <linearGradient id="wall" x2=".8" y2="1"><stop stopColor="#F8EAD4"/><stop offset="1" stopColor="#D3D9CE"/></linearGradient>
  <linearGradient id="sofa" x2="0" y2="1"><stop stopColor="#DB7868"/><stop offset="1" stopColor="#AB4F4F"/></linearGradient>
  <linearGradient id="window" x2="0" y2="1"><stop stopColor="#7EC9D1"/><stop offset="1" stopColor="#D2EEE7"/></linearGradient>
  <pattern id="floor" width="230" height="105" patternUnits="userSpaceOnUse" patternTransform="skewX(-20)"><rect width="230" height="105" fill="#BA9577"/><path d="M0 0H230V105" fill="none" stroke="#96765D" strokeWidth="3"/></pattern>
 </defs>
 <rect width="1080" height="1920" fill="url(#wall)"/>
 <path d="M0 0H90V1250L0 1330" fill="#C0C8BB"/>
 <rect x="105" y="400" width="395" height="560" rx="12" fill="#497683"/>
 <rect x="124" y="419" width="357" height="520" fill="url(#window)"/>
 <circle cx="393" cy="510" r="43" fill="#FFF7E9" opacity=".8"/>
 {[0,1,2,3,4,5].map(j=><g key={j}><rect x={130+j*62} y={740-j%3*70} width="53" height="200" fill={j%2?'#6E9BA4':'#96B9BA'}/>{[0,1,2].map(n=><path key={n} d={`M${141+j*62} ${770-j%3*70+n*39}h26`} stroke="#C5DDD0" strokeWidth="10"/>)}</g>)}
 <path d="M300 420V940M125 680H480" stroke="#497683" strokeWidth="15"/>
 <path d="M125 940L480 940 935 1490 605 1530Z" fill="#FFF7D6" opacity=".16"/>
 <path d="M0 1260L1080 1215V1920H0Z" fill="url(#floor)"/>
 <path d="M0 1253L1080 1208" stroke="#738980" strokeWidth="16"/>
 <ellipse cx="550" cy="1460" rx="470" ry="145" fill="#477B7C"/>
 <ellipse cx="550" cy="1455" rx="445" ry="125" fill="none" stroke="#7DABA4" strokeWidth="5" strokeDasharray="12 10"/>
 <g stroke="#526B69" strokeWidth="9"><path d="M873 1110V620M800 1110H944"/><path d="M795 620L827 490H922L957 620Z" fill="#FFD166"/><path d="M825 625h102" stroke="#F1BA55" strokeWidth="17"/></g>
 <g transform="translate(622 470)" stroke="#728C83" strokeWidth="8"><rect width="160" height="210" rx="6" fill="#FFF7E9"/><path d="M18 160l48-70 33 34 43-74v142H18" fill="#39A9AD" stroke="none"/><circle cx="57" cy="48" r="18" fill="#FFD166"/></g>
 <path d="M965 1270v-115h65v115" fill="#C16B57"/><g stroke="#477C67" strokeWidth="13" fill="#5C947B"><path d="M996 1170V1000"/><ellipse cx="964" cy="1070" rx="23" ry="48" transform="rotate(-32 964 1070)"/><ellipse cx="1020" cy="1040" rx="24" ry="55" transform="rotate(28 1020 1040)"/></g>
 <ellipse cx="480" cy="1385" rx="330" ry="43" fill="#263E40" opacity=".26"/>
 <g stroke="#503B42" strokeWidth="8">
 <path d="M220 1270v100m480-100v100" strokeWidth="24"/>
 <rect x="174" y="1020" width="566" height="260" rx="60" fill="url(#sofa)"/>
 <path d="M457 1035v180" stroke="#BF5D55"/>
 <g transform={`translate(0 ${compress})`}><rect x="190" y="1180" width="535" height="140" rx="33" fill="#C36C60"/><path d="M218 1205H697" stroke="#E7987C" strokeWidth="6"/></g>
 <rect x="142" y="1130" width="94" height="207" rx="34" fill="#B45A54"/><rect x="685" y="1130" width="94" height="207" rx="34" fill="#B45A54"/>
 </g>
 <g transform="translate(800 1440)"><ellipse rx="150" ry="46" fill="#5B493D" opacity=".2"/><path d="M-90-20l-15 145m180-145 15 145" stroke="#695645" strokeWidth="13"/><ellipse cy="-30" rx="145" ry="53" fill="#E2B98F" stroke="#80634F" strokeWidth="7"/><ellipse cx="36" cy="-40" rx="38" ry="15" fill="#9E7961"/><path d="M18-94v49q18 20 36 0v-49" fill="#FFF7E9" stroke="#80634F" strokeWidth="5"/><path d="M54-88q30-3 22 25H54" fill="none" stroke="#FFF7E9" strokeWidth="9"/></g>
 </g>;
};
