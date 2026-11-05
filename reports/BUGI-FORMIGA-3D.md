# Bugi do tamanho de uma formiga — produção 3D

## Implementado

- Branch codex/bugi-3d-formiga-20261105, base 109ad78.
- Roteiro em bugi-3d/kit/projects/bugi-formiga/roteiro.md com fontes OpenStax e premissa fictícia explícita.
- Charon real: download Generated Audio November 05, 2026 - 9_07AM.wav. Puck real: download seguinte. Modelo observado gemini-3.8-flash-tts; direção de estilo aplicada individualmente. Cobrança não informada pelo site.
- Alinhamento WhisperX acústico: 16 turnos, 213 palavras, 77,437 s. Script anterior parametrizado preservando defaults do episódio Tempo.
- Piloto técnico 12 s e episódio de 22 planos: bancada, caneca, gota, migalha e formiga composta por geometria.
- Corrigida função chavesVec ausente no motor do kit. Configuração fog.far explícita na troca de ambiente.
- Cena Three.js intermediária a 30 FPS; composição Remotion Ant3DRoot usa o mesmo MP4, voz normalizada e legendas em Player/export.

## Verificação

- Lint passou; cobertura de skills 57/57.
- 44 quadros do episódio foram produzidos; inspeção amostrada de abertura e formiga.
- Validador do storyboard passou após adicionar oscilação da gota, vapor de café e corrente de ar na explicação de troca de calor. Avisos: número de títulos e pergunta final ausente.
- Primeiro check do kit reprovou densidade de animação; não foi apresentado como sucesso.

## Limitações artísticas

Materiais claros demais, cabelo cônico, rig ainda básico. Não há encolhimento contínuo, pegada real de migalha nem simulação de tensão superficial. A gota é representação geométrica; a formiga usa movimento procedural simplificado. Legendas acústicas não significam visemas fonéticos. Cinco SFX procedurais originais foram misturados discretamente, mas falta refinamento de desenho sonoro e escuta integral certificada. O episódio deve ser apresentado como primeira versão para revisão, sem alegar qualidade final aprovada.

## Próximo refinamento

Corrigir luz/contraste local, melhorar caneca e cabelo, animar contato da formiga com a migalha, variar atuação por frase e finalizar SFX. Publicação depende de pedido específico do usuário.
