# Primeiro piloto — E Se Bugasse?

Data: 2026-11-04. Branch: codex/piloto-remotion-20261104. Base: 0a8d781. Estado: primeira versão para revisão visual, não publicada nem aprovada artisticamente.

Arquivo: `out/piloto-atrito-v3.mp4`. Tamanho real: 11.803.789 bytes. Duração do contêiner: 12,501s; imagem: 375 frames, 1080x1920, H.264 a 30 FPS; áudio AAC. SHA256: B2CA7A1596C505878B47A57237A4CE8FDD507CB44312AAD15FEDC7FBBBF3D2D9.

## O que foi produzido

| Funcionalidade | Implementado | Testado | Evidência | Limitação |
|---|---|---|---|---|
| Voz real | Gemini 3.8 Flash TTS, voz Enzo, PT-BR pelo AI Studio | Download e ffprobe; 12,08s PCM mono 24kHz | public/assets/pilot-atrito-v1/narration-original.wav; hash e texto no manifest.json; captura local qa/pilot-atrito-v1/tts-google.png | Sem revisão auditiva humana nesta execução |
| Cenário original | Imagem gerada pela ferramenta integrada, autorizada pelo usuário após bloqueio Google | Imagem e composição final inspecionadas | background-openai-v1.png, prompt e SHA256 no manifest | Modelo exato não exposto pela ferramenta; não rotular como GPT 2.5 nem Google |
| Animação por código | Rig SVG canônico; raízes, membros, cabeça/olhos/cabelo, contato e câmera determinados por frame | Todos os 375 frames finitos e determinísticos; IK de mão e pé testada | motion.ts, FrictionPilot.tsx, motion.test.ts | Cinemática dirigida e exagero cartoon, não simulação dinâmica completa |
| Mesma composição | ESeBugasseVideoComposition com props pilotAssets, registrada no PilotRoot | Studio abriu antes de editar; mesmo entry/component usados no render Node | http://localhost:3100/Bugi-Atrito-12s; render-v3.log | Sem comparação pixel a pixel com screenshot do Player; a reconexão posterior do IAB falhou. MP4 reproduziu corretamente no Chrome |
| Áudio/mix | Voz integral com SFX procedurais originais: três passos, deslize, soltura e impacto | FFmpeg ebur128 e decodificação integral | loudness-v3.log; prepare-pilot-audio.py | Sem música neste piloto curto; SFX e legendas ainda precisam de escuta/revisão |
| Legendas | Caption[] em JSON, frases curtas e espaços reais | Tipagem/build, folha de contato | captions.json | Tempos estimados manualmente; sem alinhamento acústico por palavra |
| Qualidade técnica | Renderer Remotion Node/Chromium, sem rasterizador paralelo | ffprobe e decode completo; -14,0 LUFS e true peak -3,4 dBFS no resumo ebur128 peak=true | ffprobe-v3.json, loudness-v3.log, render-v3.log | Stream de áudio não comprova por si só qualidade artística |
| QA visual | Contato de cada meio segundo e sequência de pegada com 18 quadros em 1,5s | Inspeção visual; reprodução do MP4 no Chrome observada em 1080x1920 | contato-v3.png, sequencia-pegada-v3.png, preview real | Aprovação do usuário e revisão auditiva pendentes |
| Verificação do app | Lint, 17 testes existentes, 3 novos testes e build | Passaram | Saída na conversa; comandos abaixo | Avisos preexistentes de bundle grande, import dinâmico ineficaz e __dirname; npm audit aponta quatro entradas high ligadas a Firebase/grpc, sem correção ampla nesta tarefa |

## Ajustes observáveis

1. O título inicial encostava no cabelo; foi reduzido para liberar a cabeça.
2. O poste deixou de surgir somente no beat de pegada: existe desde o começo em coordenadas do mundo e entra no enquadramento com a câmera.
3. Pés e mão passaram a usar alvos em coordenadas do mundo com IK; a rotação do tronco não muda a posição de contato durante o apoio/pegada.
4. Uma sequência única substitui resets bruscos de poses entre os cinco beats; braços, cabelo e rosto têm comportamento separado.
5. A voz foi preservada integralmente; o vídeo dura 12,5s em vez de truncar um WAV de 12,08s para 12s. A mix v2 corrigiu -15,1 para -14,0 LUFS no MP4.
6. O cenário provisório geométrico foi substituído pela imagem gerada após autorização explícita do usuário. As versões técnicas anteriores permanecem em out/.

## Origem, fontes e simplificações

Manifesto de assets: `public/assets/pilot-atrito-v1/manifest.json`, incluindo prompt final, modelo TTS, voz, hashes, falha Google e custos desconhecidos (`null`, nunca custo zero inferido). A geração Google de imagem falhou com “Permissão negada”; o usuário autorizou geração por aqui. Não houve imagem Google bem-sucedida nesta versão.

O cenário é bitmap. Toda a animação/edição visível é código Remotion/SVG, inclusive transformação de câmera, articulações, expressões, legendas, interação e integração dos assets. Não há clipe de personagem gerado por IA. Não alegar que imagem e voz são geometria sintetizada por código.

Fontes científicas: [OpenStax — Friction](https://openstax.org/books/university-physics-volume-1/pages/6-2-friction) e [NASA — Newton’s Laws](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/newtons-laws-of-motion/). Premissa: o atrito de deslizamento sapato/chão some por cinco segundos; gravidade/normal continuam. O contato com o poste ainda pode exercer força; a soltura é encenação cartoon de perda de equilíbrio, não alegação de que todo apoio mecânico deixaria de existir. Escala de movimento, alongamento e queda são estilizados. O estudo não modela todos os torques, forças ou resistência do ar.

Fonte local Plus Jakarta Sans com licença OFL copiada junto do arquivo. SFX originais calculados por script determinístico. Skill Reel foi usada como orientação/adaptação de timing, legibilidade e áudio, não como filmagem de apresentador. HyperFrames foi consultado na pesquisa e não executou render neste piloto; FilmCraft/PhotoCraft não executados e não reivindicados como usados.

## Reprodução

`npm run pilot:preview` abre servidor Studio na porta 3100 sem abrir navegador automaticamente. Composição Bugi-Atrito-12s.

Render usado: `npx remotion render src/remotion/PilotRoot.tsx Bugi-Atrito-12s out/piloto-atrito-v3.mp4 --concurrency=1 --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe" --codec=h264 --audio-codec=aac --crf=18 --log=info`. Em outro host, escolher caminho do Chrome correspondente ou usar navegador suportado pelo Remotion.

Checagens: `npm run lint`, `npm test`, `npm run test:pilot`, `npm run build`, `ffprobe -v error -show_streams -show_format -of json <mp4>`, `ffmpeg -v error -i <mp4> -f null NUL`, `ffmpeg -hide_banner -nostats -i <mp4> -af ebur128=peak=true -f null NUL`.

Logs e imagens de QA são locais em qa/pilot-atrito-v1 e estão ignorados pelo Git, inclusive capturas do site que podem mostrar dados da conta. Vídeos exportados também são locais. Assets e código são versionáveis; não houve push ou publicação. Rollback: reverter somente os commits desta branch. Backups de package.json/lock anteriores em .git/bugasse-backups/piloto-20261104; não usar git clean/reset em razão dos arquivos preexistentes não versionados.
