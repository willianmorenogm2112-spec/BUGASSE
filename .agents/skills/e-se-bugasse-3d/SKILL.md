---
name: e-se-bugasse-3d
description: Criar, adaptar ou revisar cenas low-poly do Bugi 3D usando o kit Three.js isolado, mantendo Remotion como timeline e render final. Use em vídeos, rigs, cenários, storyboards e QA da linha Bugi 3D; não use para alterar o rig Bugi 2D.
---

# E Se Bugasse? — Bugi 3D

Leia `bugi-3d/README.md`, `bugi-3d/PROVENANCE.json` e [references/adaptation-guide.md](references/adaptation-guide.md) antes de trabalhar no módulo. A referência mapeia todas as skills instaladas para contratos 3D. Consulte `bugi-3d/kit/catalog/RESUMO.md` para escolher assets e `bugi-3d/kit/docs/processos.md` quando a cena explicar um processo.

## Invariantes

- Preserve o Bugi 2D. Toda mudança 3D fica em `bugi-3d/` ou em adaptadores Remotion explicitamente nomeados como 3D.
- Use o preset `bugi`; mantenha cabelo coral, jaqueta petróleo, camiseta creme, calça escura e tênis claros.
- O player Three.js deve ser determinístico a partir do tempo/frame. Animação real inclui pose, contato, fluxo, transformação ou máquina; câmera sozinha não conta.
- O render próprio do kit é diagnóstico/protótipo. O entregável final precisa passar pelo Remotion e usar a mesma composição apresentada no Player.
- Use Gemini TTS real e alinhamento auditável. Não rotule Kokoro/ElevenLabs como voz oficial sem decisão explícita do usuário.
- Não instale o instalador de voz do pacote nem baixe modelos automaticamente. Inspecione comandos, registre tamanho/origem e peça autorização se houver custo ou instalação relevante.
- Registre fontes científicas e marque simplificações. Não prometa viralização.

## Fluxo

1. Defina hipótese, roteiro e beats conforme a identidade do canal.
2. Modele cada beat no storyboard do kit com cenário real, ação e continuidade.
3. Rode `npm run catalog`, `npm run check` e o validador do projeto 3D.
4. Gere quadros diagnósticos e revise contatos, escala, rosto, cabelo, câmera e safe zones.
5. Integre a cena aprovada ao pipeline Remotion; valide áudio, duração, H.264/AAC e paridade Player/export.
6. Registre evidências e limitações nos relatórios do repositório. Não marque produção 3D como pronta sem render real e QA artístico.

## Roteamento de skills

- Produção completa: use `e-se-bugasse-producao-3d`.
- Paridade Player/export: use `remotion-qualidade-3d` e as skills oficiais Remotion.
- Cortes, legendas, SFX e retenção: use `skill-reel-adaptacao-3d` mais as skills neutras indicadas no mapa.
- Pré-processamento de imagens e acabamento: `photocraft-3d` e `filmcraft-3d` somente quando os binários estiverem realmente disponíveis.
- Rode `node .agents/skills/e-se-bugasse-3d/scripts/check-skill-coverage.mjs` após instalar ou remover skills.
