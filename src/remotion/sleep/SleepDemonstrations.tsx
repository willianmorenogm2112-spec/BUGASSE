import React from 'react';
import {SC as C} from './SleepRoom';
import {Brain} from './SleepGraphics';
import {smooth} from './sleepMotion';

type Props={index:number;local:number;cue:(word:string,fallback?:number)=>number};
const Label=({y,children,size=42,color=C.cream}:{y:number;children:React.ReactNode;size?:number;color?:string})=><text x="540" y={y} textAnchor="middle" fill={color} fontSize={size} fontWeight="800">{children}</text>;
const Window=({children}:{children:React.ReactNode})=><g><rect x="0" y="0" width="1080" height="1920" fill={C.ink}/><path d="M0 1360h1080" stroke="#335362" strokeWidth="5"/>{children}</g>;

// Every cut is driven by a spoken concept. These are illustrations, never measured clinical data.
export const hasDemonstration=(index:number)=>[1,2,3,4,6,10,14,16,18].includes(index);
export const SleepDemonstrations:React.FC<Props>=({index:i,local:t,cue})=>{
 if(i===1){
  const p=smooth((t-.3)/.5);
  return <Window><Label y={440} size={74} color={C.gold}>+8 h</Label><Label y={510} size={32}>O plano do Bugi</Label>
   {[0,1,2].map(j=><g key={j} transform={`translate(${170+j*265} ${660+260*(1-smooth((t-.6-j*.45)/.45))})`} opacity={p}>
    <rect width="220" height="330" rx="24" fill={j===1?C.gold:C.cream}/><circle cx="110" cy="95" r="48" fill={C.cyan}/>
    <path d={j===0?'M78 95h64m-32-32v64':j===1?'M78 111l25-32 39 15':'M78 85h64m-64 25h64'} stroke={C.ink} strokeWidth="9" fill="none"/>
    <text x="110" y="240" textAnchor="middle" fill={C.ink} fontSize="29" fontWeight="800">{['TRABALHAR','GANHAR','FAZER TUDO'][j]}</text>
   </g>)}<Label y={1210} size={32}>A promessa parece boa…</Label></Window>;
 }
 if(i===2){
  const phase=t<cue('atenção',5)?0:t<cue('memória',6)?1:t<cue('humor',7)?2:3;
  const titles=['Ainda precisa dormir','Atenção falha','Memória falha','Erros e irritação'];
  return <Window><Label y={445}>{titles[phase]}</Label>
   {phase===0?<><Brain x={540} y={830} scale={1.8} time={t}/><g opacity={smooth((t-1)/.4)}><path d="M330 1110h420m-350-50v110m280-110v110" stroke={C.cyan} strokeWidth="18"/><Label y={1260} size={34}>A necessidade continua</Label></g></>:
   <><rect x="200" y="610" width="680" height="470" rx="30" fill={C.cream}/>
    {[0,1,2].map(j=><path key={j} d={`M265 ${710+j*110}h${j===1?390:530}`} stroke="#96B7B4" strokeWidth="17" strokeLinecap="round"/>)}
    {phase===1?<circle cx={280+450*((t*.45)%1)} cy="710" r="31" fill={C.cyan}/>:
     phase===2?<g opacity={1-smooth((t-cue('memória',6))/.9)}><rect x="310" y="765" width="460" height="80" rx="15" fill={C.gold}/><text x="540" y="819" textAnchor="middle" fontSize="34" fill={C.ink}>O que eu ia fazer?</text></g>:
     <g><path d="M480 735l120 120m0-120-120 120" stroke={C.coral} strokeWidth="23"/><Label y={1190} color={C.gold} size={35}>Tenta → erra → tenta de novo</Label></g>}
   </>}
  </Window>;
 }
 if(i===3){
  const reading=t<cue('merda',4),progress=(t%1.15)/1.15;
  return <Window><rect x="145" y="490" width="790" height="720" rx="34" fill={C.cream}/>
   <text x="540" y="680" textAnchor="middle" fill={C.ink} fontSize="44" fontWeight="800">Eu estava lendo esta frase.</text>
   <path d="M230 710h620" stroke={C.gold} strokeWidth="20" opacity=".5"/>
   <circle cx={reading?235+600*smooth(progress/.75):835} cy="710" r="13" fill={C.coral}/>
   {reading?<path d="M820 800q0 170-560 65m0 0 40-24m-40 24 40 27" stroke={C.cyan} strokeWidth="13" fill="none"/>:<path d="M470 840l140 140m0-140L470 980" stroke={C.coral} strokeWidth="22"/>}
   <text x="540" y="1110" textAnchor="middle" fill={C.ink} fontSize="36" fontWeight="800">{reading?'Volta para o começo…':'De novo?!'}</text>
  </Window>;
 }
 if(i===4){
  const compare=t>=cue('zero',7),clarify=t>=cue('não',10),p=smooth((t-cue('prejuízo',3))/.6);
  return <Window><Label y={445} size={40}>Cerca de 24 h acordado</Label>
   {t<cue('prejuízo',3)?<><g transform="translate(540 820)" stroke={C.cyan} strokeWidth="12"><circle r="190" fill="none"/>{[0,1,2,3].map(j=><path key={j} d="M0-160v25" transform={`rotate(${j*90})`}/>)}<path d="M0 0v-130" transform={`rotate(${360*smooth(t/cue('prejuízo',3))})`} stroke={C.gold}/><circle r="12" fill={C.cream}/></g><Label y={1160} size={38}>Uma noite em claro…</Label></>:
   !compare?<><Label y={580} size={32}>Ilustração de uma resposta atrasada</Label>
    <circle cx="540" cy="820" r="110" fill={t>cue('testes',4)?C.gold:C.cyan}/>
    <path d={`M220 1120h${640*p}`} stroke={C.coral} strokeWidth="17" strokeLinecap="round"/>
    <g transform={`translate(${220+640*smooth((t-cue('testes',4)-.6)/.7)} 1120)`}><circle r="29" fill={C.cream}/><path d="M0 38v50m-30-30h60" stroke={C.cream} strokeWidth="12"/></g>
   </>:<><Brain x={300} y={790} scale={1.2} time={t}/><path d="M470 770h100m-100 35h100" stroke={C.cyan} strokeWidth="12"/><text x="770" y="810" textAnchor="middle" fill={C.gold} fontSize="83" fontWeight="900">0,10%</text>
    <Label y={990} size={35}>Comparação em certos testes</Label><Label y={1040} size={35}>de desempenho</Label>
    {clarify&&<g><path d="M230 1140l60 60m0-60-60 60" stroke={C.coral} strokeWidth="10"/><text x="650" y="1185" textAnchor="middle" fill={C.cream} fontSize="31">Não aparece álcool no sangue</text></g>}
   </>}<Label y={1310} size={24} color="#9FC0C3">CDC/NIOSH • comparação não é universal individual</Label></Window>;
 }
 if(i===6){
  const at=cue('apagões',3),u=t-at,missing=u>.3&&u<1.3,x=220+640*smooth((t-cue('microssonos',2))/4);
  return <Window><Label y={445}>Microssono</Label><Label y={515} size={31}>Uma lacuna na percepção</Label>
   <path d="M150 1010h780" stroke="#547682" strokeWidth="15"/>
   {[0,1,2,3,4].map(j=><g key={j}><rect x={130+j*170} y="650" width="140" height="235" rx="18" fill={j===2&&u>.3?'#304957':C.cyan}/><path d={`M${150+j*170} 710h100m-100 45h70`} stroke={C.ink} strokeWidth="10"/></g>)}
   <circle cx={x} cy="1010" r="29" fill={C.gold}/>
   {missing&&<rect x="110" y="590" width="860" height="520" rx="25" fill={C.ink} opacity=".94"/>}
   <Label y={1225} size={34}>{u>1.3?'O mundo continuou. Você perdeu um trecho.':'A informação está passando…'}</Label>
   <Label y={1320} size={24} color="#9FC0C3">Representação ilustrativa • não mede duração individual</Label>
  </Window>;
 }
 if(i===10){
  const returns=smooth((t-cue('mas',3))/.6),rise=smooth((t-cue('alerta',2))/.7);
  return <Window><Label y={445}>Café e alerta</Label>
   <g transform="translate(300 800)" stroke={C.ink} strokeWidth="10"><path d="M-95-100H95V100q0 65-95 65t-95-65Z" fill={C.cream}/><path d="M95-60h40q90 60-40 120" fill="none" stroke={C.cream}/><ellipse cy="-100" rx="95" ry="24" fill="#80594B"/></g>
   <path d="M450 800h120m-30-25 30 25-30 25" stroke={C.cyan} strokeWidth="12" fill="none"/>
   <g transform="translate(750 800)"><circle r="115" fill={C.gold}/><path d={`M0-75V0l${45*rise} ${30*rise}`} stroke={C.ink} strokeWidth="12" fill="none"/><path d="M-100-100l-30-30m230 30 30-30" stroke={C.coral} strokeWidth="14" opacity={rise*(1-returns)}/></g>
   <Label y={1110} size={38}>{returns>.5?'O sono continua necessário':'O alerta pode aumentar por um tempo'}</Label>
   <g opacity={returns}><path d="M360 1200h360m-300-40v80m240-80v80" stroke={C.cyan} strokeWidth="14"/><path d="M480 1160l120 80m0-80-120 80" stroke={C.coral} strokeWidth="14"/></g>
  </Window>;
 }
 if(i===14){
  const p=smooth((t-cue('variam',3))/.8);
  return <Window><Label y={445}>Cada pessoa pode reagir diferente</Label>
   {[0,1,2].map(j=><g key={j} transform={`translate(180 ${680+j*190})`}><circle r="36" fill={[C.cyan,C.gold,C.coral][j]}/><path d={`M80 0q170 ${(-1)**j*70} ${230+p*(190-j*60)} 0`} stroke={[C.cyan,C.gold,C.coral][j]} strokeWidth="16" fill="none"/><circle cx={310+p*(190-j*60)} r="16" fill={C.cream}/></g>)}
   <Label y={1270} size={32}>Não existe um calendário universal</Label><Label y={1330} size={23} color="#9FC0C3">Trajetórias ilustrativas • não são dados clínicos</Label>
  </Window>;
 }
 if(i===16){
  const danger=t>=cue('erros',5);
  return <Window><Label y={455} size={39}>{danger?'O risco já está no cotidiano':'Sem prazo humano confiável'}</Label>
   {!danger?<><circle cx="540" cy="820" r="175" stroke="#547682" fill="none" strokeWidth="13"/><Label y={875} size={150} color={C.gold}>?</Label><path d="M365 645l350 350" stroke={C.coral} strokeWidth="18"/></>:
   <><path d="M160 900h760" stroke="#547682" strokeWidth="30"/><g transform={`translate(${240+500*smooth((t-cue('acidentes',6))/1.5)} 850)`}><rect x="-85" y="-75" width="170" height="80" rx="20" fill={C.coral}/><circle cx="-50" r="25" fill={C.cream}/><circle cx="50" r="25" fill={C.cream}/></g><path d="M850 680v280m-25-280h50" stroke={C.gold} strokeWidth="14"/><Label y={1150} size={35}>Erros e acidentes não esperam um “limite”</Label></>}
  </Window>;
 }
 if(i===18){
  return <Window><Label y={445}>Dormir faz parte do funcionamento</Label><Brain x={540} y={795} scale={1.45} time={t}/>
   {[0,1,2].map(j=><g key={j} opacity={smooth((t-cue('funcionamento',3)-j*.3)/.5)}><path d={`M${340+j*200} 1040v160`} stroke={C.cyan} strokeWidth="9"/><circle cx={340+j*200} cy="1200" r="40" fill={C.gold}/></g>)}
   <Label y={1330} size={30}>Cérebro e corpo trabalham juntos</Label>
  </Window>;
 }
 return null;
};
