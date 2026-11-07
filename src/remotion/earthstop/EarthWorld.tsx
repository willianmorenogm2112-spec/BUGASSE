import React from 'react';
import {BugiArticulatedSvgFigure} from '../../components/BugiCharacterSvg';
import {earthActing,EarthAction,ease} from './earthMotion';

export const EC = {
  ink: '#122638',
  cyan: '#39C8D5',
  coral: '#FF6B50',
  gold: '#FFD166',
  cream: '#FFF7E9',
  dirt: '#754432',
  asphalt: '#344955',
  groundCrack: '#1E2B37'
};
const C = EC;

export const CaptionLabel = ({
  x = 540,
  y = 260,
  children,
  color = C.ink,
  size = 43
}: {
  x?: number;
  y?: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
}) => (
  <text x={x} y={y} fill={color} textAnchor="middle" fontSize={size} fontWeight="900" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))">
    {children}
  </text>
);

// Caneca dinâmica com deformação de líquido, onda viscosa e estilhaços reais
export const DynamicCup = ({
  x,
  y,
  rotation = 0,
  spill = 0,
  scale = 1,
  shattered = false
}: {
  x: number;
  y: number;
  rotation?: number;
  spill?: number;
  scale?: number;
  shattered?: boolean;
}) => {
  if (shattered) {
    // Fragmentos estilhaçados no chão com poça espalhada
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
        <ellipse cx="0" cy="10" rx="65" ry="14" fill={C.dirt} opacity="0.85" stroke="none" />
        <path d="M-28 6 l16 -18 l8 12 Z" fill={C.cream} />
        <path d="M5 -4 l22 -10 l-6 20 Z" fill={C.cream} />
        <path d="M-15 -18 l14 -12 l12 8 l-10 16 Z" fill={C.cream} />
        <path d="M30 0 q20 -15 15 15" fill="none" strokeWidth="5" />
        {[0, 1, 2, 3].map(j => (
          <circle key={j} cx={-35 + j * 24} cy={6 + (j % 2) * 5} r={3 + j} fill={C.dirt} stroke="none" />
        ))}
      </g>
    );
  }

  // Líquido espirrando em jato volumétrico curvado para o Leste (direção da inércia)
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
      {/* Corpo da caneca cerâmica */}
      <path d="M-18 -38 h36 v39 q0 13 -18 13 t-18 -13 Z" fill={C.cream} />
      <path d="M18 -30 q29 -2 24 17 -3 13 -24 8" fill="none" strokeWidth="5" />
      <ellipse cy="-38" rx="18" ry="5" fill="#5A3528" />

      {/* Onda volumétrica de café saltando */}
      {spill > 0 && (
        <g stroke="none" fill={C.dirt}>
          {/* Jato principal projetado pela inércia */}
          <path
            d={`M -5 -38 Q ${25 + spill * 45} ${-55 - spill * 35} ${50 + spill * 90} ${-40 - spill * 15} Q ${35 + spill * 40} ${-25} 12 -35 Z`}
          />
          {/* Gotas e glóbulos em suspensão */}
          {[0, 1, 2, 3, 4, 5].map(j => {
            const gx = 45 + spill * (35 + j * 22);
            const gy = -48 - spill * (45 - j * 12) + spill * spill * (20 + j * 8);
            return <ellipse key={j} cx={gx} cy={gy} rx={5 + (j % 3)} ry={7 + (j % 2)} transform={`rotate(${spill * 20} ${gx} ${gy})`} />;
          })}
        </g>
      )}
    </g>
  );
};

export const BugiActor: React.FC<{
  x: number;
  floor?: number;
  scale?: number;
  action: EarthAction;
  local: number;
  speech?: number;
  cup?: boolean;
  spill?: number;
}> = ({ x, floor = 1330, scale = 1.9, action, local, speech = 0, cup = false, spill = 0 }) => {
  const k = earthActing(action, local, speech);
  return (
    <g transform={`translate(${x} ${floor - 685 * scale}) scale(${scale})`}>
      <BugiArticulatedSvgFigure kinematics={k} />
      {cup && (
        <g transform={`translate(${k.rootX} ${k.rootY}) rotate(${k.torsoRotation})`}>
          <DynamicCup x={k.rightWrist.x + 9} y={k.rightWrist.y - 5} rotation={-k.torsoRotation + 12 * spill} spill={spill} />
        </g>
      )}
    </g>
  );
};

