---
name: skill-reel-esebugasse
description: Diretrizes de edicao cinematografica, sincronizacao de palavras, efeitos sonoros e composicao Remotion adaptadas de Felpborges/skill-reel para o canal de animacao 2D E Se Bugasse? Studio.
version: 2.0.0-windows-adapted
license: MIT
---

# Skill Reel — Adaptada para E Se Bugasse? Studio (Animação 2D Bugi)

Esta skill foi inspecionada, auditada e adaptada a partir do ecossistema `https://github.com/Felpborges/skill-reel` para operação em **Windows (PowerShell + Codex + Remotion)** e integrada diretamente ao motor de vídeo do **E Se Bugasse? Studio**.

## Escopo e Adaptação de Segurança

1. **Sem Reconhecimento Facial em Personagem 2D**:
   - A Skill Reel original utiliza detecção facial para reenquadrar apresentadores humanos gravados em câmera.
   - No canal **E Se Bugasse?**, o protagonista **Bugi** é um rig vetorial 2D canônico (`BugiCanonical2DSvgRig`). Rotinas de detecção facial (`face-api` / `mediapipe`) estão **desativadas por padrão** para evitar distorções de enquadramento e consumo desnecessário de CPU.
2. **Compatibilidade Windows (Caminhos e Comandos)**:
   - Todos os caminhos relativos usam `path.join` / separadores compatíveis com Windows PowerShell (`\`).
   - Nenhum script bash remoto (`curl | sh`) é executado sem revisão.

## Referências Obrigatórias da Skill

- `ESTILO.md` — Paleta oficial (`#122638`, `#39C8D5`, `#FF6B50`, `#FFD166`, `#FFF7E9`), tipografia (`Bricolage Grotesque`, `Plus Jakarta Sans`, `JetBrains Mono`) e regras de destaque de palavras-chave.
- `regras-da-casa.md` — Zonas seguras (`1080 × 1920`), ritmo de corte, normalização de áudio em `-14 LUFS`, *ducking* de trilha sonora e proibição de elementos congelados.
- `modelo/README.md` — Estrutura das composições Remotion e integração opcional com **HyperFrames** (`HTML + GSAP` determinístico).
