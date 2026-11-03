import {
  AICallCostEntry,
  AIModelSlotConfig,
  Episode,
  ResearchIdea,
  StudioAsset,
  StudioErrorLogEntry,
} from '../types/studio';
import { generateBugiCanonicalSvgMarkup } from '../components/BugiCharacterSvg';

/**
 * Gera um pequeno arquivo WAV (RIFF PCM 8kHz mono) válido em base64 para que
 * o player de áudio funcione imediatamente na demonstração local antes mesmo
 * de disparar uma chamada paga ou online ao Gemini TTS.
 */
export function createDemoWavDataUrl(durationSec = 3): string {
  const sampleRate = 8000;
  const numSamples = Math.min(sampleRate * 4, Math.floor(sampleRate * durationSec));
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = t < 1.0 ? 440 : t < 2.0 ? 554.37 : 659.25;
    const envelope = Math.exp(-3 * (t % 1.0));
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.22 * envelope;
    view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(buffer).toString('base64');
  return `data:audio/wav;base64,${b64}`;
}

export const INITIAL_EPISODES: Episode[] = [
  {
    id: 'ep-atrito-5s',
    ownerId: 'local-studio-owner',
    title: 'E se o atrito desaparecesse por 5 segundos?',
    hypothesis:
      'O coeficiente de atrito estático e cinético (μ) entre todas as superfícies sólidas da Terra cai instantaneamente para zero durante exatos 5 segundos.',
    slogan: 'Muda uma regra. Começa o caos.',
    stage: 'Pronto para Codex',
    createdAt: '2026-11-01T14:00:00.000Z',
    updatedAt: '2026-11-03T08:15:00.000Z',
    scientificSummary:
      'Sem força de atrito (F_a = μ · N = 0), nenhum sapato ou pneu consegue empurrar o chão para trás para gerar propulsão ou frenagem. Pela Primeira Lei de Newton (Inércia), quem já estava em movimento continua deslizando em linha reta com velocidade constante até colidir com um obstáculo ou até o atrito voltar abruptamente.',
    verifiedReferences: [
      {
        id: 'ref-atrito-1',
        title: 'Friction and Normal Force — HyperPhysics (Georgia State University)',
        url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/frict.html',
        sourceName: 'Georgia State University — HyperPhysics',
        consultedAt: '2026-11-02T16:20:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary:
          'Define a relação F_f <= μ·N e explica como a locomoção bípede depende da força de reação horizontal gerada pelo atrito estático entre a sola do pé e o solo.',
      },
      {
        id: 'ref-atrito-2',
        title: "Newton's First Law of Motion (Inertia) — NASA Glenn Research Center",
        url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/newtons-laws-of-motion/',
        sourceName: 'NASA Glenn Research Center',
        consultedAt: '2026-11-02T16:25:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary:
          'Corpos em movimento retilíneo uniforme mantêm seu vetor velocidade na ausência de forças resultantes externas horizontais.',
      },
    ],
    activeScriptVersionId: 'sv-atrito-v2',
    scriptVersions: [
      {
        id: 'sv-atrito-v1',
        versionNumber: 1,
        createdAt: '2026-11-01T15:10:00.000Z',
        authorNote: 'Rascunho inicial — ritmo ainda lento no segundo bloco.',
        status: 'rejeitado',
        targetDurationRangeSec: [35, 55],
        alternativeTitles: [
          'E se o atrito desaparecesse por 5 segundos?',
          '5 Segundos Sem Atrito: O Bugi Não Consegue Parar!',
        ],
        selectedTitle: 'E se o atrito desaparecesse por 5 segundos?',
        hookProposals: [
          {
            id: 'hk-v1-1',
            label: 'Gancho Direto',
            hookText:
              'Dê um único passo enquanto o atrito some por 5 segundos e tente não virar um projétil humano!',
            firstSecondVisual: 'Bugi dando um passo confiante na calçada quando o chão brilha em ciano.',
            selected: true,
          },
        ],
        segments: [
          {
            id: 'seg-v1-1',
            order: 1,
            sentenceText:
              'Dê um único passo enquanto o atrito some por 5 segundos e tente não virar um projétil humano!',
            speakingDirection: 'Firme e rápido.',
            visualPlanning: 'Bugi caminhando na calçada.',
            estimatedDurationSec: 8,
          },
        ],
        scientificNotes: ['Revisar transição do retorno do atrito no segundo 5.'],
        references: [],
      },
      {
        id: 'sv-atrito-v2',
        versionNumber: 2,
        createdAt: '2026-11-02T18:40:00.000Z',
        authorNote: 'Versão final aprovada (43 segundos) — ritmo de Shorts com 6 cenas e humor físico.',
        status: 'aprovado',
        targetDurationRangeSec: [35, 55],
        alternativeTitles: [
          'E se o atrito desaparecesse por 5 segundos?',
          'O Chão Virou Sabão Cósmico por 5 Segundos!',
          'Muda a Regra: Atrito Zero por 5 Segundos!',
        ],
        selectedTitle: 'E se o atrito desaparecesse por 5 segundos?',
        hookProposals: [
          {
            id: 'hk-v2-1',
            label: 'Gancho 1 — Ação Instantânea (Selecionado)',
            hookText:
              'O Bugi só queria atravessar a calçada, mas o atrito da Terra acabou de zerar por exatos 5 segundos!',
            firstSecondVisual:
              'Close nos tênis claros do Bugi tocando a calçada enquanto uma onda ciano zera o medidor μ = 0.00.',
            selected: true,
          },
          {
            id: 'hk-v2-2',
            label: 'Gancho 2 — Desafio de Sobrevivência',
            hookText:
              'Se o atrito sumisse agora por 5 segundos, ficar em pé seria a coisa mais difícil da sua vida!',
            firstSecondVisual:
              'Bugi confiante apontando para o cronômetro de 5 segundos antes de perder o chão.',
            selected: false,
          },
          {
            id: 'hk-v2-3',
            label: 'Gancho 3 — Caos Urbano',
            hookText:
              'Cinco segundos sem nenhuma aderência no planeta: olha o que a inércia faz com o Bugi!',
            firstSecondVisual:
              'Bugi deslizando de braços abertos feito patinador desgovernado pela calçada.',
            selected: false,
          },
        ],
        segments: [
          {
            id: 'seg-atrito-1',
            order: 1,
            sentenceText:
              'O Bugi só queria atravessar a calçada, mas o atrito da Terra acabou de zerar por exatos 5 segundos!',
            speakingDirection:
              'Entrada explosiva no primeiro segundo, ênfase em "zerar" e "5 segundos".',
            visualPlanning:
              'Bugi caminhando confiante de jaqueta azul-petróleo até o piso emitir um pulso ciano e o cronômetro 05.0s disparar.',
            estimatedDurationSec: 6.5,
            scientificNote:
              'Para caminhar, empurramos o chão para trás e o atrito estático nos empurra para frente.',
          },
          {
            id: 'seg-atrito-2',
            order: 2,
            sentenceText:
              'No segundo 1, o tênis dele tenta empurrar o chão para trás, mas sem atrito o pé simplesmente patina no vazio!',
            speakingDirection: 'Ritmo ágil, tom de surpresa cômica em "patina no vazio".',
            visualPlanning:
              'Os olhos pretos do Bugi arregalam; os tênis claros perdem aderência total e saem faíscas ciano de velocidade.',
            estimatedDurationSec: 7.5,
            scientificNote: 'F_atrito = μ · N. Quando μ = 0, a força horizontal de tração é nula.',
          },
          {
            id: 'seg-atrito-3',
            order: 3,
            sentenceText:
              'Pela Primeira Lei de Newton, como o Bugi já estava andando a 5 km/h, ele vira um curling humano impossível de frear!',
            speakingDirection: 'Humor inteligente, destacando "curling humano impossível de frear".',
            visualPlanning:
              'Bugi escorrega em linha reta com velocidade constante na calçada, passando por uma placa de rua enquanto gira os braços.',
            estimatedDurationSec: 8.0,
            scientificNote:
              'Inércia: sem forças dissipativas horizontais, o vetor velocidade do centro de massa permanece constante.',
          },
          {
            id: 'seg-atrito-4',
            order: 4,
            sentenceText:
              'Ele tenta girar os braços desesperado para recuperar o equilíbrio, mas até os parafusos e objetos ao redor começam a se soltar!',
            speakingDirection: 'Crescente de caos, voz animada e expressiva.',
            visualPlanning:
              'Bugi fazendo malabarismo com o corpo para não tombar para trás enquanto uma xícara e um jornal deslizam ao lado dele.',
            estimatedDurationSec: 7.5,
            scientificNote:
              'Pregos, nós de cadarço e roscas de parafusos dependem inteiramente do atrito estático para permanecerem fixos.',
          },
          {
            id: 'seg-atrito-5',
            order: 5,
            sentenceText:
              'O perigo real chega no segundo 5: quando o atrito volta de repente, os pés do Bugi travam no chão, mas o tronco continua indo pra frente!',
            speakingDirection: 'Tensão máxima antes do impacto cômico em "travam no chão".',
            visualPlanning:
              'Cronômetro chega a 00.0s! Os tênis claros grudam no asfalto com um estalo amarelo e o momento angular joga o Bugi para frente.',
            estimatedDurationSec: 7.5,
            scientificNote:
              'Torque súbito na base de apoio gera rotação imediata em torno do ponto de contato dos pés.',
          },
          {
            id: 'seg-atrito-6',
            order: 6,
            sentenceText:
              'O Bugi aterrissa salvo num monte de sacos de espuma — provando que sem atrito é fácil sair do lugar, difícil mesmo é parar!',
            speakingDirection: 'Fechamento memorável, sorriso na voz e punchline clara.',
            visualPlanning:
              'Bugi sentado com o cabelo coral todo espetado fazendo joinha meio tonto. Selo final: Muda uma regra. Começa o caos.',
            estimatedDurationSec: 6.0,
            scientificNote:
              'A dissipação de energia cinética no pouso ocorre por deformação inelástica da espuma.',
          },
        ],
        scientificNotes: [
          'Equação chave: F_atrito = μ · N (com μ = 0 durante os 5 segundos).',
          'Conservação da quantidade de movimento linear durante o deslizamento: p = m · v = constante.',
          'Retorno abrupto de μ restaura a força tangencial nos pés, gerando torque τ = r × F.',
        ],
        references: [
          {
            id: 'ref-atrito-1',
            title: 'Friction and Normal Force — HyperPhysics (Georgia State University)',
            url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/frict.html',
            sourceName: 'Georgia State University — HyperPhysics',
            consultedAt: '2026-11-02T16:20:00.000Z',
            isGroundedBySearch: true,
            verifiedSummary: 'Relação F_f <= μ·N na mecânica clássica.',
          },
        ],
      },
    ],
    activeNarrationId: 'nar-atrito-1',
    narrationTracks: [
      {
        id: 'nar-atrito-1',
        scriptVersionId: 'sv-atrito-v2',
        createdAt: '2026-11-02T19:05:00.000Z',
        model: 'gemini-3.8-flash-tts',
        voice: 'Puck',
        interpretationStyle: 'Narrador brasileiro dinâmico, curioso, bem-humorado e claro',
        pace: 'Dinâmico (Shorts)',
        expressiveness: 'Alta',
        language: 'pt-BR',
        audioDataUrl: createDemoWavDataUrl(3),
        mimeType: 'audio/wav',
        durationSec: 43.0,
        isManualUpload: false,
        fileName: 'narration-ep-atrito-5s.wav',
        alignmentType: 'estimated_from_duration',
        approved: true,
        temporalMarkers: [
          {
            id: 'tm-atrito-1',
            segmentId: 'seg-atrito-1',
            label: 'Cena 1 — Gancho na Calçada',
            startSec: 0,
            endSec: 6.5,
            text: 'O Bugi só queria atravessar a calçada, mas o atrito da Terra acabou de zerar por exatos 5 segundos!',
            alignmentSource: 'estimated_from_duration',
          },
          {
            id: 'tm-atrito-2',
            segmentId: 'seg-atrito-2',
            label: 'Cena 2 — Perda de Aderência',
            startSec: 6.5,
            endSec: 14.0,
            text: 'No segundo 1, o tênis dele tenta empurrar o chão para trás, mas sem atrito o pé simplesmente patina no vazio!',
            alignmentSource: 'estimated_from_duration',
          },
          {
            id: 'tm-atrito-3',
            segmentId: 'seg-atrito-3',
            label: 'Cena 3 — Curling Humano (Inércia)',
            startSec: 14.0,
            endSec: 22.0,
            text: 'Pela Primeira Lei de Newton, como o Bugi já estava andando a 5 km/h, ele vira um curling humano impossível de frear!',
            alignmentSource: 'estimated_from_duration',
          },
          {
            id: 'tm-atrito-4',
            segmentId: 'seg-atrito-4',
            label: 'Cena 4 — Tentando Recuperar o Equilíbrio',
            startSec: 22.0,
            endSec: 29.5,
            text: 'Ele tenta girar os braços desesperado para recuperar o equilíbrio, mas até os parafusos e objetos ao redor começam a se soltar!',
            alignmentSource: 'estimated_from_duration',
          },
          {
            id: 'tm-atrito-5',
            segmentId: 'seg-atrito-5',
            label: 'Cena 5 — Segundo 5: O Atrito Volta!',
            startSec: 29.5,
            endSec: 37.0,
            text: 'O perigo real chega no segundo 5: quando o atrito volta de repente, os pés do Bugi travam no chão, mas o tronco continua indo pra frente!',
            alignmentSource: 'estimated_from_duration',
          },
          {
            id: 'tm-atrito-6',
            segmentId: 'seg-atrito-6',
            label: 'Cena 6 — Pouso e Moral Científica',
            startSec: 37.0,
            endSec: 43.0,
            text: 'O Bugi aterrissa salvo num monte de sacos de espuma — provando que sem atrito é fácil sair do lugar, difícil mesmo é parar!',
            alignmentSource: 'estimated_from_duration',
          },
        ],
      },
    ],
    scenes: [
      {
        id: 'scene-atrito-1',
        order: 1,
        scriptSegmentId: 'seg-atrito-1',
        correspondingText:
          'O Bugi só queria atravessar a calçada, mas o atrito da Terra acabou de zerar por exatos 5 segundos!',
        approxDurationSec: 6.5,
        definitiveDurationSec: 6.5,
        startTimeSec: 0,
        endTimeSec: 6.5,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Calçada Urbana Brasileira com faixa de pedestres e placa μ = 0',
        scenarioPreset: 'calcada_urbana',
        mainAction:
          'Bugi caminha confiante pela calçada até uma onda luminosa ciano transformar o chão num espelho sem atrito.',
        bugiPose: 'caminhando',
        bugiExpression: 'confiante',
        cameraMovement: 'Zoom punch-in rápido (1.0x -> 1.18x) focado no passo inicial do Bugi',
        animations: [
          'Ciclo de caminhada 2D do Bugi (30 FPS)',
          'Pulso de onda ciano (#39C8D5) varrendo o chão no frame 18',
          'HUD superior ativando contagem regressiva 05.0s',
        ],
        subtitlesText:
          'O Bugi só queria atravessar a calçada, mas o atrito zerou por 5 segundos!',
        soundEffects: ['SFX Power Down Tecnológico (μ = 0)', 'SFX Passo Seco seguido de Brilho'],
        transitionInstruction: 'Corte seco no exato frame em que o pé desliza (Frame 195)',
        scientificObservations:
          'Mostrar visualmente o coeficiente μ caindo de 0.70 (borracha no asfalto) para 0.00.',
      },
      {
        id: 'scene-atrito-2',
        order: 2,
        scriptSegmentId: 'seg-atrito-2',
        correspondingText:
          'No segundo 1, o tênis dele tenta empurrar o chão para trás, mas sem atrito o pé simplesmente patina no vazio!',
        approxDurationSec: 7.5,
        definitiveDurationSec: 7.5,
        startTimeSec: 6.5,
        endTimeSec: 14.0,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Calçada Urbana Brasileira — Piso espelhado sem aderência',
        scenarioPreset: 'calcada_urbana',
        mainAction:
          'Bugi perde totalmente a aderência no chão; seus pés escorregam para frente e para trás sem gerar tração.',
        bugiPose: 'escorregando',
        bugiExpression: 'surpreso',
        cameraMovement: 'Tilt dinâmico acompanhando os tênis claros e subindo para o rosto surpreso',
        animations: [
          'Pernas em movimento acelerado de patinação sem sair do lugar na aceleração',
          'Olhos pretos grandes expandindo 15% com choque cômico',
          'Setas vetoriais mostrando F_atrito = 0 N',
        ],
        subtitlesText:
          'Sem atrito, o tênis tenta empurrar o chão, mas patina no vazio!',
        soundEffects: ['SFX Cartoon Slip Agudo', 'SFX Whoosh Duplo nas Pernas'],
        transitionInstruction: 'Whip pan horizontal para a direita (6 frames)',
        scientificObservations:
          'Terceira Lei de Newton: sem força tangencial no solo, não há reação horizontal propulsora.',
      },
      {
        id: 'scene-atrito-3',
        order: 3,
        scriptSegmentId: 'seg-atrito-3',
        correspondingText:
          'Pela Primeira Lei de Newton, como o Bugi já estava andando a 5 km/h, ele vira um curling humano impossível de frear!',
        approxDurationSec: 8.0,
        definitiveDurationSec: 8.0,
        startTimeSec: 14.0,
        endTimeSec: 22.0,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Calçada Urbana em movimento contínuo (Parallax)',
        scenarioPreset: 'calcada_urbana',
        mainAction:
          'Bugi desliza em velocidade constante de 5 km/h feito uma pedra de curling humano, incapaz de frear.',
        bugiPose: 'escorregando',
        bugiExpression: 'panico_divertido',
        cameraMovement: 'Tracking shot lateral acompanhando o Bugi a velocidade constante',
        animations: [
          'Parallax horizontal do cenário urbano a 18px/frame',
          'Vetor velocidade constante (v = 1,38 m/s) desenhado em ciano ao lado do Bugi',
          'Cabelo coral espetado vibrando com o vento',
        ],
        subtitlesText:
          'Pela 1ª Lei de Newton, ele vira um curling humano impossível de frear!',
        soundEffects: ['SFX Deslizamento Contínuo de Gelo', 'SFX Vento Suave'],
        transitionInstruction: 'Zoom contínuo para plano médio do Bugi',
        scientificObservations:
          'Inércia pura: ∑F_x = 0 implica aceleração a_x = 0 e velocidade constante.',
      },
      {
        id: 'scene-atrito-4',
        order: 4,
        scriptSegmentId: 'seg-atrito-4',
        correspondingText:
          'Ele tenta girar os braços desesperado para recuperar o equilíbrio, mas até os parafusos e objetos ao redor começam a se soltar!',
        approxDurationSec: 7.5,
        definitiveDurationSec: 7.5,
        startTimeSec: 22.0,
        endTimeSec: 29.5,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Cruzamento e fachada do Laboratório do Bugi',
        scenarioPreset: 'laboratorio_bugi',
        mainAction:
          'Bugi gira os braços feito hélice tentando recuperar o equilíbrio enquanto objetos ao fundo deslizam sozinhos.',
        bugiPose: 'equilibrando',
        bugiExpression: 'panico_divertido',
        cameraMovement: 'Leve câmera tremida (Handheld shake 2 degrees) para enfatizar a tentativa de equilíbrio',
        animations: [
          'Rotação alternada dos braços da jaqueta azul-petróleo (conservação de momento angular)',
          'Cadarço do tênis claro se desamarrando sozinho por falta de atrito entre as fibras',
        ],
        subtitlesText:
          'Ele gira os braços tentando recuperar o equilíbrio enquanto tudo se solta!',
        soundEffects: ['SFX Giro Rápido de Braços', 'SFX Parafusos Soltando (Plim!)'],
        transitionInstruction: 'Flash amarelo de alerta no cronômetro (01.0s -> 00.0s)',
        scientificObservations:
          'Girar os braços altera a orientação do tronco por conservação de momento angular interno, mas não freia o centro de massa.',
      },
      {
        id: 'scene-atrito-5',
        order: 5,
        scriptSegmentId: 'seg-atrito-5',
        correspondingText:
          'O perigo real chega no segundo 5: quando o atrito volta de repente, os pés do Bugi travam no chão, mas o tronco continua indo pra frente!',
        approxDurationSec: 7.5,
        definitiveDurationSec: 7.5,
        startTimeSec: 29.5,
        endTimeSec: 37.0,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Calçada Urbana — Retorno instantâneo do atrito',
        scenarioPreset: 'calcada_urbana',
        mainAction:
          'O cronômetro zera! O atrito volta de golpe, travando os tênis claros do Bugi enquanto o corpo é lançado para frente.',
        bugiPose: 'caindo',
        bugiExpression: 'surpreso',
        cameraMovement: 'Slow-motion dramático por 12 frames seguido de whip pan rápido',
        animations: [
          'Ondas de choque coral (#FF6B50) e amarelas (#FFD166) na sola dos tênis',
          'Inclinação frontal de 32 graus do Bugi pelo torque súbito',
        ],
        subtitlesText:
          'No segundo 5 o atrito volta de repente: os pés travam, mas o corpo continua!',
        soundEffects: ['SFX Freio de Pneu Brutal (Screech!)', 'SFX Alarme Zero Segundo'],
        transitionInstruction: 'Corte no auge da queda para o pouso macio',
        scientificObservations:
          'A desaceleração brusca na base gera um momento de força (torque) em relação ao centro de massa.',
      },
      {
        id: 'scene-atrito-6',
        order: 6,
        scriptSegmentId: 'seg-atrito-6',
        correspondingText:
          'O Bugi aterrissa salvo num monte de sacos de espuma — provando que sem atrito é fácil sair do lugar, difícil mesmo é parar!',
        approxDurationSec: 6.0,
        definitiveDurationSec: 6.0,
        startTimeSec: 37.0,
        endTimeSec: 43.0,
        timeCalculationMode: 'calculado_audio_real',
        charactersPresent: ['Bugi'],
        scenario: 'Calçada Urbana com colchão de segurança do estúdio',
        scenarioPreset: 'parque_gravidade',
        mainAction:
          'Bugi se levanta ileso, ajeita a jaqueta azul-petróleo e sorri confiante ao lado do slogan do canal.',
        bugiPose: 'confiante_parado',
        bugiExpression: 'deslumbrado',
        cameraMovement: 'Zoom out suave revelando o card final "Muda uma regra. Começa o caos."',
        animations: [
          'Compressão elástica (Squash & Stretch) no pouso',
          'Piscada expressiva dos olhos pretos do Bugi no frame final',
        ],
        subtitlesText:
          'Sem atrito é fácil sair do lugar... difícil mesmo é conseguir parar!',
        soundEffects: ['SFX Pouso Fofo em Espuma (Poof!)', 'SFX Assinatura Sonora E Se Bugasse'],
        transitionInstruction: 'End Card Loop para Shorts (0.5s)',
        scientificObservations:
          'Síntese pedagógica da Primeira Lei de Newton aplicada ao cotidiano.',
      },
    ],
    assetIds: [
      'asset-bugi-rig-v1',
      'asset-pose-escorregando',
      'asset-pose-equilibrando',
      'asset-bg-calcada-v1',
      'asset-sfx-slip-v1',
    ],
    exportedToCodexAt: '2026-11-03T08:10:00.000Z',
    exportCount: 2,
    hasRealRenderedMp4: false,
    history: [
      {
        id: 'hist-atrito-4',
        timestamp: '2026-11-03T08:10:00.000Z',
        fromStage: 'Storyboard',
        toStage: 'Pronto para Codex',
        actionSummary:
          'Storyboard de 6 cenas calibrado com narração de 43,0s. Pacote JSON validado para Codex e Remotion (Sem MP4 renderizado ainda).',
      },
      {
        id: 'hist-atrito-3',
        timestamp: '2026-11-02T19:05:00.000Z',
        fromStage: 'Narracao',
        toStage: 'Storyboard',
        actionSummary: 'Narração PT-BR gerada (43,0s) e marcações temporais aplicadas.',
      },
      {
        id: 'hist-atrito-2',
        timestamp: '2026-11-02T18:40:00.000Z',
        fromStage: 'Roteiro',
        toStage: 'Narracao',
        actionSummary: 'Versão 2 do roteiro aprovada após revisão científica.',
      },
      {
        id: 'hist-atrito-1',
        timestamp: '2026-11-01T14:00:00.000Z',
        fromStage: 'Ideia',
        toStage: 'Roteiro',
        actionSummary: 'Episódio demonstrativo iniciado no E Se Bugasse? Studio.',
      },
    ],
  },
  {
    id: 'ep-gravidade-metade',
    ownerId: 'local-studio-owner',
    title: 'E se a gravidade caísse pela metade por 8 segundos?',
    hypothesis:
      'A aceleração gravitacional na superfície terrestre passa de 9,8 m/s² para 4,9 m/s² durante 8 segundos.',
    slogan: 'Muda uma regra. Começa o caos.',
    stage: 'Roteiro',
    createdAt: '2026-11-02T10:00:00.000Z',
    updatedAt: '2026-11-03T07:30:00.000Z',
    scientificSummary:
      'Com g = 4,9 m/s², o peso aparente cai pela metade, a altura dos saltos dobra (h = v₀² / 2g) e a pressão atmosférica sofre uma onda de expansão vertical momentânea.',
    verifiedReferences: [
      {
        id: 'ref-grav-1',
        title: 'Gravitational Acceleration and Free Fall — MIT OpenCourseWare',
        url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/',
        sourceName: 'MIT OpenCourseWare',
        consultedAt: '2026-11-02T11:00:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary:
          'Cinemática vertical sob aceleração constante g: tempo de voo t = 2·v_y / g e altura máxima h = v_y² / (2g).',
      },
    ],
    activeScriptVersionId: 'sv-grav-v1',
    scriptVersions: [
      {
        id: 'sv-grav-v1',
        versionNumber: 1,
        createdAt: '2026-11-02T12:00:00.000Z',
        authorNote: 'Roteiro em revisão — ajustando o salto do Bugi no parque.',
        status: 'em_revisao',
        targetDurationRangeSec: [35, 55],
        alternativeTitles: [
          'E se a gravidade caísse pela metade por 8 segundos?',
          'O Bugi Pulou um Poste: Gravidade 50% por 8 Segundos!',
        ],
        selectedTitle: 'E se a gravidade caísse pela metade por 8 segundos?',
        hookProposals: [
          {
            id: 'hk-grav-1',
            label: 'Gancho Salto Duplo',
            hookText:
              'O Bugi deu um pulinho pra desviar de uma poça d’água justo quando a gravidade caiu pela metade!',
            firstSecondVisual: 'Bugi subindo em câmera lenta até a altura da placa de trânsito.',
            selected: true,
          },
        ],
        segments: [
          {
            id: 'seg-grav-1',
            order: 1,
            sentenceText:
              'O Bugi deu um pulinho pra desviar de uma poça d’água justo quando a gravidade caiu pela metade!',
            speakingDirection: 'Leve e surpreso.',
            visualPlanning: 'Bugi flutuando no Parque da Cidade.',
            estimatedDurationSec: 12,
          },
          {
            id: 'seg-grav-2',
            order: 2,
            sentenceText:
              'Com metade da aceleração gravitacional, cada passo vira um salto lunar em câmera lenta — até os 8 segundos acabarem lá no alto!',
            speakingDirection: 'Suspense cômico no final.',
            visualPlanning: 'Bugi olhando para baixo no pico da parábola quando o timer zera.',
            estimatedDurationSec: 14,
          },
          {
            id: 'seg-grav-3',
            order: 3,
            sentenceText:
              'Quando os 9,8 metros por segundo ao quadrado voltam no topo do pulo, a descida cobra o dobro da energia potencial!',
            speakingDirection: 'Energético e educativo.',
            visualPlanning: 'Vetor g amarelo apontando para baixo.',
            estimatedDurationSec: 12,
          },
        ],
        scientificNotes: ['Tempo de subida aumenta por um fator de 2 para a mesma velocidade inicial.'],
        references: [],
      },
    ],
    narrationTracks: [],
    scenes: [
      {
        id: 'scene-grav-1',
        order: 1,
        scriptSegmentId: 'seg-grav-1',
        correspondingText:
          'O Bugi deu um pulinho pra desviar de uma poça d’água justo quando a gravidade caiu pela metade!',
        approxDurationSec: 12,
        startTimeSec: 0,
        endTimeSec: 12,
        timeCalculationMode: 'estimado_roteiro',
        charactersPresent: ['Bugi'],
        scenario: 'Parque Urbano',
        scenarioPreset: 'parque_gravidade',
        mainAction: 'Bugi salta e sobe o dobro da altura esperada.',
        bugiPose: 'flutuando',
        bugiExpression: 'deslumbrado',
        cameraMovement: 'Tilt vertical acompanhando o salto parabólico',
        animations: ['Parábola em gravidade reduzida (g = 4.9 m/s²)'],
        subtitlesText: 'A gravidade caiu pela metade bem na hora do pulo do Bugi!',
        soundEffects: ['SFX Boing Espacial'],
        transitionInstruction: 'Corte suave no ápice',
        scientificObservations: 'h_max = v0² / (2 * 4.9)',
      },
      {
        id: 'scene-grav-2',
        order: 2,
        scriptSegmentId: 'seg-grav-2',
        correspondingText:
          'Com metade da aceleração gravitacional, cada passo vira um salto lunar em câmera lenta!',
        approxDurationSec: 14,
        startTimeSec: 12,
        endTimeSec: 26,
        timeCalculationMode: 'estimado_roteiro',
        charactersPresent: ['Bugi'],
        scenario: 'Parque Urbano',
        scenarioPreset: 'parque_gravidade',
        mainAction: 'Bugi flutua ao lado da copa das árvores.',
        bugiPose: 'flutuando',
        bugiExpression: 'surpreso',
        cameraMovement: 'Pan lento',
        animations: ['Folhas e gotas de água subindo junto'],
        subtitlesText: 'Cada passo vira um salto lunar em câmera lenta!',
        soundEffects: ['SFX Vento nas Alturas'],
        transitionInstruction: 'Whip pan vertical',
        scientificObservations: 'Queda livre desacelerada.',
      },
      {
        id: 'scene-grav-3',
        order: 3,
        scriptSegmentId: 'seg-grav-3',
        correspondingText:
          'Quando os 9,8 m/s² voltam lá no alto, a descida cobra o preço completo!',
        approxDurationSec: 12,
        startTimeSec: 26,
        endTimeSec: 38,
        timeCalculationMode: 'estimado_roteiro',
        charactersPresent: ['Bugi'],
        scenario: 'Parque Urbano',
        scenarioPreset: 'parque_gravidade',
        mainAction: 'Bugi cai num arbusto macio quando a gravidade normal retorna.',
        bugiPose: 'caindo',
        bugiExpression: 'panico_divertido',
        cameraMovement: 'Drop rápido de câmera',
        animations: ['Aceleração 9.8 m/s² restaurada'],
        subtitlesText: 'Quando a gravidade normal volta lá no alto... segura!',
        soundEffects: ['SFX Queda Cartoon + Arbusto'],
        transitionInstruction: 'End Card',
        scientificObservations: 'Energia potencial E_p = m·g·h.',
      },
    ],
    assetIds: ['asset-bugi-rig-v1', 'asset-bg-parque-v1'],
    exportCount: 0,
    hasRealRenderedMp4: false,
    history: [
      {
        id: 'hist-grav-1',
        timestamp: '2026-11-02T12:00:00.000Z',
        fromStage: 'Pesquisa',
        toStage: 'Roteiro',
        actionSummary: 'Roteiro v1 criado a partir da pesquisa de gravidade reduzida.',
      },
    ],
  },
];

