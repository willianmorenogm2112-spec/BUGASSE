import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {SunShort} from './SunShort';

export const EditingPilot:React.FC=()=>{
 const f=useCurrentFrame(),t=f/30;
 return <AbsoluteFill><SunShort/>
 <Sequence from={136} durationInFrames={5}><Audio src={staticFile('assets/pilot-atrito-v5/sfx-original.wav')} startFrom={257} volume={0.2}/></Sequence>
 <Sequence from={285} durationInFrames={11}><Audio src={staticFile('assets/pilot-atrito-v5/sfx-original.wav')} startFrom={34} volume={0.14}/></Sequence>
 <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',fontFamily:'Arial, sans-serif'}}>
 {t<4.2&&<g><g transform="translate(120 740)"><rect width="42" height="200" rx="21" fill="#FFF7E9" stroke="#122638" strokeWidth="7"/><rect x="14" y={70-Math.min(t,2)*20} width="14" height={130+Math.min(t,2)*20} fill="#FF6B50"/><circle cx="21" cy="205" r="34" fill="#FF6B50" stroke="#122638" strokeWidth="7"/><text x="-20" y="290" fill="#122638" fontSize="31" fontWeight="900">CALOR!</text></g>{[0,1,2].map(i=><path key={i} d={`M${340+i*100} 710q-25-35 0-70t0-70`} transform={`translate(0 ${-(f*1.4+i*15)%45})`} fill="none" stroke="#FF6B50" strokeWidth="8" opacity=".6"/>)}</g>}
 {t>=3.24&&t<4.2&&<path d="M620 870Q740 750 800 590l-22 25m22-25 10 40" fill="none" stroke="#FF6B50" strokeWidth="12" strokeDasharray="18 10"/>}
 {t>=4.52&&t<6&&<g transform="translate(120 600)"><rect width="680" height="100" rx="24" fill="#122638"/><circle cx="55" cy="50" r="30" fill="#39C8D5"/><path d="M38 49l12 13 24-28" stroke="#122638" strokeWidth="8" fill="none"/><text x="110" y="65" fill="#FFF7E9" fontSize="39" fontWeight="900">PEDIDO RECEBIDO</text></g>}
 {t>=7.16&&t<9.5&&<g transform="translate(140 600)"><rect width="300" height="145" rx="28" fill="#FFF7E9" stroke="#122638" strokeWidth="7"/><text x="150" y="100" textAnchor="middle" fontSize="80" fontWeight="900" fill="#122638">1 s</text><text x="355" y="65" fill="#122638" fontSize="40" fontWeight="900">NADA</text><text x="355" y="115" fill="#122638" fontSize="40" fontWeight="900">MUDOU.</text></g>}
 {t>=9.5&&<g><rect y="500" width="1080" height="940" fill="#102236"/><circle cx="195" cy="880" r="100" fill="#FFD166"/><circle cx="865" cy="880" r="80" fill="#39C8D5"/><path d="M320 880H770" stroke="#FFD166" strokeWidth="6" strokeDasharray="15 18" opacity=".3"/><path d={`M320 880H${320+Math.min(1,(t-9.5)/2.2)*450}`} stroke="#FFD166" strokeWidth="15" strokeLinecap="round"/><circle cx={320+Math.min(1,(t-9.5)/2.2)*450} cy="880" r="20" fill="#FFF7E9"/><text x="195" y="1080" textAnchor="middle" fill="#FFD166" fontSize="38" fontWeight="800">SOL</text><text x="865" y="1080" textAnchor="middle" fill="#39C8D5" fontSize="38" fontWeight="800">TERRA</text><text x="540" y="1270" textAnchor="middle" fill="#FFF7E9" fontSize="43" fontWeight="900">A LUZ JÁ SAIU. ELA CONTINUA.</text></g>}
 </svg></AbsoluteFill>;
};
