import fs from 'node:fs';
import timing from '../public/assets/gravidade/timing.json';
import {captionPages} from '../src/remotion/gravity/GravityCaptions';
const pages=timing.turns.flatMap(t=>captionPages(timing.words.filter(w=>w.turn===t.index)));
const stamp=(seconds:number)=>{const n=Math.round(seconds*1000),h=Math.floor(n/3600000),m=Math.floor(n/60000)%60,s=Math.floor(n/1000)%60,ms=n%1000;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;};
const srt=pages.map((p,i)=>`${i+1}\n${stamp(p[0].start)} --> ${stamp(Math.min(p.at(-1)!.end+.16,pages[i+1]?.[0].start??timing.duration))}\n${p.map(w=>w.word).join(' ')}\n`).join('\n');
fs.writeFileSync('public/assets/gravidade/legendas-final.srt',srt);
console.log('SRT:',pages.length,'pages; words:',pages.flat().length,'; original audio timeline preserved');
