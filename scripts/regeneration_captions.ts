import fs from 'node:fs';
import timing from '../public/assets/regeneracao/timing.json';
import {captionPages} from '../src/remotion/gravity/GravityCaptions';
const pages=captionPages(timing.words);
const stamp=(s:number)=>{const n=Math.round(s*1000);return [Math.floor(n/3600000),Math.floor(n/60000)%60,Math.floor(n/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+','+String(n%1000).padStart(3,'0');};
fs.writeFileSync('public/assets/regeneracao/legendas.srt',pages.map((p,i)=>`${i+1}\n${stamp(p[0].start)} --> ${stamp(Math.min(p.at(-1)!.end+.16,pages[i+1]?.[0].start??12))}\n${p.map(w=>w.word).join(' ')}\n`).join('\n'));
console.log(pages.length,'acoustically aligned caption pages');
