import {computeBugiArticulatedKinematics} from '../../components/BugiCharacterSvg';
import {ik} from '../earthstop/earthMotion';
export type Variant='A'|'B';
type P={x:number;y:number};
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const p=clamp(v);return p*p*(3-2*p);};
type Key=readonly[number,number];
export function track(t:number,keys:readonly Key[]){
 const i=keys.findIndex(k=>k[0]>t);
 if(i<0)return keys[keys.length-1][1];if(i===0)return keys[0][1];
 const [a,x]=keys[i-1],[b,y]=keys[i];return x+(y-x)*smooth((t-a)/(b-a));
}
export const ROOT_A={
 x:[[0,0],[2.3,110],[3.5,208],[5.5,210],[12,210]],
 y:[[0,487],[2.3,487],[3.5,634],[4.1,634],[5.5,487],[12,487]],
 angle:[[0,0],[2.3,0],[3.5,65],[4.1,65],[5.5,0],[8.5,0],[9.8,-3],[12,0]],
} as const;
export const ROOT_B={
 x:[[0,0],[.7,34],[1.5,76],[2.3,110],[2.65,135],[3,175],[3.5,208],[3.68,214],[4.1,208],[5.5,210],[12,210]],
 y:[[0,487],[.55,483],[.95,487],[1.4,483],[1.85,487],[2.3,483],[2.65,494],[3,533],[3.5,634],[3.68,627],[3.92,633],[4.15,633],[4.3,620],[4.8,580],[5.25,511],[5.5,485],[5.8,490],[6.15,487],[8.3,489],[9,486],[9.8,482],[10.2,489],[10.6,487],[12,487]],
 angle:[[0,0],[.65,-3],[1.2,2],[1.8,-2],[2.3,-9],[2.65,12],[3,36],[3.5,65],[3.68,59],[3.95,64],[4.15,64],[4.3,52],[4.8,28],[5.25,5],[5.5,-5],[5.8,1],[6.15,-3],[8.3,-2],[9,2],[9.8,-7],[10.25,2],[10.6,0],[12,0]],
} as const;
const rotate=(p:P,a:number):P=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
export function regenPose(s:number,variant:Variant){
 const k=computeBugiArticulatedKinematics('confiante_parado',0,30,0,'curioso');
 const root=variant==='A'?ROOT_A:ROOT_B;
 k.rootX=track(s,root.x);k.rootY=track(s,root.y);k.torsoRotation=k.torsoRotationDeg=track(s,root.angle);
 const a=k.torsoRotation*Math.PI/180;
 k.groundY=685;k.squashX=1;k.stretchY=1;k.motionLines=false;k.impactShockwave=false;k.sweatDrops=false;
 k.recoveryStars=false;k.isBlinking=(s>1.08&&s<1.18)||(s>8.7&&s<8.82);
 const worry=track(s,[[0,0],[2.4,0],[3.1,1],[4.2,1],[5.7,.2],[8,0],[12,0]]);
 const inspect=track(s,[[0,0],[4.4,0],[5.7,1],[8.5,1],[9.6,0],[12,0]]);
 const proud=track(s,[[0,0],[8.5,0],[10.1,1],[12,1]]);
 const recheck=track(s,[[0,0],[10.2,0],[10.8,1],[11.2,1],[11.8,0],[12,0]]);
 k.headRotation=k.headRotationDeg=variant==='B'?
   track(Math.max(0,s-.09),[[0,0],[2.3,-5],[3.3,13],[3.6,-12],[4.3,7],[5.7,-12],[7.7,-8],[8.3,-16],[9.4,6],[10.1,-5],[10.7,0],[12,0]]):
   8*worry-10*inspect-3*proud;
 k.hairFollowDeg=variant==='B'?-track(Math.max(0,s-.13),root.angle)*.2:0;
 k.hairStretchY=1;k.eyeScaleX=1;k.eyeScaleY=1+.15*worry;
 k.pupilOffsetX=-6*inspect+3*proud-6*recheck;k.pupilOffsetY=4*inspect+2*worry+3*recheck;
 k.leftBrowDeg=-14*worry+7*inspect-6*proud;k.rightBrowDeg=14*worry-7*inspect+6*proud;
 k.mouthOpenness=0;k.mouthShape=worry>.65?'panic_wave':inspect>.5?'determined':proud>.5?'grin':'smile';
 for(const side of ['left','right'] as const){
  const left=side==='left',sign=left?-1:1;
  let fx:number,fy:number;
  if(s<3.5){
   fx=left?track(s,[[0,-40],[.2,-40],[1.05,20],[1.45,20],[2.25,80],[2.6,80],[3.5,170]]):track(s,[[0,40],[.75,40],[1.6,100],[1.9,100],[2.6,160],[3.5,245]]);
   fy=left?track(s,[[0,671],[.2,671],[.65,645],[1.05,671],[1.45,671],[1.9,645],[2.25,671],[3.5,671]]):track(s,[[0,671],[.75,671],[1.2,645],[1.6,671],[2.6,671],[2.95,635],[3.5,671]]);
  }else {fx=left?170:245;fy=671;}
  const target=rotate({x:fx-k.rootX,y:fy-k.rootY},-a),hip=k[`${side}Hip`];
  let leg=ik(hip,target,68,65,-sign);
  const kneeWorld=rotate(leg.joint,a);
  if(kneeWorld.y+k.rootY>671)leg=ik(hip,target,68,65,sign);
  k[`${side}Knee`]={...leg.joint,angleDeg:0};k[`${side}Ankle`]=leg.end;
  k[`${side}Foot`]={...leg.end,rotDeg:-k.torsoRotation};k[`${side}ShoePos`]={...leg.end,rot:-k.torsoRotation};
  k[`${side}LegPath`]=`M${hip.x} ${hip.y}L${leg.joint.x} ${leg.joint.y}L${leg.end.x} ${leg.end.y}`;
  const walking=s<2.3?Math.sin(s*7)*13:0;
  let hand:P={x:sign*64,y:40+sign*walking};
  if(s>=2.3&&s<3.5){
   const p=smooth((s-2.3)/1.2),world=left?{x:236,y:659}:{x:300,y:648};
   const contact=rotate({x:world.x-k.rootX,y:world.y-k.rootY},-a);
   hand={x:hand.x+(contact.x-hand.x)*p,y:hand.y+(contact.y-hand.y)*p};
  } else if(s>=3.5&&s<4.15){
   const world=left?{x:236,y:659}:{x:300,y:648};hand=rotate({x:world.x-k.rootX,y:world.y-k.rootY},-a);
  }else if(s>=4.15){
   const lift=Math.max(smooth((s-4.15)/1.55)*(1-smooth((s-8.6)/1.1)),recheck*.7);
   hand=left?{x:-64-24*lift,y:40-113*lift}:{x:64-87*lift,y:40-97*lift};
   if(variant==='B'&&lift>.8){
    hand.x+=track(s,[[5.6,0],[6.0,3],[6.4,0],[7.5,0],[7.9,-4],[8.3,1],[8.6,0]]);
    hand.y+=track(s,[[5.6,0],[6.3,-4],[6.7,0],[7.7,0],[8.2,-3],[8.6,0]]);
   }
  }
  const shoulder=k[`${side}Shoulder`],arm=ik(shoulder,hand,46,42,-sign);
  k[`${side}Elbow`]={...arm.joint,angleDeg:0};k[`${side}Wrist`]={...arm.end,handAngleDeg:sign*8};
  k[`${side}ArmPath`]=`M${shoulder.x} ${shoulder.y}L${arm.joint.x} ${arm.joint.y}L${arm.end.x} ${arm.end.y}`;
 }
 return k;
}
export const bodyToWorld=(k:ReturnType<typeof regenPose>,p:P)=>{
 const q=rotate(p,k.torsoRotation*Math.PI/180);return {x:q.x+k.rootX,y:q.y+k.rootY};
};
