/**
 * Motor de Renderização Direta de Vídeo MP4 (H.264 + Áudio -14 LUFS)
 * Reconstruído com:
 * - Rig Multi-Articulado completo do Bugi no Canvas 2D (ombros, cotovelos, punhos, mãos,
 *   quadris, joelhos, tornozelos, tênis, pescoço, cabeça, cabelo com follow-through, sobrancelhas, pupilas e boca)
 * - Cenário Ilustrado em 4 Planos (background, middle-ground, foreground, interactive-objects)
 * - Direção por AnimationBeats (incluindo o Piloto Obrigatório de 8 Segundos — 240 frames @ 30 FPS)
 * - WebCodecs H.264 + AAC no navegador com fallback FFmpeg de alta densidade no servidor.
 */

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
/**
 * Compatibilidade com telas antigas. A produção exporta sempre a composição
 * Remotion usada no Player; não há mais encoder de quadros Canvas alternativo.
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
  const { renderEpisodeWithRemotion } = await import('./remotionWebExport');
  return renderEpisodeWithRemotion(params);
}
