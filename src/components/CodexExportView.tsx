import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  AICallCostEntry,
  AIModelCategory,
  AIModelSlotConfig,
  CodexCompleteExportPackage,
  Episode,
  StudioAsset,
  StudioErrorLogEntry,
} from '../types/studio';
import {
  buildCodexExportPackage,
  validateCodexExportPackage,
} from '../utils/studioLogic';
import { generateBugiCanonicalSvgMarkup } from './BugiCharacterSvg';
import { generateHyperFramesDeterministicHtml } from '../utils/skillReelAndHyperFrames';
import {
  Package,
  Download,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Cpu,
  GitBranch,
  Upload,
  ShieldAlert,
} from 'lucide-react';

interface CodexExportViewProps {
  episode: Episode;
  assets: StudioAsset[];
  aiModels: AIModelSlotConfig[];
  costLogs: AICallCostEntry[];
  errorLogs: StudioErrorLogEntry[];
  activeSubTab: 'codex' | 'modelos';
  onChangeSubTab: (subTab: 'codex' | 'modelos') => void;
  onMarkPreparedForCodex: () => void;
  onAttachRealRenderedMp4: (file: File) => Promise<void>;
  onUpdateModelSlot: (category: AIModelCategory, newModelId: string) => void;
  onRequestPaidKeyFlow: () => void;
}

type JsonPreviewFileKey = keyof CodexCompleteExportPackage;

