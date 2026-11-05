# Relatório de Instalação e Ambiente — E Se Bugasse? (Fase 0)

## Casal Bugi v2

Sem nova instalação ou geração paga. Personagem SVG original, Remotion e assets existentes. Arquivos, evidência e limites: CASAL-BUGI-V2.md.

## Primeiro Bugi — nova voz real

Executado: geração completa no AI Studio com Kore/Puck, download 52,44s, transcrição local e lint. Nenhuma instalação adicional. Evidência, arquivos e limitações: PRIMEIRO-BUGI-EPISODIO.md. Sem custo cobrado conhecido.

## Debate Ar

Executado sem novas instalações: Gemini TTS pela UI, transcrição local, Remotion. Evidência/arquivos: DEBATE-AR-CONDICIONADO.md. Limite: custos não medidos.

## Short Tempo v1

Executado sem nova instalação. Remotion, FFmpeg, Chrome e transcrição local existentes produziram o vídeo. Evidência: lint/build, MP4 e `SHORT-TEMPO-V1.md`. Limitação: nenhuma revisão de dependências foi feita nesta etapa.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: nenhuma instalação adicional na revisão v4. Evidência: render com as dependências Remotion existentes; lint e testes passaram. Arquivos: package.json/lock inalterados nesta revisão. Limitação: auditoria de dependências anterior continua aplicável.

## Preparação do primeiro piloto — 2026-11-04

Executado: instalados localmente @remotion/cli e @remotion/renderer em 4.0.540. Instalação inicial encontrou conflito Vite 8.3.5/esbuild 0.25; esbuild foi ajustado apenas para 0.28.2, compatível com o peer declarado. package.json e lock anteriores copiados para .git/bugasse-backups/piloto-20261104. Nada global. npm ls confirmou alinhamento 4.0.540. Chrome local renderizou 375 frames com concurrency=1; memória livre rechecagem ~1,8 GB. Lint, 17 testes originais, 3 novos e build passaram. Evidência: PILOTO-ATRITO-V3.md e logs locais QA. npm audit detectou quatro entradas high associadas a Firebase/grpc; não aplicado upgrade/downgrade destrutivo fora do escopo. FilmCraft/PhotoCraft não usados; TTS veio do site por instrução do usuário, sem chave exposta. Nenhuma assinatura ativada e custos cobrados não informados pelos geradores.

## Rechecagem em 2026-11-04

### Complemento: pesquisa de Reels

Executado: leitura das skills existentes (upstream e adaptação Bugi); `npx --offline hyperframes@0.9.9 --version`, `doctor --json`, `catalog` e `usage --json`; `npm ls` Remotion; detector upstream Skill Reel inspecionado e executado. HyperFrames respondeu em 0.9.9, core/registry/CLI/media-use presentes; nenhuma reinstalação de skill necessária. Remotion/player/web-renderer em 4.0.540. CLI usa cache npm, sem instalação global ou mudança no package.json.

Evidência: saídas na conversa e PESQUISA-REELS-CODIGO.md. Doctor reportou ok=false: aproximadamente 0,4 GB de RAM livre, Whisper e Docker ausentes; Node, Chrome, FFmpeg/ffprobe presentes. Detector de Skill Reel apresentou falso positivo para Whisper ao aceitar system32/main.CPL; verificação independente confirmou whisper-cli/whisper-cpp ausentes e modelo não encontrado. FilmCraft/PhotoCraft não encontrados no PATH; acesso aos repositórios é leitura, não prova de execução. Render, serviços pagos e template Pro não exercitados. Nenhum modelo pesado ou editor baixado nesta etapa.

Executado sem instalação: Node v24.14.1; npm 11.11.0; npm ls confirmou remotion, @remotion/player e @remotion/web-renderer em 4.0.540. FFmpeg/ffprobe executaram inspeção real de mídia. Lint, 17 testes e build passaram. Evidências: saída da análise e reports/RENDER-QA.md. Arquivos: package.json/lock local e mídia existente. Limitação: PhotoCraft/FilmCraft e serviços pagos não revalidados; chaves não exibidas. Informações abaixo são histórico de 2026-11-03, não nova comprovação.

**Data de Execução:** 2026-11-03 22:00 (UTC-3)  
**Branch de Trabalho:** `codex/qualidade-video-20261103`  
**Base Commit:** `40db2b970e7b8666082c5a63450fd8afcf776725`  
**Repositório Remoto:** `https://github.com/willianmorenogm2112-spec/BUGASSE.git`

---

## 1. Ambiente do Sistema Operacional e Hardware

| Componente | Detalhe Detectado |
|---|---|
| **Sistema Operacional** | Microsoft Windows 11 Pro (10.0.26200) |
| **Processador (CPU)** | Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz (6 núcleos / 12 threads) |
| **Memória RAM Total** | 15.88 GB |
| **Memória RAM Disponível** | ~1.9 GB |
| **Navegador Chrome** | Versão 156.0.8078.80 (disponível em `Program Files\Google\Chrome\Application\chrome.exe`) |

