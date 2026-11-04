# Primeiro episódio Bugi — Ar-condicionado

## Origem e execução

Novo roteiro integral de onze falas com gancho “economizar dois reais e gastar nosso relacionamento”, ironia e uma ocorrência de “cacete”, conforme direção aprovada. AI Studio: modelo exibido gemini-3.8-flash-tts, Kore para passageira e Puck para Bugi. Todas as onze caixas foram lidas pela interface e comparadas antes de gerar. Gerado e baixado WAV real de 52,44s, preservado em public/assets/primeiro-bugi/dialogo-original.wav. Custo cobrado desconhecido. Bloqueio 403 anterior superado nesta sessão; registro anterior permanece histórico.

Transcrição local estimada por palavra. Correções ortográficas no componente: R/$2 para dois/reais, cao para carro, condicionado sem hífen isolado, passageiro para passageira conforme roteiro. A escuta humana ainda é necessária para confirmar a fala ambígua; o ASR não comprova pronúncia.

## Visual e animação

Rig oficial BugiArticulatedSvgFigure colocado no motorista. Expressões de confiança, ironia, dúvida, surpresa e reação: sobrancelhas, pupilas, escala dos olhos, cabelo, inclinação de cabeça e boca. Passageira tem sobrancelhas de irritação/ironia, olhar lateral, piscadas e boca durante fala. Movimento de boca é aproximação por palavras, não lip sync por fonemas.

Interior em tela cheia com retrovisor, volante, cintos, console e portas. Entradas de títulos em 0,28s, reenquadramento por turno, duas passagens para gráficos em tela cheia com slide/fade; diagramas de compressor e resistência do ar. Câmera e ações dirigidas por frame, com a mesma composição no preview e no render. Voz original preservada e mix separada normalizada. Não houve uso de vídeo de IA ou de terceiro.

## Ciência

Fontes mantidas: https://www.energy.gov/articles/tips-your-tank-summer-driving-season e https://www.osti.gov/biblio/1092236. Orientações dependem de carro, velocidade, calor e carga de refrigeração; nenhum limiar universal nem percentual de economia foi inventado. As frases “bebe gasolina” e “sempre economiza” são afirmações de personagem corrigidas no diálogo. Dados visuais são relações qualitativas ilustradas.

## Arquivos e QA

Export concluído: out/debate-ar-bugi-primeiro-final.mp4, 52,608s, 1578 quadros, 1080×1920/30fps H.264/AAC. Lint e decode integral passaram. Folha qa/debate-ar/primeiro-bugi-contato.png inspecionada. Ganho final de -1,6dB aplicado ao áudio com imagem copiada sem recodificação; mix-final.wav aplica o mesmo ganho no preview. Medido no MP4 final: -14,0 LUFS, -4,1 dBFS true peak. SHA256: 2AC5CB7D0854C0B280372CED83E2B1C3AB1EE66BB98571E2F98BBF7468C6A2A2. Sem aprovação artística ou escuta humana certificada.

src/remotion/car/FirstCarDebate.tsx, PilotRoot.tsx, public/assets/primeiro-bugi/{dialogo-original.wav,mix.wav,transcript.json,manifest.json}. Lint passou. Export e métricas registrados após render; aprovação artística/auditiva pendente. Original anterior permanece preservado. Sem publicação externa.

Rollback: reverter apenas commits desta branch; não usar clean/reset devido aos arquivos locais de usuário.
