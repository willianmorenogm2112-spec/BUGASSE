# QA de mídia existente — 2026-11-04

Executado: ffprobe, decodificação integral FFmpeg e medição ebur128 do `data/media/piloto-12s-premium-v2.mp4`; inspeção de `reports/qa-pilot-12s-v2/contato.png`.

| Medida | Resultado |
|---|---|
| Tamanho | 4.194.310 bytes |
| Vídeo | H.264, 1080x1920, 30 FPS, 360 frames |
| Áudio | AAC, duração 12s |
| Duração | 12s |
| Decodificação | Sem erros reportados |
| Loudness integrado | -15,4 LUFS |
| True peak | -1,1 dBFS no resumo ebur128 com peak=true |
| WAV associado | PCM s16le, 11,24s, 539.564 bytes |

Evidência: comandos ffprobe com show_entries; `ffmpeg -v error -i <mp4> -f null NUL`; `ffmpeg -hide_banner -nostats -i <mp4> -af ebur128=peak=true -f null NUL`. Relatórios anteriores preservados em `reports/qa-pilot-12s-v2/`.

Inspeção visual da folha: múltiplas poses; fundo geométrico; legendas apresentam palavras visualmente coladas; poste de interação surge nos quadros intermediários. Folha não comprova fluidez em sequência.

Limitações: sem escuta nesta auditoria; origem Gemini da voz não comprovada por WAV; sem comparação Player/MP4; sem evidência de fundo Google neste script; render usa HTML próprio com FFmpeg. Resultado técnico não equivale a aceite artístico ou aprovação do piloto exigido pelo kit. Nenhum novo vídeo foi gerado.
