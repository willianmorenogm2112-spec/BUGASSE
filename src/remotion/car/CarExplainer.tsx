import React from 'react';
export const CarExplainer:React.FC<{t:number}>=({t})=>{
 const compressor=t<10.86,drag=t<15&&!compressor;
 const title=compressor?'O AR USA ENERGIA':drag?'VIDRO ABERTO = MAIS ARRASTO':t<19.64?'NÃO EXISTE REGRA ÚNICA':t<21.96?'DEVAGAR, PODE AJUDAR':'NA ESTRADA, MUDA';
 return <svg viewBox="0 0 540 960" width="100%" height="100%" style={{position:'absolute'}}>
 <defs><linearGradient id="explainBg" x2="1" y2="1"><stop stopColor="#102D42"/><stop offset="1" stopColor="#205E68"/></linearGradient></defs>
 <rect width="540" height="960" fill="url(#explainBg)"/>
 <g opacity=".08" stroke="#FFF7E9">{Array.from({length:18},(_,i)=><path key={i} d={`M0 ${i*60}H540M${i*60} 0V960`}/>)}</g>
 <text x="52" y="135" fill="#39C8D5" fontFamily="Arial" fontWeight="bold" fontSize="14" letterSpacing="3">ENTENDA A DIFERENÇA</text>
 <text x="52" y="184" fill="#FFF7E9" fontFamily="Arial" fontWeight="bold" fontSize={title.length>25?24:29}>{title}</text>
 <g transform="translate(35 410)" stroke="#102837" strokeWidth="5" strokeLinejoin="round">
 <ellipse cx="240" cy="180" rx="200" ry="16" fill="#061D2D" stroke="none" opacity=".5"/>
 <path d="M20 126L50 85L133 70L183 12H309L365 72L426 94L449 131V163H20Z" fill="#FF785E"/>
 <path d="M150 70L192 25H243V70ZM260 25H301L347 70H260Z" fill={drag?'#FFF4DA':'#9ADADD'}/>
 <path d="M260 25V70" strokeWidth="9"/><path d="M40 120H102M382 108H425" stroke="#FFD166" strokeWidth="12"/>
 {[110,360].map(x=><g key={x}><circle cx={x} cy="158" r="39" fill="#172D3C"/><circle cx={x} cy="158" r="22" fill="#B8D8D6"/><g transform={`rotate(${-t*130} ${x} 158)`}><path d={`M${x-17} 158h34M${x} 141v34`} stroke="#426777"/></g></g>)}
 <path d="M175 90V153M285 90V153" strokeWidth="3" opacity=".45"/><path d="M195 91h15M303 91h15" strokeWidth="4"/>
 </g>
 {compressor?<g transform="translate(270 315)"><circle r="69" fill="#FFD166"/><g transform={`rotate(${t*200})`} fill="#183342">{[0,90,180,270].map(a=><path key={a} d="M0-8Q-60-70-19-50Q12-38 0-8" transform={`rotate(${a})`}/>)}</g><circle r="13" fill="#FFF7E9"/><path d="M0 84v40" stroke="#FFD166" strokeWidth="8"/><text y="-93" textAnchor="middle" fill="#FFD166" fontSize="21" fontWeight="bold">COMPRESSOR</text></g>:<g fill="none" stroke="#39C8D5" strokeWidth="5" strokeLinecap="round">{[0,1,2,3].map(i=><path key={i} d={`M${540-(t*90%80)} ${365+i*30}q-95 ${drag?Math.sin(t*7+i)*25:0} -180 0`} />)}</g>}
 <text x="270" y="680" fill="#FFF7E9" textAnchor="middle" fontSize="22" fontWeight="bold">{compressor?'Refrigeração exige trabalho.':drag?'O vento também tem um custo.':'CARRO  +  VELOCIDADE  +  CALOR'}</text>
 <text x="270" y="820" fill="#9DC9CC" textAnchor="middle" fontSize="14">Ilustração explicativa • sem valores de consumo medidos</text>
 </svg>;
};
