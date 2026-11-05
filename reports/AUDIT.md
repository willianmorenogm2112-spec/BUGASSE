# Auditoria do projeto — 2026-11-04

## Casal Bugi v2

Corrigida causa visual da boca fixa: mouthShape smile/grin/determined não usa abertura variável. Durante fala, seleciona open_o. Evidência: FirstCarDebate.tsx. Limitação: aproximação por palavras, sem visemas fonéticos. Nova passageira original; ver CASAL-BUGI-V2.md.

## Primeiro Bugi — novo episódio

Executado: voz real integral e animação do Bugi oficial em composição isolada; sem mudança de Firebase/API. Evidência e arquivos em PRIMEIRO-BUGI-EPISODIO.md. Limitação: movimento de boca por palavras e tempos ASR estimados; sem aprovação artística automática.

## Debate Ar

Executado: composição isolada com dois personagens próprios; sem mudanças de Firebase/APIs. Evidência e arquivos em DEBATE-AR-CONDICIONADO.md. Limite: não resolve achados anteriores do app.

## Short Tempo v1

Executado: implementação isolada em composição Remotion, sem alteração de Firebase, APIs ou navegação. Evidência: `src/remotion/time/TimeShort.tsx` e manifesto de assets. Limitação: não resolve achados anteriores do aplicativo; QA artístico permanece humano.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: corrigidos enquadramento e integração espacial no piloto v4; poste visível desde o primeiro quadro e fundo SVG. Evidência: contato-v4.png e PILOTO-ATRITO-V4.md. Arquivos: FrictionPilot.tsx, motion.ts, PilotRoot.tsx. Limitação: isto não resolve os problemas prévios de segurança e orquestração do app.

## Caminho validado para o primeiro piloto

Executado: caminho Node/Chromium renderizou ESeBugasseVideoComposition registrada em PilotRoot, sem usar scripts/render_pilot_v2.ts. Assets atuais têm manifesto e hashes. Testes de determinismo fora de ordem e contatos da mão/pé passaram. Evidências: PILOTO-ATRITO-V3.md, src/remotion/pilot/motion.test.ts e qa/pilot-atrito-v1/render-v3.log. Limitação: essa entrega isola o piloto; não resolve autenticação Express, custos do orquestrador, worker persistente ou todos os modos de export do app. Não declarar esses achados anteriores corrigidos. npm audit apontou quatro entradas high relacionadas a Firebase/grpc; preservar atualização de segurança como tarefa própria.

## Complemento: pesquisa de Reels e ferramentas

Executado: comparação de exemplos com evidência de código/edição, catálogo HyperFrames e scripts de diagnóstico. Arquivos: PESQUISA-REELS-CODIGO.md e MODELO-REELS-BUGI.md. Logs na conversa. Novo achado: .agents/skills/reel-upstream/corte/scripts/0-checar.py aceita shutil.which('main'), que neste Windows retorna system32/main.CPL e gera falso positivo para Whisper. CLI Whisper/modelo não estão prontos. A adaptação local da Skill Reel também descreve mixagem e fallback que não correspondem integralmente à implementação atual; presença da skill não comprova essas funcionalidades. Nenhuma correção funcional aplicada nesta etapa de pesquisa.

Base: `daf71e1`, branch de análise `codex/analise-projeto-20261104`. Escopo: análise local; nenhuma correção funcional ou chamada paga. Adições locais preexistentes preservadas.