// Rua viva com asfalto que racha na parada, poste que inclina e vento atmosférico
export const Street: React.FC<{
  time: number;
  travel?: number;
  wind?: number;
  brakingIntensity?: number;
  broken?: boolean;
}> = ({ time, travel = 0, wind = 0, brakingIntensity = 0, broken = false }) => {
  const poleBend = brakingIntensity * 14;

  return (
    <g>
      <defs>
        <linearGradient id="earth-sky" x2="0" y2="1">
          <stop stopColor={brakingIntensity > 0.3 ? '#77B8C4' : '#89C9D3'} />
          <stop offset="1" stopColor={brakingIntensity > 0.3 ? '#FFE4B5' : '#FFF0CA'} />
        </linearGradient>
        <pattern id="earth-paving" width="140" height="90" patternUnits="userSpaceOnUse">
          <rect width="140" height="90" fill="#D6B997" />
          <path d="M0 0H140V90" stroke="#B09379" strokeWidth="3" fill="none" />
        </pattern>
      </defs>

      {/* Céu */}
      <rect width="1080" height="1920" fill="url(#earth-sky)" />
      <circle cx="850" cy="240" r="86" fill={C.gold} />

      {/* Nuvens arrastadas em velocidade pela inércia da atmosfera */}
      {[0, 1, 2, 3].map(j => {
        const cloudSpeed = (j * 360 + time * (15 + wind * 450) - travel * 0.12) % 1800 - 350;
        return (
          <g key={j} transform={`translate(${cloudSpeed} ${230 + (j % 2) * 120})`} fill={C.cream} opacity="0.85">
            <ellipse rx={98 + wind * 40} ry={28 - wind * 6} />
            <circle cx="-30" cy="-20" r={34} />
            <circle cx="28" cy="-30" r={43} />
          </g>
        );
      })}

      {/* Prédios distantes (Parallax nível 1) */}
      <g transform={`translate(${-travel * 0.15} 0)`}>
        {Array.from({ length: 10 }, (_, j) => (
          <g key={j} transform={`translate(${j * 180 - 250} ${580 + (j % 3) * 45})`}>
            <rect width="160" height="460" fill={['#7EABA9', '#A1BDB0', '#70999C'][j % 3]} />
            {[0, 1, 2].map(k => (
              <path key={k} d={`M30 ${40 + k * 100}h30m40 0h30`} stroke="#C6D9C9" strokeWidth="35" />
            ))}
          </g>
        ))}
      </g>

      {/* Fachadas e Lojas (Parallax nível 2) */}
      <g transform={`translate(${-travel * 0.45} 0)`}>
        {[-1, 0, 1, 2, 3, 4, 5].map(j => (
          <g key={j} transform={`translate(${j * 420 - 220} 0)`} stroke="#42615D" strokeWidth="6">
            <rect x="0" y={510 + (j % 2) * 70} width="395" height={680 - (j % 2) * 70} fill={j % 2 ? '#D5B18B' : '#C98870'} />
            <path d={`M-10 ${505 + (j % 2) * 70}h415`} strokeWidth="22" />
            {[0, 1, 2].map(k => (
              <g key={k}>
                <rect x={40 + k * 110} y="640" width="65" height="100" rx="5" fill="#BCE0D8" />
                <path d={`M${72 + k * 110} 640v100`} strokeWidth="4" />
              </g>
            ))}
            <rect x="25" y="900" width="345" height="280" fill={C.ink} />
            <rect x="45" y="930" width="200" height="170" fill="#6AA6A9" />
            <rect x="270" y="930" width="70" height="245" fill="#477C80" />
            <path d="M20 895h355" stroke={C.cream} strokeWidth="22" />
            {[0, 1, 2, 3, 4].map(k => (
              <path key={k} d={`M${50 + k * 65} 895l-20 55`} stroke={j % 2 ? C.gold : C.coral} strokeWidth="30" />
            ))}
            <text x="195" y="860" textAnchor="middle" fontSize="38" fontWeight="900" fill={C.cream} stroke="none">
              {j % 2 ? 'CAFÉ DO BAIRRO' : 'LIVRARIA'}
            </text>
          </g>
        ))}
      </g>

      {/* Calçada */}
      <rect y="1190" width="1080" height="300" fill="url(#earth-paving)" />
      <path d="M0 1430h1080" stroke={C.cream} strokeWidth="23" />

      {/* Asfalto da Rua */}
      <rect y="1450" width="1080" height="470" fill={C.asphalt} />
      {[-1, 0, 1, 2, 3, 4, 5].map(j => (
        <rect key={j} x={j * 260 - (travel % 260)} y="1730" width="150" height="17" rx="5" fill={C.cream} opacity="0.65" />
      ))}

      {/* RACHADURAS E FUMAÇA NO CHÃO QUANDO O PLANETA TRAVA */}
      {brakingIntensity > 0 && (
        <g stroke={C.groundCrack} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Fraturas no solo sob o ponto de parada */}
          <path d={`M 380 1330 L ${350 - brakingIntensity * 40} 1375 L ${380 - brakingIntensity * 80} 1420`} />
          <path d={`M 350 1375 L ${310 - brakingIntensity * 60} 1390`} />
          <path d={`M 460 1330 L ${490 + brakingIntensity * 50} 1365 L ${470 + brakingIntensity * 90} 1410`} />
          <path d={`M 580 1330 L ${630 + brakingIntensity * 70} 1380`} />
          {/* Fumaça e poeira do atrito violento */}
          {[0, 1, 2, 3, 4].map(j => (
            <ellipse
              key={j}
              cx={330 + j * 75 + brakingIntensity * 60}
              cy={1335 - j * 8}
              rx={18 + brakingIntensity * (25 + j * 8)}
              ry={8 + brakingIntensity * 12}
              fill="#EAD7C0"
              opacity={brakingIntensity * 0.45}
              stroke="none"
            />
          ))}
        </g>
      )}

      {/* Poste de Luz que inclina/deforma com a desaceleração */}
      <g transform={`translate(${910 - travel * 0.9} 0) rotate(${poleBend} 910 1320)`} stroke={C.ink} strokeWidth="9">
        <path d="M0 1320V685q0-50-60-50h-60" fill="none" />
        <path d="M-160 631q20-65 75 0Z" fill={C.gold} />
        <ellipse cy="1340" rx="54" ry="16" fill={C.ink} opacity="0.2" />
      </g>

      {/* Linhas de choque de vento da atmosfera */}
      {wind > 0 &&
        [0, 1, 2, 3, 4, 5, 6].map(j => (
          <path
            key={j}
            d={`M ${((time * 650 + j * 190) % 1600) - 350} ${620 + j * 105} h ${160 + wind * 220}`}
            stroke={C.cream}
            strokeWidth="8"
            strokeLinecap="round"
            opacity={wind * 0.75}
          />
        ))}

      {/* Detritos e xícara quebrada se aplicável */}
      {broken && (
        <g transform="translate(750 1320)" fill={C.cream} stroke={C.ink} strokeWidth="4">
          <path d="M-50-15l40 20-30 15Z" />
          <path d="M10-5l35-10-10 30Z" />
          <ellipse cx="-7" cy="20" rx="70" ry="12" fill="#755442" stroke="none" />
        </g>
      )}
    </g>
  );
};

