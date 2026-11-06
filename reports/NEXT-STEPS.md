# Próximos passos — 2026-11-04

## Raio no carro — voz recuperada

Nova aba do AI Studio resolveu a geração: Charon/Puck reais baixados, alinhamento acústico WhisperX de 13 turnos/198 palavras e duração 71,774 s. Mix e composição final Remotion com technical=false. Evidências/proveniência e limites em `reports/RAIO-CARRO-2D.md`. Lint passou. Aprovação artística/escuta integral ainda pendentes; sem publicação. Rollback: reverter commits desta retomada, preservando prévia técnica.

## Raio no carro — Bugi 2D

Pesquisa NWS/CDC/Met Office, roteiro e cena SVG Remotion implementados. Evidências e arquivos: `reports/RAIO-CARRO-2D.md`. Gemini TTS bloqueado com HTTP 403 observado na prévia do AI Studio; nenhum WAV real gerado. Prévia técnica sem áudio, tempos explicitamente estimados. Lint e 17 testes passaram. Próximo: restabelecer acesso TTS, gerar Charon/Puck, alinhar e exportar final. Rollback: reverter commits da branch codex/bugi-2d-raio-carro-20261105.

## Bugi formiga 3D — 05/11/2026

Execução e evidências em `reports/BUGI-FORMIGA-3D.md`. Roteiro pesquisado, Gemini TTS Charon/Puck real, alinhamento acústico (16 turnos, 213 palavras, 77,437 s), storyboard 22 planos e composição Remotion Ant3DRoot. Limitações artísticas registradas; sem publicação automática. Rollback por reversão dos commits desta branch.

## Casal Bugi v2

Revisar a nova passageira, escala e abertura de boca do Bugi no MP4 antes de publicar. Evidência e arquivos: CASAL-BUGI-V2.md. Aprovação artística e auditiva humanas pendentes.

## Primeiro Bugi — novo episódio

Executado: nova voz real e montagem. Próximo: revisão humana integral de áudio, expressões e ritmo antes de publicar. Evidência, arquivos e limites: PRIMEIRO-BUGI-EPISODIO.md. O 403 anterior foi superado; não tratar como bloqueio atual.

## Debate Ar

Executado: vídeo local de conversa de casal e explicação científica. Próximo: avaliar proximidade visual com referências e ouvir as duas vozes. Evidência e arquivos: DEBATE-AR-CONDICIONADO.md. Limite: aprovação humana pendente.

## Short Tempo v1

Executado: primeiro episódio completo exportado. Próximo: ouvir integralmente e aprovar ritmo, legendas e arte antes de publicar. Evidência e limitações: `SHORT-TEMPO-V1.md`.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: exportada revisão v4 com cenário em código conforme feedback. Evidência/arquivos: PILOTO-ATRITO-V4.md e out/piloto-atrito-v4-codigo.mp4. Próximo: revisão humana da escala, ritmo, contato e áudio; alinhamento acústico das legendas antes do episódio completo. Limitação: ainda não aprovado artisticamente.

## Após o primeiro piloto v3

Executado: piloto real de 12,5s com voz Google e cenário imagegen autorizado; código, assets e QA registrados em PILOTO-ATRITO-V3.md. Evidência: MP4, contato e sequência de pegada em qa/pilot-atrito-v1. Próximo: ouvir a faixa, ajustar legendas por alinhamento acústico/revisão e revisar atuação/contato/perspectiva com o usuário antes de avançar a 35–55s. Nenhuma aprovação artística presumida. Variar cenários por episódio mantendo a identidade do canal; imagem é asset, animação permanece por código. Pendências gerais de segurança/orquestração continuam na auditoria.

## Após a pesquisa de Reels

Modelo recomendado documentado em MODELO-REELS-BUGI.md: cartoon 2D com profundidade por camadas + explicações curtas + montagem guiada pela voz. Pesquisa e referências em PESQUISA-REELS-CODIGO.md. Execução/evidência: consulta às fontes primárias, repositórios, skills e CLI. Limitações: sem novo vídeo; RAM livre muito baixa no diagnóstico; Whisper não funcional e editores nativos não validados. Próxima etapa de produção, conforme pedido do usuário: piloto de 12s no BUGASSE com composição Remotion compartilhada e assets reais. Não requer reescolher marca, paleta ou personagem.

