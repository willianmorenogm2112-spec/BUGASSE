---
name: photocraft-3d
description: Preparar texturas, placas, fundos e máscaras 2D usados pelo Bugi 3D com PhotoCraft quando o CLI estiver instalado e verificado. Não modifica malhas Three.js.
---

# PhotoCraft — assets do Bugi 3D

PhotoCraft atua somente em imagens raster: texturas, céu, placas, thumbnails, overlays e fundos usados na cena 3D.

- Preserve o original e registre hash, dimensões, cor, alpha, origem e licença.
- Não trate uma máscara 2D como geometria, profundidade ou oclusão 3D.
- Não use PhotoCraft para “corrigir” rig, colisão, material ou iluminação; corrija isso no kit Three.js.
- Exporte formatos e espaços de cor compatíveis, teste no material/câmera final e compare Player/export.
- Se o CLI não estiver disponível ou o comando não tiver sido testado, mantenha o asset original e declare indisponibilidade.
