import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {computeSunBugiKinematics, SunBeatId} from './sunBugiMotion';

const beats: SunBeatId[] = ['gancho', 'espera', 'escuro', 'gravidade', 'frio', 'plantas', 'final'];

describe('Sun Bugi acting controller', () => {
  it('keeps every grounded beat inside the canonical floor constraint', () => {
    for (const beat of beats) {
      for (const frame of [0, 6, 15, 30, 60, 120]) {
        const k = computeSunBugiKinematics(beat, frame, 30, beat === 'gancho');
        assert.ok(k.leftAnkle.y <= k.groundY - k.rootY - 16 + 0.01, `${beat} left foot crossed floor`);
        assert.ok(k.rightAnkle.y <= k.groundY - k.rootY - 16 + 0.01, `${beat} right foot crossed floor`);
        assert.ok(k.rootY >= 470 && k.rootY <= 540, `${beat} detached from floor`);
      }
    }
  });

  it('does not use airborne or endless panic poses for the gravity explanation', () => {
    const gravity = computeSunBugiKinematics('gravidade', 20, 30, false);
    const darknessSettled = computeSunBugiKinematics('escuro', 60, 30, false);
    assert.notEqual(gravity.pose, 'pulando');
    assert.notEqual(gravity.pose, 'flutuando');
    assert.notEqual(darknessSettled.pose, 'assustando');
    assert.ok(Math.abs(darknessSettled.torsoRotationDeg) < 1);
  });

  it('keeps the cold acting grounded while crossing both arms', () => {
    const cold = computeSunBugiKinematics('frio', 45, 30, false);
    assert.equal(cold.pose, 'confiante_parado');
    assert.ok(cold.leftWrist.x > cold.leftShoulder.x);
    assert.ok(cold.rightWrist.x < cold.rightShoulder.x);
  });

  it('freezes procedural acting after the recovery instead of looping forever', () => {
    for (const beat of beats) {
      const a = computeSunBugiKinematics(beat, 180, 30, false);
      const b = computeSunBugiKinematics(beat, 360, 30, false);
      assert.ok(Math.abs(a.rootY - b.rootY) < 0.001, `${beat} root kept cycling`);
      assert.ok(Math.abs(a.torsoRotationDeg - b.torsoRotationDeg) < 0.001, `${beat} torso kept cycling`);
      assert.deepEqual(a.leftWrist, b.leftWrist, `${beat} left arm kept cycling`);
      assert.deepEqual(a.rightWrist, b.rightWrist, `${beat} right arm kept cycling`);
    }
  });
});