export const INITIAL_RESEARCH_IDEAS: ResearchIdea[] = [
  {
    id: 'idea-inercia-pausa',
    provisionalTitle: 'E se a água ficasse com a viscosidade do mel por 5 segundos?',
    suggestedHook:
      'O Bugi foi tomar um gole de água gelada exatamente no segundo em que a viscosidade de todos os líquidos multiplicou por dez mil!',
    scientificSummary:
      'Aumentar a viscosidade dinâmica (η) da água de 1 mPa·s para 10.000 mPa·s reduz drasticamente o Número de Reynolds (Re = ρ·v·L / η), transformando qualquer escoamento turbulento em fluxo laminar ultraviscoso instantaneamente.',
    verifiedFacts: [
      'A água a 20 °C possui viscosidade dinâmica aproximada de 1,002 mPa·s (0,001 Pa·s).',
      'O mel líquido possui viscosidade entre 2.000 e 10.000 mPa·s dependendo da temperatura.',
      'Pela Lei de Poiseuille, a vazão volumétrica em tubos é inversamente proporcional à viscosidade do fluido.',
    ],
    estimatedVisualPotential: 'Altíssimo',
    estimatedAnimationComplexity: 'Média',
    estimatedAudienceAppealNote:
      'Avaliação estimada da produção: contraste visual imediato entre jatos de torneira congelando no ar em câmera lenta e o Bugi tentando mexer o café.',
    scientificRisks: [
      'Não confundir viscosidade (resistência ao cisalhamento do fluxo) com densidade ou solidificação.',
      'Evitar sugerir que a água congela termicamente; a temperatura permanece constante.',
    ],
    references: [
      {
        id: 'ref-visc-1',
        title: 'Viscosity and Poiseuille Flow — Engineering ToolBox',
        url: 'https://www.engineeringtoolbox.com/water-dynamic-kinematic-viscosity-d_596.html',
        sourceName: 'The Engineering ToolBox',
        consultedAt: '2026-11-03T07:50:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary:
          'Tabelas verificadas de viscosidade dinâmica e cinemática da água e fluidos newtonianos.',
      },
    ],
    createdAt: '2026-11-03T07:55:00.000Z',
    status: 'aguardando_aprovacao',
  },
  {
    id: 'idea-som-lento',
    provisionalTitle: 'E se a velocidade do som no ar caísse para 15 km/h?',
    suggestedHook:
      'Uma buzina tocou atrás do Bugi, mas como o som agora viaja na velocidade de uma bicicleta, ele consegue correr lado a lado com o barulho!',
    scientificSummary:
      'No ar a 20 °C, o som viaja a ~343 m/s (1.235 km/h). Se caísse para 4,16 m/s (15 km/h), o Efeito Doppler seria extremo até para uma pessoa caminhando (Mach 0,3 a pé!) e existiriam cones sônicos visíveis na rua.',
    verifiedFacts: [
      'A velocidade do som no ar seco a 20 °C é de 343 m/s (aproximadamente 1.235 km/h).',
      'O deslocamento de frequência pelo Efeito Doppler depende da razão entre a velocidade da fonte/observador e a velocidade da onda no meio.',
    ],
    estimatedVisualPotential: 'Alto',
    estimatedAnimationComplexity: 'Média',
    estimatedAudienceAppealNote:
      'Avaliação estimada da produção: excelente oportunidade para animar ondas sonoras visíveis em ciano e coral que o Bugi ultrapassa correndo.',
    scientificRisks: [
      'Lembrar que o Bugi não fala: usar sons do ambiente (buzina, despertador, latido) para demonstrar o atraso acústico.',
    ],
    references: [
      {
        id: 'ref-som-1',
        title: 'Speed of Sound and Doppler Effect — NASA Glenn Research Center',
        url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/speed-of-sound/',
        sourceName: 'NASA Glenn Research Center',
        consultedAt: '2026-11-03T08:00:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary:
          'Fundamentos da propagação acústica e formação de ondas de choque quando v_objeto >= c_som.',
      },
    ],
    createdAt: '2026-11-03T08:02:00.000Z',
    status: 'aguardando_aprovacao',
  },
  {
    id: 'idea-reflexao-luz',
    provisionalTitle: 'E se todas as superfícies ficassem 100% espelhadas por 5 segundos?',
    suggestedHook:
      'Por 5 segundos, a reflexão difusa sumiu do planeta e todo tijolo, roupa e parede virou um espelho perfeito!',
    scientificSummary:
      'Enxergamos objetos opacos graças à reflexão difusa (espalhamento da luz em múltiplas direções). Se toda reflexão virasse especular perfeita (100%), você veria apenas reflexos cegantes do Sol e de fontes luminosas.',
    verifiedFacts: [
      'A reflexão especular preserva o ângulo de incidência (θ_i = θ_r), enquanto a reflexão difusa espalha fótons devido à rugosidade microscópica.',
    ],
    estimatedVisualPotential: 'Alto',
    estimatedAnimationComplexity: 'Alta',
    estimatedAudienceAppealNote:
      'Avaliação estimada da produção: labirinto de espelhos urbano com o Bugi esbarrando no próprio reflexo.',
    scientificRisks: [
      'Manter a silhueta e as cores canônicas do Bugi reconhecíveis mesmo com o efeito de brilho especular no cenário.',
    ],
    references: [
      {
        id: 'ref-luz-1',
        title: 'Specular vs. Diffuse Reflection — Physics Classroom',
        url: 'https://www.physicsclassroom.com/class/refln/Lesson-1/Specular-vs-Diffuse-Reflection',
        sourceName: 'The Physics Classroom',
        consultedAt: '2026-11-03T08:05:00.000Z',
        isGroundedBySearch: true,
        verifiedSummary: 'Comparação física entre reflexão especular e difusa em superfícies.',
      },
    ],
    createdAt: '2026-11-03T08:06:00.000Z',
    status: 'aguardando_aprovacao',
  },
];

