# QA de mídia existente — 2026-11-04

## Short Tempo v1

Executado: render Remotion real de 50,600s, 1515 quadros, 1080×1920/30 fps H.264/AAC; decode integral sem erros; −14,2 LUFS e true peak −2,5 dBFS. Evidência: `out/short-tempo-final.mp4`, `qa/short-tempo/contact-sheet-final.png` e `SHORT-TEMPO-V1.md`. Limitação: alinhamento ASR estimado, escuta humana e aprovação artística pendentes.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: revisão v4 com cenário inteiramente SVG, Bugi 22% menor, poste enquadrado desde o início e queda com pés livres. Evidência: out/piloto-atrito-v4-codigo.mp4; 375 frames, 1080x1920 H.264/30 FPS, AAC, 12,501s, 5.610.279 bytes. FFmpeg decodificou sem erros; lint e 3 testes do piloto passaram. Inspeção visual da folha qa/pilot-atrito-v1/contato-v4.png realizada. Arquivos e limites em PILOTO-ATRITO-V4.md; legendas estimadas e aprovação artística/escuta humana pendentes.

## Novo piloto Remotion v3 — 2026-11-04

Executado: render real de ESeBugasseVideoComposition pelo PilotRoot; voz Gemini gerada/baixada no AI Studio e cenário via imagegen após autorização do usuário. `out/piloto-atrito-v3.mp4`: 11.803.789 bytes, 12,501s, 375 frames, 1080x1920 H.264/30 FPS, AAC; decode sem erros; -14,0 LUFS, true peak -3,4 dBFS medidos. Evidências e logs locais: qa/pilot-atrito-v1/render-v3.log, ffprobe-v3.json, loudness-v3.log, contato-v3.png e sequencia-pegada-v3.png. Arquivos, comandos, ajustes e limites completos em PILOTO-ATRITO-V3.md. Status: aguardando revisão visual e auditiva, legendas com tempos estimados; sem aprovação automática. O bloqueio de cenário Google foi substituído por fonte OpenAI explicitamente autorizada, não disfarçado como sucesso Google.

## Complemento da pesquisa de Reels

Não houve novo render. Executado ffprobe no exemplo local da Skill Reel: 38,8s, 540x960, 30 FPS, H.264/AAC, 3.125.937 bytes. Folha original anexos/quadros-01.png inspecionada, sem afirmar escuta ou reprodução integral. Referências externas tiveram inspeção por amostras/descrição/código conforme PESQUISA-REELS-CODIGO.md. Nenhum candidato recebeu aprovação artística do canal; MODELO-REELS-BUGI.md é especificação proposta, não vídeo entregue. Logs na conversa; limitação: paridade do piloto BUGASSE continua pendente.

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
