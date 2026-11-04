# Piloto Atrito v4 — cenário em código

Branch: codex/cenario-codigo-20261104. Base: 30e604b. Pedido: reduzir Bugi, eliminar entrada inesperada do poste e integrar o cenário à animação.

## Executado

- Removida a imagem gerada da composição ativa; arquivo original preservado para rollback.
- Rua SVG com fachadas, janelas, portas, marquises, nuvens e pavimento. Fundo distante e fachadas têm deslocamentos menores que o mundo do personagem.
- Bugi e poste compartilham uma transformação de escala 0,78 e coordenadas de mundo: personagem 22% menor que v3; câmera avança 300 em vez de 495 unidades.
- Poste existe e está enquadrado desde o frame zero; topo elevado de 417 para 252 unidades, mantendo o contato da mão em (620,466). A câmera aproxima a interação sem criar o objeto.
- Legendas deslocadas para y=1430 para liberar os pés. Títulos continuam fora da área de ação.
- Na queda, os pés deixam o apoio entre 9,75 e 11,35s; tronco desce e gira até -88 graus. Isso evita a perna esticada artificialmente por uma restrição de contato durante o tombo.
- Voz Gemini Enzo e mix reais preservadas; nenhum novo serviço de geração utilizado.

## Arquivos e evidências

src/remotion/pilot/FrictionPilot.tsx: cenário, escala, câmera, poste, legendas.
src/remotion/pilot/motion.ts: trajetória da queda e liberação dos pés.
src/remotion/pilot/motion.test.ts: teste de apoio limitado ao trecho em que o pé realmente apoia.
src/remotion/PilotRoot.tsx: removida URL do cenário bitmap.
Prévia e export usam o mesmo PilotRoot/ESeBugasseVideoComposition.

## Limitações

A animação continua cartoon por keyframes/IK; não é simulação física numérica. Prédios ficam em plano de fundo; não equivalem a medidas arquitetônicas reais. Legendas usam tempos estimados. Revisão artística e escuta humana ainda pendentes. FilmCraft e HyperFrames não renderizaram esta revisão. Nenhuma publicação remota ou merge.

## Rollback

Reverter os commits desta branch recupera v3; MP4 anterior e imagem original preservados. Não executar clean/reset devido aos arquivos locais preexistentes.

## Verificação do arquivo

Executado: revisão v4 com cenário inteiramente SVG, Bugi 22% menor, poste enquadrado desde o início e queda com pés livres. Evidência: out/piloto-atrito-v4-codigo.mp4; 375 frames, 1080x1920 H.264/30 FPS, AAC, 12,501s, 5.610.279 bytes. FFmpeg decodificou sem erros; lint e 3 testes do piloto passaram. Inspeção visual da folha qa/pilot-atrito-v1/contato-v4.png realizada. Arquivos e limites em PILOTO-ATRITO-V4.md; legendas estimadas e aprovação artística/escuta humana pendentes.

SHA256: D6FEDDE553CAB104A110676F9F2689497298998D08FD1F6202AFD53251B9960B
