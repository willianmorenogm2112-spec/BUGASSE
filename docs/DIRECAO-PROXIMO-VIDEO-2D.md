# Próximo vídeo 2D — direção aprovada em 06/11/2026

O usuário pediu combinar as quatro referências apresentadas e tornou as melhorias padrão persistente para os próximos vídeos em 06/11/2026. Este documento define direção e aceite; sua existência não comprova animação implementada ou vídeo renderizado. Tema atual escolhido: gravidade dobrada por dez segundos, gancho da academia involuntária no sofá. Roteiro e fontes em reports/GRAVIDADE-2D.md.

## Uma identidade, quatro contribuições

| Referência | Técnica a adaptar | Aplicação original no Bugi | Evidência exigida no piloto |
|---|---|---|---|
| Danno/Riggy | Narrador e personagem com vontades diferentes | Charon explica; Puck/Bugi interpreta errado, interrompe com uma pergunta útil e reage à resposta | Um diálogo curto em que a piada ajuda a explicar a causa |
| The Land of Boggs | Atuação legível e comédia por reação | Confiança → suspeita → susto → indignação → resignação; olhos, sobrancelhas, boca, mãos e postura juntos | Antecipação, ação e recuperação sem movimentos repetitivos |
| MinuteEarth | Explicação construída visualmente | O objeto citado aparece no momento da fala; setas, cortes internos e comparação demonstram o mecanismo | Uma frase científica compreensível também pela ação da cena |
| Kurzgesagt | Hierarquia, cor e mudanças de escala | Cenário em camadas, gráfico integrado ao ambiente e transição do cotidiano ao mecanismo | Uma transição motivada entre objeto e diagrama, com leitura clara |

Referências: https://www.youtube.com/watch?v=qYgA2gxzjEk ; https://www.youtube.com/watch?v=N9GbqLImOGA ; https://www.youtube.com/watch?v=aOiH-SSnyHs ; https://www.youtube.com/watch?v=hiIIGMeMEuE . São referências de linguagem; não copiar personagens, enquadramentos, cenas, música ou roteiro. Contagens públicas de visualizações não demonstram causalidade ou retenção.

## Contrato visual e sonoro

- Começar pelo acontecimento, não pela apresentação: problema visível no primeiro segundo e pergunta que a ação começa a responder.
- Atuação específica por cena: olhar, antecipação, esforço, reação e recuperação; não reutilizar balanço automático durante toda fala.
- Cenário por código com primeiro plano, ambiente e fundo, iluminação coerente, texturas discretas, sombras de contato e escala consistente.
- Interação contínua: mão acompanha objeto, pés mantêm apoio e móvel reage ao contato. Nada surge no meio da interação sem apresentação.
- Câmera alterna aberto/detalhe/close conforme informação; gráfico nasce de um objeto da cena e volta à ação. Pausa de leitura antes da reação cômica.
- Sons ligados a causa física e pausas para humor; não pontuar cada movimento. Estas exigências persistem no workflow, mas a evidência de cumprimento é individual por episódio.

- Preservar rig canônico, cabelo coral, roupa, proporção, paleta e cenários 2D construídos por código. Sem migrar para o estilo gráfico de outro canal.
- Remotion controla Player e exportação, 1080×1920 a 30 FPS. Todos os movimentos dependem do frame; tempo local por ação.
- Família de movimento: orgânico, com aterrissagem suave; unidade base de 6 frames. Entradas de apoio em 6–12 frames; reação principal em 12–24 frames. Ajustar ao áudio real, sem impor cortes por cronômetro.
- Transições: corte por ação ou match cut entre objeto e diagrama. Usar a mesma família no episódio. Não empilhar giro, flash e zoom.
- Um foco por plano. Primeiro a ação/objeto, depois o dado, depois a reação. Não disputar a atenção com rosto, gráfico e legenda animando simultaneamente.
- Bugi/Puck: humor adulto coloquial, sarcasmo e palavrão leve pontual quando servir à piada. Narrador/Charon: claro, firme, humor seco. Identificar falas visualmente com coral e ciano/creme, além da voz; não depender apenas de cor.
- Gerar Gemini TTS real e alinhar antes de fechar o timing. Boca acompanha fala; silêncio fecha a boca. Envelope de volume não deve ser descrito como visema fonético.
- Cada fala científica recebe uma ação demonstrativa. Dados com unidade e fonte; simulações e escalas ilustrativas identificadas. Não inventar números para preencher gráficos.
- SFX pontuam contato, mudança de estado e conclusão visual, abaixo da voz; pausas curtas deixam a reação funcionar. Nada de som em todo movimento.
- Respeitar safe zones e espaço de rosto/mãos. Ambiente estabiliza durante leitura; parallax apenas quando coerente com a câmera.

## Aplicação ao próximo roteiro

1. Abrir com a consequência visível no primeiro segundo, sem logo inicial.
2. Bugi oferece uma interpretação confiante e engraçada.
3. Narrador corrige com um mecanismo demonstrado na cena.
4. Bugi tenta uma solução; nova consequência aumenta a situação.
5. Mostrar comparação ou mudança de escala, com até 3–5 informações de apoio no episódio inteiro.
6. Encerrar com resolução científica e payoff que retoma a confiança inicial do Bugi.

Estrutura flexível: a duração segue a explicação e o áudio, sem alongar só para encaixar técnicas. O próximo tema deve manter a linha de hipóteses físicas do canal, salvo pedido expresso diferente.

## Gate antes de produzir o episódio inteiro

Criar piloto de 12 segundos do tema escolhido, contendo diálogo, reação articulada, demonstração e transição. Inspecionar sequência contínua e ouvir o áudio. Verificar pés/mãos ancorados, proporções, continuidade de objetos e recuperação da pose. Só marcar cada referência como aplicada após indicar seus frames no MP4 real.

Registro por beat: fala e speaker; entrada/saída acústica; ação demonstrativa; pose inicial/final; olhar; objeto e contato; dado/fonte; câmera/transição; SFX/origem; legenda; evidência de QA. Não declarar todas as skills usadas por estarem instaladas.

## Estado e rollback

Direção persistente registrada. O estado de implementação de cada episódio é independente deste guia: para a primeira aplicação, consultar reports/GRAVIDADE-2D.md e reports/RENDER-QA.md. Reverter apenas os commits da mudança desejada para desfazer; preservar vídeos publicados e assets anteriores.
