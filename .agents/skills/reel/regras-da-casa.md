# regras-da-casa.md — Governança Técnica, Zonas Seguras e Áudio

## 1. Geometria e Zonas Seguras (`1080 × 1920` · `9:16` · `30 FPS`)
- **Margem Superior Segura (`0px` a `180px`)**: Reservada exclusivamente ao HUD de Regra Física Bugada (nunca posicionar o rosto do Bugi acima de `y = 200px`).
- **Zona Central de Ação (`200px` a `1380px`)**: Palco principal para o rig articulado do Bugi, objetos interativos e infográficos HyperFrames.
- **Zona Segura de Legendas (`1440px` a `1720px`)**: Acima dos botões e descrições nativas do YouTube Shorts, TikTok e Reels (`SAFE_ZONE_BOTTOM_PX = 380`).
- **Margem Lateral (`56px` esquerda/direita)**: Nenhum texto ou elemento essencial deve tocar as bordas laterais.

## 2. Regras de Animação do Bugi
- **Proibido Frame Congelado**: Mesmo em poses estáticas (`confiante_parado`), o Bugi deve manter respiração sutil (`stretchY`), piscada periódica e reação à voz da narração.
- **Identidade Imutável**: Nunca gerar outro Bugi via modelo de imagem no cenário de fundo. O Bugi é sempre renderizado na camada 6 (`Personagem Bugi`) do `SceneGeometryEngine`.
- **Contato com o Chão**: A menos que a pose seja `flutuando` ou `pulando`, os tênis claros do Bugi devem tocar a linha lógica do chão (`groundLinePxY = 1370`).

## 3. Engenharia de Áudio e Mixagem
- **Volume Alvo da Narração**: Normalizado em **`-14 LUFS`** (padrão broadcast para plataformas verticais).
- **Ducking Automático de Trilha**: A música instrumental de fundo deve operar a `-22 dBFS` durante pausas e reduzir automaticamente para `-30 dBFS` (redução de `-8 dB`) sempre que houver voz ativa.
- **Efeitos Sonoros (SFX)**: Impactos, escorregões e transições devem ocorrer no exato frame da ação física, em `-16 dBFS`.
