# E Se Bugasse? Studio

Sistema completo de produção audiovisual com inteligência artificial para o canal brasileiro de YouTube Shorts, TikTok e Facebook Reels **E Se Bugasse?**, protagonizado pelo personagem fixo **Bugi**.

- **Tema central**: *"E se uma regra ou condição física do mundo mudasse por alguns segundos?"*
- **Slogan**: *"Muda uma regra. Começa o caos."*

Para planejar e revisar animação, personagens, gráficos e legendas, siga o [workflow visual e de skills](docs/WORKFLOW-ANIMACAO-E-SKILLS.md). O status das ferramentas e suas limitações estão no [relatório de instalação](reports/ANIMACAO-FERRAMENTAS-20261104.md).

---

## 1. Arquitetura do Sistema

- **Frontend (`src/`)**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons.
  - `src/types/studio.ts`: Schemas TypeScript oficiais (`episode.json`, `script.json`, `storyboard.json`, `render-config.json`, `animation-instructions.json`, `subtitles-instructions.json`).
  - `src/utils/studioLogic.ts`: Lógica pura de criação de episódios, validação de ganchos, cálculo e calibração de tempos de cenas pelo áudio real, empacotamento Codex/Remotion e sanitização para o Firestore.
  - `src/utils/studioLogic.test.ts`: Suíte de 13 testes unitários automatizados (`node:test`).
  - `src/utils/sceneGeometryEngine.ts`: Motor geométrico `SceneGeometryEngine` com canvas lógico fixo `1080 × 1920`, coordenadas normalizadas (`0..1`), 8 camadas ordenadas de profundidade, extração de contornos poligonais, suporte opcional a máscara SAM 2 e resolução simplificada de colisão/apoio no solo.
  - `src/utils/skillReelAndHyperFrames.ts`: Alinhamento palavra a palavra (`@remotion/captions`), normalização de áudio em `-14 LUFS` com ducking automático (`-10 dB`), gerador determinístico de composições HTML + GSAP para HyperFrames (`window.__timelines`) e auditoria visual (Folha de Quadros + 11 verificações).
  - `src/components/BugiCharacterSvg.tsx`: Rig vetorial 2D articulado do **Bugi** (pivôs independentes para cabeça, olhos, boca, braços, pernas e tronco) com 12 movimentos físicos (`caminhando`, `correndo`, `pulando`, `caindo`, `escorregando`, `olhando_objeto`, `assustando`, `comemorando`, `equilibrando`, `apontando`, `agachando`, `reagindo_impacto`), squash & stretch, antecipação e inércia.
  - `src/remotion/`: Arquitetura modular Remotion (`compositions/`, `scenes/`, `characters/`, `backgrounds/`, `effects/`, `captions/`, `transitions/`, `audio/`, `render/mp4RenderEngine.ts`).
  - `src/components/VideoProductionView.tsx`: Módulo **Produção de Vídeo** com `@remotion/player`, geração de cenários com IA (`gemini-3.1-flash-image`), regeneração individual por cena, renderização real de MP4 H.264 + AAC (WebCodecs com fallback FFmpeg no servidor), player `<video controls>`, download e histórico de versões.
- **Backend (`server.ts`)**: Node.js + Express + `@google/genai` SDK oficial + `/usr/bin/ffmpeg`.
  - Mantém `GEMINI_API_KEY` exclusivamente no servidor.
  - Endpoints `/api/ai/generate-image`, `/api/ai/generate-tts`, `/api/ai/align-narration`, `/api/video/render-mp4` e `/api/skills/reel-status`.

---

## 2. Comandos de Desenvolvimento e Testes

```bash
# Instalar dependências
npm install

# Executar as 13 suítes de testes unitários
npx tsx --test src/utils/studioLogic.test.ts

# Iniciar servidor de desenvolvimento full-stack (Express + Vite na porta 3000)
npm run dev

# Verificar tipagem TypeScript e build de produção
npm run lint
npm run build
```

---

## 3. Instalação da Skill Reel e HyperFrames no Windows (Codex)

1. **Skill Reel (`.agents/skills/reel`)**:
   - Os arquivos auditados (`SKILL.md`, `ESTILO.md`, `regras-da-casa.md`, `modelo/README.md`) já estão instalados em `.agents/skills/reel/` com proteção explícita que desativa rotinas de reconhecimento facial humano sobre o rig 2D do Bugi.
   - No Windows PowerShell, execute:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\.agents\skills\reel\install-skill-reel-windows.ps1
     ```

2. **HyperFrames (`https://github.com/heygen-com/hyperframes`)**:
   - Integrado como gerador opcional de motion graphics e infográficos determinísticos em HTML + GSAP (`window.__timelines[compositionId]`).
   - Os arquivos `hyperframes/*.html` são exportados dentro do pacote ZIP da aba **Codex & Remotion** para pré-renderização opcional como asset de vídeo sem executar dois motores concorrentes simultaneamente.

