import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { computeBugiArticulatedKinematics } from '../src/components/BugiCharacterSvg';
import {
  PILOT_12S_FRICTION_BEATS,
  cameraTracking,
  parallaxMotion,
  objectInteraction
} from '../src/remotion/animation/bugiRigAndBeatsEngine';
import {
  buildSkillReelWordCues,
  groupWordCuesIntoPages
} from '../src/utils/skillReelAndHyperFrames';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TOTAL_FRAMES = 360; // 12s @ 30 FPS
const FPS = 30;

function renderFrameHtml(frameNumber: number): string {
  const currentEpisodeTimeSec = frameNumber / FPS;
  const beat = PILOT_12S_FRICTION_BEATS.find(
    (b) => frameNumber >= b.startFrame && frameNumber < b.endFrame
  ) || PILOT_12S_FRICTION_BEATS[PILOT_12S_FRICTION_BEATS.length - 1];

  const cam = cameraTracking(frameNumber, FPS, beat);
  const px = parallaxMotion(frameNumber, cam.panX, beat.backgroundAnimation.parallaxSpeed);
  const propState = objectInteraction(frameNumber, beat);
  const glossOpacity = beat.backgroundAnimation.groundGlossIntensity;

  const k = computeBugiArticulatedKinematics(
    beat.characterPose,
    frameNumber,
    FPS,
    0.35,
    beat.facialExpression,
    beat.characterState
  );

  // Subtitles Skill Reel
  const cues = buildSkillReelWordCues(beat.caption.text, beat.startTimeSec, beat.endTimeSec);
  const pages = groupWordCuesIntoPages(cues, 5);
  const activePage = pages.find(
    (p) => currentEpisodeTimeSec >= p.startSec && currentEpisodeTimeSec <= p.endSec
  ) || pages[0];

  const wordsHtml = activePage
    ? activePage.words.map((w, idx) => {
        const isSpeaking = currentEpisodeTimeSec >= w.startSec && currentEpisodeTimeSec <= w.endSec;
        const color = isSpeaking ? (w.highlightColor || '#FFD166') : '#FFF7E9';
        const scale = isSpeaking ? 1.15 : 1.0;
        return `<span style="color: ${color}; transform: scale(${scale}); text-shadow: -3px -3px 0 #050B11, 3px -3px 0 #050B11, -3px 3px 0 #050B11, 3px 3px 0 #050B11, 0 6px 12px rgba(0,0,0,0.8); display: inline-block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900; font-size: 54px; text-transform: uppercase; margin: 0 10px;">${w.word}</span>`;
      }).join(' ')
    : '';

  // Intervenção cômica
  const isPopIn = frameNumber >= 25 && frameNumber <= 75;
  const popInScale = frameNumber < 35
    ? 0.7 + ((frameNumber - 25) / 10) * 0.4
    : frameNumber > 65
    ? 1.1 - ((frameNumber - 65) / 10) * 0.3
    : 1.1;
  const popInOpacity = frameNumber < 30
    ? (frameNumber - 25) / 5
    : frameNumber > 70
    ? 1 - (frameNumber - 70) / 5
    : 1;

  const popInHtml = isPopIn
    ? `<div style="position: absolute; left: 80px; right: 80px; top: 90px; display: flex; justify-content: center; transform: scale(${popInScale}) rotate(-2deg); opacity: ${popInOpacity}; z-index: 75;">
        <div style="padding: 12px 32px; border-radius: 20px; background-color: #FF6B50; border: 4px solid #FFF7E9; box-shadow: 0 16px 32px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 34px; font-weight: 900; font-family: 'Bricolage Grotesque', sans-serif; color: #FFF7E9; text-transform: uppercase; text-shadow: 0 3px 0 #060D14;">
            ⚡ SEM ATRITO?!
          </span>
        </div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1080px; height: 1920px; overflow: hidden; background: #08121B; }
  </style>
</head>
<body>
  <div style="position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #08121B;">
    <!-- Camera Transform -->
    <div style="position: absolute; inset: 0; width: 1080px; height: 1920px; transform: translate(${(cam.panX * 0.45).toFixed(1)}px, ${(cam.panY * 0.45).toFixed(1)}px) scale(${cam.zoom.toFixed(3)}) rotate(${cam.dutchAngleDeg.toFixed(2)}deg); transform-origin: 540px 1120px;">
      <!-- SVG Multi-Layer Background + Characters -->
      <svg viewBox="0 0 1080 1920" style="position: absolute; inset: 0; width: 1080px; height: 1920px; display: block;">
        <!-- Layer 1: Sky & Background -->
        <rect width="1080" height="1370" fill="#091624" />
        <g transform="translate(${(px.skyOffsetX % 260).toFixed(1)}, 0)">
          <circle cx="880" cy="285" r="78" fill="#FFD166" opacity="0.88" />
          <circle cx="880" cy="285" r="102" fill="#FFD166" opacity="0.16" />
          <rect x="140" y="235" width="220" height="44" rx="22" fill="#132A40" opacity="0.7" />
          <rect x="520" y="185" width="180" height="38" rx="19" fill="#132A40" opacity="0.55" />
          <rect x="-120" y="560" width="210" height="810" fill="#0D1E2E" />
          <rect x="110" y="470" width="240" height="900" fill="#0E2233" />
          <rect x="380" y="520" width="210" height="850" fill="#0D1E2E" />
          <rect x="620" y="440" width="260" height="930" fill="#0E2233" />
          <rect x="910" y="510" width="250" height="860" fill="#0D1E2E" />
        </g>
        <!-- Layer 2: Middle-ground Buildings -->
        <g transform="translate(${(px.midgroundOffsetX % 540).toFixed(1)}, 0)">
          <rect x="45" y="390" width="310" height="980" rx="18" fill="#122638" stroke="#1E3F5A" stroke-width="4" />
          <!-- Janelas Iluminadas -->
          <rect x="90" y="450" width="64" height="76" rx="8" fill="#FFD166" opacity="0.82" />
          <rect x="195" y="450" width="64" height="76" rx="8" fill="#39C8D5" opacity="0.72" />
          <rect x="90" y="560" width="64" height="76" rx="8" fill="#FFF7E9" opacity="0.82" />
          <rect x="195" y="560" width="64" height="76" rx="8" fill="#FFD166" opacity="0.72" />
          <rect x="90" y="670" width="64" height="76" rx="8" fill="#FFD166" opacity="0.82" />
          <rect x="195" y="670" width="64" height="76" rx="8" fill="#39C8D5" opacity="0.72" />
          <!-- Toldo da loja térrea -->
          <path d="M 30 1070 L 370 1070 L 352 1138 L 12 1138 Z" fill="#FF6B50" stroke="#060D14" stroke-width="5" />
          <rect x="72" y="1145" width="250" height="225" rx="10" fill="#0E1F2E" stroke="#39C8D5" stroke-width="3" />

          <!-- Edifício 2 Central -->
          <rect x="395" y="290" width="340" height="1080" rx="18" fill="#152C40" stroke="#234968" stroke-width="4" />
          <rect x="445" y="350" width="74" height="82" rx="8" fill="#FFF7E9" opacity="0.8" />
          <rect x="565" y="350" width="74" height="82" rx="8" fill="#FFD166" opacity="0.7" />
          <rect x="445" y="465" width="74" height="82" rx="8" fill="#FFD166" opacity="0.8" />
          <rect x="565" y="465" width="74" height="82" rx="8" fill="#39C8D5" opacity="0.7" />

          <!-- Árvore Urbana Ilustrada -->
          <rect x="785" y="1020" width="38" height="350" rx="12" fill="#1E2F3D" />
          <circle cx="804" cy="960" r="114" fill="#184E5A" stroke="#39C8D5" stroke-width="5" />
          <circle cx="755" cy="995" r="78" fill="#1D5E6C" />
          <circle cx="855" cy="995" r="74" fill="#15424D" />

          <!-- Poste de iluminação com luz quente -->
          <line x1="980" y1="680" x2="980" y2="1370" stroke="#284B66" stroke-width="14" />
          <path d="M 980 680 Q 930 650 905 680" stroke="#284B66" stroke-width="12" fill="none" />
          <circle cx="905" cy="692" r="22" fill="#FFD166" />
          <circle cx="905" cy="692" r="56" fill="#FFD166" opacity="0.2" />
        </g>

        <!-- Layer 3 & 4: Ground Sidewalk -->
        <g>
          <rect y="1370" width="1080" height="550" fill="#122638" />
          <rect y="1370" width="1080" height="42" fill="#1A354D" />
          <line x1="0" y1="1370" x2="1080" y2="1370" stroke="#39C8D5" stroke-width="9" />
          <g transform="translate(${(px.foregroundOffsetX % 180).toFixed(1)}, 0)">
            <line x1="0" y1="1370" x2="-95" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="180" y1="1370" x2="85" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="360" y1="1370" x2="265" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="540" y1="1370" x2="445" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="720" y1="1370" x2="625" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="900" y1="1370" x2="805" y2="1920" stroke="#1B3952" stroke-width="4" />
            <line x1="1080" y1="1370" x2="985" y2="1920" stroke="#1B3952" stroke-width="4" />
          </g>
          <g opacity="${glossOpacity}">
            <rect y="1372" width="1080" height="190" fill="#39C8D5" opacity="0.16" />
            <path d="M ${80 - propState.frictionlessWavePhase} 1435 L ${1180 - propState.frictionlessWavePhase} 1435 M ${160 - propState.frictionlessWavePhase} 1500 L ${1120 - propState.frictionlessWavePhase} 1500" stroke="#39C8D5" stroke-width="7" stroke-dasharray="48 32" stroke-linecap="round" />
          </g>
        </g>

        <!-- Layer 5: Interactive Objects -->
        <g transform="translate(${(px.interactivePropsOffsetX % 720).toFixed(1)}, 0)">
          <!-- Placa mu = 0 -->
          <g transform="translate(915, 1370) rotate(${propState.signTiltDeg}) translate(-915, -1370)">
            <line x1="915" y1="880" x2="915" y2="1370" stroke="#39C8D5" stroke-width="12" />
            <rect x="840" y="775" width="150" height="108" rx="20" fill="#FFD166" stroke="#060D14" stroke-width="8" />
            <text x="915" y="844" text-anchor="middle" fill="#08121B" font-family="sans-serif" font-weight="900" font-size="44">μ = 0</text>
          </g>
          <!-- Cone de trânsito -->
          <g transform="translate(${185 + propState.slidingConeOffsetX}, 1308)">
            <polygon points="0,62 28,0 56,62" fill="#FF6B50" stroke="#060D14" stroke-width="5" />
            <line x1="12" y1="34" x2="44" y2="34" stroke="#FFF7E9" stroke-width="8" />
            <rect x="-8" y="58" width="72" height="12" rx="5" fill="#060D14" />
          </g>
        </g>

        <!-- Layer 6: Bugi Multi-Joint Figure (Escala 2x para 1080x1920 a partir do rig base 540x960) -->
        <g transform="scale(2, 2)">
          <!-- Shockwave se impacto -->
          ${k.impactShockwave && k.shockwaveOpacity > 0.05 ? `
            <ellipse cx="${k.rootX}" cy="${k.groundY}" rx="${k.shockwaveRadius}" ry="${k.shockwaveRadius * 0.26}" fill="none" stroke="#FF6B50" stroke-width="5" stroke-dasharray="12 8" opacity="${k.shockwaveOpacity}"/>
          ` : ''}

          <!-- Poste fixo de ancoragem se grab_stretch -->
          ${(k.state === 'grabbing_stretch' || beat.characterPose === 'agarrando_objeto') && k.grabAnchorPoint ? `
            <line x1="${k.grabAnchorPoint.x}" y1="${k.grabAnchorPoint.y - 45}" x2="${k.grabAnchorPoint.x}" y2="${k.groundY}" stroke="#060D14" stroke-width="22" stroke-linecap="round"/>
            <line x1="${k.grabAnchorPoint.x}" y1="${k.grabAnchorPoint.y - 45}" x2="${k.grabAnchorPoint.x}" y2="${k.groundY}" stroke="#FFD166" stroke-width="13" stroke-linecap="round"/>
            <circle cx="${k.grabAnchorPoint.x}" cy="${k.grabAnchorPoint.y}" r="14" fill="#FF6B50" stroke="#060D14" stroke-width="4"/>
          ` : ''}

          <!-- Sombra -->
          <ellipse cx="${k.rootX}" cy="${k.groundY + 4}" rx="${76 * k.squashX}" ry="13" fill="#050B11" opacity="0.62" />

          <!-- Raiz do Corpo (Pelvis / Torso) -->
          <g transform="translate(${k.rootX}, ${k.rootY}) rotate(${k.torsoRotation}) scale(${k.squashX}, ${k.stretchY})" stroke="#060D14" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
            <!-- 1. Braço Traseiro -->
            <line x1="${k.leftShoulder.x}" y1="${k.leftShoulder.y}" x2="${k.leftElbow.x}" y2="${k.leftElbow.y}" stroke="#060D14" stroke-width="27" />
            <line x1="${k.leftShoulder.x}" y1="${k.leftShoulder.y}" x2="${k.leftElbow.x}" y2="${k.leftElbow.y}" stroke="#0E1F2E" stroke-width="18" />
            <line x1="${k.leftElbow.x}" y1="${k.leftElbow.y}" x2="${k.leftWrist.x}" y2="${k.leftWrist.y}" stroke="#060D14" stroke-width="25" />
            <line x1="${k.leftElbow.x}" y1="${k.leftElbow.y}" x2="${k.leftWrist.x}" y2="${k.leftWrist.y}" stroke="#122638" stroke-width="16" />
            <circle cx="${k.leftWrist.x}" cy="${k.leftWrist.y}" r="11.5" fill="#F7D5B8" stroke="#060D14" stroke-width="4" />

            <!-- 2. Perna Traseira -->
            <line x1="${k.leftHip.x}" y1="${k.leftHip.y}" x2="${k.leftKnee.x}" y2="${k.leftKnee.y}" stroke="#060D14" stroke-width="30" />
            <line x1="${k.leftHip.x}" y1="${k.leftHip.y}" x2="${k.leftKnee.x}" y2="${k.leftKnee.y}" stroke="#0A1520" stroke-width="21" />
            <line x1="${k.leftKnee.x}" y1="${k.leftKnee.y}" x2="${k.leftAnkle.x}" y2="${k.leftAnkle.y}" stroke="#060D14" stroke-width="28" />
            <line x1="${k.leftKnee.x}" y1="${k.leftKnee.y}" x2="${k.leftAnkle.x}" y2="${k.leftAnkle.y}" stroke="#0D1B2A" stroke-width="19" />
            <!-- Tênis Esquerdo -->
            <g transform="translate(${k.leftFoot.x}, ${k.leftFoot.y}) rotate(${k.leftFoot.rotDeg})">
              <path d="M -4 -8 L 36 -8 Q 52 -6 52 10 L -8 10 Q -12 2 -4 -8 Z" fill="#FFF7E9" stroke="#060D14" stroke-width="4.2"/>
              <line x1="-6" y1="11" x2="50" y2="11" stroke="#FF6B50" stroke-width="6"/>
            </g>

            <!-- 3. Perna Frontal -->
            <line x1="${k.rightHip.x}" y1="${k.rightHip.y}" x2="${k.rightKnee.x}" y2="${k.rightKnee.y}" stroke="#060D14" stroke-width="30" />
            <line x1="${k.rightHip.x}" y1="${k.rightHip.y}" x2="${k.rightKnee.x}" y2="${k.rightKnee.y}" stroke="#0A1520" stroke-width="21" />
            <line x1="${k.rightKnee.x}" y1="${k.rightKnee.y}" x2="${k.rightAnkle.x}" y2="${k.rightAnkle.y}" stroke="#060D14" stroke-width="28" />
            <line x1="${k.rightKnee.x}" y1="${k.rightKnee.y}" x2="${k.rightAnkle.x}" y2="${k.rightAnkle.y}" stroke="#0F2032" stroke-width="19" />
            <!-- Tênis Direito -->
            <g transform="translate(${k.rightFoot.x}, ${k.rightFoot.y}) rotate(${k.rightFoot.rotDeg})">
              <path d="M -4 -8 L 38 -8 Q 54 -6 54 10 L -8 10 Q -12 2 -4 -8 Z" fill="#FFF7E9" stroke="#060D14" stroke-width="4.2"/>
              <line x1="-6" y1="11" x2="52" y2="11" stroke="#FF6B50" stroke-width="6"/>
            </g>

            <!-- 4. Tronco: Jaqueta Petróleo + Camiseta Creme -->
            <rect x="-50" y="-44" width="100" height="118" rx="28" fill="#122638" stroke="#060D14" stroke-width="4.5" />
            <path d="M -23 -42 L 23 -42 L 18 73 L -18 73 Z" fill="#FFF7E9" />
            <path d="M -24 -42 L -18 72 M 24 -42 L 18 72" stroke="#39C8D5" stroke-width="4" />
            <circle cx="0" cy="4" r="9.5" fill="#FFD166" stroke="#060D14" stroke-width="3.2" />

            <!-- 5. Braço Frontal -->
            <line x1="${k.rightShoulder.x}" y1="${k.rightShoulder.y}" x2="${k.rightElbow.x}" y2="${k.rightElbow.y}" stroke="#060D14" stroke-width="27" />
            <line x1="${k.rightShoulder.x}" y1="${k.rightShoulder.y}" x2="${k.rightElbow.x}" y2="${k.rightElbow.y}" stroke="#122638" stroke-width="18" />
            <line x1="${k.rightElbow.x}" y1="${k.rightElbow.y}" x2="${k.rightWrist.x}" y2="${k.rightWrist.y}" stroke="#060D14" stroke-width="25" />
            <line x1="${k.rightElbow.x}" y1="${k.rightElbow.y}" x2="${k.rightWrist.x}" y2="${k.rightWrist.y}" stroke="#173147" stroke-width="16" />
            <circle cx="${k.rightWrist.x}" cy="${k.rightWrist.y}" r="11.5" fill="#F7D5B8" stroke="#060D14" stroke-width="4" />

            <!-- 6. Cabeça, Cabelo, Olhos -->
            <g transform="translate(0, ${k.headOffsetY}) rotate(${k.headRotationDeg})">
              <rect x="-15" y="-60" width="30" height="25" rx="10" fill="#F4C9A8" stroke="#060D14" stroke-width="3.5" />
              <rect x="-56" y="-164" width="112" height="112" rx="45" fill="#F7D5B8" stroke="#060D14" stroke-width="4.5" />
              <!-- Cabelo Coral com Follow-through -->
              <g transform="translate(0, -142) rotate(${k.hairFollowDeg}) scale(1, ${k.hairStretchY}) translate(0, 142)">
                <path d="M -60 -134 C -82 -176 -44 -188 -32 -168 C -26 -212 10 -208 16 -170 C 34 -206 72 -190 54 -152 C 80 -156 78 -124 56 -118 C 30 -144 -28 -144 -60 -134 Z" fill="#FF6B50" stroke="#060D14" stroke-width="4.5" />
              </g>
              <!-- Olhos -->
              ${k.isBlinking ? `
                <path d="M -35 -106 Q -22 -100 -9 -106" stroke="#09131C" stroke-width="5" fill="none"/>
                <path d="M 9 -106 Q 22 -100 35 -106" stroke="#09131C" stroke-width="5" fill="none"/>
              ` : `
                <ellipse cx="${-22 + k.pupilOffsetX}" cy="${-108 + k.pupilOffsetY}" rx="${13.5 * k.eyeScaleX}" ry="${16 * k.eyeScaleY}" fill="#09131C"/>
                <circle cx="${-26 + k.pupilOffsetX}" cy="${-114 + k.pupilOffsetY}" r="4.8" fill="#FFF7E9"/>
                <ellipse cx="${22 + k.pupilOffsetX}" cy="${-108 + k.pupilOffsetY}" rx="${13.5 * k.eyeScaleX}" ry="${16 * k.eyeScaleY}" fill="#09131C"/>
                <circle cx="${18 + k.pupilOffsetX}" cy="${-114 + k.pupilOffsetY}" r="4.8" fill="#FFF7E9"/>
              `}
              <!-- Sobrancelhas -->
              <g transform="translate(-22, ${-132 + k.browOffsetY}) rotate(${k.leftBrowDeg})">
                <path d="M -14 0 Q 0 -7 14 0" stroke="#060D14" stroke-width="4.8" fill="none"/>
              </g>
              <g transform="translate(22, ${-132 + k.browOffsetY}) rotate(${k.rightBrowDeg})">
                <path d="M -14 0 Q 0 -7 14 0" stroke="#060D14" stroke-width="4.8" fill="none"/>
              </g>
              <!-- Boca -->
              <ellipse cx="0" cy="-74" rx="12" ry="${7 + k.mouthOpenness * 9}" fill="#09131C" stroke="#060D14" stroke-width="3.5"/>
              <!-- Gotas de suor se desespero -->
              ${(k.sweatDrops || beat.facialExpression === 'desespero') ? `
                <path d="M -64 -132 Q -72 -118 -64 -110 Q -56 -118 -64 -132 Z" fill="#39C8D5" stroke="#060D14" stroke-width="2.5" />
                <path d="M 64 -126 Q 72 -112 64 -104 Q 56 -112 64 -126 Z" fill="#39C8D5" stroke="#060D14" stroke-width="2.5" />
              ` : ''}
              <!-- Estrelinhas de impacto cômico -->
              ${(k.recoveryStars || beat.facialExpression === 'comico') ? `
                <g transform="translate(0, -215)">
                  <circle cx="-36" cy="0" r="6" fill="#FFD166" stroke="#060D14" stroke-width="2.5"/>
                  <circle cx="0" cy="-10" r="7.5" fill="#39C8D5" stroke="#060D14" stroke-width="2.5"/>
                  <circle cx="36" cy="0" r="6" fill="#FF6B50" stroke="#060D14" stroke-width="2.5"/>
                </g>
              ` : ''}
            </g>
          </g>
        </g>
      </svg>
    </div>

    <!-- Pop-in Dinâmico Sem Atrito -->
    ${popInHtml}

    <!-- Legendas Estilo Shorts Profissional (Clean, Sem caixa cinza) -->
    <div style="position: absolute; left: 40px; right: 40px; top: 1480px; height: 190px; display: flex; align-items: center; justify-content: center; z-index: 80;">
      <div style="width: 100%; text-align: center;">
        ${wordsHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const framesDir = path.join(process.cwd(), 'temp_pilot_frames');
  fs.mkdirSync(framesDir, { recursive: true });

  console.log(`[1/3] Generating ${TOTAL_FRAMES} high-density HTML frames...`);
  // Geramos frames para o render
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const html = renderFrameHtml(i);
    fs.writeFileSync(path.join(framesDir, `frame-${String(i).padStart(4, '0')}.html`), html, 'utf8');
  }

  console.log(`[2/3] Rendering frames to JPG via Chrome Headless...`);
  // Renderizamos em lotes de forma rápida
  const batchSize = 1; // Chrome renderiza via headless screenshot
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const htmlFile = path.join(framesDir, `frame-${String(i).padStart(4, '0')}.html`);
    const imgFile = path.join(framesDir, `frame-${String(i + 1).padStart(4, '0')}.jpg`);
    if (!fs.existsSync(imgFile)) {
      execFileSync(CHROME_PATH, [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        `--window-size=1080,1920`,
        `--screenshot=${imgFile}`,
        `file://${htmlFile}`
      ]);
    }
    if ((i + 1) % 60 === 0) {
      console.log(`Rendered frame ${i + 1}/${TOTAL_FRAMES} (${(((i + 1)/TOTAL_FRAMES)*100).toFixed(0)}%)`);
    }
  }

  console.log(`[3/3] Muxing 1080x1920 30FPS H.264 MP4 with Gemini TTS Audio (-14 LUFS)...`);
  const audioIn = path.join(process.cwd(), 'data', 'media', 'narration-pilot-12s.wav');
  const outputMp4 = path.join(process.cwd(), 'data', 'media', 'piloto-12s-premium-v2.mp4');

  execFileSync('ffmpeg', [
    '-y',
    '-framerate', '30',
    '-i', path.join(framesDir, 'frame-%04d.jpg'),
    '-i', audioIn,
    '-filter_complex', '[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,apad=pad_dur=1[a]',
    '-map', '0:v',
    '-map', '[a]',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-t', '12',
    '-movflags', '+faststart',
    outputMp4
  ]);

  console.log('SUCCESS! Video generated at:', outputMp4);
  const stat = fs.statSync(outputMp4);
  console.log('Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
}

run().catch((err) => {
  console.error('Render error:', err);
  process.exit(1);
});
