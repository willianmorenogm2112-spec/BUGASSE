import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig,interpolate} from 'remotion';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {computeSunBugiKinematics} from '../sun/sunBugiMotion';
import timing from '../../../public/assets/tempo-interacao/timing.json';

const C={ink:'#122638',cyan:'#39C8D5',coral:'#FF6B50',cream:'#FFF7E9',gold:'#FFD166'};
const cl={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=(x:number)=>{const p=Math.max(0,Math.min(1,x));return p*p*(3-2*p);};
const phases=['hook','wish','freeze','air','lungs','releaseAir','airOn','relief','light','angry','lightOn','coffeeWish','coffee','coffeeAngry','clauses','contract','restart','final'];
const titles=['PARAR O TEMPO?','SÓ CINCO MINUTOS…','O MUNDO TRAVOU.','CADÊ O AR?','RESPIRAR EXIGE MOVIMENTO.','LIBERA O AR!','EXCEÇÃO Nº 1: AR','AGORA VAI?','E A LUZ?','QUEM APAGOU TUDO?','EXCEÇÃO Nº 2: LUZ','UM CAFEZINHO…','O CAFÉ TAMBÉM PAROU.','ATÉ O CAFÉ?!','ONDE TERMINA O PODER?','LEIA AS CLÁUSULAS.','MELHOR DEVOLVER.','SÓ A SONECA MESMO.'];

const Clock:React.FC<{x:number;y:number;running:boolean;t:number;size?:number}>=({x,y,running,t,size=1})=><g transform={`translate(${x} ${y}) scale(${size})`}><path d="M-70 75l-12 20m152-20 12 20" stroke={C.ink} strokeWidth="14"/><circle r="85" fill={C.coral} stroke={C.ink} strokeWidth="8"/><circle r="66" fill={C.cream}/>{[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><path key={i} d="M0-51v8" transform={`rotate(${i*30})`} stroke={C.ink} strokeWidth="4"/>)}<path d="M0 0V-40" transform={`rotate(${running?t*150:35})`} stroke={C.ink} strokeWidth="7" strokeLinecap="round"/><path d="M0 0H30" stroke={C.ink} strokeWidth="8" strokeLinecap="round"/><path d="M-57-67q-50-55-67-10m181 10q50-55 67-10" fill={C.gold} stroke={C.ink} strokeWidth="7"/></g>;

const Room:React.FC<{t:number;frozen:boolean}>=({t,frozen})=><g>
 <defs><linearGradient id="wallT" x2="0" y2="1"><stop stopColor="#E7E0CC"/><stop offset="1" stopColor="#C7CEC1"/></linearGradient><linearGradient id="floorT" x2="0" y2="1"><stop stopColor="#A2755B"/><stop offset="1" stopColor="#593F39"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#wallT)"/><rect y="1250" width="1080" height="670" fill="url(#floorT)"/>
 {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${i*180-100} 1250L${i*240-300} 1920`} stroke="#523D36" strokeWidth="5" opacity=".35"/>)}
 <rect x="630" y="520" width="360" height="520" rx="18" fill="#31536A" stroke={C.ink} strokeWidth="15"/><rect x="654" y="546" width="310" height="466" fill="#9BD6DB"/>
 <circle cx="880" cy="640" r="44" fill={C.gold}/><path d="M654 920l90-100 80 45 70-85 70 120v112H654Z" fill="#719B91"/><path d="M808 540v480M650 785h320" stroke={C.ink} strokeWidth="14"/>
 <path d="M605 510v560q40-90 65-20V510m318 0v550q32-70 65-10V510" fill="#C77764" stroke={C.ink} strokeWidth="7"/>
 <rect x="60" y="990" width="390" height="300" rx="45" fill="#426978" stroke={C.ink} strokeWidth="12"/><rect x="75" y="1060" width="380" height="220" rx="30" fill="#E7D1A5"/><path d="M70 1150h385v145H70Z" fill="#39A7B7" stroke={C.ink} strokeWidth="8"/><rect x="95" y="1020" width="155" height="70" rx="24" fill={C.cream}/>
 <rect x="75" y="750" width="150" height="160" rx="10" fill={C.cream} stroke={C.ink} strokeWidth="8"/><path d="M95 880l40-65 25 30 40-65" fill="none" stroke={C.coral} strokeWidth="10"/>
 <path d="M730 1195H1035v38H730Z" fill="#D5AF7D" stroke={C.ink} strokeWidth="8"/><path d="M755 1235v225m250-225v225" stroke={C.ink} strokeWidth="18"/>
 <Clock x={855} y={1095} running={!frozen} t={t} size={.70}/>
 <path d="M120 610q60-15 90 15t90-10" fill="none" stroke="#FFF7E9" strokeWidth="12" opacity=".35"/>
 {!frozen&&<g opacity=".5" stroke={C.gold} strokeWidth="6"><path d={`M945 1060q${Math.sin(t*18)*12} -20 5-40`}/><path d={`M757 1060q${Math.cos(t*18)*12} -20-5-40`}/></g>}
</g>;

const Cup:React.FC<{x:number;y:number;angle?:number;frozen:boolean;t:number;scale?:number}>=({x,y,angle=0,frozen,t,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <ellipse cy="100" rx="105" ry="17" fill={C.ink} opacity=".15"/>
 <g transform={`rotate(${angle})`}><path d="M-75-40h135v115q-65 45-135 0Z" fill={C.cream} stroke={C.ink} strokeWidth="8"/><path d="M65-18q80-20 70 42Q125 77 65 52" fill="none" stroke={C.ink} strokeWidth="13"/><ellipse cx="-8" cy="-40" rx="67" ry="18" fill="#684636" stroke={C.ink} strokeWidth="7"/></g>
 {[0,1,2].map(i=><path key={i} d="M0-12q-15 22 0 30q15-8 0-30Z" transform={`translate(${90+i*43} ${-90-i*45+(frozen?0:Math.min(t,1)*230)})`} fill="#80543D" stroke={C.ink} strokeWidth="3"/>)}
</g>;

const Lungs:React.FC<{on:boolean;t:number}>=({on,t})=><g transform="translate(540 875)">
 <rect x="-340" y="-240" width="680" height="530" rx="50" fill="#183D50" stroke={C.cyan} strokeWidth="5"/>
 <g transform={`scale(${on?1+Math.sin(t*3)*.025:1})`}><path d="M-25-130C-100-225-205-190-220-20S-100 180-25 90Z" fill="#E49A91" stroke={C.cream} strokeWidth="8"/><path d="M25-130C100-225 205-190 220-20S100 180 25 90Z" fill="#E49A91" stroke={C.cream} strokeWidth="8"/><path d="M0-200v160m0-40-110 85M0-80l110 85" stroke={C.cream} strokeWidth="24" fill="none" strokeLinecap="round"/></g>
 {[0,1,2,3,4,5].map(i=><circle key={i} cx={-270+(on?(t*160+i*70)%540:i*100)} cy={-20+Math.sin(i*2)*95} r="13" fill={C.cyan}/>)}
 <text y="245" textAnchor="middle" fill={on?C.cyan:C.coral} fontSize="43" fontWeight="900">{on?'AR EM MOVIMENTO':'SEM FLUXO DE AR'}</text>
</g>;

const EyeDiagram:React.FC<{on:boolean;t:number}>=({on,t})=><g>
 <rect x="70" y="650" width="940" height="540" rx="45" fill="#183D50" stroke={C.cyan} strokeWidth="5"/>
 <path d="M610 900q150-170 320 0q-170 170-320 0Z" fill={C.cream} stroke={C.ink} strokeWidth="9"/><ellipse cx="775" cy="900" rx="54" ry="77" fill={C.cyan}/><ellipse cx="775" cy="900" rx="24" ry="44" fill={C.ink}/>
 <circle cx="210" cy="890" r="65" fill={C.gold}/>{[0,1,2,3,4].map(i=><g key={i} transform={`translate(${310+(on?(t*190+i*80)%340:i*65)} 900)`}><path d="M-20 0h40m-12-12 12 12-12 12" fill="none" stroke={C.gold} strokeWidth="8"/></g>)}
 <text x="540" y="1110" textAnchor="middle" fill={C.cream} fontSize="40" fontWeight="800">LUZ → OLHO → SINAL AO CÉREBRO</text>
</g>;

export const TimeDialogue:React.FC=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const turn=timing.turns.find(q=>t>=q.start&&t<q.end)??timing.turns.filter(q=>t>=q.start).at(-1)??timing.turns[0];
 const i=turn.index,phase=phases[i],local=t-turn.start,bugi=turn.speaker==='bugi';
 const word=timing.words.find(w=>t>=w.start&&t<w.end&&w.turn===i);
 const words=timing.words.filter(w=>w.turn===i);const lastWord=words.filter(w=>w.start<=t).at(-1);const wi=word?words.indexOf(word):lastWord&&t<turn.end?words.indexOf(lastWord):-1;
 const page=wi<0?[]:words.slice(Math.floor(wi/5)*5,Math.floor(wi/5)*5+5);
 const dark=['light','angry'].includes(phase);const diagram=['lungs','airOn','light','lightOn','coffee','coffeeWish','coffeeAngry','clauses','contract'].includes(phase);
 const k=computeSunBugiKinematics(i===1?'espera':i===3||i===9?'escuro':i===5||i===13||i===15?'gancho':i===17?'final':'plantas',Math.min(local,1.2)*fps,fps,false);
 k.mouthShape=bugi&&word?'open_o':i===13||i===15?'determined':'smile';
 k.mouthOpenness=bugi&&word?(timing.envelope[f]??0):0;
 k.isBlinking=local>1.5&&Math.floor(local*30)%117<4;
 k.pupilOffsetX=i===11?5:i===9?-5:0;
 const close=bugi&&!['wish','final'].includes(phase);
 const characterScale=diagram?.8:close?2.15:1.55;
 const px=diagram?800:close?520:510,py=diagram?1480:close?1370:1350;
 return <AbsoluteFill style={{background:C.ink,fontFamily:'TimeJakarta,Arial,sans-serif',overflow:'hidden'}}>
 <style>{`@font-face{font-family:TimeJakarta;src:url('${staticFile('assets/pilot-atrito-v1/PlusJakartaSans.ttf')}') format('truetype');font-weight:200 800}`}</style>
 <Audio src={staticFile('assets/tempo-interacao/mix-final.wav')}/>
 <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position:'absolute',fontFamily:'TimeJakarta,Arial,sans-serif'}}>
 <Room t={t} frozen={i>=2&&i<16}/>
 {i>=2&&i<16&&<rect width="1080" height="1450" fill="#245F7B" opacity=".12"/>}
 {dark&&<rect width="1080" height="1920" fill="#08131F" opacity={interpolate(local,[0,.5],[.60,.94],cl)}/>}
 {!diagram&&<Cup x={885} y={1200} scale={.45} frozen={i<16} t={local}/>}
 {phase==='freeze'&&<g transform="translate(540 600)"><circle r="95" fill={C.ink} stroke={C.cyan} strokeWidth="6"/><path d="M-23-35v70m46-70v70" stroke={C.cyan} strokeWidth="19"/><text y="155" textAnchor="middle" fontSize="40" fontWeight="900" fill={C.ink}>TEMPO: PAUSADO</text></g>}
 {['lungs','airOn'].includes(phase)&&<Lungs on={phase==='airOn'} t={local}/>}
 {['light','lightOn'].includes(phase)&&<EyeDiagram on={phase==='lightOn'} t={local}/>}
 {['coffee','coffeeWish','coffeeAngry'].includes(phase)&&<g><rect x="60" y="600" width="960" height="660" rx="40" fill="#E5D1AA" stroke={C.ink} strokeWidth="10"/><Cup x={490} y={890} scale={1.8} frozen t={local} angle={phase==='coffee'?ease(local/.8)*-22:-22}/><text x="540" y="1190" textAnchor="middle" fill={C.ink} fontSize="43" fontWeight="900">LÍQUIDO IMÓVEL NO TEMPO</text></g>}
 {['clauses','contract'].includes(phase)&&<g transform={`translate(100 ${560+20*(1-ease(local/.4))})`}><rect width="880" height="720" rx="30" fill={C.cream} stroke={C.ink} strokeWidth="10"/><text x="60" y="85" fill={C.ink} fontSize="46" fontWeight="900">TERMOS DO SUPERPODER</text>{['Seu corpo funciona','Ar pode circular','Luz pode viajar','E tudo que você toca?'].map((s,j)=><g key={s} opacity={ease((local-j*.32)/.25)} transform={`translate(60 ${160+j*125})`}><rect width="55" height="55" rx="8" fill={j<3?C.cyan:C.coral}/><text x="80" y="40" fontSize="38" fontWeight="800" fill={C.ink}>{s}</text></g>)}</g>}
 {/* Preserve the canonical rig coordinate system and floor under every placement. */}
 <g transform={`translate(${px-270*characterScale} ${py-685*characterScale}) scale(${characterScale})`}><BugiArticulatedSvgFigure kinematics={k}/></g>
 {phase==='releaseAir'&&[0,1,2].map(j=><path key={j} d={`M80 ${920+j*60}q150-45 250 0t160 0`} fill="none" stroke={C.cyan} strokeWidth="9" opacity=".7" strokeDasharray="30 20" strokeDashoffset={-local*150}/>)}
 {phase==='restart'&&<g transform="translate(540 600)"><circle r="88" fill={C.ink}/><path d="M-20-40l70 40-70 40Z" fill={C.cyan}/></g>}
 </svg>
 <div style={{position:'absolute',left:90,top:170,fontSize:25,letterSpacing:5,fontWeight:800,color:dark?C.cyan:C.ink}}>E SE BUGASSE?</div>
 <div style={{position:'absolute',left:90,right:120,top:255,fontSize:58,fontWeight:800,lineHeight:1.1,color:dark?C.cream:C.ink}}>{titles[i]}</div>
 <div style={{position:'absolute',left:90,top:440,padding:'12px 24px',borderRadius:14,background:bugi?C.coral:C.ink,color:bugi?C.cream:C.cyan,fontWeight:800,fontSize:28}}>{bugi?'BUGI • FALANDO':'NARRADOR • EXPLICANDO'}</div>
 {page.length>0&&<div style={{position:'absolute',left:90,right:135,top:1510,padding:'24px 25px',borderRadius:bugi?'32px 32px 32px 4px':20,background:bugi?C.cream:C.ink,border:`5px solid ${bugi?C.coral:C.cyan}`,color:bugi?C.ink:C.cream,fontSize:43,lineHeight:1.25,textAlign:'center',fontWeight:800}}>{page.map((w,j)=><span key={j} style={{color:w===word?(bugi?'#BA3E27':C.cyan):undefined}}>{w.word} </span>)}</div>}
 <div style={{position:'absolute',left:90,bottom:195,color:dark?C.cream:C.cream,fontSize:20,fontWeight:800}}>HIPÓTESE IMPOSSÍVEL • REGRAS DO PODER DEFINIDAS NO VÍDEO</div>
 </AbsoluteFill>;
};
