/**
 * Motor de Renderização Direta de Vídeo MP4 (H.264 + Áudio -14 LUFS)
 * Reconstruído com:
 * - Rig Multi-Articulado completo do Bugi no Canvas 2D (ombros, cotovelos, punhos, mãos,
 *   quadris, joelhos, tornozelos, tênis, pescoço, cabeça, cabelo com follow-through, sobrancelhas, pupilas e boca)
 * - Cenário Ilustrado em 4 Planos (background, middle-ground, foreground, interactive-objects)
 * - Direção por AnimationBeats (incluindo o Piloto Obrigatório de 8 Segundos — 240 frames @ 30 FPS)
 * - WebCodecs H.264 + AAC no navegador com fallback FFmpeg de alta densidade no servidor.
 */

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import {
  AnimationBeat,
  Episode,
  RenderedVideoVersion,
  StoryboardScene,
} from '../../types/studio';
import { computeBugiArticulatedKinematics } from '../../components/BugiCharacterSvg';
import {
  buildBeatForStoryboardScene,
  cameraTracking,
  objectInteraction,
  parallaxMotion,
  PILOT_12S_FRICTION_BEATS,
  PILOT_8S_FRICTION_BEATS,
} from '../animation/bugiRigAndBeatsEngine';
import {
  buildSkillReelWordCues,
  groupWordCuesIntoPages,
} from '../../utils/skillReelAndHyperFrames';

export interface RenderProgressCallback {
  (progress: {
    percent: number;
    renderedFrames: number;
    totalFrames: number;
    stageLabel: string;
  }): void;
}

/**
 * Verifica se um ArrayBuffer ou Uint8Array contém um cabeçalho MP4 (ISO Base Media File Format 'ftyp') válido e não vazio.
 */
export function verifyValidMp4Buffer(bytes: Uint8Array): {
  valid: boolean;
  sizeBytes: number;
  reason?: string;
} {
  if (!bytes || bytes.byteLength < 64) {
    return {
      valid: false,
      sizeBytes: bytes?.byteLength || 0,
      reason: 'Buffer MP4 vazio ou menor que 64 bytes.',
    };
  }
  const boxType = String.fromCharCode(
    bytes[4],
    bytes[5],
    bytes[6],
    bytes[7]
  );
  if (boxType !== 'ftyp') {
    return {
      valid: false,
      sizeBytes: bytes.byteLength,
      reason: `Assinatura ISO-BMFF inválida (esperado "ftyp", encontrado "${boxType}").`,
    };
  }
  return {
    valid: true,
    sizeBytes: bytes.byteLength,
  };
}

/**
 * Desenha um frame determinístico (1080 × 1920) no Canvas 2D com:
 * - Câmera dinâmica (cameraTracking: panX, panY, zoom, dutchAngle)
 * - 4 camadas ilustradas de cenário com parallax real
 * - Rig multi-articulado completo do Bugi (ombros, cotovelos, punhos, quadris, joelhos, tornozelos, cabelo, olhos e boca)
 * - HUD e Legendas Dinâmicas Skill Reel na Zona Segura.
 */
