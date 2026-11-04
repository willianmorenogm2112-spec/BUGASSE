# Próximos passos — 2026-11-04

## Primeiro Bugi — novo episódio

Executado: nova voz real e montagem. Próximo: revisão humana integral de áudio, expressões e ritmo antes de publicar. Evidência, arquivos e limites: PRIMEIRO-BUGI-EPISODIO.md. O 403 anterior foi superado; não tratar como bloqueio atual.

## Debate Ar

Executado: vídeo local de conversa de casal e explicação científica. Próximo: avaliar proximidade visual com referências e ouvir as duas vozes. Evidência e arquivos: DEBATE-AR-CONDICIONADO.md. Limite: aprovação humana pendente.

## Short Tempo v1

Executado: primeiro episódio completo exportado. Próximo: ouvir integralmente e aprovar ritmo, legendas e arte antes de publicar. Evidência e limitações: `SHORT-TEMPO-V1.md`.

## Skill Reel — revisão v5

Executado: Skill Reel adaptada ao cartoon Remotion, sem instalações; transcrição acústica local, legendas curtas, âncoras de fala, ajuste de queda/SFX e zona segura. Evidência: reports/SKILL-REEL-PILOTO-V5.md e VERIFY-PILOTO-V5.md; MP4 out/piloto-atrito-v5-reel.mp4. Lint e 5 testes passaram; verificador original aprovado: -14,35 LUFS, -3,38 dBTP, 0 alertas de zona segura, 5 SFX. Arquivos: reel.ts, words.json, FrictionPilot.tsx, scripts de áudio/transcrição, assets v5. Limitação: tempos ASR estimados; escuta humana e aprovação artística pendentes; problemas anteriores do app não resolvidos. Próximo: revisão humana antes de expandir o episódio.

## Revisão v4 — cenário em código

Executado: exportada revisão v4 com cenário em código conforme feedback. Evidência/arquivos: PILOTO-ATRITO-V4.md e out/piloto-atrito-v4-codigo.mp4. Próximo: revisão humana da escala, ritmo, contato e áudio; alinhamento acústico das legendas antes do episódio completo. Limitação: ainda não aprovado artisticamente.

## Após o primeiro piloto v3

Executado: piloto real de 12,5s com voz Google e cenário imagegen autorizado; código, assets e QA registrados em PILOTO-ATRITO-V3.md. Evidência: MP4, contato e sequência de pegada em qa/pilot-atrito-v1. Próximo: ouvir a faixa, ajustar legendas por alinhamento acústico/revisão e revisar atuação/contato/perspectiva com o usuário antes de avançar a 35–55s. Nenhuma aprovação artística presumida. Variar cenários por episódio mantendo a identidade do canal; imagem é asset, animação permanece por código. Pendências gerais de segurança/orquestração continuam na auditoria.

## Após a pesquisa de Reels

Modelo recomendado documentado em MODELO-REELS-BUGI.md: cartoon 2D com profundidade por camadas + explicações curtas + montagem guiada pela voz. Pesquisa e referências em PESQUISA-REELS-CODIGO.md. Execução/evidência: consulta às fontes primárias, repositórios, skills e CLI. Limitações: sem novo vídeo; RAM livre muito baixa no diagnóstico; Whisper não funcional e editores nativos não validados. Próxima etapa de produção, conforme pedido do usuário: piloto de 12s no BUGASSE com composição Remotion compartilhada e assets reais. Não requer reescolher marca, paleta ou personagem.

1. Autenticar Express, isolar estado/fila/mídias por proprietário e impor limites de requisição antes de expor o serviço.
2. Remover conclusões sem artefato; distinguir estimativa de cobrança e aplicar orçamento antes de cada chamada paga.
3. Executar fila em worker persistente com hash de entrada, checkpoint por asset e retomada idempotente.
4. Produzir piloto pela composição Remotion compartilhada, com narração real e cenário Google documentado; ajustar beats à duração medida.
5. Corrigir trim da cena isolada e exigir entrada exata na finalização FilmCraft.
6. Comparar frames Player/export, ouvir áudio, inspecionar sequências contínuas e registrar aprovação artística separada.
7. Consolidar lockfile e artefatos aprovados em commits pequenos e PR após revisão do estado local.

Executado nesta análise: inventário parcial, leitura de código, lint/test/build e QA técnico da mídia existente. Evidências: AUDIT.md e RENDER-QA.md. Bloqueios: integração paga não exercitada; sem comprovação de render ponta a ponta nem do processo de produção da referência externa.
