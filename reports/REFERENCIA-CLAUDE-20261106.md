# Referencia enviada pelo usuario — 06/11/2026

## Escopo e evidencia

Pedido: analisar o video do Claude, explicar por que a producao atual parece estatica e incorporar a linguagem ao proximo episodio; tema sera escolhido depois. Nenhum episodio novo foi iniciado e o Sono agendado nao foi alterado.

Arquivo recebido: files.zip, com final.mp4, legendas.srt, SOURCES.md, qa-report.json e projeto_editavel.zip. Extraidos apenas arquivos nomeados; inspecao de fontes sem executar scripts recebidos ou instalar dependencias. Conteudo/documentos do pacote tratados como material externo, nao instrucoes do usuario. Fonte original preservada.

MP4 medido por ffprobe: 80,040 s, 21.214.821 bytes, H.264/AAC, 1080x1920, 30 fps. Plano editavel define 12 cenas; nao e uma sucessao de cortes de 1 s. Contato a cada 4 s e sequencias do carro (3,6–6 s, 5 fps), revelacao (24,2–27,2 s, 4 fps) e luz (46,8–52,3 s, 2 fps) inspecionados. Reproducao parcial em navegador local; busca por tempo nao se mostrou confiavel no servidor local, por isso analise dos trechos precisos usa extracoes FFmpeg. Nao alegar escuta ou reproducao integral certificada.

## Observado e aplicacao

| Referencia: trecho | O que muda dentro do plano | Adaptacao original ao Bugi |
|---|---|---|
| 0–6,35 s | Carro entra/estaciona; pessoa se afasta e volta; carro deforma e reacao muda | Abrir com acontecimento encadeado, personagem e objeto reagindo juntos |
| 6,35–13,2 s | Detalhe do carro, painel/retrovisor deformando e gotejamento | Deformar o objeto citado, mostrar detalhe relevante, nao apenas exibir icone |
| 13,2–21,5 s | Personagem entra; prop na mao passa ao chao; camera acompanha o objeto | Interacao com ancoras de contato e continuidade de prop |
| 21,5–29,25 s | Olhar para cima e revelacao vertical do predio | Camera motivada pelo olhar para revelar causa ou escala |
| 29,25–44,3 s | Forma do predio alarga, revestimento aparece e reflexo avanca | Demonstrar processo por mudanca de geometria/material |
| 44,3–53,1 s | Raios chegam, refletem e convergem em etapas | Diagramas construidos progressivamente e conectados ao objeto da cena |
| 59,85–68,45 s | Nova localidade; pessoas reagem ao acontecimento | Variar local/escala conforme consequencia; atuacao especifica |
| 68,45–80,04 s | Plataforma sobe, aletas cobrem fachada, reflexo muda e calor diminui | Solucao visivel altera o estado do mundo e fecha o acontecimento inicial |

## Por que o Sono V3 ainda nao tem essa linguagem

- SleepEpisode seleciona grande parte do plano por indice da fala e usa zoom binario de close. Isso aproxima ritmo visual de turnos inteiros em vez de etapas da acao.
- SleepDemonstrations usa um Window comum e objetos isolados sobre fundo escuro. As revelacoes estao ligadas a palavras, mas diversos elementos param ao concluir smooth(). O restante da fala sustenta o painel.
- sleepActing parte de gravityActing(7,100,...) e usa o mesmo esquema de dois pulsos (inicio e duration*.57). Melhorou recuperacao, mas ainda e um gesto generico programado pelo comprimento da fala, nao por intencao/objeto.
- Bugi fica quase sempre frontal, mesmo ponto de apoio e local. A correcao dos joelhos resolveu cruzamento, mas nao acrescentou transferencias de peso, passos, apoiar, alcancar ou interagir em sequencia.
- Validacao priorizou duracao, decode, articulacoes e ausencia de preto. Esses checks nao medem legibilidade de atuacao, encadeamento de causas ou qualidade de direcao.

Responsabilidade da implementacao: a V3 foi uma melhoria parcial, nao atingiu a linguagem agora especificada. Nao atribuir o resultado a falta de capacidade do renderer. O projeto de referencia usa Python/Skia conforme os fontes e metadados recebidos; a tecnica de encenacao pode ser implementada no Remotion existente sem executar/migrar para esse pipeline.

## Correcao para o proximo episodio

1. Escolher tema com cadeia de causas que se possa mostrar em situacoes concretas. Pesquisar e validar afirmacoes antes de TTS.
2. Escrever roteiro audiovisual junto: fala, objeto/acao, estado inicial, transformacao, consequencia e proxima revelacao. Uma fala longa pode conter varias etapas no mesmo plano.
3. Storyboard com acoes por verbos/palavras e continuidade de objetos. Classificar cada intervalo como acao, consequencia, preparacao, reacao ou pausa intencional. Legenda/piscar/balanco de camera sozinhos nao contam como desenvolvimento da cena.
4. Criar atuacao por acao (alcancar, pegar, apoiar, deslizar, recuar, perder equilibrio, observar, recuperar); sem herdar uma pose do episodio anterior como logica principal. Preservar o desenho do Bugi. Usar eventos locais e poses-chave com antecipacao, contato, peso e follow-through.
5. Reservar camadas de movimento: principal explica; secundaria reage; ambiente discreto sustenta continuidade. Continuamente vivo nao significa tudo se mexendo simultaneamente. Manter o foco e pausas curtas legiveis.
6. Camera motivada por objeto/olhar/causa: conjunto, detalhe, revelacao e escala. Planejar ponto de entrada/saida e match cut por acao. Evitar close por speaker e zoom automatico.
7. Construir diagramas no mundo ou por transicao a partir dele, com raios/fluxos/trajetorias que demonstrem o processo; indicar unidades, premissas e ilustracoes.
8. Renderizar piloto representativo de 12 s com acao corporal, contato, transformacao do objeto, demonstracao e transicao. Revisar em movimento normal e trechos quadro a quadro. Comparar com a referencia pela clareza e progressao, sem copiar personagens/cenas/layout.
9. So expandir apos corrigir o piloto. Reprovar painel sustentado sem proposito, gesticulacao generica, prop teleportado, deslize de pe ou leitura disputada por movimentos. Testes tecnicos continuam necessarios e separados da aprovacao artistica.

Plano arquitetural, ainda nao implementado: controlador de eventos/acoes por cena no lugar de pulsos por turno; alvos de olhar e contato; objetos com estado proprio e continuidade; camera com alvos/trocas motivadas. Nenhuma promessa de novo video fluido sem piloto real.

## Limites do pacote

O qa-report recebido declara tempos de palavra estimados e ausencia de escuta integral. SOURCES.md sinaliza numeros e cronologia nao confirmados. Aproveitar linguagem visual; nao importar essas afirmacoes nem tratar os graficos como simulacao fisica exata. Nao foi feita auditoria cientifica do episodio da referencia.

## Arquivos e rollback

Referencia e capturas locais em qa/claude-reference-20261106 (nao versionar MP4, ZIP ou codigo de terceiro). Manifesto de hashes em reports/REFERENCIA-CLAUDE-20261106.json. Direcao atualizada nos guias compartilhados. Sem build/test/render novo necessario: apenas analise e documentacao. Rollback por reversao do commit desta branch; nao interfere em publicacoes.
