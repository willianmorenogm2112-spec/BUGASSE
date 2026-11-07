import test from 'node:test';
import assert from 'node:assert/strict';
import {regenPose,bodyToWorld} from './regenMotion';
test('both controllers keep limb lengths and finite joints through all 360 frames',()=>{
 for(const variant of ['A','B'] as const)for(let f=0;f<360;f++){
  const k=regenPose(f/30,variant);
  for(const side of ['left','right'] as const){
   const a=k[`${side}Shoulder`],b=k[`${side}Elbow`],c=k[`${side}Wrist`];
   assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-46)<1e-6);
   assert.ok(Math.abs(Math.hypot(c.x-b.x,c.y-b.y)-42)<1e-6);
   for(const p of [c,k[`${side}Knee`],k[`${side}Ankle`]])assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
   const sole=bodyToWorld(k,k[`${side}Ankle`]).y+14;
   assert.ok(sole<=685.01,`${variant} ${f} ${side} sole ${sole}`);
  }
 }
});
test('supporting palm stays on the same ground contact during impact recovery',()=>{
 for(const variant of ['A','B'] as const)for(let f=105;f<124;f++){
  const p=bodyToWorld(regenPose(f/30,variant),regenPose(f/30,variant).leftWrist);
  assert.ok(Math.hypot(p.x-236,p.y-659)<.01,`${variant} frame ${f}: ${JSON.stringify(p)}`);
 }
});
test('alternative adds articulated recovery while preserving final stage position',()=>{
 const a=regenPose(3.7,'A'),b=regenPose(3.7,'B');
 assert.ok(Math.abs(a.torsoRotation-b.torsoRotation)>3);
 assert.notEqual(b.hairFollowDeg,0);
 assert.equal(regenPose(12,'A').rootX,regenPose(12,'B').rootX);
 assert.equal(regenPose(12,'A').rootY,regenPose(12,'B').rootY);
});
test('walking preserves a readable left/right foot order without crossed ankles',()=>{
 for(const variant of ['A','B'] as const)for(let f=0;f<100;f++){
  const k=regenPose(f/30,variant),left=bodyToWorld(k,k.leftAnkle),right=bodyToWorld(k,k.rightAnkle);
  assert.ok(left.x+12<=right.x,`${variant} ${f}: ${left.x} / ${right.x}`);
 }
});
