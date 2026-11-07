# QA de mídia existente — 2026-11-04

## Raio no carro — voz recuperada

Nova aba do AI Studio resolveu a geração: Charon/Puck reais baixados, alinhamento acústico WhisperX de 13 turnos/198 palavras e duração 71,774 s. Mix e composição final Remotion com technical=false. Evidências/proveniência e limites em `reports/RAIO-CARRO-2D.md`. Lint passou. Aprovação artística/escuta integral ainda pendentes; sem publicação. Rollback: reverter commits desta retomada, preservando prévia técnica.

## Raio no carro — Bugi 2D

Pesquisa NWS/CDC/Met Office, roteiro e cena SVG Remotion implementados. Evidências e arquivos: `reports/RAIO-CARRO-2D.md`. Gemini TTS bloqueado com HTTP 403 observado na prévia do AI Studio; nenhum WAV real gerado. Prévia técnica sem áudio, tempos explicitamente estimados. Lint e 17 testes passaram. Próximo: restabelecer acesso TTS, gerar Charon/Puck, alinhar e exportar final. Rollback: reverter commits da branch codex/bugi-2d-raio-carro-20261105.

## Bugi formiga 3D — 05/11/2026

Execução e evidências em `reports/BUGI-FORMIGA-3D.md`. Roteiro pesquisado, Gemini TTS Charon/Puck real, alinhamento acústico (16 turnos, 213 palavras, 77,437 s), storyboard 22 planos e composição Remotion Ant3DRoot. Limitações artísticas registradas; sem publicação automática. Rollback por reversão dos commits desta branch.

## Casal Bugi v2

Executado: render 52,608s, 1578 quadros, 1080×1920; lint e decode integral passaram. Nova passageira e boca do Bugi conferidas em quadros. Evidência: out/debate-ar-bugi-casal-v2.mp4 e qa/debate-ar/casal-v2-contato.png. Arquivos e limites: CASAL-BUGI-V2.md. Áudio preservado, sem nova medição nesta revisão; aprovação humana pendente.

## Primeiro Bugi — episódio com ironia

Executado: MP4 completo 52,608s, 1578 quadros, 1080×1920/30fps, áudio real Kore/Puck. Decode integral e lint passaram. EBU R128: -14,0 LUFS, true peak -4,1 dBFS. Evidência: out/debate-ar-bugi-primeiro-final.mp4 e qa/debate-ar/primeiro-bugi-contato.png. Arquivos, origem e limites em PRIMEIRO-BUGI-EPISODIO.md. Revisão humana pendente.

## Debate Ar v3

Executado: render de 33,813s com tela cheia e cenas explicativas; lint e decode passaram. Evidência: out/debate-ar-v3-tela-inteira.mp4 e qa/debate-ar/contato-v3.png. Arquivos/limites: DEBATE-AR-V3.md. Revisão artística humana pendente.

## Debate Ar v2

Executado: MP4 Remotion 1080×1920/30fps, 1014 quadros, 33,81s; decode sem erros, -14,0 LUFS e -2,5 dBFS true peak, lint aprovado. Evidência: out/debate-ar-v2.mp4 e qa/debate-ar/final-frame.png. Arquivos, fontes e limites em DEBATE-AR-CONDICIONADO.md. Escuta e aprovação artística humanas pendentes.

## Short Tempo v1

Executado: render Remotion real de 50,600s, 1515 quadros, 1080×1920/30 fps H.264/AAC; decode integral sem erros; −14,2 LUFS e true peak −2,5 dBFS. Evidência: `out/short-tempo-final.mp4`, `qa/short-tempo/contact-sheet-final.png` e `SHORT-TEMPO-V1.md`. Limitação: alinhamento ASR estimado, escuta humana e aprovação artística pendentes.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: revisão v4 com cenário inteiramente SVG, Bugi 22% menor, poste enquadrado desde o início e queda com pés livres. Evidência: out/piloto-atrito-v4-codigo.mp4; 375 frames, 1080x1920 H.264/30 FPS, AAC, 12,501s, 5.610.279 bytes. FFmpeg decodificou sem erros; lint e 3 testes do piloto passaram. Inspeção visual da folha qa/pilot-atrito-v1/contato-v4.png realizada. Arquivos e limites em PILOTO-ATRITO-V4.md; legendas estimadas e aprovação artística/escuta humana pendentes.

