# Tempo parado — roteiro e direção

Estado: vídeo completo em revisão. Após falha inicial HTTP 403, nova tentativa gerou WAV real. Bugi Puck 34,64 s; narrador Charon 68,04 s no AI Studio gemini-3.8-flash-tts. Cobrança desconhecida. Montagem acústica final 94,553 s, 18 turnos, 263 palavras. Originais preservados em public/assets/tempo-interacao. Não publicado.

## Direção

Bugi: Puck, PT-BR, jovem adulto, sonolento → convencido → indignado → resignado. Boca ativa somente nas suas falas, abertura guiada pelo RMS do WAV, balão creme com contorno coral e identificação BUGI. Narrador: Charon selecionado e confirmado no catálogo, PT-BR, seco, irônico, articulado; legendas ciano identificadas NARRADOR. Durante narração Bugi reage sem mexer a boca. Câmera corta por ação, sem zoom automático. O Puck foi gerado sem instrução de estilo personalizada na tentativa que funcionou; não afirmar direção vocal aplicada onde ela não foi enviada.

## Fontes, assets e limites

Luz chegando à retina: https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work . Movimento respiratório: https://www.nhlbi.nih.gov/health/lungs/breathing-benefits . Fontes sustentam mecanismos comuns, não a possibilidade física de parar o tempo. Toda extrapolação é condicionada às regras fictícias. Cenário/objetos SVG autorais conforme preferência do usuário; não há imagem Google neste episódio. SFX originais determinísticos, gerados por finalize_time_audio.py; cliques adicionais reutilizam SFX procedurais do piloto, sem samples comerciais. Fonte Plus Jakarta Sans local já usada no projeto. Sem nova instalação.

Arquivos: src/remotion/time/TimeDialogue.tsx e TimeDialogueRoot.tsx. Scripts prepare_time_dialogue.py e finalize_time_audio.py reproduzem alinhamento/montagem e envelope/SFX/SRT. Mesma composição para Studio e export. Rollback: reverter apenas commits da branch codex/tempo-interacao-20261105; originais e mídias anteriores preservados.

QA: lint passou; três stills reais inspecionados. Corrigida legenda que piscava entre palavras; rig mantém coordenadas canônicas. Não há certificação de escuta humana completa nem de equivalência ao acabamento da referência. Abertura de boca é aproximação por energia, não alinhamento de fonemas. Contato manual com despertador e xícara ainda é limitado: não declarar rig com interação perfeita. QA artístico final pendente.

Hipótese impossível: corpo de Bugi funciona enquanto ambiente está congelado. Consequências condicionais, não simulação física estabelecida. Duração só será definida após WAV real e alinhamento acústico; alvo aproximado 90–110 s.

## Diálogo

NARRADOR: Você parou o tempo pra dormir mais cinco minutos. Parabéns. Agora tenta respirar.

BUGI: Só mais cinco minutinhos. Hoje eu vou dormir até o despertador pedir desculpa!

NARRADOR: O relógio travou. O café ficou suspenso. E o vizinho finalmente calou a boca. Mas vamos combinar uma regra: o corpo do Bugi continua funcionando. Senão ele também parava e nem percebia a diferença.

BUGI: Ué. Cadê o ar?

NARRADOR: Respirar depende de ar entrando e saindo dos pulmões. Se o ar ao redor ficou imóvel, seu poder precisa de uma exceção para deixar você respirar.

BUGI: Pô, então libera o ar também!

NARRADOR: Primeira cláusula: uma região de ar pode se mover com você.

BUGI: Respirando. Agora sim, vantagem!

NARRADOR: Agora tenta enxergar. A luz precisa chegar aos seus olhos. Se ela também parou, o cenário congelado dos filmes precisa de mais uma exceção.

BUGI: Tá de sacanagem. Eu parei o tempo ou cortei a energia? Libera a luz, cacete!

NARRADOR: Segunda cláusula: luz funcionando. E os olhos precisam continuar recebendo e processando essa luz.

BUGI: Agora um cafezinho.

NARRADOR: Inclinar a xícara não faz um líquido escorrer se ele continua congelado no tempo.

BUGI: Ah, não! Até o café precisa de autorização?

NARRADOR: Exatamente. E onde termina essa autorização? Na sua mão? Na roupa? No chão? No ar que você empurra ao andar? Cada interação exige definir o que o poder libera.

BUGI: Meu superpoder virou um contrato com oitenta cláusulas!

NARRADOR: Para funcionar como nos filmes, esse poder precisa selecionar o que continua acontecendo ao seu redor. O Bugi considerou todas as vantagens... e ligou o tempo de novo.

BUGI: Quer saber? Me dá só o botão de soneca.

## Storyboard e som

## Export entregue v2

`out/bugi-tempo-dialogo-v2.mp4`: 94,848 s, 12.385.924 bytes, H.264 1080×1920/30, AAC. Render direto Remotion da mesma composição com mix-final.wav; decodificação integral FFmpeg sem erros. SHA-256 79B28A39FD7FEDB1DE2AACD831E75CEAFB35C9DE09425DDB23BE2C8ED5C0280B. Mix medido na versão anterior com a mesma faixa: -16,5 LUFS, -1,9 dBTP. Stills de café e contrato v2 inspecionados. Personagem reduzido nessas explicações para desobstruir objetos; ainda há pequena sobreposição do cabelo com o rodapé interno do painel de café. Status: revisão do usuário, sem publicação; não equivale a aprovação artística integral. PR https://github.com/willianmorenogm2112-spec/BUGASSE/pull/4 .

Despertador e quarto em camadas; mão toca botão com contato real. Corte seco do ruído ambiente ao congelar. Café e gotas imóveis permanecem em posições fixas. Bugi tenta inspirar; diagrama de pulmão mostra ausência de fluxo sem representar fisiologia quantitativa. Fluxo de ar retoma com a exceção. Cena escurece na explicação da luz; fótons avançam somente quando liberados. Xícara inclina, líquido mantém a regra indicada. Cláusulas acumulam como gag visual. Retomada final: gotas caem, alarme e ambiente voltam. Sem publicar automaticamente.
