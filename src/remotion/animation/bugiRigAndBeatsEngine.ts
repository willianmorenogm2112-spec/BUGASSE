/**
 * Motor Determinístico de Animação 2D, Máquina de Estados Multi-Articulada do Bugi
 * e Direção por Beats Narrativos (Seções 1 a 10 — Reconstrução da Qualidade Visual)
 *
 * Usa funções determinísticas compatíveis com Remotion (interpolate, spring, Easing)
 * para produzir movimentos idênticos tanto no @remotion/player (SVG) quanto no
 * renderizador de vídeo MP4 (Canvas 2D / WebCodecs / FFmpeg).
 */

import { interpolate, spring, Easing } from 'remotion';
import {
  AnimationBeat,
  BugiAnimationState,
  BugiExpression,
  BugiPose,
  StoryboardScene,
} from '../../types/studio';

export interface EngineAuditFinding {
  id: string;
  priority: 'CRÍTICA' | 'ALTA' | 'MÉDIA';
  component: string;
  problemFound: string;
  appliedFix: string;
  status: 'CORRIGIDO';
}

/**
 * Seção 1: Relatório de Auditoria Técnica do Motor Anterior com Prioridades
 */
export const PREVIOUS_ENGINE_AUDIT_REPORT: EngineAuditFinding[] = [
  {
    id: 'audit-01',
    priority: 'CRÍTICA',
    component: 'mp4RenderEngine.ts & BugiCharacterSvg.tsx',
    problemFound:
      'No renderizador MP4 (drawDeterministicSceneFrameToCanvas), os braços do Bugi estavam desenhados com coordenadas fixas (moveTo -48,-20 -> lineTo -98,20) e as pernas eram linhas retas únicas sem articulação de joelho, cotovelo ou punho. No SVG, os membros usavam curvas quadráticas simples sem separação real entre braço/antebraço e coxa/canela.',
    appliedFix:
      'Reconstruído o rig com cinemática direta multi-articulada (ombro -> cotovelo -> punho -> mão; quadril -> joelho -> tornozelo -> tênis; pescoço -> cabeça -> mechas do cabelo) compartilhada entre o SVG Remotion e o Canvas 2D MP4.',
    status: 'CORRIGIDO',
  },
  {
    id: 'audit-02',
    priority: 'CRÍTICA',
    component: 'mp4RenderEngine.ts (Amostragem de Quadros)',
    problemFound:
      'O fallback de exportação MP4 capturava apenas 10 a 12 quadros estáticos para o vídeo inteiro (~2 FPS interpolados para 30 FPS), deixando o movimento truncado e com aspecto de apresentação de slides.',
    appliedFix:
      'Aumentada a amostragem determinística para 30 FPS reais no WebCodecs e alta densidade de quadros no muxer H.264 do servidor (capturando cada fase do ciclo de caminhada, escorregão, perda de equilíbrio e impacto).',
    status: 'CORRIGIDO',
  },
  {
    id: 'audit-03',
    priority: 'CRÍTICA',
    component: 'SceneBackgroundLayer.tsx & Cenários IA',
    problemFound:
      'Quando uma cena não possuía imagem externa anexada, o cenário caía em apenas 3 retângulos chapados azuis sobre fundo escuro, sem profundidade, sem texturas de calçada, sem iluminação e sem composição em 4 planos.',
    appliedFix:
      'Criado gerador de cenário ilustrado em 4 camadas de profundidade (background, middle-ground, foreground, interactive-objects) com perspectiva, prédios detalhados, toldos, árvores, postes de luz, calçada ladrilhada, meio-fio e suporte nativo aos fundos gerados pelo Google AI Studio.',
    status: 'CORRIGIDO',
  },
  {
    id: 'audit-04',
    priority: 'ALTA',
    component: 'RemotionSceneComposer.tsx (Direção por Beats e Câmera)',
    problemFound:
      'As cenas aplicavam apenas um zoom linear uniforme (1.0 -> 1.08) e mantinham a mesma pose estática durante toda a cena, sem antecipação, reação ou acompanhamento horizontal da câmera.',
    appliedFix:
      'Implementada estrutura AnimationBeat com transições entre estados (walking -> anticipation -> surprise -> sliding/panic -> falling -> impact -> recovery), câmera que persegue o deslocamento do Bugi (cameraTracking) e parallax em 4 planos.',
    status: 'CORRIGIDO',
  },
  {
    id: 'audit-05',
    priority: 'MÉDIA',
    component: 'skillReelAndHyperFrames.ts & PhysicsEffectsLayer.tsx',
    problemFound:
      'O card do HyperFrames aparecia sempre fixo no topo durante toda a cena, competindo com a atuação do personagem em vez de entrar apenas nos momentos de explicação física.',
    appliedFix:
      'Sincronizado o overlay determinístico GSAP (window.__timelines) e as legendas dinâmicas com os beats narrativos, liberando o centro do quadro para a atuação física do Bugi.',
    status: 'CORRIGIDO',
  },
];

/**
 * Mapeia qualquer BugiPose para o estado correspondente da máquina de estados BugiAnimationState
 */
export function mapPoseToAnimationState(pose: BugiPose): BugiAnimationState {
  switch (pose) {
    case 'caminhando':
      return 'walking';
    case 'correndo':
      return 'running';
    case 'agachando':
    case 'pulando':
      return 'anticipation';
    case 'assustando':
      return 'surprise';
    case 'equilibrando':
      return 'panic';
    case 'escorregando':
      return 'sliding';
    case 'agarrando_objeto':
      return 'grabbing_stretch';
    case 'caindo':
      return 'falling';
    case 'reagindo_impacto':
      return 'impact';
    case 'comemorando':
      return 'celebrating';
    case 'olhando_objeto':
    case 'investigando':
    case 'apontando':
    case 'flutuando':
    case 'confiante_parado':
    default:
      return 'idle';
  }
}

/**
 * ============================================================================
 * SEÇÃO 6: BIBLIOTECA DE 10 ANIMAÇÕES DETERMINÍSTICAS REMOTION
 * ============================================================================
 */

/**
 * 1. walkCycle — Ciclo bípede completo com alternância de coxas, joelhos, tornozelos,
 * balanço oposto de ombros/cotovelos e impulso vertical do tronco.
 */
export function walkCycle(
  frame: number,
  fps: number,
  speedMultiplier = 1.0
): {
  leftHipDeg: number;
  leftKneeDeg: number;
  leftFootDeg: number;
  rightHipDeg: number;
  rightKneeDeg: number;
  rightFootDeg: number;
  leftShoulderDeg: number;
  leftElbowDeg: number;
  rightShoulderDeg: number;
  rightElbowDeg: number;
  pelvisBobY: number;
  torsoLeanDeg: number;
  horizontalProgressPx: number;
} {
  const cycleFrames = Math.max(12, Math.round((fps / 1.75) / speedMultiplier));
  const phase = ((frame % cycleFrames) / cycleFrames) * Math.PI * 2;
  const sinP = Math.sin(phase);
  const cosP = Math.cos(phase);

  // Coxas oscilam entre -32° (frente) e +28° (trás)
  const leftHipDeg = sinP * -30 * speedMultiplier;
  const rightHipDeg = -sinP * -30 * speedMultiplier;

  // Joelhos dobram sempre para trás (+8° a +52°) especialmente na passagem do pé no ar
  const leftPass = Math.max(0, cosP);
  const rightPass = Math.max(0, -cosP);
  const leftKneeDeg = 10 + leftPass * 42 * speedMultiplier;
  const rightKneeDeg = 10 + rightPass * 42 * speedMultiplier;

  // Pés articulam no contato do calcanhar (heel strike) e impulso da ponta (toe off)
  const leftFootDeg = cosP * -14;
  const rightFootDeg = -cosP * -14;

  // Braços balançam em oposição às pernas com dobra elástica nos cotovelos
  const leftShoulderDeg = -sinP * 34 * speedMultiplier;
  const rightShoulderDeg = sinP * 34 * speedMultiplier;
  const leftElbowDeg = -18 - Math.max(0, -sinP) * 28;
  const rightElbowDeg = -18 - Math.max(0, sinP) * 28;

  // Duplo pulso vertical por ciclo completo (passagem alta, contato baixo)
  const pelvisBobY = -Math.abs(cosP) * 11 * speedMultiplier;
  const torsoLeanDeg = 4 * speedMultiplier + sinP * 2.5;

  // Deslocamento horizontal suave durante a caminhada
  const horizontalProgressPx = interpolate(
    frame,
    [0, fps * 2],
    [-42, 24],
    { extrapolateRight: 'clamp' }
  );

  return {
    leftHipDeg,
    leftKneeDeg,
    leftFootDeg,
    rightHipDeg,
    rightKneeDeg,
    rightFootDeg,
    leftShoulderDeg,
    leftElbowDeg,
    rightShoulderDeg,
    rightElbowDeg,
    pelvisBobY,
    torsoLeanDeg,
    horizontalProgressPx,
  };
}