export const INITIAL_ASSETS: StudioAsset[] = [
  {
    id: 'asset-bugi-rig-v1',
    name: 'Bugi — Rig 2D Canônico Completo (Master SVG)',
    category: 'Personagens SVG',
    version: '2.4.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'SVG Canônico Bugi',
    createdAt: '2026-11-01T10:00:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 18420,
    preservesBugiIdentity: true,
    bugiPose: 'confiante_parado',
    bugiExpression: 'confiante',
    scenarioPreset: 'laboratorio_bugi',
    svgContent: generateBugiCanonicalSvgMarkup('confiante_parado', 'confiante', 'laboratorio_bugi'),
    description:
      'Rig vetorial oficial do Bugi: cabelo coral espetado (#FF6B50), olhos pretos grandes, jaqueta azul-petróleo (#122638), camiseta creme (#FFF7E9), calça escura e tênis claros.',
    tags: ['bugi', 'master-rig', 'personagem-fixo', 'remotion-ready'],
  },
  {
    id: 'asset-pose-escorregando',
    name: 'Bugi Pose — Escorregando sem Atrito (μ = 0)',
    category: 'Poses',
    version: '1.2.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'SVG Canônico Bugi',
    createdAt: '2026-11-01T11:20:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 16800,
    preservesBugiIdentity: true,
    bugiPose: 'escorregando',
    bugiExpression: 'surpreso',
    scenarioPreset: 'calcada_urbana',
    svgContent: generateBugiCanonicalSvgMarkup('escorregando', 'surpreso', 'calcada_urbana'),
    description:
      'Pose chave do episódio de atrito zero: inclinação de -19°, braços abertos e pernas patinando.',
    tags: ['pose', 'atrito', 'escorregando', 'bugi'],
  },
  {
    id: 'asset-pose-equilibrando',
    name: 'Bugi Pose — Recuperando Equilíbrio (Giro de Braços)',
    category: 'Poses',
    version: '1.1.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'SVG Canônico Bugi',
    createdAt: '2026-11-01T11:45:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 16950,
    preservesBugiIdentity: true,
    bugiPose: 'equilibrando',
    bugiExpression: 'panico_divertido',
    scenarioPreset: 'calcada_urbana',
    svgContent: generateBugiCanonicalSvgMarkup('equilibrando', 'panico_divertido', 'calcada_urbana'),
    description:
      'Pose de tentativa de equilíbrio com conservação de momento angular nos braços.',
    tags: ['pose', 'equilibrio', 'inercia', 'bugi'],
  },
  {
    id: 'asset-exp-panico',
    name: 'Expressão Facial — Surpresa Extrema & Gota de Suor',
    category: 'Expressoes',
    version: '1.0.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'SVG Canônico Bugi',
    createdAt: '2026-11-01T12:00:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 8400,
    preservesBugiIdentity: true,
    bugiPose: 'caindo',
    bugiExpression: 'panico_divertido',
    scenarioPreset: 'calcada_urbana',
    svgContent: generateBugiCanonicalSvgMarkup('caindo', 'panico_divertido', 'calcada_urbana'),
    description:
      'Camada de expressão facial para momentos de consequência física inesperada.',
    tags: ['expressao', 'olhos-pretos', 'reacao', 'bugi'],
  },
  {
    id: 'asset-bg-calcada-v1',
    name: 'Cenário 9:16 — Calçada Urbana Brasileira (Faixa & Placa μ=0)',
    category: 'Cenarios',
    version: '1.3.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'Autal / Estúdio',
    createdAt: '2026-11-01T13:00:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 24100,
    preservesBugiIdentity: true,
    bugiPose: 'caminhando',
    bugiExpression: 'curioso',
    scenarioPreset: 'calcada_urbana',
    svgContent: generateBugiCanonicalSvgMarkup('caminhando', 'curioso', 'calcada_urbana'),
    description:
      'Cenário vetorial em camadas separadas (Fundo, Prédios, Calçada, Placa) pronto para parallax no Remotion.',
    tags: ['cenario', 'calcada', 'parallax', '9:16'],
  },
  {
    id: 'asset-bg-parque-v1',
    name: 'Cenário 9:16 — Parque da Gravidade & Árvores',
    category: 'Cenarios',
    version: '1.0.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'Autal / Estúdio',
    createdAt: '2026-11-02T09:30:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 22300,
    preservesBugiIdentity: true,
    bugiPose: 'flutuando',
    bugiExpression: 'deslumbrado',
    scenarioPreset: 'parque_gravidade',
    svgContent: generateBugiCanonicalSvgMarkup('flutuando', 'deslumbrado', 'parque_gravidade'),
    description: 'Cenário de parque urbano para experimentos de gravidade e óptica.',
    tags: ['cenario', 'parque', 'gravidade'],
  },
  {
    id: 'asset-obj-cronometro',
    name: 'Objeto HUD — Cronômetro de Regra Física (5.0s) + Vetores',
    category: 'Objetos',
    version: '1.1.0',
    license: 'Proprietária — Canal E Se Bugasse?',
    origin: 'Autal / Estúdio',
    createdAt: '2026-11-01T14:20:00.000Z',
    fileFormat: 'image/svg+xml',
    fileSizeBytes: 6200,
    preservesBugiIdentity: true,
    bugiPose: 'investigando',
    bugiExpression: 'determinado',
    scenarioPreset: 'laboratorio_bugi',
    description:
      'Componentes gráficos de setas de força resultante, velocímetro e contador regressivo.',
    tags: ['objeto', 'hud', 'vetores', 'fisica'],
  },
  {
    id: 'asset-sfx-slip-v1',
    name: 'SFX Pack — Escorregão Cartoon + Freio Brusco + Whoosh',
    category: 'Efeitos sonoros',
    version: '1.0.0',
    license: 'CC0 / Domínio Público Estúdio',
    origin: 'Autal / Estúdio',
    createdAt: '2026-11-02T17:00:00.000Z',
    fileFormat: 'audio/wav',
    fileSizeBytes: 148000,
    preservesBugiIdentity: true,
    description: 'Pacote de efeitos sonoros sincronizados por frame para Remotion.',
    tags: ['sfx', 'audio', 'cartoon', 'atrito'],
  },
];

