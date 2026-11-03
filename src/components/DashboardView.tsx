import React, { useState } from 'react';
import {
  AICallCostEntry,
  Episode,
  EpisodeStage,
  EPISODE_STAGES,
  ResearchIdea,
  StudioAsset,
  StudioErrorLogEntry,
} from '../types/studio';
import { BugiSceneStage } from './BugiCharacterSvg';
import {
  Plus,
  Play,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  History,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  episodes: Episode[];
  activeEpisodeId: string;
  researchIdeas: ResearchIdea[];
  assets: StudioAsset[];
  costLogs: AICallCostEntry[];
  errorLogs: StudioErrorLogEntry[];
  openCreateModalSignal?: number;
  onSelectEpisode: (episodeId: string) => void;
  onCreateEpisode: (title: string, hypothesis: string, scientificSummary: string) => void;
  onTransitionStage: (episodeId: string, targetStage: EpisodeStage, reason?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  episodes,
  activeEpisodeId,
  researchIdeas,
  costLogs,
  errorLogs,
  openCreateModalSignal = 0,
  onSelectEpisode,
  onCreateEpisode,
  onTransitionStage,
  onNavigateTab,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);

  React.useEffect(() => {
    if (openCreateModalSignal > 0) {
      setShowNewModal(true);
    }
  }, [openCreateModalSignal]);
  const [newTitle, setNewTitle] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Cálculo dos 9 indicadores exigidos na Seção 3 do Painel Principal
  const episodesInProduction = episodes.filter((e) => e.stage !== 'Concluido').length;
  const ideasAwaitingApproval = researchIdeas.filter(
    (i) => i.status === 'aguardando_aprovacao'
  ).length;
  const completedScripts = episodes.reduce(
    (acc, ep) =>
      acc + ep.scriptVersions.filter((sv) => sv.status === 'aprovado').length,
    0
  );
  const generatedNarrations = episodes.reduce(
    (acc, ep) => acc + ep.narrationTracks.length,
    0
  );
  const plannedScenes = episodes.reduce((acc, ep) => acc + ep.scenes.length, 0);
  const exportedProjects = episodes.filter((e) => e.exportCount > 0).length;
  const finalizedVideos = episodes.filter(
    (e) => e.hasRealRenderedMp4 && e.stage === 'Concluido'
  ).length;
  const totalEstimatedUsd = costLogs.reduce((acc, c) => acc + c.estimatedCostUsd, 0);
  const totalRecordedUsd = costLogs.reduce((acc, c) => acc + c.recordedCostUsd, 0);

  const activeEpisode =
    episodes.find((e) => e.id === activeEpisodeId) || episodes[0];

  const handleSubmitNewEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (newTitle.trim().length < 5) {
      setFormError('Informe um título no formato "E se...?" com pelo menos 5 caracteres.');
      return;
    }
    if (newHypothesis.trim().length < 10) {
      setFormError('Descreva a condição física alterada com pelo menos 10 caracteres.');
      return;
    }
    onCreateEpisode(newTitle.trim(), newHypothesis.trim(), newSummary.trim());
    setNewTitle('');
    setNewHypothesis('');
    setNewSummary('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho do Estúdio com Identidade e Slogan */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono text-[#39C8D5] tracking-wider uppercase">
            Estúdio de Produção Audiovisual 2D · YouTube Shorts · TikTok · Reels
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#FFF7E9]">
            Muda uma regra. Começa o caos.
          </h1>
          <p className="text-sm text-[#FFF7E9]/80 leading-relaxed">
            Fluxo completo de pesquisa fundamentada, roteiro estruturado, narração PT-BR,
            storyboard 2D com o personagem fixo <strong className="text-[#FFD166]">Bugi</strong> e
            exportação editável para renderização local via <strong className="text-[#39C8D5]">Codex & Remotion</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#ff5436] text-[#FFF7E9] font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Criar novo episódio
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('codex')}
            className="px-4 py-2.5 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileCode2 className="w-4 h-4" />
            Preparar para Codex
          </button>
        </div>
      </section>

      {/* Modal / Formulário de Criação de Novo Episódio */}
      {showNewModal && (
        <section
          aria-label="Criar novo episódio"
          className="bg-[#122638] border border-[#39C8D5] rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#1d3b54] pb-3">
            <h2 className="text-lg font-display font-bold text-[#FFF7E9]">
              Criar Novo Episódio do Bugi
            </h2>
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="text-xs text-[#FFF7E9]/70 hover:text-[#FFF7E9] px-3 py-1 rounded border border-[#1d3b54] cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmitNewEpisode} className="space-y-4">
            {formError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#FF6B50]/15 border border-[#FF6B50] text-xs text-[#FFF7E9]"
              >
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ep-title-input"
                  className="block text-xs font-medium text-[#FFF7E9]/90 mb-1.5"
                >
                  Pergunta Hipotética / Título do Episódio
                </label>
                <input
                  id="ep-title-input"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: E se a inércia demorasse 3 segundos para funcionar?"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-sm text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
                />
              </div>
              <div>
                <label
                  htmlFor="ep-hypothesis-input"
                  className="block text-xs font-medium text-[#FFF7E9]/90 mb-1.5"
                >
                  Regra ou Condição Física Alterada
                </label>
                <input
                  id="ep-hypothesis-input"
                  type="text"
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  placeholder="Ex: A resposta inercial (F = m·a) sofre um atraso temporal de 3s"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-sm text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="ep-summary-input"
                className="block text-xs font-medium text-[#FFF7E9]/90 mb-1.5"
              >
                Resumo Científico & Situação Cotidiana do Bugi
              </label>
              <textarea
                id="ep-summary-input"
                rows={2}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Descreva onde o Bugi está e qual é a consequência física surpreendente..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-sm text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-[#FF6B50] hover:bg-[#ff5436] text-[#FFF7E9] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Salvar e Iniciar Fluxo
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grade de Métricas do Estúdio (9 Indicadores Obrigatórios da Seção 3) */}
      <section aria-label="Indicadores de produção do estúdio">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Episódios em produção</div>
            <div className="text-2xl font-mono font-bold text-[#39C8D5] mt-1 tabular-nums">
              {episodesInProduction}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Ativos no pipeline
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Ideias aguardando aprovação</div>
            <div className="text-2xl font-mono font-bold text-[#FFD166] mt-1 tabular-nums">
              {ideasAwaitingApproval}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Pesquisa fundamentada
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Roteiros concluídos</div>
            <div className="text-2xl font-mono font-bold text-[#FFF7E9] mt-1 tabular-nums">
              {completedScripts}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Aprovados (35–55s)
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Narrações geradas</div>
            <div className="text-2xl font-mono font-bold text-[#39C8D5] mt-1 tabular-nums">
              {generatedNarrations}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Áudio PT-BR sincronizado
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Cenas planejadas</div>
            <div className="text-2xl font-mono font-bold text-[#FFF7E9] mt-1 tabular-nums">
              {plannedScenes}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Storyboard 2D do Bugi
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Projetos exportados</div>
            <div className="text-2xl font-mono font-bold text-[#39C8D5] mt-1 tabular-nums">
              {exportedProjects}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Prontos para Codex
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Vídeos finalizados (MP4 real)</div>
            <div className="text-2xl font-mono font-bold text-[#FFF7E9] mt-1 tabular-nums">
              {finalizedVideos}
            </div>
            <div className="text-[11px] text-[#FFD166] mt-1">
              Apenas renders MP4 verificados
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4">
            <div className="text-xs text-[#FFF7E9]/70">Histórico de erros</div>
            <div className="text-2xl font-mono font-bold text-[#FF6B50] mt-1 tabular-nums">
              {errorLogs.length}
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Eventos auditados
            </div>
          </div>

          <div className="bg-[#122638] border border-[#1d3b54] rounded-lg p-4 col-span-2">
            <div className="text-xs text-[#FFF7E9]/70">
              Custos de IA (Estimado vs Registrado)
            </div>
            <div className="flex items-baseline gap-4 mt-1 font-mono tabular-nums">
              <span className="text-xl font-bold text-[#FFD166]">
                US$ {totalRecordedUsd.toFixed(4)}
              </span>
              <span className="text-xs text-[#FFF7E9]/70">
                Estimado: US$ {totalEstimatedUsd.toFixed(4)} · {costLogs.length} chamadas
              </span>
            </div>
            <div className="text-[11px] text-[#FFF7E9]/60 mt-1">
              Chave GEMINI_API_KEY protegida exclusivamente no servidor
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Episódios com Miniaturas 2D do Bugi e Pipeline de 10 Etapas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-[#FFF7E9]">
              Episódios no Estúdio
            </h2>
            <p className="text-xs text-[#FFF7E9]/70">
              Selecione um episódio para editar roteiro, narração, storyboard ou exportar para Codex e Remotion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {episodes.map((ep) => {
            const isSelected = ep.id === activeEpisode?.id;
            const stageIndex = EPISODE_STAGES.indexOf(ep.stage);
            const progressPercent = Math.round(
              ((stageIndex + 1) / EPISODE_STAGES.length) * 100
            );
            const previewScene = ep.scenes[1] || ep.scenes[0];
            const totalDuration = ep.scenes.reduce(
              (acc, s) =>
                acc +
                (s.timeCalculationMode === 'calculado_audio_real' &&
                s.definitiveDurationSec
                  ? s.definitiveDurationSec
                  : s.approxDurationSec),
              0
            );

            return (
              <article
                key={ep.id}
                className={`bg-[#122638] rounded-xl p-5 border transition-colors ${
                  isSelected
                    ? 'border-[#39C8D5]'
                    : 'border-[#1d3b54] hover:border-[#39C8D5]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Miniatura Vetorial 2D Canônica do Bugi */}
                  <div className="w-full sm:w-36 h-52 rounded-lg overflow-hidden border border-[#1d3b54] shrink-0 bg-[#08121b]">
                    <BugiSceneStage
                      pose={previewScene?.bugiPose || 'escorregando'}
                      expression={previewScene?.bugiExpression || 'surpreso'}
                      scenario={previewScene?.scenarioPreset || 'calcada_urbana'}
                      aspectRatio="9:16"
                      timerSeconds={5}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Informações e Controles do Episódio */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Metadados sem pílulas estáticas (disciplina tipográfica limpa) */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#39C8D5]">
                        <span>Etapa: {ep.stage}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{totalDuration.toFixed(1)}s</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{ep.scenes.length} cenas</span>
                      </div>

                      <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
                        {ep.title}
                      </h3>

                      <p className="text-xs text-[#FFF7E9]/80 line-clamp-2">
                        {ep.hypothesis}
                      </p>

                      {/* Aviso transparente sobre status de render MP4 real */}
                      <div className="pt-1 text-xs text-[#FFD166] flex items-center gap-1.5">
                        {ep.hasRealRenderedMp4 ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#39C8D5] shrink-0" />
                            <span>MP4 H.264 renderizado e verificado</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-[#FFD166] shrink-0" />
                            <span>
                              Projeto editável · Sem MP4 renderizado (Aguardando Codex/Remotion)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Barra de Progresso das 10 Etapas */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#FFF7E9]/75">
                        <span>
                          Progresso do Pipeline ({stageIndex + 1}/{EPISODE_STAGES.length})
                        </span>
                        <span className="tabular-nums">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#08121b] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#39C8D5] transition-all duration-200"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Botões de Ação do Episódio */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEpisode(ep.id);
                          onNavigateTab('roteiro');
                        }}
                        className="px-3 py-1.5 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-semibold text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Editar Roteiro
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEpisode(ep.id);
                          onNavigateTab('storyboard');
                        }}
                        className="px-3 py-1.5 bg-[#08121b] hover:bg-[#19344b] text-[#FFF7E9] border border-[#1d3b54] font-medium text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 text-[#39C8D5]" />
                        Storyboard 2D
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEpisode(ep.id);
                          onNavigateTab('narracao');
                        }}
                        className="px-3 py-1.5 bg-[#08121b] hover:bg-[#19344b] text-[#FFF7E9] border border-[#1d3b54] font-medium text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Narração
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEpisode(ep.id);
                          onNavigateTab('codex');
                        }}
                        className="px-3 py-1.5 bg-[#08121b] hover:bg-[#19344b] text-[#FFD166] border border-[#FFD166]/40 font-medium text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Exportar Codex
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Controle de Fluxo de Etapas e Histórico do Episódio Selecionado (Seção 11) */}
      {activeEpisode && (
        <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-[#1d3b54] pb-4">
            <div>
              <div className="text-xs font-mono text-[#39C8D5]">
                CONTROLE DE PIPELINE (SEÇÃO 11) · EPISÓDIO ATIVO
              </div>
              <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
                {activeEpisode.title}
              </h3>
              <p className="text-xs text-[#FFF7E9]/70">
                Você pode voltar ou avançar etapas livremente sem apagar roteiros, narrações ou cenas aprovadas.
              </p>
            </div>
            <div className="text-xs font-mono text-[#FFD166]">
              Etapa Atual: <strong>{activeEpisode.stage}</strong>
            </div>
          </div>

          {/* Seletor das 10 Etapas */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {EPISODE_STAGES.map((stage, idx) => {
              const isCurrent = activeEpisode.stage === stage;
              const isCompleted = EPISODE_STAGES.indexOf(activeEpisode.stage) > idx;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() =>
                    onTransitionStage(
                      activeEpisode.id,
                      stage,
                      `Mudança manual de etapa para ${stage}`
                    )
                  }
                  className={`px-2.5 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#39C8D5] text-[#08121b] border-[#39C8D5] font-bold'
                      : isCompleted
                      ? 'bg-[#08121b] text-[#39C8D5] border-[#39C8D5]/40 hover:border-[#39C8D5]'
                      : 'bg-[#08121b]/60 text-[#FFF7E9]/70 border-[#1d3b54] hover:border-[#FFF7E9]/40'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-75">0{idx + 1}</div>
                  <div className="text-xs truncate">{stage}</div>
                </button>
              );
            })}
          </div>

          {/* Histórico de Alterações do Episódio */}
          <div className="pt-2 space-y-2">
            <div className="text-xs font-semibold text-[#FFF7E9] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#39C8D5]" />
              Histórico de Alterações Preserva Arquivos Aprovados ({activeEpisode.history.length} registros)
            </div>
            <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg divide-y divide-[#1d3b54] max-h-44 overflow-y-auto">
              {activeEpisode.history.map((h) => (
                <div
                  key={h.id}
                  className="px-3.5 py-2 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <span className="text-[#FFF7E9]/90">{h.actionSummary}</span>
                  <span className="font-mono text-[11px] text-[#39C8D5] whitespace-nowrap tabular-nums">
                    {h.fromStage} → {h.toStage} ·{' '}
                    {new Date(h.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