// Globo com indicador da rotação da Terra e parada súbita
export const Globe: React.FC<{ time: number; latitude?: number; stop?: number; radius?: number }> = ({
  time,
  latitude = 0,
  stop = 0,
  radius = 325
}) => {
  const rot = (time * (1 - stop) * 18) % 360;
  const lat = (latitude * Math.PI) / 180;
  return (
    <g transform="translate(540 850)">
      <defs>
        <clipPath id="earth-disc">
          <circle r={radius} />
        </clipPath>
        <radialGradient id="earth-ocean">
          <stop stopColor="#3BBDD2" />
          <stop offset="1" stopColor="#1C5B87" />
        </radialGradient>
      </defs>
      <circle r={radius + 18} fill={C.cyan} opacity="0.13" />
      <circle r={radius} fill="url(#earth-ocean)" />
      <g clipPath="url(#earth-disc)">
        {[-1, 0, 1].map(j => (
          <g key={j} transform={`translate(${j * radius * 2 + (rot / 360) * radius * 2} 0)`} fill="#89B989" stroke="#356D6B" strokeWidth="5">
            <path d={`M${-radius * 0.8} ${-radius * 0.5}q140-150 260-20l-45 95-100 30-20 100-80-45Z`} />
            <path d={`M${-radius * 0.1} 60l110-50 80 80-70 150-60-40Z`} />
            <path d={`M${radius * 0.6} ${-radius * 0.4}l160 30-50 180-110-60Z`} />
          </g>
        ))}
        {[-0.65, 0, 0.65].map((v, j) => (
          <ellipse key={j} cy={v * radius} rx={radius * Math.sqrt(1 - v * v)} ry={radius * 0.14} stroke={C.cream} strokeWidth="3" fill="none" opacity="0.4" />
        ))}
        <ellipse cy={-Math.sin(lat) * radius} rx={Math.cos(lat) * radius} ry={Math.max(3, Math.cos(lat) * radius * 0.12)} fill="none" stroke={C.gold} strokeWidth="9" />
      </g>
      <circle r={radius} fill="none" stroke={C.ink} strokeWidth="12" />
      <path d={`M${-radius - 45} 0h-70m0 0 30-25m-30 25 30 25`} stroke={C.gold} strokeWidth="9" fill="none" />
    </g>
  );
};
