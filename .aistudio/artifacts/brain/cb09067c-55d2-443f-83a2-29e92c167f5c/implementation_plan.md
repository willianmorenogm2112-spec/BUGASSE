# E Se Bugasse? Studio — Reorganização Completa, Qualidade Visual & Produção Automática

Transformação do **E Se Bugasse? Studio** em um estúdio audiovisual automático, intuitivo e profissional, consolidando a navegação em **4 áreas principais**, implementando o motor **`ProductionOrchestrator`** (fila persistente de 15 etapas com retomada automática), elevando radicalmente a atuação multi-articulada do **Bugi** e entregando vídeos MP4 reais (`1080 × 1920`, `30 FPS`, `-14 LUFS`) com um único clique em **PRODUZIR VÍDEO COMPLETO**.

---

## Decisões Confirmadas com o Usuário

> [!IMPORTANT]
> As decisões abaixo foram confirmadas na etapa de alinhamento e governam toda a arquitetura desta atualização, preservando integralmente os episódios, narrações, assets, banco de dados Firebase/Firestore e funcionalidades já existentes.

- **Execução do `ProductionOrchestrator`**: **Fila persistente no servidor com retomada automática** — As 15 etapas rodam de forma encadeada e persistida em disco/Firestore com IDs únicos de execução (`runId`), evitando repetir etapas pagas já concluídas e permitindo pausar, cancelar, retomar ou refazer apenas a etapa que falhou.
- **Acesso aos Editores Avançados (`EDITAR VÍDEO`)**: **Painel completo sobreposto (Studio Workspace Drawer) com abas para todos os editores** — Os editores existentes (Roteiro, Narração, Storyboard, Cenários, Personagem, Timeline, Legendagem e Áudio) permanecem 100% preservados e acessíveis sob demanda pelo botão **EDITAR VÍDEO**, sem poluir a tela principal.
- **Governança de Orçamento no Modo Automático**: **Execução direta dentro do teto de custo pré-aprovado** — O orquestrador executa automaticamente as etapas de IA dentro do orçamento configurado pelo usuário, registrando o custo estimado e realizado por etapa e reutilizando assets já aprovados.

---

## 1. Visão Geral & Conceito Central

- **O Que Faz**: Permite que o criador informe apenas o tema (ou descubra ideias fundamentadas via pesquisa), escolha a duração desejada (`8s Piloto` ou `35s–55s Episódio Completo`) e clique em **PRODUZIR VÍDEO COMPLETO**. O sistema pesquisa, escreve o roteiro com gancho forte no 1º segundo, gera a locução PT-BR, extrai os timestamps por palavra, cria os cenários ilustrados em 4 planos, anima o rig multi-articulado do Bugi guiado por `AnimationBeats`, compõe no Remotion e exporta o arquivo MP4 H.264 final com capa, título e descrição prontos para publicação.
- **Preservação e Checkpoint Recuperável**: Antes de qualquer migração de estado, o servidor cria automaticamente um snapshot recuperável (`studio-state.checkpoint.json`) preservando todos os episódios, faixas de áudio, SVGs e configurações existentes.
- **Organização Lógica por Episódio**: Cada episódio passa a organizar seus artefatos e metadados versionados em 12 pastas lógicas (`research`, `script`, `narration`, `storyboard`, `backgrounds`, `characters`, `animation`, `editing`, `audio`, `renders`, `thumbnail`, `publishing`), mantendo os binários pesados de áudio/vídeo no armazenamento persistente do servidor e apenas metadados leves no Firestore.

---

## 2. Experiência do Usuário & Design Visual

### Fluxo Simplificado em 4 Áreas Principais
1. **Criar vídeo (Tela Principal)**:
   - Campos diretos: **Tema ou ideia do vídeo** (com botão de *Descoberta Automática de Temas* via Google Search Grounding), **Duração desejada** (`Piloto 8s` ou `Short 35s–55s`) e seletor **Modo Automático vs. Modo de Revisão de Roteiro**.
   - Resumo silencioso das preferências padrão salvas (Shorts `1080 × 1920`, `30 FPS`, Bugi canônico, animação 2D premium, fundos IA, Gemini TTS, Remotion, música/SFX `-14 LUFS`, legendas dinâmicas, thumbnail e MP4 final).
   - CTA dominante único: **PRODUZIR VÍDEO COMPLETO**.
   - **Painel de Progresso em Tempo Real**: Exibe nome do episódio, miniatura da cena atual, etapa ativa (1 a 15), percentual calculado exclusivamente pelo peso das etapas efetivamente concluídas, tempo decorrido (`tabular-nums`), custos estimados vs. realizados, avisos/erros e prévia interativa, acompanhado dos botões **Pausar**, **Cancelar**, **Retomar**, **Refazer etapa com falha**, **Editar cena / EDITAR VÍDEO**, **Assistir prévia** e **Baixar MP4**.
