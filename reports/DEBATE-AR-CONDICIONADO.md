# Debate sobre ar-condicionado — versão 1

Branch: codex/ar-condicionado-debate-20261104. Conceito solicitado: misturar conversa de casal no carro com explicação visual de ar-condicionado. Personagens, desenho e falas próprios. Adaptação vetorial 2D; não se reivindica reprodução visual exata do primeiro TikTok, que não teve reprodução integral confirmada.

## Execução

Google AI Studio acessado pela interface. Modelo exibido: gemini-3.8-flash-tts. Oito blocos alternados entre Nika (Speaker 1) e Rami (Speaker 2). Download nativo: Generated Audio November 04, 2026 - 1_34PM.wav, preservado como public/assets/debate-ar/dialogo-original.wav, 33,52s. Sem valor de custo inferido.

Transcrição acústica local faster-whisper small em português. Tempos continuam estimativas automáticas; as falas têm contrações naturais distintas da redação de entrada. Mix normalizada em arquivo separado; original preservado.

CarDebate.tsx: rostos e corpos SVG próprios, bocas dirigidas por atividade de palavras (não fonemas), cintos, bancos, volante, painel, movimento da rua, vento e indicadores. Cortes suaves de enquadramento, títulos por turno e legendas de até três tokens ASR. Remotion é o motor de preview e export, composição Debate-Ar-Condicionado em PilotRoot.tsx. Nenhum vídeo de terceiros foi reutilizado.

## Fontes e limites da explicação

- https://www.energy.gov/articles/tips-your-tank-summer-driving-season — orientação geral para vidros em baixa velocidade e ar em estrada.
- https://www.osti.gov/biblio/1092236 — estudo experimental: consumo depende do veículo e da carga de refrigeração; não assumir limiar universal.

A fala inicial “ar-condicionado bebe gasolina” é a opinião exagerada do motorista, corrigida pelo debate. Não há promessa de economia percentual ou velocidade universal. As imagens são ilustrações, sem pretensão de simulação aerodinâmica.

## Revisão

Lint passou. Render v2 real: out/debate-ar-v2.mp4, 1014 quadros, 1080×1920/30fps H.264/AAC, aproximadamente 33,81s. Decode integral sem erros. EBU R128 mediu -14,0 LUFS e true peak -2,5 dBFS. Folha v1 e quadro final v2 aos 10s inspecionados em qa/debate-ar; corrigido contraste das legendas. SHA256 final: 7614D6D1B67954FC24F06DD254E8BF25A1A8F33FC0B262703FBFFDCE72129F65. Aprovação artística e escuta humana pendentes. Versão local, sem publicação externa. Reverter somente commits desta branch para rollback; preservar demais arquivos locais.
