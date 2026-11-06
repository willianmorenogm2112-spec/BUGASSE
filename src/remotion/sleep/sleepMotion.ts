import {gravityActing,smooth} from '../gravity/gravityMotion';
export {smooth};
export const travelMeters=(kmh:number,seconds:number)=>kmh/3.6*seconds;
/** Global time drives lighting: dialogue cuts must never restart a sunrise. */
export const sleepNight=(time:number,dawn:number,dusk:number)=>1-.7*smooth((time-dawn)/3)+.55*smooth((time-dusk)/2);
type P={x:number;y:number};
export function elbow(a:P,b:P,l1=46,l2=42,side=1):P{
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(.001,Math.hypot(dx,dy)),q=Math.min(l1+l2-.01,d);
 const along=(l1*l1-l2*l2+q*q)/(2*q),h=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {x:a.x+dx/d*along-side*dy/d*h,y:a.y+dy/d*along+side*dx/d*h};
}
export function sleepActing(index:number,local:number,duration:number,amplitude:number,microsleepAt=1.85){
 const k=gravityActing(7,100,amplitude);
 const intensity=Math.min(1,index/14),before=Math.min(1,Math.max(0,index-1)/14),fatigue=before+(intensity-before)*smooth(local/.45);
 const gesture=smooth(local/.38)*(1-smooth((local-duration+.48)/.4));
 const angry=[3,5,13].includes(index),startled=[7,9,15].includes(index);
 const nod=index===6?8*smooth((local-microsleepAt)/.5)*(1-smooth((local-microsleepAt-.8)/.35)):0;
 k.rootX=270;k.rootY=477+fatigue*5;k.groundY=685;
 // Bend knees slightly as fatigue accumulates while keeping both soles on the same floor.
 for(const side of ['left','right'] as const){
  const sign=side==='left'?-1:1,ankle={x:sign*42,y:675-k.rootY},hip=k[`${side}Hip`];
  const knee=elbow(hip,ankle,68,65,sign);
  k[`${side}Knee`]={...knee,angleDeg:0};k[`${side}Ankle`]=ankle;
  k[`${side}Foot`]={...ankle,rotDeg:0};k[`${side}ShoePos`]={...ankle,rot:0};
  k[`${side}LegPath`]=`M${hip.x} ${hip.y}L${knee.x} ${knee.y}L${ankle.x} ${ankle.y}`;
  const target=side==='left'?{x:-72,y:angry?0:30}:{x:angry?81:78,y:angry?-22:index===1?-45:index===11?-28:4};
  const wrist={x:sign*62+(target.x-sign*62)*gesture,y:48+(target.y-48)*gesture};
  const shoulder=k[`${side}Shoulder`],dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y,reach=Math.min(1,87.8/Math.hypot(dx,dy));
  wrist.x=shoulder.x+dx*reach;wrist.y=shoulder.y+dy*reach;
  const joint=elbow(shoulder,wrist,46,42,-sign);
  k[`${side}Elbow`]={...joint,angleDeg:0};k[`${side}Wrist`]={...wrist,handAngleDeg:sign*12};
  k[`${side}ArmPath`]=`M${shoulder.x} ${shoulder.y}L${joint.x} ${joint.y}L${wrist.x} ${wrist.y}`;
 }
 k.headRotation=k.headRotationDeg=fatigue*5+(angry?-7:startled?-4:2)*gesture+nod;
 k.leftBrowDeg=(angry?20:startled?-16:-5)*gesture;
 k.rightBrowDeg=(angry?-20:startled?16:7)*gesture;
 k.eyeScaleY=Math.max(.35,1-fatigue*.35-nod*.05+(startled?.20:0)*gesture);
 k.isBlinking=local%4.7>3.8&&local%4.7<3.95;
 if(index===6&&local>microsleepAt&&local<microsleepAt+1.15)k.isBlinking=false; // Microsleep can occur with eyes open.
 k.pupilOffsetX=index===13?6:index%2===0?-3:0;k.pupilOffsetY=fatigue*2;
 k.sweatDrops=false;k.hairFollowDeg=0;
 k.mouthOpenness=amplitude;k.mouthShape=amplitude>.06?'open_o':angry?'determined':'smile';
 return k;
}
