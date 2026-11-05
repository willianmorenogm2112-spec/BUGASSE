---
name: skill-reel-esebugasse
description: Diretrizes de edição cinematográfica, sincronização de palavras, efeitos sonoros e composição Remotion adaptadas da Skill Reel para as linhas Bugi 2D e Bugi 3D.
license: MIT
metadata:
  version: 2.0.0-windows-adapted
---

# Skill Reel — Adaptada para E Se Bugasse? Studio (Bugi 2D e 3D)

Esta skill foi inspecionada, auditada e adaptada a partir do ecossistema `https://github.com/Felpborges/skill-reel` para operação em **Windows (PowerShell + Codex + Remotion)** e integrada diretamente ao motor de vídeo do **E Se Bugasse? Studio**.

## Escopo e Adaptação de Segurança

1. **Sem Reconhecimento Facial em Personagem 2D**:
   - A Skill Reel original utiliza detecção facial para reenquadrar apresentadores humanos gravados em câmera.
   - No canal **E Se Bugasse?**, o protagonista **Bugi** é um rig vetorial 2D canônico (`BugiCanonical2DSvgRig`). Rotinas de detecção facial (`face-api` / `mediapipe`) estão **desativadas por padrão** para evitar distorções de enquadramento e consumo desnecessário de CPU.
2. **Compatibilidade Windows (Caminhos e Comandos)**:
   - Todos os caminhos relativos usam `path.join` / separadores compatíveis com Windows PowerShell (`\`).
   - Nenhum script bash remoto (`curl | sh`) é executado sem revisão.

3. **Rota Bugi 3D**:
   - Leia `../e-se-bugasse-3d/SKILL.md` e use `skill-reel-adaptacao-3d`.
   - Substitua o rig SVG por preset/esqueleto Three.js e enquadramento por root/head/hands/bounding box.
   - Detecção facial humana continua desativada. Cortes, legendas e SFX seguem os mesmos timestamps, mas o QA inclui contato, clipping, z-fighting, sombras e continuidade espacial.

## Referências Obrigatórias da Skill

- `ESTILO.md` — Paleta oficial (`#122638`, `#39C8D5`, `#FF6B50`, `#FFD166`, `#FFF7E9`), tipografia (`Bricolage Grotesque`, `Plus Jakarta Sans`, `JetBrains Mono`) e regras de destaque de palavras-chave.
- `regras-da-casa.md` — Zonas seguras (`1080 × 1920`), ritmo de corte, normalização de áudio em `-14 LUFS`, *ducking* de trilha sonora e proibição de elementos congelados.
- `modelo/README.md` — Estrutura das composições Remotion e integração opcional com **HyperFrames** (`HTML + GSAP` determinístico).