2. **Meus vídeos**:
   - Biblioteca visual dos episódios em andamento, vídeos finalizados (com MP4 verificado), projetos pausados/interrompidos, histórico de versões e explorador das 12 pastas lógicas do episódio (`research` a `publishing`), com acesso imediato ao player MP4 e ao botão **EDITAR VÍDEO**.
3. **Identidade do canal**:
   - Perfil oficial imutável do **Bugi** (cabelo coral `#FF6B50`, olhos pretos expressivos, jaqueta azul-petróleo `#122638`, camiseta creme `#FFF7E9`, calça escura, tênis claros), inspetor interativo da máquina de estados multi-articulada (`idle`, `walking`, `running`, `anticipation`, `surprise`, `panic`, `sliding`, `falling`, `impact`, `recovery`, `celebrating`), biblioteca de SVGs, cenários em 4 planos e referências visuais aprovadas.
4. **Configurações**:
   - Central única sem duplicações para modelos Gemini, Nano Banana (`gemini-3.1-flash-image` / `gemini-3.1-flash-lite-image`), TTS (`gemini-3.8-flash-tts`), Transcribe (`gemini-3.5-transcribe`), Remotion, HyperFrames (opcional para motion graphics GSAP), Skill Reel, normalização de áudio (`-14 LUFS`), teto de orçamento automático, armazenamento e auditoria de custos/erros.

### Identidade Visual & Direção de Arte
- **Estética**: *Premium 2D Cartoon Motion Design Explainer* no vídeo e *Dark Studio Console* na interface (`60%` fundo escuro profundo `#08121B`, `30%` superfícies estruturais azul-petróleo `#122638` com bordas de `1px` `#1D3B54`, `10%` acentos funcionais em ciano `#39C8D5`, coral `#FF6B50` e amarelo `#FFD166`).
- **Tipografia**: `Bricolage Grotesque` para títulos e cabeçalhos, `Plus Jakarta Sans` para leitura fluida de roteiros e controles, e `JetBrains Mono` (`tabular-nums`) para contadores de quadros, tempos, LUFS e custos.
- **Disciplina Anti-Poluição**: Metadados em texto limpo separado por `·`, cabeçalhos editoriais naturais em português, elevação única de superfície e barra superior enxuta com as 4 áreas principais.

---

## 3. Decisões de Produto & Qualidade de Animação

- **Decisão 1: Fila Persistente de 15 Etapas (`ProductionOrchestrator`) com Idempotência de Custos**
  - *Abordagem*: Cada etapa (`1. Pesquisa` → `2. Roteiro` → `3. Storyboard & Beats` → `4. Narração TTS` → `5. Alinhamento & Timestamps` → `6. Cenários & Objetos IA` → `7. Camadas & Máscaras` → `8. Rig Articulado do Bugi` → `9. Montagem Remotion` → `10. Sincronia de Áudio/SFX/Câmera` → `11. Prévia Interativa` → `12. Controle de Qualidade` → `13. Exportação MP4 Real` → `14. Capa, Título & Descrição` → `15. Persistência Final`) possui estado próprio (`aguardando`, `executando`, `concluída`, `falhou`, `precisa de aprovação`).
  - *Por quê*: Garante que uma falha de rede ou pausa para revisão do roteiro nunca desperdice chamadas de IA já pagas e permita retomar exatamente do ponto em que parou.
