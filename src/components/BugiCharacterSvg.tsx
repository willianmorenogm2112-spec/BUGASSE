import React from 'react';
import {
  BugiAnimationState,
  BugiExpression,
  BugiPose,
  ScenarioPreset,
} from '../types/studio';
import {
  BugiMultiJointRigState,
  computeBugiMultiJointRig,
} from '../remotion/animation/bugiRigAndBeatsEngine';

export interface BugiArticulatedKinematics extends BugiMultiJointRigState {
  headRotation: number;
  torsoRotation: number;
  leftArmPath: string;
  rightArmPath: string;
  leftLegPath: string;
  rightLegPath: string;
  leftShoePos: { x: number; y: number; rot: number };
  rightShoePos: { x: number; y: number; rot: number };
  pivots: {
    torsoHip: { x: 0; y: 70 };
    neckHead: { x: 0; y: -52 };
    leftShoulder: { x: -46; y: -24 };
    rightShoulder: { x: 46; y: -24 };
    leftHip: { x: -24; y: 68 };
    rightHip: { x: 24; y: 68 };
  };
}

export interface BugiSceneStageProps {
  pose: BugiPose;
  expression: BugiExpression;
  stateOverride?: BugiAnimationState;
  scenario?: ScenarioPreset;
  customBackgroundUrl?: string;
  showPhysicsVectors?: boolean;
  subtitlePreview?: string;
  timerSeconds?: number;
  aspectRatio?: '9:16' | '16:9' | '1:1';
  frame?: number;
  fps?: number;
  speechIntensity?: number;
  className?: string;
}

/**
 * Calcula a cinemática multi-articulada completa do Bugi (compatível com todos os testes e módulos)
 * incluindo pivôs independentes de ombro, cotovelo, punho, quadril, joelho, tornozelo, pescoço,
 * cabeça, cabelo com follow-through, sobrancelhas, pupilas e boca.
 */
export function computeBugiArticulatedKinematics(
  pose: BugiPose,
  frame = 0,
  fps = 30,
  speechIntensity = 0.3,
  expression: BugiExpression = 'curioso',
  stateOverride?: BugiAnimationState
): BugiArticulatedKinematics {
  const rig = computeBugiMultiJointRig({
    pose,
    expression,
    stateOverride,
    frame,
    fps,
    speechIntensity,
  });

  const leftArmPath = `M ${rig.leftShoulder.x} ${rig.leftShoulder.y} L ${rig.leftElbow.x} ${rig.leftElbow.y} L ${rig.leftWrist.x} ${rig.leftWrist.y}`;
  const rightArmPath = `M ${rig.rightShoulder.x} ${rig.rightShoulder.y} L ${rig.rightElbow.x} ${rig.rightElbow.y} L ${rig.rightWrist.x} ${rig.rightWrist.y}`;
  const leftLegPath = `M ${rig.leftHip.x} ${rig.leftHip.y} L ${rig.leftKnee.x} ${rig.leftKnee.y} L ${rig.leftAnkle.x} ${rig.leftAnkle.y}`;
  const rightLegPath = `M ${rig.rightHip.x} ${rig.rightHip.y} L ${rig.rightKnee.x} ${rig.rightKnee.y} L ${rig.rightAnkle.x} ${rig.rightAnkle.y}`;

  return {
    ...rig,
    headRotation: rig.headRotationDeg,
    torsoRotation: rig.torsoRotationDeg,
    leftArmPath,
    rightArmPath,
    leftLegPath,
    rightLegPath,
    leftShoePos: {
      x: rig.leftFoot.x,
      y: rig.leftFoot.y,
      rot: rig.leftFoot.rotDeg,
    },
    rightShoePos: {
      x: rig.rightFoot.x,
      y: rig.rightFoot.y,
      rot: rig.rightFoot.rotDeg,
    },
    pivots: {
      torsoHip: { x: 0, y: 70 },
      neckHead: { x: 0, y: -52 },
      leftShoulder: { x: -46, y: -24 },
      rightShoulder: { x: 46, y: -24 },
      leftHip: { x: -24, y: 68 },
      rightHip: { x: 24, y: 68 },
    },
  };
}

/**
 * Gera o código SVG puro e editável do personagem canônico BUGI com todos os pivôs articulados
 */