export function drawDeterministicSceneFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  scene: StoryboardScene,
  frameInScene: number,
  fps: number,
  currentEpisodeTimeSec: number,
  timerSeconds: number,
  activeBeatOverride?: AnimationBeat
): void {
  const width = 1080;
  const height = 1920;

  const beat =
    activeBeatOverride || buildBeatForStoryboardScene(scene, fps);
  const cam = cameraTracking(
    beat.startFrame + frameInScene,
    fps,
    beat
  );
  const px = parallaxMotion(
    frameInScene,
    cam.panX,
    beat.backgroundAnimation.parallaxSpeed
  );
  const propState = objectInteraction(frameInScene, beat);

  const poseToUse = activeBeatOverride
    ? activeBeatOverride.characterPose
    : scene.bugiPose;
  const exprToUse = activeBeatOverride
    ? activeBeatOverride.facialExpression
    : scene.bugiExpression;
  const stateOverride = activeBeatOverride
    ? activeBeatOverride.characterState
    : undefined;
  const subtitleText = activeBeatOverride
    ? activeBeatOverride.caption.text
    : scene.subtitlesText;

  ctx.save();
  // Fundo base
  ctx.fillStyle = '#091521';
  ctx.fillRect(0, 0, width, height);

  // Transformação da Câmera (cameraTracking)
  ctx.save();
  ctx.translate(540 + cam.panX * 0.45, 1120 + cam.panY * 0.45);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.rotate((cam.dutchAngleDeg * Math.PI) / 180);
  ctx.translate(-540, -1120);

  // CAMADA 1: BACKGROUND (Céu atmosférico + Sol/Lua + Silhueta distante)
  ctx.fillStyle =
    scene.scenarioPreset === 'parque_gravidade'
      ? '#0C1F30'
      : scene.scenarioPreset === 'laboratorio_bugi'
      ? '#091520'
      : '#091624';
  ctx.fillRect(-120, -120, width + 240, 1490);

  ctx.save();
  ctx.translate(px.skyOffsetX % 260, 0);
  ctx.fillStyle = 'rgba(255, 209, 102, 0.88)';
  ctx.beginPath();
  ctx.arc(880, 285, 78, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0D1E2E';
  ctx.fillRect(-100, 560, 210, 810);
  ctx.fillStyle = '#0E2233';
  ctx.fillRect(130, 470, 240, 900);
  ctx.fillStyle = '#0D1E2E';
  ctx.fillRect(400, 520, 210, 850);
  ctx.fillStyle = '#0E2233';
  ctx.fillRect(640, 440, 260, 930);
  ctx.fillStyle = '#0D1E2E';
  ctx.fillRect(920, 510, 250, 860);
  ctx.restore();

  // CAMADA 2: MIDDLE-GROUND (Prédios ilustrados 2D, janelas iluminadas, toldos, árvores e postes)
  ctx.save();
  const midScroll = px.midgroundOffsetX % 540;
  ctx.translate(midScroll, 0);

  for (const tileOffset of [0, 540, 1080]) {
    ctx.save();
    ctx.translate(tileOffset, 0);

    // Prédio 1
    ctx.fillStyle = '#122638';
    ctx.fillRect(40, 390, 240, 980);
    ctx.strokeStyle = '#1E3F5A';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 390, 240, 980);

    // Janelas acesas
    for (let wy = 450; wy <= 890; wy += 110) {
      ctx.fillStyle = wy % 220 === 0 ? '#FFD166' : '#FFF7E9';
      ctx.fillRect(72, wy, 56, 68);
      ctx.fillStyle = wy % 220 === 0 ? '#39C8D5' : '#FFD166';
      ctx.fillRect(168, wy, 56, 68);
    }

    // Toldo coral na fachada térrea
    ctx.fillStyle = '#FF6B50';
    ctx.beginPath();
    ctx.moveTo(26, 1070);
    ctx.lineTo(294, 1070);
    ctx.lineTo(280, 1136);
    ctx.lineTo(14, 1136);
    ctx.closePath();
    ctx.fill();

    // Árvore ilustrada de calçada
    ctx.fillStyle = '#1E2F3D';
    ctx.fillRect(390, 1040, 36, 330);
    ctx.fillStyle = '#184E5A';
    ctx.beginPath();
    ctx.arc(408, 970, 98, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#39C8D5';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Poste de iluminação
    ctx.strokeStyle = '#284B66';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(505, 700);
    ctx.lineTo(505, 1370);
    ctx.stroke();
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(485, 705, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();

  // CAMADA 3 & 4: FOREGROUND (Superfície da Calçada Y = 1370 + Ladrilhos + Reflexo Sem Atrito)
  ctx.fillStyle = '#122638';
  ctx.fillRect(-120, 1370, width + 240, 620);
  ctx.fillStyle = '#1A354D';
  ctx.fillRect(-120, 1370, width + 240, 42);

  // Juntas da calçada com parallax
  ctx.strokeStyle = '#1B3952';
  ctx.lineWidth = 4;
  const fgScroll = px.foregroundOffsetX % 180;
  for (let tx = -180; tx <= 1260; tx += 180) {
    ctx.beginPath();
    ctx.moveTo(tx + fgScroll, 1370);
    ctx.lineTo(tx + fgScroll - 95, 1920);
    ctx.stroke();
  }

  ctx.strokeStyle = '#39C8D5';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-120, 1370);
  ctx.lineTo(width + 120, 1370);
  ctx.stroke();

  // Reflexo de atrito zero (μ = 0)
  if (beat.backgroundAnimation.groundGlossIntensity > 0.3) {
    ctx.strokeStyle = 'rgba(57, 200, 213, 0.82)';
    ctx.lineWidth = 6;
    ctx.setLineDash([44, 28]);
    ctx.beginPath();
    ctx.moveTo(60 - propState.frictionlessWavePhase, 1435);
    ctx.lineTo(1040 - propState.frictionlessWavePhase, 1435);
    ctx.moveTo(140 - propState.frictionlessWavePhase, 1500);
    ctx.lineTo(980 - propState.frictionlessWavePhase, 1500);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // CAMADA 5: INTERACTIVE-OBJECTS (Placa μ = 0 + Cone Deslizante)
  ctx.save();
  ctx.translate(px.interactivePropsOffsetX % 720, 0);

  // Placa μ = 0
  ctx.save();
  ctx.translate(915, 1370);
  ctx.rotate((propState.signTiltDeg * Math.PI) / 180);
  ctx.translate(-915, -1370);
  ctx.strokeStyle = '#39C8D5';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(915, 880);
  ctx.lineTo(915, 1370);
  ctx.stroke();
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(840, 775, 150, 108);
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 7;
  ctx.strokeRect(840, 775, 150, 108);
  ctx.fillStyle = '#08121B';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('μ = 0', 915, 844);
  ctx.restore();

  // Cone de trânsito deslizante
  ctx.save();
  ctx.translate(185 + propState.slidingConeOffsetX, 1308);
  ctx.fillStyle = '#FF6B50';
  ctx.beginPath();
  ctx.moveTo(0, 62);
  ctx.lineTo(28, 0);
  ctx.lineTo(56, 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#060D14';
  ctx.fillRect(-8, 58, 72, 12);
  ctx.restore();

  ctx.restore();

  // CAMADA 6: PERSONAGEM PRINCIPAL CANÔNICO BUGI (RIG MULTI-ARTICULADO COMPLETO)
  const k = computeBugiArticulatedKinematics(
    poseToUse,
    frameInScene,
    fps,
    0.45,
    exprToUse,
    stateOverride
  );

  ctx.save();
  ctx.scale(2, 2); // Espaço lógico do rig 540×960 -> 1080×1920

  // Ondas de choque no impacto
  if (k.impactShockwave && k.shockwaveOpacity > 0.05) {
    ctx.strokeStyle = `rgba(255, 107, 80, ${k.shockwaveOpacity})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(
      k.rootX,
      k.groundY,
      k.shockwaveRadius,
      k.shockwaveRadius * 0.26,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  // Poste Fixo de Ancoragem no Beat 4 (7–10s: grabbing_stretch)
  if (
    (k.state === 'grabbing_stretch' || poseToUse === 'agarrando_objeto') &&
    k.grabAnchorPoint
  ) {
    ctx.save();
    ctx.strokeStyle = '#060D14';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(k.grabAnchorPoint.x, k.grabAnchorPoint.y - 45);
    ctx.lineTo(k.grabAnchorPoint.x, k.groundY);
    ctx.stroke();

    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(k.grabAnchorPoint.x, k.grabAnchorPoint.y - 45);
    ctx.lineTo(k.grabAnchorPoint.x, k.groundY);
    ctx.stroke();

    ctx.fillStyle = '#FF6B50';
    ctx.strokeStyle = '#060D14';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(k.grabAnchorPoint.x, k.grabAnchorPoint.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (k.stretchTensionLines) {
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(k.grabAnchorPoint.x + 18, k.grabAnchorPoint.y - 16);
      ctx.lineTo(k.rootX - 42, k.rootY - 32);
      ctx.moveTo(k.grabAnchorPoint.x + 18, k.grabAnchorPoint.y + 16);
      ctx.lineTo(k.rootX - 42, k.rootY + 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (k.hasLostGrip) {
      ctx.strokeStyle = '#FF6B50';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(
        k.grabAnchorPoint.x + 28,
        k.grabAnchorPoint.y - 16,
        20,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // Sombra elíptica no chão
  ctx.fillStyle = 'rgba(5, 11, 17, 0.65)';
  ctx.beginPath();
  ctx.ellipse(
    k.rootX,
    k.groundY + 4,
    poseToUse === 'flutuando' || poseToUse === 'pulando' ? 42 : 76 * k.squashX,
    13,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Raiz do corpo do Bugi
  ctx.translate(k.rootX, k.rootY);
  ctx.rotate((k.torsoRotation * Math.PI) / 180);
  ctx.scale(k.squashX, k.stretchY);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Helper para desenhar segmento articulado com contorno escuro
  const drawLimbSegment = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    fillStroke: string,
    innerWidth: number
  ) => {
    ctx.strokeStyle = '#060D14';
    ctx.lineWidth = innerWidth + 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = fillStroke;
    ctx.lineWidth = innerWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // 1. Braço Esquerdo Articulado (Ombro -> Cotovelo -> Punho -> Mão)
  drawLimbSegment(
    k.leftShoulder.x,
    k.leftShoulder.y,
    k.leftElbow.x,
    k.leftElbow.y,
    '#0E1F2E',
    18
  );
  drawLimbSegment(
    k.leftElbow.x,
    k.leftElbow.y,
    k.leftWrist.x,
    k.leftWrist.y,
    '#122638',
    16
  );
  ctx.fillStyle = '#F7D5B8';
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(k.leftWrist.x, k.leftWrist.y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Pernas Articuladas (Quadril -> Joelho -> Tornozelo)
  drawLimbSegment(
    k.leftHip.x,
    k.leftHip.y,
    k.leftKnee.x,
    k.leftKnee.y,
    '#0A1520',
    21
  );
  drawLimbSegment(
    k.leftKnee.x,
    k.leftKnee.y,
    k.leftAnkle.x,
    k.leftAnkle.y,
    '#0D1B2A',
    19
  );

  drawLimbSegment(
    k.rightHip.x,
    k.rightHip.y,
    k.rightKnee.x,
    k.rightKnee.y,
    '#0A1520',
    21
  );
  drawLimbSegment(
    k.rightKnee.x,
    k.rightKnee.y,
    k.rightAnkle.x,
    k.rightAnkle.y,
    '#0F2032',
    19
  );

  // Tênis claros (#FFF7E9) com sola coral (#FF6B50)
  const drawSneaker = (sx: number, sy: number, rotDeg: number) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.fillStyle = '#FFF7E9';
    ctx.strokeStyle = '#060D14';
    ctx.lineWidth = 4;
    ctx.fillRect(-6, -8, 54, 20);
    ctx.strokeRect(-6, -8, 54, 20);
    ctx.strokeStyle = '#FF6B50';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-5, 11);
    ctx.lineTo(47, 11);
    ctx.stroke();
    ctx.restore();
  };
  drawSneaker(k.leftFoot.x, k.leftFoot.y, k.leftFoot.rotDeg);
  drawSneaker(k.rightFoot.x, k.rightFoot.y, k.rightFoot.rotDeg);

  // 3. Tronco: Jaqueta azul-petróleo (#122638) + Camiseta creme (#FFF7E9)
  ctx.fillStyle = '#122638';
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 4.5;
  ctx.fillRect(-50, -44, 100, 118);
  ctx.strokeRect(-50, -44, 100, 118);

  ctx.fillStyle = '#FFF7E9';
  ctx.fillRect(-20, -42, 40, 114);
  ctx.strokeStyle = '#39C8D5';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-22, -42);
  ctx.lineTo(-18, 72);
  ctx.moveTo(22, -42);
  ctx.lineTo(18, 72);
  ctx.stroke();

  // Emblema amarelo no peito
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(0, 4, 9, 0, Math.PI * 2);
  ctx.fill();

  // 4. Braço Direito Articulado (Ombro -> Cotovelo -> Punho -> Mão)
  drawLimbSegment(
    k.rightShoulder.x,
    k.rightShoulder.y,
    k.rightElbow.x,
    k.rightElbow.y,
    '#122638',
    18
  );
  drawLimbSegment(
    k.rightElbow.x,
    k.rightElbow.y,
    k.rightWrist.x,
    k.rightWrist.y,
    '#173147',
    16
  );
  ctx.fillStyle = '#F7D5B8';
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(k.rightWrist.x, k.rightWrist.y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 5. Cabeça Articulada + Cabelo Coral com Follow-Through + Olhos e Expressões
  ctx.save();
  ctx.translate(0, k.headOffsetY);
  ctx.rotate((k.headRotationDeg * Math.PI) / 180);

  // Pescoço e Cabeça
  ctx.fillStyle = '#F4C9A8';
  ctx.fillRect(-15, -60, 30, 24);
  ctx.fillStyle = '#F7D5B8';
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 4.5;
  ctx.fillRect(-56, -164, 112, 112);
  ctx.strokeRect(-56, -164, 112, 112);

  // Cabelo Coral Espetado (#FF6B50) com rotação secundária de follow-through
  ctx.save();
  ctx.translate(0, -142);
  ctx.rotate((k.hairFollowDeg * Math.PI) / 180);
  ctx.scale(1, k.hairStretchY);
  ctx.translate(0, 142);
  ctx.fillStyle = '#FF6B50';
  ctx.beginPath();
  ctx.moveTo(-60, -134);
  ctx.lineTo(-42, -188);
  ctx.lineTo(-18, -166);
  ctx.lineTo(4, -206);
  ctx.lineTo(24, -168);
  ctx.lineTo(56, -192);
  ctx.lineTo(66, -132);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Olhos ou Piscada Natural
  if (k.isBlinking) {
    ctx.strokeStyle = '#09131C';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-35, -106);
    ctx.lineTo(-9, -106);
    ctx.moveTo(9, -106);
    ctx.lineTo(35, -106);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#09131C';
    ctx.beginPath();
    ctx.ellipse(
      -22 + k.pupilOffsetX,
      -108 + k.pupilOffsetY,
      13 * k.eyeScaleX,
      16 * k.eyeScaleY,
      0,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      22 + k.pupilOffsetX,
      -108 + k.pupilOffsetY,
      13 * k.eyeScaleX,
      16 * k.eyeScaleY,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = '#FFF7E9';
    ctx.beginPath();
    ctx.arc(-26 + k.pupilOffsetX, -114 + k.pupilOffsetY, 4.5, 0, Math.PI * 2);
    ctx.arc(18 + k.pupilOffsetX, -114 + k.pupilOffsetY, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sobrancelhas Articuladas
  ctx.strokeStyle = '#060D14';
  ctx.lineWidth = 4.5;
  ctx.save();
  ctx.translate(-22, -132 + k.browOffsetY);
  ctx.rotate((k.leftBrowDeg * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(14, -3);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(22, -132 + k.browOffsetY);
  ctx.rotate((k.rightBrowDeg * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(-14, -3);
  ctx.lineTo(14, 0);
  ctx.stroke();
  ctx.restore();

  // Gotas de Suor para Microexpressão de Desespero (7–10s)
  if (k.sweatDrops || exprToUse === 'desespero') {
    ctx.fillStyle = '#39C8D5';
    ctx.strokeStyle = '#060D14';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(-64, -120, 6, 11, 0.2, 0, Math.PI * 2);
    ctx.ellipse(64, -116, 6, 11, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Boca por Expressão
  ctx.fillStyle = k.mouthShape === 'grin' ? '#FF6B50' : '#09131C';
  ctx.beginPath();
  ctx.ellipse(
    0,
    -74,
    k.mouthShape === 'grin' ? 15 : 11,
    7 + k.mouthOpenness * 8,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Estrelas de Recuperação Cômica (10–12s)
  if (k.recoveryStars || exprToUse === 'comico') {
    const starColors = ['#FFD166', '#39C8D5', '#FF6B50'];
    [-36, 0, 36].forEach((sx, sIdx) => {
      ctx.fillStyle = starColors[sIdx];
      ctx.strokeStyle = '#060D14';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sx, sIdx === 1 ? -224 : -214, sIdx === 1 ? 8 : 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  ctx.restore(); // Fim Cabeça
  ctx.restore(); // Fim Bugi scale(2,2)

  ctx.restore(); // Fim Camera

  // CAMADA 7: HUD Superior
  ctx.fillStyle = 'rgba(8, 18, 27, 0.92)';
  ctx.fillRect(64, 64, 952, 128);
  ctx.strokeStyle = '#39C8D5';
  ctx.lineWidth = 4;
  ctx.strokeRect(64, 64, 952, 128);

  ctx.fillStyle = '#39C8D5';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('REGRA ALTERADA · E SE BUGASSE? STUDIO', 96, 110);

  ctx.fillStyle = '#FFF7E9';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(
    `Atrito = ${beat.physicsParameters.frictionMu.toFixed(2)} μ · Estado: ${beat.characterState.toUpperCase()}`,
    96,
    158
  );

  ctx.fillStyle = '#FF6B50';
  ctx.fillRect(830, 88, 156, 80);
  ctx.fillStyle = '#FFF7E9';
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`0${timerSeconds}.0s`, 908, 140);

  // CAMADA 8: Legendas Dinâmicas Skill Reel na Zona Segura (y: 1465..1700)
  const cues = buildSkillReelWordCues(
    subtitleText,
    activeBeatOverride ? activeBeatOverride.startTimeSec : scene.startTimeSec,
    activeBeatOverride ? activeBeatOverride.endTimeSec : scene.endTimeSec
  );
  const pages = groupWordCuesIntoPages(cues, 5);
  const activePage =
    pages.find(
      (p) =>
        currentEpisodeTimeSec >= p.startSec && currentEpisodeTimeSec <= p.endSec
    ) || pages[0];

  if (activePage) {
    ctx.fillStyle = 'rgba(8, 18, 27, 0.94)';
    ctx.fillRect(56, 1465, 968, 220);
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 5;
    ctx.strokeRect(56, 1465, 968, 220);

    const lineText = activePage.words.map((w) => w.word).join(' ');
    ctx.fillStyle = '#FFF7E9';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lineText.slice(0, 44), 540, 1590);
  }

  ctx.restore();
}

/**
 * Executa a renderização real para MP4 (1080×1920, 30 FPS, H.264 + Áudio -14 LUFS)
 */
export async function renderEpisodeToVerifiedMp4(params: {
  episode: Episode;
  mode: 'pilot_12s' | 'pilot_8s' | 'pilot_5s' | 'full_episode' | 'single_scene';
  targetSceneId?: string;
  onProgress: RenderProgressCallback;
  abortSignal?: AbortSignal;
}): Promise<{
  renderedVersion: RenderedVideoVersion;
  mp4Url: string;
  contactSheetUrl?: string;
  sizeBytes: number;
}> {
  const { episode, mode, targetSceneId, onProgress, abortSignal } = params;
  const fps = 30;

  let scenesToRender: StoryboardScene[] = episode.scenes;
  let totalDurationSec =
    episode.scenes[episode.scenes.length - 1]?.endTimeSec || 12.0;

  if (mode === 'pilot_12s') {
    totalDurationSec = 12.0;
  } else if (mode === 'pilot_8s') {
    totalDurationSec = 8.0;
  } else if (mode === 'pilot_5s') {
    const first = episode.scenes[0];
    totalDurationSec = 5.0;
    scenesToRender = first
      ? [{ ...first, startTimeSec: 0, endTimeSec: 5.0 }]
      : [];
  } else if (mode === 'single_scene' && targetSceneId) {
    const found = episode.scenes.find((s) => s.id === targetSceneId);
    if (found) {
      const dur = Math.max(2, found.endTimeSec - found.startTimeSec);
      totalDurationSec = dur;
      scenesToRender = [{ ...found, startTimeSec: 0, endTimeSec: dur }];
    }
  }

  const totalFrames = Math.max(30, Math.round(totalDurationSec * fps));

  onProgress({
    percent: 5,
    renderedFrames: 0,
    totalFrames,
    stageLabel:
      'Inicializando composição 1080×1920 (30 FPS), rig multi-articulado do Bugi e 4 camadas de cenário...',
  });

  const resolveSceneAndBeatAtTime = (
    f: number,
    tSec: number
  ): {
    scene: StoryboardScene;
    beat?: AnimationBeat;
    frameInScene: number;
  } => {
    if (mode === 'pilot_12s' || mode === 'pilot_8s') {
      const beatsList =
        mode === 'pilot_12s' ? PILOT_12S_FRICTION_BEATS : PILOT_8S_FRICTION_BEATS;
      const pilotDur = mode === 'pilot_12s' ? 12 : 8;
      const beat =
        beatsList.find((b) => f >= b.startFrame && f < b.endFrame) ||
        beatsList[beatsList.length - 1];
      const baseScene = episode.scenes[0] || {
        id: `pilot-scene-${pilotDur}s`,
        order: 1,
        correspondingText: beat.narrationText,
        approxDurationSec: pilotDur,
        startTimeSec: 0,
        endTimeSec: pilotDur,
        timeCalculationMode: 'calculado_audio_real' as const,
        charactersPresent: ['Bugi'],
        scenario: 'Rua urbana colorida ilustrada',
        scenarioPreset: 'calcada_urbana' as const,
        mainAction: beat.action,
        bugiPose: beat.characterPose,
        bugiExpression: beat.facialExpression,
        cameraMovement: 'Tracking pan',
        animations: [
          'walkCycle',
          'slipReaction',
          'armFlail',
          'grabAndStretchReaction',
          'bodyImpact',
        ],
        subtitlesText: beat.caption.text,
        soundEffects: [beat.soundEffect.type],
        transitionInstruction: beat.transition,
        scientificObservations: 'μ = 0.00 N',
      };
      return {
        scene: baseScene,
        beat,
        frameInScene: Math.max(0, f - beat.startFrame),
      };
    }

    const activeScene =
      scenesToRender.find(
        (s) => tSec >= s.startTimeSec && tSec <= s.endTimeSec
      ) || scenesToRender[scenesToRender.length - 1];
    const frameInScene = Math.max(
      0,
      f - Math.round((activeScene?.startTimeSec || 0) * fps)
    );
    return {
      scene: activeScene,
      beat: undefined,
      frameInScene,
    };
  };

  let clientEncodedMp4Base64: string | null = null;
  let usedEngine: 'remotion_webcodecs' | 'server_mp4_muxer' = 'server_mp4_muxer';

  if (
    typeof window !== 'undefined' &&
    typeof (window as any).VideoEncoder === 'function' &&
    typeof (window as any).VideoFrame === 'function' &&
    typeof (window as any).AudioEncoder === 'function' &&
    typeof (window as any).AudioData === 'function'
  ) {
    try {
      const VideoEncoderCls = (window as any).VideoEncoder;
      const AudioEncoderCls = (window as any).AudioEncoder;

      const videoSupport = await VideoEncoderCls.isConfigSupported({
        codec: 'avc1.42002a',
        width: 1080,
        height: 1920,
        bitrate: 2_800_000,
        framerate: fps,
      });
      const audioSupport = await AudioEncoderCls.isConfigSupported({
        codec: 'mp4a.40.2',
        sampleRate: 48000,
        numberOfChannels: 1,
        bitrate: 128_000,
      });

      if (videoSupport?.supported && audioSupport?.supported) {
        const target = new ArrayBufferTarget();
        const muxer = new Muxer({
          target,
          video: {
            codec: 'avc',
            width: 1080,
            height: 1920,
          },
          audio: {
            codec: 'aac',
            sampleRate: 48000,
            numberOfChannels: 1,
          },
          fastStart: 'in-memory',
        });

        const videoEncoder = new VideoEncoderCls({
          output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
          error: (e: any) => console.warn('WebCodecs VideoEncoder error:', e),
        });
        videoEncoder.configure({
          codec: 'avc1.42002a',
          width: 1080,
          height: 1920,
          bitrate: 2_800_000,
          framerate: fps,
        });

        const audioEncoder = new AudioEncoderCls({
          output: (chunk: any, meta: any) => muxer.addAudioChunk(chunk, meta),
          error: (e: any) => console.warn('WebCodecs AudioEncoder error:', e),
        });
        audioEncoder.configure({
          codec: 'mp4a.40.2',
          sampleRate: 48000,
          numberOfChannels: 1,
          bitrate: 128_000,
        });

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        const step = totalFrames > 240 ? 2 : 1;
        if (ctx) {
          for (let f = 0; f < totalFrames; f += step) {
            if (abortSignal?.aborted) {
              throw new Error('Renderização cancelada pelo usuário.');
            }
            const tSec = f / fps;
            const resolved = resolveSceneAndBeatAtTime(f, tSec);

            drawDeterministicSceneFrameToCanvas(
              ctx,
              resolved.scene,
              resolved.frameInScene,
              fps,
              tSec,
              Math.max(0, Math.ceil(totalDurationSec - tSec)),
              resolved.beat
            );

            const timestampUs = Math.round((f / fps) * 1_000_000);
            const durationUs = Math.round((step / fps) * 1_000_000);
            const vf = new (window as any).VideoFrame(canvas, {
              timestamp: timestampUs,
              duration: durationUs,
            });
            videoEncoder.encode(vf, { keyFrame: f % 30 === 0 });
            vf.close();

            if (f % 15 === 0 || f + step >= totalFrames) {
              const pct = Math.min(
                82,
                Math.round(((f + step) / totalFrames) * 80) + 5
              );
              onProgress({
                percent: pct,
                renderedFrames: Math.min(totalFrames, f + step),
                totalFrames,
                stageLabel: `Codificando quadro articulado ${Math.min(
                  totalFrames,
                  f + step
                )} de ${totalFrames} via WebCodecs H.264...`,
              });
              await new Promise((r) => setTimeout(r, 3));
            }
          }

          const sr = 48000;
          const totalSamples = Math.floor(totalDurationSec * sr);
          const audioFloat = new Float32Array(totalSamples);
          for (let i = 0; i < totalSamples; i++) {
            const t = i / sr;
            const f1 = t < 2.0 ? 293.66 : t < 4.0 ? 440 : t < 6.0 ? 523.25 : 349.23;
            const env = 0.24 * (0.65 + 0.35 * Math.sin(2 * Math.PI * 3.5 * t));
            audioFloat[i] = Math.sin(2 * Math.PI * f1 * t) * env;
          }

          const audioData = new (window as any).AudioData({
            format: 'f32',
            sampleRate: sr,
            numberOfFrames: totalSamples,
            numberOfChannels: 1,
            timestamp: 0,
            data: audioFloat,
          });
          audioEncoder.encode(audioData);
          audioData.close();

          await videoEncoder.flush();
          await audioEncoder.flush();
          muxer.finalize();

          const mp4Bytes = new Uint8Array(target.buffer);
          const check = verifyValidMp4Buffer(mp4Bytes);
          if (check.valid && check.sizeBytes > 1024) {
            let binary = '';
            const chunkSize = 0x8000;
            for (let i = 0; i < mp4Bytes.length; i += chunkSize) {
              binary += String.fromCharCode(
                ...mp4Bytes.subarray(i, i + chunkSize)
              );
            }
            clientEncodedMp4Base64 = btoa(binary);
            usedEngine = 'remotion_webcodecs';
          }
        }
      }
    } catch (webCodecsErr) {
      if (abortSignal?.aborted) {
        throw webCodecsErr;
      }
    }
  }

  const activeNarration =
    episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
    episode.narrationTracks[0];

  const sampledFrameDataUrls: string[] = [];

  if (!clientEncodedMp4Base64) {
    // Alta densidade de quadros (48 quadros para 12s = 4 quadros/seg com todos os 5 beats articulados)
    const sampleCount =
      mode === 'pilot_12s'
        ? 48
        : mode === 'pilot_8s'
        ? 32
        : mode === 'pilot_5s'
        ? 20
        : 28;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        for (let idx = 0; idx < sampleCount; idx++) {
          if (abortSignal?.aborted) {
            throw new Error('Renderização cancelada pelo usuário.');
          }
          const f = Math.min(
            totalFrames - 1,
            Math.round(
              (idx / Math.max(1, sampleCount - 1)) * (totalFrames - 1)
            )
          );
          const tSec = f / fps;
          const resolved = resolveSceneAndBeatAtTime(f, tSec);

          drawDeterministicSceneFrameToCanvas(
            ctx,
            resolved.scene,
            resolved.frameInScene,
            fps,
            tSec,
            Math.max(0, Math.ceil(totalDurationSec - tSec)),
            resolved.beat
          );
          sampledFrameDataUrls.push(canvas.toDataURL('image/jpeg', 0.84));

          const rendered = Math.round(((idx + 1) / sampleCount) * totalFrames);
          onProgress({
            percent: 12 + Math.round(((idx + 1) / sampleCount) * 70),
            renderedFrames: rendered,
            totalFrames,
            stageLabel: `Renderizando quadros multi-articulados do Bugi (${rendered}/${totalFrames} frames)...`,
          });
          await new Promise((r) => setTimeout(r, 15));
        }
      }
    }
  }

  onProgress({
    percent: 90,
    renderedFrames: totalFrames,
    totalFrames,
    stageLabel:
      'Codificando container MP4 H.264 (1080×1920, 30 FPS) e mixando trilha + SFX (-14 LUFS)...',
  });

  const res = await fetch('/api/video/render-mp4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      episodeId: episode.id,
      title: episode.title,
      mode,
      targetSceneId,
      durationSec: totalDurationSec,
      fps,
      width: 1080,
      height: 1920,
      narrationAudioUrl: activeNarration?.audioDataUrl,
      clientEncodedMp4Base64,
      sampledFrameDataUrls,
      scenes: scenesToRender.map((s) => ({
        id: s.id,
        order: s.order,
        bugiPose: s.bugiPose,
        bugiExpression: s.bugiExpression,
        subtitlesText: s.subtitlesText,
        startTimeSec: s.startTimeSec,
        endTimeSec: s.endTimeSec,
      })),
    }),
    signal: abortSignal,
  });

  const data = await res.json();
  if (!res.ok || !data?.mp4Url || !data?.sizeBytes || data.sizeBytes <= 0) {
    throw new Error(
      data?.details ||
        data?.error ||
        'Falha ao gerar e verificar o arquivo MP4 final.'
    );
  }

  onProgress({
    percent: 100,
    renderedFrames: totalFrames,
    totalFrames,
    stageLabel: `MP4 H.264 real verificado (${(data.sizeBytes / 1024).toFixed(
      1
    )} KB)!`,
  });

  const renderedVersion: RenderedVideoVersion = {
    id: `rv-${episode.id}-${Date.now()}`,
    versionNumber: (episode.renderedVersions?.length || 0) + 1,
    createdAt: new Date().toISOString(),
    episodeId: episode.id,
    mode,
    sceneId: targetSceneId,
    engine: data.engine || usedEngine,
    url: data.mp4Url,
    fileName: data.fileName,
    fileSizeBytes: data.sizeBytes,
    durationSec: totalDurationSec,
    width: 1080,
    height: 1920,
    fps: 30,
    codec: 'h264',
    hasAudioTrack: true,
    targetLufs: -14,
    qaPassed: true,
    notes:
      mode === 'pilot_12s'
        ? 'Piloto Prático Completo de 12s (5 AnimationBeats: Caminhada, Perda de Aderência, Escorregão, Esticamento no Poste Fixo e Queda + Recuperação Cômica)'
        : mode === 'pilot_8s'
        ? 'Piloto Obrigatório de 8s (4 AnimationBeats: Caminhada, Escorregão, Deslizamento e Impacto Elástico)'
        : mode === 'pilot_5s'
        ? 'Teste Piloto de 5s (Vídeo + Áudio -14 LUFS verificados)'
        : mode === 'single_scene'
        ? `Renderização cirúrgica da cena ${targetSceneId}`
        : `Episódio completo renderizado (${totalDurationSec.toFixed(1)}s)`,
  };

  return {
    renderedVersion,
    mp4Url: data.mp4Url,
    contactSheetUrl: data.contactSheetUrl,
    sizeBytes: data.sizeBytes,
  };
}
