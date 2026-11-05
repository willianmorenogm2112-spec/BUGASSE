---
name: remotion-qualidade-3d
description: Garantir determinismo e paridade entre cenas Three.js do Bugi 3D, Remotion Player e MP4 final. Use ao integrar, pré-visualizar ou renderizar episódios 3D.
---

# Remotion — qualidade 3D

Leia as skills oficiais Remotion relevantes e `../e-se-bugasse-3d/SKILL.md`.

- O frame Remotion é a fonte de tempo. Não use `requestAnimationFrame`, relógio real ou loop independente na captura final.
- Player e exportador precisam montar a mesma composição, props, câmera, luz, materiais e áudio.
- Se a cena Three.js virar asset intermediário, registre resolução, FPS, alpha, duração, hash e frame inicial; proíba retiming implícito.
- Verifique H.264/AAC 1080×1920/30, decode integral e duração. Para o 3D, revise também sombras, z-fighting, clipping, popping, contato e frames não determinísticos.
- FFmpeg do kit não prova paridade Remotion. QA técnico não substitui revisão artística nem escuta.
