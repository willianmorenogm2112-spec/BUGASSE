# Bugi 3D

Linha 3D separada do projeto **E Se Bugasse?**. O produto atual passa a ser identificado como **Bugi 2D**; esta pasta contém a adaptação low-poly do personagem e do catálogo 3D fornecido pelo usuário.

## Limites arquiteturais

- `kit/` constrói personagens, cenários, animações e storyboards Three.js.
- O render próprio do kit é permitido para diagnóstico, quadros e protótipos.
- **Remotion continua sendo a timeline e o render final.** Um vídeo do kit não pode ser publicado como final sem composição/QA no pipeline Remotion do projeto.
- Voz oficial: Gemini TTS real. Kokoro e ElevenLabs permanecem apenas como opções técnicas do pacote, não como padrão do canal.
- Bugi 2D e Bugi 3D não compartilham arquivos de rig; compartilham identidade, paleta, roteiro, ciência, áudio e critérios de QA.

## Estrutura

- `kit/assets`: rig, preset `bugi`, animações e cenários low-poly.
- `kit/engine`: player Three.js determinístico por tempo.
- `kit/tools`: catálogo, validação, preview e render técnico do pacote.
- `reference/source-instructions`: instruções originais preservadas apenas como referência; não substituem o `AGENTS.md` do repositório.
- `PROVENANCE.json`: origem, hash e situação de licença do pacote recebido.

## Estado atual

Integração estrutural concluída. Ainda falta provar paridade entre preview Three.js e uma composição final Remotion antes de considerar o pipeline 3D pronto para produção.
