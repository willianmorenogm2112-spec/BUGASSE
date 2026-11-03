import React, { useState } from 'react';
import { Episode, NarrationTrack } from '../types/studio';
import {
  calibrateScenesWithRealAudio,
  estimateAICallCost,
} from '../utils/studioLogic';
import {
  Mic,
  Download,
  Upload,
  Sparkles,
  Clock,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface NarrationViewProps {
  episode: Episode;
  defaultModel: string;
  isGeneratingAudio: boolean;
  onUpdateEpisode: (updated: Episode) => void;
  onGenerateBackendTTS: (params: {
    model: string;
    voice: NarrationTrack['voice'];
    interpretationStyle: string;
    pace: NarrationTrack['pace'];
    expressiveness: NarrationTrack['expressiveness'];
    fullText: string;
  }) => Promise<void>;
  onUploadManualNarration: (file: File) => Promise<void>;
}

export const NarrationView: React.FC<NarrationViewProps> = ({
  episode,
  defaultModel,
  isGeneratingAudio,
  onUpdateEpisode,
  onGenerateBackendTTS,
  onUploadManualNarration,
}) => {
  const [model, setModel] = useState(defaultModel || 'gemini-3.8-flash-tts');
  const [voice, setVoice] = useState<NarrationTrack['voice']>('Puck');
  const [interpretationStyle, setInterpretationStyle] = useState(
    'Narrador brasileiro natural, curioso, bem-humorado e envolvente'
  );
  const [pace, setPace] = useState<NarrationTrack['pace']>('Dinâmico (Shorts)');
  const [expressiveness, setExpressiveness] =
    useState<NarrationTrack['expressiveness']>('Alta');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const activeScript =
    episode.scriptVersions.find((v) => v.id === episode.activeScriptVersionId) ||
    episode.scriptVersions[0];

  const fullNarrationText = activeScript.segments
    .map((s) => s.sentenceText)
    .join(' ');

  const activeNarration: NarrationTrack | undefined =
    episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
    episode.narrationTracks[0];

  const costEstimate = estimateAICallCost(
    'narracao',
    model,
    fullNarrationText.length
  );

  const handleManualFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus('Processando arquivo de narração e calculando duração real...');
    try {
      await onUploadManualNarration(file);
      setUploadStatus(
        `Narração manual "${file.name}" carregada e tempos do storyboard recalibrados!`
      );
    } catch (err) {
      setUploadStatus(
        `Erro ao enviar áudio: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Configuração de Voz PT-BR */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#1d3b54] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Módulo 8 · Estúdio de Narração no Backend & Marcações Temporais
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              Locução PT-BR — {episode.title}
            </h2>
            <p className="text-xs text-[#FFF7E9]/75">
              O Bugi não fala: a narração conduz o experimento enquanto o Bugi vive o caos.
              Gere áudio com Gemini TTS no servidor ou envie uma gravação manual.
            </p>
          </div>

          <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg px-4 py-2.5 text-xs font-mono shrink-0">
            <div className="text-[#FFF7E9]/70">Custo Estimado da Síntese TTS:</div>
            <div className="text-sm font-bold text-[#FFD166] tabular-nums">
              US$ {costEstimate.estimatedCostUsd.toFixed(4)} · Idioma fixo: pt-BR
            </div>
          </div>
        </div>

        {/* Painel de Configuração de Parâmetros de Narração */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label
              htmlFor="tts-model-select"
              className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
            >
              Modelo de Áudio (TTS)
            </label>
            <select
              id="tts-model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="gemini-3.8-flash-tts">
                Gemini 3.8 Flash TTS (Expressivo)
              </option>
              <option value="gemini-3.8-flash-lite-tts">
                Gemini 3.8 Flash Lite TTS (Rápido)
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tts-voice-select"
              className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
            >
              Voz Predefinida
            </label>
            <select
              id="tts-voice-select"
              value={voice}
              onChange={(e) =>
                setVoice(e.target.value as NarrationTrack['voice'])
              }
              className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="Puck">Puck (Jovem, Curioso e Ágil)</option>
              <option value="Kore">Kore (Clara, Científica e Firme)</option>
              <option value="Charon">Charon (Grave, Cinematográfico)</option>
              <option value="Fenrir">Fenrir (Energético, Impacto)</option>
              <option value="Zephyr">Zephyr (Leve, Conversacional)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tts-pace-select"
              className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
            >
              Ritmo da Locução
            </label>
            <select
              id="tts-pace-select"
              value={pace}
              onChange={(e) => setPace(e.target.value as NarrationTrack['pace'])}
              className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="Dinâmico (Shorts)">Dinâmico (Shorts 35–55s)</option>
              <option value="Natural">Natural</option>
              <option value="Acelerado">Acelerado</option>
              <option value="Lento">Lento / Didático</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tts-exp-select"
              className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
            >
              Expressividade
            </label>
            <select
              id="tts-exp-select"
              value={expressiveness}
              onChange={(e) =>
                setExpressiveness(
                  e.target.value as NarrationTrack['expressiveness']
                )
              }
              className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
            >
              <option value="Alta">Alta (Humor inteligente)</option>
              <option value="Cinematográfica">Cinematográfica</option>
              <option value="Moderada">Moderada</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tts-lang-input"
              className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
            >
              Idioma
            </label>
            <input
              id="tts-lang-input"
              type="text"
              readOnly
              value="Português Brasileiro (pt-BR)"
              className="w-full px-3 py-2 rounded-lg bg-[#08121b]/60 border border-[#1d3b54] text-xs text-[#39C8D5] font-mono"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="tts-style-input"
            className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
          >
            Estilo da Interpretação (Prompt de Direção Vocal)
          </label>
          <input
            id="tts-style-input"
            type="text"
            value={interpretationStyle}
            onChange={(e) => setInterpretationStyle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
          />
        </div>

        {/* Texto do Roteiro Aprovado a ser Narrado */}
        <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#39C8D5]">
            <span>
              ROTEIRO BASE (v{activeScript.versionNumber} · {activeScript.status.toUpperCase()})
            </span>
            <span>{fullNarrationText.length} caracteres</span>
          </div>
          <p className="text-xs text-[#FFF7E9]/90 leading-relaxed">
            {fullNarrationText}
          </p>
        </div>

        {/* Ações: Gerar com Gemini TTS ou Substituir por Upload Manual */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            disabled={isGeneratingAudio}
            onClick={() =>
              onGenerateBackendTTS({
                model,
                voice,
                interpretationStyle,
                pace,
                expressiveness,
                fullText: fullNarrationText,
              })
            }
            className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingAudio
              ? 'Gerando Áudio WAV no Servidor...'
              : `Gerar Narração com ${model} (Custo est. US$ ${costEstimate.estimatedCostUsd.toFixed(4)})`}
          </button>

          <label className="px-4 py-2.5 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Substituir por Narração Manual (.wav / .mp3)</span>
            <input
              type="file"
              accept="audio/wav,audio/mpeg,audio/mp3,audio/ogg"
              onChange={handleManualFileChange}
              className="hidden"
            />
          </label>
        </div>

        {uploadStatus && (
          <div className="p-3 rounded-lg bg-[#39C8D5]/15 border border-[#39C8D5] text-xs text-[#FFF7E9]">
            {uploadStatus}
          </div>
        )}
      </section>

      {/* Player de Áudio, Download e Marcações Temporais (Seção 8) */}
      {activeNarration && (
        <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#39C8D5]">
                <span>FAIXA DE NARRAÇÃO ATIVA</span>
                <span aria-hidden="true">·</span>
                <span>Voz: {activeNarration.voice}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-[#FFD166]">
                  Duração Real Registrada: {activeNarration.durationSec.toFixed(2)}s
                </span>
              </div>
              <h3 className="text-lg font-display font-bold text-[#FFF7E9] flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#39C8D5]" />
                Player & Sincronização de Marcações Temporais
              </h3>
            </div>

            {activeNarration.audioDataUrl && (
              <a
                href={activeNarration.audioDataUrl}
                download={
                  activeNarration.fileName || `narracao-${episode.id}.wav`
                }
                className="px-4 py-2 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Baixar Áudio (.wav)
              </a>
            )}
          </div>

          {/* Player HTML5 Nativo */}
          <div className="bg-[#08121b] border border-[#1d3b54] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <audio
              controls
              src={activeNarration.audioDataUrl}
              className="w-full h-10"
              aria-label="Player de narração do episódio"
            />
            <div className="text-xs font-mono text-[#FFD166] whitespace-nowrap shrink-0">
              {activeNarration.alignmentType === 'word_aligned'
                ? 'Alinhamento exato por palavra'
                : 'Tempos estimados proporcionalmente a partir da duração real do áudio'}
            </div>
          </div>

          {/* Tabela de Marcações Temporais por Bloco/Cena */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-display font-bold text-[#FFF7E9]">
                Marcações Temporais Sincronizadas ({activeNarration.temporalMarkers.length} blocos)
              </h4>
              <button
                type="button"
                onClick={() => {
                  const calibrated = calibrateScenesWithRealAudio(
                    episode.scenes,
                    activeNarration.durationSec
                  );
                  onUpdateEpisode({
                    ...episode,
                    scenes: calibrated.scenes,
                    updatedAt: new Date().toISOString(),
                  });
                }}
                className="text-xs font-mono text-[#39C8D5] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                Aplicar tempos definitivos ao Storyboard
              </button>
            </div>

            <div className="overflow-x-auto bg-[#08121b] border border-[#1d3b54] rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1d3b54] text-[#39C8D5] font-mono">
                    <th className="py-2.5 px-3">Bloco / Cena</th>
                    <th className="py-2.5 px-3 text-right">Início (s)</th>
                    <th className="py-2.5 px-3 text-right">Fim (s)</th>
                    <th className="py-2.5 px-3">Trecho Sincronizado</th>
                    <th className="py-2.5 px-3">Origem do Tempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d3b54]">
                  {activeNarration.temporalMarkers.map((tm) => (
                    <tr key={tm.id} className="hover:bg-[#122638]/50">
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#FFF7E9]">
                        {tm.label}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-[#FFD166] tabular-nums">
                        {tm.startSec.toFixed(2)}s
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-[#FFD166] tabular-nums">
                        {tm.endSec.toFixed(2)}s
                      </td>
                      <td className="py-2.5 px-3 text-[#FFF7E9]/90">{tm.text}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#39C8D5]">
                        {tm.alignmentSource === 'word_aligned'
                          ? 'Alinhado por palavra'
                          : 'Estimado pela duração real'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
