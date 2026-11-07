import test from 'node:test';
import assert from 'node:assert/strict';
import {flow,fluidPose} from './fluidMotion';
test('cubic motion retains velocity at an interior key instead of stopping every pose',()=>{
 const keys=[[0,0],[1,10],[2,25],[3,40]] as const,h=1e-4;
 const left=(flow(1,keys)-flow(1-h,keys))/h,right=(flow(1+h,keys)-flow(1,keys))/h;
 assert.ok(left>5&&Math.abs(left-right)<.02);
});
test('independent puppet maintains limb lengths, finite geometry and floor bounds',()=>{
 for(let f=0;f<360;f++){
  const p=fluidPose(f/30);
  for(const side of ['left','right'] as const){
   for(const [a,b,c,l1,l2] of [[p.shoulders[side],p.arms[side].elbow,p.arms[side].end,112,110],[p.hips[side],p.legs[side].elbow,p.legs[side].end,102,102]] as const){
    assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-l1)<1e-6);
    assert.ok(Math.abs(Math.hypot(c.x-b.x,c.y-b.y)-l2)<1e-6);
    assert.ok(Number.isFinite(c.x)&&Number.isFinite(c.y));
   }
   assert.ok(p.legs[side].end.y<=1320.01);
  }
  assert.ok(p.head.x>150&&p.head.x<850);
 }
});
test('impact palms stay anchored while torso and head recover independently',()=>{
 for(let f=127;f<=140;f++){
  const p=fluidPose(f/30);
  assert.ok(Math.hypot(p.arms.left.end.x-730,p.arms.left.end.y-1293)<.01);
  assert.ok(Math.hypot(p.arms.right.end.x-790,p.arms.right.end.y-1293)<.01);
 }
 const a=fluidPose(4.25),b=fluidPose(4.4);
 assert.ok(Math.abs(a.chest.y-b.chest.y)>2&&Math.abs(a.headAngle-b.headAngle)>2);
});
test('arms do not snap between adjacent visible frames at 30 or 60 fps',()=>{
 for(const fps of [30,60])for(let f=1;f<12*fps;f++){
  const t=f/fps,previous=(f-1)/fps;
  if(t>=4.75&&t<6.9||t>=6.9&&previous<6.9)continue; // Actual shot cuts, not arm transitions.
  const p=fluidPose(t),before=fluidPose(previous);
  for(const side of ['left','right'] as const){
   const arm=p.arms[side],shoulder=p.shoulders[side];
   const reach=Math.hypot(arm.end.x-shoulder.x,arm.end.y-shoulder.y);
   assert.ok(reach>=90-1e-6&&reach<=217+1e-6,`${side} reach at ${t}`);
   for(const part of ['elbow','end'] as const){
    const a=arm[part],b=before.arms[side][part];
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<=28*30/fps,`${side} ${part} snap at ${t}`);
   }
  }
 }
});
test('walking-to-bracing transition is continuous rather than dropping the gait offset',()=>{
 const a=fluidPose(3.05-1e-6),b=fluidPose(3.05+1e-6);
 for(const side of ['left','right'] as const)for(const part of ['elbow','end'] as const){
  assert.ok(Math.hypot(a.arms[side][part].x-b.arms[side][part].x,a.arms[side][part].y-b.arms[side][part].y)<.001);
 }
});
test('visible arm segments keep clear of the face silhouette',()=>{
 for(let f=0;f<720;f++){
  const t=f/60;if(t>=4.75&&t<6.9)continue;
  const p=fluidPose(t),angle=-p.headAngle*Math.PI/180;
  for(const side of ['left','right'] as const){
   const arm=p.arms[side];
   for(const [a,b] of [[p.shoulders[side],arm.elbow],[arm.elbow,arm.end]])for(let j=0;j<=20;j++){
    const u=j/20,x=a.x+(b.x-a.x)*u-p.head.x,y=a.y+(b.y-a.y)*u-p.head.y;
    const rx=x*Math.cos(angle)-y*Math.sin(angle),ry=x*Math.sin(angle)+y*Math.cos(angle);
    assert.ok((rx/102)**2+(ry/103)**2>=1,`${side} crosses face at ${t}`);
   }
  }
 }
});
