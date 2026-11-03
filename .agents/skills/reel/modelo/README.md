# modelo/README.md — Arquitetura do Template Remotion + HyperFrames

## Estrutura de Módulos (`src/remotion/`)

- `compositions/ESeBugasseVideoComposition.tsx`: Composição principal `1080 × 1920` a `30 FPS`.
- `scenes/RemotionSceneComposer.tsx`: Renderiza as 8 camadas ordenadas do `SceneGeometryEngine`.
- `characters/BugiRemotionCharacter.tsx`: Conecta o frame atual do Remotion (`useCurrentFrame()`) à cinemática articulada de 12 movimentos do Bugi.
- `backgrounds/SceneBackgroundLayer.tsx`: Compõe o cenário 2D limpo (IA ou vetorial) com parallax horizontal/vertical.
- `effects/PhysicsEffectsLayer.tsx`: Renderiza partículas, vetores de força e o adaptador determinístico **HyperFrames (`window.__timelines`)**.
- `captions/SkillReelCaptionsLayer.tsx`: Legendas sincronizadas palavra por palavra (`@remotion/captions`) com destaques em ciano (`#39C8D5`) e amarelo (`#FFD166`).
- `transitions/SceneTransitionWrapper.tsx`: Cortes secos, *whip pans* de 6 frames e flashes de alerta físico.
- `audio/EpisodeAudioController.tsx`: Sincroniza o WAV da narração (`-14 LUFS`), *ducking* musical e SFX por cena.
- `render/mp4RenderEngine.ts`: Motor de exportação MP4 H.264 real (WebCodecs / Canvas + Muxer + Fallback Servidor).
