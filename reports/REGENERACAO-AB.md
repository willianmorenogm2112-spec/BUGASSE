# Regeneração em segundos — pilotos A/B de 12 segundos

## Pedido e escopo

Usuário aprovou testar a mesma ação em dois controles de animação: caminhar, tropeçar, apoiar no chão, mostrar arranhão superficial, regeneração fictícia e reação. Entregar dois pilotos e comparação lado a lado. Não produzir/publicar episódio completo antes da escolha do movimento. Não copiar personagem/layout do vídeo dor_final.mp4 nem atribuir seu pipeline a uma IA sem prova.

A preserva o controle por poses mais espaçadas/interpolação suave e IK do projeto. B acrescenta preparação do tropeço, poses intermediárias, impacto com recuperação, atraso de cabeça/cabelo e pequenos ajustes do gesto. Ambos preservam desenho do Bugi, proporções, paleta, cenário original, relógio da ação, câmera, legendas e áudio. O personagem da referência não foi copiado. B é uma alternativa original inspirada no movimento observado; não é reprodução comprovada da técnica original.

## Áudio real e alinhamento

Primeira aba do AI Studio retornou HTTP 403. Usuário pediu nova aba/reload e depois forneceu Generated Audio November 07, 2026 - 1_11AM.wav. Arquivo copiado sem alteração para public/assets/regeneracao/narrador-original.wav: PCM mono 24 kHz, 8,800 s, 422.444 bytes; SHA256 68508e60d72b256a4b26ea19ca17127bb70d1cb088403ad7bbac328c89ba2b31. Voz/modelo solicitados na UI: Charon / Gemini 3.8 Flash TTS. O WAV isolado não comprova estes identificadores: proveniência registrada como user_supplied_wav, modelVerifiedFromFile=false, custo cobrado desconhecido.

ASR independente faster-whisper-base reconheceu o texto esperado. WhisperX alinhou acusticamente 21 palavras. Áudio integral preservado, sem acelerar ou cortar fala; adicionado início de 250 ms e silêncio até 12 s, normalização comum 48 kHz. Sem música ou SFX novos. O mesmo mix é usado uma única vez na comparação; A/B isolados conservam a faixa AAC por cópia.

Script prepare_regeneration.py usa .venv-whisperx/Scripts/python.exe. Python global não tinha WhisperX. PyAV local rejeitou metadata_errors: leitura WAV + reamostragem em memória removeu dependência desse caminho de decode. NLTK recusou caminho de cache: quatro arquivos de dados de português já instalados foram copiados para .venv-whisperx/nltk_data; diretório registrado pela configuração suportada NLTK_DATA/nltk.data.path. Sem desabilitar proteção, editar bibliotecas ou instalar pacotes novos. Cache/alinhamento e falhas preservados nos logs locais.

## Composição e sequência

Fonte única: src/remotion/RegenerationRoot.tsx e regeneration/RegenerationPilot.tsx; controles em regenMotion.ts. Três composições: Regeneracao-A, Regeneracao-B (1080x1920), Regeneracao-Comparacao (2160x1920), todas 30 fps e 360 frames. Tempo da coreografia interpolado entre âncoras acústicas, não pelo comprimento de uma fala.

Âncoras áudio → coreografia: 0 → 0; tropeço 3,537 s → fase 3; arranhão 4,440 s → 3,5; pele 5,482 s → 6; inteira 6,324 s → 8,3; indestrutível 7,968 s → 9,6; fim 12 → 12. Corpo se prepara, perde apoio, encontra contato, levanta, observa o braço e confere novamente o resultado. Arranhão desenhado no antebraço junto à mão; detalhe ampliado usa a mesma progressão de regeneração para ambos. Sem sangue ou ferida gráfica. Cenário generationSource=original_svg_code.

Render principal real Remotion da comparação. Exportações individuais são recortes exatos de suas metades, com vídeo H.264 reencodificado e AAC copiado; não existe segundo motor de animação. Public directory enxuto contém o mesmo WAV por hash, evitando copiar assets de episódios não usados. Player usa o mesmo componente.

## Defeitos encontrados e correções

1. Contato da mão se perdia no início da recuperação B: corpo agora mantém a pose de apoio até a liberação da mão; teste verifica distância ao contato durante o intervalo.
2. Queda cortava a cabeça na borda: origem da ação movida igualmente nas duas versões.
3. Pés cruzavam na passada: posições de apoio/passo corrigidas nas duas versões; teste de ordem esquerda/direita cobre a caminhada. Primeiras tentativas de export A/B interrompidas e não entregues.
4. V2 apresentou borda vazia na aproximação por alvo de câmera incompatível com a nova origem. V3 recentraliza o alvo compartilhado; revisão do arquivo final registrada abaixo.

Três testes iniciais evoluíram para quatro testes de movimento: comprimentos/articulações e solas em todos os frames, contato da palma, recuperação alternativa/final comum e ordem dos pés. Não equivale a aprovação artística ou prova de que B é melhor.

## Ciência e limites

Piloto de comparação visual. Regeneração instantânea é premissa explicitamente fictícia, não descrição da cicatrização humana. Nenhuma afirmação clínica importada da referência; fontes/limites em sources.json. A pergunta sobre ser indestrutível é gancho, não conclusão. Episódio científico completo exigiria pesquisa própria antes de ampliar roteiro/TTS.

## Isolamento e rollback