export function generateBugiCanonicalSvgMarkup(
  pose: BugiPose = 'escorregando',
  expression: BugiExpression = 'surpreso',
  scenario: ScenarioPreset = 'calcada_urbana',
  frame = 0
): string {
  const k = computeBugiArticulatedKinematics(pose, frame, 30, 0.35, expression);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="1080" height="1920">
  <title>Bugi Canonical 2D Multi-Joint Rig — Pose: ${pose} | Estado: ${k.state} | Expressão: ${expression} | Cenário: ${scenario}</title>
  <desc>Personagem fixo do canal E Se Bugasse? Studio. Muda uma regra. Começa o caos.</desc>
  <rect width="540" height="960" fill="#0B1926"/>
  <rect y="685" width="540" height="275" fill="#122638"/>
  <line x1="0" y1="685" x2="540" y2="685" stroke="#39C8D5" stroke-width="5" stroke-linecap="round"/>
  <g id="Bugi-Rig-Root" transform="translate(${k.rootX.toFixed(1)}, ${k.rootY.toFixed(1)}) rotate(${k.torsoRotation.toFixed(1)}) scale(${k.squashX}, ${k.stretchY})" stroke="#060D14" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Braço Esquerdo Articulado (Ombro -> Cotovelo -> Punho) -->
    <path id="Bugi-Left-Arm" d="${k.leftArmPath}" stroke="#122638" stroke-width="22" fill="none"/>
    <circle id="Bugi-Left-Hand" cx="${k.leftWrist.x}" cy="${k.leftWrist.y}" r="11" fill="#F7D5B8"/>
    <!-- Pernas Articuladas (Quadril -> Joelho -> Tornozelo) -->
    <path id="Bugi-Left-Leg" d="${k.leftLegPath}" stroke="#0A1520" stroke-width="25" fill="none"/>
    <path id="Bugi-Right-Leg" d="${k.rightLegPath}" stroke="#0A1520" stroke-width="25" fill="none"/>
    <!-- Tênis claros (#FFF7E9 com sola coral #FF6B50) -->
    <g id="Bugi-Left-Sneaker" transform="translate(${k.leftShoePos.x.toFixed(1)}, ${k.leftShoePos.y.toFixed(1)}) rotate(${k.leftShoePos.rot.toFixed(1)})">
      <rect x="0" y="-6" width="50" height="22" rx="11" fill="#FFF7E9"/>
      <line x1="3" y1="15" x2="47" y2="15" stroke="#FF6B50" stroke-width="5.5"/>
    </g>
    <g id="Bugi-Right-Sneaker" transform="translate(${k.rightShoePos.x.toFixed(1)}, ${k.rightShoePos.y.toFixed(1)}) rotate(${k.rightShoePos.rot.toFixed(1)})">
      <rect x="0" y="-6" width="50" height="22" rx="11" fill="#FFF7E9"/>
      <line x1="3" y1="15" x2="47" y2="15" stroke="#FF6B50" stroke-width="5.5"/>
    </g>
    <!-- Tronco: Jaqueta azul-petróleo (#122638) + Camiseta creme (#FFF7E9) -->
    <g id="Bugi-Torso">
      <rect x="-50" y="-44" width="100" height="118" rx="28" fill="#122638"/>
      <path d="M -22 -42 L 22 -42 L 17 72 L -17 72 Z" fill="#FFF7E9"/>
      <path d="M -24 -42 L -18 72 M 24 -42 L 18 72" stroke="#39C8D5" stroke-width="4"/>
    </g>
    <!-- Braço Direito Articulado (Ombro -> Cotovelo -> Punho) -->
    <path id="Bugi-Right-Arm" d="${k.rightArmPath}" stroke="#122638" stroke-width="22" fill="none"/>
    <circle id="Bugi-Right-Hand" cx="${k.rightWrist.x}" cy="${k.rightWrist.y}" r="11" fill="#F7D5B8"/>
    <!-- Cabeça e Pescoço Articulados + Cabelo Coral com Follow-Through -->
    <g id="Bugi-Head" transform="translate(0, ${k.headOffsetY.toFixed(1)}) rotate(${k.headRotation.toFixed(1)})">
      <rect x="-15" y="-60" width="30" height="24" rx="10" fill="#F4C9A8"/>
      <rect x="-56" y="-164" width="112" height="112" rx="45" fill="#F7D5B8"/>
      <g id="Bugi-Spiky-Coral-Hair" transform="translate(0, -142) rotate(${k.hairFollowDeg}) scale(1, ${k.hairStretchY}) translate(0, 142)">
        <path d="M -60 -134 C -80 -176 -42 -188 -30 -168 C -24 -212 10 -208 16 -170 C 34 -206 72 -190 54 -152 C 80 -156 78 -124 56 -118 C 30 -144 -28 -144 -60 -134 Z" fill="#FF6B50"/>
      </g>
      <ellipse cx="${-21 + k.pupilOffsetX}" cy="${-108 + k.pupilOffsetY}" rx="13" ry="16" fill="#09131C" stroke="none"/>
      <circle cx="${-25 + k.pupilOffsetX}" cy="${-114 + k.pupilOffsetY}" r="4.5" fill="#FFF7E9" stroke="none"/>
      <ellipse cx="${21 + k.pupilOffsetX}" cy="${-108 + k.pupilOffsetY}" rx="13" ry="16" fill="#09131C" stroke="none"/>
      <circle cx="${17 + k.pupilOffsetX}" cy="${-114 + k.pupilOffsetY}" r="4.5" fill="#FFF7E9" stroke="none"/>
    </g>
  </g>
</svg>`;
}

/**
 * Componente SVG Reutilizável da Figura Multi-Articulada do Bugi
 * Usado tanto pelo BugiSceneStage quanto pelo BugiRemotionCharacter.
 */
export const BugiArticulatedSvgFigure: React.FC<{
  kinematics: BugiArticulatedKinematics;
}> = ({ kinematics: k }) => {
  const reactiveRy = Math.round(7 + k.mouthOpenness * 9);

  return (
    <g id="Bugi-MultiJoint-Character">
      {/* Ondas de Choque no Impacto */}
      {k.impactShockwave && k.shockwaveOpacity > 0.05 && (
        <g opacity={k.shockwaveOpacity}>
          <ellipse
            cx={k.rootX}
            cy={k.groundY}
            rx={k.shockwaveRadius}
            ry={k.shockwaveRadius * 0.26}
            fill="none"
            stroke="#FF6B50"
            strokeWidth="5"
            strokeDasharray="12 8"
          />
          <ellipse
            cx={k.rootX}
            cy={k.groundY}
            rx={k.shockwaveRadius * 0.7}
            ry={k.shockwaveRadius * 0.18}
            fill="none"
            stroke="#FFD166"
            strokeWidth="4"
          />
        </g>
      )}

      {/* Poste/Hidrante Fixo de Ancoragem para o Beat 4 (7–10s: grabbing_stretch) */}
      {(k.state === 'grabbing_stretch' || k.pose === 'agarrando_objeto') && k.grabAnchorPoint && (
        <g id="Fixed-Street-Anchor-Post">
          <rect
            x={k.grabAnchorPoint.x - 16}
            y={k.grabAnchorPoint.y + 198}
            width="32"
            height="18"
            rx="4"
            fill="#1E3F5A"
            stroke="#060D14"
            strokeWidth="4"
          />
          <line
            x1={k.grabAnchorPoint.x}
            y1={k.grabAnchorPoint.y - 45}
            x2={k.grabAnchorPoint.x}
            y2={k.groundY}
            stroke="#060D14"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <line
            x1={k.grabAnchorPoint.x}
            y1={k.grabAnchorPoint.y - 45}
            x2={k.grabAnchorPoint.x}
            y2={k.groundY}
            stroke="#FFD166"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <circle
            cx={k.grabAnchorPoint.x}
            cy={k.grabAnchorPoint.y}
            r="14"
            fill="#FF6B50"
            stroke="#060D14"
            strokeWidth="4"
          />
          {k.stretchTensionLines && (
            <g stroke="#FFD166" strokeWidth="3.5" strokeDasharray="8 6">
              <line
                x1={k.grabAnchorPoint.x + 18}
                y1={k.grabAnchorPoint.y - 18}
                x2={k.rootX - 45}
                y2={k.rootY - 35}
              />
              <line
                x1={k.grabAnchorPoint.x + 18}
                y1={k.grabAnchorPoint.y + 18}
                x2={k.rootX - 45}
                y2={k.rootY + 5}
              />
            </g>
          )}
          {k.hasLostGrip && (
            <g transform={`translate(${k.grabAnchorPoint.x + 28}, ${k.grabAnchorPoint.y - 16})`}>
              <circle cx="0" cy="0" r="22" fill="#FF6B50" opacity="0.28" />
              <line x1="-18" y1="-12" x2="-32" y2="-24" stroke="#FFD166" strokeWidth="4" />
              <line x1="0" y1="-18" x2="4" y2="-34" stroke="#39C8D5" strokeWidth="4" />
              <line x1="16" y1="-10" x2="32" y2="-20" stroke="#FF6B50" strokeWidth="4" />
            </g>
          )}
        </g>
      )}

      {/* Sombra Dinâmica no Solo (Y = 685) */}
      <ellipse
        cx={k.rootX}
        cy={k.groundY + 4}
        rx={k.pose === 'flutuando' || k.pose === 'pulando' ? 42 : 76 * k.squashX}
        ry={13}
        fill="#050B11"
        opacity="0.62"
      />

      {/* Raiz do Corpo (Pelvis/Torso) */}
      <g
        transform={`translate(${k.rootX}, ${k.rootY}) rotate(${k.torsoRotation}) scale(${k.squashX}, ${k.stretchY})`}
        stroke="#060D14"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. BRAÇO ESQUERDO (TRASEIRO): Ombro -> Cotovelo -> Punho -> Mão */}
        <g id="Left-Arm-Chain">
          <line
            x1={k.leftShoulder.x}
            y1={k.leftShoulder.y}
            x2={k.leftElbow.x}
            y2={k.leftElbow.y}
            stroke="#060D14"
            strokeWidth="27"
          />
          <line
            x1={k.leftShoulder.x}
            y1={k.leftShoulder.y}
            x2={k.leftElbow.x}
            y2={k.leftElbow.y}
            stroke="#0E1F2E"
            strokeWidth="18"
          />
          <line
            x1={k.leftElbow.x}
            y1={k.leftElbow.y}
            x2={k.leftWrist.x}
            y2={k.leftWrist.y}
            stroke="#060D14"
            strokeWidth="25"
          />
          <line
            x1={k.leftElbow.x}
            y1={k.leftElbow.y}
            x2={k.leftWrist.x}
            y2={k.leftWrist.y}
            stroke="#122638"
            strokeWidth="16"
          />
          {/* Punho ciano + Mão cartoon com polegar */}
          <g transform={`translate(${k.leftWrist.x}, ${k.leftWrist.y}) rotate(${k.leftWrist.handAngleDeg})`}>
            <circle cx="0" cy="0" r="11.5" fill="#F7D5B8" stroke="#060D14" strokeWidth="4" />
            <circle cx="-8" cy="-3" r="5" fill="#F7D5B8" stroke="#060D14" strokeWidth="3.5" />
          </g>
        </g>

        {/* 2. PERNA ESQUERDA (TRASEIRA): Quadril -> Joelho -> Tornozelo -> Tênis */}
        <g id="Left-Leg-Chain">
          <line
            x1={k.leftHip.x}
            y1={k.leftHip.y}
            x2={k.leftKnee.x}
            y2={k.leftKnee.y}
            stroke="#060D14"
            strokeWidth="30"
          />
          <line
            x1={k.leftHip.x}
            y1={k.leftHip.y}
            x2={k.leftKnee.x}
            y2={k.leftKnee.y}
            stroke="#0A1520"
            strokeWidth="21"
          />
          <line
            x1={k.leftKnee.x}
            y1={k.leftKnee.y}
            x2={k.leftAnkle.x}
            y2={k.leftAnkle.y}
            stroke="#060D14"
            strokeWidth="28"
          />
          <line
            x1={k.leftKnee.x}
            y1={k.leftKnee.y}
            x2={k.leftAnkle.x}
            y2={k.leftAnkle.y}
            stroke="#0D1B2A"
            strokeWidth="19"
          />
          {/* Tênis Esquerdo */}
          <g transform={`translate(${k.leftFoot.x}, ${k.leftFoot.y}) rotate(${k.leftFoot.rotDeg})`}>
            <path
              d="M -4 -8 L 36 -8 Q 52 -6 52 10 L -8 10 Q -12 2 -4 -8 Z"
              fill="#FFF7E9"
              stroke="#060D14"
              strokeWidth="4.2"
            />
            <line x1="-6" y1="11" x2="50" y2="11" stroke="#FF6B50" strokeWidth="6" />
            <line x1="14" y1="-6" x2="22" y2="-1" stroke="#39C8D5" strokeWidth="3" />
          </g>
        </g>

        {/* 3. PERNA DIREITA (FRONTAL): Quadril -> Joelho -> Tornozelo -> Tênis */}
        <g id="Right-Leg-Chain">
          <line
            x1={k.rightHip.x}
            y1={k.rightHip.y}
            x2={k.rightKnee.x}
            y2={k.rightKnee.y}
            stroke="#060D14"
            strokeWidth="30"
          />
          <line
            x1={k.rightHip.x}
            y1={k.rightHip.y}
            x2={k.rightKnee.x}
            y2={k.rightKnee.y}
            stroke="#0A1520"
            strokeWidth="21"
          />
          <line
            x1={k.rightKnee.x}
            y1={k.rightKnee.y}
            x2={k.rightAnkle.x}
            y2={k.rightAnkle.y}
            stroke="#060D14"
            strokeWidth="28"
          />
          <line
            x1={k.rightKnee.x}
            y1={k.rightKnee.y}
            x2={k.rightAnkle.x}
            y2={k.rightAnkle.y}
            stroke="#0F2032"
            strokeWidth="19"
          />
          {/* Tênis Direito */}
          <g transform={`translate(${k.rightFoot.x}, ${k.rightFoot.y}) rotate(${k.rightFoot.rotDeg})`}>
            <path
              d="M -4 -8 L 38 -8 Q 54 -6 54 10 L -8 10 Q -12 2 -4 -8 Z"
              fill="#FFF7E9"
              stroke="#060D14"
              strokeWidth="4.2"
            />
            <line x1="-6" y1="11" x2="52" y2="11" stroke="#FF6B50" strokeWidth="6" />
            <line x1="16" y1="-6" x2="24" y2="-1" stroke="#39C8D5" strokeWidth="3" />
          </g>
        </g>

        {/* 4. TRONCO: Jaqueta Azul-Petróleo (#122638) + Camiseta Creme (#FFF7E9) */}
        <g id="Torso-Jacket">
          <rect x="-50" y="-44" width="100" height="118" rx="28" fill="#122638" />
          <path d="M -23 -42 L 23 -42 L 18 73 L -18 73 Z" fill="#FFF7E9" />
          <path d="M -24 -42 L -18 72 M 24 -42 L 18 72" stroke="#39C8D5" strokeWidth="4" />
          {/* Gola esportiva da jaqueta */}
          <path d="M -32 -44 L -16 -28 L -6 -44 M 32 -44 L 16 -28 L 6 -44" fill="#18344C" />
          {/* Emblema amarelo no peito */}
          <circle cx="0" cy="4" r="9.5" fill="#FFD166" stroke="#060D14" strokeWidth="3.2" />
          <circle cx="0" cy="4" r="3" fill="#FF6B50" stroke="none" />
        </g>

        {/* 5. BRAÇO DIREITO (FRONTAL): Ombro -> Cotovelo -> Punho -> Mão */}
        <g id="Right-Arm-Chain">
          <line
            x1={k.rightShoulder.x}
            y1={k.rightShoulder.y}
            x2={k.rightElbow.x}
            y2={k.rightElbow.y}
            stroke="#060D14"
            strokeWidth="27"
          />
          <line
            x1={k.rightShoulder.x}
            y1={k.rightShoulder.y}
            x2={k.rightElbow.x}
            y2={k.rightElbow.y}
            stroke="#122638"
            strokeWidth="18"
          />
          <line
            x1={k.rightElbow.x}
            y1={k.rightElbow.y}
            x2={k.rightWrist.x}
            y2={k.rightWrist.y}
            stroke="#060D14"
            strokeWidth="25"
          />
          <line
            x1={k.rightElbow.x}
            y1={k.rightElbow.y}
            x2={k.rightWrist.x}
            y2={k.rightWrist.y}
            stroke="#173147"
            strokeWidth="16"
          />
          <g transform={`translate(${k.rightWrist.x}, ${k.rightWrist.y}) rotate(${k.rightWrist.handAngleDeg})`}>
            <circle cx="0" cy="0" r="11.5" fill="#F7D5B8" stroke="#060D14" strokeWidth="4" />
            <circle cx="8" cy="-3" r="5" fill="#F7D5B8" stroke="#060D14" strokeWidth="3.5" />
          </g>
        </g>

        {/* 6. PESCOÇO, CABEÇA, CABELO COM FOLLOW-THROUGH, OLHOS E EXPRESSÕES */}
        <g
          id="Neck-And-Head"
          transform={`translate(0, ${k.headOffsetY}) rotate(${k.headRotationDeg})`}
        >
          {/* Pescoço */}
          <rect x="-15" y="-60" width="30" height="25" rx="10" fill="#F4C9A8" />
          {/* Orelhas */}
          <circle cx="-58" cy="-106" r="12" fill="#F4C9A8" />
          <circle cx="58" cy="-106" r="12" fill="#F4C9A8" />
          {/* Rosto Arredondado */}
          <rect x="-56" y="-164" width="112" height="112" rx="45" fill="#F7D5B8" />
          {/* Bochechas sutis */}
          <ellipse cx="-35" cy="-86" rx="9" ry="5" fill="#FF6B50" opacity="0.28" stroke="none" />
          <ellipse cx="35" cy="-86" rx="9" ry="5" fill="#FF6B50" opacity="0.28" stroke="none" />

          {/* Cabelo Coral Espetado (#FF6B50) com Pivô de Follow-Through Secundário */}
          <g
            id="Spiky-Coral-Hair"
            transform={`translate(0, -142) rotate(${k.hairFollowDeg}) scale(1, ${k.hairStretchY}) translate(0, 142)`}
          >
            <path
              d="M -60 -134 C -82 -176 -44 -188 -32 -168 C -26 -212 10 -208 16 -170 C 34 -206 72 -190 54 -152 C 80 -156 78 -124 56 -118 C 30 -144 -28 -144 -60 -134 Z"
              fill="#FF6B50"
            />
            {/* Brilho vetorial no cabelo coral */}
            <path
              d="M -24 -168 Q -8 -188 10 -168"
              stroke="#FFD166"
              strokeWidth="3.5"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* Olhos Pretos Grandes e Expressivos */}
          {k.isBlinking ? (
            <>
              <path d="M -35 -106 Q -22 -100 -9 -106" stroke="#09131C" strokeWidth="5" fill="none" />
              <path d="M 9 -106 Q 22 -100 35 -106" stroke="#09131C" strokeWidth="5" fill="none" />
            </>
          ) : (
            <g transform={`translate(0, -108) scale(${k.eyeScaleX}, ${k.eyeScaleY}) translate(0, 108)`}>
              <ellipse
                cx={-22 + k.pupilOffsetX}
                cy={-108 + k.pupilOffsetY}
                rx="13.5"
                ry="16"
                fill="#09131C"
                stroke="none"
              />
              <circle
                cx={-26 + k.pupilOffsetX}
                cy={-114 + k.pupilOffsetY}
                r="4.8"
                fill="#FFF7E9"
                stroke="none"
              />
              <circle
                cx={-17 + k.pupilOffsetX}
                cy={-102 + k.pupilOffsetY}
                r="2.2"
                fill="#39C8D5"
                stroke="none"
              />

              <ellipse
                cx={22 + k.pupilOffsetX}
                cy={-108 + k.pupilOffsetY}
                rx="13.5"
                ry="16"
                fill="#09131C"
                stroke="none"
              />
              <circle
                cx={18 + k.pupilOffsetX}
                cy={-114 + k.pupilOffsetY}
                r="4.8"
                fill="#FFF7E9"
                stroke="none"
              />
              <circle
                cx={27 + k.pupilOffsetX}
                cy={-102 + k.pupilOffsetY}
                r="2.2"
                fill="#39C8D5"
                stroke="none"
              />
            </g>
          )}

          {/* Sobrancelhas Articuladas Independentes */}
          <g transform={`translate(-22, ${-132 + k.browOffsetY}) rotate(${k.leftBrowDeg})`}>
            <path d="M -14 0 Q 0 -7 14 0" stroke="#060D14" strokeWidth="4.8" fill="none" />
          </g>
          <g transform={`translate(22, ${-132 + k.browOffsetY}) rotate(${k.rightBrowDeg})`}>
            <path d="M -14 0 Q 0 -7 14 0" stroke="#060D14" strokeWidth="4.8" fill="none" />
          </g>

          {/* Gotas de Suor para Microexpressão de Desespero (7–10s) */}
          {(k.sweatDrops || k.expression === 'desespero') && (
            <g id="Despair-Sweat-Drops">
              <path
                d="M -64 -132 Q -72 -118 -64 -110 Q -56 -118 -64 -132 Z"
                fill="#39C8D5"
                stroke="#060D14"
                strokeWidth="2.5"
              />
              <path
                d="M 64 -126 Q 72 -112 64 -104 Q 56 -112 64 -126 Z"
                fill="#39C8D5"
                stroke="#060D14"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Boca e Expressões */}
          {k.mouthShape === 'open_o' ? (
            <>
              <ellipse cx="0" cy="-74" rx="11.5" ry={reactiveRy} fill="#09131C" stroke="#060D14" strokeWidth="3.5" />
              <ellipse cx="0" cy="-68" rx="6.5" ry="5" fill="#FF6B50" stroke="none" />
            </>
          ) : k.mouthShape === 'panic_wave' ? (
            <>
              <path
                d="M -18 -72 Q 0 -86 18 -72 Q 22 -56 0 -62 Q -22 -56 -18 -72 Z"
                fill="#09131C"
                stroke="#060D14"
                strokeWidth="3.5"
              />
              <path
                d="M 52 -135 Q 60 -122 52 -115 Q 44 -122 52 -135 Z"
                fill="#39C8D5"
                stroke="#060D14"
                strokeWidth="2.5"
              />
            </>
          ) : k.mouthShape === 'grin' ? (
            <path
              d="M -17 -78 L 17 -78 Q 15 -58 0 -58 Q -15 -58 -17 -78 Z"
              fill="#FF6B50"
              stroke="#060D14"
              strokeWidth="3.5"
            />
          ) : k.mouthShape === 'determined' ? (
            <path d="M -14 -72 Q 0 -78 14 -72" stroke="#060D14" strokeWidth="4.5" fill="none" />
          ) : (
            <path d="M -15 -76 Q 0 -62 17 -76" stroke="#060D14" strokeWidth="4.5" fill="none" />
          )}

          {/* Estrelinhas de Recuperação Cômica após Impacto */}
          {(k.recoveryStars || k.expression === 'comico') && (
            <g transform="translate(0, -215)">
              <circle cx="-36" cy="0" r="6" fill="#FFD166" stroke="#060D14" strokeWidth="2.5" />
              <circle cx="0" cy="-10" r="7.5" fill="#39C8D5" stroke="#060D14" strokeWidth="2.5" />
              <circle cx="36" cy="0" r="6" fill="#FF6B50" stroke="#060D14" strokeWidth="2.5" />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

export const BugiSceneStage: React.FC<BugiSceneStageProps> = ({
  pose,
  expression,
  stateOverride,
  scenario = 'calcada_urbana',
  customBackgroundUrl,
  showPhysicsVectors = true,
  subtitlePreview,
  timerSeconds = 5,
  aspectRatio = '9:16',
  frame = 0,
  fps = 30,
  speechIntensity = 0.25,
  className = '',
}) => {
  const k = computeBugiArticulatedKinematics(
    pose,
    frame,
    fps,
    speechIntensity,
    expression,
    stateOverride
  );

  const renderScenarioBackground = () => {
    if (customBackgroundUrl) {
      return (
        <g id="Custom-AI-Scenario-Background">
          <rect width="540" height="960" fill="#0B1926" />
          <image
            href={customBackgroundUrl}
            x="0"
            y="0"
            width="540"
            height="960"
            preserveAspectRatio="xMidYMid slice"
          />
          <line
            x1="0"
            y1="685"
            x2="540"
            y2="685"
            stroke="#39C8D5"
            strokeWidth="4"
            opacity="0.85"
          />
        </g>
      );
    }

    switch (scenario) {
      case 'laboratorio_bugi':
        return (
          <g id="Scenario-Lab">
            <rect width="540" height="960" fill="#091520" />
            {/* Prateleiras e equipamento de laboratório */}
            <rect x="35" y="130" width="470" height="240" rx="18" fill="#122638" stroke="#39C8D5" strokeWidth="3.5" />
            <text x="65" y="185" fill="#39C8D5" fontFamily="JetBrains Mono, monospace" fontSize="19" fontWeight="700">
              F_atrito = μ · N → 0.00 N
            </text>
            <path d="M 65 230 Q 155 185 245 250 T 435 215" stroke="#FFD166" strokeWidth="3.5" strokeDasharray="6 6" fill="none" />
            <rect x="65" y="430" width="130" height="255" rx="10" fill="#152C40" />
            <rect x="355" y="450" width="120" height="235" rx="10" fill="#152C40" />
            <rect y="685" width="540" height="275" fill="#102232" />
            <line x1="0" y1="685" x2="540" y2="685" stroke="#39C8D5" strokeWidth="5" />
          </g>
        );
      case 'parque_gravidade':
        return (
          <g id="Scenario-Park">
            <rect width="540" height="960" fill="#0D2133" />
            <circle cx="430" cy="155" r="46" fill="#FFD166" opacity="0.9" />
            <path d="M 0 685 Q 140 590 290 685 T 540 660 L 540 685 Z" fill="#123246" />
            <rect x="82" y="490" width="22" height="195" rx="8" fill="#1E2F3D" />
            <circle cx="93" cy="455" r="68" fill="#184E5A" stroke="#39C8D5" strokeWidth="3" />
            <rect x="425" y="510" width="20" height="175" rx="8" fill="#1E2F3D" />
            <circle cx="435" cy="480" r="56" fill="#184E5A" stroke="#39C8D5" strokeWidth="3" />
            <rect y="685" width="540" height="275" fill="#122638" />
            <line x1="0" y1="685" x2="540" y2="685" stroke="#FFD166" strokeWidth="5" />
          </g>
        );
      case 'cozinha_caos':
        return (
          <g id="Scenario-Kitchen">
            <rect width="540" height="960" fill="#101F2E" />
            <rect x="36" y="470" width="468" height="215" rx="12" fill="#173147" stroke="#39C8D5" strokeWidth="3" />
            <rect y="685" width="540" height="275" fill="#122638" />
            <line x1="0" y1="685" x2="540" y2="685" stroke="#FF6B50" strokeWidth="5" />
          </g>
        );
      case 'cruzamento_transito':
      case 'calcada_urbana':
      default:
        return (
          <g id="Scenario-Urban-Sidewalk-Illustrated">
            {/* Camada 1: Céu profundo + Silhueta urbana distante */}
            <rect width="540" height="960" fill="#091622" />
            <circle cx="445" cy="145" r="38" fill="#FFD166" opacity="0.88" />
            <rect x="10" y="290" width="95" height="395" fill="#0D1E2E" />
            <rect x="115" y="240" width="110" height="445" fill="#0E2233" />
            <rect x="350" y="260" width="120" height="425" fill="#0D1E2E" />

            {/* Camada 2: Prédios ilustrados com janelas acesas, toldos corais e árvores */}
            <rect x="28" y="210" width="146" height="475" rx="10" fill="#122638" stroke="#1D3B54" strokeWidth="2.5" />
            {/* Janelas iluminadas */}
            <rect x="48" y="240" width="28" height="36" rx="4" fill="#FFD166" opacity="0.85" />
            <rect x="92" y="240" width="28" height="36" rx="4" fill="#FFF7E9" opacity="0.7" />
            <rect x="48" y="295" width="28" height="36" rx="4" fill="#39C8D5" opacity="0.55" />
            <rect x="92" y="295" width="28" height="36" rx="4" fill="#FFD166" opacity="0.85" />
            {/* Toldo listrado coral e creme */}
            <path d="M 22 545 L 180 545 L 172 575 L 14 575 Z" fill="#FF6B50" stroke="#060D14" strokeWidth="2.5" />

            <rect x="195" y="160" width="168" height="525" rx="10" fill="#152C40" stroke="#1D3B54" strokeWidth="2.5" />
            <rect x="220" y="195" width="34" height="42" rx="4" fill="#FFF7E9" opacity="0.75" />
            <rect x="272" y="195" width="34" height="42" rx="4" fill="#FFD166" opacity="0.85" />
            <rect x="220" y="255" width="34" height="42" rx="4" fill="#FFD166" opacity="0.8" />
            <rect x="272" y="255" width="34" height="42" rx="4" fill="#39C8D5" opacity="0.6" />

            {/* Árvore de calçada estilizada */}
            <rect x="386" y="515" width="18" height="170" rx="6" fill="#1E2F3D" />
            <circle cx="395" cy="488" r="52" fill="#184E5A" stroke="#39C8D5" strokeWidth="3" />
            <circle cx="372" cy="505" r="36" fill="#1D5E6C" />

            {/* Camada 3: Objeto Interativo Placa μ = 0 + Cone */}
            <line x1="468" y1="450" x2="468" y2="685" stroke="#39C8D5" strokeWidth="6" />
            <rect x="432" y="400" width="72" height="52" rx="10" fill="#FFD166" stroke="#060D14" strokeWidth="4" />
            <text
              x="468"
              y="433"
              textAnchor="middle"
              fill="#08121B"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="21"
            >
              μ = 0
            </text>

            {/* Camada 4: Calçada ladrilhada em perspectiva + Reflexo escorregadio ciano */}
            <rect y="685" width="540" height="275" fill="#122638" />
            <rect y="685" width="540" height="22" fill="#1A354D" />
            <line x1="0" y1="685" x2="540" y2="685" stroke="#39C8D5" strokeWidth="5.5" />
            <path
              d="M 40 725 L 500 725 M 85 758 L 455 758"
              stroke="#39C8D5"
              strokeWidth="3.5"
              strokeDasharray="22 14"
              opacity="0.82"
            />
          </g>
        );
    }
  };

  const viewBox =
    aspectRatio === '16:9'
      ? '0 180 540 340'
      : aspectRatio === '1:1'
      ? '0 180 540 540'
      : '0 0 540 960';

  return (
    <div
      className={`relative overflow-hidden bg-[#08121b] select-none ${className}`}
      data-testid="bugi-scene-stage"
    >
      <svg
        viewBox={viewBox}
        className="w-full h-full block"
        role="img"
        aria-label={`Cena 2D do personagem Bugi com pose ${pose} e expressão ${expression}`}
      >
        {renderScenarioBackground()}

        {/* HUD Superior de Regra Física Bugada */}
        {aspectRatio === '9:16' && (
          <g id="Top-Physics-Rule-HUD" transform="translate(36, 42)">
            <rect
              width="468"
              height="64"
              rx="16"
              fill="#08121B"
              fillOpacity="0.88"
              stroke="#39C8D5"
              strokeWidth="2.5"
            />
            <text
              x="24"
              y="28"
              fill="#39C8D5"
              fontFamily="JetBrains Mono, monospace"
              fontSize="13"
              fontWeight="600"
            >
              REGRA ALTERADA · E SE BUGASSE?
            </text>
            <text
              x="24"
              y="49"
              fill="#FFF7E9"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontSize="16"
              fontWeight="700"
            >
              {scenario === 'parque_gravidade' || pose === 'flutuando' || pose === 'pulando'
                ? 'Gravidade = 4.9 m/s² · Salto Lunar'
                : scenario === 'laboratorio_bugi'
                ? 'Física Experimental · Laboratório Bugi'
                : 'Atrito = 0.00 μ · Inércia em Ação'}
            </text>
            <rect x="372" y="12" width="82" height="40" rx="10" fill="#FF6B50" />
            <text
              x="413"
              y="38"
              textAnchor="middle"
              fill="#FFF7E9"
              fontFamily="JetBrains Mono, monospace"
              fontSize="18"
              fontWeight="700"
            >
              0{timerSeconds}.0s
            </text>
          </g>
        )}

        {/* Vetores Físicos e Linhas de Movimento */}
        {showPhysicsVectors && k.motionLines && (
          <g id="Physics-Vectors">
            <path
              d="M 68 648 L 182 648"
              stroke="#FFD166"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
            <path
              d="M 355 665 L 475 665"
              stroke="#39C8D5"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <polygon points="475,656 495,665 475,674" fill="#39C8D5" />
            <text
              x="415"
              y="646"
              textAnchor="middle"
              fill="#39C8D5"
              fontFamily="JetBrains Mono, monospace"
              fontSize="15"
              fontWeight="600"
            >
              v = constante (Inércia)
            </text>
          </g>
        )}

        {/* RIG MULTI-ARTICULADO CANÔNICO DO BUGI */}
        <BugiArticulatedSvgFigure kinematics={k} />

        {/* Legenda Dinâmica Estilo Shorts na Zona Segura Inferior */}
        {aspectRatio === '9:16' && subtitlePreview && (
          <g id="Shorts-Safe-Zone-Subtitles" transform="translate(28, 765)">
            <rect
              width="484"
              height="122"
              rx="18"
              fill="#08121B"
              fillOpacity="0.92"
              stroke="#FFD166"
              strokeWidth="2.5"
            />
            <foreignObject x="18" y="14" width="448" height="96">
              <div className="w-full h-full flex items-center justify-center text-center font-display font-bold text-[#FFF7E9] text-[19px] leading-snug">
                {subtitlePreview}
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
};
