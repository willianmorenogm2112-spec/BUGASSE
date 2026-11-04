# Auditoria do projeto — 2026-11-04

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
