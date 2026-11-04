import {interpolate} from 'remotion';
import {computeBugiArticulatedKinematics, type BugiArticulatedKinematics} from '../../components/BugiCharacterSvg';

const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const at = (t:number, times:number[], values:number[]) => interpolate(t,times,values,clamp);
type Point={x:number;y:number};
const rad=(v:number)=>v*Math.PI/180;

/** Two-bone IK. Joint length stays bounded; foot/hand contacts are world targets. */
function joint(a:Point,b:Point,l1:number,l2:number,side:number):Point {
  const dx=b.x-a.x,dy=b.y-a.y;
  const d=Math.min(l1+l2-0.01,Math.max(0.01,Math.hypot(dx,dy)));
  const along=(l1*l1-l2*l2+d*d)/(2*d);
  const h=Math.sqrt(Math.max(0,l1*l1-along*along));
  const theta=Math.atan2(dy,dx);
  return {x:a.x+Math.cos(theta)*along-Math.sin(theta)*h*side,
    y:a.y+Math.sin(theta)*along+Math.cos(theta)*h*side};
}

export function pilotMotion(t:number):BugiArticulatedKinematics {
  const k=computeBugiArticulatedKinematics('confiante_parado',t*30,30,0,
    t<2?'confiante':t<8?'surpreso':'comico');
  const keys=[0,1.8,2.1,2.6,4,6.8,7.3,8,8.8,9.5,10,10.3,10.8,11.4,12.5];
  k.rootX=at(t,keys,[220,280,290,320,400,575,625,668,690,740,775,780,780,780,780]);
  k.rootY=at(t,keys,[496,496,511,482,497,497,495,487,488,510,595,622,570,537,537]);
  k.torsoRotation=k.torsoRotationDeg=at(t,keys,[4,4,12,-24,-18,-18,2,18,24,-35,-70,-88,-25,-10,-10]);
  k.squashX=at(t,[0,2,2.15,2.6,7.4,8.5,9.1,10,10.25,10.6,11,12.5],[1,1,1.07,1,1,1.1,1,1,1.15,1.03,1,1]);
  k.stretchY=at(t,[0,2,2.15,2.6,7.4,8.5,9.1,10,10.25,10.6,11,12.5],[1,1,.94,1,1,.94,1,1,.82,.97,1,1]);
  k.grabAnchorPoint=undefined; k.impactShockwave=t>=10.2&&t<10.5;k.recoveryStars=t>10.5;
  k.sweatDrops=t>2.4&&t<9.7;k.stretchTensionLines=false;
  k.mouthOpenness=t<2?0.05:t<9.8?.5:.15;
  k.headRotation=k.headRotationDeg=at(t,[0,2,2.5,7,7.7,9.4,10.2,11.2,12.5],[0,0,13,5,-12,15,12,-8,-8]);
  k.hairFollowDeg=Math.sin(t*8)*at(t,[0,2,3,9.7,10.3,11],[1,2,5,5,12,1]);
  const inv=(p:Point):Point=>{
    const dx=p.x-k.rootX,dy=p.y-k.rootY,c=Math.cos(rad(-k.torsoRotation)),s=Math.sin(rad(-k.torsoRotation));
    return {x:(dx*c-dy*s)/k.squashX,y:(dx*s+dy*c)/k.stretchY};
  };
  // A planted shoe stays at one world x until toe-off. The other advances on its swing.
  const gait=(offset:number):Point=>{
    const cycle=(t/.62+offset),n=Math.floor(cycle),u=cycle-n;
    const origin=220+(.62*n-offset*.62)*34;
    const step=34*.62;
    const swing=Math.max(0,(u-.55)/.45);
    return {x:origin+step*(swing>0?swing:0)+(offset?28:-28),y:673-Math.sin(swing*Math.PI)*24};
  };
  const walkFade=at(t,[1.7,2.3],[1,0]);
  const leftWalk=gait(0),rightWalk=gait(.5);
  const leftSlide={x:k.rootX-40+Math.sin(t*4)*8,y:673};
  const rightSlide={x:k.rootX+57,y:673-at(t,[2,2.7,7.5,8.7,9.4,10.2,11],[0,56,42,8,55,12,8])};
  const foot=(walking:Point,sliding:Point):Point=>inv({x:walking.x*walkFade+sliding.x*(1-walkFade),y:walking.y*walkFade+sliding.y*(1-walkFade)});
  const l=foot(leftWalk,leftSlide),r=foot(rightWalk,rightSlide);
  // Release both feet during the tumble instead of stretching a grounded leg.
  const airborne=at(t,[9.75,10.15,10.5,11.35],[0,1,1,0]);
  l.x=l.x*(1-airborne)-20*airborne;l.y=l.y*(1-airborne)+135*airborne;
  r.x=r.x*(1-airborne)+45*airborne;r.y=r.y*(1-airborne)+100*airborne;
  const lk=joint(k.leftHip,l,68,66,-1),rk=joint(k.rightHip,r,68,66,-1);
  k.leftKnee={...lk,angleDeg:0};k.rightKnee={...rk,angleDeg:0};
  k.leftAnkle=l;k.rightAnkle=r;
  k.leftFoot={x:l.x-18,y:l.y,rotDeg:-k.torsoRotation};
  k.rightFoot={x:r.x-14,y:r.y,rotDeg:-k.torsoRotation-at(t,[2,2.6,7.5,8.7,9.4,10.5,11],[0,15,8,0,23,0,0])};
  const wave=at(t,[0,1.8,2.4,7.3,7.7,9,9.5,10.2,11],[.15,.15,1,1,.15,.15,1,.5,.1]);
  const arm=(left:boolean)=>{
    const shoulder=left?k.leftShoulder:k.rightShoulder;
    const phase=t*7+(left?0:1.6);
    let wrist={x:shoulder.x+Math.sin(phase)*(16+wave*45),y:shoulder.y+65-wave*(55+Math.cos(phase)*36)};
    if(left&&t>7.25&&t<9.2){
      const contact=inv({x:620,y:466});
      const blend=at(t,[7.25,7.65,8.8,9.2],[0,1,1,0]);
      wrist={x:wrist.x*(1-blend)+contact.x*blend,y:wrist.y*(1-blend)+contact.y*blend};
    }
    const elbow=joint(shoulder,wrist,49,46,left?1:-1);
    return {elbow:{...elbow,angleDeg:0},wrist:{...wrist,handAngleDeg:0}};
  };
  const la=arm(true),ra=arm(false);
  k.leftElbow=la.elbow;k.leftWrist=la.wrist;k.rightElbow=ra.elbow;k.rightWrist=ra.wrist;
  k.leftArmPath=`M ${k.leftShoulder.x} ${k.leftShoulder.y} L ${la.elbow.x} ${la.elbow.y} L ${la.wrist.x} ${la.wrist.y}`;
  k.rightArmPath=`M ${k.rightShoulder.x} ${k.rightShoulder.y} L ${ra.elbow.x} ${ra.elbow.y} L ${ra.wrist.x} ${ra.wrist.y}`;
  return k;
}
