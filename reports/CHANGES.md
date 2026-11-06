# Mudanças da análise — 2026-11-04

## Raio no carro — voz recuperada

Nova aba do AI Studio resolveu a geração: Charon/Puck reais baixados, alinhamento acústico WhisperX de 13 turnos/198 palavras e duração 71,774 s. Mix e composição final Remotion com technical=false. Evidências/proveniência e limites em `reports/RAIO-CARRO-2D.md`. Lint passou. Aprovação artística/escuta integral ainda pendentes; sem publicação. Rollback: reverter commits desta retomada, preservando prévia técnica.

## Raio no carro — Bugi 2D

Pesquisa NWS/CDC/Met Office, roteiro e cena SVG Remotion implementados. Evidências e arquivos: `reports/RAIO-CARRO-2D.md`. Gemini TTS bloqueado com HTTP 403 observado na prévia do AI Studio; nenhum WAV real gerado. Prévia técnica sem áudio, tempos explicitamente estimados. Lint e 17 testes passaram. Próximo: restabelecer acesso TTS, gerar Charon/Puck, alinhar e exportar final. Rollback: reverter commits da branch codex/bugi-2d-raio-carro-20261105.

## Bugi formiga 3D — 05/11/2026

Execução e evidências em `reports/BUGI-FORMIGA-3D.md`. Roteiro pesquisado, Gemini TTS Charon/Puck real, alinhamento acústico (16 turnos, 213 palavras, 77,437 s), storyboard 22 planos e composição Remotion Ant3DRoot. Limitações artísticas registradas; sem publicação automática. Rollback por reversão dos commits desta branch.

## Casal Bugi v2

Executado: nova passageira em BugiCompanion.tsx e boca do Bugi animada durante fala. Evidência, arquivos e limites em CASAL-BUGI-V2.md. Escala compartilhada, roteiro e áudio preservados; revisão humana pendente.

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

## Pesquisa e instalações de animação — 04/11/2026
Executado: instalação local de skills e auditoria de ferramentas em branch isolada. Evidências, arquivos, logs resumidos, limitações e rollback: `reports/ANIMACAO-FERRAMENTAS-20261104.md`. Fluxo: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`. Nenhum render novo foi produzido.


## Episódio Sol — 04/11/2026
Executado: voz Puck no Gemini TTS, alinhamento acústico WhisperX e composição SVG Remotion. Evidências e limitações: reports/SOL-DESAPARECEU.md. Arquivos: src/remotion/sun/SunShort.tsx, public/assets/sol, scripts/align_sun.py. QA visual e sonoro humano pendente; não publicado.

## Episódio Sol v4 — atuação por beat — 05/11/2026
Executado: novo `sunBugiMotion.ts` com gesto motivado e recuperação por cena; braços agora alteram juntas usadas pelo SVG; rig voltou ao chão canônico; pose de frio em pé e braços cruzados; testes de apoio, proibição de pose aérea e fim de loops. Arquivos: `SunShort.tsx`, `sunBugiMotion.ts`, `sunBugiMotion.test.ts`, `package.json`. Rollback: reverter o commit desta correção; MP4 permanece ignorado em `out/`.

## Piloto de edição por narração — 05/11/2026
Executado: composição isolada EditingPilot (12 s), reutilizando Puck real, alinhamento existente e SFX procedurais locais. Termômetro/calor, apontar, confirmação, marcador de segundo e feixe luminoso acompanham os trechos da voz. Arquivos: src/remotion/sun/EditingPilot.tsx e src/remotion/EditingPilotRoot.tsx. Lint passou; v1 H.264/AAC 1080×1920, 12,011 s, 1.733.420 bytes e decode integral sem erros. Folha out/edicao-contato.jpg inspecionada; fonte SVG corrigida em v2. Limitação: sem escuta contínua certificada, sem nova arte de cenário, sem aprovação artística final; este experimento não equivale ao acabamento da referência. Vídeos agendados preservados. Próximo: revisar ritmo/atuação e cenário. Rollback: reverter apenas o commit deste piloto.

## Vídeo Tempo parado — 05/11/2026
Executado: diálogo de 18 turnos com Gemini TTS real (Puck/Charon), alinhamento acústico WhisperX, cenário SVG, diagramas, balões por speaker, envelope de boca e SFX originais. Evidências e limites: reports/TEMPO-INTERACAO.md; composição TimeDialogueRoot.tsx; assets public/assets/tempo-interacao. Lint/build e quatro testes de movimento passaram. Montagem 94,553 s; export 94,833 s, H.264/AAC 1080×1920/30. Primeira exportação decodificada sem erros; mix -16,5 LUFS, pico -1,9 dBTP. Revisão visual amostrada detectou sobreposição de personagem em café/contrato, corrigida em v2. Limitação: escuta humana integral e aprovação artística pendentes. Sem publicação. Rollback: reverter os commits desta branch, sem apagar mídias anteriores.

## Separação Bugi 2D / Bugi 3D — 05/11/2026

Criados `bugi-3d/`, `docs/BUGI-2D-E-3D.md` e a skill `.agents/skills/e-se-bugasse-3d`. O kit recebeu o preset `bugi`, cabelo low-poly coral `spikes`, package namespace próprio, catálogo regenerado e check adaptado. O Bugi 2D existente não foi movido. Rollback: reverter o commit desta integração; não apagar `out/` nem alterar branches anteriores.

## Adaptação completa das skills para 3D — 05/11/2026

Criados `e-se-bugasse-producao-3d`, `remotion-qualidade-3d`, `skill-reel-adaptacao-3d`, `photocraft-3d` e `filmcraft-3d`. A skill `e-se-bugasse-3d` recebeu matriz, registry e verificador de cobertura; a Reel local passou a rotear 2D/3D. Adicionado `npm run test:skills-3d`. Rollback: reverter somente o commit desta adaptação; o módulo 3D base permanece independente.

