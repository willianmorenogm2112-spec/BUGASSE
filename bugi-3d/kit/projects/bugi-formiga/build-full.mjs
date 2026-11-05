import fs from 'node:fs';
import {props} from './build-pilot.mjs';
const timing=JSON.parse(fs.readFileSync(new URL('./timing.json',import.meta.url),'utf8'));
const ant=(start,end)=>{
 const list=[];
 for(const [id,size,pos] of [['abdomen',[.8,.7,1.1],[0,.55,-.6]],['torax',[.45,.5,.6],[0,.5,.1]],['cabeca',[.65,.55,.6],[0,.6,.65]]])
 list.push({id:'ant-'+id,asset:'forma',pos,params:{tipo:'esfera',tamanho:size,cor:'#59342a'}});
 for(let k=0;k<3;k++)for(const side of [-1,1])list.push({id:`leg-${k}-${side}`,asset:'tubo',params:{pontos:[[0,.55,k*.35-.4],[side*.55,.32,k*.35-.5],[side*.8,0,k*.35-.2]],raio:.035,cor:'#59342a'},anim:{oscila:{eixo:'z',amp:.06,freq:4}}});
 for(const side of [-1,1])list.push({id:'antena'+side,asset:'tubo',params:{pontos:[[side*.15,.8,.8],[side*.3,1.1,1.1],[side*.45,1.05,1.35]],raio:.025,cor:'#59342a'}});
 // All pieces translate together on the counter.
 return list.map(o=>({...o,anim:{...o.anim,pos:[[start,[3+(o.pos?.[0]||0),o.pos?.[1]||0,2+(o.pos?.[2]||0)]],[end,[1+(o.pos?.[0]||0),o.pos?.[1]||0,2+(o.pos?.[2]||0)]]]}}));
};
const scenes=[];
for(const turn of timing.turns){
 const pieces=Math.ceil((turn.end-turn.start)/5);
 for(let p=0;p<pieces;p++){
 const start=turn.start+(turn.end-turn.start)*p/pieces;
 const end=p===pieces-1?(timing.turns[turn.index+1]?.start??timing.duration):turn.start+(turn.end-turn.start)*(p+1)/pieces;
 const i=turn.index;
 const obj=props();
 const drop=obj.find(o=>o.id==='gota');
 drop.anim={pulsa:.035,oscila:{eixo:'y',amp:.025,freq:1.2}};
 if(i===0)drop.anim={pos:[[start,[1.8,5,0]],[start+.7,[1.8,0,0]]],pulsa:.035};
 const emotion=i===1||i===7||i===9?'angry':i>=12?'thinking':i<4?'surprised':'worried';
 const b={id:'bugi',preset:'bugi',pos:[0,0,3],giro:0,viraPara:[{em:start,alvo:'camera'}],acoes:[{clip:turn.speaker==='bugi'?'talk':i===4||i===5?'run':i===10?'think':'look_around',de:start,ate:end,expressao:emotion,fala:turn.speaker==='bugi'}]};
 if(i===4||i===5)b.movimentos=[{de:start,ate:end,para:[3,3],clip:'run'}];
 if(i>=12)obj.push(...ant(start,end));
 const close=turn.speaker==='bugi';
 const camera=close?{tipo:'enquadrar',alvo:'bugi',plano:'medio',angulo:p%2?15:-8,elevacao:3}:{tipo:'fixa',pos:[p%2?-5:5,3.5,12],olha:[0,1,2],fov:45};
 const texts=[];
 if(i===0)texts.push({texto:'DO TAMANHO DE UMA FORMIGA?',de:start,ate:end,estilo:'titulo'});
 if(i===4)texts.push({texto:'10 cm = 20 ALTURAS',de:start,ate:end,estilo:'destaque'});
 if(i===6)texts.push({texto:'TENSÃO SUPERFICIAL',de:start,ate:end,estilo:'destaque'});
 if(i===10)texts.push({texto:'ÁREA ∝ L² • VOLUME ∝ L³',de:start,ate:end,estilo:'destaque'});
 const fluxos=i===10||i===11
 ?[{material:'ar',origem:[-3,1,3],destino:[3,1,3],taxa:12,tamanho:.07,de:start,ate:end}]
 :[{material:'vapor',origem:[-9,15,-10],taxa:5,tamanho:.15,subida:2,de:start,ate:end}];
 scenes.push({inicio:start,fim:end,objetos:obj,personagens:[b],camera,textos:texts,fluxos});
 }
}
const sb={versao:1,titulo:'E se você encolhesse?',formato:{largura:1080,altura:1920,fps:30},duracao:timing.duration,audio:'dialogue.wav',palavras:'palavras.json',ambiente:{fundo:'interior',chao:'madeira',horario:'nublado',decoracao:false},legendas:{ativo:false},cenas:scenes};
fs.writeFileSync(new URL('./storyboard.json',import.meta.url),JSON.stringify(sb,null,2));
fs.writeFileSync(new URL('./palavras.json',import.meta.url),JSON.stringify(timing.words.map(w=>({palavra:w.word,inicio:w.start,fim:w.end})),null,2));
