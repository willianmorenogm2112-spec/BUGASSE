# Gravidade — edição final V3 (06/11/2026)

## Pedido e execução

Reduzir textos inúteis, melhorar gráficos/legendas, identificar a fala do narrador por efeito visual, reforçar a interação Bugi/narrador e corrigir braços/pernas. Preservados roteiro de 13 turnos, vozes reais Puck/Charon e alinhamento acústico original; nenhum TTS adicional ou gasto novo.

| Área | Implementado | Testado / evidência | Limite |
|---|---|---|---|
| Tela limpa | Retirados títulos repetitivos, rótulos de speaker e rodapé fixo; pequena indicação inicial da hipótese | GravityFinal.tsx; quadros e MP4 V3 | Premissas científicas indispensáveis mantidas nos diagramas |
| Legendas | 60 páginas por pontuação, duração e caracteres; 200 palavras, uma em destaque, duas linhas no máximo nas amostras | GravityCaptions.tsx; legendas-final.srt; piloto e export | Alinhamento WhisperX original, sem alegar visemas |
| Narrador | Cápsula ciano e barras respondem ao envelope real; conectores conduzem ao gráfico; Bugi escuta de boca fechada | GravityFinal.tsx; prévia reproduzida no Studio e MP4 | Sinal gráfico representa voz externa; não é outro personagem |
| Gráficos | Barras 785/1570 N em proporção 1:2, salto com altura/tempo distintos, queda com relógios e impactos | GravityGraphics.tsx; still de gráfico e folha completa | Comparações idealizadas com condições indicadas |
| Braços | Cotovelos fora do tronco; alvos limitados a alcance; transição de punhos entre falas | gravityMotion.ts; teste de 46/42 unidades em braços | Rig estilizado 2D, sem anatomia realista ou mocap |
| Pernas | Projeção encurtada ao sentar, joelhos próximos do corpo; pés e tronco sobem juntos no salto | 5 testes; gravidade-final-salto-sequencia.jpg | Encurtamento é projeção 2D de membros apontando à câmera |
| Ritmo | Contraste de enquadramento na intervenção do Bugi e foco no objeto quando o narrador responde | Piloto final e folha V3 | Sem falas novas; diálogo original mantido |

## Arquivo entregue

- `out/bugi-gravidade-final-v3.mp4`: **69,184 s**, **9.665.348 bytes**, **2.075 frames**, **1080×1920 / 30 FPS**, **H.264 + AAC**.
- SHA256: `EC180C2E75C9A4BE9BA17762E557C3B272FD6BEF10BF094AAF58C04E42F359CD`.
- Mesma composição do Player: `src/remotion/GravityRoot.tsx`, `Bugi-Gravidade-Dobrada` → `GravityFinal`.
- Piloto: `out/bugi-gravidade-final-piloto-v3.mp4`, 12 s, 1.739.050 bytes.
- Sidecar: `public/assets/gravidade/legendas-final.srt`.

## QA executado

`npm run lint`: passou. `npm test`: 17/17. `npx tsx --test src/remotion/gravity/gravityMotion.test.ts`: 5/5. `npm run build`: passou, com avisos existentes de bundle/importação dinâmica. `git diff --check`: passou.

Remotion CLI exportou piloto e vídeo completo. `ffprobe` confirmou metadados. `ffmpeg -v error -i <MP4> -f null NUL`: decode integral sem erros. `blackdetect=d=0.1:pix_th=0.05`: sem intervalos pretos reportados. Mix do MP4 medido: **-17,08 LUFS**, **-4,96 dBTP**, **LRA 4,4 LU**; voz/áudio original preservados.

Revisão amostrada: `out/gravidade-final-piloto-sequencia.jpg` (3 fps), `out/gravidade-final-v3-contato.jpg` (a cada 3 s), `out/gravidade-final-salto-sequencia.jpg` (10 fps em 1,2 s). Still inicial detectou texto extrapolando cápsula e número próximo da barra: ambos corrigidos antes do MP4 completo. Prévia do Player reproduzida; taxa observada 17 FPS no host sob carga, portanto não é prova de reprodução em tempo real a 30 FPS. Export codificado é 30 FPS. Não certificar escuta humana ou aprovação artística integral sem o usuário assistir; arquivo entregue para revisão final, não publicado.

## Continuidade e rollback

Padrão salvo em docs/WORKFLOW-ANIMACAO-E-SKILLS.md, carregado pelo AGENTS.md local. Novos testes protegem apoio, alcance e salto. Não houve instalação, chamada paga, HyperFrames, PhotoCraft ou FilmCraft nesta revisão. Fontes científicas e proveniência Gemini continuam em reports/GRAVIDADE-2D.md e public/assets/gravidade/provenance.json.

Branch `codex/gravidade-final-edicao-20261106`, base `d4e44e4`. Reverter os commits desta branch restaura a composição V2, mantendo outputs anteriores. Nenhum merge em main.
