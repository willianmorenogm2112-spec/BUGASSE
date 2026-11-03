import React, { useState } from 'react';
import {
  AssetCategory,
  BugiAnimationState,
  BugiExpression,
  BugiPose,
  ScenarioPreset,
  StudioAsset,
} from '../types/studio';
import { BUGI_CANONICAL_PROFILE } from '../utils/studioLogic';
import {
  BugiSceneStage,
  generateBugiCanonicalSvgMarkup,
} from './BugiCharacterSvg';
import {
  PREVIOUS_ENGINE_AUDIT_REPORT,
  computeBugiMultiJointRig,
} from '../remotion/animation/bugiRigAndBeatsEngine';
import {
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AssetsLibraryViewProps {
  assets: StudioAsset[];
  onAddAsset: (asset: StudioAsset) => void;
  onGenerateScenarioImage: (description: string) => Promise<void>;
  isGeneratingImage: boolean;
}

const ASSET_CATEGORIES: ('Todos' | AssetCategory)[] = [
  'Todos',
  'Personagens SVG',
  'Expressoes',
  'Poses',
  'Cenarios',
  'Objetos',
  'Referencias visuais',
  'Narracoes',
  'Trilhas',
  'Efeitos sonoros',
  'Capas',
  'Videos finais',
];

const ALL_11_ANIMATION_STATES: BugiAnimationState[] = [
  'idle',
  'walking',
  'running',
  'anticipation',
  'surprise',
  'panic',
  'sliding',
  'falling',
  'impact',
  'recovery',
  'celebrating',
];

export const AssetsLibraryView: React.FC<AssetsLibraryViewProps> = ({
  assets,
  onAddAsset,
  onGenerateScenarioImage,
  isGeneratingImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'Todos' | AssetCategory
  >('Todos');
  const [previewPose, setPreviewPose] = useState<BugiPose>('escorregando');
  const [previewExpression, setPreviewExpression] =
    useState<BugiExpression>('surpreso');
  const [previewScenario, setPreviewScenario] =
    useState<ScenarioPreset>('calcada_urbana');
  const [previewAnimState, setPreviewAnimState] =
    useState<BugiAnimationState>('sliding');
  const [previewFrame, setPreviewFrame] = useState<number>(36);
  const [showSvgCode, setShowSvgCode] = useState(false);
  const [scenarioPrompt, setScenarioPrompt] = useState('');

  const liveJoints = computeBugiMultiJointRig({
    pose: previewPose,
    expression: previewExpression,
    stateOverride: previewAnimState,
    frame: previewFrame,
    fps: 30,
  });

  const filteredAssets =
    selectedCategory === 'Todos'
      ? assets
      : assets.filter((a) => a.category === selectedCategory);

  const handleDownloadCanonicalSvg = () => {
    const svgString = generateBugiCanonicalSvgMarkup(
      previewPose,
      previewExpression,
      previewScenario
    );
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugi-canonical-${previewPose}-${previewExpression}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadSvgOrAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      const newAsset: StudioAsset = {
        id: `asset-up-${Date.now()}`,
        name: file.name,
        category: file.name.endsWith('.svg')
          ? 'Personagens SVG'
          : 'Referencias visuais',
        version: '1.0.0',
        license: 'Proprietária — Upload Manual Estúdio',
        origin: 'Upload Manual',
        createdAt: new Date().toISOString(),
        fileFormat: file.type || 'image/svg+xml',
        fileSizeBytes: file.size,
        preservesBugiIdentity: true,
        svgContent: file.name.endsWith('.svg') ? content : undefined,
        previewUrl: !file.name.endsWith('.svg') ? content : undefined,
        bugiPose: previewPose,
        bugiExpression: previewExpression,
        scenarioPreset: previewScenario,
        description: `Asset enviado manualmente (${(file.size / 1024).toFixed(1)} KB) preservando o padrão visual do canal.`,
        tags: ['upload-manual', 'bugi', 'studio'],
      };
      onAddAsset(newAsset);
    };
    if (file.name.endsWith('.svg')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seção 3 da Navegação: Identidade do Canal + Rig Multi-Articulado de 11 Estados */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#39C8D5] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              3. Identidade do Canal · Personagem Bugi, Rig 2D de 11 Estados, Cenários 4 Camadas & SVGs
            </div>
            <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
              Model Sheet Oficial & Rig Multi-Articulado do BUGI
            </h2>
            <p className="text-xs text-[#FFF7E9]/75 max-w-3xl">
              {BUGI_CANONICAL_PROFILE.personality}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadCanonicalSvg}
              className="px-4 py-2 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Baixar SVG Editável desta Pose
            </button>
            <button
              type="button"
              onClick={() => setShowSvgCode((s) => !s)}
              className="px-3.5 py-2 bg-[#08121b] hover:bg-[#19344b] text-[#FFF7E9] border border-[#1d3b54] font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#FFD166]" />
              {showSvgCode ? 'Ocultar Código SVG' : 'Inspecionar SVG Puro'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visualizador Interativo do Rig SVG do Bugi */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-2">
            <div className="w-full max-w-[260px] aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#39C8D5] bg-[#08121b]">
              <BugiSceneStage
                pose={previewPose}
                expression={previewExpression}
                scenario={previewScenario}
                aspectRatio="9:16"
                frame={previewFrame}
                stateOverride={previewAnimState}
                className="w-full h-full"
              />
            </div>
            <div className="text-[11px] font-mono text-[#39C8D5]">
              Estado: <strong>{previewAnimState}</strong> • Quadro: F{previewFrame}
            </div>
          </div>

          {/* Especificação Canônica Fixa e Controles de Teste de Rig Multi-Articulado */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-xs font-mono text-[#FF6B50]">
                  CABELO CORAL ESPETADO (#FF6B50) + FOLLOW-THROUGH
                </div>
                <div className="text-xs text-[#FFF7E9]/90 mt-1">
                  {BUGI_CANONICAL_PROFILE.hair}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-xs font-mono text-[#39C8D5]">
                  OLHOS PRETOS EXPRESSIVOS (#09131C) + PÁLPEBRAS
                </div>
                <div className="text-xs text-[#FFF7E9]/90 mt-1">
                  {BUGI_CANONICAL_PROFILE.eyes}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-xs font-mono text-[#39C8D5]">
                  JAQUETA AZUL-PETRÓLEO (#122638) & CAMISETA CREME (#FFF7E9)
                </div>
                <div className="text-xs text-[#FFF7E9]/90 mt-1">
                  {BUGI_CANONICAL_PROFILE.jacket} · {BUGI_CANONICAL_PROFILE.shirt}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-xs font-mono text-[#FFD166]">
                  CALÇA ESCURA (#0A1520) & TÊNIS CLAROS (#FFF7E9)
                </div>
                <div className="text-xs text-[#FFF7E9]/90 mt-1">
                  {BUGI_CANONICAL_PROFILE.pants} · {BUGI_CANONICAL_PROFILE.sneakers}
                </div>
              </div>
            </div>

            {/* Máquina de Estados de 11 Estados + Telemetria de Pivôs */}
            <div className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#FFD166] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  MÁQUINA DE ESTADOS (11 ESTADOS ARTICULADOS DO BUGI):
                </span>
                <span className="text-[11px] font-mono text-emerald-300">
                  Squash/Stretch: {liveJoints.squashX.toFixed(2)}×{liveJoints.stretchY.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ALL_11_ANIMATION_STATES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPreviewAnimState(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      previewAnimState === st
                        ? 'bg-[#FF6B50] text-[#FFF7E9]'
                        : 'bg-[#122638] text-[#FFF7E9]/75 hover:text-[#FFF7E9]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Scrubber de Frame (0 a 120) para testar movimento elástico */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-mono text-[#39C8D5] whitespace-nowrap">
                  Quadro (F{previewFrame}):
                </span>
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={previewFrame}
                  onChange={(e) => setPreviewFrame(Number(e.target.value))}
                  className="w-full accent-[#39C8D5]"
                />
              </div>

              {/* Telemetria em tempo real dos pivôs de rotação independentes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono">
                <div className="p-2 rounded bg-[#122638] text-[#FFF7E9]/85">
                  Ombro Esq/Dir: {Math.round(liveJoints.leftShoulder.angleDeg)}° /{' '}
                  {Math.round(liveJoints.rightShoulder.angleDeg)}°
                </div>
                <div className="p-2 rounded bg-[#122638] text-[#FFF7E9]/85">
                  Cotovelo Esq/Dir: {Math.round(liveJoints.leftElbow.angleDeg)}° /{' '}
                  {Math.round(liveJoints.rightElbow.angleDeg)}°
                </div>
                <div className="p-2 rounded bg-[#122638] text-[#FFF7E9]/85">
                  Quadril/Joelho: {Math.round(liveJoints.leftHip.angleDeg)}° /{' '}
                  {Math.round(liveJoints.leftKnee.angleDeg)}°
                </div>
                <div className="p-2 rounded bg-[#122638] text-[#FFF7E9]/85">
                  Cabeça/Cabelo: {Math.round(liveJoints.headRotationDeg)}° /{' '}
                  {Math.round(liveJoints.hairFollowDeg)}°
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label
                    htmlFor="rig-pose-select"
                    className="block text-xs text-[#FFF7E9]/80 mb-1"
                  >
                    Pose Base do Bugi
                  </label>
                  <select
                    id="rig-pose-select"
                    value={previewPose}
                    onChange={(e) => setPreviewPose(e.target.value as BugiPose)}
                    className="w-full px-3 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    <option value="caminhando">Caminhando</option>
                    <option value="escorregando">Escorregando</option>
                    <option value="equilibrando">Equilibrando</option>
                    <option value="caindo">Caindo</option>
                    <option value="flutuando">Flutuando</option>
                    <option value="investigando">Investigando</option>
                    <option value="confiante_parado">Confiante Parado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rig-exp-select"
                    className="block text-xs text-[#FFF7E9]/80 mb-1"
                  >
                    Expressão Facial
                  </label>
                  <select
                    id="rig-exp-select"
                    value={previewExpression}
                    onChange={(e) =>
                      setPreviewExpression(e.target.value as BugiExpression)
                    }
                    className="w-full px-3 py-1.5 rounded bg-[#122232] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    <option value="confiante">Confiante</option>
                    <option value="curioso">Curioso</option>
                    <option value="surpreso">Surpreso</option>
                    <option value="panico_divertido">Pânico Divertido</option>
                    <option value="deslumbrado">Deslumbrado</option>
                    <option value="determinado">Determinado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rig-bg-select"
                    className="block text-xs text-[#FFF7E9]/80 mb-1"
                  >
                    Cenário Vetorial (4 Camadas)
                  </label>
                  <select
                    id="rig-bg-select"
                    value={previewScenario}
                    onChange={(e) =>
                      setPreviewScenario(e.target.value as ScenarioPreset)
                    }
                    className="w-full px-3 py-1.5 rounded bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                  >
                    <option value="calcada_urbana">Calçada Urbana</option>
                    <option value="laboratorio_bugi">Laboratório do Bugi</option>
                    <option value="parque_gravidade">Parque da Gravidade</option>
                    <option value="cozinha_caos">Cozinha do Caos</option>
                  </select>
                </div>
              </div>
            </div>

            {showSvgCode && (
              <pre className="p-3 rounded-lg bg-[#08121b] border border-[#39C8D5]/40 text-[11px] font-mono text-[#39C8D5] overflow-x-auto max-h-48">
                {generateBugiCanonicalSvgMarkup(
                  previewPose,
                  previewExpression,
                  previewScenario
                )}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Seção 1 do Prompt de Qualidade Visual: Relatório de Auditoria do Motor com Prioridades */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#FFD166] font-bold">
            Auditoria Técnica Concluída • Reconstrução da Qualidade Visual
          </span>
          <h3 className="text-lg font-display font-bold text-[#FFF7E9] mt-0.5">
            Relatório de Problemas Auditados e Correções Aplicadas no Motor
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PREVIOUS_ENGINE_AUDIT_REPORT.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#08121b] border border-emerald-500/30 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF6B50]/20 text-[#FF6B50]">
                  Prioridade {item.priority} • {item.component}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                </span>
              </div>
              <div className="text-xs font-bold text-[#FFF7E9]">
                Diagnóstico: {item.problemFound}
              </div>
              <div className="text-xs text-[#39C8D5]">{item.appliedFix}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Biblioteca de Assets Categorizada (Seção 9) */}
      <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-bold text-[#FFF7E9]">
              Biblioteca de Assets do Estúdio ({filteredAssets.length} itens)
            </h3>
            <p className="text-xs text-[#FFF7E9]/70">
              Guarda metadados, versões, licenças e origem dos recursos. Aceita SVGs editáveis e referências visuais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <Upload className="w-4 h-4" />
              <span>Cadastrar SVG Editável / Referência</span>
              <input
                type="file"
                accept=".svg,image/svg+xml,image/png,image/jpeg,audio/wav"
                onChange={handleUploadSvgOrAsset}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Gerador de Cenário de Referência 2D via Nano Banana (Sem alterar o Bugi) */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!scenarioPrompt.trim()) return;
            await onGenerateScenarioImage(scenarioPrompt.trim());
            setScenarioPrompt('');
          }}
          className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
        >
          <input
            type="text"
            value={scenarioPrompt}
            onChange={(e) => setScenarioPrompt(e.target.value)}
            placeholder="Gerar novo cenário 2D de referência com Nano Banana (ex: Estação de metrô sem gravidade, fundo vetorial vazio)..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9] focus:outline-none focus:border-[#39C8D5]"
          />
          <button
            type="submit"
            disabled={isGeneratingImage}
            className="px-4 py-2 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGeneratingImage
              ? 'Gerando Cenário...'
              : 'Gerar Cenário de Referência (Sem alterar Bugi)'}
          </button>
        </form>

        {/* Abas das 11 Categorias da Biblioteca */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#08121b] rounded-lg border border-[#1d3b54]">
          {ASSET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#39C8D5] text-[#08121b] font-bold'
                  : 'text-[#FFF7E9]/75 hover:text-[#FFF7E9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grade de Cards de Assets com Metadados, Versão, Licença e Origem */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <article
              key={asset.id}
              className="bg-[#08121b] border border-[#1d3b54] rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="h-44 rounded-lg overflow-hidden border border-[#1d3b54] bg-[#122638] flex items-center justify-center">
                  {asset.previewUrl ? (
                    <img
                      src={asset.previewUrl}
                      alt={asset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BugiSceneStage
                      pose={asset.bugiPose || 'confiante_parado'}
                      expression={asset.bugiExpression || 'confiante'}
                      scenario={asset.scenarioPreset || 'calcada_urbana'}
                      aspectRatio="1:1"
                      className="w-full h-full"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#39C8D5]">
                    <span>{asset.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>v{asset.version}</span>
                    <span aria-hidden="true">·</span>
                    <span>{asset.origin}</span>
                  </div>
                  <h4 className="text-sm font-display font-bold text-[#FFF7E9]">
                    {asset.name}
                  </h4>
                  <p className="text-xs text-[#FFF7E9]/75">{asset.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1d3b54] text-[11px] font-mono text-[#FFF7E9]/70 space-y-1">
                <div>Licença: {asset.license}</div>
                <div className="flex items-center justify-between">
                  <span>Formato: {asset.fileFormat}</span>
                  <span className="text-[#FFD166]">
                    Identidade Bugi: Preservada
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
