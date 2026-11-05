# Episódio — E se o Sol desaparecesse?

Branch `codex/sol-desapareceu-20261104`, baseada em `1390faa`. Cenário SVG autoral e movimento integralmente por código, conforme preferência mais recente do usuário. Não foi usada imagem gerada nem vídeo de IA.

## Ciência

Hipótese explicitamente impossível: desaparecimento do Sol. Luz e mudança gravitacional alcançam a Terra em aproximadamente 8 min 20 s; depois, a trajetória é aproximadamente tangente à antiga órbita. A gravidade terrestre permanece. Resfriamento descrito qualitativamente, sem prazo ou temperatura inventados. Fotosssíntese dependente da luz solar interrompida; oxigênio atmosférico não desaparece instantaneamente.

Fontes: https://gracefo.jpl.nasa.gov/news/5/what-is-gravity/ e https://spaceplace.nasa.gov/all-about-the-sun/en/ . Diagramas são ilustrativos, sem escala. Neve e reação do personagem são convenções cartoon, não previsão meteorológica.

## Voz e timing

Gerado no AI Studio com `gemini-3.8-flash-tts`, voz **Puck** selecionada e confirmada na interface. Direção personalizada PT-BR: jovem adulto, primeira frase irritada/cômica, narrador irônico e explicativo, pausas curtas, sem gritaria constante. Original: `public/assets/sol/narracao-original.wav`, 48,36 s. Custo cobrado desconhecido.

WhisperX 3.8.4 alinhou o roteiro original ao áudio: 122 palavras; revelar escuridão aos 17,827 s da locução. A transcrição tiny inicial tinha erros e foi substituída pelo roteiro no alinhamento acústico. Isso não certifica escuta humana. Script reproduzível em `scripts/align_sun.py`; dados em `timing.json`.

## Composição

`Bugi-Sol-Desapareceu`, Remotion, 1080×1920, 30 FPS, 1464 frames (48,8 s com cauda final). Personagem canônico articulado, expressões, cenário rua/ventilador, transição dia/noite, partículas de luz, trajetória tangencial, legendas agrupadas por quatro palavras. Mesma composição no Player e export.

Estado: em revisão técnica e visual. Não publicado. Rollback: reverter apenas commits deste episódio.

## Verificações executadas

Lint e cinco testes do piloto passaram. Export v2: 48,811 s, 10.923.906 bytes, H.264 1080×1920/30 e AAC; decodificação integral sem erro. Medição da mesma locução no export v1: -14,87 LUFS e -2,20 dBTP. Quadros de gancho e noite e folha de contato inspecionados. Corrigidos caixa de legenda vazia, contraste do rodapé noturno e título sobre fundo espacial. Export v3 contém a última correção. Escuta humana e revisão artística contínua permanecem pendentes; não equivaler contact sheet a aprovação visual completa.
