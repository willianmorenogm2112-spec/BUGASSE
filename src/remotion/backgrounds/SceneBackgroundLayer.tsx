import React from 'react';
import { AnimationBeat, ScenarioPreset } from '../../types/studio';
import {
  objectInteraction,
  parallaxMotion,
} from '../animation/bugiRigAndBeatsEngine';

interface SceneBackgroundLayerProps {
  scenarioPreset: ScenarioPreset;
  customBackgroundUrl?: string;
  frameInScene: number;
  isSlidingParallax?: boolean;
  cameraPanX?: number;
  activeBeat?: AnimationBeat;
}

/**
 * Camadas 1 a 5 do SceneGeometryEngine (1080 × 1920):
 * - background (zIndex 10): Céu atmosférico + silhuetas distantes
 * - middle-ground (zIndex 20): Prédios 2D ilustrados com janelas acesas, toldos listrados, árvores e postes
 * - foreground (zIndex 30 & 40): Calçada ladrilhada em perspectiva (groundLinePxY = 1370), meio-fio e brilho de atrito zero
 * - interactive-objects (zIndex 50): Placa μ = 0 com vibração, cone de trânsito e copo deslizando quando μ = 0
 */
export const SceneBackgroundLayer: React.FC<SceneBackgroundLayerProps> = ({
  scenarioPreset,
  customBackgroundUrl,
  frameInScene,
  isSlidingParallax = false,
  cameraPanX = 0,
  activeBeat,
}) => {
  const speed = activeBeat
    ? activeBeat.backgroundAnimation.parallaxSpeed
    : isSlidingParallax
    ? 3.0
    : 1.0;

  const px = parallaxMotion(frameInScene, cameraPanX, speed);
  const propState = activeBeat
    ? objectInteraction(frameInScene, activeBeat)
    : {
        signTiltDeg: isSlidingParallax ? Math.sin(frameInScene * 0.25) * 2.5 : 0,
        slidingConeOffsetX: isSlidingParallax ? (frameInScene * 4) % 360 : 0,
        slidingCupOffsetX: isSlidingParallax ? (frameInScene * 6) % 420 : 0,
        slidingCupRotationDeg: isSlidingParallax ? frameInScene * 4 : 0,
        frictionlessWavePhase: (frameInScene * 10) % 240,
      };

  const glossOpacity = activeBeat
    ? activeBeat.backgroundAnimation.groundGlossIntensity
    : isSlidingParallax
    ? 0.9
    : 0.25;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#091521]" style={{ zIndex: 10 }}>
      {/* Se houver imagem gerada pelo Google AI Studio / Nano Banana, renderiza com parallax suave */}
      {customBackgroundUrl && (
        <img
          src={customBackgroundUrl}
          alt="Cenário ilustrado 2D gerado pela IA do Google"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          style={{
            transform: `scale(1.08) translateX(${(px.midgroundOffsetX * 0.35).toFixed(1)}px)`,
          }}
        />
      )}

      <svg
        viewBox="0 0 1080 1920"
        className="absolute inset-0 w-full h-full block"
      >
        {!customBackgroundUrl && (
          <>
            {/* CAMADA 1: BACKGROUND (Céu crepuscular azul-petróleo + silhueta distante) */}
            <g id="Layer-1-Background">
              <rect
                width="1080"
                height="1370"
                fill={
                  scenarioPreset === 'parque_gravidade'
                    ? '#0C1F30'
                    : scenarioPreset === 'laboratorio_bugi'
                    ? '#091520'
                    : '#091624'
                }
              />
              {/* Disco solar/lunar creme-amarelo + nuvens estilizadas */}
              <g transform={`translate(${(px.skyOffsetX % 260).toFixed(1)}, 0)`}>
                <circle cx="880" cy="285" r="78" fill="#FFD166" opacity="0.88" />
                <circle cx="880" cy="285" r="102" fill="#FFD166" opacity="0.16" />
                <rect x="140" y="235" width="220" height="44" rx="22" fill="#132A40" opacity="0.7" />
                <rect x="520" y="185" width="180" height="38" rx="19" fill="#132A40" opacity="0.55" />
                {/* Silhueta de prédios distantes */}
                <rect x="-120" y="560" width="210" height="810" fill="#0D1E2E" />
                <rect x="110" y="470" width="240" height="900" fill="#0E2233" />
                <rect x="380" y="520" width="210" height="850" fill="#0D1E2E" />
                <rect x="620" y="440" width="260" height="930" fill="#0E2233" />
                <rect x="910" y="510" width="250" height="860" fill="#0D1E2E" />
              </g>
            </g>

            {/* CAMADA 2: MIDDLE-GROUND (Prédios ilustrados 2D, janelas acesas, toldos, árvores e postes) */}
            <g
              id="Layer-2-MiddleGround"
              transform={`translate(${(px.midgroundOffsetX % 540).toFixed(1)}, 0)`}
            >
              {scenarioPreset === 'laboratorio_bugi' ? (
                <>
                  <rect
                    x="80"
                    y="260"
                    width="920"
                    height="520"
                    rx="32"
                    fill="#122638"
                    stroke="#39C8D5"
                    strokeWidth="6"
                  />
                  <text
                    x="140"
                    y="365"
                    fill="#39C8D5"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="40"
                    fontWeight="700"
                  >
                    F_atrito = μ · N → 0.00 N
                  </text>
                  <path
                    d="M 140 460 Q 320 360 490 500 T 860 430"
                    stroke="#FFD166"
                    strokeWidth="6"
                    strokeDasharray="14 12"
                    fill="none"
                  />
                  <rect x="110" y="860" width="280" height="510" rx="20" fill="#152C40" stroke="#1D3B54" strokeWidth="4" />
                  <rect x="690" y="900" width="260" height="470" rx="20" fill="#152C40" stroke="#1D3B54" strokeWidth="4" />
                </>
              ) : (
                <>
                  {[0, 1080].map((tileX) => (
                    <g key={tileX} transform={`translate(${tileX}, 0)`}>
                      {/* Edifício 1 com toldo coral e janelas iluminadas */}
                      <rect
                        x="45"
                        y="390"
                        width="310"
                        height="980"
                        rx="18"
                        fill="#122638"
                        stroke="#1E3F5A"
                        strokeWidth="4"
                      />
                      {[450, 560, 670, 780, 890].map((wy, rIdx) => (
                        <g key={wy}>
                          <rect
                            x="90"
                            y={wy}
                            width="64"
                            height="76"
                            rx="8"
                            fill={rIdx % 2 === 0 ? '#FFD166' : '#FFF7E9'}
                            opacity="0.82"
                          />
                          <rect
                            x="195"
                            y={wy}
                            width="64"
                            height="76"
                            rx="8"
                            fill={rIdx % 2 === 1 ? '#39C8D5' : '#FFD166'}
                            opacity="0.72"
                          />
                        </g>
                      ))}
                      {/* Toldo da loja térrea */}
                      <path
                        d="M 30 1070 L 370 1070 L 352 1138 L 12 1138 Z"
                        fill="#FF6B50"
                        stroke="#060D14"
                        strokeWidth="5"
                      />
                      <rect
                        x="72"
                        y="1145"
                        width="250"
                        height="225"
                        rx="10"
                        fill="#0E1F2E"
                        stroke="#39C8D5"
                        strokeWidth="3"
                      />

                      {/* Edifício 2 Central mais alto */}
                      <rect
                        x="395"
                        y="290"
                        width="340"
                        height="1080"
                        rx="18"
                        fill="#152C40"
                        stroke="#234968"
                        strokeWidth="4"
                      />
                      {[350, 465, 580, 695, 810, 925].map((wy, rIdx) => (
                        <g key={wy}>
                          <rect
                            x="445"
                            y={wy}
                            width="74"
                            height="82"
                            rx="8"
                            fill={rIdx % 3 === 0 ? '#FFF7E9' : '#FFD166'}
                            opacity="0.8"
                          />
                          <rect
                            x="565"
                            y={wy}
                            width="74"
                            height="82"
                            rx="8"
                            fill={rIdx % 2 === 0 ? '#FFD166' : '#39C8D5'}
                            opacity="0.7"
                          />
                        </g>
                      ))}

                      {/* Árvore Urbana Ilustrada + Poste de Iluminação */}
                      <rect x="785" y="1020" width="38" height="350" rx="12" fill="#1E2F3D" />
                      <circle
                        cx="804"
                        cy="960"
                        r="114"
                        fill="#184E5A"
                        stroke="#39C8D5"
                        strokeWidth="5"
                      />
                      <circle cx="755" cy="995" r="78" fill="#1D5E6C" />
                      <circle cx="855" cy="995" r="74" fill="#15424D" />

                      {/* Poste de luz com halo quente */}
                      <line x1="980" y1="680" x2="980" y2="1370" stroke="#284B66" strokeWidth="14" />
                      <path d="M 980 680 Q 930 650 905 680" stroke="#284B66" strokeWidth="12" fill="none" />
                      <circle cx="905" cy="692" r="22" fill="#FFD166" />
                      <circle cx="905" cy="692" r="56" fill="#FFD166" opacity="0.2" />
                    </g>
                  ))}
                </>
              )}
            </g>
          </>
        )}

        {/* CAMADA 3 & 4: FOREGROUND (Superfície da Calçada Y = 1370, Ladrilhos em Perspectiva e Brilho Sem Atrito) */}
        <g id="Layer-3-And-4-Ground-Surface">
          <rect y="1370" width="1080" height="550" fill="#122638" />
          {/* Meio-fio iluminado */}
          <rect y="1370" width="1080" height="42" fill="#1A354D" />
          <line x1="0" y1="1370" x2="1080" y2="1370" stroke="#39C8D5" strokeWidth="9" />

          {/* Juntas dos ladrilhos da calçada com movimento parallax */}
          <g transform={`translate(${(px.foregroundOffsetX % 180).toFixed(1)}, 0)`}>
            {[-180, 0, 180, 360, 540, 720, 900, 1080, 1260].map((tx) => (
              <line
                key={tx}
                x1={tx}
                y1="1370"
                x2={tx - 95}
                y2="1920"
                stroke="#1B3952"
                strokeWidth="4"
              />
            ))}
          </g>

          {/* Camada de Gelo / Atrito Zero (μ = 0) com reflexos ciano animados */}
          <g opacity={glossOpacity}>
            <rect y="1372" width="1080" height="190" fill="#39C8D5" opacity="0.16" />
            <path
              d={`M ${80 - propState.frictionlessWavePhase} 1435 L ${1180 - propState.frictionlessWavePhase} 1435 M ${160 - propState.frictionlessWavePhase} 1500 L ${1120 - propState.frictionlessWavePhase} 1500`}
              stroke="#39C8D5"
              strokeWidth="7"
              strokeDasharray="48 32"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* CAMADA 5: INTERACTIVE-OBJECTS (Placa μ = 0 + Cone de Trânsito Deslizante) */}
        <g
          id="Layer-5-Interactive-Objects"
          transform={`translate(${(px.interactivePropsOffsetX % 720).toFixed(1)}, 0)`}
        >
          {/* Placa física μ = 0 com rotação reativa */}
          <g transform={`translate(915, 1370) rotate(${propState.signTiltDeg}) translate(-915, -1370)`}>
            <line
              x1="915"
              y1="880"
              x2="915"
              y2="1370"
              stroke="#39C8D5"
              strokeWidth="12"
            />
            <rect
              x="840"
              y="775"
              width="150"
              height="108"
              rx="20"
              fill="#FFD166"
              stroke="#060D14"
              strokeWidth="8"
            />
            <text
              x="915"
              y="844"
              textAnchor="middle"
              fill="#08121B"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="44"
            >
              μ = 0
            </text>
          </g>

          {/* Cone de trânsito que desliza quando o atrito desaparece */}
          <g transform={`translate(${185 + propState.slidingConeOffsetX}, 1308)`}>
            <polygon
              points="0,62 28,0 56,62"
              fill="#FF6B50"
              stroke="#060D14"
              strokeWidth="5"
            />
            <line x1="12" y1="34" x2="44" y2="34" stroke="#FFF7E9" strokeWidth="8" />
            <rect x="-8" y="58" width="72" height="12" rx="5" fill="#060D14" />
          </g>
        </g>
      </svg>
    </div>
  );
};
