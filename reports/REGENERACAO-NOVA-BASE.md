# Regeneração — nova base após rejeição dos pilotos A/B

## Pedido e limite da entrega

Usuário rejeitou ambos os pilotos: pediu o movimento do vídeo do Claude, não outra variação dos controles anteriores. Autorizou uma única nova versão. Escopo: piloto de 12 s com o mesmo áudio enviado; não episódio completo/publicação. A/B continuam preservados como tentativas rejeitadas, sem escolher vencedor.

## Comparação concreta com a referência

Arquivo dor_final.mp4 original preservado. Novas amostras 0–4 s e 51–55 s, ambas 4 fps, em out/reference/dor-abertura.jpg e dor-movimento.jpg. Abertura tem gesto simples, pequenas reações de rosto e poses sustentadas; não justifica preencher tudo com movimentos aleatórios. No segundo trecho, osso e articulação mudam de orientação/geometria e a cena retorna ao personagem andando. Priorizar membros legíveis, deformação do objeto e continuidade.

O ZIP anterior permite estudar uma construção simples por partes e ângulos; foi lido como fonte externa, sem executar nem importar código. Não há comprovação de que esse ZIP seja o pipeline exato do dor_final.mp4. Não atribuir a diferença a uma IA ou backend com base apenas no MP4. Não copiar personagens, cenários ou layout da referência.

## O que efetivamente mudou

Nova composição Regeneracao-NovaBase, registrada em src/remotion/RegenerationFluidRoot.tsx. fluidMotion.ts / FluidPilot.tsx não importam computeBugiArticulatedKinematics, earthActing, regenPose ou os tracks A/B. Puppet próprio em coordenadas do cenário: quadril, peito, pescoço, cabeça e cadeias de membros independentes. Tronco é caminho Bézier deformável entre peito e quadril, não SVG inteiro rotacionado. A identidade usa cabelo coral derivado do desenho local, olhos escuros, jaqueta petróleo/ciano, camiseta creme, emblema e tênis claros; rearticulação vetorial mais simples, sujeita à avaliação visual do usuário.

Interpolação cúbica com velocidades compartilhadas entre poses adjacentes; não interrompe toda trajetória em cada keyframe. Passos cicloidais separados de apoios; mãos têm alvos fixos durante contato; cabeça e cabelo completam reação em tempos diferentes. Bonecos e objetos são determinísticos por frame Remotion. Anatomia e colisão são estilizadas, não uma simulação biomecânica.

Sequência observável:

- 0–3,05 s: caminhada, troca de apoios, braços e olhar.
- 3,05–4,23 s: preparação, perda de equilíbrio, quadril desce enquanto peito/cabeça reagem, mãos alcançam o chão.
- 4,23–4,75 s: mãos ancoradas e recuperação do impacto; arranhão aparece no antebraço.
- 4,75–6,9 s: detalhe do próprio antebraço; forma/espessura/curvatura das marcas diminuem e se fecham. Uma linha de luz acompanha o fechamento. Não é só fade de um ícone.
- 6,9–10,2 s: personagem confere o braço, aponta/toca e muda expressão.
- 10,2–12 s: volta a andar/passa pelo obstáculo, encerrando a ação.

Cenário original em SVG, com planos de pátio, janela, pavimento, luminárias e planta. Remotion é o único render principal. Macro é novo plano da mesma composição; não vídeo externo, Canvas alternativo, slides ou imagem gerada alegada.

## Áudio e ciência

Usado o mesmo mix de 12 s derivado do WAV de 8,8 s enviado pelo usuário. Texto e 21 palavras alinhadas acusticamente/SRT preservados. Nenhuma nova chamada de voz/imagem, instalação ou autorização paga. O WAV não autentica modelo/voz; proveniência anterior continua válida. Nenhum custo novo de geração informado.

Regeneração instantânea é hipótese fictícia indicada no vídeo. Formas do detalhe são ilustração, não processo clínico validado. Não há recomendação médica nem afirmação de indestrutibilidade. Fontes/limites em public/assets/regeneracao/sources.json.

## Revisão e validação

Still do impacto revisado antes do primeiro export. Pernas ajustadas para comprimentos mais próximos da extensão normal e braço de inspeção com cotovelo externo. V1 completo revisado por contato a 2 fps; queda a 10 fps, pele a 9 fps e reação a 4 fps. Uma linha horizontal do cenário atravessava a área da legenda; removida em V2, preservando V1.

Três novos testes: continuidade da velocidade cúbica, comprimento/limites de membros em 360 frames e mãos ancoradas enquanto tronco/cabeça recuperam. Lint, 17 testes gerais e build passaram. Isso comprova propriedades técnicas, não equivalência artística com a referência. QA do arquivo V2/Player e métricas finais são registrados abaixo. Não declarar aprovado sem retorno do usuário.

## Continuidade e rollback

Branch codex/regeneracao-movimento-novo-20261107, base d3df50d, na cópia isolada BUGASSE-regeneracao. A/B e outros episódios preservados. Reverter commits desta branch para rollback; nenhuma alteração de Firebase, segredos, publicação ou branch do outro editor. MP4s/imagens/logs permanecem locais; código/QA/relatórios versionados. Não avançar para episódio completo supondo que o piloto foi aprovado.


## Regeneracao — nova base de movimento, 07/11/2026

Executado: A/B explicitamente rejeitados pelo usuario, preservados com userRejected=true. Criado puppet SVG independente (sem controles/solver dos A/B ou computeBugiArticulatedKinematics), articulacao por partes do corpo, tronco deformavel, interpolacao cubica com velocidade continua, apoio de maos, caminhada, recuperacao e detalhe da pele que muda geometria. Mesmo audio real enviado, legendas/alinhamento preservados. Sem nova chamada paga, instalacao ou fundo Google alegado. Identificadores visuais do Bugi conservados em nova construcao vetorial, ainda sujeitos a aprovacao humana.

