import React from 'react';
import timing from '../../../public/assets/gravidade/timing.json';
import {smooth} from './gravityMotion';
type Word=typeof timing.words[number];
export const captionPages=(words:Word[])=>{
 const pages:Word[][]=[];let page:Word[]=[];
 for(const word of words){
  const chars=page.reduce((n,w)=>n+w.word.length+1,0);
  if(page.length&&(page.length>=4||chars+word.word.length>25||word.start-page[0].start>1.35)){pages.push(page);page=[];}
  page.push(word);
  if(/[.!?]$/.test(word.word)){pages.push(page);page=[];}
 }
 if(page.length)pages.push(page);return pages;
};
const pages=timing.turns.flatMap(turn=>captionPages(timing.words.filter(w=>w.turn===turn.index)));
export const GravityCaptions:React.FC<{time:number;bugi:boolean}>=({time,bugi})=>{
 const page=pages.find((p,i)=>time>=p[0].start&&time<(pages[i+1]?.[0].start??timing.duration)&&time<=p.at(-1)!.end+.16);
 if(!page)return null;
 const enter=smooth((time-page[0].start)/.10);
 return <div style={{position:'absolute',left:90,right:150,top:1480,height:155,display:'flex',alignItems:'center',justifyContent:'center'}}>
 <div style={{fontSize:59,fontWeight:900,lineHeight:1.13,textAlign:'center',color:'#FFF7E9',padding:'15px 23px',borderRadius:22,background:'#122638EB',boxShadow:`0 5px 0 ${bugi?'#FF6B50':'#39C8D5'}`,transform:`translateY(${8*(1-enter)}px)`,opacity:enter}}>
 {page.map((w,j)=>{const active=time>=w.start&&time<w.end;return <React.Fragment key={`${w.start}-${j}`}><span style={{display:'inline-block',color:active?(bugi?'#FFD166':'#39C8D5'):'#FFF7E9',transform:`scale(${active?1+.035*Math.sin(Math.min(1,(time-w.start)/.12)*Math.PI):1})`}}>{w.word}</span>{j<page.length-1?' ':''}</React.Fragment>;})}
 </div></div>;
};
