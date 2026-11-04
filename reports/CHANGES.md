# Mudanças da análise — 2026-11-04

## Primeiro Bugi — novo episódio

Executado: rascunho silencioso substituído por composição Primeiro-Bugi-Ar-Condicionado com WAV real, onze falas, expressões faciais e transições. Evidência: FirstCarDebate.tsx, PilotRoot.tsx, assets/primeiro-bugi e PRIMEIRO-BUGI-EPISODIO.md. Limitação: branch local, sem publicação.

## Debate Ar

Executado: CarDebate.tsx, entrada PilotRoot, assets em public/assets/debate-ar; voz Gemini com dois speakers e animação original 2D. Evidência e limitações: DEBATE-AR-CONDICIONADO.md. Branch codex/ar-condicionado-debate-20261104, sem publicação.

## Short Tempo v1

Executado: nova composição `Bugi-Tempo-51s`, assets de voz/mix/transcrição, cenário e objetos SVG, atuação articulada e legendas. Evidência: `src/remotion/time/TimeShort.tsx`, `public/assets/short-tempo/` e `SHORT-TEMPO-V1.md`. Limitação: branch local, sem publicação ou merge.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: branch codex/cenario-codigo-20261104 a partir de 30e604b; cenário bitmap desativado na composição e preservado em disco, rua SVG, escala 0,78, câmera menor, poste alto visível desde o começo e queda sem prender pés. Evidência e arquivos: PILOTO-ATRITO-V4.md e MP4 v4. Limitação: revisão artística pendente; nenhuma publicação ou merge.

## Primeiro piloto com voz e cenário — 2026-11-04

Executado em codex/piloto-remotion-20261104 a partir de 0a8d781: tooling local Remotion alinhado, composição piloto no código existente, rig canônico com IK/continuidade, áudio Google real e cenário imagegen. Novo entry PilotRoot sem substituir navegação, Firebase ou dados do estúdio. Props opcionais isolam a apresentação nova; modos anteriores preservados. Arquivos: src/remotion/pilot/*, PilotRoot.tsx, composição principal, scripts/prepare-pilot-audio.py, public/assets/pilot-atrito-v1/*, package.json/lock e .gitignore. Export: out/piloto-atrito-v3.mp4. Evidências/logs e rollback em PILOTO-ATRITO-V3.md. Limitação: revisão auditiva e aprovação artística pendentes; timings das legendas estimados; paridade estrutural de composição comprovada, comparação pixel a pixel não executada. Sem push/merge/publicação, alterações locais preexistentes preservadas.

## Pesquisa posterior de Reels

Executado: branch codex/pesquisa-reels-20261104 sobre f35e29d; pesquisa web/navegador, leitura de skills e diagnóstico local. Criados PESQUISA-REELS-CODIGO.md e MODELO-REELS-BUGI.md; complementados relatórios obrigatórios. Nenhuma mudança funcional ou render novo. Evidências/logs na conversa e pesquisa. Limitação: não há inspeção integral de todos os vídeos, nem instalação/validação de FilmCraft. Rollback: reverter somente o commit documental desta pesquisa. Nenhum push, PR remoto ou merge realizado; arquivos preexistentes preservados.

Executado: branch `codex/analise-projeto-20261104` criada a partir de `daf71e1`; auditoria e relatórios. Nenhuma alteração funcional, instalação, chamada paga, push ou merge.

Arquivos: AUDIT.md, RENDER-QA.md, NEXT-STEPS.md, CHANGES.md e complemento de INSTALL-STATUS.md. Build regenerou apenas saída ignorada em dist.

Evidências/logs: saída dos comandos na conversa; medições resumidas em RENDER-QA.md. Alterações locais anteriores preservadas sem inclusão automática no commit.

Rollback: reverter somente o commit de relatórios desta análise. Não usar reset/clean, pois há adições preexistentes não versionadas.

Limitação: PR remoto não aberto; análise mantida local para não publicar dados e arquivos sem revisão.