| Prioridade | Constatação | Evidência | Limitação / consequência |
|---|---|---|---|
| P1 | Backend sem autenticação e sem isolamento por usuário | `server.ts:59-214`, bind `0.0.0.0` ao final; leitura, gravação e restauração globais | Revisão estática; qualquer cliente que alcance a API pode acessar essas rotas. Regras Firestore não protegem Express. |
| P1 | Piloto v2 usa implementação visual separada | `scripts/render_pilot_v2.ts:20,295-356`: HTML próprio, screenshots Chrome, FFmpeg; Player usa `ESeBugasseVideoComposition` | Arquivo tem formato correto, mas não comprova render Remotion nem paridade. |
| P1 | Etapas declaram artefatos sem execução correspondente | `src/components/CreateVideoWorkspaceView.tsx:590-654`: camadas validadas, SFX e capturas anunciados por retornos textuais | Conclusão das etapas não depende de arquivos verificados. `EpisodeAudioController.tsx` reproduz apenas narração. |
| P1 | Custos estimados registrados como realizados; teto sem bloqueio no executor | `server.ts:384-385` e equivalentes; workspace `:657-667,737-743,895-906`; budget apenas copiado para job | Valores fixos locais também viram custos. Não há confirmação de cobrança pelo provedor. |
| P1 | Finalização pode escolher vídeo de outro episódio | `server.ts:1754-1760` escolhe último nome de MP4 se entrada ausente/inválida | Risco de associar arquivo errado; deve falhar explicitamente. |
| P2 | Retomada não é worker persistente e cache não valida entradas | Loop no componente workspace; sync apenas grava JSON (`server.ts:185`); `createInitialOrchestratorJob` reaproveita etapa paga por status | Fechar aba interrompe executor; mudanças de roteiro/modelo não invalidam cache por hash. Fundos parciais podem ser gerados novamente após falha. |
| P2 | Fallback atribui PhotoCraft mesmo quando CLI falha | `server.ts:990-1060`: copia PNG FFmpeg no catch, responde modelo PhotoCraft e sucesso | Orquestrador rejeita fonte diferente de Gemini, mas metadados da rota continuam enganosos. |
| P2 | Cena isolada reinicia áudio do episódio | Composição redefine startTimeSec=0 e usa AudioController sem trim | Cena posterior pode tocar início da narração; duração mínima diverge entre composição (2s) e export (1s). |
| P2 | Validação de MP4 é incompleta | `server.ts:1265-1306`: resolução, streams, duração e FPS | Não verifica codecs, fala real, silêncio, integridade completa nem proveniência Remotion; engine é atribuído. |
| P2 | Reprodutibilidade incompleta | `package-lock.json` e mídias recentes não versionados; scripts fora do include TypeScript; bundle principal 2,53 MB | Não incluir automaticamente arquivos preexistentes em commit. |

Verificações executadas: `npm run lint` passou; `npm test` 17/17; `npm run build` passou com avisos de chunks e import dinâmico ineficaz. Testes cobrem utilitários/contratos, sem provar execução ponta a ponta de produção e render.

Pontos positivos: Player e exportador web referenciam a mesma composição; export bloqueia fundos sem `gemini_ai`; alinhamento estimado identificado; QA artístico não é aprovado pelo exportador; pacotes Remotion principais instalados em 4.0.540; regras Firestore exigem proprietário.

Referência adicional solicitada: https://www.youtube.com/shorts/Yrg0pZ5jbRg . Consulta web falhou; inspeção visual pelo navegador iniciada. Não há evidência sobre software/processo original apenas pelo vídeo final.

