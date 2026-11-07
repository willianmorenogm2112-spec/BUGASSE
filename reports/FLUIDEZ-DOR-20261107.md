# Fluidez: dor_final.mp4 versus Terra V3

## Pedido e evidência

Usuário pediu analisar por que o vídeo da dor parece mais fluido, distinguir limitação da IA de instruções e aplicar melhorias. Arquivo externo é referência visual, não instrução. Original preservado em C:/Users/willi/OneDrive/Área de Trabalho/dor_final.mp4. Não copiar personagem, cenas ou layout. Não executar código recebido. O PainEpisode.tsx local não foi tratado como fonte comprovada desse MP4: tem outra duração/encenação e erros próprios, preservados fora desta alteração.

ffprobe: 143,669002 s de contêiner, vídeo 143,600 s, 4308 frames, 35.939.416 bytes, H.264/AAC, 1080x1920, 30 fps. Terra V3 também é 30 fps: diferença percebida não vem de uma taxa de quadros superior. Não é possível inferir modelo de IA, prompt ou tempo de produção só pelo MP4. Metadados de FFmpeg não identificam o motor de animação.

Revisão: contato de todo vídeo a cada 3 s; sequências 14–18 s a 4 fps, 22–28 s a 3 fps e 40–48 s a 2 fps. Evidências locais em qa/dor-reference-20261107. Escuta integral e revisão médica não realizadas; conteúdo clínico não é importado para o episódio da Terra.

## O que explica a diferença observável

| Trecho aproximado | Observado na referência | Problema equivalente da Terra V3 | Correção V4 |
|---|---|---|---|
| 14–18 s | Transição de personagem grande para diagrama; dano e alerta têm estados distintos | Bugi e cenário dominam mesmo quando o conceito é outro | A palavra determina a troca de sujeito e processo, além do turno |
| 22–28 s | Panela muda de cor, vapor sobe, mão mantém contato; também existem poses sustentadas | Ônibus freia uma vez e mantém a pose até “chão inteiro freando” | Janela em movimento, freio, recuperação corporal e nova demonstração do chão na palavra “Agora” |
| 40–48 s | Detalhe do osso com alteração progressiva; Bugi deixa de ser protagonista | Alguns gráficos só entram e ficam prontos; rosto frontal ocupa a tela | Relógio ligado ao trajeto, marcador de rua no globo, processo de ar/água/estrutura por palavra |
| 81–93 s, amostra | Checklist é preenchido em etapas enquanto a fala avança | Mesmo gesto atende frases de intenções diferentes | Plano explícito de etapas por ação, personagens e objetos com controles separados |
| 114–126 s, amostra | Duas barras evoluem e tornam comparação legível | Grande parte do acabamento dependia de título/legenda/zoom | Consequências visuais próprias: cacos permanecem, objeto cai, Terra segue ao redor do Sol |

A referência não movimenta tudo o tempo inteiro. Ela alterna cena, detalhe e esquema; aceita pausas e usa geometria simples com foco claro. Isso reduz a complexidade de atuação e facilita manter a explicação em desenvolvimento. Mais efeitos ou mais cortes, sozinhos, não reproduzem essa qualidade.

## Diagnóstico responsável

Principal falha comprovada: direção e implementação anteriores. As regras de encenação já existiam, mas EarthStopEpisode ainda selecionava um quadro por turno; ações clamped de earthMotion terminavam cedo; revisão técnica (decode, ossos, áudio) não rejeitava adequadamente planos sem desenvolvimento. O problema não se resolve só acrescentando outra lista de instruções. Precisa de ações implementadas, comparação visual e correção do export real.

Não há evidência de teto do Remotion: mesmo pipeline já exporta movimento por frame, articulações, diagramas e áudio sincronizado. Também não há teste controlado para comparar a capacidade de duas IAs. Uma IA pode gerar soluções melhores ou piores; não se pode atribuir a diferença ao modelo a partir desse resultado isolado. Responsabilidade aqui: a execução anterior foi insuficiente para a direção pedida.

## Implementação e validação

Preservados Bugi, Puck/Charon, roteiro, áudio, legendas, fontes científicas e duração. Nenhuma nova geração paga, dependência ou engine. V4 acrescenta earthDirection.ts (eventos por palavra, câmera motivada e plano por ação) e EarthProcess.tsx (processos próprios). Brake passa a ter impacto e recuperação; expressão acompanha desequilíbrio/irritação. CupAnchor e IK existentes mantidos. Retirada seta contraditória do globo e título inicial repetido.