- **Decisão 2: Rig Multi-Articulado do Bugi e Direção por `AnimationBeat`**
  - *Abordagem*: Substituição definitiva de membros rígidos por cinemática direta com pivôs independentes para pescoço/cabeça, mechas do cabelo coral (com *follow-through*), ombros, cotovelos, punhos/mãos, quadris, joelhos, tornozelos e tênis (com restrição de solo em `Y = 1370`), compartilhando o mesmo motor matemático entre o Remotion Player e o renderizador MP4.
  - *Por quê*: Garante que o vídeo MP4 final apresente ciclo real de caminhada, antecipação de frenagem, escorregão com giro de braços, acompanhamento horizontal de câmera, parallax em 4 camadas (`background`, `middle-ground`, `foreground`, `interactive-objects`) e compressão elástica (*squash & stretch*) no impacto.

---

## 4. Arquitetura Técnica & Fluxo de Dados

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     INTERFACE DO ESTÚDIO (4 ÁREAS PRINCIPAIS)                │
│  [1. Criar vídeo]   [2. Meus vídeos]   [3. Identidade]   [4. Configurações]  │
└───────────────┬──────────────────────────────────────────────┬───────────────┘
                │ Aciona / Monitora                            │ Abre sob demanda
                ▼                                              ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────┐
│     PAINEL DE PROGRESSO & CONTROLE        │  │   DRAWER "EDITAR VÍDEO"       │
│  • Progresso real (15 etapas), Tempo, US$ │  │  • Roteiro, Narração, Cenas   │
│  • Pausar | Retomar | Refazer | Cancelar  │  │  • Cenários, Bugi, Timeline   │
└───────────────┬───────────────────────────┘  └───────────────┬───────────────┘
                │ REST + Polling de Fila                       │ Atualiza Pasta
                ▼                                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│           SERVIDOR EXPRESS + PRODUCTION ORCHESTRATOR (PERSISTENTE)           │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Fila de 15 Etapas (aguardando | executando | concluída | falhou |      │  │
│  │ precisa_aprovacao) + Checkpoint Recuperável + Controle de Orçamento    │  │
│  └──────┬─────────────────────────┬─────────────────────────┬─────────────┘  │
│         ▼                         ▼                         ▼                │
│  ┌─────────────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │ Google GenAI SDK    │   │ Motor de Animação   │   │ Renderizador MP4   │  │
│  │ • Search Grounding  │   │ • 10 Funções Remot. │   │ • WebCodecs /      │  │
│  │ • Roteiro & TTS     │   │ • AnimationBeats    │   │   FFmpeg H.264+AAC │  │
│  │ • Transcribe & Vis. │   │ • Rig Multi-Juntas  │   │ • Folha Quadros    │  │
│  │ • Nano Banana 9:16  │   │ • 4 Camadas Cenário │   │   0,5s & QA Real   │  │
│  └─────────────────────┘   └─────────────────────┘   └────────────────────┘  │
└───────────────┬──────────────────────────────────────────────┬───────────────┘
                ▼                                              ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────┐
│ PASTAS LÓGICAS DO EPISÓDIO (DISCO/MEDIA)  │  │ FIREBASE AUTH & FIRESTORE     │
│ research | script | narration | storyboard│  │ Metadados leves do episódio,  │
│ backgrounds | characters | animation |    │  │ estados da fila e configurações│
│ editing | audio | renders | thumbnail |   │  │ sincronizados por usuário     │
│ publishing                                │  │                               │
└───────────────────────────────────────────┘  └───────────────────────────────┘
```

### Mapeamento de Estado e Componentes Interativos
- **Descoberta e Criação (`Criar vídeo`)**: O usuário digita um tema (ou seleciona uma sugestão pesquisada), define a duração (`8s Piloto` ou `35s–55s Completo`), escolhe `Modo Automático` ou `Modo de Revisão` e clica em **PRODUZIR VÍDEO COMPLETO**. As preferências ficam salvas automaticamente.
- **Execução e Retomada (`ProductionOrchestrator`)**:
  - No **Modo de Revisão**, o orquestrador executa as Etapas 1 e 2, muda a Etapa 2 para `precisa de aprovação` e aguarda o clique do usuário em *Aprovar Roteiro e Continuar* (ou edição no drawer **EDITAR VÍDEO**) antes de prosseguir automaticamente da Etapa 3 à 15.
  - No **Modo Automático**, executa da Etapa 1 à 15 sem interrupções dentro do orçamento aprovado, gerando o MP4 real, a Folha de Quadros a cada `0,5s`, a análise de controle de qualidade e o pacote de publicação (`thumbnail`, título e descrição).
