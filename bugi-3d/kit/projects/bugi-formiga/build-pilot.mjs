import fs from 'node:fs';

// Espaço local ampliado: Bugi=1,72 unidades representa 5 mm.
// O piloto testa encenação; não é simulação física dimensional.
const shape=(id,tipo,tamanho,cor,pos,extra={})=>({id,asset:'forma',pos,params:{tipo,tamanho,cor},...extra});
export const props=()=>[
 shape('bancada','caixa',[65,.3,55],'#FFF7E9',[0,-.3,0]),
 shape('caneca','cilindro',[12,15,12],'#39C8D5',[-9,0,-10]),
 shape('cafe','cilindro',[10,.2,10],'#59342a',[-9,15,-10]),
 shape('alca','toro',[9,1.1,1.1],'#39C8D5',[-1.8,7,-10]),
 shape('migalha','esfera',[1.6,.8,1.1],'#d9a25e',[3,0,1]),
 shape('gota','esfera',[1.7,1.4,1.7],'#78cfec',[1.8,0,0],{opacidade:.78}),
 shape('pote','cilindro',[10,20,10],'#FF6B50',[13,0,-17]),
];
const bugi=(start,end,clip,expression,pos=[0,0,3])=>({id:'bugi',preset:'bugi',pos,giro:0,viraPara:[{em:start,alvo:'camera'}],acoes:[{clip,de:start,ate:end,expressao:expression}]});
const scene=(inicio,fim,personagem,camera,textos=[],extra={})=>({inicio,fim,objetos:props(),personagens:[personagem],camera,textos,...extra});
const cenas=[
 scene(0,4,bugi(0,4,'surprised','surprised'),{tipo:'travelling',de:{pos:[6,7,15],olha:[-3,4,-3]},para:{pos:[4,2.5,9],olha:[0,1,2]}},[{texto:'VOCÊ TEM 5 MILÍMETROS',de:.1,ate:3.6,estilo:'titulo'}]),
 scene(4,8,{...bugi(4,8,'run','worried',[-3,0,3]),movimentos:[{de:4,ate:7.4,para:[2,3],clip:'run'}]}, {tipo:'fixa',pos:[5,2.5,12],olha:[0,1,2],fov:42},[{texto:'TESTE TÉCNICO • SEM VOZ',de:4,ate:7.8,estilo:'rodape'}]),
 scene(8,12,bugi(8,12,'shake_head','angry'),{tipo:'enquadrar',alvo:'bugi',plano:'medio',angulo:0,elevacao:5},[{texto:'ATÉ A ÁGUA COMPLICA?',de:8.2,ate:11.8,estilo:'pergunta'}]),
];
// Movimento da gota: chegada, contato e oscilação cartoon; parâmetros explícitos.
for(const c of cenas){
 const drop=c.objetos.find(o=>o.id==='gota');
 drop.anim={pos:[[0,[1.8,7,0]],[1,[1.8,0,0]],[12,[1.8,0,0]]],pulsa:.025};
}
const sb={versao:1,titulo:'Bugi formiga — piloto técnico',formato:{largura:1080,altura:1920,fps:30},duracao:12,ambiente:{fundo:'interior',chao:'madeira',horario:'dia',decoracao:false},legendas:{ativo:false},cenas};
fs.writeFileSync(new URL('./storyboard.json',import.meta.url),JSON.stringify(sb,null,2));
