import React, { useState, useEffect } from 'react';
import {
  BugiExpression,
  BugiPose,
  Episode,
  ScenarioPreset,
  StoryboardScene,
} from '../types/studio';
import {
  calibrateScenesWithRealAudio,
  deleteScene,
  duplicateScene,
  recalculateSceneTimings,
  reorderScenes,
  validateStoryboardTimings,
} from '../utils/studioLogic';
import { BugiSceneStage } from './BugiCharacterSvg';
import {
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface StoryboardViewProps {
  episode: Episode;
  isGeneratingStoryboard: boolean;
  onUpdateEpisode: (updated: Episode) => void;
  onRegenerateStoryboardWithAI: () => Promise<void>;
}

const BUGI_POSES: { value: BugiPose; label: string }[] = [
  { value: 'caminhando', label: 'Caminhando Confiante' },
  { value: 'escorregando', label: 'Escorregando Sem Atrito' },
  { value: 'equilibrando', label: 'Recuperando Equilíbrio (Giro de Braços)' },
  { value: 'caindo', label: 'Queda Dramática (Torque)' },
  { value: 'flutuando', label: 'Flutuando / Gravidade Reduzida' },
  { value: 'investigando', label: 'Investigando Fenômeno' },
  { value: 'confiante_parado', label: 'Pose Final Confiante' },
];

const BUGI_EXPRESSIONS: { value: BugiExpression; label: string }[] = [
  { value: 'confiante', label: 'Confiante Demais' },
  { value: 'curioso', label: 'Curioso / Observador' },
  { value: 'surpreso', label: 'Surpreso (Olhos Arregalados)' },
  { value: 'panico_divertido', label: 'Pânico Divertido + Gota de Suor' },
  { value: 'deslumbrado', label: 'Deslumbrado / Comemorando' },
  { value: 'determinado', label: 'Determinado' },
];

const SCENARIO_PRESETS: { value: ScenarioPreset; label: string }[] = [
  { value: 'calcada_urbana', label: 'Calçada Urbana Brasileira (μ = 0)' },
  { value: 'laboratorio_bugi', label: 'Laboratório de Física do Bugi' },
  { value: 'parque_gravidade', label: 'Parque Urbano & Árvores' },
  { value: 'cozinha_caos', label: 'Cozinha Experimental' },
  { value: 'cruzamento_transito', label: 'Cruzamento Urbano' },
];

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  episode,
  isGeneratingStoryboard,
  onUpdateEpisode,
  onRegenerateStoryboardWithAI,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    episode.scenes[0]?.id || ''
  );
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [playheadSec, setPlayheadSec] = useState(0);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const scenes = episode.scenes;
  const timingValidation = validateStoryboardTimings(scenes);
  const totalDurationSec = timingValidation.totalDurationSec || 43;

  const activeNarration =
    episode.narrationTracks.find((n) => n.id === episode.activeNarrationId) ||
    episode.narrationTracks[0];

  useEffect(() => {
    if (!scenes.some((s) => s.id === selectedSceneId) && scenes[0]) {
      setSelectedSceneId(scenes[0].id);
    }
  }, [scenes, selectedSceneId]);

  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setPlayheadSec((prev) => {
        const next = Number((prev + 0.2).toFixed(2));
        if (next >= totalDurationSec) {
          setIsPlayingTimeline(false);
          return 0;
        }
        const matchingScene = scenes.find(
          (s) => next >= s.startTimeSec && next <= s.endTimeSec
        );
        if (matchingScene) {
          setSelectedSceneId(matchingScene.id);
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlayingTimeline, totalDurationSec, scenes]);

  const activeScene =
    scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const handleUpdateScenes = (nextScenes: StoryboardScene[], note?: string) => {
    onUpdateEpisode({
      ...episode,
      scenes: nextScenes,
      updatedAt: new Date().toISOString(),
    });
    if (note) {
      setActionFeedback(note);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleFieldChange = (
    sceneId: string,
    field: keyof StoryboardScene,
    value: any
  ) => {
    const updated = scenes.map((s) =>
      s.id === sceneId ? { ...s, [field]: value } : s
    );
    handleUpdateScenes(recalculateSceneTimings(updated));
  };

  const handleCalibrateWithRealAudio = () => {
    const durationToUse = activeNarration?.durationSec || 43.0;
    const calibrated = calibrateScenesWithRealAudio(scenes, durationToUse);
    handleUpdateScenes(
      calibrated.scenes,
      `Tempos definitivos recalculados com a duração real da narração (${durationToUse.toFixed(1)}s).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Gerador de Storyboard */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase">
              Módulo 6 · Gerador de Storyboard Visual 2D & Timeline Sincronizada
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              Storyboard Editável — {episode.title}
            </h2>
            <p className="text-xs text-[#FFF7E9]/75">
              Todas as cenas preservam a identidade fixa do <strong className="text-[#FFD166]">Bugi</strong>.
              Reorganize, duplique, exclua e calibre os tempos definitivos usando a duração real do áudio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCalibrateWithRealAudio}
              className="px-4 py-2 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-4 h-4" />
              Calcular Tempos Definitivos pelo Áudio ({activeNarration ? `${activeNarration.durationSec}s` : '43.0s'})
            </button>

            <button
              type="button"
              onClick={onRegenerateStoryboardWithAI}
              disabled={isGeneratingStoryboard}
              className="px-4 py-2 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingStoryboard
                ? 'Regenerando Cenas...'
                : 'Regenerar Cenas com IA'}
            </button>
          </div>
        </div>

        {actionFeedback && (
          <div className="p-3 rounded-lg bg-[#39C8D5]/15 border border-[#39C8D5] text-xs text-[#FFF7E9] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#39C8D5] shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </section>

      {/* Palco 2D 9:16 + Timeline Visual Interativa */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pré-visualização de Cena Vertical 9:16 */}
        <div className="lg:col-span-4 bg-[#122638] border border-[#1d3b54] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-[#39C8D5]">
              MONITOR 9:16 (1080×1920) · CENA 0{activeScene?.order || 1}
            </div>
            <span className="text-xs font-mono text-[#FFD166] tabular-nums">
              {playheadSec.toFixed(1)}s / {totalDurationSec.toFixed(1)}s
            </span>
          </div>

          <div className="w-full max-w-[245px] mx-auto aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#1d3b54] shadow-inner">
            {activeScene && (
              <BugiSceneStage
                pose={activeScene.bugiPose}
                expression={activeScene.bugiExpression}
                scenario={activeScene.scenarioPreset}
                subtitlePreview={activeScene.subtitlesText}
                timerSeconds={Math.max(
                  0,
                  Math.ceil(5 - (activeScene.order - 1))
                )}
                aspectRatio="9:16"
                className="w-full h-full"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsPlayingTimeline((p) => !p)}
              className="flex-1 py-2 px-4 bg-[#FF6B50] hover:bg-[#ff5436] text-[#FFF7E9] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPlayingTimeline ? (
                <>
                  <Pause className="w-4 h-4" /> Pausar Prévia
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Simular Timeline ({totalDurationSec.toFixed(1)}s)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Visual + Editor Detalhado da Cena Selecionada */}
        <div className="lg:col-span-8 space-y-5">
          {/* Timeline Visual Horizontal */}
          <div className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-display font-bold text-[#FFF7E9]">
                Timeline Visual Sincronizada ({scenes.length} cenas · 30 FPS ·{' '}
                {Math.round(totalDurationSec * 30)} frames)
              </h3>
              <span className="text-xs font-mono text-[#39C8D5]">
                Modo de tempo:{' '}
                {scenes[0]?.timeCalculationMode === 'calculado_audio_real'
                  ? 'Calibrado pela Duração Real do Áudio'
                  : 'Estimado pelo Roteiro'}
              </span>
            </div>

            {/* Faixa da Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {scenes.map((scene) => {
                const isSelected = scene.id === activeScene?.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setSelectedSceneId(scene.id);
                      setPlayheadSec(scene.startTimeSec);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#08121b] border-[#39C8D5]'
                        : 'bg-[#08121b]/60 border-[#1d3b54] hover:border-[#39C8D5]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#39C8D5]">
                      <span>Cena 0{scene.order}</span>
                      <span className="tabular-nums text-[#FFD166]">
                        {scene.startTimeSec}s–{scene.endTimeSec}s
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#FFF7E9] truncate mt-1">
                      {scene.bugiPose}
                    </div>
                    <div className="text-[11px] text-[#FFF7E9]/65 truncate">
                      {scene.correspondingText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspector Editável Completo da Cena Selecionada (Todos os 14 Campos Obrigatórios da Seção 6) */}
          {activeScene && (
            <div className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1d3b54] pb-4">
                <div>
                  <div className="text-xs font-mono text-[#39C8D5]">
                    ID EXCLUSIVO: {activeScene.id} · ORDEM #{activeScene.order} · PERSONAGENS:{' '}
                    {activeScene.charactersPresent.join(', ')}
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
                    Propriedades Completas da Cena 0{activeScene.order}
                  </h3>
                </div>

                {/* Controles de Reorganizar, Duplicar e Excluir */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateScenes(
                        reorderScenes(
                          scenes,
                          activeScene.order - 1,
                          activeScene.order - 2
                        ),
                        `Cena 0${activeScene.order} movida para trás.`
                      )
                    }
                    disabled={activeScene.order <= 1}
                    aria-label="Mover cena para trás"
                    className="p-2 rounded bg-[#08121b] hover:bg-[#19344b] disabled:opacity-40 text-[#FFF7E9] border border-[#1d3b54] cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateScenes(
                        reorderScenes(
                          scenes,
                          activeScene.order - 1,
                          activeScene.order
                        ),
                        `Cena 0${activeScene.order} movida para frente.`
                      )
                    }
                    disabled={activeScene.order >= scenes.length}
                    aria-label="Mover cena para frente"
                    className="p-2 rounded bg-[#08121b] hover:bg-[#19344b] disabled:opacity-40 text-[#FFF7E9] border border-[#1d3b54] cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateScenes(
                        duplicateScene(scenes, activeScene.id),
                        `Cena 0${activeScene.order} duplicada com sucesso.`
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#1d3b54] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicar Cena
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (scenes.length <= 1) return;
                      handleUpdateScenes(
                        deleteScene(scenes, activeScene.id),
                        `Cena excluída e tempos recalculados.`
                      );
                    }}
                    disabled={scenes.length <= 1}
                    className="px-3 py-1.5 rounded bg-[#08121b] hover:bg-[#FF6B50]/20 disabled:opacity-40 text-[#FF6B50] border border-[#FF6B50]/40 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="scene-pose-select"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Pose do Bugi (Rig Fixo)
                  </label>
                  <select
                    id="scene-pose-select"
                    value={activeScene.bugiPose}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'bugiPose',
                        e.target.value as BugiPose
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    {BUGI_POSES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="scene-exp-select"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Expressão Facial do Bugi
                  </label>
                  <select
                    id="scene-exp-select"
                    value={activeScene.bugiExpression}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'bugiExpression',
                        e.target.value as BugiExpression
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    {BUGI_EXPRESSIONS.map((exp) => (
                      <option key={exp.value} value={exp.value}>
                        {exp.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="scene-scenario-select"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Cenário Vetorial 2D
                  </label>
                  <select
                    id="scene-scenario-select"
                    value={activeScene.scenarioPreset}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'scenarioPreset',
                        e.target.value as ScenarioPreset
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    {SCENARIO_PRESETS.map((sc) => (
                      <option key={sc.value} value={sc.value}>
                        {sc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="scene-text-input"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Texto Correspondente da Narração
                  </label>
                  <textarea
                    id="scene-text-input"
                    rows={2}
                    value={activeScene.correspondingText}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'correspondingText',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scene-action-input"
                    className="block text-xs font-medium text-[#39C8D5] mb-1"
                  >
                    Ação Principal na Cena
                  </label>
                  <textarea
                    id="scene-action-input"
                    rows={2}
                    value={activeScene.mainAction}
                    onChange={(e) =>
                      handleFieldChange(activeScene.id, 'mainAction', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="scene-cam-input"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Movimento de Câmera
                  </label>
                  <input
                    id="scene-cam-input"
                    type="text"
                    value={activeScene.cameraMovement}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'cameraMovement',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scene-trans-input"
                    className="block text-xs font-medium text-[#FFF7E9]/90 mb-1"
                  >
                    Instruções de Transição
                  </label>
                  <input
                    id="scene-trans-input"
                    type="text"
                    value={activeScene.transitionInstruction}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'transitionInstruction',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scene-dur-input"
                    className="block text-xs font-medium text-[#FFD166] mb-1"
                  >
                    Duração da Cena (Segundos)
                  </label>
                  <input
                    id="scene-dur-input"
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={
                      activeScene.definitiveDurationSec ||
                      activeScene.approxDurationSec
                    }
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      const updated = scenes.map((s) =>
                        s.id === activeScene.id
                          ? {
                              ...s,
                              approxDurationSec: val,
                              definitiveDurationSec: val,
                            }
                          : s
                      );
                      handleUpdateScenes(recalculateSceneTimings(updated));
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs font-mono text-[#FFD166] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="scene-sub-input"
                    className="block text-xs font-medium text-[#FFD166] mb-1"
                  >
                    Legendas Dinâmicas (Zona Segura Shorts)
                  </label>
                  <input
                    id="scene-sub-input"
                    type="text"
                    value={activeScene.subtitlesText}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'subtitlesText',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="scene-sci-input"
                    className="block text-xs font-medium text-[#39C8D5] mb-1"
                  >
                    Observações Científicas para Animação
                  </label>
                  <input
                    id="scene-sci-input"
                    type="text"
                    value={activeScene.scientificObservations}
                    onChange={(e) =>
                      handleFieldChange(
                        activeScene.id,
                        'scientificObservations',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1d3b54]">
                <div>
                  <div className="text-xs font-semibold text-[#FFF7E9]/90 mb-1">
                    Camadas de Animação (Remotion Directives)
                  </div>
                  <ul className="text-xs text-[#FFF7E9]/80 space-y-1 list-disc list-inside bg-[#08121b] p-3 rounded-lg border border-[#1d3b54]">
                    {activeScene.animations.map((anim, i) => (
                      <li key={i}>{anim}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#FFF7E9]/90 mb-1">
                    Efeitos Sonoros (SFX Sincronizados)
                  </div>
                  <ul className="text-xs text-[#39C8D5] space-y-1 list-disc list-inside bg-[#08121b] p-3 rounded-lg border border-[#1d3b54]">
                    {activeScene.soundEffects.map((sfx, i) => (
                      <li key={i}>{sfx}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
