import React, { useState } from 'react';
import {
  Folder,
  Film,
  Download,
  Sliders,
  Play,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { Episode, EpisodeLogicalFolders } from '../types/studio';
import {
  buildEpisodeLogicalFolders,
  generateEpisodePublishingPackage,
} from '../services/productionOrchestrator';
import { BugiSceneStage } from './BugiCharacterSvg';

interface MyVideosLibraryViewProps {
  episodes: Episode[];
  activeEpisodeId: string;
  onSelectEpisode: (episodeId: string) => void;
  onResumeProductionInCreateTab: (episodeId: string) => void;
  onOpenAdvancedEditors: (episodeId: string, initialTab?: string) => void;
}

const LOGICAL_FOLDER_LABELS: Array<{
  key: keyof EpisodeLogicalFolders;
  title: string;
  subtitle: string;
}> = [
  { key: 'research', title: 'research/', subtitle: 'Fontes e hipóteses verificadas' },
  { key: 'script', title: 'script/', subtitle: 'Versões de roteiro e ganchos' },
  { key: 'narration', title: 'narration/', subtitle: 'Locuções WAV 24kHz PT-BR' },
  { key: 'storyboard', title: 'storyboard/', subtitle: 'Cenas e direção de arte' },
  { key: 'backgrounds', title: 'backgrounds/', subtitle: 'Cenários 4 camadas + IA' },
  { key: 'characters', title: 'characters/', subtitle: 'Rig multi-articulado Bugi' },
  { key: 'animation', title: 'animation/', subtitle: '10 funções Remotion + beats' },
  { key: 'editing', title: 'editing/', subtitle: 'Skill Reel + HyperFrames GSAP' },
  { key: 'audio', title: 'audio/', subtitle: 'Mixagem -14 LUFS + SFX' },
  { key: 'renders', title: 'renders/', subtitle: 'Arquivos MP4 H.264 1080×1920' },
  { key: 'thumbnail', title: 'thumbnail/', subtitle: 'Capas 9:16 e texto de impacto' },
  { key: 'publishing', title: 'publishing/', subtitle: 'Títulos, descrição e hashtags' },
];

export const MyVideosLibraryView: React.FC<MyVideosLibraryViewProps> = ({
  episodes,
  activeEpisodeId,
  onSelectEpisode,
  onResumeProductionInCreateTab,
  onOpenAdvancedEditors,
}) => {
  const [filterMode, setFilterMode] = useState<
    'todos' | 'finalizados' | 'interrompidos'
  >('todos');
  const [selectedFolderKey, setSelectedFolderKey] =
    useState<keyof EpisodeLogicalFolders>('renders');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedEpisode =
    episodes.find((ep) => ep.id === activeEpisodeId) || episodes[0];

  const logicalFolders =
    selectedEpisode.logicalFolders ||
    buildEpisodeLogicalFolders(selectedEpisode);

  const publishingPkg =
    selectedEpisode.publishingPackage ||
    generateEpisodePublishingPackage(selectedEpisode);

  const filteredEpisodes = episodes.filter((ep) => {
    const hasMp4 = Boolean(ep.hasRealRenderedMp4 && ep.renderedMp4Url);
    const isInterrupted =
      ep.orchestratorJob &&
      ['pausado', 'falhou', 'aguardando_aprovacao'].includes(
        ep.orchestratorJob.status
      );
    if (filterMode === 'finalizados') return hasMp4;
    if (filterMode === 'interrompidos') return Boolean(isInterrupted);
    return true;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatFolderEntries = (
    folderKey: keyof EpisodeLogicalFolders
  ): Array<{ label: string; value: string }> => {
    const data = logicalFolders[folderKey] as unknown as Record<string, unknown>;
    if (!data || typeof data !== 'object') return [];
    return Object.entries(data).map(([k, v]) => ({
      label: k,
      value: Array.isArray(v)
        ? v.join(', ')
        : typeof v === 'string' && v.startsWith('data:image/svg')
          ? 'SVG 1080×1920 Gerado'
          : String(v ?? '—'),
    }));
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA BIBLIOTECA */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#39C8D5]">
            <Film className="w-3.5 h-3.5" />
            Biblioteca Persistente • Firestore + Disco Local
          </span>
          <h2 className="text-2xl font-extrabold text-[#FFF7E9] mt-1">
            2. Meus Vídeos ({episodes.length} Episódios)
          </h2>
          <p className="text-sm text-[#FFF7E9]/70 mt-0.5">
            Episódios, versões de roteiro, vídeos MP4 finalizados, projetos interrompidos e organização automática nas 12 pastas lógicas.
          </p>
        </div>

        {/* Filtros de status */}
        <div className="flex items-center gap-2 bg-[#0B1722] p-1.5 rounded-xl border border-[#39C8D5]/25">
          {(['todos', 'finalizados', 'interrompidos'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filterMode === mode
                  ? 'bg-[#39C8D5] text-[#0B1722]'
                  : 'text-[#FFF7E9]/70 hover:text-[#FFF7E9]'
              }`}
            >
              {mode === 'todos'
                ? 'Todos os Episódios'
                : mode === 'finalizados'
                  ? 'MP4 Finalizados'
                  : 'Projetos Interrompidos / Em Revisão'}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE CARDS DOS EPISÓDIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredEpisodes.map((ep) => {
          const isSelected = ep.id === selectedEpisode.id;
          const renders = ep.renderedVersions || [];
          const latestMp4Url = ep.renderedMp4Url || renders[0]?.url;
          const firstScene = ep.scenes[0];
          const job = ep.orchestratorJob;

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEpisode(ep.id)}
              className={`bg-[#122638]/90 rounded-2xl p-5 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#39C8D5] ring-2 ring-[#39C8D5]/25'
                  : 'border-[#39C8D5]/20 hover:border-[#39C8D5]/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Miniatura 9:16 ou Player MP4 do Episódio */}
                <div className="w-32 shrink-0 mx-auto sm:mx-0">
                  {latestMp4Url ? (
                    <video
                      src={latestMp4Url}
                      controls
                      playsInline
                      onClick={(e) => e.stopPropagation()}
                      className="w-32 aspect-[9/16] rounded-xl bg-[#08111A] border border-emerald-500/40 object-cover"
                    />
                  ) : (
                    <div className="w-32 aspect-[9/16] rounded-xl overflow-hidden border border-[#39C8D5]/30">
                      <BugiSceneStage
                        pose={firstScene?.bugiPose || 'caminhando'}
                        expression={firstScene?.bugiExpression || 'curioso'}
                        scenario={
                          firstScene?.scenarioPreset || 'calcada_urbana'
                        }
                        aspectRatio="9:16"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Metadados, Versões e Botões de Ação */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-[#39C8D5] font-bold">
                        ID: {ep.id}
                      </span>
                      {latestMp4Url ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          MP4 Pronto ({renders[0]?.durationSec || 8}s)
                        </span>
                      ) : job ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFD166]/20 text-[#FFD166] text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Orquestrador: {job.completedWeightPercent}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0B1722] text-[#FFF7E9]/70 text-[11px]">
                          Etapa: {ep.stage}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-[#FFF7E9]">
                      {ep.title}
                    </h3>
                    <p className="text-xs text-[#FFF7E9]/70 mt-1 line-clamp-2">
                      {ep.hypothesis}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-[#FFF7E9]/75 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#0B1722]">
                        {ep.scriptVersions.length} versão(ões) roteiro
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0B1722]">
                        {ep.scenes.length} cenas
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0B1722]">
                        {ep.narrationTracks.length} locução(ões)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0B1722]">
                        {renders.length} render(s) MP4
                      </span>
                    </div>
                  </div>

                  {/* Botões de ação do Episódio */}
                  <div
                    className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#39C8D5]/15"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onResumeProductionInCreateTab(ep.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B50] hover:bg-[#ff816a] text-[#FFF7E9] text-xs font-extrabold cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {job && job.status !== 'concluído'
                        ? 'Retomar Produção'
                        : 'Produzir / Renderizar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenAdvancedEditors(ep.id, 'roteiro')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1722] hover:bg-[#39C8D5]/20 text-[#39C8D5] border border-[#39C8D5]/35 text-xs font-bold cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      EDITAR VÍDEO
                    </button>

                    {latestMp4Url && (
                      <a
                        href={latestMp4Url}
                        download={
                          renders[0]?.fileName || `${ep.id}-final.mp4`
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1722] text-xs font-extrabold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar MP4
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEÇÃO 4 DO PROMPT: AS 12 PASTAS LÓGICAS DO EPISÓDIO + PACOTE DE PUBLICAÇÃO */}
      <div className="bg-[#122638]/90 border border-[#39C8D5]/25 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FFD166] font-bold">
              Organização Automática por Episódio • Seção 4
            </span>
            <h3 className="text-lg font-extrabold text-[#FFF7E9] mt-0.5">
              12 Pastas Lógicas de "{selectedEpisode.title}"
            </h3>
          </div>
          <span className="text-xs font-mono text-[#39C8D5] bg-[#0B1722] px-3 py-1.5 rounded-xl border border-[#39C8D5]/25">
            /episodes/{selectedEpisode.id}/{selectedFolderKey}/
          </span>
        </div>

        {/* Grade das 12 Pastas Lógicas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {LOGICAL_FOLDER_LABELS.map((folder) => {
            const active = selectedFolderKey === folder.key;
            return (
              <button
                key={folder.key}
                type="button"
                onClick={() => setSelectedFolderKey(folder.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-[#39C8D5]/20 border-[#39C8D5] text-[#FFF7E9]'
                    : 'bg-[#0B1722] border-[#39C8D5]/20 text-[#FFF7E9]/75 hover:border-[#39C8D5]/45'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Folder className="w-4 h-4 text-[#FFD166]" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#122638] text-[#39C8D5]">
                    Sincronizada
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-[#FFF7E9]">
                  {folder.title}
                </div>
                <div className="text-[10px] text-[#FFF7E9]/60 truncate">
                  {folder.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da Pasta Lógica Selecionada + Pacote de Publicação */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          <div className="lg:col-span-6 bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#39C8D5] flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Metadados e Arquivos em /{selectedFolderKey}/
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-[#FFF7E9]/85">
              {formatFolderEntries(selectedFolderKey).map((item, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded-lg bg-[#122638]/70 border border-[#39C8D5]/15 flex items-center justify-between gap-2"
                >
                  <span className="text-[#39C8D5]">{item.label}:</span>
                  <span className="truncate max-w-[300px] text-right">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pacote de Publicação Automático (Títulos, Descrição, Hashtags, Capa SVG) */}
          <div className="lg:col-span-6 bg-[#0B1722] border border-[#39C8D5]/25 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD166] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Pacote de Publicação (Shorts / TikTok / Reels)
              </h4>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    `${publishingPkg.finalTitle}\n\n${publishingPkg.descriptionText}\n\n${publishingPkg.hashtags.join(' ')}`,
                    'pub-pkg'
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#122638] text-[#39C8D5] text-[11px] font-bold cursor-pointer"
              >
                {copiedId === 'pub-pkg' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copiar Kit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#FFF7E9]/60">
                Título Final Otimizado:
              </div>
              <div className="text-xs font-bold text-[#FFF7E9] bg-[#122638]/60 px-3 py-1.5 rounded">
                {publishingPkg.finalTitle}
              </div>
            </div>

            <div className="text-xs text-[#FFF7E9]/80 bg-[#122638]/60 p-2.5 rounded whitespace-pre-line">
              {publishingPkg.descriptionText}
            </div>

            <div className="text-[11px] font-mono text-[#39C8D5]">
              {publishingPkg.hashtags.join(' ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
