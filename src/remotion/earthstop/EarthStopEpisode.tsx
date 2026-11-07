import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timing from '../../../public/assets/terra-1s/timing.json';
import {captionPages} from '../gravity/GravityCaptions';
import {BugiActor, CaptionLabel as Label, DynamicCup as Cup, Street, Globe, EC as C} from './EarthWorld';
import {ease, mix, rotationKmh, cupAnchor} from './earthMotion';

const pages = timing.turns.flatMap(turn => captionPages(timing.words.filter(w => w.turn === turn.index)));

// Vetor dinâmico que se projeta no espaço
const ForceVector = ({
  x,
  y,
  length = 200,
  label = '',
  color = C.coral
}: {
  x: number;
  y: number;
  length?: number;
  label?: string;
  color?: string;
}) => (
  <g stroke={color} strokeWidth="12" fill="none" strokeLinecap="round">
    <path d={`M${x} ${y} h${length} m-35 -26 l35 26 l-35 26`} />
    {label && (
      <text x={x + length / 2} y={y - 20} fill={color} fontSize="32" fontWeight="900" textAnchor="middle" stroke="none">
        {label}
      </text>
    )}
  </g>
);

export const EarthStopEpisode: React.FC = () => {
  const f = useCurrentFrame(), {fps} = useVideoConfig(), t = f / fps;
  const turn = timing.turns.filter(q => q.start <= t).at(-1) ?? timing.turns[0];
  const i = turn.index, u = Math.max(0, t - turn.start), bugi = turn.speaker === 'bugi';
  const amp = (timing.envelope as number[])[Math.floor(t * 30)] ?? 0;
  const speaking = bugi && timing.words.some(w => w.turn === i && t >= w.start && t < w.end) ? amp : 0;

  const cue = (word: string, fallback = 0) => {
    const w = timing.words.find(w => w.turn === i && w.word.toLocaleLowerCase('pt-BR').replace(/[.,!?;:]/g, '') === word);
    return w ? w.start - turn.start : fallback;
  };

  const page = pages.find((p, j) => t >= p[0].start && t < (pages[j + 1]?.[0].start ?? timing.duration) && t <= p.at(-1)!.end + 0.16);
  const skyScene = [0, 1, 2, 3, 4, 5, 7, 8, 11, 13].includes(i);
  const globalScience = [6, 9, 10, 12].includes(i);

  // Parada súbita no turno 0 e 2
  const brakeProgress = i === 0 ? ease((u - 0.5) / 1.4) : i === 2 ? ease(u / 2) : 0;
  const groundTravel = i === 0 ? brakeProgress * 320 : i === 2 ? ease(u / 3) * 600 : i === 8 ? ease((u - cue('quatrocentos', 3)) / 2) * 1400 : 0;
  const atmosphericWind = i === 0 ? brakeProgress * 1.2 : i === 2 ? 0.9 : 0;

  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: 'Arial', overflow: 'hidden'}}>
      <Audio src={staticFile('assets/terra-1s/mix-final.wav')} />

      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
        {/* CENÁRIO VIVO COM FÍSICA DE PARADA */}
        {skyScene && (
          <Street
            time={t}
            travel={groundTravel}
            wind={atmosphericWind}
            brakingIntensity={brakeProgress}
            broken={i >= 2}
          />
        )}

        {globalScience && (
          <>
            <defs>
              <radialGradient id="space-earth">
                <stop stopColor="#254B65" />
                <stop offset="1" stopColor={C.ink} />
              </radialGradient>
            </defs>
            <rect width="1080" height="1920" fill="url(#space-earth)" />
            {Array.from({length: 22}, (_, j) => (
              <circle key={j} cx={(j * 137 + 53) % 1080} cy={(j * 229 + 85) % 1400} r={j % 3 === 0 ? 3 : 2} fill={C.cream} opacity="0.35" />
            ))}
          </>
        )}

        {/* TURNO 0: A Terra parou. Você não. E se o planeta freasse por um segundo? */}
        {i === 0 && (
          <>
            {/* O Bugi é bruscamente desacelerado pelo chão enquanto seu torso/corpo é arremessado para a frente */}
            <BugiActor
              x={300 + brakeProgress * 360}
              action={u < 0.6 ? 'carry' : u < 2.0 ? 'brake' : 'drift'}
              local={Math.max(0, u - 0.6)}
              cup={u < 1.7}
              spill={ease((u - 0.8) / 0.9)}
            />

            {/* A caneca escapa das mãos do Bugi e voa em rotação pelo ar até se espatifar */}
            {u >= 1.7 && u < 3.8 && (
              <Cup
                x={cupAnchor('brake',1.1,300+ease(1.2/1.4)*360).x + (u - 1.7) * 220}
                y={cupAnchor('brake',1.1,300+ease(1.2/1.4)*360).y - 140 * Math.sin(((u - 1.7) / 2.1) * Math.PI)}
                rotation={(u - 1.7) * 160}
                spill={1}
                scale={1.9}
              />
            )}
            {u >= 3.8 && (
              <Cup x={920} y={1320} shattered scale={1.9} />
            )}

            {/* Impacto conceitual na tela conectado à inércia */}
            {u > 0.65 && (
              <g opacity={ease((u - 0.65) / 0.25)}>
                <Label y={300} size={70}>A TERRA PAROU.</Label>
                <Label y={385} size={70} color={C.coral}>VOCÊ NÃO.</Label>
                <ForceVector x={370} y={640} length={280 * brakeProgress + 60} label="INÉRCIA" />
              </g>
            )}

            <Label y={1410} size={25} color={C.cream}>
              Física de inércia tangencial • escala ilustrativa
            </Label>
          </>
        )}

        {/* TURNO 1: Bugi confiante: 'Um segundo? Nem dá tempo de derramar o café.' */}
        {i === 1 && (
          <>
            <Label y={325} size={42} color={C.ink}>INSTANTES ANTES…</Label>
            <BugiActor
              x={400}
              floor={1390}
              scale={2.2}
              action="carry"
              local={u}
              speech={speaking}
              cup
              spill={ease((u - cue('café', 2)) / 0.8) * 0.25}
            />
            {/* Relógio do 1 segundo pulsando e zombando da afirmação */}
            <g opacity={ease((u - 0.2) / 0.4)} transform="translate(830 650)">
              <circle r={110} fill={C.cream} stroke={C.ink} strokeWidth="10" />
              <path d="M0 -75 v75 l45 30" stroke={C.coral} strokeWidth="12" strokeLinecap="round" fill="none" />
              <text y={150} textAnchor="middle" fontSize="64" fill={C.ink} fontWeight="900">
                1 s
              </text>
            </g>
          </>
        )}

        {/* TURNO 2: 'Nesta hipótese, só o chão para de girar. Você, o café e o ar continuam...' */}
        {i === 2 && (() => {
          const releaseAt = cue('café', 2.8);
          const flying = u >= releaseAt;
          const actorX = 220 + ease(u / 3) * 380;
          return (
            <>
              <BugiActor
                x={actorX}
                action="drift"
                local={u}
                cup={!flying}
                spill={ease(u / 2)}
              />
              {flying && (
                <Cup
                  x={cupAnchor('drift',releaseAt,220+ease(releaseAt/3)*380).x + (u - releaseAt) * 260}
                  y={cupAnchor('drift',releaseAt,220+ease(releaseAt/3)*380).y - 80 * Math.sin(Math.min(1, (u - releaseAt) / 2) * Math.PI)}
                  rotation={(u - releaseAt) * 140}
                  spill={1}
                  scale={1.9}
                />
              )}
              {/* O Chão em destaque vermelho/ciano freando */}
              <g opacity={ease((u - cue('chão', 1)) / 0.4)}>
                <path d="M 60 1390 h 880" stroke={C.cyan} strokeWidth="12" />
                <Label y={1440} size={32} color={C.cream}>Chão travado instantaneamente</Label>
              </g>
              {/* Vetores mostrando que o ar e objetos continuam a 1.600 km/h */}
              <ForceVector x={actorX + 30} y={690} length={260} label="AR + BUGI: 1.670 km/h" />
            </>
          );
        })()}

        {/* TURNO 3: Bugi: 'Eu pedi uma pausa, porra! Não um lançamento!' */}
        {i === 3 && (
          <>
            <BugiActor x={500} action="brace" local={u} speech={speaking} />
            <g stroke={C.ink} strokeWidth="13">
              <path d="M698 1330V720" />
              <rect x="570" y="650" width="260" height="100" rx="18" fill={C.gold} />
            </g>
            <Label x={700} y={718} size={34}>LESTE →</Label>
            <g opacity={1 - ease(u / 1)} stroke={C.cream} strokeWidth="9">
              <path d="M140 870h180m-120 70h100" />
            </g>
          </>
        )}

        {/* DEMAIS TURNOS PRESERVADOS INTEGRALMENTE */}
        {i === 4 && (() => {
          const at = cue('freia', 2), brake = ease((u - at) / 0.6);
          return (
            <>
              <g transform={`translate(${-180 * (1 - brake) * ease(u / 1)} 0)`}>
                <rect x="90" y="440" width="900" height="910" rx="80" fill={C.gold} stroke={C.ink} strokeWidth="15" />
                <rect x="130" y="500" width="820" height="330" rx="25" fill="#AADCE0" />
                {[0, 1, 2].map(j => (
                  <path key={j} d={`M${380 + j * 260} 510v310`} stroke={C.ink} strokeWidth="10" />
                ))}
                <rect x="140" y="840" width="800" height="450" fill="#EDC075" />
                <path d="M230 650v600m560-600v600" stroke={C.ink} strokeWidth="12" />
                <path d="M160 1190h180v-180m450 180h120v-180" stroke="#3D7276" strokeWidth="65" fill="none" />
                <BugiActor x={460 + brake * 100} floor={1270} scale={1.5} action={brake > 0.1 ? 'brake' : 'carry'} local={Math.max(0, u - at)} cup spill={brake} />
                <circle cx="270" cy="1360" r="73" fill={C.ink} />
                <circle cx="810" cy="1360" r="73" fill={C.ink} />
              </g>
              <Label y={320} size={66}>É A INÉRCIA</Label>
              {brake > 0.1 && <ForceVector x={450} y={900} length={230 * brake} />}
              <Label y={1440} size={26}>Analogia do ônibus • aceleração de frenagem</Label>
            </>
          );
        })()}

        {i === 5 && (
          <>
            <BugiActor x={430} action="point" local={u} speech={speaking} />
            <path d="M200 1360h460" stroke={C.cyan} strokeWidth="12" />
            <Label y={430} size={54}>Parado em relação à rua.</Label>
          </>
        )}

        {i === 6 && (() => {
          const p = ease((u - cue('rotação', 3)) / 0.8), number = ease((u - cue('mil', 4)) / 0.3);
          return (
            <>
              <Label y={280} color={C.cream} size={53}>Você já acompanha a Terra</Label>
              <Globe time={u} />
              <circle cx={540 + 325 * Math.sin(u * 0.314)} cy={850 + 38 * Math.cos(u * 0.314)} r="20" fill={C.coral} />
              <g opacity={p}>
                <ForceVector x={370} y={1300} length={340} color={C.gold} />
                <g opacity={number}>
                  <Label y={1410} size={72} color={C.gold}>≈ 1.670 km/h</Label>
                </g>
                <Label y={1230} size={32} color={C.cream}>Perto do Equador</Label>
              </g>
            </>
          );
        })()}

        {i === 7 && (
          <>
            <g transform={`translate(${mix(110, 700, ease(u / 2.5))} ${680 - 100 * Math.sin(Math.PI * ease(u / 2.5))}) rotate(${u * 30})`}>
              <Cup x={0} y={0} scale={4} spill={1} />
              <path d="M-300 0h170m-130 50h90" stroke={C.cream} strokeWidth="15" strokeLinecap="round" />
            </g>
            <BugiActor x={350} action="point" local={u} speech={speaking} />
            <Label y={350} size={54}>O café também estava indo junto.</Label>
          </>
        )}

        {i === 8 && (() => {
          const east = ease((u - cue('quatrocentos', 3)) / 2);
          return (
            <>
              <g transform={`translate(${-east * 90} 0)`}>
                <path d="M110 1170h850m-850-35v70m850-70v70" stroke={C.ink} strokeWidth="9" />
                {[0, 1, 2, 3, 4].map(j => (
                  <g key={j}>
                    <path d={`M${110 + j * 210} 1150v40`} stroke={C.gold} strokeWidth="8" />
                    <text x={110 + j * 210} y={1250} textAnchor="middle" fill={C.ink} fontSize={35} fontWeight="900">
                      {j === 4 ? '≈460 m' : `${j * 115}`}
                    </text>
                  </g>
                ))}
                <Cup x={110 + east * 850} y={1040} scale={2.1} spill={east} rotation={east * 90} />
              </g>
              <Label y={330} size={53}>1 segundo de movimento livre</Label>
              <Label y={430} size={79} color={C.coral}>≈ {Math.round(east * 460)} metros</Label>
              <Label y={1350} size={31}>Conta idealizada: velocidade × tempo</Label>
              <Label y={1400} size={28}>Sem obstáculos • não prevê o trajeto real</Label>
            </>
          );
        })()}

        {i === 9 && <>
          <Label y={300} color={C.cream} size={53}>Próxima parada: o polo?</Label>
          <g transform="translate(0 -160)"><Globe time={u} /></g>
          <path d="M780 870 Q920 650 570 390" fill="none" stroke={C.gold} strokeWidth="12" strokeDasharray="22 18" strokeDashoffset={-u*90}/>
          <BugiActor x={mix(230,680,ease(u/2))} floor={1390} scale={1.35} action="run" local={u} speech={speaking}/>
        </>}

        {i === 10 && (() => {
          const latitude=75*ease(u/6), weather=ease((u-cue('ar',6))/1.3);
          return <>
            <Label y={280} color={C.cream} size={48}>Mais perto do polo, menor velocidade</Label>
            <g transform="translate(0 -80)"><Globe time={u} latitude={latitude}/></g>
            <Label y={1170} color={C.gold} size={64}>{Math.round(latitude)}° → {Math.round(rotationKmh(latitude)).toLocaleString('pt-BR')} km/h</Label>
            <Label y={1240} color={C.cream} size={28}>Velocidade da superfície pela rotação</Label>
            <g opacity={weather}>
              {[0,1,2,3].map(j=><path key={j} d={`M${90+((u*140+j*250)%900)} ${480+j*130} h150 q60 0 30 -35`} fill="none" stroke={C.cream} strokeWidth="10"/ >)}
              <path d={`M0 1390 Q135 ${1340+Math.sin(u*3)*30} 270 1390 T540 1390 T810 1390 T1080 1390 V1480 H0Z`} fill={C.cyan} opacity=".6"/>
              <Label y={1370} color={C.cream} size={37}>Ar • água • estruturas</Label>
            </g>
          </>;
        })()}

        {i === 11 && <>
          <BugiActor x={450} action="point" local={u} speech={speaking}/>
          <g transform={`translate(820 650) rotate(${u*35})`}><circle r="115" fill={C.cream} stroke={C.ink} strokeWidth="10"/><path d="M0 -80 V0 L65 20" fill="none" stroke={C.coral} strokeWidth="12"/></g>
          <Label y={330} size={60}>E depois de 1 segundo?</Label>
        </>}

        {i === 12 && (() => {
          const orbit=ease((u-cue('órbita',5))/0.6), gravity=ease((u-cue('gravidade',3))/0.5);
          return <>
            <Label y={280} color={C.cream} size={50}>Retomar não desfaz os impactos</Label>
            <g opacity={1-orbit}>
              <g transform="translate(0 -80)"><Globe time={u}/></g>
              <g opacity={gravity}><path d="M540 410v150m-30-35 30 35 30-35" stroke={C.gold} strokeWidth="12" fill="none"/>
              <Label y={1240} size={48} color={C.gold}>A gravidade continua</Label></g>
            </g>
            <g opacity={orbit}>
              <ellipse cx="540" cy="820" rx="385" ry="220" stroke={C.cream} strokeWidth="5" fill="none" strokeDasharray="18 15"/>
              <circle cx="540" cy="820" r={95+3*Math.sin(u*2)} fill={C.gold}/>
              <g transform={`translate(${540+385*Math.cos(u*.65)} ${820+220*Math.sin(u*.65)})`}>
                <circle r="48" fill={C.cyan} stroke={C.cream} strokeWidth="4"/><path d="M-25-25 5-32 24-5 3 30-20 10Z" fill="#78A868"/>
              </g>
              <Label y={1180} color={C.cream} size={42}>A Terra continua ao redor do Sol</Label>
              <Label y={1260} color={C.gold} size={32}>Esquema sem escala • órbita ≠ rotação</Label>
            </g>
            <Label y={1390} color={C.cream} size={30}>Parada e retomada são a hipótese fictícia</Label>
          </>;
        })()}

        {i === 13 && <>
          <BugiActor x={mix(390,480,ease(u/3.5))} action={u<1.5?'point':'recover'} local={u} speech={speaking}/>
          <g opacity={1-ease((u-1.2)/.5)}>
            <rect x="650" y="650" width="240" height="140" rx="30" fill={C.coral} stroke={C.ink} strokeWidth="9"/>
            <path d="M730 690v60m65-60v60" stroke={C.cream} strokeWidth="19"/>
            <path d="M670 675 870 770" stroke={C.ink} strokeWidth="12"/>
          </g>
          <g opacity={ease((u-1.7)/.6)} transform={`translate(${mix(850,760,ease((u-1.7)/1.2))} 1240)`}>
            <rect x="-80" y="-30" width="160" height="180" rx="22" fill={C.gold} stroke={C.ink} strokeWidth="10"/>
            <path d="M-35-30v-50h70v50" stroke={C.ink} strokeWidth="10" fill="none"/>
            <circle cx="-50" cy="160" r="13" fill={C.ink}/><circle cx="50" cy="160" r="13" fill={C.ink}/>
          </g>
          <Label y={320} size={56}>Férias, com a Terra girando.</Label>
        </>}

        {/* Indicador de fala do narrador */}
        {!bugi && t >= turn.start && t < turn.end && (
          <g transform="translate(105 170)">
            <rect x="-25" y="-30" width="155" height="68" rx="34" fill={C.ink} />
            <circle r={13 + amp * 4} fill={C.cyan} />
            {[0, 1, 2, 3].map(j => (
              <path key={j} d={`M${35 + j * 19} ${-5 - amp * (15 + j * 3)}v${10 + amp * (30 + j * 6)}`} stroke={C.cyan} strokeWidth="6" strokeLinecap="round" />
            ))}
          </g>
        )}
      </svg>

      {/* Legendas sincronizadas com palavra ativa destacada */}
      {page && (
        <div style={{position: 'absolute', left: 85, right: 145, top: 1500, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#122638EE', borderRadius: 20, padding: '14px 22px', color: C.cream, fontSize: 59, fontWeight: 900, lineHeight: 1.12, textAlign: 'center', boxShadow: `0 5px 0 ${bugi ? C.coral : C.cyan}`}}>
            {page.map((w, j) => (
              <React.Fragment key={j}>
                <span style={{color: t >= w.start && t < w.end ? (bugi ? C.gold : C.cyan) : C.cream}}>
                  {w.word}
                </span>
                {j < page.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