export const INITIAL_AI_MODELS: AIModelSlotConfig[] = [
  {
    category: 'pesquisa',
    label: 'Pesquisa Científica & Busca Fundamentada',
    selectedModel: 'gemini-3.8-flash',
    requireApprovalAboveUsd: 0.05,
    availableModels: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash (Recomendado com Google Search Grounding)',
        requiresPaidKey: false,
        estimatedCostPerCallUsd: 0.0015,
        description:
          'Rápido e preciso para pesquisa de física cotidiana com extração de URLs reais via Google Search.',
      },
      {
        id: 'gemini-4-argon',
        name: 'Gemini 4 Argon (Raciocínio Científico Avançado)',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.015,
        description:
          'Modelo avançado para validação profunda de equações e fenômenos físicos complexos.',
      },
    ],
  },
  {
    category: 'roteiro',
    label: 'Geração & Edição de Roteiros (Shorts PT-BR)',
    selectedModel: 'gemini-3.8-flash',
    requireApprovalAboveUsd: 0.05,
    availableModels: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash (Padrão Estúdio)',
        requiresPaidKey: false,
        estimatedCostPerCallUsd: 0.0012,
        description:
          'Excelente fluidez em português brasileiro, humor físico inteligente e estrutura JSON estrita.',
      },
      {
        id: 'gemini-4-argon',
        name: 'Gemini 4 Argon',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.014,
        description: 'Ideal para roteiros densos com múltiplas restrições dramáticas.',
      },
    ],
  },
  {
    category: 'revisao_cientifica',
    label: 'Revisão Científica & Checagem de Riscos',
    selectedModel: 'gemini-3.8-flash',
    requireApprovalAboveUsd: 0.05,
    availableModels: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash',
        requiresPaidKey: false,
        estimatedCostPerCallUsd: 0.001,
        description:
          'Audita leis de Newton, termodinâmica e óptica no roteiro antes de gravar a narração.',
      },
      {
        id: 'gemini-4-argon',
        name: 'Gemini 4 Argon',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.014,
        description: 'Revisão rigorosa de nível acadêmico.',
      },
    ],
  },
  {
    category: 'narracao',
    label: 'Narração por Voz (Text-to-Speech PT-BR)',
    selectedModel: 'gemini-3.8-flash-tts',
    requireApprovalAboveUsd: 0.05,
    availableModels: [
      {
        id: 'gemini-3.8-flash-tts',
        name: 'Gemini 3.8 Flash TTS (Expressivo / Direção de Voz)',
        requiresPaidKey: false,
        estimatedCostPerCallUsd: 0.0045,
        description:
          'Suporta direção de estilo, ritmo dinâmico de Shorts e alta expressividade em português brasileiro.',
      },
      {
        id: 'gemini-3.8-flash-lite-tts',
        name: 'Gemini 3.8 Flash Lite TTS (Baixa Latência)',
        requiresPaidKey: false,
        estimatedCostPerCallUsd: 0.0018,
        description: 'Versão ultrarrápida para prévias de locução e testes de tempo.',
      },
    ],
  },
  {
    category: 'imagens_cenarios',
    label: 'Imagens de Referência & Cenários 2D (Nano Banana)',
    selectedModel: 'gemini-3.1-flash-lite-image',
    requireApprovalAboveUsd: 0.02,
    availableModels: [
      {
        id: 'gemini-3.1-flash-lite-image',
        name: 'Nano Banana Lite (gemini-3.1-flash-lite-image)',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.018,
        description:
          'Gera referências visuais de cenários 2D (sem alterar o rig SVG fixo do Bugi).',
      },
      {
        id: 'gemini-nano-banana-2.1',
        name: 'Nano Banana 2.1 (gemini-nano-banana-2.1 — Alta Resolução)',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.035,
        description:
          'Geração de cenários de referência em 1K/2K/4K com busca visual fundamentada.',
      },
    ],
  },
  {
    category: 'video_opcional',
    label: 'Geração Opcional de Vídeo de Referência (Omni Flash)',
    selectedModel: 'gemini-omni-1.1-flash',
    requireApprovalAboveUsd: 0.05,
    availableModels: [
      {
        id: 'gemini-omni-1.1-flash',
        name: 'Gemini Omni 1.1 Flash (Interactions API)',
        requiresPaidKey: true,
        estimatedCostPerCallUsd: 0.12,
        description:
          'Opcional para referências de movimento (a animação final oficial do canal é sempre 2D no Remotion).',
      },
    ],
  },
];