## Novo piloto Remotion v3 — 2026-11-04

Executado: render real de ESeBugasseVideoComposition pelo PilotRoot; voz Gemini gerada/baixada no AI Studio e cenário via imagegen após autorização do usuário. `out/piloto-atrito-v3.mp4`: 11.803.789 bytes, 12,501s, 375 frames, 1080x1920 H.264/30 FPS, AAC; decode sem erros; -14,0 LUFS, true peak -3,4 dBFS medidos. Evidências e logs locais: qa/pilot-atrito-v1/render-v3.log, ffprobe-v3.json, loudness-v3.log, contato-v3.png e sequencia-pegada-v3.png. Arquivos, comandos, ajustes e limites completos em PILOTO-ATRITO-V3.md. Status: aguardando revisão visual e auditiva, legendas com tempos estimados; sem aprovação automática. O bloqueio de cenário Google foi substituído por fonte OpenAI explicitamente autorizada, não disfarçado como sucesso Google.

## Complemento da pesquisa de Reels

Não houve novo render. Executado ffprobe no exemplo local da Skill Reel: 38,8s, 540x960, 30 FPS, H.264/AAC, 3.125.937 bytes. Folha original anexos/quadros-01.png inspecionada, sem afirmar escuta ou reprodução integral. Referências externas tiveram inspeção por amostras/descrição/código conforme PESQUISA-REELS-CODIGO.md. Nenhum candidato recebeu aprovação artística do canal; MODELO-REELS-BUGI.md é especificação proposta, não vídeo entregue. Logs na conversa; limitação: paridade do piloto BUGASSE continua pendente.

Executado: ffprobe, decodificação integral FFmpeg e medição ebur128 do `data/media/piloto-12s-premium-v2.mp4`; inspeção de `reports/qa-pilot-12s-v2/contato.png`.

| Medida | Resultado |
|---|---|
| Tamanho | 4.194.310 bytes |
| Vídeo | H.264, 1080x1920, 30 FPS, 360 frames |
| Áudio | AAC, duração 12s |
| Duração | 12s |
| Decodificação | Sem erros reportados |
| Loudness integrado | -15,4 LUFS |
| True peak | -1,1 dBFS no resumo ebur128 com peak=true |
| WAV associado | PCM s16le, 11,24s, 539.564 bytes |

Evidência: comandos ffprobe com show_entries; `ffmpeg -v error -i <mp4> -f null NUL`; `ffmpeg -hide_banner -nostats -i <mp4> -af ebur128=peak=true -f null NUL`. Relatórios anteriores preservados em `reports/qa-pilot-12s-v2/`.

Inspeção visual da folha: múltiplas poses; fundo geométrico; legendas apresentam palavras visualmente coladas; poste de interação surge nos quadros intermediários. Folha não comprova fluidez em sequência.

Limitações: sem escuta nesta auditoria; origem Gemini da voz não comprovada por WAV; sem comparação Player/MP4; sem evidência de fundo Google neste script; render usa HTML próprio com FFmpeg. Resultado técnico não equivale a aceite artístico ou aprovação do piloto exigido pelo kit. Nenhum novo vídeo foi gerado.

