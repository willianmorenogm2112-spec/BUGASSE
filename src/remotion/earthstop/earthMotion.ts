import {computeBugiArticulatedKinematics} from '../../components/BugiCharacterSvg';
export const ease=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*(3-2*p);};
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const rotationKmh=(latitude:number)=>40075.036/(86164.09053/3600)*Math.cos(latitude*Math.PI/180);
type P={x:number;y:number};
export function ik(a:P,target:P,l1:number,l2:number,bend:number){
 const dx=target.x-a.x,dy=target.y-a.y,d=Math.max(.001,Math.hypot(dx,dy));
 const reach=Math.max(Math.abs(l1-l2)+.01,Math.min(l1+l2-.01,d));
 const b={x:a.x+dx/d*reach,y:a.y+dy/d*reach};
 const along=(l1*l1-l2*l2+reach*reach)/(2*reach),h=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {end:b,joint:{x:a.x+dx/d*along-bend*dy/d*h,y:a.y+dy/d*along+bend*dx/d*h}};
}
export type EarthAction='carry'|'brake'|'drift'|'brace'|'point'|'run'|'recover';
// Action-local poses. No inherited acting from an earlier episode, and no pulse per dialogue length.
export function earthActing(action:EarthAction,u:number,speech=0){
 const k=computeBugiArticulatedKinematics('confiante_parado',0,30,0,'curioso');
 const phase=Math.max(0,u),brake=action==='brake'?ease(phase/.55):0;
 const drift=action==='drift'?ease(phase/.7):0,brace=action==='brace'?ease(phase/.4):0;
 const flight=action==='drift'?ease((phase-.7)/2.6):0;
 const lift=action==='carry'?ease(phase/2.4):0;
 const recover=action==='recover'?1-ease(phase/.8):0;
 const run=action==='run',walk=run?Math.sin(phase*11):0;
 k.rootX=0;k.rootY=487+10*brake+(action==='drift'?10*(1-drift):0)+5*brace-5*Math.abs(walk)+8*recover;
 k.torsoRotation=k.torsoRotationDeg=-7*brake-(action==='drift'?7+5*drift:0)+10*flight-5*brace-7*recover;
 k.squashX=1;k.stretchY=1;k.motionLines=false;k.impactShockwave=false;k.recoveryStars=false;
 k.sweatDrops=Boolean(drift);k.hairFollowDeg=-4*brake-7*drift+2*walk;k.hairStretchY=1;
 const angle=-k.torsoRotation*Math.PI/180;
 for(const side of ['left','right'] as const){
  const sign=side==='left'?-1:1;
  const world={x:sign*42+(run?walk*sign*23:sign*brace*9)+flight*(side==='left'?-16:20),y:685-(run?Math.max(0,-sign*walk)*19:0)-drift*(side==='left'?20:42)+flight*(side==='left'?-22:30)};
  const dy=world.y-k.rootY;
  const ankle={x:world.x*Math.cos(angle)-dy*Math.sin(angle),y:world.x*Math.sin(angle)+dy*Math.cos(angle)};
  const hip=k[`${side}Hip`],leg=ik(hip,ankle,68,65,-sign);
  k[`${side}Knee`]={...leg.joint,angleDeg:0};k[`${side}Ankle`]=leg.end;
  k[`${side}Foot`]={...leg.end,rotDeg:-k.torsoRotation};k[`${side}ShoePos`]={...leg.end,rot:-k.torsoRotation};
  k[`${side}LegPath`]=`M${hip.x} ${hip.y}L${leg.joint.x} ${leg.joint.y}L${leg.end.x} ${leg.end.y}`;
  let wrist:P=side==='right'?{x:73-22*lift,y:-30-27*lift}:{x:-64,y:50-14*lift};
  if(action==='brake')wrist=side==='right'?{x:mix(73,92,brake),y:mix(-30,-58,brake)}:{x:mix(-64,-103,brake),y:mix(50,8,brake)};
  if(action==='drift')wrist=side==='right'?{x:mix(92,83,drift)-15*flight,y:mix(-58,-76,drift)+55*flight}:{x:mix(-103,-108,drift)+30*flight,y:mix(8,-38,drift)-40*flight};
  if(action==='brace')wrist=side==='right'?{x:mix(73,104,brace),y:mix(-30,-28,brace)}:{x:-70-12*Math.sin(Math.PI*ease(phase/2.8)),y:5-35*ease(phase/2)};
  if(action==='point')wrist=side==='right'?{x:mix(65,123,ease(phase/.45)),y:mix(35,-26,ease(phase/.45))}:{x:-62,y:38};
  if(run)wrist={x:sign*65+walk*sign*15,y:15+walk*sign*40};
  if(action==='recover')wrist={x:sign*(62+30*recover),y:40-70*recover};
  const arm=ik(k[`${side}Shoulder`],wrist,46,42,-sign);
  k[`${side}Elbow`]={...arm.joint,angleDeg:0};k[`${side}Wrist`]={...arm.end,handAngleDeg:sign*8};
  k[`${side}ArmPath`]=`M${k[`${side}Shoulder`].x} ${k[`${side}Shoulder`].y}L${arm.joint.x} ${arm.joint.y}L${arm.end.x} ${arm.end.y}`;
 }
 k.headRotation=k.headRotationDeg=4*brake+8*drift-11*flight-4*brace-4*lift;
 k.pupilOffsetX=action==='point'?7:drift?7-5*flight:2+3*lift;k.pupilOffsetY=drift?-3+7*flight:-2*lift;
 k.eyeScaleX=1;k.eyeScaleY=1+.13*brake+.2*drift;k.isBlinking=phase%4.1>3.91;
 k.leftBrowDeg=drift?-18:brace?20:-4;k.rightBrowDeg=drift?18:brace?-20:6;
 k.mouthOpenness=speech;k.mouthShape=speech>.05?'open_o':drift?'determined':'smile';
 return k;
}
export function cupAnchor(action:EarthAction,local:number,x:number,floor=1330,scale=1.9){
 const k=earthActing(action,local),a=k.torsoRotation*Math.PI/180;
 const hx=k.rightWrist.x+9,hy=k.rightWrist.y-5;
 return {x:x+scale*(Math.cos(a)*hx-Math.sin(a)*hy),y:floor-685*scale+scale*(k.rootY+Math.sin(a)*hx+Math.cos(a)*hy)};
}
