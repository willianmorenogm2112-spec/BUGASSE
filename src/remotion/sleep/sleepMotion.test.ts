import test from 'node:test';
import assert from 'node:assert/strict';
import {sleepActing,travelMeters,sleepNight} from './sleepMotion';
test('feet remain anchored and arm bones keep length in every acting frame',()=>{
 for(let index=0;index<20;index++)for(let f=0;f<=360;f++){
  const k=sleepActing(index,f/30,12,.4);
  for(const side of ['left','right'] as const){
   assert.ok(Math.abs(k.rootY+k[`${side}Ankle`].y-675)<1e-7);
   const a=k[`${side}Shoulder`],b=k[`${side}Elbow`],c=k[`${side}Wrist`];
   assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-46)<.001);
   assert.ok(Math.abs(Math.hypot(c.x-b.x,c.y-b.y)-42)<.001);
  }
 }
});
test('silent listening never uses an open mouth shape',()=>{
 for(let i=0;i<20;i++)assert.ok(['smile','determined'].includes(sleepActing(i,2,8,0).mouthShape));
});
test('all gestures recover before cuts and body changes start continuously',()=>{
 for(let i=1;i<20;i++){
  const a=sleepActing(i-1,12,12,0),b=sleepActing(i,0,12,0);
  assert.ok(Math.abs(a.rootY-b.rootY)<.001);
  for(const side of ['left','right'] as const){
   assert.ok(Math.hypot(a[`${side}Wrist`].x-b[`${side}Wrist`].x,a[`${side}Wrist`].y-b[`${side}Wrist`].y)<.001);
  }
 }
});
test('road example uses km/h conversion, not braking distance',()=>{assert.ok(Math.abs(travelMeters(100,3)-83.3333333333)<1e-7);});
test('lighting follows global time continuously across dialogue cuts',()=>{
 assert.equal(sleepNight(0,12,91),1);
 assert.ok(Math.abs(sleepNight(26.89-.001,12,91)-sleepNight(26.89+.001,12,91))<1e-5);
 assert.ok(Math.abs(sleepNight(40,12,91)-.3)<1e-7);
 assert.ok(Math.abs(sleepNight(120,12,91)-.85)<1e-7);
});
