# Modelo proposto para Reels — E Se Bugasse?

Estado: recomendação de pesquisa, ainda sem novo piloto renderizado. Identidade, personagem e tema definidos no kit permanecem como base. Alvo: cartoon 2D articulado, com profundidade por camadas e consequências físicas visualmente claras.

## Direção concreta

- Entrega vertical 1080x1920, 30 FPS. Piloto de 12s antes de episódio de 35–55s.
- Bugi canônico: cabelo coral, jaqueta petróleo, olhos expressivos. Rig com braços/pernas articulados e expressões; narrador externo. Sem boca reagindo à fala como se Bugi fosse o narrador.
- Cenário Google realmente gerado e registrado; camadas separadas quando houver perspectiva/oclusão. Não deslocar uma imagem inteira como substituto de animação.
- Câmera acompanha a consequência: detalhe de contato, plano médio de tentativa, plano aberto de revelação. Troca motivada por ação, não por cronômetro fixo.
- Proposta de timing a testar: antecipação de 4–8 frames; ação principal de 6–15 frames; reação legível de 12–24 frames. São escolhas iniciais de direção, não números medidos nas referências nem regras rígidas.
- Legenda: 2–5 palavras, no máximo duas linhas; 58–72px como ponto de partida em 1080x1920, creme com ênfase ciano/amarela. Medir no preview mobile e manter espaços entre palavras.
- Para conciliar guias conflitantes das skills, começar com texto essencial em x=108–920 e y=220–1320; posicionar por cena para não cobrir rosto, mãos e interação. Isso é uma margem conservadora de trabalho, não especificação oficial universal do Instagram. Validar sobreposição no formato de destino antes da entrega.
- Gráfico científico aparece apenas quando esclarece uma ação. Um vetor, medida ou comparação por vez. Não tornar o vídeo um dashboard.
- Som: voz real; SFX nos eventos físicos; música abaixo da locução. Alvo de mix -14 LUFS integrado e true peak <= -1 dBTP, medidos no arquivo final. Quantidade de SFX é teto e julgamento editorial, não obrigação de sonorizar cada elemento.

## Estrutura do episódio completo

| Intervalo proposto | Função | Imagem necessária |
|---|---|---|
| 0–1s | Gancho visual | Uma regra já falha diante do Bugi |
| 1–5s | Hipótese explícita | A regra muda e o contato físico responde |
| 5–18s | Consequência e tentativa | Bugi tenta resolver e piora a situação |
| 18–32s | Escalada | Novo objeto/interação amplia o problema |
| 32–45s, ajustável até 55s | Explicação e payoff | A lei fica clara e a reação fecha a história |

Os intervalos dependem do áudio real. A frase dita determina o momento da ação e a duração do plano. Não cortar palavras para encaixar uma duração arbitrária.

## Piloto de validação já definido no kit

Tema: atrito desaparece por 5 segundos. Beats-base: caminhada; escorregão; deslize; tentativa de se agarrar; impacto/reação. Antes de gerar roteiro definitivo, formular a premissa: quais contatos perdem atrito, quando a regra volta e que apoios ainda podem exercer força. Não afirmar que um gancho mecânico deixa de funcionar só porque o atrito sumiu. Exageros de alongamento/impacto são convenções cartoon.

O piloto mantém o mapa de 12s do kit como referência inicial e ajusta o timing após TTS. Precisa demonstrar caminhada com contato, mudança de expressão, interação mão/objeto e recuperação. Apenas panorâmica e zoom reprovam.

## Contrato das ferramentas

1. Código gera e coordena animação, câmera, legendas e edição.
2. Gemini TTS produz voz real; imagem Google produz cenários. Registrar modelo, prompt, URI, hash e falha; estes assets não são geometria escrita 100% em código.
3. Remotion apresenta e exporta a mesma composição. Corrigir o caminho paralelo de HTML do piloto anterior antes de usá-lo como prova de qualidade.
4. HyperFrames: procurar no catálogo, estudar e, quando houver ganho, gerar overlay/infográfico como asset com paridade verificada. Não trocar o motor principal do BUGASSE.
5. Skill Reel: manter upstream intacto; aplicar critérios de áudio, timing e QA por adaptação ao personagem. Não rodar face tracking humano no Bugi.
6. FilmCraft: acabamento opcional; exigir arquivo de entrada correto, versão/CLI e operação testada. Não escolher MP4 de outro episódio como fallback.

## Aceite para avançar ao episódio completo

MP4 real, mesma composição do Player, narração audível sem cortes, fundo Google efetivamente usado, cinco beats com atuação, integridade técnica, escuta, inspeção contínua e revisão artística registrada separadamente. Skills presentes e testes unitários verdes não substituem esse aceite.

Arquivos/fontes/evidências e limites da pesquisa: PESQUISA-REELS-CODIGO.md. Próxima etapa de produção: aplicar esta direção no piloto, sem nova instalação ou mudança de estilo presumida.
