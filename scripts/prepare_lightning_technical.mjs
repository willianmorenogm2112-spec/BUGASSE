import fs from 'node:fs';
const lines=fs.readFileSync('reports/RAIO-CARRO-2D.md','utf8').split(/\r?\n/).filter(l=>/^(NARRADOR|BUGI):/.test(l));
let cursor=0;const words=[];
const turns=lines.map((line,index)=>{
 const speaker=line.startsWith('BUGI:')?'bugi':'narrador',text=line.replace(/^[^:]+:\s*/,''),tokens=text.split(/\s+/);
 const start=cursor;const duration=Math.max(2.5,tokens.length/2.8);
 tokens.forEach((word,j)=>words.push({word,start:start+j*duration/tokens.length,end:start+(j+1)*duration/tokens.length,speaker,turn:index}));
 cursor+=duration+.2;return {index,speaker,text,start,end:cursor-.2};
});
fs.mkdirSync('public/assets/raio-carro',{recursive:true});
for(const speaker of ['narrador','bugi'])fs.writeFileSync(`public/assets/raio-carro/${speaker}-texto.txt`,turns.filter(t=>t.speaker===speaker).map(t=>t.text).join('\n\n'));
fs.writeFileSync('public/assets/raio-carro/technical-timing.json',JSON.stringify({duration:cursor,alignmentType:'estimated-technical-only',turns,words,envelope:Array(Math.ceil(cursor*30)).fill(0)},null,2));
console.log('Tempos ESTIMADOS; sem áudio; duração técnica',cursor);
