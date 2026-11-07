import timing from '../../../public/assets/terra-1s/timing.json';
import {ease,mix} from './earthMotion';

/** Audio word onsets drive changes of subject, independently of speaker turns. */
export const wordCue=(turn:number,word:string,fallback:number)=>{
 const start=timing.turns[turn].start;
 const found=timing.words.find(w=>w.turn===turn&&w.word.toLocaleLowerCase('pt-BR').replace(/[.,!?;:]/g,'')===word);
 return found?found.start-start:fallback;
};
export const phase=(u:number,start:number,duration=.5)=>ease((u-start)/duration);
// A move arrives, overshoots slightly and settles; no random or wall-clock animation.
export const settle=(u:number,start:number,duration=.6)=>{
 const p=Math.max(0,Math.min(1,(u-start)/duration));
 const c=1.25;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2);
};
export function earthCamera(turn:number,u:number){
 let p=0,scale=1,x=540,y=960;
 if(turn===0){p=phase(u,1.45,.6)*(1-phase(u,3.65,.5));scale=1.2;x=650;y=960;}
 if(turn===1){p=phase(u,wordCue(1,'café',2)-.7,.65);scale=1.17;x=520;y=920;}
 if(turn===3){p=phase(u,.1,.6);scale=1.14;x=570;y=980;}
 if(turn===4){p=phase(u,wordCue(4,'freia',2),.6);scale=1.12;x=575;y=960;}
 if(turn===7){p=phase(u,.1,.6);scale=1.13;x=570;y=900;}
 return {scale:mix(1,scale,p),x:mix(540,x,p),y:mix(960,y,p)};
}

// Explicit changes of subject. Helps QA seek the action, not just one pose per turn.
export const earthShotPlan=[
 {turn:0,beats:['antecipar freio','perder apoio','soltar caneca','seguir objeto','reagir aos cacos']},
 {turn:1,beats:['voltar no tempo','erguer café','olhar caneca']},
 {turn:2,beats:['isolar chão','liberar corpo e café','destacar ar em movimento']},
 {turn:3,beats:['alcançar poste','apoiar mão','reagir irritado']},
 {turn:4,beats:['ônibus em movimento','freio','corpo continua','transpor freio ao chão']},
 {turn:5,beats:['olhar apoio','apontar rua']},
 {turn:6,beats:['rua solidária ao globo','marcador acompanha rotação','valor equatorial']},
 {turn:7,beats:['seguir caneca com olhar','caneca atravessa quadro']},
 {turn:8,beats:['caneca na origem','trajeto e relógio 1 s','distância final','limite da idealização']},
 {turn:9,beats:['mirar polo','correr','trajeto no globo']},
 {turn:10,beats:['latitude aumenta','anel e velocidade diminuem','ar','água','estruturas']},
 {turn:11,beats:['apontar relógio','ponteiro chega a 1 s']},
 {turn:12,beats:['cacos permanecem','gravidade puxa objeto','Terra continua em órbita','destacar mudança abrupta']},
 {turn:13,beats:['alcançar pausa','cancelar','mala entra','recuperar postura']},
];
