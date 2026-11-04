# Aplicação da Skill Reel ao piloto v5

Branch codex/skill-reel-piloto-20261104, base 26f177a. Fonte: https://github.com/felpborges/skill-reel, clone local b9c1222297ce8ff8d15f19f5218afc08cab279bf.

## Aplicado e verificado

| Orientação | Execução | Evidência | Limite |
|---|---|---|---|
| Fala ancora a imagem | Transcrição local faster-whisper small PT, CPU int8; âncoras que falham se palavra ausente; remapeamento da ação, câmera e queda | scripts/transcribe-pilot.py, words.json, reel.ts; impacto no onset ASR de chão, 9,70s | Tempos acústicos de ASR são estimativas; Bugi tem baixa confiança, texto confirmado pelo roteiro original |
| Legendas curtas | Grupos de 1–3 palavras, destaque da palavra falada, correção de 5 para cinco; texto integral preservado | 5 testes, incluindo cobertura única de todas as palavras e âncoras | Posição fixa abaixo da ação, adaptada ao cartoon; não usa rastreamento de boca nem sincronização labial |
| Montagem por beats | Seis títulos com entradas de 0,24s e elementos ancorados na fala | MINUTAGEM-PILOTO-V5.md e contato-v5.png | Não é o estilo VSL FULL/SPLIT original; preserva a rua e escala aprovadas pelo usuário |
| Rosto livre e zona segura | Marca abaixo de y=220, títulos e legendas em x=108–918; removido rodapé fora da zona | Verificador original verificar.py, comparação com render da mesma cena sem overlays a cada 0,25s, zero alertas | Heurística por densidade de bordas, não prova geométrica de cada glifo; folha inspecionada por amostras |
| Som enxuto | Cinco SFX originais; soltura em pegada 8,56s, impacto em chão 9,70s | sfx-events.json; 0,40 efeito/s; pico -3,38 dBTP, -14,35 LUFS | Par de passo/deslize separado por 0,29s, associado a duas ações, registrado pelo verificador |
| Voz íntegra | Mesmo WAV Gemini Enzo, sem cortes de sílabas ou retakes | Manifestos v1 e v5; narração 12,08s, final 12,501s | Pausas dramáticas de cerca de 0,70s/0,34s preservadas para antecipação cartoon; regra de limpeza de apresentador não aplicada mecanicamente |
| Render real | ESeBugasseVideoComposition/PilotRoot, H.264/AAC, 375 frames | MP4, decode FFmpeg sem erros, VERIFY original copiado abaixo | Aprovação artística e escuta humana pendentes |

## Ferramentas e adaptação

A skill já estava instalada no projeto; nenhuma instalação adicional. Lidos arquivos originais de regras, corte, estilo e modelo, com adaptação local skill-reel-adaptacao. Não se executou preparar.sh, motor de cortes para apresentador ou face tracking, nem se modificou o kit original. Remotion continua motor principal conforme AGENTS e modelo aprovado; não se reivindica uso do motor HyperFrames VSL original. Identidade do Bugi preservada. Fontes OFL e SFX próprios; nenhum asset de terceiros sem licença foi adicionado.

Transcrição tentou abrir WAV pelo PyAV e encontrou incompatibilidade metadata_errors; foi resolvida sem alterar dependências, lendo PCM com wave/numpy e reamostrando com scipy. Primeira tentativa de verificação usou caminho relativo errado; repetida com caminho absoluto, exit 0. Não houve cortes nem dados inventados. A barra superior é um indicador ilustrativo da fase do movimento, não cronômetro físico nem simulação numérica.

## Reprodução e logs

Prévia: npm run pilot:preview; composição Bugi-Atrito-12s.
Render: npx remotion render src/remotion/PilotRoot.tsx Bugi-Atrito-12s out/piloto-atrito-v5-reel.mp4 --concurrency=1 --browser-executable=<Chrome local> --codec=h264 --audio-codec=aac --crf=18.
Baseline para zona segura: mesma composição com props {"pilotAssets":{"technicalPreview":false,"hideReelOverlays":true}}; não é entrega alternativa, somente controle de QA.
Verificação original: python .agents/skills/reel-upstream/ferramentas/verificar.py qa/pilot-atrito-v1/skill-reel-v5 --video <MP4 absoluto> --camera out/piloto-atrito-v5-camera.mp4 --sfx qa/pilot-atrito-v1/skill-reel-v5/sons.json.
Logs locais: qa/pilot-atrito-v1/loudness-v5.log, transcript-whisper-small.json, contato-v5.png, skill-reel-v5/VERIFY.md e skill-reel-v5/qa/zona-segura.json/png.
Fontes físicas e simplificações continuam em PILOTO-ATRITO-V3.md; não há novas afirmações quantitativas nem promessa de viralização.

## Rollback

Reverter apenas commits desta branch para recuperar v4. Versões MP4 anteriores e todos os assets originais preservados. Sem merge, push ou publicação externa. Não usar clean/reset por causa de arquivos locais preexistentes.