export const INITIAL_COST_LOGS: AICallCostEntry[] = [
  {
    id: 'cost-seed-1',
    timestamp: '2026-11-02T16:20:00.000Z',
    category: 'pesquisa',
    model: 'gemini-3.8-flash',
    operationDescription: 'Pesquisa fundamentada: Coeficiente de atrito zero e 1ª Lei de Newton',
    episodeId: 'ep-atrito-5s',
    estimatedCostUsd: 0.0015,
    recordedCostUsd: 0.0014,
    tokensOrUnitsSummary: '1.420 tokens + Google Search Grounding',
    status: 'sucesso',
  },
  {
    id: 'cost-seed-2',
    timestamp: '2026-11-02T18:40:00.000Z',
    category: 'roteiro',
    model: 'gemini-3.8-flash',
    operationDescription: 'Geração estruturada do Roteiro v2 (6 segmentos, 3 ganchos)',
    episodeId: 'ep-atrito-5s',
    estimatedCostUsd: 0.0018,
    recordedCostUsd: 0.0017,
    tokensOrUnitsSummary: '1.890 tokens JSON Schema',
    status: 'sucesso',
  },
  {
    id: 'cost-seed-3',
    timestamp: '2026-11-02T19:05:00.000Z',
    category: 'narracao',
    model: 'gemini-3.8-flash-tts',
    operationDescription: 'Síntese de narração PT-BR (Voz Puck, 43.0s WAV 24kHz)',
    episodeId: 'ep-atrito-5s',
    estimatedCostUsd: 0.0045,
    recordedCostUsd: 0.0045,
    tokensOrUnitsSummary: '43.0s áudio WAV gerados',
    status: 'sucesso',
  },
];

export const INITIAL_ERROR_LOGS: StudioErrorLogEntry[] = [
  {
    id: 'err-seed-1',
    timestamp: '2026-11-01T15:12:00.000Z',
    module: 'Validador de Roteiro',
    episodeId: 'ep-atrito-5s',
    message:
      'Aviso de Qualidade Editorial: Proposta de gancho iniciada com "Você sabia que..." bloqueada automaticamente pelo filtro do estúdio.',
    technicalDetails:
      'Regra Seção 5: Nunca começar com "Você sabia que..." por padrão. Substituído por gancho de ação visual no 1º segundo.',
    resolved: true,
  },
];
