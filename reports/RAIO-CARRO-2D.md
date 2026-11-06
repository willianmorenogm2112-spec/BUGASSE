# Raio no carro — Bugi 2D

## Roteiro

NARRADOR: Um raio acertou seu carro. O pneu te salvou? Não.
BUGI: Como assim? Eu já tava agradecendo à borracha!
NARRADOR: Num carro fechado, com teto e estrutura metálicos, a carroceria ajuda a conduzir a descarga pelo exterior até o solo. Ela é a parte importante da proteção.
BUGI: Então eu tô dentro de uma armadura com prestação atrasada?
NARRADOR: Mais ou menos. É o princípio da gaiola de Faraday. Mas isso não transforma todo veículo num abrigo seguro.
BUGI: E o conversível? Fecho a capota e resolvo?
NARRADOR: Não conte com isso. Conversíveis, motos e veículos abertos não oferecem a mesma proteção. Procure um prédio fechado ou um veículo adequado, com os vidros fechados.
BUGI: Tá. Eu fico aqui quietinho. Sem abraçar a porta.
NARRADOR: Certo. Evite contato com partes metálicas e equipamentos ligados ao sistema elétrico. Se precisar parar, estacione em local seguro, longe de árvores e fios.
BUGI: Pelo menos o carro sai inteiro?
NARRADOR: Também não é garantido. O raio pode danificar pneus, vidros e eletrônicos. Você pode estar protegido e o carro precisar de guincho.
BUGI: Eu escapei do raio. Agora falta sobreviver ao orçamento da oficina.
NARRADOR: E espere pelo menos trinta minutos após o último trovão antes de voltar à atividade ao ar livre.

## Pesquisa e limites

- https://www.weather.gov/safety/lightning-cars — estrutura metálica, trajetória exterior, pneus/vidros/eletrônicos e risco de danos.
- https://www.cdc.gov/lightning/safety/ — abrigo fechado, janelas, veículos abertos e espera de trinta minutos.
- https://weather.metoffice.gov.uk/warnings-and-advice/seasonal-advice/health-wellbeing/stay-safe-in-thunder-and-lightning — permanecer dentro, evitar metal e local de parada.
- Não prometer invulnerabilidade nem dizer que a descarga não pode entrar na cabine. Ilustração de trajetória simplificada; sem números inventados de tensão/temperatura.
- Não confundir orientação sobre raio com saída de veículo em incêndio ou risco imediato. Situações com fios caídos exigem orientação específica.

## Direção

Puck: Bugi irônico e assustado, sem gritaria. Charon: narrador claro, humor seco; recomendações finais firmes. Cenário e carro SVG feitos por código, origem procedural explícita. Remotion principal. Cortes motivados por descarga, pneu riscado, corrente exterior, comparativo de veículos e danos.

## Execução

## Retomada TTS bem-sucedida

Export final para revisão: out/bugi-raio-carro-v1-com-vozes.mp4, Remotion Bugi-Raio-No-Carro, 2154 frames, 71,808 s, 13.125.970 bytes, H.264 1080×1920/30 e AAC. Decode integral FFmpeg passou. SHA256 8B551D70FF1BB4BE86497620465678F8FDAC4553F8A9C0A51B541987BDB42BBC. WAV mix medido -17,3 LUFS, LRA 3,1 LU e pico -2,0 dBFS. Quadro interior do MP4 final inspecionado. Escuta integral e aprovação artística permanecem pendentes; não publicado.

Nova página no mesmo link do AI Studio gerou os dois WAVs reais com estilo individual aplicado: Charon 53,32 s (Generated Audio November 05, 2026 - 11_48PM.wav, 2.559.404 bytes) e Puck 23,04 s (11_50PM.wav, 1.105.964 bytes). Modelo observado gemini-3.8-flash-tts. Custos cobrados não exibidos. Alinhamento acústico WhisperX produziu 13 turnos, 198 palavras e montagem 71,774 s. Fontes preservadas em public/assets/raio-carro. Mix com SFX procedurais originais e normalização -16 LUFS/TP -2. Root final registra Bugi-Raio-No-Carro com technical=false e timing acústico; prévia silenciosa permanece composição separada.

Branch codex/bugi-2d-raio-carro-20261105. Arquivos: LightningCar.tsx, LightningCarRoot.tsx, prepare_lightning_technical.mjs e mix_lightning_audio.py. Fonte visual procedural SVG, sem imagem Google alegada. Rig Bugi canônico reutilizado com atuação por beat.

## Bloqueio real da voz

AI Studio gemini-3.8-flash-tts, voz Charon e estilo personalizados configurados; duas tentativas de geração voltaram sem áudio. A prévia do bloco revelou HTTP 403 na interface. Nenhum WAV deste episódio foi gerado ou baixado. Não usar áudios de outros episódios como substituição.

Prévia técnica usa technical-timing.json, alignmentType=estimated-technical-only, sem áudio e com aviso visível. Duração estimada 73,671 s; não representa duração de TTS. Finalizar exige gerar Charon/Puck reais, executar prepare_time_dialogue.py com --assets public/assets/raio-carro --script reports/RAIO-CARRO-2D.md, mixar áudio, registrar a composição final com technical=false e timing real e repetir QA.

## Vozes para retomada

## Prévia técnica exportada

`out/bugi-raio-carro-tecnico-sem-voz.mp4`: Remotion, H.264 1080×1920/30, 2211 frames, 73,700 s e 10.465.640 bytes. Sem stream de áudio por projeto; decode integral FFmpeg passou. Interior e exterior inspecionados por quadros. Não houve escuta, alinhamento acústico, boca sincronizada nem aprovação artística. Lint e 17 testes passaram. PR draft #7; sem publicação.

- Charon: Português brasileiro; narrador adulto grave e claro, ritmo conversado ágil, humor seco. Tensão no gancho e pausa antes de Não. Recomendações tranquilas e firmes, sem tom publicitário.
- Puck: Português brasileiro; Bugi adulto curioso, assustado e irônico. Agradece à borracha com falsa confiança, brinca com a prestação e termina resignado com a oficina. Dicção clara, energia natural e pausas curtas, sem gritaria.
