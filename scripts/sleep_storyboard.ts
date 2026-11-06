import fs from 'node:fs';
import timing from '../public/assets/sono/timing.json';
const actions=[
  "Gancho: cama sai do quarto, confiança vira cansaço; cérebro aparece na palavra de referência.",
  "Bugi faz a conta de +8 h e recupera confiança; gesto finito de mão.",
  "Cérebro ilustrado e sinais de falha; irritação do rosto acompanha 'humor'.",
  "Close na reação; cartão de leitura repetida, sem novos títulos.",
  "Comparação de desempenho; 0,10% entra na fala 'zero'; ressalva em tela e voz.",
  "Close irônico de ressaca sem festa; ombros e sobrancelhas.",
  "Fita de memória perde quadros; cabeça cede, olhos podem ficar abertos.",
  "Bugi interpreta a falha como pedaço da realidade pulado.",
  "Carro percorre 83 m em 3 s de simulação a 100 km/h; não é frenagem.",
  "Chave ilustrada; Bugi abandona a ideia de dirigir.",
  "Caneca com vapor surge como tentativa de solução.",
  "Relógio/alarme aparece na caneca na palavra 'alarme'.",
  "Planta e rosto ilusório demonstram percepção distorcida; sem prazo universal.",
  "Bugi discute com a planta, sobrancelhas e braços irritados.",
  "Diagrama de trajetórias diferentes entre pessoas; explicitamente ilustrativo.",
  "Close de pergunta sobre prazo; sem cronômetro de morte.",
  "Alerta sobre riscos e ausência de prazo humano confiável.",
  "Bugi cancela a suposta promoção de horas extras.",
  "Cama retorna na palavra 'devolve'; cérebro/corpo em funcionamento.",
  "Payoff da planta roncando; Bugi resignado."
];
const rows=timing.turns.map(t=>({
 index:t.index,speaker:t.speaker,text:t.text,start:t.start,end:t.end,fromFrame:Math.floor(t.start*30),toFrame:Math.ceil(t.end*30),
 timestampSource:timing.alignmentType,
 action:actions[t.index],pose:'Bugi canônico; gesto entra e recupera em 0,38–0,48 s; pés ancorados',
 facial:t.index===13?'irritação dirigida à planta':[3,5].includes(t.index)?'irritado':t.index>5?'cansaço progressivo':'confiança/cansaço no gancho',
 camera:[4,8,14,16].includes(t.index)?'diagrama em tela com fundo atenuado':t.speaker==='bugi'&&![1,9,13,19].includes(t.index)?'close motivado 1,28x':'plano de conjunto',
 audio:'Gemini 3.8 real; Puck para Bugi / Charon para narrador; mix-final.wav',
 caption:'Páginas curtas e destaque por palavra do mesmo timing.json',
 contact:'Pés no tapete; objetos demonstrativos são gráficos e não fingem pegada física',
 evidence:'out/sono-completo-contato.jpg; Player e MP4 da mesma SleepEpisode',
 artisticApproval:'pending-user-review'
}));
fs.writeFileSync('public/assets/sono/storyboard.json',JSON.stringify({fps:30,alignmentType:timing.alignmentType,beats:rows},null,2));
console.log('Storyboard:',rows.length,'beats com timestamps acústicos');