export const CodexExportView: React.FC<CodexExportViewProps> = ({
  episode,
  assets,
  aiModels,
  costLogs,
  errorLogs,
  activeSubTab,
  onChangeSubTab,
  onMarkPreparedForCodex,
  onAttachRealRenderedMp4,
  onUpdateModelSlot,
  onRequestPaidKeyFlow,
}) => {
  const [selectedFileKey, setSelectedFileKey] =
    useState<JsonPreviewFileKey>('episode.json');
  const [exportStatusMsg, setExportStatusMsg] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const exportPkg = buildCodexExportPackage(episode, assets);
  const pkgValidation = validateCodexExportPackage(exportPkg);

  const handlePrepareAndDownloadZip = async () => {
    setIsZipping(true);
    setExportStatusMsg(null);
    try {
      const zip = new JSZip();

      // Adiciona todos os arquivos JSON estruturados
      zip.file(
        'episode.json',
        JSON.stringify(exportPkg['episode.json'], null, 2)
      );
      zip.file(
        'script.json',
        JSON.stringify(exportPkg['script.json'], null, 2)
      );
      zip.file(
        'storyboard.json',
        JSON.stringify(exportPkg['storyboard.json'], null, 2)
      );
      zip.file(
        'render-config.json',
        JSON.stringify(exportPkg['render-config.json'], null, 2)
      );
      zip.file(
        'animation-instructions.json',
        JSON.stringify(exportPkg['animation-instructions.json'], null, 2)
      );
      zip.file(
        'subtitles-instructions.json',
        JSON.stringify(exportPkg['subtitles-instructions.json'], null, 2)
      );
      zip.file(
        'assets-manifest.json',
        JSON.stringify(exportPkg['assets-manifest.json'], null, 2)
      );
      zip.file('README-CODEX.md', exportPkg['README-CODEX.md']);

      // Adiciona o rig SVG canônico do Bugi e SVGs das cenas
      const assetsFolder = zip.folder('assets');
      if (assetsFolder) {
        assetsFolder.file(
          'bugi-canonical-rig.svg',
          generateBugiCanonicalSvgMarkup(
            'confiante_parado',
            'confiante',
            'calcada_urbana'
          )
        );
        episode.scenes.forEach((sc) => {
          assetsFolder.file(
            `scene-${sc.order}-${sc.bugiPose}.svg`,
            generateBugiCanonicalSvgMarkup(
              sc.bugiPose,
              sc.bugiExpression,
              sc.scenarioPreset
            )
          );
          assetsFolder.file(
            `hyperframes-scene-${sc.order}.html`,
            generateHyperFramesDeterministicHtml(sc, sc.hyperFramesOverlay)
          );
        });
      }

      const skillReelFolder = zip.folder('.agents/skills/reel');
      if (skillReelFolder) {
        skillReelFolder.file(
          'install-skill-reel-windows.ps1',
          `# Instalador PowerShell Reproduzível — Skill Reel + HyperFrames (E Se Bugasse? Studio)\nWrite-Host "Verificando .agents\\skills\\reel e Remotion..." -ForegroundColor Cyan\nnpm install remotion @remotion/player @remotion/captions gsap mp4-muxer --save\n`
        );
      }

      const contentBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(contentBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codex-remotion-package-${episode.id}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      onMarkPreparedForCodex();
      setExportStatusMsg(
        `Pacote de produção "codex-remotion-package-${episode.id}.zip" exportado com sucesso (1080×1920, 30 FPS, Remotion H.264)!`
      );
    } catch (error) {
      setExportStatusMsg(
        `Erro ao gerar pacote ZIP: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadSingleFile = (key: JsonPreviewFileKey) => {
    const raw =
      typeof exportPkg[key] === 'string'
        ? (exportPkg[key] as string)
        : JSON.stringify(exportPkg[key], null, 2);
    const mime = key.endsWith('.md') ? 'text/markdown' : 'application/json';
    const blob = new Blob([raw], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = key;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileKeys: JsonPreviewFileKey[] = [
    'episode.json',
    'script.json',
    'storyboard.json',
    'render-config.json',
    'animation-instructions.json',
    'subtitles-instructions.json',
    'assets-manifest.json',
    'README-CODEX.md',
  ];

  return (
    <div className="space-y-6">
      {/* Seletor entre Exportação Codex/Remotion e Configuração de Modelos de IA */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#122638] border border-[#1d3b54] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => onChangeSubTab('codex')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'codex'
              ? 'bg-[#39C8D5] text-[#08121b] font-bold'
              : 'text-[#FFF7E9]/80 hover:text-[#FFF7E9]'
          }`}
        >
          10. Integração Codex & Remotion (Pacote de Produção)
        </button>
        <button
          type="button"
          onClick={() => onChangeSubTab('modelos')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'modelos'
              ? 'bg-[#39C8D5] text-[#08121b] font-bold'
              : 'text-[#FFF7E9]/80 hover:text-[#FFF7E9]'
          }`}
        >
          7. Modelos de IA, Custos & Histórico de Erros
        </button>
      </div>

      {activeSubTab === 'codex' ? (
        <>
          {/* Painel Principal de Exportação para Codex e Remotion */}
          <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#39C8D5] uppercase">
                  Módulo 10 · Pacote de Produção para Windows (Codex + Remotion 2D)
                </div>
                <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
                  Preparar para Codex — {episode.title}
                </h2>
                <p className="text-xs text-[#FFF7E9]/75 max-w-3xl">
                  Exporta todos os arquivos estruturados e os assets SVG canônicos do Bugi.
                  O aplicativo nunca afirma que renderizou um vídeo enquanto não existir um arquivo MP4 real.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  disabled={isZipping}
                  onClick={handlePrepareAndDownloadZip}
                  className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#ff5436] disabled:opacity-50 text-[#FFF7E9] font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Package className="w-4 h-4" />
                  {isZipping ? 'Empacotando...' : 'Preparar para Codex (Baixar Pacote .ZIP)'}
                </button>
              </div>
            </div>

            {exportStatusMsg && (
              <div className="p-3.5 rounded-lg bg-[#39C8D5]/15 border border-[#39C8D5] text-xs text-[#FFF7E9] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39C8D5] shrink-0" />
                <span>{exportStatusMsg}</span>
              </div>
            )}

            {/* Especificações Técnicas de Exportação (1080x1920, 30 FPS, MP4 H.264) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Resolução Vertical</div>
                <div className="text-sm font-mono font-bold text-[#39C8D5] mt-0.5 tabular-nums">
                  1080 × 1920
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Taxa de Quadros</div>
                <div className="text-sm font-mono font-bold text-[#39C8D5] mt-0.5 tabular-nums">
                  30 FPS ({exportPkg['storyboard.json'].totalFrames} frames)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Codec & Formato</div>
                <div className="text-sm font-mono font-bold text-[#FFF7E9] mt-0.5">
                  MP4 H.264 (yuv420p)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Engine 2D</div>
                <div className="text-sm font-mono font-bold text-[#FFD166] mt-0.5">
                  Remotion + Rig SVG
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Validação Schemas</div>
                <div className="text-sm font-mono font-bold text-[#39C8D5] mt-0.5">
                  {pkgValidation.valid ? '100% Válido' : 'Requer Atenção'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54]">
                <div className="text-[11px] text-[#FFF7E9]/65">Status do Render MP4</div>
                <div className="text-xs font-mono font-bold text-[#FFD166] mt-0.5">
                  {episode.hasRealRenderedMp4
                    ? 'MP4 Real Verificado'
                    : 'Sem Render MP4 Real'}
                </div>
              </div>
            </div>

            {/* Inspetor Interativo dos Arquivos JSON do Pacote */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {fileKeys.map((fileKey) => (
                    <button
                      key={fileKey}
                      type="button"
                      onClick={() => setSelectedFileKey(fileKey)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                        selectedFileKey === fileKey
                          ? 'bg-[#39C8D5] text-[#08121b] font-bold'
                          : 'bg-[#08121b] text-[#FFF7E9]/80 border border-[#1d3b54] hover:border-[#39C8D5]'
                      }`}
                    >
                      {fileKey}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadSingleFile(selectedFileKey)}
                  className="px-3.5 py-1.5 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar {selectedFileKey}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] text-xs font-mono text-[#FFF7E9]/90 overflow-x-auto max-h-96">
                {typeof exportPkg[selectedFileKey] === 'string'
                  ? (exportPkg[selectedFileKey] as string)
                  : JSON.stringify(exportPkg[selectedFileKey], null, 2)}
              </pre>
            </div>
          </section>

          {/* Interface Futura para Agente Local Autenticado (Windows Codex Worker) + Upload de MP4 Real */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FFD166]" />
                  Interface do Agente Local Windows (Codex Render Worker)
                </h3>
                <span className="text-xs font-mono text-[#FFD166]">
                  Status: Desconectado (Modo Exportação Pacote)
                </span>
              </div>

              <p className="text-xs text-[#FFF7E9]/80 leading-relaxed">
                Esta interface foi projetada para quando o daemon local do Codex estiver rodando no seu
                computador Windows. O aplicativo <strong>não simula uma conexão falsa</strong>: enquanto o
                agente local não estiver conectado via token, utilize o botão{' '}
                <strong>Preparar para Codex</strong> acima para baixar o pacote ZIP completo.
              </p>

              <div className="p-3.5 rounded-lg bg-[#08121b] border border-[#1d3b54] font-mono text-xs space-y-1.5 text-[#FFF7E9]/80">
                <div className="text-[#39C8D5]">
                  Contrato de Comunicação Futura (REST / WebSocket Local Worker):
                </div>
                <div>1. POST /api/codex-worker/claim-task (Bearer Token Autenticado)</div>
                <div>2. POST /api/codex-worker/progress (Frame atual / 1290 frames)</div>
                <div>3. POST /api/codex-worker/upload-mp4 (Devolve o MP4 H.264 final)</div>
              </div>

              {/* Recebimento de MP4 Real Renderizado pelo Usuário no Windows */}
              <div className="pt-2 border-t border-[#1d3b54] space-y-2">
                <div className="text-xs font-semibold text-[#FFF7E9]">
                  Já renderizou o arquivo MP4 no seu Windows com Remotion?
                </div>
                <label className="px-4 py-2 bg-[#08121b] hover:bg-[#19344b] text-[#39C8D5] border border-[#39C8D5]/40 rounded-lg text-xs font-medium inline-flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Anexar MP4 Real Renderizado (.mp4) para Concluir Episódio</span>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onAttachRealRenderedMp4(f);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {/* Documentação de Sincronização com GitHub e Codex */}
            <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-4">
              <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#39C8D5]" />
                Guia de Sincronização GitHub, Codex & Remotion (Windows)
              </h3>

              <div className="space-y-3 text-xs text-[#FFF7E9]/85 leading-relaxed">
                <p>
                  <strong>1. Sincronizar com GitHub:</strong> Exporte este repositório ou conecte ao
                  GitHub. Os pacotes gerados seguem os schemas TypeScript em{' '}
                  <code className="text-[#39C8D5]">src/types/studio.ts</code>.
                </p>
                <p>
                  <strong>2. Estrutura no PC Windows com Codex:</strong> Descompacte o arquivo{' '}
                  <code className="text-[#FFD166]">
                    codex-remotion-package-{episode.id}.zip
                  </code>{' '}
                  no diretório de episódios do seu projeto Remotion local.
                </p>
                <pre className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54] font-mono text-[11px] text-[#39C8D5] overflow-x-auto">
{`# No PowerShell (Windows):
cd C:\\Projetos\\ESeBugasseRemotion
npx remotion render src/index.ts ESeBugasseShort out/${episode.id}.mp4 ^
  --props=./episodes/${episode.id}/episode.json ^
  --codec=h264 --fps=30 --width=1080 --height=1920`}
                </pre>
              </div>
            </section>
          </div>
        </>
      ) : (
        /* ABA 7: CONFIGURAÇÃO DE MODELOS DE IA, CUSTOS & HISTÓRICO DE ERROS */
        <div className="space-y-6">
          <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1d3b54] pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#39C8D5] uppercase">
                  Módulo 7 · Configuração Dinâmica de Modelos (@google/genai SDK)
                </div>
                <h2 className="text-2xl font-display font-bold text-[#FFF7E9]">
                  Modelos de Inteligência Artificial & Controle de Custos
                </h2>
                <p className="text-xs text-[#FFF7E9]/75">
                  Altere os modelos de cada etapa sem modificar o código-fonte. Identificadores
                  descontinuados (1.5 / 2.0) são bloqueados automaticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={onRequestPaidKeyFlow}
                className="px-4 py-2 bg-[#08121b] hover:bg-[#19344b] text-[#FFD166] border border-[#FFD166]/40 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap self-start"
              >
                Configurar Chave Paga (Nano Banana / Argon / Omni)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiModels.map((slot) => (
                <div
                  key={slot.category}
                  className="p-4 rounded-xl bg-[#08121b] border border-[#1d3b54] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#39C8D5] uppercase">
                      {slot.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#FFD166]">
                      Ativo: {slot.selectedModel}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor={`model-slot-${slot.category}`}
                      className="sr-only"
                    >
                      Selecionar modelo para {slot.label}
                    </label>
                    <select
                      id={`model-slot-${slot.category}`}
                      value={slot.selectedModel}
                      onChange={(e) =>
                        onUpdateModelSlot(slot.category, e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#122638] border border-[#1d3b54] text-xs text-[#FFF7E9]"
                    >
                      {slot.availableModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — Est. US$ {m.estimatedCostPerCallUsd.toFixed(4)}
                          {m.requiresPaidKey ? ' (Requer Chave Paga)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-[#FFF7E9]/70">
                    {
                      slot.availableModels.find(
                        (m) => m.id === slot.selectedModel
                      )?.description
                    }
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Histórico de Custos de IA & Histórico de Erros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-3">
              <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#39C8D5]" />
                Registro Auditado de Chamadas e Custos de IA ({costLogs.length})
              </h3>
              <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg divide-y divide-[#1d3b54] max-h-64 overflow-y-auto">
                {costLogs.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 text-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#FFF7E9]">
                        {c.operationDescription}
                      </div>
                      <div className="text-[11px] font-mono text-[#39C8D5]">
                        {c.model} · {c.tokensOrUnitsSummary}
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums shrink-0">
                      <div className="text-[#FFD166] font-bold">
                        US$ {c.recordedCostUsd.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-[#FFF7E9]/60">
                        {new Date(c.timestamp).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#122638] border border-[#1d3b54] rounded-xl p-5 space-y-3">
              <h3 className="text-base font-display font-bold text-[#FFF7E9] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF6B50]" />
                Histórico de Erros e Validações ({errorLogs.length})
              </h3>
              <div className="bg-[#08121b] border border-[#1d3b54] rounded-lg divide-y divide-[#1d3b54] max-h-64 overflow-y-auto">
                {errorLogs.map((err) => (
                  <div key={err.id} className="p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#FF6B50]">
                      <span>{err.module}</span>
                      <span>
                        {new Date(err.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-[#FFF7E9] font-medium">
                      {err.message}
                    </div>
                    {err.technicalDetails && (
                      <div className="text-[11px] text-[#FFF7E9]/65 font-mono">
                        {err.technicalDetails}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