## Pesquisa e instalações de animação — 04/11/2026
Executado: instalação local de skills e auditoria de ferramentas em branch isolada. Evidências, arquivos, logs resumidos, limitações e rollback: `reports/ANIMACAO-FERRAMENTAS-20261104.md`. Fluxo: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`. Nenhum render novo foi produzido.


## Episódio Sol — 04/11/2026
Executado: voz Puck no Gemini TTS, alinhamento acústico WhisperX e composição SVG Remotion. Evidências e limitações: reports/SOL-DESAPARECEU.md. Arquivos: src/remotion/sun/SunShort.tsx, public/assets/sol, scripts/align_sun.py. QA visual e sonoro humano pendente; não publicado.

## Auditoria de movimento do episódio Sol — 05/11/2026
Executado: removidos `rootY=0`, pulo indevido na explicação da gravidade, susto repetido em todas as cenas noturnas, tremor rápido e caminhos de braço ignorados pelo renderer. A causa era a mistura do espaço local do rig com transform externo e presets cíclicos globais. Evidência: `sunBugiMotion.ts`, testes 4/4 e quadros `out/qa-sol-motion-*.png`. Limitação: inspeção foi por sequência amostrada; aprovação artística final continua com o usuário.

## Piloto de edição por narração — 05/11/2026
Executado: composição isolada EditingPilot (12 s), reutilizando Puck real, alinhamento existente e SFX procedurais locais. Termômetro/calor, apontar, confirmação, marcador de segundo e feixe luminoso acompanham os trechos da voz. Arquivos: src/remotion/sun/EditingPilot.tsx e src/remotion/EditingPilotRoot.tsx. Lint passou; v1 H.264/AAC 1080×1920, 12,011 s, 1.733.420 bytes e decode integral sem erros. Folha out/edicao-contato.jpg inspecionada; fonte SVG corrigida em v2. Limitação: sem escuta contínua certificada, sem nova arte de cenário, sem aprovação artística final; este experimento não equivale ao acabamento da referência. Vídeos agendados preservados. Próximo: revisar ritmo/atuação e cenário. Rollback: reverter apenas o commit deste piloto.

## Vídeo Tempo parado — 05/11/2026
Executado: diálogo de 18 turnos com Gemini TTS real (Puck/Charon), alinhamento acústico WhisperX, cenário SVG, diagramas, balões por speaker, envelope de boca e SFX originais. Evidências e limites: reports/TEMPO-INTERACAO.md; composição TimeDialogueRoot.tsx; assets public/assets/tempo-interacao. Lint/build e quatro testes de movimento passaram. Montagem 94,553 s; export 94,833 s, H.264/AAC 1080×1920/30. Primeira exportação decodificada sem erros; mix -16,5 LUFS, pico -1,9 dBTP. Revisão visual amostrada detectou sobreposição de personagem em café/contrato, corrigida em v2. Limitação: escuta humana integral e aprovação artística pendentes. Sem publicação. Rollback: reverter os commits desta branch, sem apagar mídias anteriores.

## Auditoria do kit Bugi 3D — 05/11/2026

- Origem: `kit-video-3d WillianIA.zip`, SHA-256 `80F7514D495AFC60A593D8381AA2C85799CEBD98B9ABE6E754305AF2145555CC`.
- Dependências declaradas: Three.js e Puppeteer Core. Nenhum script npm de instalação declarado; instalação feita com `--ignore-scripts`.
- Superfícies sensíveis: subprocessos FFmpeg/ffprobe/Chrome, downloads opcionais do Kokoro e chamadas opcionais ElevenLabs. Downloads/serviços de voz não executados.
- O render do pacote captura frames do player Three.js e monta MP4 com FFmpeg. Ele foi classificado como diagnóstico/protótipo; não satisfaz sozinho o contrato de Remotion principal.
- O arquivo não declara licença. Registro em `bugi-3d/PROVENANCE.json`; revisar direitos antes de merge em repositório público.
- Instruções internas foram arquivadas como referência e não instaladas como `AGENTS.md` ativo.
- O primeiro render diagnóstico revelou falha em `engine/fluxos.js`: material com modo `caminho` e apenas origem/destino acessava uma lista nula. Corrigido com fallback determinístico para `jato`/`sobe`; check completo e render de quadros passaram após a correção.

## Auditoria de cobertura das skills 3D — 05/11/2026

- 52 nomes únicos foram detectados entre o worktree, a raiz compartilhada e o clone BUGASSE; após criar cinco variantes, 57/57 estão classificados em `skill-coverage.json`.
- Skills neutras não foram copiadas: recebem um contrato 3D comum para evitar forks divergentes.
- Variantes específicas: produção, Remotion QA, Skill Reel, PhotoCraft e FilmCraft.
- A Skill Reel local tinha `version` fora do schema aceito; movido para `metadata.version`.
- Limite: cobertura documental/roteamento não comprova que cada ferramenta opcional foi executada. PhotoCraft, FilmCraft, After Effects, Figma e HyperFrames continuam condicionais à disponibilidade e ganho real.