Base b0dc3a4. Branch iniciada como codex/regeneracao-piloto-ab-20261107. Durante trabalho, outro editor mudou o checkout BUGASSE-animacao para codex/episodio-dor-20261107, mesmo commit base. Commit d775c0c com apenas os 16 arquivos próprios foi feito antes de perceber a troca. Branch própria avançada ao mesmo commit e continuação isolada em Code/BUGASSE-regeneracao. A branch do outro editor não foi apagada, resetada ou revertida; portanto também conserva aquele commit. Demais arquivos locais/dor/Sono preservados.

node_modules da cópia isolada aponta por junction ao diretório existente de dependências; nenhum npm install. Arquivos de mídia, logs e QA finais ficam em BUGASSE-regeneracao/out. Prévia antiga 3118 usou a cópia de produção durante revisão; conferir composição atual da cópia isolada para paridade V3. Reverter apenas commits desta branch para rollback; isso não apaga automaticamente d775c0c da outra branch. Nenhuma publicação ou merge executado.

## Fechamento

QA da exportação V3 concluído tecnicamente, conforme fechamento abaixo. Escuta humana integral e escolha A/B continuam pendentes. Não declarar vencedor por teste técnico.


## Regeneracao A/B — fechamento 07/11/2026

Executado: dois pilotos de 12 s e comparacao lado a lado com mesmo Bugi, cenario, camera, voz, legenda e marcos acusticos; variam os controles de movimento. Arte e codigo originais. Audio real fornecido pelo usuario (8,8 s), preservado integralmente, sem aceleracao; WhisperX alinhou 21 palavras, SRT com 8 paginas. Modelos/voz solicitados no AI Studio nao autenticados pelo WAV; proveniencia user_supplied_wav e custo cobrado desconhecido. Sem instalacao de dependencias, Google para fundo ou outro motor alegados.

Evidencias/arquivos: reports/REGENERACAO-AB.md, public/assets/regeneracao/provenance.json, sources.json e render-qa.json; src/remotion/RegenerationRoot.tsx e regeneration/*; scripts/prepare_regeneration.py, regeneration_captions.ts e qa_regeneration.py. Saidas locais na copia BUGASSE-regeneracao: out/regeneracao-comparacao-v3.mp4 (2160x1920, 7.533.538 bytes), regeneracao-piloto-a-v3.mp4 (1080x1920, 3.513.266 bytes) e regeneracao-piloto-b-v3.mp4 (1080x1920, 3.769.091 bytes). Todos H.264/AAC, 30 fps, 360 frames, 12,011 s de conteiner. A/B recortados das mesmas metades do render Remotion, sem segunda implementacao de animacao. Decode integral sem erros; blackdetect sem intervalos. Faixa PCM decodificada identica nas tres saidas, SHA256 e42c4955f81a13dc5aa60d6822a8ce52e5ec53f9619e3948c6da2898d0fcfa01. -16,54 LUFS e -5,00 dBTP. Hash completo dos MP4s em render-qa.json.

Testado: lint passou na copia isolada; 17 testes gerais, 4 de movimento e build passaram. Logs out/regeneracao-lint.log, regeneracao-test.log, regeneracao-motion-test.log, regeneracao-build.log, regeneracao-comparacao-v3-render.log, regeneracao-qa.log e logs decode/blackdetect/loudness. Revisao visual de contatos A/B, sequencia de queda e frames de impacto/regeneracao/restauracao. Player final 3119 na copia isolada abriu a mesma composicao, frame 180 sem erro. Corrigidos apoio da palma, corte da cabeca, cruzamento dos pes e borda vazia da camera. Revisao artistica/escuta humana integral e escolha A/B pendentes; nenhuma publicacao.

Limites: comparacao de duas implementacoes originais, nao reproducao comprovada do pipeline do video da referencia. Tema de regeneracao instantanea e hipotese ficticia, sem orientacao medica. Nao declarar vencedor por testes. A copia original mudou para branch do outro editor durante execucao; commit d775c0c tambem permanece naquela branch. Continuacao isolada em Code/BUGASSE-regeneracao, branch codex/regeneracao-piloto-ab-20261107, base b0dc3a4. Nao foi feito reset/revert na branch do outro editor. Dependencias compartilhadas por junction node_modules.

Proximo: usuario comparar A/B e escolher controle antes de ampliar episodio. Rollback: reverter os commits desta branch, preservando WAV original e exports; isso nao remove automaticamente o commit ja existente na outra branch. Midias/logs/imagens locais; fontes, audio, QA e relatorios versionados.


| Funcionalidade | Implementado | Testado | Evidencia | Bloqueio/limite |
|---|---|---|---|---|
| Pilotos A/B e lado a lado | Sim | MP4s reais, sequencias e Player | render-qa.json | Escolha artistica pendente |
| Mesmo audio | Sim | SHA256 do PCM decodificado igual nos 3 | render-qa.json | WAV nao autentica modelo/voz |
| Contato e articulacoes | Sim | 4 testes, frames revisados | regenMotion.test.ts / contatos | Estilizacao cartoon |
| Render principal unico | Sim | Comparacao Remotion, A/B derivados por crop | RegenerationRoot / qa_regeneration.py | Export isolado tem reencode do video |
| Episodio completo/publicacao | Nao | Escopo preservado | script.json / relatorio | Depende de escolha e nova producao |


Atualizacao: usuario rejeitou ambos os pilotos A/B. Nao sao referencia aprovada. A nova tentativa independente esta em reports/REGENERACAO-NOVA-BASE.md; nao escolher A/B automaticamente.
