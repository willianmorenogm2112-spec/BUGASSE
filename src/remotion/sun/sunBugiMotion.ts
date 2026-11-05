import {BugiArticulatedKinematics, computeBugiArticulatedKinematics} from '../../components/BugiCharacterSvg';
import {BugiExpression, BugiPose} from '../../types/studio';

export type SunBeatId = 'gancho' | 'espera' | 'escuro' | 'gravidade' | 'frio' | 'plantas' | 'final';

const easeOut = (value: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, value)), 3);

const setArm = (
  k: BugiArticulatedKinematics,
  side: 'left' | 'right',
  shoulderDeg: number,
  elbowDeg: number
) => {
  const shoulder = side === 'left' ? k.leftShoulder : k.rightShoulder;
  const upper = 46;
  const forearm = 42;
  const shoulderRad = shoulderDeg * Math.PI / 180;
  const elbow = {
    x: shoulder.x - Math.sin(shoulderRad) * upper,
    y: shoulder.y + Math.cos(shoulderRad) * upper,
    angleDeg: elbowDeg,
  };
  const forearmRad = (shoulderDeg + elbowDeg) * Math.PI / 180;
  const wrist = {
    x: elbow.x - Math.sin(forearmRad) * forearm,
    y: elbow.y + Math.cos(forearmRad) * forearm,
    handAngleDeg: shoulderDeg + elbowDeg,
  };

  shoulder.angleDeg = shoulderDeg;
  if (side === 'left') {
    k.leftElbow = elbow;
    k.leftWrist = wrist;
    k.leftArmPath = `M ${shoulder.x} ${shoulder.y} L ${elbow.x} ${elbow.y} L ${wrist.x} ${wrist.y}`;
  } else {
    k.rightElbow = elbow;
    k.rightWrist = wrist;
    k.rightArmPath = `M ${shoulder.x} ${shoulder.y} L ${elbow.x} ${elbow.y} L ${wrist.x} ${wrist.y}`;
  }
};

const beatPreset = (beatId: SunBeatId): {pose: BugiPose; expression: BugiExpression} => {
  switch (beatId) {
    case 'gancho': return {pose: 'confiante_parado', expression: 'determinado'};
    case 'espera': return {pose: 'confiante_parado', expression: 'curioso'};
    case 'escuro': return {pose: 'confiante_parado', expression: 'surpreso'};
    case 'gravidade': return {pose: 'confiante_parado', expression: 'determinado'};
    case 'frio': return {pose: 'confiante_parado', expression: 'desespero'};
    case 'plantas': return {pose: 'investigando', expression: 'curioso'};
    case 'final': return {pose: 'apontando', expression: 'comico'};
  }
};

/**
 * Acting controller for the Sun episode. Every beat has one motivated action and a recovery.
 * The local frame is capped so procedural cycles never repeat forever or drift between scenes.
 */
export const computeSunBugiKinematics = (
  beatId: SunBeatId,
  localFrame: number,
  fps: number,
  speaking: boolean
): BugiArticulatedKinematics => {
  const {pose, expression} = beatPreset(beatId);
  const actingFrame = Math.max(0, Math.min(localFrame, Math.round(fps * 1.2)));
  const k = computeBugiArticulatedKinematics(pose, actingFrame, fps, speaking ? 0.72 : 0, expression);
  const seconds = localFrame / fps;

  if (beatId === 'gancho') {
    const point = easeOut(seconds / 0.42);
    setArm(k, 'right', -28 - 108 * point, -18 + 8 * point);
    k.torsoRotation = k.torsoRotationDeg = 4 - 5 * point;
    k.mouthShape = 'open_o';
    k.leftBrowDeg = 18;
    k.rightBrowDeg = -18;
  } else if (beatId === 'espera') {
    const settle = easeOut(seconds / 0.55);
    setArm(k, 'right', -112 + 88 * settle, -12 + 35 * settle);
    k.torsoRotation = k.torsoRotationDeg = 2 * (1 - settle);
  } else if (beatId === 'escuro') {
    const reaction = seconds >= 1.2 ? 0 : Math.exp(-seconds * 4.2);
    k.rootY -= 10 * reaction;
    k.torsoRotation = k.torsoRotationDeg = -6 * reaction;
    setArm(k, 'left', -22 - 74 * reaction, -20);
    setArm(k, 'right', 22 + 74 * reaction, 20);
    k.mouthShape = seconds < 0.75 ? 'open_o' : 'smile';
  } else if (beatId === 'gravidade') {
    const recover = easeOut(seconds / 0.62);
    k.squashX = 1.05 - 0.05 * recover;
    k.stretchY = 0.94 + 0.06 * recover;
    setArm(k, 'right', -30 - 36 * recover, -28 - 30 * recover);
  } else if (beatId === 'frio') {
    setArm(k, 'left', -58, 112);
    setArm(k, 'right', 58, -112);
    k.torsoRotation = k.torsoRotationDeg = Math.sin(Math.min(seconds, 1.2) * Math.PI * 3) * 1.1;
    k.mouthShape = 'panic_wave';
  } else if (beatId === 'plantas') {
    const explain = easeOut(seconds / 0.5);
    setArm(k, 'right', -62 - 25 * explain, -55);
    k.torsoRotation = k.torsoRotationDeg = 4;
  } else if (beatId === 'final') {
    const point = easeOut(seconds / 0.45);
    setArm(k, 'right', -54 - 50 * point, -35 + 22 * point);
    k.torsoRotation = k.torsoRotationDeg = 3 + 2 * point;
    k.mouthShape = 'grin';
  }

  k.headRotation = k.headRotationDeg;
  return k;
};

