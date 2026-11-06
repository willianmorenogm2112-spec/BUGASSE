import assert from 'node:assert/strict';
import test from 'node:test';
import {fallTime,gravityActing,jumpHeight} from './gravityMotion';
test('feet stay planted through sofa effort and recovery',()=>{
 for(const i of [0,5,12])for(let f=0;f<180;f++){
  const k=gravityActing(i,f/30,0);
  assert.ok(Math.abs(k.rootY+k.leftFoot.y-675)<1e-8);
  assert.ok(Math.abs(k.rootY+k.rightFoot.y-675)<1e-8);
  for(const s of ['left','right'] as const){
   assert.ok(Math.abs(Math.hypot(k[`${s}Knee`].x-k[`${s}Hip`].x,k[`${s}Knee`].y-k[`${s}Hip`].y)-68)<.1);
   assert.ok(Math.abs(Math.hypot(k[`${s}Knee`].x-k[`${s}Ankle`].x,k[`${s}Knee`].y-k[`${s}Ankle`].y)-65)<.1);
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
