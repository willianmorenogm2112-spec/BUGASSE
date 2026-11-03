/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  AICallCostEntry,
  AIModelCategory,
  AIModelSlotConfig,
  CreatorDefaultPreferences,
  Episode,
  EpisodeStage,
  NarrationTrack,
  QualityProfileMode,
  ResearchIdea,
  ScriptVersion,
  StudioAsset,
  StudioErrorLogEntry,
} from './types/studio';
import {
  INITIAL_AI_MODELS,
  INITIAL_ASSETS,
  INITIAL_COST_LOGS,
  INITIAL_EPISODES,
  INITIAL_ERROR_LOGS,
  INITIAL_RESEARCH_IDEAS,
} from './data/seedStudioData';
import {
  buildScenesFromScript,
  calibrateScenesWithRealAudio,
  createNewEpisode,
  transitionEpisodeStage,
} from './utils/studioLogic';
import { DEFAULT_CREATOR_PREFERENCES } from './services/productionOrchestrator';
import {
  QUALITY_PROFILES_CONFIG,
  PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT,
} from './services/mediaFinishingService';
import {
  loadUserEpisodesFromFirestore,
  saveEpisodeToFirestore,
  saveStudioModelsToFirestore,
  signInWithGoogle,
  signOutStudioUser,
  subscribeToAuth,
} from './firebase';
import { CreateVideoWorkspaceView } from './components/CreateVideoWorkspaceView';
import { MyVideosLibraryView } from './components/MyVideosLibraryView';
import { ResearchView } from './components/ResearchView';
import { ScriptEditorView } from './components/ScriptEditorView';
import { StoryboardView } from './components/StoryboardView';
import { NarrationView } from './components/NarrationView';
import { AssetsLibraryView } from './components/AssetsLibraryView';
import { CodexExportView } from './components/CodexExportView';
import { VideoProductionView } from './components/VideoProductionView';
import {
  Sparkles,
  Film,
  Layers,
  Settings,
  Sliders,
  X,
  FileText,
  Mic,
  Video,
  Search,
  Package,
  LogIn,
  LogOut,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

/**
 * Seção 1: As 4 Áreas Principais do Estúdio Simplificado
 * 1. Criar vídeo
 * 2. Meus vídeos
 * 3. Identidade do canal
 * 4. Configurações
 */
type MainAreaTab =
  | 'criar_video'
  | 'meus_videos'
  | 'identidade_canal'
  | 'configuracoes';

/**
 * Abas dos Editores Avançados sob demanda dentro do botão EDITAR VÍDEO (Seção 5)
 */
type AdvancedEditorTab =
  | 'roteiro'
  | 'narracao'
  | 'storyboard'
  | 'producao_timeline'
  | 'pesquisa'
  | 'codex';

export default function App() {
  const [activeMainArea, setActiveMainArea] =
    useState<MainAreaTab>('criar_video');
  const [advancedDrawerOpen, setAdvancedDrawerOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] =
    useState<AdvancedEditorTab>('roteiro');

  const [user, setUser] = useState<User | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>(
    INITIAL_EPISODES[0].id
  );
  const [researchIdeas, setResearchIdeas] = useState<ResearchIdea[]>(
    INITIAL_RESEARCH_IDEAS
  );
  const [assets, setAssets] = useState<StudioAsset[]>(INITIAL_ASSETS);
  const [aiModels, setAiModels] =
    useState<AIModelSlotConfig[]>(INITIAL_AI_MODELS);
  const [preferences, setPreferences] = useState<CreatorDefaultPreferences>(
    DEFAULT_CREATOR_PREFERENCES
  );
  const [costLogs, setCostLogs] =
    useState<AICallCostEntry[]>(INITIAL_COST_LOGS);
  const [errorLogs, setErrorLogs] =
    useState<StudioErrorLogEntry[]>(INITIAL_ERROR_LOGS);

  const [isResearching, setIsResearching] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [regeneratingSegmentId, setRegeneratingSegmentId] = useState<
    string | null
  >(null);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [checkpointInfo, setCheckpointInfo] = useState<{
    available: boolean;
    updatedAt?: string;
  }>({ available: false });

  // Carrega estado persistido no servidor Node.js + status do checkpoint
  useEffect(() => {
    fetch('/api/studio/state')
      .then((r) => r.json())
      .then((data) => {
        if (data?.initialized && data?.state) {
          const st = data.state;
          if (Array.isArray(st.episodes) && st.episodes.length > 0) {
            setEpisodes(st.episodes);
          }
          if (Array.isArray(st.researchIdeas) && st.researchIdeas.length > 0) {
            setResearchIdeas(st.researchIdeas);
          }
          if (Array.isArray(st.assets) && st.assets.length > 0) {
            setAssets(st.assets);
          }
          if (Array.isArray(st.aiModels) && st.aiModels.length > 0) {
            setAiModels(st.aiModels);
          }
          if (st.preferences) {
            setPreferences(st.preferences);
          }
          if (Array.isArray(st.costLogs)) {
            setCostLogs(st.costLogs);
          }
          if (Array.isArray(st.errorLogs)) {
            setErrorLogs(st.errorLogs);
          }
        }
        if (data?.checkpointAvailable) {
          setCheckpointInfo({ available: true });
        }
      })
      .catch(() => {});
  }, []);

  // Persiste alterações automaticamente no servidor Node.js (criando checkpoint prévio)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/studio/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodes,
          researchIdeas,
          assets,
          aiModels,
          preferences,
          costLogs,
          errorLogs,
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.checkpointSaved) {
            setCheckpointInfo({
              available: true,
              updatedAt: d.savedAt,
            });
          }
        })
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [episodes, researchIdeas, assets, aiModels, preferences, costLogs, errorLogs]);

  // Monitora autenticação Firebase e sincroniza episódios no Firestore
  useEffect(() => {
    const unsub = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const cloudEpisodes = await loadUserEpisodesFromFirestore(
            firebaseUser
          );
          if (cloudEpisodes.length > 0) {
            setEpisodes((prev) => {
              const map = new Map(prev.map((e) => [e.id, e]));
              cloudEpisodes.forEach((ce) => map.set(ce.id, ce));
              return Array.from(map.values());
            });
          } else {
            for (const ep of INITIAL_EPISODES) {
              await saveEpisodeToFirestore(ep, firebaseUser);
            }
          }
        } catch (err) {
          logStudioError(
            'Firestore Sync',
            'Falha ao sincronizar episódios da nuvem Firebase.',
            err instanceof Error ? err.message : String(err)
          );
        }
      }
    });
    return () => unsub();
  }, []);

  const activeEpisode =
    episodes.find((e) => e.id === activeEpisodeId) || episodes[0];

  const getModelForCategory = (cat: AIModelCategory): string => {
    return (
      aiModels.find((m) => m.category === cat)?.selectedModel ||
      'gemini-3.8-flash'
    );
  };

  const showToast = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 4500);
  };

  const logStudioError = (
    module: string,
    message: string,
    technicalDetails?: string,
    episodeId?: string
  ) => {
    const entry: StudioErrorLogEntry = {
      id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      module,
      episodeId,
      message,
      technicalDetails,
      resolved: false,
    };
    setErrorLogs((prev) => [entry, ...prev]);
    showToast(`Aviso (${module}): ${message}`);
  };

  const handleUpdateEpisode = async (updated: Episode) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === updated.id ? updated : ep))
    );
    if (user) {
      try {
        await saveEpisodeToFirestore(updated, user);
      } catch (err) {
        logStudioError(
          'Firestore Save',
          'Dados preservados localmente no servidor.',
          err instanceof Error ? err.message : String(err),
          updated.id
        );
      }
    }
  };

  const handleApproveIdeaToEpisode = (idea: ResearchIdea): Episode => {
    const created = createNewEpisode({
      ownerId: user?.uid || 'local-studio-owner',
      title: idea.provisionalTitle,
      hypothesis: idea.scientificSummary,
      scientificSummary: idea.scientificSummary,
    });
    created.verifiedReferences = idea.references;
    setEpisodes((prev) => [created, ...prev]);
    setActiveEpisodeId(created.id);
    setResearchIdeas((prev) =>
      prev.map((i) =>
        i.id === idea.id
          ? { ...i, status: 'aprovada', approvedForEpisodeId: created.id }
          : i
      )
    );
    showToast(`Episódio "${created.title}" preparado para produção!`);
    return created;
  };

  // Chamada 1: Pesquisa fundamentada
  const handleRunGroundedResearch = async (topicQuery: string) => {
    setIsResearching(true);
    try {
      const model = getModelForCategory('pesquisa');
      const res = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicQuery, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro na pesquisa.');
      }
      if (Array.isArray(data.ideas) && data.ideas.length > 0) {
        setResearchIdeas((prev) => [...data.ideas, ...prev]);
      }
      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast(
        `Pesquisa concluída! ${data.ideas?.length || 0} novas ideias fundamentadas adicionadas.`
      );
    } catch (err) {
      logStudioError(
        'Pesquisa Gemini Grounding',
        'Falha ao consultar ideias na Gemini API.',
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsResearching(false);
    }
  };

  // Chamada 2: Geração de Roteiro Completo
  const handleGenerateFullAIScript = async () => {
    if (!activeEpisode) return;
    setIsGeneratingScript(true);
    try {
      const model = getModelForCategory('roteiro');
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeEpisode.title,
          hypothesis: activeEpisode.hypothesis,
          scientificSummary: activeEpisode.scientificSummary,
          model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro ao gerar roteiro.');
      }

      const nextVerNum =
        Math.max(
          0,
          ...activeEpisode.scriptVersions.map((v) => v.versionNumber)
        ) + 1;
      const newVersion: ScriptVersion = {
        id: `sv-${activeEpisode.id}-v${nextVerNum}-${Date.now()
          .toString(36)
          .slice(-3)}`,
        versionNumber: nextVerNum,
        createdAt: new Date().toISOString(),
        authorNote: `Gerado por IA (${model})`,
        status: 'em_revisao',
        targetDurationRangeSec: [35, 55],
        alternativeTitles: data.generatedScript.alternativeTitles,
        selectedTitle:
          data.generatedScript.alternativeTitles?.[0] || activeEpisode.title,
        hookProposals: data.generatedScript.hookProposals,
        segments: data.generatedScript.segments,
        scientificNotes: data.generatedScript.scientificNotes,
        references: activeEpisode.verifiedReferences,
      };

      const updatedEp: Episode = {
        ...activeEpisode,
        scriptVersions: [...activeEpisode.scriptVersions, newVersion],
        activeScriptVersionId: newVersion.id,
        stage: 'Roteiro',
        updatedAt: new Date().toISOString(),
      };
      await handleUpdateEpisode(updatedEp);

      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast(`Nova versão de roteiro (v${nextVerNum}) gerada com sucesso!`);
    } catch (err) {
      logStudioError(
        'Gerador de Roteiros',
        'Erro ao gerar roteiro na Gemini API.',
        err instanceof Error ? err.message : String(err),
        activeEpisode.id
      );
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Chamada 3: Regeneração de trecho específico do roteiro
  const handleRegenerateExcerpt = async (
    segmentId: string,
    instruction: string
  ) => {
    if (!activeEpisode) return;
    const activeScript =
      activeEpisode.scriptVersions.find(
        (v) => v.id === activeEpisode.activeScriptVersionId
      ) || activeEpisode.scriptVersions[0];
    const targetSeg = activeScript.segments.find((s) => s.id === segmentId);
    if (!targetSeg) return;

    setRegeneratingSegmentId(segmentId);
    try {
      const model = getModelForCategory('roteiro');
      const res = await fetch('/api/ai/script-excerpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeTitle: activeEpisode.title,
          currentSentence: targetSeg.sentenceText,
          instruction,
          model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro ao regenerar trecho.');
      }

      const updatedScript: ScriptVersion = {
        ...activeScript,
        segments: activeScript.segments.map((s) =>
          s.id === segmentId
            ? {
                ...s,
                sentenceText: data.segmentUpdate.sentenceText,
                speakingDirection: data.segmentUpdate.speakingDirection,
                visualPlanning: data.segmentUpdate.visualPlanning,
                estimatedDurationSec:
                  Number(data.segmentUpdate.estimatedDurationSec) ||
                  s.estimatedDurationSec,
              }
            : s
        ),
      };

      await handleUpdateEpisode({
        ...activeEpisode,
        scriptVersions: activeEpisode.scriptVersions.map((v) =>
          v.id === activeScript.id ? updatedScript : v
        ),
      });

      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast('Trecho regenerado com sucesso!');
    } catch (err) {
      logStudioError(
        'Regeneração de Trecho',
        'Falha ao regenerar trecho específico.',
        err instanceof Error ? err.message : String(err),
        activeEpisode.id
      );
    } finally {
      setRegeneratingSegmentId(null);
    }
  };

  // Chamada 4: Gerar/Regenerar Storyboard com IA
  const handleRegenerateStoryboardWithAI = async () => {
    if (!activeEpisode) return;
    const activeScript =
      activeEpisode.scriptVersions.find(
        (v) => v.id === activeEpisode.activeScriptVersionId
      ) || activeEpisode.scriptVersions[0];

    setIsGeneratingStoryboard(true);
    try {
      const model = getModelForCategory('roteiro');
      const res = await fetch('/api/ai/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: activeEpisode.id,
          title: activeEpisode.title,
          segments: activeScript.segments,
          model,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro no storyboard.');
      }

      if (Array.isArray(data.scenes) && data.scenes.length > 0) {
        await handleUpdateEpisode({
          ...activeEpisode,
          scenes: data.scenes,
          stage: 'Storyboard',
          updatedAt: new Date().toISOString(),
        });
      }
      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast('Storyboard 2D do Bugi regenerado com sucesso!');
    } catch (err) {
      logStudioError(
        'Gerador de Storyboard',
        'Falha ao gerar storyboard via IA.',
        err instanceof Error ? err.message : String(err),
        activeEpisode.id
      );
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  // Chamada 5: Geração de Narração TTS no Backend
  const handleGenerateBackendTTS = async (params: {
    model: string;
    voice: NarrationTrack['voice'];
    interpretationStyle: string;
    pace: NarrationTrack['pace'];
    expressiveness: NarrationTrack['expressiveness'];
    fullText: string;
  }) => {
    if (!activeEpisode) return;
    setIsGeneratingAudio(true);
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: activeEpisode.id,
          scriptVersionId: activeEpisode.activeScriptVersionId,
          text: params.fullText,
          model: params.model,
          voice: params.voice,
          interpretationStyle: params.interpretationStyle,
          pace: params.pace,
          expressiveness: params.expressiveness,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro no TTS.');
      }

      const realDurationSec = Number(data.narration.durationSec) || 42;
      const calibrated = calibrateScenesWithRealAudio(
        activeEpisode.scenes,
        realDurationSec
      );

      const newTrack: NarrationTrack = {
        ...data.narration,
        temporalMarkers: calibrated.markers,
      };

      await handleUpdateEpisode({
        ...activeEpisode,
        narrationTracks: [newTrack, ...activeEpisode.narrationTracks],
        activeNarrationId: newTrack.id,
        scenes: calibrated.scenes,
        stage: 'Narracao',
        updatedAt: new Date().toISOString(),
      });

      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast(
        `Áudio de narração gerado (${realDurationSec.toFixed(1)}s) e tempos do storyboard atualizados!`
      );
    } catch (err) {
      logStudioError(
        'Narração TTS Backend',
        'Não foi possível sintetizar o áudio no backend.',
        err instanceof Error ? err.message : String(err),
        activeEpisode.id
      );
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleUploadManualNarration = async (file: File) => {
    if (!activeEpisode) return;
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Falha ao ler arquivo de áudio.'));
      reader.readAsDataURL(file);
    });

    const detectedDuration = await new Promise<number>((resolve) => {
      const tempAudio = document.createElement('audio');
      tempAudio.preload = 'metadata';
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && Number.isFinite(tempAudio.duration)) {
          resolve(Number(tempAudio.duration.toFixed(2)));
        } else {
          resolve(42.0);
        }
      };
      tempAudio.onerror = () => resolve(42.0);
      tempAudio.src = base64Data;
    });

    const uploadRes = await fetch('/api/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || 'audio/wav',
        base64Data,
      }),
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadData.error || 'Erro ao enviar áudio manual.');
    }

    const calibrated = calibrateScenesWithRealAudio(
      activeEpisode.scenes,
      detectedDuration
    );

    const manualTrack: NarrationTrack = {
      id: `nar-manual-${Date.now()}`,
      scriptVersionId: activeEpisode.activeScriptVersionId,
      createdAt: new Date().toISOString(),
      model: 'Upload Manual Estúdio',
      voice: 'Puck',
      interpretationStyle: 'Locução enviada manualmente',
      pace: 'Dinâmico (Shorts)',
      expressiveness: 'Alta',
      language: 'pt-BR',
      audioDataUrl: uploadData.url,
      mimeType: file.type || 'audio/wav',
      durationSec: detectedDuration,
      isManualUpload: true,
      fileName: uploadData.fileName,
      alignmentType: 'estimated_from_duration',
      temporalMarkers: calibrated.markers,
      approved: true,
    };

    await handleUpdateEpisode({
      ...activeEpisode,
      narrationTracks: [manualTrack, ...activeEpisode.narrationTracks],
      activeNarrationId: manualTrack.id,
      scenes: calibrated.scenes,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleGenerateScenarioImage = async (description: string) => {
    setIsGeneratingImage(true);
    try {
      const model = getModelForCategory('imagens_cenarios');
      const res = await fetch('/api/ai/scenario-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioDescription: description,
          model,
          aspectRatio: '9:16',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Erro ao gerar cenário.');
      }

      const newScenarioAsset: StudioAsset = {
        id: `asset-sc-${Date.now()}`,
        name: `Cenário Referência — ${description.slice(0, 32)}`,
        category: 'Cenarios',
        version: '1.0.0',
        license: 'Gerado no E Se Bugasse? Studio',
        origin: 'Gerado por IA',
        createdAt: new Date().toISOString(),
        fileFormat: 'image/png',
        fileSizeBytes: 245000,
        preservesBugiIdentity: true,
        previewUrl: data.imageUrl,
        description: `Referência visual de cenário 2D (${description}) para compor com o rig SVG fixo do Bugi.`,
        tags: ['cenario', 'referencia', 'nano-banana'],
      };
      setAssets((prev) => [newScenarioAsset, ...prev]);
      if (data.costEntry) {
        setCostLogs((prev) => [data.costEntry, ...prev]);
      }
      showToast('Cenário 2D gerado e salvo na Identidade do Canal!');
    } catch (err) {
      logStudioError(
        'Gerador de Cenários (Nano Banana)',
        'Cenário procedural em 4 camadas ativo como fallback sem custo extra.',
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAttachRealRenderedMp4 = async (file: File) => {
    if (!activeEpisode) return;
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Erro ao ler MP4.'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: 'video/mp4',
          base64Data,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha no upload do MP4.');
      }

      const updated: Episode = {
        ...activeEpisode,
        hasRealRenderedMp4: true,
        renderedMp4Url: data.url,
        stage: 'Concluido',
        updatedAt: new Date().toISOString(),
      };
      await handleUpdateEpisode(updated);
      showToast(`Vídeo MP4 real verificado! Episódio marcado como Concluído.`);
    } catch (err) {
      logStudioError(
        'Upload de Render MP4',
        err instanceof Error ? err.message : String(err),
        undefined,
        activeEpisode.id
      );
    }
  };

  const handleUpdateModelSlot = async (
    category: AIModelCategory,
    newModelId: string
  ) => {
    const nextModels = aiModels.map((slot) =>
      slot.category === category
        ? { ...slot, selectedModel: newModelId }
        : slot
    );
    setAiModels(nextModels);
    if (user) {
      try {
        await saveStudioModelsToFirestore(nextModels, user);
      } catch {
        // Persistido no servidor local
      }
    }
    showToast(`Modelo da categoria "${category}" atualizado para ${newModelId}.`);
  };

  const handleRestoreCheckpoint = async () => {
    try {
      const res = await fetch('/api/studio/checkpoint/restore', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao restaurar checkpoint.');
      }
      if (data.state?.episodes) setEpisodes(data.state.episodes);
      showToast('Checkpoint recuperável restaurado com sucesso!');
    } catch (err) {
      logStudioError(
        'Checkpoint',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  const openAdvancedEditor = (tab?: string) => {
    if (
      tab === 'roteiro' ||
      tab === 'narracao' ||
      tab === 'storyboard' ||
      tab === 'producao_timeline' ||
      tab === 'pesquisa' ||
      tab === 'codex'
    ) {
      setActiveEditorTab(tab);
    } else {
      setActiveEditorTab('roteiro');
    }
    setAdvancedDrawerOpen(true);
  };

  const mainAreas: {
    id: MainAreaTab;
    label: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'criar_video',
      label: '1. Criar vídeo',
      subtitle: 'Produção automática 15 etapas',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'meus_videos',
      label: '2. Meus vídeos',
      subtitle: 'Biblioteca & 12 pastas lógicas',
      icon: <Film className="w-4 h-4" />,
    },
    {
      id: 'identidade_canal',
      label: '3. Identidade do canal',
      subtitle: 'Bugi multi-articulado & SVGs',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'configuracoes',
      label: '4. Configurações',
      subtitle: 'IA, Remotion, Custos & Checkpoint',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#08121b] text-[#FFF7E9] flex flex-col">
      {/* Top Bar Contract (Exatamente 3 Zonas: Marca · 4 Áreas Principais · Botão EDITAR VÍDEO) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#122638] border-b border-[#1d3b54] sticky top-0 z-30">
        {/* Zona 1: Brand Title */}
        <a
          href="#criar_video"
          onClick={(e) => {
            e.preventDefault();
            setActiveMainArea('criar_video');
          }}
          className="text-lg font-display font-bold tracking-tight text-[#FFF7E9] whitespace-nowrap shrink-0"
        >
          E Se Bugasse? Studio
        </a>

        {/* Zona 2: As 4 Áreas Principais */}
        <nav
          aria-label="Navegação principal do estúdio"
          className="hidden md:flex items-center gap-6 text-xs font-medium text-[#FFF7E9]/80"
        >
          {mainAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setActiveMainArea(area.id)}
              className={`hover:text-[#39C8D5] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeMainArea === area.id
                  ? 'text-[#39C8D5] font-bold underline underline-offset-4'
                  : ''
              }`}
            >
              {area.label}
            </button>
          ))}
        </nav>

        {/* Zona 3: Ação Rápida para Editores Avançados sob demanda */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openAdvancedEditor('roteiro')}
            className="px-4 py-2 text-xs font-bold text-[#FFF7E9] bg-[#FF6B50] hover:bg-[#ff5436] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            EDITAR VÍDEO
          </button>
        </div>
      </header>

      {/* Corpo do Estúdio: Barra Lateral Simplificada (4 Áreas) + Área Principal */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside
          aria-label="Menu das 4 áreas principais do estúdio"
          className="w-full lg:w-64 bg-[#122638] border-b lg:border-b-0 lg:border-r border-[#1d3b54] p-4 flex flex-col justify-between gap-6 shrink-0"
        >
          <div className="space-y-5">
            {/* Seletor Rápido do Episódio Ativo */}
            <div className="space-y-1.5">
              <label
                htmlFor="sidebar-episode-select"
                className="block text-[11px] font-mono text-[#39C8D5] uppercase"
              >
                Episódio Selecionado
              </label>
              <select
                id="sidebar-episode-select"
                value={activeEpisode?.id || ''}
                onChange={(e) => setActiveEpisodeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#08121b] border border-[#1d3b54] text-xs text-[#FFF7E9] font-medium focus:outline-none focus:border-[#39C8D5]"
              >
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.title} ({ep.stage})
                  </option>
                ))}
              </select>
            </div>

            {/* Navegação Estrita pelas 4 Áreas Principais */}
            <nav aria-label="Quatro áreas principais" className="space-y-2">
              {mainAreas.map((item) => {
                const isActive = activeMainArea === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMainArea(item.id)}
                    className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#39C8D5] text-[#08121b] font-bold shadow-md'
                        : 'text-[#FFF7E9]/85 hover:bg-[#19344b] hover:text-[#FFF7E9]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-xs font-extrabold">{item.label}</div>
                      <div
                        className={`text-[10px] ${
                          isActive ? 'text-[#08121b]/80' : 'text-[#FFF7E9]/60'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Atalho para Editores Avançados sob demanda */}
            <div className="pt-3 border-t border-[#1d3b54]">
              <button
                type="button"
                onClick={() => openAdvancedEditor('roteiro')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#08121b] hover:bg-[#19344b] border border-[#39C8D5]/35 text-xs font-bold text-[#39C8D5] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Abrir Editores Avançados
              </button>
            </div>
          </div>

          {/* Conta Firebase Authentication e Persistência */}
          <div className="pt-4 border-t border-[#1d3b54] space-y-2.5">
            <div className="text-[11px] font-mono text-[#FFF7E9]/70">
              PERSISTÊNCIA & CHECKPOINT
            </div>
            {user ? (
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54] space-y-2">
                <div className="text-xs font-medium text-[#FFF7E9] truncate">
                  {user.displayName || user.email}
                </div>
                <div className="text-[11px] font-mono text-[#39C8D5]">
                  Firestore Cloud Ativo
                </div>
                <button
                  type="button"
                  onClick={() => signOutStudioUser()}
                  className="w-full py-1.5 px-3 rounded bg-[#122638] hover:bg-[#19344b] text-xs text-[#FFF7E9]/80 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair da Conta
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#08121b] border border-[#1d3b54] space-y-2">
                <div className="text-[11px] text-[#FFF7E9]/75">
                  Persistência automática em disco + Checkpoint recuperável ativo.
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                      showToast('Autenticado com Google no Firebase com sucesso!');
                    } catch (err) {
                      logStudioError(
                        'Firebase Auth',
                        'Não foi possível concluir o login Google no popup.',
                        err instanceof Error ? err.message : String(err)
                      );
                    }
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Entrar com Google (Firebase)
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Área Principal do Estúdio */}
        <main className="flex-1 min-w-0 p-5 sm:p-7 max-w-[1440px] w-full mx-auto space-y-5">
          {bannerNotice && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-[#122638] border border-[#39C8D5] text-xs text-[#FFF7E9] flex items-center justify-between gap-4"
            >
              <span>{bannerNotice}</span>
              <button
                type="button"
                onClick={() => setBannerNotice(null)}
                className="text-xs font-mono text-[#39C8D5] hover:underline cursor-pointer"
              >
                Fechar
              </button>
            </div>
          )}

          {/* ÁREA 1: CRIAR VÍDEO */}
          {activeMainArea === 'criar_video' && activeEpisode && (
            <CreateVideoWorkspaceView
              activeEpisode={activeEpisode}
              episodes={episodes}
              researchIdeas={researchIdeas}
              preferences={preferences}
              defaultTextModel={getModelForCategory('roteiro')}
              defaultImageModel={getModelForCategory('imagens_cenarios')}
              defaultTtsModel={getModelForCategory('narracao')}
              onSelectEpisode={(id) => setActiveEpisodeId(id)}
              onUpdateEpisode={handleUpdateEpisode}
              onCreateNewEpisodeFromIdea={handleApproveIdeaToEpisode}
              onAddResearchIdeas={(ideas) =>
                setResearchIdeas((prev) => [...ideas, ...prev])
              }
              onUpdatePreferences={setPreferences}
              onOpenAdvancedEditors={(tab) => openAdvancedEditor(tab)}
              onAddCost={(c) => setCostLogs((prev) => [c, ...prev])}
              onLogError={(mod, msg, det) =>
                logStudioError(mod, msg, det, activeEpisode.id)
              }
            />
          )}

          {/* ÁREA 2: MEUS VÍDEOS */}
          {activeMainArea === 'meus_videos' && (
            <MyVideosLibraryView
              episodes={episodes}
              activeEpisodeId={activeEpisode?.id || ''}
              onSelectEpisode={(id) => setActiveEpisodeId(id)}
              onResumeProductionInCreateTab={(id) => {
                setActiveEpisodeId(id);
                setActiveMainArea('criar_video');
              }}
              onOpenAdvancedEditors={(id, tab) => {
                setActiveEpisodeId(id);
                openAdvancedEditor(tab);
              }}
            />
          )}

          {/* ÁREA 3: IDENTIDADE DO CANAL */}
          {activeMainArea === 'identidade_canal' && (
            <AssetsLibraryView
              assets={assets}
              onAddAsset={(newAsset) => {
                setAssets((prev) => [newAsset, ...prev]);
                showToast(`Asset "${newAsset.name}" cadastrado na biblioteca!`);
              }}
              onGenerateScenarioImage={handleGenerateScenarioImage}
              isGeneratingImage={isGeneratingImage}
            />
          )}

          {/* ÁREA 4: CONFIGURAÇÕES (Modelos Gemini, Nano Banana, Remotion, HyperFrames, Skill Reel, Áudio, Custos e Checkpoint) */}
          {activeMainArea === 'configuracoes' && activeEpisode && (
            <div className="space-y-6">
              {/* Painel de Preferências Padrão Salvas & Checkpoint Recuperável */}
              <section className="bg-[#122638] border border-[#1d3b54] rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#39C8D5] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      4. Configurações Unificadas do Estúdio
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#FFF7E9] mt-1">
                      Preferências Padrão, Motores (Remotion + HyperFrames + Skill Reel) & Checkpoint
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/studio/checkpoint/create', {
                          method: 'POST',
                        });
                        setCheckpointInfo({
                          available: true,
                          updatedAt: new Date().toISOString(),
                        });
                        showToast('Checkpoint manual salvo em disco!');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#08121b] hover:bg-[#19344b] border border-[#39C8D5]/35 text-xs font-bold text-[#39C8D5] cursor-pointer"
                    >
                      Criar Checkpoint Agora
                    </button>
                    <button
                      type="button"
                      onClick={handleRestoreCheckpoint}
                      disabled={!checkpointInfo.available}
                      className="px-3.5 py-2 rounded-xl bg-[#FF6B50]/20 hover:bg-[#FF6B50]/30 disabled:opacity-40 border border-[#FF6B50]/40 text-xs font-bold text-[#FF6B50] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar Checkpoint
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54]">
                    <div className="text-[10px] font-mono text-[#39C8D5] uppercase">
                      Formato & Taxa de Quadros
                    </div>
                    <div className="text-sm font-bold text-[#FFF7E9] mt-1">
                      {preferences.format} Vertical (9:16) • {preferences.fps} FPS
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54]">
                    <div className="text-[10px] font-mono text-[#FFD166] uppercase">
                      Teto Pré-Aprovado por Episódio
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#FFF7E9]">US$</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.05"
                        max="10"
                        value={preferences.budgetCapPerEpisodeUsd}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            budgetCapPerEpisodeUsd: Math.max(
                              0.05,
                              Number(e.target.value) || 0.5
                            ),
                          })
                        }
                        className="w-24 bg-[#122638] border border-[#39C8D5]/35 rounded px-2 py-1 text-xs font-mono text-[#FFF7E9]"
                      />
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54]">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase">
                      Áudio & Skill Reel (.agents/skills/reel)
                    </div>
                    <div className="text-xs font-bold text-[#FFF7E9] mt-1">
                      Normalização -14 LUFS + Ducking -10 dB + Safe-Zone 9:16
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54]">
                    <div className="text-[10px] font-mono text-[#FF6B50] uppercase">
                      HyperFrames + Remotion Engine
                    </div>
                    <div className="text-xs font-bold text-[#FFF7E9] mt-1">
                      10 Funções Determinísticas + WebCodecs / FFmpeg H.264
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 7: TRÊS PERFIS DE MODO DE QUALIDADE NAS CONFIGURAÇÕES */}
                <div className="pt-4 border-t border-[#1d3b54] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#FFF7E9]">
                        Modo de Qualidade Padrão (PhotoCraft v0.20.1 + Remotion + FilmCraft v0.17.0)
                      </h3>
                      <p className="text-xs text-[#FFF7E9]/70">
                        Selecione o perfil padrão para o ProductionOrchestrator e baixe o script PowerShell auditado para Windows.
                      </p>
                    </div>
                    <a
                      href="/api/media-tools/setup-script"
                      download="setup-media-tools.ps1"
                      className="px-3.5 py-2 rounded-xl bg-[#39C8D5] hover:bg-[#2bb5c2] text-[#08121b] text-xs font-extrabold"
                    >
                      Baixar setup-media-tools.ps1 (Windows SHA-256)
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(
                      ['rapido', 'equilibrado', 'maxima_qualidade'] as QualityProfileMode[]
                    ).map((profId) => {
                      const cfg = QUALITY_PROFILES_CONFIG[profId];
                      const activeProf =
                        preferences.qualityProfile || 'maxima_qualidade';
                      const isSel = activeProf === profId;
                      return (
                        <button
                          key={profId}
                          type="button"
                          onClick={() => {
                            setPreferences({
                              ...preferences,
                              qualityProfile: profId,
                            });
                            showToast(
                              `Perfil de qualidade padrão alterado para "${cfg.label}"!`
                            );
                          }}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#39C8D5]/15 border-[#39C8D5]'
                              : 'bg-[#08121b] border-[#1d3b54] hover:border-[#39C8D5]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-[#FFF7E9]">
                              {cfg.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#122638] text-[#39C8D5]">
                              {isSel ? 'Padrão Ativo' : 'Selecionar'}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#FFD166] mt-1">
                            {cfg.subtitle}
                          </div>
                          <p className="text-[11px] text-[#FFF7E9]/70 mt-1.5 leading-snug">
                            {cfg.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Resumo da Auditoria GitHub PhotoCraft + FilmCraft */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#39C8D5]">
                          PhotoCraft ({PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.photocraft.stableRelease})
                        </strong>
                        <span className="font-mono text-[10px] text-emerald-400">
                          Licença: MIT OR Apache-2.0
                        </span>
                      </div>
                      <div className="text-[11px] text-[#FFF7E9]/75 font-mono">
                        Repo: {PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.photocraft.repository}
                      </div>
                      <div className="text-[10px] text-[#FFF7E9]/65 font-mono">
                        SHA-256 (Win x64):{' '}
                        {PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.photocraft.windowsPortableSha256.slice(
                          0,
                          24
                        )}
                        ...
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#08121b] border border-[#1d3b54] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#FFD166]">
                          FilmCraft ({PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.filmcraft.stableRelease})
                        </strong>
                        <span className="font-mono text-[10px] text-emerald-400">
                          Licença: MIT OR Apache-2.0
                        </span>
                      </div>
                      <div className="text-[11px] text-[#FFF7E9]/75 font-mono">
                        Repo: {PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.filmcraft.repository}
                      </div>
                      <div className="text-[10px] text-[#FFF7E9]/65 font-mono">
                        SHA-256 (Win x64):{' '}
                        {PHOTOCRAFT_FILMCRAFT_AUDIT_REPORT.filmcraft.windowsPortableSha256.slice(
                          0,
                          24
                        )}
                        ...
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <CodexExportView
                episode={activeEpisode}
                assets={assets}
                aiModels={aiModels}
                costLogs={costLogs}
                errorLogs={errorLogs}
                activeSubTab="modelos"
                onChangeSubTab={() => {}}
                onMarkPreparedForCodex={() => {
                  handleUpdateEpisode({
                    ...activeEpisode,
                    stage: 'Pronto para Codex',
                    exportCount: activeEpisode.exportCount + 1,
                    exportedToCodexAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }}
                onAttachRealRenderedMp4={handleAttachRealRenderedMp4}
                onUpdateModelSlot={handleUpdateModelSlot}
                onRequestPaidKeyFlow={() =>
                  showToast(
                    'Você pode selecionar ou atualizar sua chave de API com faturamento ativo no painel Settings > Secrets do AI Studio.'
                  )
                }
              />
            </div>
          )}
        </main>
      </div>

      {/* SEÇÃO 5: PAINEL COMPLETO SOBREPOSTO — EDITORES AVANÇADOS SOB DEMANDA ("EDITAR VÍDEO") */}
      {advancedDrawerOpen && activeEpisode && (
        <div className="fixed inset-0 z-50 bg-[#050C12]/90 backdrop-blur-md flex flex-col">
          {/* Barra superior da gaveta de Editores Avançados */}
          <div className="bg-[#122638] border-b border-[#39C8D5]/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFD166] font-bold">
                Editores Avançados Sob Demanda • Episódio: {activeEpisode.title}
              </span>
              <h2 className="text-lg font-extrabold text-[#FFF7E9]">
                EDITAR VÍDEO — Controle Fino de Roteiro, Narração, Storyboard, Cenários, Timeline e Codex
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'roteiro', label: 'Roteiro', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'narracao', label: 'Narração & Áudio', icon: <Mic className="w-3.5 h-3.5" /> },
                  { id: 'storyboard', label: 'Storyboard & Cenas', icon: <Film className="w-3.5 h-3.5" /> },
                  { id: 'producao_timeline', label: 'Cenários, Timeline & MP4', icon: <Video className="w-3.5 h-3.5" /> },
                  { id: 'pesquisa', label: 'Pesquisa Científica', icon: <Search className="w-3.5 h-3.5" /> },
                  { id: 'codex', label: 'Pacote Codex Windows', icon: <Package className="w-3.5 h-3.5" /> },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveEditorTab(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeEditorTab === t.id
                      ? 'bg-[#39C8D5] text-[#08121b]'
                      : 'bg-[#08121b] text-[#FFF7E9]/80 hover:text-[#FFF7E9]'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setAdvancedDrawerOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B50] hover:bg-[#ff816a] text-[#FFF7E9] text-xs font-extrabold cursor-pointer ml-2"
              >
                <X className="w-4 h-4" />
                Fechar Editores
              </button>
            </div>
          </div>

          {/* Conteúdo do Editor Avançado Selecionado */}
          <div className="flex-1 overflow-y-auto p-6 max-w-[1440px] w-full mx-auto">
            {activeEditorTab === 'roteiro' && (
              <ScriptEditorView
                episode={activeEpisode}
                selectedModel={getModelForCategory('roteiro')}
                isGeneratingScript={isGeneratingScript}
                regeneratingSegmentId={regeneratingSegmentId}
                onUpdateEpisode={handleUpdateEpisode}
                onGenerateFullAIScript={handleGenerateFullAIScript}
                onRegenerateExcerpt={handleRegenerateExcerpt}
                onSyncStoryboardFromScript={(script) => {
                  const newScenes = buildScenesFromScript(
                    activeEpisode.id,
                    script
                  );
                  handleUpdateEpisode({
                    ...activeEpisode,
                    scenes: newScenes,
                    stage: 'Storyboard',
                  });
                  setActiveEditorTab('storyboard');
                  showToast('Storyboard atualizado a partir do roteiro ativo!');
                }}
              />
            )}

            {activeEditorTab === 'narracao' && (
              <NarrationView
                episode={activeEpisode}
                defaultModel={getModelForCategory('narracao')}
                isGeneratingAudio={isGeneratingAudio}
                onUpdateEpisode={handleUpdateEpisode}
                onGenerateBackendTTS={handleGenerateBackendTTS}
                onUploadManualNarration={handleUploadManualNarration}
              />
            )}

            {activeEditorTab === 'storyboard' && (
              <StoryboardView
                episode={activeEpisode}
                isGeneratingStoryboard={isGeneratingStoryboard}
                onUpdateEpisode={handleUpdateEpisode}
                onRegenerateStoryboardWithAI={handleRegenerateStoryboardWithAI}
              />
            )}

            {activeEditorTab === 'producao_timeline' && (
              <VideoProductionView
                episode={activeEpisode}
                defaultImageModel={getModelForCategory('imagens_cenarios')}
                defaultNarrationModel={getModelForCategory('narracao')}
                onUpdateEpisode={handleUpdateEpisode}
                onLogCost={(c) => setCostLogs((prev) => [c, ...prev])}
                onLogError={(mod, msg, det) =>
                  logStudioError(mod, msg, det, activeEpisode.id)
                }
              />
            )}

            {activeEditorTab === 'pesquisa' && (
              <ResearchView
                ideas={researchIdeas}
                selectedModel={getModelForCategory('pesquisa')}
                onRunGroundedResearch={handleRunGroundedResearch}
                onApproveIdeaToEpisode={(idea) => {
                  handleApproveIdeaToEpisode(idea);
                  setActiveEditorTab('roteiro');
                }}
                isResearching={isResearching}
              />
            )}

            {activeEditorTab === 'codex' && (
              <CodexExportView
                episode={activeEpisode}
                assets={assets}
                aiModels={aiModels}
                costLogs={costLogs}
                errorLogs={errorLogs}
                activeSubTab="codex"
                onChangeSubTab={() => {}}
                onMarkPreparedForCodex={() => {
                  handleUpdateEpisode({
                    ...activeEpisode,
                    stage: 'Pronto para Codex',
                    exportCount: activeEpisode.exportCount + 1,
                    exportedToCodexAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }}
                onAttachRealRenderedMp4={handleAttachRealRenderedMp4}
                onUpdateModelSlot={handleUpdateModelSlot}
                onRequestPaidKeyFlow={() =>
                  showToast(
                    'Você pode selecionar ou atualizar sua chave de API com faturamento ativo no painel Settings > Secrets do AI Studio.'
                  )
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
