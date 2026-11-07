import test from 'node:test';
import assert from 'node:assert/strict';
import {earthActing,cupAnchor,rotationKmh} from './earthMotion';
import {earthCamera,wordCue} from './earthDirection';
import timing from '../../../public/assets/terra-1s/timing.json';
test('arm bones retain length and all joint targets remain finite during each action',()=>{
 for(const action of ['carry','brake','drift','brace','point','run','recover'] as const)for(let f=0;f<180;f++){
  const k=earthActing(action,f/30,.4);
  for(const side of ['left','right'] as const){
   const a=k[`${side}Shoulder`],b=k[`${side}Elbow`],c=k[`${side}Wrist`];
   assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-46)<1e-6);
   assert.ok(Math.abs(Math.hypot(c.x-b.x,c.y-b.y)-42)<1e-6);
   assert.ok(Number.isFinite(k[`${side}Ankle`].x));
  }
 }
});
test('carrying has grounded soles; drift evolves beyond the initial reaction',()=>{
 for(let f=0;f<120;f++){
  const k=earthActing('carry',f/30);
  assert.equal(k.rootY+k.leftAnkle.y,685);assert.equal(k.rootY+k.rightAnkle.y,685);
 }
 const a=earthActing('drift',1),b=earthActing('drift',3);
 assert.ok(Math.abs(a.torsoRotation-b.torsoRotation)>5);
 assert.ok(Math.abs(a.leftWrist.y-b.leftWrist.y)>10);
});
test('cup release anchor equals the transformed hand attachment',()=>{
 const k=earthActing('brake',1.2),p=cupAnchor('brake',1.2,413),a=k.torsoRotation*Math.PI/180;
 assert.ok(Math.abs(p.x-(413+1.9*((k.rightWrist.x+9)*Math.cos(a)-(k.rightWrist.y-5)*Math.sin(a))))<1e-7);
 assert.ok(Number.isFinite(p.y));
});
test('rotation estimate depends on latitude and its distance is an idealization',()=>{
 assert.ok(Math.abs(rotationKmh(0)-1674)<2);
 assert.ok(rotationKmh(60)/rotationKmh(0)>.4999&&rotationKmh(60)/rotationKmh(0)<.5001);
 assert.ok(Math.abs(rotationKmh(90))<1e-6);
 assert.ok(Math.abs(1670/3.6-464)<1);
});
test('audio-led camera remains bounded and deterministic over the entire episode',()=>{
 for(let f=0;f<Math.ceil(timing.duration*30);f++){
  const t=f/30,turn=timing.turns.filter(q=>q.start<=t).at(-1)??timing.turns[0];
  const u=Math.max(0,t-turn.start),c=earthCamera(turn.index,u);
  assert.ok(c.scale>=1&&c.scale<=1.21);
  assert.ok(c.x>=500&&c.x<=660&&c.y>=880&&c.y<=1000);
  assert.deepEqual(c,earthCamera(turn.index,u));
 }
 assert.ok(wordCue(4,'freia',0)>1&&wordCue(4,'agora',0)>wordCue(4,'freia',0));
});
