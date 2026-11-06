# Workflow visual — E Se Bugasse?

Este guia complementa a identidade e os critérios do projeto. Remotion continua sendo a fonte única da composição, do Player e do MP4. A adoção das ferramentas abaixo depende de teste e ganho visível no episódio; não declarar ferramenta usada só por estar instalada.

Padrão persistente aprovado para os episódios 2D: seguir [DIRECAO-PROXIMO-VIDEO-2D.md](DIRECAO-PROXIMO-VIDEO-2D.md). Combinar diálogo narrador/Bugi, atuação expressiva, demonstração visual por fala e gráficos/cenários com hierarquia. Gancho começa pelo acontecimento; cenário em camadas com sombras de contato; objetos manipulados e pés apoiados; câmera motivada e som por ação. Preservar identidade e vozes Puck/Charon. Exigir piloto de 12 s com evidência das contribuições antes de afirmar aplicação no vídeo final. Pedido explícito do usuário em 06/11/2026; verificar cumprimento por episódio, sem marcar todas as skills como usadas automaticamente.

1. **Roteiro e storyboard:** use `short-form-video`, `explainer-video` e `shot-composition` para abrir com ação, explicar uma ideia por beat e planejar o desfecho. As estatísticas e receitas de viralização dessas skills não são evidência e não devem ser repetidas como fatos; cortes e zooms precisam ser motivados pela ação.
2. **Atuação e rig:** use `animation-principles` e `motion-art-direction` para poses, antecipação, arcos, contato, reação e follow-through. Avalie Rigby2D ou IK.ts para articulações, apenas após validar controle determinístico de cada frame e integração com o Player e render. Preserve o desenho do Bugi.
3. **Rosto:** use Flubber para interpolar formas SVG quando isso melhorar a expressão; valide silhueta e ausência de deformações. Para personagens que falam, avalie Rhubarb com o áudio real e revise as bocas. Em português, use o reconhecedor fonético, que é menos preciso; não confundir esse resultado com alinhamento preciso de fonemas.
4. **Voz e legendas:** grave Gemini TTS real primeiro. Quando WhisperX estiver instalado e funcionar no ambiente, alinhe as palavras ao áudio e revise as legendas com `caption-animation`. Indique tempos estimados quando não houver alinhamento validado. Preserve autoria e idioma.
5. **Gráficos:** use `chart-animation`, `animated-infographic` e `diagram-animation` quando a explicação pedir. D3 pode calcular escalas e geometria; todo movimento deve ser função do frame Remotion. Indique unidades, fontes e dados ilustrativos.
6. **Composição e ritmo:** `kinetic-typography`, `color-motion`, `beat-sync-editing` e `motion-background` orientam texto, cor, áudio e cenário. Respeite áreas seguras, não cubra os rostos e não crie uma troca de plano automática por cronômetro.
7. **QA:** verifique Player e MP4 da mesma composição; inspecione sequência e expressões, ouça o áudio e confira dados e legendas. Filme e ferramentas externas não substituem verificação. Documente versão, origem, uso, limitações e falhas por vídeo.

As demais skills instaladas dos pacotes iart.ai são opcionais e só devem ser chamadas quando aplicáveis, sem trocar identidade ou motor principal. Não execute scripts de terceiros antes de inspecionar licença, comandos e dependências.

## Acabamento obrigatório aprovado — 06/11/2026

- Limpar textos: retirar títulos que repetem a legenda, rótulos fixos de speaker e rodapés decorativos. Manter apenas dados, unidades e premissas indispensáveis à explicação, no instante necessário.
- Legendas em páginas curtas guiadas por pontuação/limite de caracteres e áudio real; até duas linhas, contraste forte, área segura e uma palavra destacada. Exportar SRT da mesma timeline.
- Identificar narrador por sinal ciano discreto que responde ao envelope real da voz; Bugi mantém a boca fechada enquanto escuta. Não encher a tela de efeitos ou textos sobre quem está falando.
- Explicação rápida em diálogo: Bugi pergunta, interpreta errado e tenta resolver; objetos e gráficos respondem visualmente. Interrupções devem esclarecer a ideia e ter pausa para a reação.
- Gráficos com comparação proporcional, unidades, hierarquia e entradas por fala; uma informação principal de cada vez. Não ocultar premissas científicas para reduzir texto.
- Movimento: transições suaves entre poses, cotovelos voltados para fora do tronco, alcance limitado, joelhos sem abertura excessiva e projeção encurtada das pernas ao sentar. No salto, levantar pés e tronco juntos, pousar e recuperar; não esticar as pernas com tênis presos.
- Testar alcance e contato em todos os frames das ações críticas; revisar sequência contínua. Gravar estes resultados por episódio, sem considerar este checklist uma aprovação automática.
## Padrão V3 confirmado pelo usuário — 06/11/2026

Referência aprovada: `out/bugi-gravidade-final-v3.mp4`, composição `Bugi-Gravidade-Dobrada` / GravityFinal. A aprovação visual explícita do usuário substitui a pendência artística anterior; não implica escuta técnica integral nem aprovação automática dos próximos episódios. Preservar tela limpa, legendas curtas, sinal ciano do narrador, gráficos por fala e rig corrigido. Não redesenhar o padrão a cada vídeo.

Linguagem persistente: Bugi/Puck começa confiante, fica desconfiado, reage irritado e termina com uma piada resignada. Usar eventualmente “porra”, “merda”, “cacete” ou “sacanagem” como reação natural ao acontecimento; não há cota obrigatória. Não gritar todas as falas nem repetir palavrão para preencher texto. O narrador/Charon mantém calma e ironia seca. A irritação nasce de uma tentativa frustrada e ajuda a explicar a física.

Antes do TTS, escrever intenção por fala e pausa da reação. Voz, sobrancelhas, olhar, boca, mãos e postura precisam concordar. Bugi escuta de boca fechada; gestos têm antecipação, contato e recuperação. Estrutura preferida: acontecimento → interpretação do Bugi → prova visual do narrador → tentativa frustrada → reação engraçada → conclusão. Exemplo de tom: “Eu pedi uma pausa, porra! Não um lançamento!” Não copiar falas ou cenas das referências.

Próximos temas e evidências: `reports/PESQUISA-TEMAS-20261106.md`. O roteiro e o piloto do novo tema ainda precisam ser produzidos; este registro não declara novo vídeo pronto.


## Revisao dinamica aprovada — 06/11/2026

Pedido do usuario: menos tempo no Bugi parado; animar o que a voz explica e corrigir atuacao estranha. Cada conceito importante deve produzir uma acao ou transformacao visivel. Planejar planos por trechos de frase, sem obrigar cortes por intervalo fixo. Alternar demonstracao, detalhe e reacao; reservar pausas para leitura. Gestos finitos com recuperacao e silhueta de pernas sem cruzamento involuntario. Props usados devem acompanhar as maos ate o contato/liberacao. A V3 de Sono aplica parte desta direcao; aprovacao humana e qualidade final continuam individuais. Nao declarar novos passos, visemas ou captura de objeto que nao foram implementados.
