# A Terra para por 1 segundo — producao 2D

## Pedido, premissa e fontes

Usuario escolheu este tema apos aprovar a linguagem de encenacao do video do Claude. Produzir no checkout existente, com Bugi/Puck e narrador/Charon, Remotion unico e cenarios SVG originais. Publicacao deste episodio nao autorizada.

Premissa ficcional explicita: superficie freada abruptamente por 1 s; objetos livres e ar nao recebem o mesmo freio magico. O mecanismo de parada/retomada e suspenso pela hipotese. Nao se trata de desligar gravidade nem orbita. Escala cartoon e camera lenta indicadas no gancho; nao prever danos ou trajetorias reais.

Fontes NASA conferidas: https://imagine.gsfc.nasa.gov/ask_astro/earth.html (circunferencia 40.075,036 km, periodo sideral 86.164,09053 s, fator cosseno da latitude); https://spdf.gsfc.nasa.gov/pub/documents/archived_websites/pwg.gsfc.nasa.gov/stargaze/StarFAQ6.htm (pergunta 108, parada hipotetica/inercia e impossibilidade de freio real sem grandes forcas). Fontes/detalhes em public/assets/terra-1s/sources.json. Velocidade equatorial arredondada na voz: 1.670 km/h; conta idealizada 1670/3,6 x 1 s = 463,9 m, apresentada como aproximadamente 460 m. Nao e trajetoria com atrito, arrasto ou colisoes; nao extrapolar cenario permanente para um segundo.

## Roteiro e storyboard

198 palavras, 14 turnos; texto canonico em script.json e textos por speaker. Gancho com parada/perda de apoio/caneca; retorno a instantes antes; repeticao explicativa; tentativa de apoio no poste; analogia do onibus; globo/velocidade/latitude; distancia na rua; confusao no ambiente; gravidade/orbita distintas; payoff das ferias.

Storyboard por fala com frames acusticos em storyboard.json. Acoes nao sao pulsos por comprimento de fala: carregar, frear, deslocar, apoiar, apontar, correr e recuperar tem controle local. Reutiliza desenho canonico do Bugi, sem atuar a partir de gravityActing do episodio anterior. Caneca presa a coordenada transformada do punho antes da liberacao. Rua com camadas, lojas, toldos, nuvens, luz, calcada, poste e sombras; camera e mundo acompanham o deslocamento. Ambiente ilustrativo, nao geografia real.

## Audio real e origem

Gemini 3.8 Flash TTS, gerado pela UI do Google AI Studio na sessao conectada, sem configurar nova API paga. Charon: narrador-charon.wav, 61,880 s; Puck: bugi-puck.wav, 21,000 s; PCM mono 24 kHz. Downloads originais preservados. Encaminhamento de download do navegador nao retornou evento, mas os WAVs foram encontrados em Downloads, copiados e medidos. Nao confundir com falha de geracao.

WhisperX alinhou acusticamente 147 palavras do narrador e 51 do Bugi. Montagem real 79,852 s, 48 kHz, sem acelerar falas ou cortar palavras. 64 paginas de legenda/SRT e captions.json derivados da mesma timeline. ASR independente faster-whisper-base sobre mix completo em asr-audit.json confirma sequencia geral; erros de reconhecimento nao sao transcricao humana. Boca responde ao envelope dentro da fala do Bugi, sem alegar visemas foneticos. 5 SFX procedurais originais discretos; sem musica externa. Custos cobrados nao informados: null. Proveniencia e hashes em provenance.json.

## Piloto e correcoes observadas

Piloto V1 real de 12,011 s, 2.343.413 bytes, H.264/AAC 1080x1920/30; decode sem erros. Inspecao mostrou pose do deslize sustentada cedo demais e ambiguidade temporal ao voltar a fala do cafe. V2 amplia evolucao dos membros/olhar/corpo durante a acao, continua deslocamento/camera, solta caneca em ancora de mao e identifica INSTANTES ANTES. V2 exportado, decodificado sem erros e contato a 2 fps revisado. Reproducao parcial no Player porta 3117 sob carga (FPS reduzido); nao certifica fluidez em tempo real nem escuta integral.

Inspecao de quadro do globo motivou retirar contador transitorio de velocidade para nao aparentar valores fisicos intermediarios e remover seta contraditoria. Revisao da explicacao final troca contorno ao redor da Terra por esquema Terra ao redor do Sol, distinguindo orbita de rotacao; essa correcao exige export final V2, sem sobrescrever V1.

## Validacao

Lint passou. 17 testes gerais e 4 testes especificos passaram; build passou com avisos preexistentes de Vite/import dinâmico/bundle. Novos testes verificam comprimento dos bracos, solas em apoio ao carregar, evolucao de pose no deslize, ancora da caneca e dependencia da velocidade com latitude. Isso nao substitui revisao artistica. Comandos: npm run lint; npm test; npm run build; npx tsx --test src/remotion/earthstop/earthMotion.test.ts; Remotion CLI para piloto/still/export; align_earthstop.py, mix_earthstop.py, earthstop_captions.ts e audit_earthstop_audio.py.

## Arquivos, limite e rollback

src/remotion/EarthStopRoot.tsx e earthstop/*; public/assets/terra-1s/*; scripts/*earthstop*; out/terra-1s-*.mp4/jpg e logs de render. Relatorio final de formato/audio/hash em render-qa.json apos export. Cenário generationSource=original_svg_code; nenhuma imagem Google, HyperFrames, FilmCraft ou PhotoCraft alegados. Skills aplicadas: producao E Se Bugasse, Remotion create/markup/render/captions, animation-principles e motion-art-direction. Nenhum codigo do ZIP externo executado ou copiado como pipeline.

Pendencias: QA final do MP4, escuta humana integral e aprovacao artistica. Estado honesto: producao local, sem publicacao. A aprovacao da referencia nao aprova este resultado. Rollback: reverter commits de codex/terra-para-1s-20261106; preservar WAVs e versoes anteriores, agendamentos do Sono e dados existentes.

## Retomada e defeito detectado — 07/11/2026

O V2 terminou, mas a inspecao real do MP4 encontrou turnos 9–13 reduzidos a um Bugi em recuperacao, sem as demonstracoes prometidas. Nao e uma entrega aprovada. Mantido como evidencia; V3 restaura corrida em direcao ao polo, latitude/velocidade, ar/agua, relogio, distincao gravidade/orbita com Sol e Terra e payoff da mala/pausa cancelada. Tambem usa cupAnchor na soltura da caneca e explicita o retorno a INSTANTES ANTES. Nao basta confiar na descricao anterior ou na existencia do arquivo exportado.

Validacao na retomada: 17 testes gerais e 4 especificos de movimento passaram. O lint geral agora encontra 8 erros nos arquivos locais nao versionados src/remotion/claude-style/ClaudeStylePilot.tsx e PainEpisode.tsx (handAngleDeg e campos de legenda ausentes). Nenhum erro reportado nos arquivos earthstop; trabalho externo preservado. Nao declarar lint global aprovado nesta entrega. Render e QA da V3 sao registrados abaixo quando concluidos.


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
