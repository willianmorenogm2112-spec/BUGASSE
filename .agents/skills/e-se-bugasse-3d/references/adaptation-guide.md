# Adaptação das skills instaladas para Bugi 3D

Este mapa evita duplicar skills neutras. A skill original continua responsável por sua especialidade; esta referência acrescenta o contrato Bugi 3D.

## Contrato comum

- Rig/personagem: use `bugi-3d/kit/assets`, preset `bugi`, esqueleto e clips Three.js; não aplique rotinas de rosto humano nem o rig SVG 2D.
- Cena: storyboard do kit, câmera 3D, iluminação, cenário e ações determinísticas pelo tempo/frame.
- Finalização: Remotion continua sendo timeline, Player e render final. O render FFmpeg do kit é diagnóstico ou asset intermediário.
- Voz/legenda/SFX: Gemini TTS real, alinhamento auditável, safe zones 9:16 e mix subordinado à fala.
- QA: validar silhueta, articulações, contato com o solo, colisões, materiais, sombras, z-fighting, clipping, paridade Player/export e áudio.

## Grupos

### Canal — variantes 3D específicas

`e-se-bugasse-producao`, `remotion-qualidade`, `skill-reel-adaptacao`, `reel`, `reel-upstream`, `photocraft`, `filmcraft`.

Use as variantes `*-3d` deste repositório. `reel-upstream` é somente fonte de princípios; não execute tracking de apresentador humano.

### Remotion — reutilização com contrato 3D

`remotion-best-practices`, `remotion-captions`, `remotion-create`, `remotion-docs`, `remotion-interactivity`, `remotion-license`, `remotion-maps`, `remotion-markup`, `remotion-multimedia`, `remotion-render`, `remotion-saas`, `remotion-studio`, `remotion-to-hyperframes`, `remotion-upgrade`, `remotion-video`.

Mantenha cada frame como função determinística. Uma cena Three.js precisa ser dirigida pelo frame do Remotion ou entrar como asset intermediário versionado; nunca mantenha duas timelines independentes alegando paridade.

### HyperFrames e mídia — overlays, não motor principal

`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`.

Use títulos, diagramas, gráficos, HUDs e transições quando melhorarem a explicação. Renderize/valide o asset e componha no Remotion. Não recrie Bugi nem o cenário principal em HyperFrames.

### Direção, movimento e edição — neutras

`animation-principles`, `motion-art-direction`, `shot-composition`, `beat-sync-editing`, `short-form-video`, `explainer-video`, `caption-animation`, `color-motion`, `kinetic-typography`.

Converta decisões em poses, curvas, câmera, luz e cortes do espaço 3D. Antecipação, contato, ação, overshoot e recuperação devem alterar juntas/transformações reais; câmera sozinha não conta como atuação.

### Gráficos e formatos especializados — overlays/segmentos

`animated-infographic`, `chart-animation`, `countdown-video`, `diagram-animation`, `isometric-animation`, `logo-animation`, `lower-thirds`, `motion-background`, `presentation-video`, `whiteboard-animation`, `wrapped-video`.

Use somente quando o episódio pedir esse formato. Gráficos ficam em planos legíveis ou overlays; não cubra rosto, mãos ou ação. Isometria pode usar câmera ortográfica do Three.js. Whiteboard/presentation não substituem animação física do episódio.

### Ferramentas auxiliares — opcionais

`after-effects`, `figma`, `reverse-any-video`, `slideshow`, `style-sampling`.

Servem para referência, layout, análise ou acabamento. Não são requisito de todo vídeo e não autorizam copiar conteúdo protegido. Qualquer saída entra como asset com origem/licença e precisa ser validada no Remotion.

## Critério de cobertura

O arquivo `skill-coverage.json` lista os nomes conhecidos. O verificador falha se uma skill instalada não estiver classificada, evitando que uma instalação futura fique fora do workflow 3D.
