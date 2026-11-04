# Ferramentas de animação — 04/11/2026

Base: b608936; branch isolada `codex/melhorias-animacao-20261104`. Checkout original possui alterações em andamento e não foi modificado. Workflow: `docs/WORKFLOW-ANIMACAO-E-SKILLS.md`.

## Skills instaladas

O instalador do Codex copiou as skills para `.agents/skills`; cada diretório recebeu `LICENSE.upstream` MIT. Foram inspecionados manifestos e procurados comandos de rede/execução nos SKILL.md antes da instalação; scripts empacotados não foram executados. A seleção e as limitações de uso estão no workflow.

| Pacote | Commit de origem | Skills |
|---|---|---|
| iart-ai/data-animation-skills | 8ce2709c3992490251e8a991535b1945f01c6865 | animated-infographic, chart-animation, presentation-video |
| iart-ai/tiktok-video-skills | 2a775336b5a638cbf8a61dbd785f9a1b649be016 | caption-animation, countdown-video, lower-thirds, short-form-video |
| iart-ai/explainer-video-skills | 3e2d411b725d9a72939cf8e5eb81579e751373e7 | diagram-animation, explainer-video, isometric-animation, whiteboard-animation, wrapped-video |
| iart-ai/motion-design-skills | 3c129f769d90a1328c209c386492333c9ac62312 | after-effects, animation-principles, beat-sync-editing, color-motion, logo-animation, motion-art-direction, motion-background, remotion-video, shot-composition |
| iart-ai/kinetic-typography-skills | fccc94bd325d824235ee9e715e65abde57b6513a | kinetic-typography |

Não adotar como fato as métricas sem fonte e promessas de viralização contidas em algumas skills externas. Toda orientação externa cede à identidade, ao código e às instruções deste projeto.

## Ferramentas nativas

* **Rhubarb 1.14.0:** arquivo oficial Windows baixado; SHA-256 `62FA416A8D5E382A3828EE4BEF358CE520D0B4CABDEAEA75A7AC266D098D1FE3`; licença MIT e dependências inspecionadas. `rhubarb.exe --version` retornou 1.14.0. A primeira execução falhou ao resolver o executável no caminho com acento. Uma cópia em `%TEMP%/bugasse-rhubarb-runtime` executou `-r phonetic -f json` sobre o WAV real `public/assets/pilot-atrito-v1/narration-original.wav` e gerou `%TEMP%/bugasse-rhubarb-test.json` com 12,08 s e boca por intervalo. Teste técnico, ainda sem validação visual ou integração ao vídeo. O ZIP não apresentou digest na API da release.
* **Rigby2D 0.4.3:** portátil oficial baixado em `tools/vendor`; SHA-256 `E4E1C9D8ED865F6765BE2124CEFD1057A610A956F4B036BB37C16583AB332301` coincide com a API GitHub. MIT ou Apache-2.0; executável sem assinatura Authenticode. Não foi aberto nem integrado ao Remotion; assets demonstrativos têm licença própria.
* **WhisperX 3.8.4:** fonte inspecionada (BSD-2-Clause) e instalado em `.venv-whisperx`, isolado do Python global. `pip check` passou e `python -m whisperx --help` iniciou. Teste técnico com áudio real de 12,08 s, `--model tiny --language pt --device cpu --compute_type int8 --vad_method silero`, concluiu e gerou JSON com tempos por palavra em `%TEMP%/bugasse-whisperx-test/`. A transcrição tem erros (por exemplo, nomes e palavras do roteiro); revisão e correção são obrigatórias antes de usar legendas. O Windows exibiu aviso de falha na inicialização do torchcodec, embora este teste com Silero tenha concluído. Integração automática ao pipeline e QA visual ainda não executados.

## Dependências JavaScript e verificações

`npm install --ignore-scripts --save-exact flubber@0.4.2 d3@7.9.0 ikts@1.3.7` terminou com sucesso no checkout isolado. Um teste Node importou Flubber e produziu um caminho SVG interpolado, mapeou 5 para 50 com D3 e carregou `IK.Chain2D`. Isso demonstra carregamento básico, não integração ao rig ou render.

`npm run lint`: passou. `npm test`: 17/17. `npm run build`: passou com avisos de chunks e de importação dinâmica do projeto. `npm audit --omit=dev`: quatro alertas de severidade alta associados à cadeia Firebase/Firestore/@grpc/grpc-js; não foi aplicada a troca maior sugerida automaticamente, pois exige análise de compatibilidade para preservar o Firebase. `gh` não está disponível no PATH.

Os binários locais e ambiente virtual são ignorados pelo Git; não são transportados no commit/PR. Não houve teste de render de vídeo nesta alteração.

## Rollback

Reverter os commits desta branch; os arquivos em `tools/vendor` e `.venv-whisperx` são locais e podem ser removidos individualmente se não forem necessários. Não apagar nem substituir o checkout original.
