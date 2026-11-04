import test from 'node:test';
import assert from 'node:assert/strict';
import {pilotMotion} from './motion';
import {onset,reelTime,reelCaptions,speechWords} from './reel';

test('reel speech anchors fail closed and map spoken impact to animated impact',()=>{
  assert.throws(()=>onset('palavra-inexistente'));
  assert.equal(reelTime(onset('chão')),10.2);
  assert.equal(reelTime(onset('poste')),7.65);
  assert.equal(reelTime(onset('pegada')),8.8);
});

test('short captions preserve every transcribed word once without overlapping groups',()=>{
  assert.deepEqual(reelCaptions.flatMap(c=>c.words),speechWords);
  reelCaptions.forEach((c,i)=>{
    assert.ok(c.words.length>=1&&c.words.length<=3);
    assert.ok(c.end>c.start);
    if(i)assert.ok(reelCaptions[i-1].end<=c.start);
  });
});

test('pilot is finite and deterministic when frames are requested out of order',()=>{
  const baseline=Array.from({length:375},(_,f)=>pilotMotion(f/30));
  for(let f=374;f>=0;f--){
    assert.deepEqual(pilotMotion(f/30),baseline[f]);
    const visit=(v:unknown):void=>{
      if(typeof v==='number')assert.ok(Number.isFinite(v),`NaN at ${f}`);
      if(v&&typeof v==='object')Object.values(v).forEach(visit);
    };
    visit(baseline[f]);
  }
});

test('hand contacts the same fixed world point throughout the grabbing hold',()=>{
  for(const t of [7.65,7.9,8.2,8.6,8.8]){
    const k=pilotMotion(t),a=k.torsoRotation*Math.PI/180;
    const x=k.leftWrist.x*k.squashX,y=k.leftWrist.y*k.stretchY;
    assert.ok(Math.abs(k.rootX+x*Math.cos(a)-y*Math.sin(a)-620)<1e-8);
    assert.ok(Math.abs(k.rootY+x*Math.sin(a)+y*Math.cos(a)-466)<1e-8);
  }
});

test('sliding support foot remains on the ground after root rotation and squash',()=>{
  for(let f=72;f<292;f++){
    const k=pilotMotion(f/30),a=k.torsoRotation*Math.PI/180;
    const y=k.rootY+k.leftAnkle.x*k.squashX*Math.sin(a)+k.leftAnkle.y*k.stretchY*Math.cos(a);
    assert.ok(Math.abs(y-673)<1e-8,`lost ground at ${f}: ${y}`);
  }
});
