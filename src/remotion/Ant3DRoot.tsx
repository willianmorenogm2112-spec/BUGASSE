import React from 'react';
import {AbsoluteFill,Composition,OffthreadVideo,Audio,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import timing from '../../public/assets/bugi-formiga/timing.json';

export const Ant3DVideo=()=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const time=frame/fps;
 const turn=timing.turns.find(t=>time>=t.start&&time<t.end);
 const words=timing.words.filter(w=>w.turn===turn?.index);
 const current=Math.max(0,words.reduce((last,w,i)=>time>=w.start?i:last,0));
 const page=words.slice(Math.floor(current/4)*4,Math.floor(current/4)*4+4);
 const bugi=turn?.speaker==='bugi';
 return <AbsoluteFill style={{background:'#FFF7E9',fontFamily:'Arial',color:'#FFF7E9'}}>
  <OffthreadVideo src={staticFile('assets/bugi-formiga/scene-3d.mp4')} muted style={{width:'100%',height:'100%'}}/>
  <Audio src={staticFile('assets/bugi-formiga/dialogue.wav')}/>
  <div style={{position:'absolute',top:330,left:70,padding:'15px 24px',borderRadius:16,background:bugi?'#FF6B50':'#122638',fontSize:26,fontWeight:800}}>{bugi?'BUGI • RECLAMANDO':'NARRADOR • EXPLICANDO'}</div>
  {turn&&<div style={{position:'absolute',left:75,right:135,top:1450,padding:28,borderRadius:24,background:'#122638ed',border:`4px solid ${bugi?'#FF6B50':'#39C8D5'}`,fontSize:46,lineHeight:1.2,fontWeight:800,textAlign:'center'}}>{page.map((w,i)=><React.Fragment key={i}><span style={{color:time>=w.start&&time<w.end?(bugi?'#FF6B50':'#39C8D5'):'#FFF7E9'}}>{w.word}</span>{' '}</React.Fragment>)}</div>}
  <div style={{position:'absolute',bottom:220,left:70,fontSize:20,color:'#122638'}}>HIPÓTESE FICTÍCIA • CORPO FUNCIONANDO POR CONVENÇÃO</div>
 </AbsoluteFill>;
};
registerRoot(()=> <Composition id="Bugi-Formiga-3D" component={Ant3DVideo} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(timing.duration*30)}/>);