Evidencia/arquivos: reports/REGENERACAO-NOVA-BASE.md, src/remotion/RegenerationFluidRoot.tsx, regeneration-fluid/*, scripts/qa_regeneration_fluid.py; public/assets/regeneracao/render-qa-nova-base.json e animation-new-base.json. Export Remotion real out/regeneracao-nova-base-v2.mp4: 12,011 s de conteiner, 2.927.909 bytes, 360 frames, 1080x1920/30, H.264/AAC. SHA256 11ae5e0ca8f9c0a844e370edf3a3ff16d0fa65eb4a8cbddf519301bec8ad0c5a. Decode integral sem erros; blackdetect sem intervalos; -16,54 LUFS e -5,00 dBTP. PCM do audio identico ao usado nos A/B, confirmado por hash. V1 preservado; V2 remove linha do piso que interferia na area da legenda.

Testado: lint, 17 testes gerais, 3 novos testes de continuidade/articulacoes/apoio e build passaram. Logs out/regeneracao-fluid-lint/test/build.log, regeneracao-nova-base-v2-render.log, regeneracao-fluid-qa-v2.log, decode/blackdetect/loudness. Contatos e sequencias de queda (10fps), pele (9fps) e reacao (4fps) revisados. Referencia visual reamostrada em 0-4s e 51-55s a 4fps, sem executar codigo externo. Player 3120 usa mesma composicao, seek de frame 234 e ausencia de erro conferidos. Reproducao continua no IAB ficou em frame 0 apesar de playing=true; nao declarar realtime verificado. Nao equivale a escuta humana integral ou equivalencia artistica aprovada com o Claude.

Limites: regeneracao instantanea explicitamente ficticia; sem afirmacao clinica. Nao copiar ou inferir pipeline exato da referencia. Sem publicacao, merge ou episodio completo. Proximo: usuario avaliar a unica nova versao antes de expandir. Rollback: reverter commits da branch codex/regeneracao-movimento-novo-20261107 (base d3df50d), na copia BUGASSE-regeneracao; preservar A/B rejeitados, WAV e outros episodios. Midias/logs/imagens locais; codigo/QA/relatorios versionados.


| Funcionalidade | Implementado | Testado | Evidencia | Bloqueio |
|---|---|---|---|---|
| Base de animacao independente | Sim | 3 novos testes e MP4 | fluidMotion / FluidPilot | Aprovacao artistica pendente |
| Regeneracao em detalhe | Sim | Sequencia a 9 fps | regeneracao-fluid-pele-sequencia.jpg | Hipotese ficticia |
| Audio original preservado | Sim | Hash PCM igual | render-qa-nova-base.json | Sem escuta humana integral |
| Player e export na mesma composicao | Sim | Seek e MP4 | Root e Player3120 | Playback continuo IAB nao verificado |
| Pesquisa clinica/episodio completo/publicacao | Nao | Escopo preservado | sources.json / relatorio | Fora do piloto autorizado |


## Correção dos braços — 07/11/2026, V3

Executado: corrigida a trajetória das mãos e limitada a distância ombro–punho a 90–217 px, preservando os comprimentos dos ossos. A mão direita passava quase sobre o ombro: alcance mínimo de 8,397 px e salto de cotovelo de 215,016 px entre quadros em 9,067 s. Agora percorre arco abaixo do ombro; maior passo do cotovelo direito 14,902 px, esquerdo 20,778 px a 30 fps. Também suavizada a saída do balanço da caminhada em 3,05 s. A direção da nova base foi elogiada pelo usuário; a correção V3 ainda aguarda avaliação humana.

Evidência/arquivos: src/remotion/regeneration-fluid/fluidMotion.ts e fluidMotion.test.ts; scripts/qa_regeneration_fluid.py; render-qa-nova-base.json (V3), render-qa-nova-base-v2.json (histórico). Export local out/regeneracao-nova-base-v3.mp4, 12,011 s, 360 frames, 1080×1920/30, H.264/AAC, 2.945.325 bytes; SHA256 d6b13a2444bb089f7022a69b8026eeaeb816fd12ad25ace4ce16b316c5726a89. Player/export mantêm a composição Regeneracao-NovaBase; Player não rechecado nesta revisão.

Testado/logs: 6 testes de movimento passaram (incluem continuidade a 30/60 fps, folga do rosto e apoio fixo das mãos), 17 testes gerais, lint e build passaram. Logs out/regeneracao-bracos-motion-test.log, regeneracao-bracos-general-test.log, regeneracao-bracos-lint.log, regeneracao-bracos-build.log, regeneracao-bracos-qa.log e regeneracao-nova-base-v3-render.log. Decode integral sem erro, sem intervalos pretos. Áudio PCM idêntico ao anterior; -16,54 LUFS e -5,00 dBTP. Revisados contato geral a 2 fps e braços em 8,6–10,4 s a 20 fps (regeneracao-fluid-bracos-v3.jpg), comparados à sequência anterior bracos-antes.jpg. Build mantém avisos preexistentes de tamanho de bundle/import dinâmico.

Limitação/próximo: verificações de trajetória e amostras visuais não garantem ausência de qualquer colisão em futuros gestos. Reaplicar os testes ao alterar poses; avaliar V3 antes de expandir o episódio. Sem nova instalação, serviço pago, geração ou publicação. Arquivos de áudio e exports anteriores preservados. Trabalho isolado em BUGASSE-regeneracao, branch codex/regeneracao-bracos-20261107, base 3997103; rollback por reversão dos commits desta branch, sem tocar na main ou na cópia concorrente.
