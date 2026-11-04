import {interpolate} from 'remotion';
import words from './words.json';

// Acoustic ASR estimates, not manually guessed phrase durations or human-approved alignment.
export const speechWords=words;
export const onset=(text:string)=>{
  const word=words.find(w=>w.text.toLocaleLowerCase('pt-BR').replace(/[,.!?…]/g,'')===text);
  if(!word)throw new Error(`Missing speech anchor: ${text}`);
  return word.start;
};
const groups=[[0,3],[3,5],[5,8],[8,11],[11,12],[12,15],[15,17],[17,19],[19,22],[22,24],[24,26],[26,28]];
export const reelCaptions=groups.map(([a,b],i)=>({
  id:i,words:words.slice(a,b),start:words[a].start,
  end:Math.min(words[b-1].end+.18,b<words.length?words[b].start:12.5),
}));
export const reelTime=(t:number)=>interpolate(t,
  [0,onset('sumisse'),onset('cinco'),onset('frear'),onset('deslizando'),onset('poste'),onset('pegada'),onset('chão'),onset('inércia'),12.5],
  [0,2,2.6,4,6,7.65,8.8,10.2,10.8,12.5],
  {extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export const reelHeadlines=[
  {start:0,end:onset('sumisse'),kicker:'UM EXPERIMENTO IMPOSSÍVEL',lines:['CADÊ O','ATRITO?']},
  {start:onset('sumisse'),end:onset('frear'),kicker:'MUDA UMA REGRA',lines:['SEM ATRITO.','POR 5 SEGUNDOS.']},
  {start:onset('frear'),end:onset('agarrar'),kicker:'ELE TENTA FREAR',lines:['MAS CONTINUA','DESLIZANDO.']},
  {start:onset('agarrar'),end:onset('pegada'),kicker:'UMA ÚLTIMA TENTATIVA',lines:['SEGURA','O POSTE!']},
  {start:onset('pegada'),end:onset('chão'),kicker:'PERDEU A PEGADA',lines:['IH…','JÁ ERA.']},
  {start:onset('chão'),end:12.5,kicker:'MUDA UMA REGRA. COMEÇA O CAOS.',lines:['A INÉRCIA','GANHOU.']},
];
