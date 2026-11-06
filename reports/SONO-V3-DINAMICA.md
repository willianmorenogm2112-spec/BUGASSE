# Sono V3 — explicacao em movimento

Pedido autorizado: adaptar o episodio existente, preservando vozes e estilo. Base 5d80d92, branch codex/sono-direcao-dinamica-20261106. V1 e V2 preservadas.

## Implementado

- Nove demonstracoes vetoriais por palavras da mesma timeline acustica: agenda, atencao/memoria/erro, releitura, passagem de tempo/resposta atrasada/comparacao, microssono, cafe/alerta, variacao individual, risco e funcionamento cerebro/corpo.
- Retorno ao Bugi na piada da releitura e antes de devolver a cama.
- Joelhos com ramo externo do IK: remove cruzamento involuntario. Dois gestos curtos com recuperacao em vez de sustentar pose durante a fala inteira. Olhar percorre a leitura.
- Caneca acompanha a mao no turno 11; chave acompanha a mao e desce ate a mesa na palavra aqui. Nao foi implementado beber nem locomocao nova.
- Vozes, mix e SRT preservados. Nenhuma geracao paga nova. Cenarios e graficos originais em SVG; nenhuma imagem Google nova alegada.

## Evidencias e verificacao

Lint, 17 testes gerais, 7 testes de movimento e build passaram. Build com avisos anteriores de Vite/import/bundle. Testes novos verificam joelhos sem cruzamento no episodio inteiro e recuperacao de gesto dentro de fala longa.

Piloto de revisao: frames 780–1139 da mesma composicao, 12,011 s. Primeira amostra revelou partes do Bugi nas bordas do painel; corrigido preenchendo o plano inteiro. Amostra revisada out/bugi-sono-v3-amostra-revisada-12s.mp4 decodificada sem erros e contact sheet revisada. Player reproduzido parcialmente na porta 3114; host sob carga exibiu FPS baixo, portanto nao certifica fluidez em tempo real ou escuta integral.

Arquivos: src/remotion/sleep/SleepDemonstrations.tsx, SleepEpisode.tsx, sleepMotion.ts/test.ts; public/assets/sono/storyboard-v3.json; scripts/qa_sleep_v3.py. Logs: out/sono-v3-piloto-render.log, sono-v3-piloto-revisado-render.log, sono-v3-render.log. QA final em render-qa-v3.json apos exportacao.

## Limites

Ilustracoes de mecanismos, nao simulacao clinica. Resposta atrasada sem escala de tempo individual; trajetorias nao representam dados. A boca continua por envelope, sem visemas foneticos. Nao houve novo ciclo de caminhada ou redesenho do rig. Escuta humana integral e aprovacao artistica pendentes. Sem publicacao.

## Rollback

Reverter os commits desta branch e abrir a V2 preservada; nao apagar audios, renders ou dados anteriores.


## Sono V3 dinamico — 06/11/2026

Executado: novas demonstracoes por fala e atuacao revisada; MP4 integral exportado. Evidencias/arquivos/logs: reports/SONO-V3-DINAMICA.md, public/assets/sono/render-qa-v3.json e storyboard-v3.json; out/bugi-nunca-dormir-v3.mp4, sono-v3-*.jpg e logs. Lint/build, 17 testes gerais e 7 de movimento passaram. Exportacao Remotion 4.0.540: 153,173 s, 17.089.680 bytes, H.264/AAC 1080x1920/30, 4595 frames. Decode sem erros, blackdetect sem intervalos; -16,58 LUFS e -4,63 dBTP. Revisao visual amostrada e reproducao parcial do Player; escuta humana integral e aprovacao artistica pendentes. Sem chamadas pagas novas ou publicacao. Vozes/mix/SRT e V2 preservados. Rollback: reverter commits de codex/sono-direcao-dinamica-20261106, base 5d80d92.


| Funcionalidade | Implementado | Testado | Evidencia | Bloqueio |
|---|---|---|---|---|
| Demonstracoes por fala | Sim, 9 turnos | Render/piloto/contact sheet | SleepDemonstrations.tsx e storyboard-v3.json | Aprovacao artistica pendente |
| Joelhos e gestos | Sim | 7 testes de movimento | sleepMotion.test.ts, quadros do Bugi | Sem locomocao nova |
| Props ligados a mao | Caneca/chave | Sequencia/quadros do MP4 | sono-v3-cafe.png, sono-v3-chave-sequencia.jpg | Nao inclui beber |
| Voz e export | Audio existente preservado | Decode, ffprobe, loudness | render-qa-v3.json | Escuta humana integral pendente |

Comandos executados: npm run lint; npm test; npm run build; npx tsx --test src/remotion/sleep/sleepMotion.test.ts; npx remotion render src/remotion/SleepRoot.tsx Bugi-Nunca-Mais-Dormir out/bugi-nunca-dormir-v3.mp4 --concurrency=4 --log=error; python scripts/qa_sleep_v3.py. Render inicial com restricoes falhou ao iniciar navegador; render local autorizado funcionou. Custo novo: nenhuma chamada de geracao; custos historicos de TTS nao informados.