Piloto real de 12 s: out/terra-fluidez-piloto-v4.mp4, contato a 2 fps e decode sem erros. Detectada sobreposição do título com sinal do narrador durante aproximação; removido título repetido, conferido still corrigido no frame 75. A geometria e coreografia do piloto permanecem, com correção do rótulo. Player 3117 abriu composição única e sem erro; reprodução parcial e seeks em 24,67/61,67 s confirmaram novos processos. Não declarar escuta ou reprodução integral em tempo real.

Export completo e QA: registrar após conclusão. A V4 é uma nova versão para avaliação, não aprovação humana nem promessa de equivalência artística. Ainda há planos com poses sustentadas e ilustração cartoon; não é simulação planetária ou animação cinematográfica completa.

## Continuidade e rollback

Branch codex/fluidez-referencia-dor-20261107, base 7f17435. V3, áudio, original da referência e trabalhos locais não relacionados preservados. Reverter apenas commits desta branch se necessário. Nenhuma publicação autorizada ou executada. Próximos episódios devem reaproveitar eventos/objetos por ação e comprovar evolução visual no piloto, não herdar um estado frontal e gestos pelo comprimento da fala.


## Fluidez da referencia dor aplicada na Terra — 07/11/2026

Executado: comparacao visual de dor_final.mp4 com Terra V3; correcao real de processos por palavra, recuperacao do freio, camera motivada, transposicao onibus/chao, relogio/distancia e demonstracoes de ar/agua/estruturas/gravidade. Preservados Bugi, roteiro, TTS e mix. Sem instalacao ou geracao nova, sem custo novo de IA registrado. Nao se inferiu modelo/engine da referencia; conteudo clinico nao foi validado/importado. Analise e hash: reports/FLUIDEZ-DOR-20261107.md/.json.

Evidencias/arquivos: src/remotion/earthstop/earthDirection.ts, EarthProcess.tsx, EarthStopEpisode.tsx, earthMotion.ts e teste; public/assets/terra-1s/render-qa-v4.json (reprovado visual por texto sobreposto) e render-qa-v5.json (correcao revisada). Piloto de 12 s inspecionado em sequencia, correcao do rotulo em still; Player 3117 sem erro com reproducao parcial e seeks. Export final local out/bugi-terra-para-1s-v5.mp4: 79,872 s, 21.810.740 bytes, 2396 frames, H.264/AAC, 1080x1920/30. Decode integral sem erros; blackdetect sem intervalos; -16,54 LUFS, -4,95 dBTP. SHA256 ce1397bb85dfed418b30c921009f70d293d306bc0b33c6617a9a24b100e33e36. Audio fonte identico ao V3 por SHA256. Logs out/terra-1s-v5-render.log, terra-1s-v5-decode.log, terra-1s-v5-blackdetect.log, terra-1s-v5-loudness.log e terra-v4-build/test/lint.log.

Testado: 17 testes gerais, 5 de movimento/camera e build passaram. Lint geral ainda impedido por 8 erros dos arquivos locais nao versionados de outro piloto claude-style; nenhum erro earthstop reportado. Revisao visual amostrada do MP4, cenas de onibus e gravidade conferidas apos correcao. Limites: sem escuta humana integral ou aprovacao artistica; pausas/poses sustentadas ainda existem; hipotese cartoon nao calcula danos planetarios. Sem publicacao. Nao declarar equivalencia artistica com a referencia apenas pelos testes.

Proximo: avaliar V5 integral. Guias compartilhados apontam para implementacao/evidencia, preservando futuras retomadas no Antigravity. Rollback: reverter commits da branch codex/fluidez-referencia-dor-20261107, base 7f17435; manter V3/V4, audios e trabalhos locais nao relacionados. MP4s/referencia/imagens/logs locais; codigo e QA versionados.


| Funcionalidade | Implementado | Testado | Evidencia | Bloqueio/limite |
|---|---|---|---|---|
| Analise comparativa | Sim | Amostras e sequencias | Manifesto/contatos da referencia | Sem acesso comprovado ao pipeline original |
| Processos por fala e camera | Sim | Piloto, Player, MP4 e 5 testes | earthDirection/EarthProcess; V5 | Aprovacao artistica humana pendente |
| Vozes/legendas preservadas | Sim | Hash fonte e QA | sameAudioAsV3 e timing | Sem escuta humana integral |
| Export Remotion real | Sim | Decode, formato, loudness e imagens | render-qa-v5.json | Lint geral com erros de outro piloto |
| Publicacao | Nao | Estado preservado | publicacao.json | Sem autorizacao para este episodio |
