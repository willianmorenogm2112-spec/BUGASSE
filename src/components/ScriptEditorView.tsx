import React, { useState } from 'react';
import {
  Episode,
  ScriptHookProposal,
  ScriptSegment,
  ScriptVersion,
} from '../types/studio';
import { validateHookText } from '../utils/studioLogic';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

interface ScriptEditorViewProps {
  episode: Episode;
  selectedModel: string;
  isGeneratingScript: boolean;
  regeneratingSegmentId: string | null;
  onUpdateEpisode: (updated: Episode) => void;
  onGenerateFullAIScript: () => Promise<void>;
  onRegenerateExcerpt: (segmentId: string, instruction: string) => Promise<void>;
  onSyncStoryboardFromScript: (script: ScriptVersion) => void;
}

export const ScriptEditorView: React.FC<ScriptEditorViewProps> = ({
  episode,
  selectedModel,
  isGeneratingScript,
  regeneratingSegmentId,
  onUpdateEpisode,
  onGenerateFullAIScript,
  onRegenerateExcerpt,
  onSyncStoryboardFromScript,
}) => {
  const [excerptInstructions, setExcerptInstructions] = useState<
    Record<string, string>
  >({});
  const [hookError, setHookError] = useState<string | null>(null);
  const [newAltTitle, setNewAltTitle] = useState('');

  const activeScript: ScriptVersion =
    episode.scriptVersions.find((v) => v.id === episode.activeScriptVersionId) ||
    episode.scriptVersions[0];

  const totalEstimatedDuration = activeScript.segments.reduce(
    (acc, s) => acc + Number(s.estimatedDurationSec || 0),
    0
  );

  const isDurationWithinTarget =
    totalEstimatedDuration >= 35 && totalEstimatedDuration <= 55;

  const updateActiveScript = (updater: (current: ScriptVersion) => ScriptVersion) => {
    const updatedScript = updater(activeScript);
    const updatedVersions = episode.scriptVersions.map((v) =>
      v.id === activeScript.id ? updatedScript : v
    );
    onUpdateEpisode({
      ...episode,
      scriptVersions: updatedVersions,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateNewVersion = () => {
    const nextVersionNumber =
      Math.max(0, ...episode.scriptVersions.map((v) => v.versionNumber)) + 1;
    const newVersionId = `sv-${episode.id}-v${nextVersionNumber}-${Date.now()
      .toString(36)
      .slice(-3)}`;

    const clonedVersion: ScriptVersion = {
      ...activeScript,
      id: newVersionId,
      versionNumber: nextVersionNumber,
      createdAt: new Date().toISOString(),
      authorNote: `Derivado da v${activeScript.versionNumber} para testes de ritmo`,
      status: 'rascunho',
      alternativeTitles: [...activeScript.alternativeTitles],
      hookProposals: activeScript.hookProposals.map((h) => ({ ...h })),
      segments: activeScript.segments.map((s) => ({ ...s })),
      scientificNotes: [...activeScript.scientificNotes],
    };

    onUpdateEpisode({
      ...episode,
      scriptVersions: [...episode.scriptVersions, clonedVersion],
      activeScriptVersionId: newVersionId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleHookTextChange = (hookId: string, newText: string) => {
    const validation = validateHookText(newText);
    if (!validation.valid && newText.toLowerCase().startsWith('voc')) {
      setHookError(validation.reason || 'Gancho inválido.');
    } else {
      setHookError(null);
    }

    updateActiveScript((curr) => ({
      ...curr,
      hookProposals: curr.hookProposals.map((h) =>
        h.id === hookId ? { ...h, hookText: newText } : h
      ),
    }));
  };

  const handleSelectHook = (hookId: string) => {
    updateActiveScript((curr) => ({
      ...curr,
      hookProposals: curr.hookProposals.map((h) => ({
        ...h,
        selected: h.id === hookId,
      })),
    }));
  };

  const handleUpdateSegment = (
    segmentId: string,
    field: keyof ScriptSegment,
    value: string | number
  ) => {
    updateActiveScript((curr) => ({
      ...curr,
      segments: curr.segments.map((s) =>
        s.id === segmentId ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleAddSegment = () => {
    const nextOrder = activeScript.segments.length + 1;
    const newSeg: ScriptSegment = {
      id: `seg-${Date.now()}`,
      order: nextOrder,
      sentenceText:
        'Novo bloco de narração explicando a consequência física no Bugi.',
      speakingDirection: 'Ritmo natural brasileiro, dicção clara.',
      visualPlanning:
        'Bugi reagindo com expressão surpresa enquanto a física falha ao redor.',
      estimatedDurationSec: 7,
      scientificNote: 'Nota física complementar.',
    };
    updateActiveScript((curr) => ({
      ...curr,
      segments: [...curr.segments, newSeg],
    }));
  };

  const handleRemoveSegment = (segmentId: string) => {
    if (activeScript.segments.length <= 1) return;
    updateActiveScript((curr) => ({
      ...curr,
      segments: curr.segments
        .filter((s) => s.id !== segmentId)
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));
  };

  const handleAddAltTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAltTitle.trim()) return;
    updateActiveScript((curr) => ({
      ...curr,
      alternativeTitles: [...curr.alternativeTitles, newAltTitle.trim()],
    }));
    setNewAltTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Barra de Topo do Editor de Roteiros */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Módulo 5 · Gerador e Editor de Roteiros com Versões (35s a 55s)
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              {episode.title}
            </h2>
            <p className="text-xs text-[#FFF7E9]/75">
              Narração brasileira natural · Humor inteligente · Frases curtas · Nunca começa
              com &ldquo;Você sabia que...&rdquo; por padrão · O Bugi vive as cenas sem falar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onGenerateFullAIScript}
              disabled={isGeneratingScript}
              className="px-4 py-2 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingScript
                ? 'Gerando com Gemini...'
                : `Gerar Nova Versão com IA (${selectedModel})`}
            </button>

            <button
              type="button"
              onClick={handleCreateNewVersion}
              className="px-3.5 py-2 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Duplicar Versão (v{episode.scriptVersions.length + 1})
            </button>

            <button
              type="button"
              onClick={() => onSyncStoryboardFromScript(activeScript)}
              className="px-3.5 py-2 bg-[#08121b] hover:bg-[#19344b] text-[#FFD166] border border-[#FFD166]/40 font-medium text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Enviar Roteiro para Storyboard
            </button>
          </div>
        </div>

        {/* Seletor de Versões e Status de Aprovação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1d3b54]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#FFF7E9]/70">Versões:</span>
            {episode.scriptVersions.map((ver) => {
              const isCurrent = ver.id === activeScript.id;
              return (
                <button
                  key={ver.id}
                  type="button"
                  onClick={() =>
                    onUpdateEpisode({ ...episode, activeScriptVersionId: ver.id })
                  }
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#39C8D5] text-[#08121b] font-bold'
                      : 'bg-[#08121b] text-[#FFF7E9]/80 border border-[#1d3b54] hover:border-[#39C8D5]'
                  }`}
                >
                  v{ver.versionNumber} · {ver.status.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-mono tabular-nums">
              Duração Estimada:{' '}
              <strong
                className={
                  isDurationWithinTarget ? 'text-[#39C8D5]' : 'text-[#FFD166]'
                }
              >
                {totalEstimatedDuration.toFixed(1)}s
              </strong>{' '}
              <span className="text-[#FFF7E9]/60">(Meta Shorts: 35s–55s)</span>
            </div>

            <button
              type="button"
              onClick={() =>
                updateActiveScript((curr) => ({ ...curr, status: 'aprovado' }))
              }
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                activeScript.status === 'aprovado'
                  ? 'bg-[#39C8D5] text-[#08121b]'
                  : 'bg-[#08121b] text-[#39C8D5] border border-[#39C8D5]/40 hover:bg-[#19344b]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aprovar Roteiro
            </button>

            <button
              type="button"
              onClick={() =>
                updateActiveScript((curr) => ({ ...curr, status: 'rejeitado' }))
              }
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                activeScript.status === 'rejeitado'
                  ? 'bg-[#FF6B50] text-[#FFF7E9]'
                  : 'bg-[#08121b] text-[#FF6B50] border border-[#FF6B50]/40 hover:bg-[#19344b]'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Rejeitar
            </button>
          </div>
        </div>
      </section>

      {/* 1. Títulos Alternativos & 2. Três Propostas de Gancho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Títulos Alternativos */}
        <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-4">
          <h3 className="text-base font-display font-bold text-[#FFF7E9]">
            1. Títulos Alternativos do Episódio
          </h3>
          <div className="space-y-2">
            {activeScript.alternativeTitles.map((t, idx) => {
              const isSelected = activeScript.selectedTitle === t;
              return (
                <div
                  key={`${t}-${idx}`}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#08121b] border-[#39C8D5]'
                      : 'bg-[#08121b]/60 border-[#1d3b54]'
                  }`}
                >
                  <span className="text-xs text-[#FFF7E9] font-medium">{t}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateActiveScript((curr) => ({ ...curr, selectedTitle: t }))
                    }
                    className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#39C8D5] text-[#08121b] font-bold'
                        : 'bg-[#122638] text-[#FFF7E9]/75 hover:text-[#FFF7E9]'
                    }`}
                  >
                    {isSelected ? 'Principal' : 'Usar este'}
                  </button>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleAddAltTitle} className="flex gap-2">
            <input
              type="text"
              value={newAltTitle}
              onChange={(e) => setNewAltTitle(e.target.value)}
              placeholder="Adicionar novo título alternativo..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#1d3b54] rounded-lg text-xs font-medium cursor-pointer"
            >
              Adicionar
            </button>
          </form>
        </section>

        {/* Três Propostas de Gancho */}
        <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-[#FFF7E9]">
              2. Três Propostas de Gancho (1º Segundo)
            </h3>
            <span className="text-[11px] font-mono text-[#FFD166]">
              Bloqueio ativo contra &ldquo;Você sabia que...&rdquo;
            </span>
          </div>

          {hookError && (
            <div
              role="alert"
              className="p-2.5 rounded-lg bg-[#FF6B50]/20 border border-[#FF6B50] text-xs text-[#FFF7E9] flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-[#FF6B50] shrink-0" />
              <span>{hookError}</span>
            </div>
          )}

          <div className="space-y-3">
            {activeScript.hookProposals.map((hook: ScriptHookProposal) => (
              <div
                key={hook.id}
                className={`p-3.5 rounded-lg border space-y-2 ${
                  hook.selected
                    ? 'bg-[#08121b] border-[#FFD166]'
                    : 'bg-[#08121b]/60 border-[#1d3b54]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-[#FFD166]">
                    {hook.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectHook(hook.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                      hook.selected
                        ? 'bg-[#FFD166] text-[#08121b] font-bold'
                        : 'bg-[#122638] text-[#FFF7E9]/70 hover:text-[#FFF7E9]'
                    }`}
                  >
                    {hook.selected ? 'Gancho Ativo' : 'Selecionar Gancho'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  aria-label={`Texto do ${hook.label}`}
                  value={hook.hookText}
                  onChange={(e) => handleHookTextChange(hook.id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
                />
                <div className="text-[11px] text-[#39C8D5]">
                  <strong>Ação Visual no 1ºs:</strong> {hook.firstSecondVisual}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3, 4 e 5: Roteiro de Narração, Direção de Interpretação e Planejamento Visual por Frase */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d3b54] pb-3">
          <div>
            <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
              3, 4 & 5. Blocos de Narração, Direção de Interpretação e Planejamento Visual
            </h3>
            <p className="text-xs text-[#FFF7E9]/70">
              Edite qualquer frase ou clique em &ldquo;Regenerar Apenas Este Trecho&rdquo; para refinar com IA sem alterar o restante do roteiro.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSegment}
            className="px-3.5 py-1.5 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Frase / Bloco
          </button>
        </div>

        <div className="space-y-4">
          {activeScript.segments.map((seg, index) => {
            const isRegeneratingThis = regeneratingSegmentId === seg.id;
            return (
              <div
                key={seg.id}
                className="bg-[#08121b] border border-[#1d3b54] rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1d3b54] pb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#39C8D5]">
                    <span>FRASES / BLOCO 0{index + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>ID: {seg.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`dur-${seg.id}`}
                      className="text-xs font-mono text-[#FFF7E9]/75"
                    >
                      Tempo estimado (s):
                    </label>
                    <input
                      id={`dur-${seg.id}`}
                      type="number"
                      step="0.5"
                      min="1"
                      max="30"
                      value={seg.estimatedDurationSec}
                      onChange={(e) =>
                        handleUpdateSegment(
                          seg.id,
                          'estimatedDurationSec',
                          Number(e.target.value)
                        )
                      }
                      className="w-16 px-2 py-1 rounded bg-[#122638] border border-[#1d3b54] text-xs font-mono text-[#FFD166] text-right tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSegment(seg.id)}
                      aria-label={`Remover bloco ${index + 1}`}
                      className="p-1.5 text-[#FFF7E9]/60 hover:text-[#FF6B50] rounded border border-[#1d3b54] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Texto de Narração */}
                  <div className="space-y-1">
                    <label
                      htmlFor={`txt-${seg.id}`}
                      className="block text-xs font-semibold text-[#FFF7E9]"
                    >
                      Roteiro de Narração (PT-BR)
                    </label>
                    <textarea
                      id={`txt-${seg.id}`}
                      rows={3}
                      value={seg.sentenceText}
                      onChange={(e) =>
                        handleUpdateSegment(seg.id, 'sentenceText', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9] leading-relaxed focus:outline-none focus:border-[#39C8D5]"
                    />
                  </div>

                  {/* Direção de Interpretação */}
                  <div className="space-y-1">
                    <label
                      htmlFor={`dir-${seg.id}`}
                      className="block text-xs font-semibold text-[#FFD166]"
                    >
                      Direção de Interpretação (Locução)
                    </label>
                    <textarea
                      id={`dir-${seg.id}`}
                      rows={3}
                      value={seg.speakingDirection}
                      onChange={(e) =>
                        handleUpdateSegment(
                          seg.id,
                          'speakingDirection',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]/90 leading-relaxed focus:outline-none focus:border-[#39C8D5]"
                    />
                  </div>

                  {/* Planejamento Visual por Frase */}
                  <div className="space-y-1">
                    <label
                      htmlFor={`vis-${seg.id}`}
                      className="block text-xs font-semibold text-[#39C8D5]"
                    >
                      Planejamento Visual (Ação do Bugi)
                    </label>
                    <textarea
                      id={`vis-${seg.id}`}
                      rows={3}
                      value={seg.visualPlanning}
                      onChange={(e) =>
                        handleUpdateSegment(seg.id, 'visualPlanning', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]/90 leading-relaxed focus:outline-none focus:border-[#39C8D5]"
                    />
                  </div>
                </div>

                {/* Barra de Regeneração de Trecho Específico com IA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-[#1d3b54]/70">
                  <input
                    type="text"
                    aria-label={`Instrução para regenerar bloco ${index + 1}`}
                    value={excerptInstructions[seg.id] || ''}
                    onChange={(e) =>
                      setExcerptInstructions((prev) => ({
                        ...prev,
                        [seg.id]: e.target.value,
                      }))
                    }
                    placeholder="Instrução opcional para IA (ex: deixar mais engraçado, simplificar explicação da inércia)..."
                    className="flex-1 px-3 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
                  />
                  <button
                    type="button"
                    disabled={isRegeneratingThis}
                    onClick={() =>
                      onRegenerateExcerpt(
                        seg.id,
                        excerptInstructions[seg.id] ||
                          'Deixar mais dinâmico e visual para Shorts mantendo rigor científico'
                      )
                    }
                    className="px-3 py-1.5 bg-[#122638] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 rounded text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isRegeneratingThis ? 'animate-spin' : ''
                      }`}
                    />
                    {isRegeneratingThis
                      ? 'Regenerando trecho...'
                      : 'Regenerar Apenas Este Trecho'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Notas Científicas e Fontes do Roteiro */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-3">
        <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#39C8D5]" />
          6. Notas Científicas & Fontes Verificadas do Roteiro
        </h3>
        <div className="space-y-2">
          {activeScript.scientificNotes.map((note, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]/90 font-mono"
            >
              {note}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