1. Autenticar Express, isolar estado/fila/mídias por proprietário e impor limites de requisição antes de expor o serviço.
2. Remover conclusões sem artefato; distinguir estimativa de cobrança e aplicar orçamento antes de cada chamada paga.
3. Executar fila em worker persistente com hash de entrada, checkpoint por asset e retomada idempotente.
4. Produzir piloto pela composição Remotion compartilhada, com narração real e cenário Google documentado; ajustar beats à duração medida.
5. Corrigir trim da cena isolada e exigir entrada exata na finalização FilmCraft.
6. Comparar frames Player/export, ouvir áudio, inspecionar sequências contínuas e registrar aprovação artística separada.
7. Consolidar lockfile e artefatos aprovados em commits pequenos e PR após revisão do estado local.

Executado nesta análise: inventário parcial, leitura de código, lint/test/build e QA técnico da mídia existente. Evidências: AUDIT.md e RENDER-QA.md. Bloqueios: integração paga não exercitada; sem comprovação de render ponta a ponta nem do processo de produção da referência externa.

## Pesquisa e instalações de animação — 04/11/2026
Executado: instalação local de skills e auditoria de ferramentas em branch isolada. Evidências, arquivos, logs resumidos, limitações e rollback: `reports/ANIMACAO-FERRAMENTAS-20261104.md`. Fluxo: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`. Nenhum render novo foi produzido.


## Episódio Sol — 04/11/2026
Executado: voz Puck no Gemini TTS, alinhamento acústico WhisperX e composição SVG Remotion. Evidências e limitações: reports/SOL-DESAPARECEU.md. Arquivos: src/remotion/sun/SunShort.tsx, public/assets/sol, scripts/align_sun.py. QA visual e sonoro humano pendente; não publicado.

## Após a correção de movimento v4 — 05/11/2026
Executado: correção técnica e visual amostrada, novo MP4 validado. Próximo: usuário assistir à v4 inteira e aprovar atuação/ritmo; somente depois considerar publicação. Não publicar automaticamente. Para episódios futuros, usar `computeSunBugiKinematics` como referência de contrato: tempo local, ação curta, recuperação, apoio no chão e teste anti-loop; generalizar para controlador compartilhado apenas depois de validar em outro episódio.

## Piloto de edição por narração — 05/11/2026
Executado: composição isolada EditingPilot (12 s), reutilizando Puck real, alinhamento existente e SFX procedurais locais. Termômetro/calor, apontar, confirmação, marcador de segundo e feixe luminoso acompanham os trechos da voz. Arquivos: src/remotion/sun/EditingPilot.tsx e src/remotion/EditingPilotRoot.tsx. Lint passou; v1 H.264/AAC 1080×1920, 12,011 s, 1.733.420 bytes e decode integral sem erros. Folha out/edicao-contato.jpg inspecionada; fonte SVG corrigida em v2. Limitação: sem escuta contínua certificada, sem nova arte de cenário, sem aprovação artística final; este experimento não equivale ao acabamento da referência. Vídeos agendados preservados. Próximo: revisar ritmo/atuação e cenário. Rollback: reverter apenas o commit deste piloto.

## Vídeo Tempo parado — 05/11/2026
Executado: diálogo de 18 turnos com Gemini TTS real (Puck/Charon), alinhamento acústico WhisperX, cenário SVG, diagramas, balões por speaker, envelope de boca e SFX originais. Evidências e limites: reports/TEMPO-INTERACAO.md; composição TimeDialogueRoot.tsx; assets public/assets/tempo-interacao. Lint/build e quatro testes de movimento passaram. Montagem 94,553 s; export 94,833 s, H.264/AAC 1080×1920/30. Primeira exportação decodificada sem erros; mix -16,5 LUFS, pico -1,9 dBTP. Revisão visual amostrada detectou sobreposição de personagem em café/contrato, corrigida em v2. Limitação: escuta humana integral e aprovação artística pendentes. Sem publicação. Rollback: reverter os commits desta branch, sem apagar mídias anteriores.

## Próximos marcos do Bugi 3D

1. Revisar a licença/origem antes de merge público.
2. Renderizar quadros do preset `bugi` em idle, walk, talk, surprised e angry; corrigir silhueta/cabelo/roupa após inspeção.
3. Criar um piloto 3D de 8–12 s com cenário, ação e contato reais.
4. Implementar o adaptador que leva a cena aprovada à composição Remotion e provar paridade Player/export.
5. Só depois produzir episódio completo, com Gemini TTS, alinhamento, SFX, fontes e QA artístico.

## Após adaptar as skills

1. Usar `e-se-bugasse-producao-3d` no piloto de 8–12 s.
2. Implementar e provar a ligação determinística Three.js → Remotion antes de declarar `remotion-qualidade-3d` atendida.
3. Rodar `npm run test:skills-3d` sempre que instalar/remover skills.
4. Exercitar apenas as ferramentas opcionais que trouxerem ganho observável; registrar indisponibilidade em vez de simular uso.

## Direção combinada do próximo vídeo 2D — 06/11/2026

Executado: Aplicar docs/DIRECAO-PROXIMO-VIDEO-2D.md ao próximo tema: pesquisa científica, roteiro por beat, TTS real, alinhamento, piloto de 12 s e QA antes do render completo. Tema ainda pendente. Evidência/arquivos: docs/DIRECAO-PROXIMO-VIDEO-2D.md e docs/WORKFLOW-ANIMACAO-E-SKILLS.md. Log de verificação: git diff --check. Limitação: direção documentada, sem implementação audiovisual ou aprovação artística desta combinação. Rollback: reverter apenas o commit desta direção.

## Gravidade dobrada — produção 06/11/2026

Executado: Concluir QA da V2, inspecionar movimento contínuo e entregar MP4 para revisão do usuário. Não publicar este episódio automaticamente. Próximos vídeos devem ler AGENTS.md e workflow persistente; validar cada técnica por evidência, sem alegar todas as skills usadas. Arquivos, comandos, fontes e limites em reports/GRAVIDADE-2D.md. Logs: saídas reais de npm run lint, npm test, npm run build, tsx --test e Remotion CLI. Rollback: reverter os commits da branch codex/bugi-gravidade-2d-20261106; preservar mídia e episódios anteriores.

## Entrega Gravidade V2 — 06/11/2026

Executado: exportação revisada concluída; arquivo real out/bugi-gravidade-dobrada-v2.mp4 (69,184 s, 7.623.050 bytes, 2.075 frames, H.264/AAC 1080×1920/30). Evidência e arquivos: reports/GRAVIDADE-2D.md, out/gravidade-v2-contato.jpg e out/gravidade-celular-v2-sequencia.jpg. Logs: ffprobe confirmou formato; FFmpeg decode integral sem erros; blackdetect sem intervalos pretos; áudio do MP4 medido -17,08 LUFS / -4,96 dBTP / LRA 4,4. Lint/build e 20 testes totais passaram. Limitação: revisão humana integral de imagem/escuta e aprovação artística pendentes; sem publicação. Nenhuma instalação adicional ou ferramenta opcional simulada. Próximo: usuário revisar V2. Rollback conforme relatório do episódio. Este registro substitui o estado anterior de V2 em render.

## Edição final Gravidade V3 — 06/11/2026

Executado: tela limpa, legendas em 60 páginas + SRT, sinal ciano reativo à voz do narrador, gráficos proporcionais e movimentos corrigidos (cotovelos, alcance, joelhos, transições e salto com pés livres). Evidência/arquivos: reports/GRAVIDADE-FINAL-V3.md, src/remotion/gravity/GravityFinal.tsx, GravityCaptions.tsx, GravityGraphics.tsx, gravityMotion.ts, out/bugi-gravidade-final-v3.mp4 e public/assets/gravidade/render-qa-final.json. Logs: lint/build, 17 testes existentes e 5 de movimento passaram; decode integral e blackdetect sem erros/intervalos pretos. MP4 69,184 s, 9.665.348 bytes, H.264/AAC 1080×1920/30. Limitação: revisão artística e escuta humanas integrais pendentes; sem publicação. Nenhuma instalação/TTS pago novo. Workflow atualizado; próximo vídeo deve herdar estas correções. Rollback: reverter commits da branch codex/gravidade-final-edicao-20261106.

## Padrão V3 e pesquisa editorial — 06/11/2026

Executado: aprovação visual explícita do usuário registrada como referência persistente; linguagem Bugi irritada/irônica com palavrões leves naturais, sem cota. Pesquisa de cinco temas com exemplos públicos, distinção entre Shorts/vídeo longo e fontes primárias. Evidência/arquivos: reports/PESQUISA-TEMAS-20261106.md, AGENTS.md, docs/WORKFLOW-ANIMACAO-E-SKILLS.md e docs/DIRECAO-PROXIMO-VIDEO-2D.md. Logs: consultas web desta sessão e git diff --check. Limitação: mudança documental, sem nova instalação, áudio, render ou teste de animação; métricas públicas não demonstram demanda brasileira nem retenção. Aprovação visual da V3 não equivale a escuta técnica integral. Próximo: roteiro e piloto do tema recomendado Terra parar por 1 s. Rollback: reverter commit desta branch; preservar agendamentos e MP4 existentes.

## Episódio Sono — produção em 06/11/2026

Executado: pesquisa NIH/CDC/Waters, roteiro original de 364 palavras, Puck e Charon reais no Gemini 3.8, alinhamento acústico dos 20 turnos e mix de 153,138 s; cenário/objetos SVG, rig oficial, gráficos e 117 páginas de legendas/SRT. Evidência/arquivos: reports/SONO-2D.md, public/assets/sono, src/remotion/SleepRoot.tsx, src/remotion/sleep e scripts/*sleep*. Logs: Node 24.14.1, npm 11.11.0, Remotion 4.0.540, FFmpeg 9.0; lint, 17 testes existentes e 4 novos passaram; build passou com avisos já presentes. Pilotos V1/V2 exportados, sequência inspecionada e Player real em reprodução; render integral em andamento neste registro. Limitação: aprovação artística e escuta humana integrais pendentes; não publicado. HTTP403 no AI Studio recuperado na sessão que gerou Puck, mantendo Charon/3.8; 2.5 tentou sem asset e não foi usado. ASR independente recuperado de incompatibilidade PyAV carregando PCM; nenhuma instalação nova. Custos cobrados não disponíveis. Próximo: QA do MP4 integral e revisão do usuário. Rollback: reverter commits da branch codex/bugi-sem-dormir-20261106, sem tocar vídeos ou agendamentos anteriores.


## Retomada do episodio Sono — 06/11/2026

Executado: recuperada a V2 integral existente; QA tecnico reexecutado, fontes da composicao conferidas por SHA256 e storyboard de 20 falas consolidado. Nenhuma chamada paga nova e nenhum rerender desnecessario. Lint, 17 testes gerais, 5 testes de movimento e build passaram (avisos preexistentes de Vite/bundle).

Evidencia: `public/assets/sono/render-qa.json`; `out/sono-decode.log`, `out/sono-blackdetect.log`, `out/sono-loudness.log`; imagens `out/sono-completo-contato.jpg`, `out/sono-reacao-sequencia.jpg`, `out/sono-carro-sequencia.jpg` revisadas. MP4 `out/bugi-nunca-dormir-v2.mp4`: 153,173 s, 18.500.872 bytes, 4595 frames, H.264/AAC, 1080x1920/30 fps. Audio -16,58 LUFS, pico -4,63 dBTP. Decode integral sem erros e sem intervalos pretos detectados.

Arquivos: storyboard.json, sleep_storyboard.ts, teste de movimento com duracoes reais, render-qa.json e estes relatorios. Vozes Google Puck/Charon existentes preservadas; proveniencia em public/assets/sono/provenance.json. Custos cobrados nao informados; nenhuma nova geracao nesta retomada.

Limitacao: revisao visual amostrada; escuta humana integral e aprovacao artistica pendentes. Sem publicacao. Proximo: assistir ao MP4 integral e avaliar ritmo/voz; a existencia dos testes nao constitui aprovacao artistica. Rollback: reverter apenas o commit da branch codex/retoma-sono-qa-20261106, preservando V1/V2 e audios originais. Base desta retomada: 58892f6.


## Sono V3 dinamico — 06/11/2026

Executado: novas demonstracoes por fala e atuacao revisada; MP4 integral exportado. Evidencias/arquivos/logs: reports/SONO-V3-DINAMICA.md, public/assets/sono/render-qa-v3.json e storyboard-v3.json; out/bugi-nunca-dormir-v3.mp4, sono-v3-*.jpg e logs. Lint/build, 17 testes gerais e 7 de movimento passaram. Exportacao Remotion 4.0.540: 153,173 s, 17.089.680 bytes, H.264/AAC 1080x1920/30, 4595 frames. Decode sem erros, blackdetect sem intervalos; -16,58 LUFS e -4,63 dBTP. Revisao visual amostrada e reproducao parcial do Player; escuta humana integral e aprovacao artistica pendentes. Sem chamadas pagas novas ou publicacao. Vozes/mix/SRT e V2 preservados. Rollback: reverter commits de codex/sono-direcao-dinamica-20261106, base 5d80d92.


## Agendamento autorizado — 06/11/2026

Usuario autorizou postar a V3 hoje as 15h. Enviada a V3 (SHA256 1362c16f5b508511ba1ff19df90716b545a09bc3b78cedb975a153a94dc1e077) e confirmados os dois agendamentos para 06/11/2026, 15:00 America/Sao_Paulo. YouTube: https://youtube.com/shorts/WhgKj1uHSCA, dialogo Video programado com data/hora; verificacoes concluidas sem problemas. Facebook: pagina E Se Bugasse?, asset 108437747426946, horario 15:00 e fuso conferidos antes de Programar; dialogo Reel programado confirmado. Limite: agendado nao significa ja publicado; Meta informa publicacao apos processamento. Evidencias: out/sono-agendado-youtube.png e out/sono-agendado-facebook.png; metadados public/assets/sono/publicacao.json. Sem impulsionamento ou anuncio. Para desfazer o agendamento, cancelar nas plataformas; reverter Git nao cancela posts.
