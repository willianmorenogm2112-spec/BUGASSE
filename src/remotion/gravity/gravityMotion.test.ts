import assert from 'node:assert/strict';
import test from 'node:test';
import {fallTime,gravityActing,jumpHeight} from './gravityMotion';
test('feet stay planted through sofa effort and recovery',()=>{
 for(const i of [0,5,12])for(let f=0;f<180;f++){
  const k=gravityActing(i,f/30,0);
  assert.ok(Math.abs(k.rootY+k.leftFoot.y-675)<1e-8);
  assert.ok(Math.abs(k.rootY+k.rightFoot.y-675)<1e-8);
  for(const s of ['left','right'] as const){
   const thigh=Math.hypot(k[`${s}Knee`].x-k[`${s}Hip`].x,k[`${s}Knee`].y-k[`${s}Hip`].y);
   const shin=Math.hypot(k[`${s}Knee`].x-k[`${s}Ankle`].x,k[`${s}Knee`].y-k[`${s}Ankle`].y);
   assert.ok(thigh>=39.9&&thigh<=68.1,'projected thigh length respects seated foreshortening');
   assert.ok(shin>=35.9&&shin<=65.1,'projected shin remains bounded');
   assert.ok(Math.abs(k[`${s}Knee`].x)<80,'knees do not splay away from the body');
  }
 }
});
test('jump lifts both feet, then lands instead of stretching the legs',()=>{
 const start=gravityActing(8,0,0),air=gravityActing(8,.4,0),land=gravityActing(8,1.2,0);
 assert.ok(air.rootY+air.leftFoot.y<655);
 assert.equal(start.rootY+start.leftFoot.y,675);
 assert.equal(land.rootY+land.rightFoot.y,675);
});
test('all arm targets remain reachable with stable upper/forearm lengths',()=>{
 for(let i=0;i<13;i++)for(let f=0;f<180;f++){
  const k=gravityActing(i,f/30,0);
  for(const s of ['left','right'] as const){
   const a=k[`${s}Shoulder`],b=k[`${s}Elbow`],c=k[`${s}Wrist`];
   assert.ok(Math.abs(Math.hypot(b.x-a.x,b.y-a.y)-46)<.1);
   assert.ok(Math.abs(Math.hypot(c.x-b.x,c.y-b.y)-42)<.1);
  }
 }
});
test('one attempt settles instead of looping indefinitely',()=>{
 const settled=gravityActing(0,4,0),later=gravityActing(0,14,0);
 assert.equal(settled.rootY,later.rootY);
 assert.deepEqual(settled.leftKnee,later.leftKnee);
 assert.deepEqual(settled.rightWrist,later.rightWrist);
 assert.ok(Math.abs(settled.hairFollowDeg-later.hairFollowDeg)<.001,'hair follow-through settles below visible precision');
 assert.ok(gravityActing(0,.4,0).rootY<gravityActing(0,0,0).rootY);
 assert.equal(gravityActing(1,2,0).mouthOpenness,0);
});
test('ideal 2g comparisons use gravity, not twice the fall speed',()=>{
 assert.ok(Math.abs(fallTime(1,19.62)-.3193)<.001);
 assert.ok(Math.abs(fallTime(1,19.62)/fallTime(1,9.81)-1/Math.sqrt(2))<1e-8);
 assert.equal(jumpHeight(3,19.62)/jumpHeight(3,9.81),.5);
});