## Pesquisa e instalações de animação — 04/11/2026
Executado: instalação local de skills e auditoria de ferramentas em branch isolada. Evidências, arquivos, logs resumidos, limitações e rollback: `reports/ANIMACAO-FERRAMENTAS-20261104.md`. Fluxo: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`. Nenhum render novo foi produzido.


## Episódio Sol — 04/11/2026
Executado: voz Puck no Gemini TTS, alinhamento acústico WhisperX e composição SVG Remotion. Evidências e limitações: reports/SOL-DESAPARECEU.md. Arquivos: src/remotion/sun/SunShort.tsx, public/assets/sol, scripts/align_sun.py. QA visual e sonoro humano pendente; não publicado.

## Episódio Sol v4 — movimentos corrigidos — 05/11/2026
Executado: render Remotion da mesma composição do Player. `out/bugi-sol-desapareceu-v4-movimentos-corrigidos.mp4`: 6.510.888 bytes, 48,811 s, H.264 1080×1920/30 FPS, AAC 48 kHz estéreo; decodificação integral FFmpeg sem erros; true peak -2,2 dBFS. SHA-256 `F24423B927DED9930AEBBA6A9D031DA342EA32599E00050B5F0A5512540DA2B7`. Lint, 4 testes novos, 5 testes do piloto e 17 testes gerais passaram. Folha de contato e quadro do frio inspecionados. Limitação: sem nova escuta humana; o WAV e mix não mudaram. Aprovação artística do MP4 completo permanece pendente.

## Piloto de edição por narração — 05/11/2026
Executado: composição isolada EditingPilot (12 s), reutilizando Puck real, alinhamento existente e SFX procedurais locais. Termômetro/calor, apontar, confirmação, marcador de segundo e feixe luminoso acompanham os trechos da voz. Arquivos: src/remotion/sun/EditingPilot.tsx e src/remotion/EditingPilotRoot.tsx. Lint passou; v1 H.264/AAC 1080×1920, 12,011 s, 1.733.420 bytes e decode integral sem erros. Folha out/edicao-contato.jpg inspecionada; fonte SVG corrigida em v2. Limitação: sem escuta contínua certificada, sem nova arte de cenário, sem aprovação artística final; este experimento não equivale ao acabamento da referência. Vídeos agendados preservados. Próximo: revisar ritmo/atuação e cenário. Rollback: reverter apenas o commit deste piloto.

## Vídeo Tempo parado — 05/11/2026
Executado: diálogo de 18 turnos com Gemini TTS real (Puck/Charon), alinhamento acústico WhisperX, cenário SVG, diagramas, balões por speaker, envelope de boca e SFX originais. Evidências e limites: reports/TEMPO-INTERACAO.md; composição TimeDialogueRoot.tsx; assets public/assets/tempo-interacao. Lint/build e quatro testes de movimento passaram. Montagem 94,553 s; export 94,833 s, H.264/AAC 1080×1920/30. Primeira exportação decodificada sem erros; mix -16,5 LUFS, pico -1,9 dBTP. Revisão visual amostrada detectou sobreposição de personagem em café/contrato, corrigida em v2. Limitação: escuta humana integral e aprovação artística pendentes. Sem publicação. Rollback: reverter os commits desta branch, sem apagar mídias anteriores.

## Bugi 3D — validação estrutural — 05/11/2026

`npm run check` passou: 12/12 personagens, 20 clips, oito testes de apoio dos pés, três medições de patinação, timeline em camadas, 57 assets e 120 variantes, dois storyboards de exemplo. Não houve render de vídeo nesta etapa. Portanto, iluminação, enquadramento, determinismo quadro a quadro, paridade Remotion e qualidade artística do Bugi 3D permanecem pendentes.

Teste visual adicional: `projects/bugi-identidade-test` validou sem erros e gerou quatro PNGs 1080×1920. O close frontal confirma paleta, olhos, expressão e silhueta básica do Bugi. Problemas observados: cabelo ainda muito cônico, cenário urbano simples e poeira excessiva cobrindo o corpo na caminhada. Não houve MP4, voz ou aceite artístico.

## Skills 3D — impacto no QA

A matriz de skills acrescenta verificações 3D de clipping, z-fighting, popping, materiais, sombras, contato, colisões e continuidade espacial, além do QA 2D já existente. Esta etapa validou instruções e cobertura, não produziu novo MP4 nem altera o aceite artístico pendente.

## Direção combinada do próximo vídeo 2D — 06/11/2026

Executado: Sem novo render nesta etapa editorial. Gate definido: piloto de 12 s com diálogo, atuação, demonstração e transição; evidência por frame e escuta exigidas antes do episódio completo. Evidência/arquivos: docs/DIRECAO-PROXIMO-VIDEO-2D.md e docs/WORKFLOW-ANIMACAO-E-SKILLS.md. Log de verificação: git diff --check. Limitação: direção documentada, sem implementação audiovisual ou aprovação artística desta combinação. Rollback: reverter apenas o commit desta direção.

## Gravidade dobrada — produção 06/11/2026

Executado: Piloto real 12,011 s H.264/AAC 1080×1920/30, 1.310.129 bytes. V1 completa 69,184 s, 2.075 frames, 7.232.104 bytes, decode integral passou. Revisão amostrada: out/gravidade-piloto-contato.jpg, out/gravidade-completo-contato.jpg e out/gravidade-postura-v2.png. Mix medido -17,06 LUFS, -2 dBTP, LRA 4,3. V2 em render após correção de postura/celular/expressões; não confundir com V1. Escuta humana integral e aprovação artística ainda pendentes. Arquivos, comandos, fontes e limites em reports/GRAVIDADE-2D.md. Logs: saídas reais de npm run lint, npm test, npm run build, tsx --test e Remotion CLI. Rollback: reverter os commits da branch codex/bugi-gravidade-2d-20261106; preservar mídia e episódios anteriores.

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


## Continuidade no Antigravity — 06/11/2026

Executado: entrada GEMINI.md com includes de AGENTS.md/contrato, workspace apontando ao checkout de producao, guia de abertura e contexto compartilhado. Evidencia: git worktree list mostrou BUGASSE e BUGASSE-animacao em branches distintas; o primeiro nao contem SleepRoot nem workflow visual atual. Arquivos: GEMINI.md, BUGASSE-animacao.code-workspace, docs/CONTINUIDADE-AGENTES.md, docs/ABRIR-NO-ANTIGRAVITY.md, AGENTS.md e README.md. Entradas auxiliares locais tambem na pasta Code (nao versionadas neste repositorio). Validacao: JSON dos workspaces, destinos/includes e existencia dos guias/episodio conferidos; entradas abaixo de 24 KB. Nenhum build/render necessario: alteracao somente documental. Limite: pasta ativa do Antigravity nao foi confirmada pela captura; nao foi enviado prompt nem comprovado reconhecimento das regras pelo modelo. Guia inclui mensagem de verificacao. Sem configuracao global, instalacao, alteracao de midia ou publicacao nova. Rollback: reverter commit desta branch e remover manualmente os dois auxiliares locais em Code, se desejado.


## Analise da referencia Claude — 06/11/2026

Executado: inspecao do ZIP/MP4/fontes (sem executar codigo externo), ffprobe, contact sheet, sequencias precisas e reproducao parcial. Evidencias/arquivos/logica de correcao: reports/REFERENCIA-CLAUDE-20261106.md e manifesto JSON. Guias compartilhados atualizados para encenacao por acao, props/camera/ambiente e prova em piloto. Limites: sem escuta integral certificada, sem auditoria cientifica completa, sem novo episodio ou alteracao do Sono agendado. Proximo: escolher tema e criar roteiro audiovisual/piloto representativo antes do episodio integral. Nao considerar direcao documentada como animacao implementada. Nenhuma instalacao, chamada paga ou mudanca de engine. Rollback: reverter commit da branch codex/referencia-claude-movimento-20261106.


## Terra para 1 segundo — fechamento em 07/11/2026

Executado: episodio de 14 falas, vozes Gemini Puck/Charon reais, alinhamento acustico e 64 paginas de legenda; Remotion unico no Player e export. V2 foi rejeitado na revisao por ausencia das demonstracoes finais. V3 restaura polos/latitude, ar/agua, gravidade/orbita e payoff; caneca solta da ancora da mao.

Evidencia: public/assets/terra-1s/render-qa.json, provenance.json, sources.json e reports/TERRA-PARA-1S.md. Arquivos: src/remotion/EarthStopRoot.tsx, earthstop/*, scripts/*earthstop*, public/assets/terra-1s/*. Logs locais: out/terra-1s-v3-render.log, terra-1s-decode.log, terra-1s-blackdetect.log, terra-1s-loudness.log e terra-1s-build.log. MP4 local out/bugi-terra-para-1s-v3.mp4: 79,872 s; 18.243.059 bytes; 2396 frames; H.264/AAC; 1080x1920/30 fps; -16,54 LUFS e -4,95 dBTP; decode integral sem erros e blackdetect sem intervalos. SHA256 9f2f59509edb41044f48e4274bdeb06b14bdf9368a1ee6c8af37a2340bc144cd.

Validacao: build, 17 testes gerais e 4 de movimento passaram. Lint geral impedido por 8 erros nos arquivos locais nao versionados claude-style/ClaudeStylePilot.tsx e PainEpisode.tsx; nenhum erro earthstop reportado. Sem nova instalacao nesta retomada. Vozes ja geradas em 06/11; nenhuma nova chamada de geracao em 07/11, custos cobrados nao informados. Cenarios SVG originais; sem alegar Google para fundos. Revisao visual amostrada da sequencia integral e abertura/onibus/orbita. Limites: nao equivale a escuta humana integral nem aprovacao artistica; onibus sustenta pose apos a reacao. Hipotese fisica simplificada, nao simulacao planetaria completa. Publicacao nao autorizada e nao realizada.

Proximo: assistir ao V3 integral e avaliar ritmo/atuacao; resolver erros do outro piloto em seu proprio trabalho. Rollback: reverter commits desta branch codex/terra-para-1s-20261106, preservando WAVs/exports anteriores e Sono agendado. Base e1dbb31. MP4s/logs/imagens permanecem locais; fontes, audio e manifesto QA versionados.


## Fluidez da referencia dor aplicada na Terra — 07/11/2026

Executado: comparacao visual de dor_final.mp4 com Terra V3; correcao real de processos por palavra, recuperacao do freio, camera motivada, transposicao onibus/chao, relogio/distancia e demonstracoes de ar/agua/estruturas/gravidade. Preservados Bugi, roteiro, TTS e mix. Sem instalacao ou geracao nova, sem custo novo de IA registrado. Nao se inferiu modelo/engine da referencia; conteudo clinico nao foi validado/importado. Analise e hash: reports/FLUIDEZ-DOR-20261107.md/.json.

Evidencias/arquivos: src/remotion/earthstop/earthDirection.ts, EarthProcess.tsx, EarthStopEpisode.tsx, earthMotion.ts e teste; public/assets/terra-1s/render-qa-v4.json (reprovado visual por texto sobreposto) e render-qa-v5.json (correcao revisada). Piloto de 12 s inspecionado em sequencia, correcao do rotulo em still; Player 3117 sem erro com reproducao parcial e seeks. Export final local out/bugi-terra-para-1s-v5.mp4: 79,872 s, 21.810.740 bytes, 2396 frames, H.264/AAC, 1080x1920/30. Decode integral sem erros; blackdetect sem intervalos; -16,54 LUFS, -4,95 dBTP. SHA256 ce1397bb85dfed418b30c921009f70d293d306bc0b33c6617a9a24b100e33e36. Audio fonte identico ao V3 por SHA256. Logs out/terra-1s-v5-render.log, terra-1s-v5-decode.log, terra-1s-v5-blackdetect.log, terra-1s-v5-loudness.log e terra-v4-build/test/lint.log.

Testado: 17 testes gerais, 5 de movimento/camera e build passaram. Lint geral ainda impedido por 8 erros dos arquivos locais nao versionados de outro piloto claude-style; nenhum erro earthstop reportado. Revisao visual amostrada do MP4, cenas de onibus e gravidade conferidas apos correcao. Limites: sem escuta humana integral ou aprovacao artistica; pausas/poses sustentadas ainda existem; hipotese cartoon nao calcula danos planetarios. Sem publicacao. Nao declarar equivalencia artistica com a referencia apenas pelos testes.

Proximo: avaliar V5 integral. Guias compartilhados apontam para implementacao/evidencia, preservando futuras retomadas no Antigravity. Rollback: reverter commits da branch codex/fluidez-referencia-dor-20261107, base 7f17435; manter V3/V4, audios e trabalhos locais nao relacionados. MP4s/referencia/imagens/logs locais; codigo e QA versionados.


## Regeneracao A/B — fechamento 07/11/2026

Executado: dois pilotos de 12 s e comparacao lado a lado com mesmo Bugi, cenario, camera, voz, legenda e marcos acusticos; variam os controles de movimento. Arte e codigo originais. Audio real fornecido pelo usuario (8,8 s), preservado integralmente, sem aceleracao; WhisperX alinhou 21 palavras, SRT com 8 paginas. Modelos/voz solicitados no AI Studio nao autenticados pelo WAV; proveniencia user_supplied_wav e custo cobrado desconhecido. Sem instalacao de dependencias, Google para fundo ou outro motor alegados.

Evidencias/arquivos: reports/REGENERACAO-AB.md, public/assets/regeneracao/provenance.json, sources.json e render-qa.json; src/remotion/RegenerationRoot.tsx e regeneration/*; scripts/prepare_regeneration.py, regeneration_captions.ts e qa_regeneration.py. Saidas locais na copia BUGASSE-regeneracao: out/regeneracao-comparacao-v3.mp4 (2160x1920, 7.533.538 bytes), regeneracao-piloto-a-v3.mp4 (1080x1920, 3.513.266 bytes) e regeneracao-piloto-b-v3.mp4 (1080x1920, 3.769.091 bytes). Todos H.264/AAC, 30 fps, 360 frames, 12,011 s de conteiner. A/B recortados das mesmas metades do render Remotion, sem segunda implementacao de animacao. Decode integral sem erros; blackdetect sem intervalos. Faixa PCM decodificada identica nas tres saidas, SHA256 e42c4955f81a13dc5aa60d6822a8ce52e5ec53f9619e3948c6da2898d0fcfa01. -16,54 LUFS e -5,00 dBTP. Hash completo dos MP4s em render-qa.json.

Testado: lint passou na copia isolada; 17 testes gerais, 4 de movimento e build passaram. Logs out/regeneracao-lint.log, regeneracao-test.log, regeneracao-motion-test.log, regeneracao-build.log, regeneracao-comparacao-v3-render.log, regeneracao-qa.log e logs decode/blackdetect/loudness. Revisao visual de contatos A/B, sequencia de queda e frames de impacto/regeneracao/restauracao. Player final 3119 na copia isolada abriu a mesma composicao, frame 180 sem erro. Corrigidos apoio da palma, corte da cabeca, cruzamento dos pes e borda vazia da camera. Revisao artistica/escuta humana integral e escolha A/B pendentes; nenhuma publicacao.

Limites: comparacao de duas implementacoes originais, nao reproducao comprovada do pipeline do video da referencia. Tema de regeneracao instantanea e hipotese ficticia, sem orientacao medica. Nao declarar vencedor por testes. A copia original mudou para branch do outro editor durante execucao; commit d775c0c tambem permanece naquela branch. Continuacao isolada em Code/BUGASSE-regeneracao, branch codex/regeneracao-piloto-ab-20261107, base b0dc3a4. Nao foi feito reset/revert na branch do outro editor. Dependencias compartilhadas por junction node_modules.

Proximo: usuario comparar A/B e escolher controle antes de ampliar episodio. Rollback: reverter os commits desta branch, preservando WAV original e exports; isso nao remove automaticamente o commit ja existente na outra branch. Midias/logs/imagens locais; fontes, audio, QA e relatorios versionados.


## Regeneracao — nova base de movimento, 07/11/2026

Executado: A/B explicitamente rejeitados pelo usuario, preservados com userRejected=true. Criado puppet SVG independente (sem controles/solver dos A/B ou computeBugiArticulatedKinematics), articulacao por partes do corpo, tronco deformavel, interpolacao cubica com velocidade continua, apoio de maos, caminhada, recuperacao e detalhe da pele que muda geometria. Mesmo audio real enviado, legendas/alinhamento preservados. Sem nova chamada paga, instalacao ou fundo Google alegado. Identificadores visuais do Bugi conservados em nova construcao vetorial, ainda sujeitos a aprovacao humana.

Evidencia/arquivos: reports/REGENERACAO-NOVA-BASE.md, src/remotion/RegenerationFluidRoot.tsx, regeneration-fluid/*, scripts/qa_regeneration_fluid.py; public/assets/regeneracao/render-qa-nova-base.json e animation-new-base.json. Export Remotion real out/regeneracao-nova-base-v2.mp4: 12,011 s de conteiner, 2.927.909 bytes, 360 frames, 1080x1920/30, H.264/AAC. SHA256 11ae5e0ca8f9c0a844e370edf3a3ff16d0fa65eb4a8cbddf519301bec8ad0c5a. Decode integral sem erros; blackdetect sem intervalos; -16,54 LUFS e -5,00 dBTP. PCM do audio identico ao usado nos A/B, confirmado por hash. V1 preservado; V2 remove linha do piso que interferia na area da legenda.

Testado: lint, 17 testes gerais, 3 novos testes de continuidade/articulacoes/apoio e build passaram. Logs out/regeneracao-fluid-lint/test/build.log, regeneracao-nova-base-v2-render.log, regeneracao-fluid-qa-v2.log, decode/blackdetect/loudness. Contatos e sequencias de queda (10fps), pele (9fps) e reacao (4fps) revisados. Referencia visual reamostrada em 0-4s e 51-55s a 4fps, sem executar codigo externo. Player 3120 usa mesma composicao, seek de frame 234 e ausencia de erro conferidos. Reproducao continua no IAB ficou em frame 0 apesar de playing=true; nao declarar realtime verificado. Nao equivale a escuta humana integral ou equivalencia artistica aprovada com o Claude.

Limites: regeneracao instantanea explicitamente ficticia; sem afirmacao clinica. Nao copiar ou inferir pipeline exato da referencia. Sem publicacao, merge ou episodio completo. Proximo: usuario avaliar a unica nova versao antes de expandir. Rollback: reverter commits da branch codex/regeneracao-movimento-novo-20261107 (base d3df50d), na copia BUGASSE-regeneracao; preservar A/B rejeitados, WAV e outros episodios. Midias/logs/imagens locais; codigo/QA/relatorios versionados.


## Correção dos braços — 07/11/2026, V3

Executado: corrigida a trajetória das mãos e limitada a distância ombro–punho a 90–217 px, preservando os comprimentos dos ossos. A mão direita passava quase sobre o ombro: alcance mínimo de 8,397 px e salto de cotovelo de 215,016 px entre quadros em 9,067 s. Agora percorre arco abaixo do ombro; maior passo do cotovelo direito 14,902 px, esquerdo 20,778 px a 30 fps. Também suavizada a saída do balanço da caminhada em 3,05 s. A direção da nova base foi elogiada pelo usuário; a correção V3 ainda aguarda avaliação humana.

Evidência/arquivos: src/remotion/regeneration-fluid/fluidMotion.ts e fluidMotion.test.ts; scripts/qa_regeneration_fluid.py; render-qa-nova-base.json (V3), render-qa-nova-base-v2.json (histórico). Export local out/regeneracao-nova-base-v3.mp4, 12,011 s, 360 frames, 1080×1920/30, H.264/AAC, 2.945.325 bytes; SHA256 d6b13a2444bb089f7022a69b8026eeaeb816fd12ad25ace4ce16b316c5726a89. Player/export mantêm a composição Regeneracao-NovaBase; Player não rechecado nesta revisão.

Testado/logs: 6 testes de movimento passaram (incluem continuidade a 30/60 fps, folga do rosto e apoio fixo das mãos), 17 testes gerais, lint e build passaram. Logs out/regeneracao-bracos-motion-test.log, regeneracao-bracos-general-test.log, regeneracao-bracos-lint.log, regeneracao-bracos-build.log, regeneracao-bracos-qa.log e regeneracao-nova-base-v3-render.log. Decode integral sem erro, sem intervalos pretos. Áudio PCM idêntico ao anterior; -16,54 LUFS e -5,00 dBTP. Revisados contato geral a 2 fps e braços em 8,6–10,4 s a 20 fps (regeneracao-fluid-bracos-v3.jpg), comparados à sequência anterior bracos-antes.jpg. Build mantém avisos preexistentes de tamanho de bundle/import dinâmico.

Limitação/próximo: verificações de trajetória e amostras visuais não garantem ausência de qualquer colisão em futuros gestos. Reaplicar os testes ao alterar poses; avaliar V3 antes de expandir o episódio. Sem nova instalação, serviço pago, geração ou publicação. Arquivos de áudio e exports anteriores preservados. Trabalho isolado em BUGASSE-regeneracao, branch codex/regeneracao-bracos-20261107, base 3997103; rollback por reversão dos commits desta branch, sem tocar na main ou na cópia concorrente.
