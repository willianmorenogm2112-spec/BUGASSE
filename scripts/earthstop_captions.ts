import fs from 'node:fs';
import timing from '../public/assets/terra-1s/timing.json';
import {captionPages} from '../src/remotion/gravity/GravityCaptions';
const pages=timing.turns.flatMap(t=>captionPages(timing.words.filter(w=>w.turn===t.index)));
const stamp=(s:number)=>{const n=Math.round(s*1000);return [Math.floor(n/3600000),Math.floor(n/60000)%60,Math.floor(n/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+','+String(n%1000).padStart(3,'0');};
fs.writeFileSync('public/assets/terra-1s/legendas.srt',pages.map((p,i)=>`${i+1}\n${stamp(p[0].start)} --> ${stamp(Math.min(p.at(-1)!.end+.16,pages[i+1]?.[0].start??timing.duration))}\n${p.map(w=>w.word).join(' ')}\n`).join('\n'));
fs.writeFileSync('public/assets/terra-1s/captions.json',JSON.stringify(timing.words.map(w=>({text:w.word,startMs:Math.round(w.start*1000),endMs:Math.round(w.end*1000),timestampMs:Math.round(w.start*1000),confidence:null})),null,2));
console.log(pages.length,'caption pages from',timing.alignmentType);
