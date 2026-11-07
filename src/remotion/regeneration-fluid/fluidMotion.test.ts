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
