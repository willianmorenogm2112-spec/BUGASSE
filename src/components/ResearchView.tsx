import React, { useState } from 'react';
import { ResearchIdea } from '../types/studio';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

interface ResearchViewProps {
  ideas: ResearchIdea[];
  selectedModel: string;
  onRunGroundedResearch: (topicQuery: string) => Promise<void>;
  onApproveIdeaToEpisode: (idea: ResearchIdea) => void;
  isResearching: boolean;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  ideas,
  selectedModel,
  onRunGroundedResearch,
  onApproveIdeaToEpisode,
  isResearching,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const quickTopics = [
    'Tensão superficial da água multiplicada por 100',
    'Gravidade invertida por 3 segundos dentro de casa',
    'Velocidade da luz reduzida para 50 km/h na rua',
    'Inércia desligada por 5 segundos no trânsito',
  ];

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMsg(null);
    if (queryInput.trim().length < 3) {
      setValidationMsg(
        'Digite um tema científico ou pergunta hipotética com pelo menos 3 caracteres.'
      );
      return;
    }
    await onRunGroundedResearch(queryInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Pesquisa Fundamentada */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Módulo 4 · Descobrir Ideias com Busca Fundamentada (Google Search Grounding)
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              Pesquisa Científica & Perguntas Hipotéticas ("E se...?")
            </h2>
            <p className="text-xs text-[#FFF7E9]/75 max-w-3xl">
              Pesquisa fenômenos da física cotidiana usando <code className="text-[#FFD166]">{selectedModel}</code> com
              busca fundamentada. Guarda URLs, datas de consulta e fontes reais. Nunca inventa
              visualizações, taxas de retenção ou tendências artificiais.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          {validationMsg && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-[#FF6B50]/15 border border-[#FF6B50] text-xs text-[#FFF7E9]"
            >
              {validationMsg}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="research-topic-input" className="sr-only">
                Tema ou fenômeno físico para pesquisar
              </label>
              <input
                id="research-topic-input"
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ex: E se o ar tivesse a densidade da água por 4 segundos? / Efeito Magnus / Atrito..."
                className="w-full px-4 py-2.5 rounded-lg bg-[#08121b] border border-[#1d3b54] text-sm text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
              />
            </div>
            <button
              type="submit"
              disabled={isResearching}
              className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              {isResearching ? 'Pesquisando com Gemini...' : 'Pesquisar com Gemini'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#FFF7E9]/60">Sugestões rápidas:</span>
            {quickTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQueryInput(topic)}
                className="text-xs px-2.5 py-1 rounded bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#1d3b54] transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Lista de Ideias Pesquisadas (Separando Dados Verificados vs Avaliações Estimadas) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
            Banco de Ideias Fundamentadas ({ideas.length})
          </h3>
          <span className="text-xs text-[#FFF7E9]/70 font-mono">
            Separação rigorosa: Dados Verificados vs Avaliações Estimadas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {ideas.map((idea) => (
            <article
              key={idea.id}
              className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-[#1d3b54] pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#39C8D5]">
                    <span>
                      Status:{' '}
                      {idea.status === 'aprovada'
                        ? 'Convertida em Episódio'
                        : 'Aguardando Aprovação'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Consultado em {new Date(idea.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h4 className="text-xl font-display font-bold text-[#FFF7E9]">
                    {idea.provisionalTitle}
                  </h4>
                  <p className="text-sm text-[#FFD166] font-medium">
                    Gancho Sugerido (1º segundo): “{idea.suggestedHook}”
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onApproveIdeaToEpisode(idea)}
                    className="px-4 py-2 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aprovar e Criar Episódio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUNA 1: DADOS CIENTÍFICOS VERIFICADOS E FONTES */}
                <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg p-4 space-y-3">
                  <div className="text-xs font-mono font-semibold text-[#39C8D5] uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    1. Dados Científicos Verificados & Fontes
                  </div>

                  <p className="text-xs text-[#FFF7E9]/90 leading-relaxed">
                    {idea.scientificSummary}
                  </p>

                  {idea.verifiedFacts.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-[#FFF7E9]/85 list-disc list-inside">
                      {idea.verifiedFacts.map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  )}

                  {/* Links de Referências com Data de Consulta */}
                  <div className="pt-2 space-y-2 border-t border-[#1d3b54]">
                    <div className="text-[11px] font-mono text-[#FFF7E9]/70">
                      FONTES E URLS REGISTRADAS ({idea.references.length}):
                    </div>
                    {idea.references.length === 0 ? (
                      <div className="text-xs text-[#FFF7E9]/60">
                        Síntese teórica de física clássica (sem URLs externas anexadas nesta consulta).
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {idea.references.map((ref) => (
                          <div
                            key={ref.id}
                            className="p-2 rounded bg-[#122638] border border-[#1d3b54] flex items-start justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#39C8D5] hover:underline font-medium flex items-center gap-1"
                              >
                                <span>{ref.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <div className="text-[11px] text-[#FFF7E9]/65 font-mono">
                                Fonte: {ref.sourceName} · Consulta:{' '}
                                {new Date(ref.consultedAt).toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUNA 2: AVALIAÇÕES ESTIMADAS DE PRODUÇÃO E RISCOS CIENTÍFICOS */}
                <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg p-4 space-y-3">
                  <div className="text-xs font-mono font-semibold text-[#FFD166] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    2. Avaliação Estimada de Produção (Não-Métrica)
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-[#122638] border border-[#1d3b54]">
                      <div className="text-[11px] text-[#FFF7E9]/70">
                        Potencial Visual Estimado
                      </div>
                      <div className="text-base font-display font-bold text-[#FFD166] mt-0.5">
                        {idea.estimatedVisualPotential}
                      </div>
                    </div>
                    <div className="p-3 rounded bg-[#122638] border border-[#1d3b54]">
                      <div className="text-[11px] text-[#FFF7E9]/70">
                        Complexidade da Animação 2D
                      </div>
                      <div className="text-base font-display font-bold text-[#39C8D5] mt-0.5">
                        {idea.estimatedAnimationComplexity}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#FFF7E9]/85 leading-relaxed">
                    {idea.estimatedAudienceAppealNote}
                  </p>

                  {/* Principais Riscos Científicos */}
                  <div className="pt-2 space-y-1.5 border-t border-[#1d3b54]">
                    <div className="text-[11px] font-mono text-[#FF6B50] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      PRINCIPAIS RISCOS E CUIDADOS CIENTÍFICOS:
                    </div>
                    <ul className="space-y-1 text-xs text-[#FFF7E9]/85 list-disc list-inside">
                      {idea.scientificRisks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
