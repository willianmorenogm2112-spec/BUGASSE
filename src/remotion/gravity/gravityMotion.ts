import {computeBugiArticulatedKinematics, type BugiArticulatedKinematics} from '../../components/BugiCharacterSvg';
export const smooth=(x:number)=>{const p=Math.max(0,Math.min(1,x));return p*p*(3-2*p);};
export const fallTime=(height:number,g:number)=>Math.sqrt(2*height/g);
export const jumpHeight=(velocity:number,g:number)=>velocity*velocity/(2*g);

// Two-link IK preserves segment lengths and anchors the sole to the floor.
function joint(a:{x:number;y:number},b:{x:number;y:number},l1:number,l2:number,side:number){
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(.01,Math.hypot(dx,dy));
 const q=Math.min(l1+l2-.01,Math.max(Math.abs(l1-l2)+.01,d));
 const along=(l1*l1-l2*l2+q*q)/(2*q),h=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {x:a.x+dx/d*along+side*(-dy/d)*h,y:a.y+dy/d*along+side*(dx/d)*h};
}
export function gravityActing(index:number,seconds:number,speaking:number):BugiArticulatedKinematics{
 const k=computeBugiArticulatedKinematics('confiante_parado',0,30,0,'curioso');
 let sit=1,air=0;
 if(index===0){sit=1-.55*smooth(seconds/.40)+.55*smooth((seconds-.5)/.23);}
 else if(index===5){sit=1-smooth((seconds-.3)/1.1);}
 else if(index>=6&&index<=11){sit=0;}
 if(index===6) sit=.3*smooth((seconds-.3)/.4);
 if(index===8){const u=Math.max(0,Math.min(1,seconds/.65));air=24*4*u*(1-u);}
 if(index===12) sit=smooth(seconds/.75);
 const hip=1-sit;
 k.rootX=270;k.rootY=477+sit*70-air;k.groundY=685;
 k.squashX=1;k.stretchY=1;k.torsoRotation=k.torsoRotationDeg=0;
 k.headRotation=k.headRotationDeg=index===0?-7*smooth(seconds/.4):index===2?-8:index===10?10:index===12?6:0;
 k.leftHip={x:-24,y:68,angleDeg:0};k.rightHip={x:24,y:68,angleDeg:0};
 const ankleY=675-k.rootY;
 const left={x:-52+8*hip,y:ankleY},right={x:50-8*hip,y:ankleY};
 const lk=joint(k.leftHip,left,68,65,1),rk=joint(k.rightHip,right,68,65,-1);
 k.leftKnee={...lk,angleDeg:0};k.rightKnee={...rk,angleDeg:0};
 k.leftAnkle=left;k.rightAnkle=right;
 k.leftFoot={...left,rotDeg:0};k.rightFoot={...right,rotDeg:0};
 k.leftShoePos={...left,rot:0};k.rightShoePos={...right,rot:0};
 // Hand targets rest on armrests when seated and shift to waist when standing.
 for(const side of ['left','right'] as const){
  const sign=side==='left'?-1:1,shoulder=k[`${side}Shoulder`];
  const wrist={x:sign*(74-hip*12),y:48+sit*5+(index===0?547-k.rootY:0)};
  if(index===2||index===6){wrist.x=sign*74;wrist.y=4;}
  if(index===10&&side==='right'){const lift=smooth(seconds/.35);wrist.x=62+23*lift;wrist.y=48-86*lift;}
  const elbow=joint(shoulder,wrist,46,42,sign);
  k[`${side}Elbow`]={...elbow,angleDeg:0};
  k[`${side}Wrist`]={...wrist,handAngleDeg:sign*12};
  k[`${side}ArmPath`]=`M${shoulder.x} ${shoulder.y}L${elbow.x} ${elbow.y}L${wrist.x} ${wrist.y}`;
 }
 k.leftBrowDeg=index===0||index===2?18:index===6?-12:0;
 k.rightBrowDeg=index===0||index===2?-18:index===6?12:0;
 k.pupilOffsetX=index===10?6:index===2?-4:0;k.pupilOffsetY=index===0?4:0;
 k.eyeScaleY=index===8?.72:index===10?1.15:1;
 k.sweatDrops=index===0||index===5||index===8;
 if(index===5){k.leftBrowDeg=-14;k.rightBrowDeg=14;}
 if(index===4){k.leftBrowDeg=-15;k.rightBrowDeg=5;}
 k.hairFollowDeg=index===0?Math.sin(Math.min(seconds,1)*9)*Math.exp(-seconds*3)*5:0;
 k.isBlinking=seconds>1.5&&seconds<1.62;
 k.mouthOpenness=speaking;k.mouthShape=speaking>.06?'open_o':index===0||index===8?'panic_wave':index===6||index===12?'grin':'smile';
 k.leftLegPath=`M-24 68L${lk.x} ${lk.y}L${left.x} ${left.y}`;
 k.rightLegPath=`M24 68L${rk.x} ${rk.y}L${right.x} ${right.y}`;
 return k;
}
