import fs from 'node:fs';
import timing from '../public/assets/sono/timing.json';
import {captionPages} from '../src/remotion/gravity/GravityCaptions';
const pages=timing.turns.flatMap(t=>captionPages(timing.words.filter(w=>w.turn===t.index)));
const stamp=(s:number)=>{const n=Math.round(s*1000);return [Math.floor(n/3600000),Math.floor(n/60000)%60,Math.floor(n/1000)%60].map(q=>String(q).padStart(2,'0')).join(':')+','+String(n%1000).padStart(3,'0');};
fs.writeFileSync('public/assets/sono/legendas-final.srt',pages.map((p,i)=>`${i+1}\n${stamp(p[0].start)} --> ${stamp(Math.min(p.at(-1)!.end+.16,pages[i+1]?.[0].start??timing.duration))}\n${p.map(w=>w.word).join(' ')}\n`).join('\n'));
console.log('SRT:',pages.length,'pages;',pages.flat().length,'words from canonical timeline');