---

## 2. Ferramentas e CLI Nativos

| Ferramenta | Versão / Caminho | Status |
|---|---|---|
| **Node.js** | `v24.14.1` (Requisito >= 22 atendido) | ✅ Presente |
| **npm** | `11.11.0` | ✅ Presente |
| **Git** | `2.53.0.windows.2` | ✅ Presente |
| **FFmpeg** | `9.0-full_build-www.gyan.dev` | ✅ Presente |
| **FFprobe** | `9.0-full_build-www.gyan.dev` | ✅ Presente |
| **PhotoCraft CLI** | Opcional (não instalado no host local; fallback seguro ativo) | ℹ️ Fallback ativo |
| **FilmCraft CLI** | Opcional (não instalado no host local; fallback seguro ativo) | ℹ️ Fallback ativo |

---

## 3. Skills e Bibliotecas Registradas

| Módulo / Skill | Origem / Versão | Status |
|---|---|---|
| **Skill Reel Upstream** | `https://github.com/Felpborges/skill-reel.git` (`commit b9c1222`) | ✅ Clonado em `.agents/skills/reel-upstream` |
| **Remotion Skills** | `remotion-dev/skills` (13 skills oficiais instaladas) | ✅ Ativas |
| **HyperFrames Skills** | `heygen-com/hyperframes` (9 skills oficiais instaladas) | ✅ Ativas |
| **Skills Bugasse** | `e-se-bugasse-producao`, `remotion-qualidade`, `photocraft`, `filmcraft`, `skill-reel-adaptacao` | ✅ Preservadas |

---

## 4. Credenciais e Variáveis de Ambiente

- **`GEMINI_API_KEY`**: Não encontrada no ambiente local no momento desta checagem (será injetada pelo usuário/AI Studio ou via arquivo `.env`).
- **`APP_URL`**: Não configurado no ambiente local.
- **Segurança de Segredos**: Nenhuma chave privada ou credencial foi logada ou exposta.

---

## 5. Validação de Build e Testes (Baseline)

- **`npm run lint` (`tsc --noEmit`)**:
  - Ajustado `tsconfig.json` para incluir `src/**/*`, `server.ts` e excluir pastas auxiliares de skills (`agent`, `data`, `.agents`, `codex-kit`).
  - **Resultado**: ✅ PASSOU com 0 erros.
- **`npm test` (`tsx --test src/utils/studioLogic.test.ts`)**:
  - Ajustada a verificação dos binários de Craft para considerar detecção do sistema operacional e presença opcional.
  - **Resultado**: ✅ 17 testes passaram (0 falhas).
- **`npm run build` (`vite build`)**:
  - **Resultado**: ✅ PASSOU (bundle de produção gerado em 2.74s na pasta `dist/`).

## Pesquisa e instalações de animação — 04/11/2026
Executado: instalação local de skills e auditoria de ferramentas em branch isolada. Evidências, arquivos, logs resumidos, limitações e rollback: `reports/ANIMACAO-FERRAMENTAS-20261104.md`. Fluxo: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`. Nenhum render novo foi produzido.


## Episódio Sol — 04/11/2026
Executado: voz Puck no Gemini TTS, alinhamento acústico WhisperX e composição SVG Remotion. Evidências e limitações: reports/SOL-DESAPARECEU.md. Arquivos: src/remotion/sun/SunShort.tsx, public/assets/sol, scripts/align_sun.py. QA visual e sonoro humano pendente; não publicado.

## Correção de atuação do Bugi — 05/11/2026
Executado: controlador de atuação por beat e teste automatizado local, sem novas instalações. Evidência: `src/remotion/sun/sunBugiMotion.ts` e `npm run test:sun-motion` (4/4). Limitação: as skills orientam o trabalho, mas não são executáveis automáticos; ferramentas externas opcionais não foram necessárias para esta correção Remotion.

## Piloto de edição por narração — 05/11/2026
Executado: composição isolada EditingPilot (12 s), reutilizando Puck real, alinhamento existente e SFX procedurais locais. Termômetro/calor, apontar, confirmação, marcador de segundo e feixe luminoso acompanham os trechos da voz. Arquivos: src/remotion/sun/EditingPilot.tsx e src/remotion/EditingPilotRoot.tsx. Lint passou; v1 H.264/AAC 1080×1920, 12,011 s, 1.733.420 bytes e decode integral sem erros. Folha out/edicao-contato.jpg inspecionada; fonte SVG corrigida em v2. Limitação: sem escuta contínua certificada, sem nova arte de cenário, sem aprovação artística final; este experimento não equivale ao acabamento da referência. Vídeos agendados preservados. Próximo: revisar ritmo/atuação e cenário. Rollback: reverter apenas o commit deste piloto.