/**
 * 2. slipReaction — Antecipação curta de frenagem seguida pelo escorregão súbito do pé à frente
 * quando o coeficiente de atrito cai para zero (μ = 0).
 */
export function slipReaction(
  frameInBeat: number,
  fps: number
): {
  anticipationCrouchY: number;
  torsoSlipTiltDeg: number;
  leadHipDeg: number;
  leadKneeDeg: number;
  trailHipDeg: number;
  trailKneeDeg: number;
  slipSlideX: number;
  surpriseScale: number;
} {
  // Primeiros 8 frames: antecipação (tenta frear dobrando os joelhos)
  const antiProgress = interpolate(frameInBeat, [0, 8, 16], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // A partir do frame 8: o pé da frente dispara para a direita e o tronco inclina para trás
  const slipSpring = spring({
    frame: Math.max(0, frameInBeat - 6),
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });

  const osc = Math.sin((frameInBeat / fps) * Math.PI * 5) * 6;

  return {
    anticipationCrouchY: antiProgress * 18 - slipSpring * 8,
    torsoSlipTiltDeg: antiProgress * 12 - slipSpring * 26 + osc * 0.4,
    leadHipDeg: -15 - slipSpring * 48 + osc,
    leadKneeDeg: antiProgress * 38 + (1 - slipSpring) * 14,
    trailHipDeg: 18 + slipSpring * 32 - osc,
    trailKneeDeg: 22 + slipSpring * 34,
    slipSlideX: slipSpring * 46 + (frameInBeat / fps) * 28,
    surpriseScale: 1 + slipSpring * 0.08,
  };
}

/**
 * 3. bodyImpact — Queda cartunesca no solo com compressão elástica (squash & stretch),
 * onda de choque e rebote amortecido (recovery).
 */
export function bodyImpact(
  frameInBeat: number,
  fps: number
): {
  fallDropY: number;
  bodyRotationDeg: number;
  impactSquashX: number;
  impactStretchY: number;
  shockwaveRadius: number;
  shockwaveOpacity: number;
  isGroundedImpact: boolean;
  recoverySitUpProgress: number;
} {
  // Frames 0..16: queda acelerada pela gravidade
  const fallProgress = interpolate(frameInBeat, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // Frame 16..34: impacto elástico no chão
  const impactSpring = spring({
    frame: Math.max(0, frameInBeat - 16),
    fps,
    config: { damping: 7, stiffness: 190, mass: 0.7 },
  });

  // Frame 34..60: recuperação sentada cartunesca com estrelas/sorriso
  const recoverySitUpProgress = interpolate(frameInBeat, [34, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });

  const compressionEnvelope =
    frameInBeat >= 15 && frameInBeat <= 28
      ? Math.sin(((frameInBeat - 15) / 13) * Math.PI)
      : 0;

  const impactSquashX = Number((1 + compressionEnvelope * 0.26).toFixed(3));
  const impactStretchY = Number((1 - compressionEnvelope * 0.22).toFixed(3));

  const fallDropY =
    fallProgress * 68 +
    compressionEnvelope * 16 -
    recoverySitUpProgress * 22;

  const bodyRotationDeg =
    fallProgress * -52 + recoverySitUpProgress * 38;

  const shockwaveRadius = interpolate(frameInBeat, [15, 38], [12, 135], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(frameInBeat, [15, 20, 38], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    fallDropY,
    bodyRotationDeg,
    impactSquashX,
    impactStretchY,
    shockwaveRadius,
    shockwaveOpacity,
    isGroundedImpact: frameInBeat >= 15,
    recoverySitUpProgress,
  };
}

/**
 * 4. eyeReaction — Direção do olhar, escala expressiva das pupilas, piscar natural
 * e inclinação independente das sobrancelhas.
 */
export function eyeReaction(
  frame: number,
  fps: number,
  state: BugiAnimationState,
  expression: BugiExpression,
  targetX = 0,
  targetY = 0
): {
  pupilX: number;
  pupilY: number;
  eyeScaleX: number;
  eyeScaleY: number;
  isBlinking: boolean;
  leftBrowDeg: number;
  rightBrowDeg: number;
  browOffsetY: number;
} {
  // Piscada natural a cada ~1.8s (54 frames), exceto nos picos de susto/surpresa
  const blinkMod = frame % 54;
  const isBlinking =
    state !== 'surprise' &&
    state !== 'impact' &&
    frame > 10 &&
    blinkMod >= 50 &&
    blinkMod <= 52;

  const t = frame / Math.max(1, fps);
  let pupilX = targetX;
  let pupilY = targetY;
  let eyeScaleX = 1.0;
  let eyeScaleY = 1.0;
  let leftBrowDeg = 0;
  let rightBrowDeg = 0;
  let browOffsetY = 0;

  if (state === 'walking' || state === 'idle') {
    pupilX = 3 + Math.sin(t * 2.2) * 2;
    pupilY = Math.cos(t * 1.6) * 1.5;
    leftBrowDeg = -3;
    rightBrowDeg = 3;
  } else if (state === 'surprise' || expression === 'surpreso') {
    pupilX = 4;
    pupilY = 5; // Olha para o pé escorregando
    eyeScaleX = 1.18;
    eyeScaleY = 1.26;
    leftBrowDeg = -14;
    rightBrowDeg = 14;
    browOffsetY = -8;
  } else if (
    state === 'grabbing_stretch' ||
    expression === 'desespero'
  ) {
    // Microexpressão de desespero (7-10s): pupilas trêmulas olhando para a mão que escapa do poste, olhos arregalados e sobrancelhas dramáticas
    pupilX = -5 + Math.sin(t * 24) * 1.8;
    pupilY = 2 + Math.cos(t * 20) * 1.4;
    eyeScaleX = 1.24;
    eyeScaleY = 1.3;
    leftBrowDeg = 22;
    rightBrowDeg = -22;
    browOffsetY = -7;
  } else if (state === 'panic' || state === 'sliding' || expression === 'panico_divertido') {
    pupilX = Math.sin(t * 9) * 5;
    pupilY = 4;
    eyeScaleX = 1.15;
    eyeScaleY = 1.22;
    leftBrowDeg = 16;
    rightBrowDeg = -16;
    browOffsetY = -6;
  } else if (state === 'falling' || state === 'impact') {
    pupilX = 0;
    pupilY = -5;
    eyeScaleX = 1.22;
    eyeScaleY = 0.88;
    leftBrowDeg = 20;
    rightBrowDeg = -20;
    browOffsetY = -4;
  } else if (state === 'recovery' || state === 'celebrating' || expression === 'comico') {
    pupilX = Math.sin(t * 5) * 4;
    pupilY = -2;
    eyeScaleX = 1.1;
    eyeScaleY = 1.12;
    leftBrowDeg = -14;
    rightBrowDeg = 12;
    browOffsetY = -6;
  }

  return {
    pupilX: Number(pupilX.toFixed(2)),
    pupilY: Number(pupilY.toFixed(2)),
    eyeScaleX: Number(eyeScaleX.toFixed(2)),
    eyeScaleY: Number(eyeScaleY.toFixed(2)),
    isBlinking,
    leftBrowDeg,
    rightBrowDeg,
    browOffsetY,
  };
}

/**
 * 5. armFlail — Giro de braços em moinho com atraso secundário (follow-through) nos cotovelos
 * para perda de equilíbrio e escorregão.
 */
export function armFlail(
  frameInBeat: number,
  fps: number,
  intensity = 1.0
): {
  leftShoulderDeg: number;
  leftElbowDeg: number;
  rightShoulderDeg: number;
  rightElbowDeg: number;
} {
  const phase = (frameInBeat / Math.max(1, fps)) * Math.PI * 6.5;
  // Ombros giram em arcos amplos opostos
  const leftShoulderDeg = (-75 + Math.sin(phase) * 58) * intensity;
  const rightShoulderDeg = (65 + Math.cos(phase) * 62) * intensity;

  // Cotovelos possuem atraso de fase (follow-through de -0.65 rad)
  const leftElbowDeg = (-28 + Math.sin(phase - 0.65) * 42) * intensity;
  const rightElbowDeg = (24 + Math.cos(phase - 0.65) * 44) * intensity;

  return {
    leftShoulderDeg,
    leftElbowDeg,
    rightShoulderDeg,
    rightElbowDeg,
  };
}

/**
 * 6. headFollow — Rotação do pescoço/cabeça e movimento secundário elástico (follow-through)
 * das mechas do cabelo coral do Bugi.
 */
export function headFollow(
  frame: number,
  fps: number,
  torsoAngleDeg: number,
  verticalVelocity: number
): {
  neckAngleDeg: number;
  headAngleDeg: number;
  hairFollowDeg: number;
  hairStretchY: number;
} {
  const phase = (frame / Math.max(1, fps)) * Math.PI * 3.2;
  // A cabeça compensa parcialmente a inclinação do tronco para manter o olhar legível
  const neckAngleDeg = -torsoAngleDeg * 0.25 + Math.sin(phase - 0.3) * 3;
  const headAngleDeg = -torsoAngleDeg * 0.35 + Math.sin(phase - 0.5) * 4.5;

  // As mechas corais atrasam em relação à cabeça e reagem à velocidade vertical
  const hairFollowDeg =
    -torsoAngleDeg * 0.45 +
    Math.sin(phase - 1.1) * 9 -
    verticalVelocity * 0.35;
  const hairStretchY = Number(
    Math.max(0.88, Math.min(1.16, 1 + Math.sin(phase - 0.9) * 0.07)).toFixed(3)
  );

  return {
    neckAngleDeg: Number(neckAngleDeg.toFixed(2)),
    headAngleDeg: Number(headAngleDeg.toFixed(2)),
    hairFollowDeg: Number(hairFollowDeg.toFixed(2)),
    hairStretchY,
  };
}

/**
 * 7. cameraTracking — Câmera cinematográfica que acompanha o deslocamento do Bugi,
 * aproxima nas reações e aplica vibração amortecida no impacto.
 */
export function cameraTracking(
  frame: number,
  fps: number,
  beat: AnimationBeat
): {
  panX: number;
  panY: number;
  zoom: number;
  dutchAngleDeg: number;
} {
  const duration = Math.max(1, beat.endFrame - beat.startFrame);
  const localFrame = Math.max(0, Math.min(duration, frame - beat.startFrame));

  let panX = interpolate(
    localFrame,
    [0, duration],
    [beat.camera.panXStart, beat.camera.panXEnd],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }
  );

  let panY = interpolate(
    localFrame,
    [0, duration],
    [beat.camera.panYStart, beat.camera.panYEnd],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }
  );

  const zoom = interpolate(
    localFrame,
    [0, duration],
    [beat.camera.zoomStart, beat.camera.zoomEnd],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  let dutchAngleDeg = beat.camera.dutchAngleDeg;

  // Shake de impacto físico quando a câmera está em modo impact_shake
  if (beat.camera.mode === 'impact_shake' && localFrame >= 14 && localFrame <= 30) {
    const decay = 1 - (localFrame - 14) / 16;
    panX += Math.sin(localFrame * 2.8) * 18 * decay;
    panY += Math.cos(localFrame * 3.4) * 14 * decay;
    dutchAngleDeg += Math.sin(localFrame * 2.2) * 2.2 * decay;
  }

  return {
    panX: Number(panX.toFixed(2)),
    panY: Number(panY.toFixed(2)),
    zoom: Number(zoom.toFixed(3)),
    dutchAngleDeg: Number(dutchAngleDeg.toFixed(2)),
  };
}

/**
 * 8. parallaxMotion — Calcula os deslocamentos das 4 camadas de cenário
 * (background, middle-ground, foreground, interactive-objects).
 */
export function parallaxMotion(
  frame: number,
  cameraPanX: number,
  parallaxSpeed: number
): {
  skyOffsetX: number;
  midgroundOffsetX: number;
  foregroundOffsetX: number;
  interactivePropsOffsetX: number;
} {
  const baseScroll = -(frame * parallaxSpeed * 3.2) + cameraPanX;
  return {
    skyOffsetX: Number((baseScroll * 0.14).toFixed(2)),
    midgroundOffsetX: Number((baseScroll * 0.46).toFixed(2)),
    foregroundOffsetX: Number((baseScroll * 0.92).toFixed(2)),
    interactivePropsOffsetX: Number((baseScroll * 1.12).toFixed(2)),
  };
}

/**
 * 9. objectInteraction — Movimento secundário dos objetos interativos da cena
 * (placa μ = 0 vibrando, cone de trânsito e copo deslizando quando atrito = 0).
 */
export function objectInteraction(
  frame: number,
  beat: AnimationBeat
): {
  signTiltDeg: number;
  slidingConeOffsetX: number;
  slidingCupOffsetX: number;
  slidingCupRotationDeg: number;
  frictionlessWavePhase: number;
} {
  const localFrame = Math.max(0, frame - beat.startFrame);
  const isZeroFriction = beat.physicsParameters.frictionMu <= 0.01;

  const signTiltDeg =
    beat.backgroundAnimation.propMotion === 'impact_vibration'
      ? Math.sin(localFrame * 1.9) * 8 * Math.max(0, 1 - localFrame / 40)
      : isZeroFriction
      ? Math.sin(frame * 0.25) * 2.5
      : 0;

  const slidingConeOffsetX = isZeroFriction ? localFrame * 4.2 : 0;
  const slidingCupOffsetX = isZeroFriction ? localFrame * 6.8 : 0;
  const slidingCupRotationDeg = isZeroFriction ? localFrame * 5.5 : 0;
  const frictionlessWavePhase = (frame * 10) % 240;

  return {
    signTiltDeg: Number(signTiltDeg.toFixed(2)),
    slidingConeOffsetX: Number(slidingConeOffsetX.toFixed(1)),
    slidingCupOffsetX: Number(slidingCupOffsetX.toFixed(1)),
    slidingCupRotationDeg: Number(slidingCupRotationDeg.toFixed(1)),
    frictionlessWavePhase,
  };
}

/**
 * 10. squashAndStretch — Deformação elástica com preservação de volume
 * controlada pelo estado atual e transições de impacto/antecipação.
 */
export function squashAndStretch(
  state: BugiAnimationState,
  frameInBeat: number,
  fps: number
): {
  squashX: number;
  stretchY: number;
} {
  const t = frameInBeat / Math.max(1, fps);
  if (state === 'anticipation') {
    const p = interpolate(frameInBeat, [0, 10], [0, 1], {
      extrapolateRight: 'clamp',
    });
    return {
      squashX: Number((1 + p * 0.14).toFixed(3)),
      stretchY: Number((1 - p * 0.12).toFixed(3)),
    };
  }
  if (state === 'surprise') {
    const s = spring({
      frame: frameInBeat,
      fps,
      config: { damping: 9, stiffness: 170, mass: 0.6 },
    });
    return {
      squashX: Number((1 - s * 0.08).toFixed(3)),
      stretchY: Number((1 + s * 0.1).toFixed(3)),
    };
  }
  if (state === 'grabbing_stretch') {
    const gs = grabAndStretchReaction(frameInBeat, fps);
    return {
      squashX: gs.bodyStretchX,
      stretchY: gs.bodySquashY,
    };
  }
  if (state === 'impact') {
    const imp = bodyImpact(frameInBeat, fps);
    return {
      squashX: imp.impactSquashX,
      stretchY: imp.impactStretchY,
    };
  }
  if (state === 'recovery') {
    const damp = Math.max(0, 1 - frameInBeat / 45);
    const subtleRec = Math.sin(t * Math.PI * 4) * 0.04 * damp;
    return {
      squashX: Number((1 + subtleRec).toFixed(3)),
      stretchY: Number((1 - subtleRec).toFixed(3)),
    };
  }
  const subtle = Math.sin(t * Math.PI * 3.5) * 0.03;
  return {
    squashX: Number((1 + subtle).toFixed(3)),
    stretchY: Number((1 - subtle).toFixed(3)),
  };
}

/**
 * 11. grabAndStretchReaction — (Beat 4: 7–10s do Piloto de 12s)
 * Bugi tenta se segurar em um objeto fixo (poste/hidrante na calçada),
 * o corpo e o braço esquerdo esticam de maneira cartunesca (frames 0..54),
 * até que ele perde a pegada (frame 55..90), sofre recuo elástico e continua deslizando com microexpressão de desespero.
 */
export function grabAndStretchReaction(
  frameInBeat: number,
  fps: number
): {
  rootX: number;
  rootY: number;
  torsoTiltDeg: number;
  bodyStretchX: number;
  bodySquashY: number;
  leftArmStretchFactor: number;
  hasLostGrip: boolean;
  grabAnchorPoint: { x: number; y: number };
} {
  const localFrame = frameInBeat % 90;
  const grabAnchorPoint = { x: 162, y: 472 };
  const hasLostGrip = localFrame >= 54;

  // Fase 1 (frames 0..53): mão presa ao poste fixo enquanto o corpo desliza para a direita, esticando elasticamente
  const stretchProgress = interpolate(localFrame, [0, 53], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // Fase 2 (frames 54..90): perde a pegada! O braço chicoteia de volta com spring elástico e o Bugi continua deslizando
  const releaseSpring = hasLostGrip
    ? spring({
        frame: localFrame - 54,
        fps,
        config: { damping: 8, stiffness: 180, mass: 0.65 },
      })
    : 0;

  const rootX = !hasLostGrip
    ? 228 + stretchProgress * 98
    : 326 + releaseSpring * 26 + ((localFrame - 54) / Math.max(1, fps)) * 22;

  const rootY = !hasLostGrip
    ? 500 + stretchProgress * 8
    : 508 - releaseSpring * 10;

  const torsoTiltDeg = !hasLostGrip
    ? 10 + stretchProgress * 22
    : 32 - releaseSpring * 52;

  const bodyStretchX = !hasLostGrip
    ? Number((1 + stretchProgress * 0.24).toFixed(3))
    : Number((1.24 - releaseSpring * 0.24).toFixed(3));

  const bodySquashY = !hasLostGrip
    ? Number((1 - stretchProgress * 0.16).toFixed(3))
    : Number((0.84 + releaseSpring * 0.16).toFixed(3));

  const leftArmStretchFactor = !hasLostGrip
    ? Number((1 + stretchProgress * 0.85).toFixed(3))
    : Number(Math.max(1, 1.85 - releaseSpring * 0.85).toFixed(3));

  return {
    rootX: Number(rootX.toFixed(2)),
    rootY: Number(rootY.toFixed(2)),
    torsoTiltDeg: Number(torsoTiltDeg.toFixed(2)),
    bodyStretchX,
    bodySquashY,
    leftArmStretchFactor,
    hasLostGrip,
    grabAnchorPoint,
  };
}

/**
 * ============================================================================
 * SEÇÃO 5 & 8: PILOTO PRÁTICO OBRIGATÓRIO DE 12 SEGUNDOS (360 FRAMES @ 30 FPS)
 * Tema: "E se o atrito desaparecesse por 5 segundos?"
 * Estrutura de 5 Beats Cinematográficos (0–2s, 2–4s, 4–7s, 7–10s, 10–12s)
 * ============================================================================
 */
export const PILOT_12S_FRICTION_BEATS: AnimationBeat[] = [
  {
    id: 'pilot12-beat-1-walk',
    beatIndex: 1,
    startFrame: 0,
    endFrame: 60,
    startTimeSec: 0.0,
    endTimeSec: 2.0,
    narrationText: 'O Bugi caminhava tranquilo pela rua colorida... até o atrito sumir!',
    action:
      '0–2s: Bugi caminha por uma rua colorida; braços e pernas se movem; cabeça tem leve oscilação; olhos piscam; cabelo tem movimento secundário; câmera acompanha lateralmente.',
    anticipation: {
      enabled: false,
      frames: 0,
      crouchPx: 0,
      leanAngleDeg: 3,
    },
    characterState: 'walking',
    characterPose: 'caminhando',
    facialExpression: 'confiante',
    camera: {
      mode: 'tracking_pan',
      panXStart: 24,
      panXEnd: 0,
      panYStart: 0,
      panYEnd: 0,
      zoomStart: 1.0,
      zoomEnd: 1.03,
      dutchAngleDeg: 0,
    },
    backgroundAnimation: {
      parallaxSpeed: 1.15,
      groundGlossIntensity: 0.15,
      propMotion: 'none',
    },
    soundEffect: {
      type: 'footsteps',
      label: 'Passos rítmicos na calçada colorida',
      triggerFrameOffset: 4,
      gainDb: -11,
    },
    caption: {
      text: 'O Bugi caminhava tranquilo pela rua colorida... até o atrito sumir!',
      highlightWords: ['Bugi', 'rua', 'atrito', 'sumir!'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.65,
      gravityMps2: 9.8,
      velocityPxPerSec: 115,
      centerOfMassOffsetPx: 0,
    },
  },
  {
    id: 'pilot12-beat-2-slip',
    beatIndex: 2,
    startFrame: 60,
    endFrame: 120,
    startTimeSec: 2.0,
    endTimeSec: 4.0,
    narrationText: 'O atrito desaparece! O pé perde aderência, ele tenta frear, mas vai pra frente!',
    action:
      '2–4s: O atrito desaparece; um pé perde aderência; Bugi tenta frear, mas continua indo para frente; olhos arregalam e braços buscam equilíbrio.',
    anticipation: {
      enabled: true,
      frames: 8,
      crouchPx: 18,
      leanAngleDeg: -18,
    },
    characterState: 'surprise',
    characterPose: 'escorregando',
    facialExpression: 'surpreso',
    camera: {
      mode: 'dramatic_push',
      panXStart: 0,
      panXEnd: -26,
      panYStart: 0,
      panYEnd: -8,
      zoomStart: 1.03,
      zoomEnd: 1.09,
      dutchAngleDeg: -1.8,
    },
    backgroundAnimation: {
      parallaxSpeed: 2.6,
      groundGlossIntensity: 0.92,
      propMotion: 'sliding_props',
    },
    soundEffect: {
      type: 'slip_whoosh',
      label: 'Pé perdendo aderência + tentativa de frear',
      triggerFrameOffset: 6,
      gainDb: -8,
    },
    caption: {
      text: 'O atrito desaparece! O pé perde aderência, ele tenta frear, mas vai pra frente!',
      highlightWords: ['atrito', 'desaparece!', 'aderência,', 'frear,'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.0,
      gravityMps2: 9.8,
      velocityPxPerSec: 340,
      centerOfMassOffsetPx: -24,
    },
  },
  {
    id: 'pilot12-beat-3-slide',
    beatIndex: 3,
    startFrame: 120,
    endFrame: 210,
    startTimeSec: 4.0,
    endTimeSec: 7.0,
    narrationText: 'Pela inércia, o Bugi escorrega pela cena com os braços girando sem parar!',
    action:
      '4–7s: Bugi escorrega pela cena; o tronco inclina; os braços se movem de forma independente; elementos do cenário passam com parallax; câmera acompanha a direção do movimento; efeito sonoro curto e engraçado.',
    anticipation: {
      enabled: false,
      frames: 0,
      crouchPx: 6,
      leanAngleDeg: -22,
    },
    characterState: 'sliding',
    characterPose: 'equilibrando',
    facialExpression: 'panico_divertido',
    camera: {
      mode: 'tracking_pan',
      panXStart: -26,
      panXEnd: -68,
      panYStart: -8,
      panYEnd: 0,
      zoomStart: 1.09,
      zoomEnd: 1.05,
      dutchAngleDeg: 2.1,
    },
    backgroundAnimation: {
      parallaxSpeed: 4.3,
      groundGlossIntensity: 1.0,
      propMotion: 'sliding_props',
    },
    soundEffect: {
      type: 'cartoon_skid',
      label: 'Efeito sonoro curto e engraçado de escorregão cartoon',
      triggerFrameOffset: 3,
      gainDb: -8,
    },
    caption: {
      text: 'Pela inércia, o Bugi escorrega pela cena com os braços girando sem parar!',
      highlightWords: ['inércia,', 'Bugi', 'escorrega', 'braços'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.0,
      gravityMps2: 9.8,
      velocityPxPerSec: 450,
      centerOfMassOffsetPx: -28,
    },
  },
  {
    id: 'pilot12-beat-4-grab-stretch',
    beatIndex: 4,
    startFrame: 210,
    endFrame: 300,
    startTimeSec: 7.0,
    endTimeSec: 10.0,
    narrationText: 'Ele tenta se segurar num poste fixo, o corpo estica todo, mas perde a pegada!',
    action:
      '7–10s: Bugi tenta se segurar em um objeto fixo; o corpo estica de maneira cartunesca; ele perde a pegada e continua deslizando; microexpressão de desespero.',
    anticipation: {
      enabled: true,
      frames: 6,
      crouchPx: 8,
      leanAngleDeg: 18,
    },
    characterState: 'grabbing_stretch',
    characterPose: 'agarrando_objeto',
    facialExpression: 'desespero',
    camera: {
      mode: 'tracking_pan',
      panXStart: -68,
      panXEnd: -94,
      panYStart: 0,
      panYEnd: -6,
      zoomStart: 1.05,
      zoomEnd: 1.11,
      dutchAngleDeg: -2.2,
    },
    backgroundAnimation: {
      parallaxSpeed: 3.4,
      groundGlossIntensity: 0.96,
      propMotion: 'sliding_props',
    },
    soundEffect: {
      type: 'boing_recovery',
      label: 'Esticamento elástico no poste + snap de perda de pegada',
      triggerFrameOffset: 10,
      gainDb: -7,
    },
    caption: {
      text: 'Ele tenta se segurar num poste fixo, o corpo estica todo, mas perde a pegada!',
      highlightWords: ['segurar', 'poste', 'estica', 'pegada!'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.0,
      gravityMps2: 9.8,
      velocityPxPerSec: 410,
      centerOfMassOffsetPx: 22,
    },
  },
  {
    id: 'pilot12-beat-5-fall-recovery',
    beatIndex: 5,
    startFrame: 300,
    endFrame: 360,
    startTimeSec: 10.0,
    endTimeSec: 12.0,
    narrationText: 'No fim do escorregão, ele cai de jeito cartunesco e reage com expressão cômica!',
    action:
      '10–12s: Bugi chega ao fim do escorregão, cai de forma cartunesca e reage com expressão cômica; animação de impacto e recuperação, sem deformar o personagem permanentemente; quadro final visualmente interessante.',
    anticipation: {
      enabled: true,
      frames: 6,
      crouchPx: 14,
      leanAngleDeg: -36,
    },
    characterState: 'impact',
    characterPose: 'reagindo_impacto',
    facialExpression: 'comico',
    camera: {
      mode: 'impact_shake',
      panXStart: -94,
      panXEnd: -42,
      panYStart: -6,
      panYEnd: 10,
      zoomStart: 1.11,
      zoomEnd: 1.08,
      dutchAngleDeg: 0,
    },
    backgroundAnimation: {
      parallaxSpeed: 0.35,
      groundGlossIntensity: 0.22,
      propMotion: 'impact_vibration',
    },
    soundEffect: {
      type: 'body_thud',
      label: 'Queda cartunesca + boing de recuperação sem deformação permanente',
      triggerFrameOffset: 14,
      gainDb: -6,
    },
    caption: {
      text: 'No fim do escorregão, ele cai de jeito cartunesco e reage com expressão cômica!',
      highlightWords: ['escorregão,', 'cai', 'cartunesco', 'cômica!'],
    },
    transition: 'elastic_wipe',
    physicsParameters: {
      frictionMu: 0.85,
      gravityMps2: 9.8,
      velocityPxPerSec: 0,
      centerOfMassOffsetPx: 0,
    },
  },
];

/**
 * ============================================================================
 * SEÇÃO 8: BEATS NARRATIVOS OBRIGATÓRIOS DO PILOTO DE 8 SEGUNDOS (240 FRAMES @ 30 FPS)
 * Tema: "E se o atrito desaparecesse?"
 * ============================================================================
 */
export const PILOT_8S_FRICTION_BEATS: AnimationBeat[] = [
  {
    id: 'pilot-beat-1-walk',
    beatIndex: 1,
    startFrame: 0,
    endFrame: 60,
    startTimeSec: 0.0,
    endTimeSec: 2.0,
    narrationText: 'O Bugi caminhava tranquilo pela rua... até o atrito sumir!',
    action:
      '0–2s: Bugi caminhando normalmente na calçada ilustrada com passos alternados (coxa, joelho, tornozelo), balanço de braços, piscada natural e follow-through no cabelo coral.',
    anticipation: {
      enabled: false,
      frames: 0,
      crouchPx: 0,
      leanAngleDeg: 3,
    },
    characterState: 'walking',
    characterPose: 'caminhando',
    facialExpression: 'confiante',
    camera: {
      mode: 'tracking_pan',
      panXStart: 20,
      panXEnd: 0,
      panYStart: 0,
      panYEnd: 0,
      zoomStart: 1.0,
      zoomEnd: 1.03,
      dutchAngleDeg: 0,
    },
    backgroundAnimation: {
      parallaxSpeed: 1.1,
      groundGlossIntensity: 0.15,
      propMotion: 'none',
    },
    soundEffect: {
      type: 'footsteps',
      label: 'Passos rítmicos na calçada',
      triggerFrameOffset: 5,
      gainDb: -12,
    },
    caption: {
      text: 'O Bugi caminhava tranquilo pela rua... até o atrito sumir!',
      highlightWords: ['Bugi', 'atrito', 'sumir!'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.65,
      gravityMps2: 9.8,
      velocityPxPerSec: 110,
      centerOfMassOffsetPx: 0,
    },
  },
  {
    id: 'pilot-beat-2-slip',
    beatIndex: 2,
    startFrame: 60,
    endFrame: 120,
    startTimeSec: 2.0,
    endTimeSec: 4.0,
    narrationText: 'O atrito zera! O pé escorrega, ele tenta frear e perde o equilíbrio!',
    action:
      '2–4s: O coeficiente de atrito cai para zero (μ = 0). Antecipação de frenagem, o pé dispara à frente, Bugi perde o equilíbrio com reação de surpresa nos olhos e sobrancelhas.',
    anticipation: {
      enabled: true,
      frames: 8,
      crouchPx: 18,
      leanAngleDeg: -18,
    },
    characterState: 'surprise',
    characterPose: 'escorregando',
    facialExpression: 'surpreso',
    camera: {
      mode: 'dramatic_push',
      panXStart: 0,
      panXEnd: -28,
      panYStart: 0,
      panYEnd: -10,
      zoomStart: 1.03,
      zoomEnd: 1.09,
      dutchAngleDeg: -1.8,
    },
    backgroundAnimation: {
      parallaxSpeed: 2.6,
      groundGlossIntensity: 0.92,
      propMotion: 'sliding_props',
    },
    soundEffect: {
      type: 'slip_whoosh',
      label: 'Assobio de escorregão sem atrito',
      triggerFrameOffset: 6,
      gainDb: -8,
    },
    caption: {
      text: 'O atrito zera! O pé escorrega, ele tenta frear e perde o equilíbrio!',
      highlightWords: ['atrito', 'zera!', 'escorrega,', 'equilíbrio!'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.0,
      gravityMps2: 9.8,
      velocityPxPerSec: 340,
      centerOfMassOffsetPx: -24,
    },
  },
  {
    id: 'pilot-beat-3-slide-flail',
    beatIndex: 3,
    startFrame: 120,
    endFrame: 180,
    startTimeSec: 4.0,
    endTimeSec: 6.0,
    narrationText: 'Pela inércia, o Bugi continua deslizando e gira os braços sem parar!',
    action:
      '4–6s: Bugi desliza em alta velocidade. O tronco se inclina, os braços articulam em moinho (ombros e cotovelos) tentando equilibrá-lo e a câmera acompanha o deslocamento.',
    anticipation: {
      enabled: false,
      frames: 0,
      crouchPx: 6,
      leanAngleDeg: -22,
    },
    characterState: 'panic',
    characterPose: 'equilibrando',
    facialExpression: 'panico_divertido',
    camera: {
      mode: 'tracking_pan',
      panXStart: -28,
      panXEnd: -72,
      panYStart: -10,
      panYEnd: 0,
      zoomStart: 1.09,
      zoomEnd: 1.05,
      dutchAngleDeg: 2.2,
    },
    backgroundAnimation: {
      parallaxSpeed: 4.2,
      groundGlossIntensity: 1.0,
      propMotion: 'sliding_props',
    },
    soundEffect: {
      type: 'cartoon_skid',
      label: 'Moinho de braços cartoon + derrapagem',
      triggerFrameOffset: 2,
      gainDb: -9,
    },
    caption: {
      text: 'Pela inércia, o Bugi continua deslizando e gira os braços sem parar!',
      highlightWords: ['inércia,', 'Bugi', 'deslizando', 'braços'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: 0.0,
      gravityMps2: 9.8,
      velocityPxPerSec: 460,
      centerOfMassOffsetPx: -30,
    },
  },
  {
    id: 'pilot-beat-4-impact-recovery',
    beatIndex: 4,
    startFrame: 180,
    endFrame: 240,
    startTimeSec: 6.0,
    endTimeSec: 8.0,
    narrationText: 'Quando o atrito volta de repente... o tombo elástico é inevitável!',
    action:
      '6–8s: O atrito retorna, Bugi cai de forma cartunesca, comprime o corpo no impacto com o chão (squash & stretch) e senta reagindo com expressão engraçada.',
    anticipation: {
      enabled: true,
      frames: 6,
      crouchPx: 14,
      leanAngleDeg: -38,
    },
    characterState: 'impact',
    characterPose: 'caindo',
    facialExpression: 'deslumbrado',
    camera: {
      mode: 'impact_shake',
      panXStart: -72,
      panXEnd: -40,
      panYStart: 0,
      panYEnd: 12,
      zoomStart: 1.05,
      zoomEnd: 1.11,
      dutchAngleDeg: 0,
    },
    backgroundAnimation: {
      parallaxSpeed: 0.4,
      groundGlossIntensity: 0.25,
      propMotion: 'impact_vibration',
    },
    soundEffect: {
      type: 'body_thud',
      label: 'Impacto cartunesco + boing elástico',
      triggerFrameOffset: 15,
      gainDb: -6,
    },
    caption: {
      text: 'Quando o atrito volta de repente... o tombo elástico é inevitável!',
      highlightWords: ['atrito', 'tombo', 'elástico', 'inevitável!'],
    },
    transition: 'elastic_wipe',
    physicsParameters: {
      frictionMu: 0.85,
      gravityMps2: 9.8,
      velocityPxPerSec: 0,
      centerOfMassOffsetPx: 0,
    },
  },
];

/**
 * Converte uma cena do Storyboard em um AnimationBeat determinístico
 */
export function buildBeatForStoryboardScene(
  scene: StoryboardScene,
  fps = 30
): AnimationBeat {
  const startFrame = Math.max(0, Math.round(scene.startTimeSec * fps));
  const endFrame = Math.max(startFrame + 15, Math.round(scene.endTimeSec * fps));
  const state = mapPoseToAnimationState(scene.bugiPose);
  const isSliding =
    state === 'sliding' || state === 'panic' || state === 'running';

  return {
    id: `beat-${scene.id}`,
    beatIndex: scene.order,
    startFrame,
    endFrame,
    startTimeSec: scene.startTimeSec,
    endTimeSec: scene.endTimeSec,
    narrationText: scene.correspondingText,
    action: scene.mainAction,
    anticipation: {
      enabled: state === 'surprise' || state === 'anticipation' || state === 'impact',
      frames: 8,
      crouchPx: 14,
      leanAngleDeg: isSliding ? -18 : 6,
    },
    characterState: state,
    characterPose: scene.bugiPose,
    facialExpression: scene.bugiExpression,
    camera: {
      mode:
        state === 'impact'
          ? 'impact_shake'
          : isSliding
          ? 'tracking_pan'
          : 'dramatic_push',
      panXStart: 0,
      panXEnd: isSliding ? -48 : 0,
      panYStart: 0,
      panYEnd: 0,
      zoomStart: 1.0,
      zoomEnd: 1.06,
      dutchAngleDeg: isSliding ? -1.5 : 0,
    },
    backgroundAnimation: {
      parallaxSpeed: isSliding ? 3.2 : 1.0,
      groundGlossIntensity: isSliding ? 0.9 : 0.2,
      propMotion: isSliding ? 'sliding_props' : 'none',
    },
    soundEffect: {
      type:
        state === 'impact' || state === 'falling'
          ? 'body_thud'
          : isSliding
          ? 'slip_whoosh'
          : 'footsteps',
      label: scene.soundEffects?.[0] || 'Efeito sonoro sincronizado',
      triggerFrameOffset: 4,
      gainDb: -9,
    },
    caption: {
      text: scene.subtitlesText || scene.correspondingText,
      highlightWords: ['Bugi', 'atrito', 'zero', 'inércia', '5', 'segundos'],
    },
    transition: 'match_action',
    physicsParameters: {
      frictionMu: isSliding ? 0.0 : 0.65,
      gravityMps2: scene.scenarioPreset === 'parque_gravidade' ? 4.9 : 9.8,
      velocityPxPerSec: isSliding ? 360 : 100,
      centerOfMassOffsetPx: isSliding ? -20 : 0,
    },
  };
}

/**
 * Retorno completo da cinemática multi-articulada do Bugi (em espaço local 540×960, chão Y=685)
 */
export interface BugiMultiJointRigState {
  state: BugiAnimationState;
  pose: BugiPose;
  expression: BugiExpression;
  rootX: number;
  rootY: number;
  groundY: 685;
  torsoRotationDeg: number;
  squashX: number;
  stretchY: number;
  neckAngleDeg: number;
  headRotationDeg: number;
  headOffsetY: number;
  hairFollowDeg: number;
  hairStretchY: number;
  // Olhos, sobrancelhas e boca
  pupilOffsetX: number;
  pupilOffsetY: number;
  eyeScaleX: number;
  eyeScaleY: number;
  isBlinking: boolean;
  leftBrowDeg: number;
  rightBrowDeg: number;
  browOffsetY: number;
  mouthOpenness: number;
  mouthShape: 'smile' | 'open_o' | 'panic_wave' | 'grin' | 'determined';
  // Articulações dos membros superiores (relativas à raiz do tronco)
  leftShoulder: { x: number; y: number; angleDeg: number };
  leftElbow: { x: number; y: number; angleDeg: number };
  leftWrist: { x: number; y: number; handAngleDeg: number };
  rightShoulder: { x: number; y: number; angleDeg: number };
  rightElbow: { x: number; y: number; angleDeg: number };
  rightWrist: { x: number; y: number; handAngleDeg: number };
  // Articulações dos membros inferiores (relativas à raiz do tronco)
  leftHip: { x: number; y: number; angleDeg: number };
  leftKnee: { x: number; y: number; angleDeg: number };
  leftAnkle: { x: number; y: number };
  leftFoot: { x: number; y: number; rotDeg: number };
  rightHip: { x: number; y: number; angleDeg: number };
  rightKnee: { x: number; y: number; angleDeg: number };
  rightAnkle: { x: number; y: number };
  rightFoot: { x: number; y: number; rotDeg: number };
  // Efeitos físicos secundários
  motionLines: boolean;
  impactShockwave: boolean;
  shockwaveRadius: number;
  shockwaveOpacity: number;
  recoveryStars: boolean;
  sweatDrops?: boolean;
  stretchTensionLines?: boolean;
  hasLostGrip?: boolean;
  grabAnchorPoint?: { x: number; y: number };
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calcula a cinemática direta (Forward Kinematics) de todos os pivôs independentes do Bugi:
 * - Ombro -> Cotovelo -> Punho -> Mão
 * - Quadril -> Joelho -> Tornozelo -> Tênis (com restrição de contato no solo Y = 685)
 * - Pescoço -> Cabeça -> Cabelo Coral (follow-through)
 */
export function computeBugiMultiJointRig(params: {
  pose: BugiPose;
  expression?: BugiExpression;
  stateOverride?: BugiAnimationState;
  frame?: number;
  fps?: number;
  speechIntensity?: number;
}): BugiMultiJointRigState {
  const {
    pose,
    expression = 'curioso',
    stateOverride,
    frame = 0,
    fps = 30,
    speechIntensity = 0.3,
  } = params;

  const state = stateOverride || mapPoseToAnimationState(pose);
  const t = frame / Math.max(1, fps);
  const phase = t * Math.PI * 2;
  const groundY = 685 as const;

  // Ângulos articulares base (em graus: 0° = vertical para baixo nos membros)
  let rootX = 270;
  let rootY = 496;
  let torsoRotationDeg = 0;
  let leftShoulderDeg = 22;
  let leftElbowDeg = -20;
  let rightShoulderDeg = -22;
  let rightElbowDeg = -20;
  let leftHipDeg = -6;
  let leftKneeDeg = 8;
  let leftFootDeg = 0;
  let rightHipDeg = 6;
  let rightKneeDeg = 8;
  let rightFootDeg = 0;

  let motionLines = false;
  let impactShockwave = false;
  let shockwaveRadius = 0;
  let shockwaveOpacity = 0;
  let recoveryStars = false;
  let sweatDrops = expression === 'desespero' || state === 'grabbing_stretch';
  let stretchTensionLines = false;
  let hasLostGrip = false;
  let grabAnchorPoint: { x: number; y: number } | undefined;
  let leftArmLengthMultiplier = 1.0;

  const sq = squashAndStretch(state, frame, fps);
  let squashX = sq.squashX;
  let stretchY = sq.stretchY;

  if (state === 'walking' || pose === 'caminhando') {
    const wc = walkCycle(frame, fps, 1.0);
    rootX = 258 + wc.horizontalProgressPx;
    rootY = 496 + wc.pelvisBobY;
    torsoRotationDeg = wc.torsoLeanDeg;
    leftHipDeg = wc.leftHipDeg;
    leftKneeDeg = wc.leftKneeDeg;
    leftFootDeg = wc.leftFootDeg;
    rightHipDeg = wc.rightHipDeg;
    rightKneeDeg = wc.rightKneeDeg;
    rightFootDeg = wc.rightFootDeg;
    leftShoulderDeg = wc.leftShoulderDeg;
    leftElbowDeg = wc.leftElbowDeg;
    rightShoulderDeg = wc.rightShoulderDeg;
    rightElbowDeg = wc.rightElbowDeg;
  } else if (state === 'running' || pose === 'correndo') {
    const rc = walkCycle(frame, fps, 1.45);
    rootX = 270 + Math.sin(phase * 1.4) * 14;
    rootY = 492 + rc.pelvisBobY * 1.25;
    torsoRotationDeg = 15 + Math.sin(phase * 2.4) * 4;
    leftHipDeg = rc.leftHipDeg * 1.25;
    leftKneeDeg = rc.leftKneeDeg * 1.2;
    leftFootDeg = rc.leftFootDeg * 1.3;
    rightHipDeg = rc.rightHipDeg * 1.25;
    rightKneeDeg = rc.rightKneeDeg * 1.2;
    rightFootDeg = rc.rightFootDeg * 1.3;
    leftShoulderDeg = rc.leftShoulderDeg * 1.3;
    leftElbowDeg = -48;
    rightShoulderDeg = rc.rightShoulderDeg * 1.3;
    rightElbowDeg = -48;
    motionLines = true;
  } else if (pose === 'pulando') {
    const jumpCycle = (t % 1.6) / 1.6;
    const isAnti = jumpCycle < 0.22;
    const air = isAnti ? 0 : Math.sin(((jumpCycle - 0.22) / 0.78) * Math.PI);
    rootY = isAnti ? 518 : 494 - air * 92;
    torsoRotationDeg = isAnti ? 10 : -8 * air;
    squashX = isAnti ? 1.14 : air > 0.6 ? 0.91 : 1.0;
    stretchY = isAnti ? 0.87 : air > 0.6 ? 1.1 : 1.0;
    leftShoulderDeg = isAnti ? 42 : -135;
    leftElbowDeg = isAnti ? -35 : -20;
    rightShoulderDeg = isAnti ? -42 : 135;
    rightElbowDeg = isAnti ? 35 : 20;
    leftHipDeg = isAnti ? -38 : -28;
    leftKneeDeg = isAnti ? 65 : 46;
    rightHipDeg = isAnti ? 28 : 34;
    rightKneeDeg = isAnti ? 65 : 52;
    motionLines = true;
  } else if (state === 'grabbing_stretch' || pose === 'agarrando_objeto') {
    // Beat 4 (7–10s): Bugi tenta se segurar no poste fixo, o corpo estica de maneira cartunesca, perde a pegada e continua deslizando
    const gs = grabAndStretchReaction(frame, fps);
    rootX = gs.rootX;
    rootY = gs.rootY;
    torsoRotationDeg = gs.torsoTiltDeg;
    squashX = gs.bodyStretchX;
    stretchY = gs.bodySquashY;
    leftArmLengthMultiplier = gs.leftArmStretchFactor;
    hasLostGrip = gs.hasLostGrip;
    grabAnchorPoint = gs.grabAnchorPoint;
    stretchTensionLines = !gs.hasLostGrip;
    sweatDrops = true;
    motionLines = true;

    if (!gs.hasLostGrip) {
      // Mão esquerda esticada para trás segurando no poste fixo enquanto o braço direito tenta equilibrar
      leftShoulderDeg = 94;
      leftElbowDeg = 4;
      rightShoulderDeg = -85 + Math.sin(phase * 4) * 26;
      rightElbowDeg = -28 + Math.cos(phase * 4) * 18;
      leftHipDeg = 42;
      leftKneeDeg = 18;
      leftFootDeg = 22;
      rightHipDeg = -48;
      rightKneeDeg = 14;
      rightFootDeg = -24;
    } else {
      // Perdeu a pegada! Braços entram em chicote/flail desesperado enquanto continua deslizando
      const fl = armFlail(frame, fps, 1.15);
      leftShoulderDeg = fl.leftShoulderDeg;
      leftElbowDeg = fl.leftElbowDeg;
      rightShoulderDeg = fl.rightShoulderDeg;
      rightElbowDeg = fl.rightElbowDeg;
      leftHipDeg = 36 + Math.sin(phase * 3) * 18;
      leftKneeDeg = 24;
      leftFootDeg = 18;
      rightHipDeg = -46 - Math.sin(phase * 3) * 18;
      rightKneeDeg = 16;
      rightFootDeg = -22;
    }
  } else if (state === 'surprise' || (pose === 'escorregando' && frame < 30)) {
    const sr = slipReaction(frame, fps);
    rootX = 266 + Math.min(48, sr.slipSlideX);
    rootY = 500 + sr.anticipationCrouchY;
    torsoRotationDeg = sr.torsoSlipTiltDeg;
    leftHipDeg = sr.trailHipDeg;
    leftKneeDeg = sr.trailKneeDeg;
    leftFootDeg = 18;
    rightHipDeg = sr.leadHipDeg;
    rightKneeDeg = sr.leadKneeDeg;
    rightFootDeg = -28;
    const fl = armFlail(frame, fps, 0.85);
    leftShoulderDeg = fl.leftShoulderDeg;
    leftElbowDeg = fl.leftElbowDeg;
    rightShoulderDeg = fl.rightShoulderDeg;
    rightElbowDeg = fl.rightElbowDeg;
    motionLines = true;
  } else if (state === 'sliding' || state === 'panic' || pose === 'escorregando' || pose === 'equilibrando') {
    const fl = armFlail(frame, fps, 1.05);
    const slideOsc = Math.sin(phase * 2.1);
    rootX = 278 + slideOsc * 16;
    rootY = 504 + Math.abs(slideOsc) * 6;
    torsoRotationDeg = -21 + slideOsc * 6;
    leftShoulderDeg = fl.leftShoulderDeg;
    leftElbowDeg = fl.leftElbowDeg;
    rightShoulderDeg = fl.rightShoulderDeg;
    rightElbowDeg = fl.rightElbowDeg;
    // Pernas em tesoura deslizando sobre o piso sem atrito
    leftHipDeg = 34 + slideOsc * 18;
    leftKneeDeg = 28 - slideOsc * 10;
    leftFootDeg = 20;
    rightHipDeg = -46 - slideOsc * 18;
    rightKneeDeg = 14 + slideOsc * 10;
    rightFootDeg = -24;
    motionLines = true;
  } else if (state === 'falling' || state === 'impact' || state === 'recovery' || pose === 'caindo' || pose === 'reagindo_impacto') {
    const imp = bodyImpact(frame, fps);
    rootX = 275 + Math.cos(phase * 1.35) * 6;
    rootY = 496 + imp.fallDropY;
    torsoRotationDeg = imp.bodyRotationDeg;
    squashX = imp.impactSquashX;
    stretchY = imp.impactStretchY;
    impactShockwave = imp.isGroundedImpact;
    shockwaveRadius = imp.shockwaveRadius;
    shockwaveOpacity = imp.shockwaveOpacity;
    recoveryStars = imp.recoverySitUpProgress > 0.2;

    const fl = armFlail(frame, fps, 1 - imp.recoverySitUpProgress * 0.6);
    leftShoulderDeg = -110 + imp.recoverySitUpProgress * 75 + fl.leftShoulderDeg * 0.25;
    leftElbowDeg = -35;
    rightShoulderDeg = 105 - imp.recoverySitUpProgress * 60 + fl.rightShoulderDeg * 0.25;
    rightElbowDeg = 32;

    leftHipDeg = -55 + imp.recoverySitUpProgress * 25;
    leftKneeDeg = 35 + imp.recoverySitUpProgress * 25;
    leftFootDeg = -30;
    rightHipDeg = -72 + imp.recoverySitUpProgress * 30;
    rightKneeDeg = 25 + imp.recoverySitUpProgress * 20;
    rightFootDeg = -22;
    motionLines = true;
  } else if (pose === 'assustando') {
    const jolt = Math.abs(Math.sin(phase * 1.65 + 0.25));
    rootY = 482 - jolt * 18;
    torsoRotationDeg = -8 + jolt * 4;
    squashX = Number((0.91 + jolt * 0.06).toFixed(3));
    stretchY = Number((1.1 - jolt * 0.05).toFixed(3));
    leftShoulderDeg = -128 - jolt * 14;
    leftElbowDeg = -25;
    rightShoulderDeg = 128 + jolt * 14;
    rightElbowDeg = 25;
    leftHipDeg = -22;
    leftKneeDeg = 26;
    rightHipDeg = 22;
    rightKneeDeg = 26;
    motionLines = true;
  } else if (state === 'celebrating' || pose === 'comemorando') {
    const cheer = Math.sin(phase * 1.6 + 0.3);
    rootY = 492 - Math.abs(cheer) * 14;
    torsoRotationDeg = cheer * 5;
    leftShoulderDeg = -142 + cheer * 16;
    leftElbowDeg = -22;
    rightShoulderDeg = 142 - cheer * 16;
    rightElbowDeg = 22;
    leftHipDeg = -14 + cheer * 8;
    leftKneeDeg = 16;
    rightHipDeg = 14 - cheer * 8;
    rightKneeDeg = 16;
  } else if (pose === 'apontando') {
    const pulse = Math.sin(phase * 1.35 + 0.2);
    rootY = 496;
    torsoRotationDeg = 5 + pulse * 2;
    leftShoulderDeg = 28;
    leftElbowDeg = -38;
    rightShoulderDeg = -102 + pulse * 6;
    rightElbowDeg = -8;
    leftHipDeg = -10;
    leftKneeDeg = 8;
    rightHipDeg = 12;
    rightKneeDeg = 8;
  } else if (pose === 'agachando') {
    const crouch = Math.sin(phase * 1.25 + 0.25);
    rootY = 532 + crouch * 4;
    torsoRotationDeg = 12 + crouch * 2;
    squashX = 1.12;
    stretchY = 0.88;
    leftShoulderDeg = 36;
    leftElbowDeg = -55;
    rightShoulderDeg = -36;
    rightElbowDeg = 55;
    leftHipDeg = -48;
    leftKneeDeg = 78;
    rightHipDeg = 42;
    rightKneeDeg = 78;
  } else if (pose === 'flutuando') {
    const hover = Math.sin(phase * 0.9);
    rootY = 425 + hover * 16;
    torsoRotationDeg = -8 + hover * 4;
    leftShoulderDeg = -68 + hover * 14;
    leftElbowDeg = -28;
    rightShoulderDeg = 74 - hover * 14;
    rightElbowDeg = 28;
    leftHipDeg = -24 + hover * 8;
    leftKneeDeg = 38;
    rightHipDeg = 20 - hover * 8;
    rightKneeDeg = 44;
  } else {
    // idle / olhando_objeto / investigando / confiante_parado
    const nod = Math.sin(phase * 0.9 + 0.3);
    rootY = 496 + nod * 2.5;
    torsoRotationDeg = (pose === 'olhando_objeto' || pose === 'investigando' ? 7 : 0) + nod * 2;
    leftShoulderDeg = 24 + nod * 4;
    leftElbowDeg = -28;
    rightShoulderDeg =
      pose === 'olhando_objeto' || pose === 'investigando'
        ? -68 + nod * 8
        : -24 - nod * 4;
    rightElbowDeg =
      pose === 'olhando_objeto' || pose === 'investigando' ? -72 : 28;
    leftHipDeg = -8;
    leftKneeDeg = 6;
    rightHipDeg = 8;
    rightKneeDeg = 6;
  }

  // Forward Kinematics: Braços (Upper Arm = 46px, Forearm = 42px; multiplicador elástico no braço esquerdo em grabbing_stretch)
  const lShoulderPivot = { x: -46, y: -24 };
  const rShoulderPivot = { x: 46, y: -24 };
  const upperArmLen = 46;
  const forearmLen = 42;
  const lUpperLen = upperArmLen * leftArmLengthMultiplier;
  const lForearmLen = forearmLen * leftArmLengthMultiplier;

  const lShoulderRad = degToRad(leftShoulderDeg);
  const lElbowX = lShoulderPivot.x - Math.sin(lShoulderRad) * lUpperLen;
  const lElbowY = lShoulderPivot.y + Math.cos(lShoulderRad) * lUpperLen;
  const lForearmRad = degToRad(leftShoulderDeg + leftElbowDeg);
  const lWristX = lElbowX - Math.sin(lForearmRad) * lForearmLen;
  const lWristY = lElbowY + Math.cos(lForearmRad) * lForearmLen;

  const rShoulderRad = degToRad(rightShoulderDeg);
  const rElbowX = rShoulderPivot.x - Math.sin(rShoulderRad) * upperArmLen;
  const rElbowY = rShoulderPivot.y + Math.cos(rShoulderRad) * upperArmLen;
  const rForearmRad = degToRad(rightShoulderDeg + rightElbowDeg);
  const rWristX = rElbowX - Math.sin(rForearmRad) * forearmLen;
  const rWristY = rElbowY + Math.cos(rForearmRad) * forearmLen;

  // Forward Kinematics: Pernas (Thigh = 52px, Shin = 50px)
  const lHipPivot = { x: -24, y: 68 };
  const rHipPivot = { x: 24, y: 68 };
  const thighLen = 52;
  const shinLen = 50;

  const lHipRad = degToRad(leftHipDeg);
  const lKneeX = lHipPivot.x - Math.sin(lHipRad) * thighLen;
  const lKneeY = lHipPivot.y + Math.cos(lHipRad) * thighLen;
  const lShinRad = degToRad(leftHipDeg + leftKneeDeg);
  const lAnkleX = lKneeX - Math.sin(lShinRad) * shinLen;
  // Restrição de solo: evita que o tornozelo/tênis atravesse o chão de forma incoerente
  const maxLocalAnkleY = groundY - rootY - 16;
  const lAnkleY = Math.min(maxLocalAnkleY, lKneeY + Math.cos(lShinRad) * shinLen);

  const rHipRad = degToRad(rightHipDeg);
  const rKneeX = rHipPivot.x - Math.sin(rHipRad) * thighLen;
  const rKneeY = rHipPivot.y + Math.cos(rHipRad) * thighLen;
  const rShinRad = degToRad(rightHipDeg + rightKneeDeg);
  const rAnkleX = rKneeX - Math.sin(rShinRad) * shinLen;
  const rAnkleY = Math.min(maxLocalAnkleY, rKneeY + Math.cos(rShinRad) * shinLen);

  // Cabeça, pescoço e follow-through do cabelo
  const hf = headFollow(frame, fps, torsoRotationDeg, rootY - 496);
  const eyes = eyeReaction(frame, fps, state, expression);

  const mouthOpenness = Math.max(
    0.12,
    Math.min(
      1.0,
      speechIntensity * 0.8 + Math.abs(Math.sin(phase * 1.5)) * 0.22
    )
  );

  let mouthShape: BugiMultiJointRigState['mouthShape'] = 'smile';
  if (state === 'surprise' || expression === 'surpreso' || pose === 'assustando') {
    mouthShape = 'open_o';
  } else if (
    state === 'grabbing_stretch' ||
    state === 'panic' ||
    state === 'sliding' ||
    state === 'falling' ||
    expression === 'panico_divertido' ||
    expression === 'desespero'
  ) {
    mouthShape = 'panic_wave';
  } else if (
    state === 'celebrating' ||
    state === 'recovery' ||
    expression === 'deslumbrado' ||
    expression === 'comico'
  ) {
    mouthShape = 'grin';
  } else if (expression === 'determinado') {
    mouthShape = 'determined';
  }

  return {
    state,
    pose,
    expression,
    rootX: Number(rootX.toFixed(2)),
    rootY: Number(rootY.toFixed(2)),
    groundY,
    torsoRotationDeg: Number(torsoRotationDeg.toFixed(2)),
    squashX,
    stretchY,
    neckAngleDeg: hf.neckAngleDeg,
    headRotationDeg: hf.headAngleDeg,
    headOffsetY: Number((-Math.abs(Math.sin(phase)) * 3).toFixed(2)),
    hairFollowDeg: hf.hairFollowDeg,
    hairStretchY: hf.hairStretchY,
    pupilOffsetX: eyes.pupilX,
    pupilOffsetY: eyes.pupilY,
    eyeScaleX: eyes.eyeScaleX,
    eyeScaleY: eyes.eyeScaleY,
    isBlinking: eyes.isBlinking,
    leftBrowDeg: eyes.leftBrowDeg,
    rightBrowDeg: eyes.rightBrowDeg,
    browOffsetY: eyes.browOffsetY,
    mouthOpenness: Number(mouthOpenness.toFixed(3)),
    mouthShape,
    leftShoulder: {
      x: lShoulderPivot.x,
      y: lShoulderPivot.y,
      angleDeg: Number(leftShoulderDeg.toFixed(1)),
    },
    leftElbow: {
      x: Number(lElbowX.toFixed(1)),
      y: Number(lElbowY.toFixed(1)),
      angleDeg: Number(leftElbowDeg.toFixed(1)),
    },
    leftWrist: {
      x: Number(lWristX.toFixed(1)),
      y: Number(lWristY.toFixed(1)),
      handAngleDeg: Number((leftShoulderDeg + leftElbowDeg).toFixed(1)),
    },
    rightShoulder: {
      x: rShoulderPivot.x,
      y: rShoulderPivot.y,
      angleDeg: Number(rightShoulderDeg.toFixed(1)),
    },
    rightElbow: {
      x: Number(rElbowX.toFixed(1)),
      y: Number(rElbowY.toFixed(1)),
      angleDeg: Number(rightElbowDeg.toFixed(1)),
    },
    rightWrist: {
      x: Number(rWristX.toFixed(1)),
      y: Number(rWristY.toFixed(1)),
      handAngleDeg: Number((rightShoulderDeg + rightElbowDeg).toFixed(1)),
    },
    leftHip: {
      x: lHipPivot.x,
      y: lHipPivot.y,
      angleDeg: Number(leftHipDeg.toFixed(1)),
    },
    leftKnee: {
      x: Number(lKneeX.toFixed(1)),
      y: Number(lKneeY.toFixed(1)),
      angleDeg: Number(leftKneeDeg.toFixed(1)),
    },
    leftAnkle: {
      x: Number(lAnkleX.toFixed(1)),
      y: Number(lAnkleY.toFixed(1)),
    },
    leftFoot: {
      x: Number((lAnkleX - 18).toFixed(1)),
      y: Number(lAnkleY.toFixed(1)),
      rotDeg: Number(leftFootDeg.toFixed(1)),
    },
    rightHip: {
      x: rHipPivot.x,
      y: rHipPivot.y,
      angleDeg: Number(rightHipDeg.toFixed(1)),
    },
    rightKnee: {
      x: Number(rKneeX.toFixed(1)),
      y: Number(rKneeY.toFixed(1)),
      angleDeg: Number(rightKneeDeg.toFixed(1)),
    },
    rightAnkle: {
      x: Number(rAnkleX.toFixed(1)),
      y: Number(rAnkleY.toFixed(1)),
    },
    rightFoot: {
      x: Number((rAnkleX - 14).toFixed(1)),
      y: Number(rAnkleY.toFixed(1)),
      rotDeg: Number(rightFootDeg.toFixed(1)),
    },
    motionLines,
    impactShockwave,
    shockwaveRadius: Number(shockwaveRadius.toFixed(1)),
    shockwaveOpacity: Number(shockwaveOpacity.toFixed(2)),
    recoveryStars,
    sweatDrops,
    stretchTensionLines,
    hasLostGrip,
    grabAnchorPoint,
  };
}
