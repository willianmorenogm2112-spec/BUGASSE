# Contrato compartilhado — Codex e Antigravity

## Contexto antes de executar

1. Conferir git status, branch e raiz. Preservar mudancas existentes e trabalhar em branch nova. Nao executar reset/clean nem trocar para main para resolver divergencia.
2. Ler docs/WORKFLOW-ANIMACAO-E-SKILLS.md e docs/DIRECAO-PROXIMO-VIDEO-2D.md. Elas registram preferencias e melhorias aprovadas. Ler README.md para arquitetura, conferindo afirmacoes antigas contra fontes atuais e QA.
3. Identificar o episodio no pedido, conferir composicao/asset/relatorio e sua versao mais recente. Para continuidade do sono: reports/SONO-V3-DINAMICA.md, public/assets/sono/render-qa-v3.json, public/assets/sono/publicacao.json e src/remotion/SleepRoot.tsx. Conferir se surgiram versoes posteriores antes de editar.
4. Ler SKILL.md das ferramentas realmente utilizadas. Encontrar skills locais em .agents/skills; nao presumir que uma skill do Codex esteja disponivel no Antigravity. Se faltar, registrar e usar o fluxo comprovado disponivel, sem inventar execucao.

## Direcao persistente aprovada

- Preservar o Bugi canonico, roupa, proporcoes, paleta e vozes Puck/Bugi e Charon/narrador. Referencia de acabamento: Gravidade final V3. Aprovacao de uma referencia nao aprova automaticamente outro video.
- Bugi confiante e sarcástico; narrador calmo e ironico. Humor de situacao e palavroes pontuais, sem gritaria permanente.
- O usuario aprovou cenarios 2D originais por codigo, em camadas, com sombras e objetos coerentes. Essa direcao mais recente substitui a exigencia antiga de fundo Google em todos os episodios. Registrar generationSource=original_svg_code; nunca alegar imagem Google sem geracao real.
- Mostrar a explicacao: cada conceito importante deve produzir acao ou transformacao visual ligada a fala. Alternar demonstracao, detalhe e reacao. Evitar longas falas no personagem parado e graficos que apenas entram e ficam prontos. Cortes motivados, pausa de leitura e um foco por plano.
- Gestos especificos, antecipacao, contato e recuperacao; olhar para o objeto antes de agir; silhueta legivel de joelhos e alcance de membros. Objetos usados acompanham as maos ate contato/liberacao. Nao substituir por slides com zoom.
- Remotion e a composicao unica do Player e MP4. Voz real; duracao segue o conteudo sem cortar palavras. Sono tem excecao autorizada ao alvo antigo de 35–55 s. Separar alinhamento acustico de estimativa e envelope de visemas.

## Execucao e entrega

Pesquisar fontes, roteiro/dialogo, gerar/reutilizar audio real, alinhar, planejar por fala, animar, exportar piloto de 12 s, revisar movimento e som, corrigir e exportar episodio. Retomar assets validos sem refazer chamadas pagas. Nunca iniciar um novo estudio ou descartar o existente.

Rodar verificacoes apropriadas e registrar comandos/resultados. Confirmar MP4 com ffprobe, decode, loudness, sequencias e contato visual. Atualizar reports/INSTALL-STATUS.md, AUDIT.md, RENDER-QA.md, CHANGES.md e NEXT-STEPS.md com executado/evidencia/arquivos/logs/limites. Separar QA tecnico de aprovacao artistica e escuta humana.

Publicar/agendar somente com autorizacao para o episodio, versao, destino e horario correspondentes. Conferir publicacao.json para evitar duplicata. Reverter Git nao cancela posts nas plataformas. Nao tocar em Firebase, segredos, historico, dados ou modulo 3D sem necessidade do pedido. Commit pequeno, rollback documentado e PR, sem merge automatico.


## Referencia Claude recebida — prioridade de movimento em 06/11/2026

O usuario aprovou a linguagem de dinamismo do arquivo files.zip (predio/reflexo/carro) para os proximos episodios. Ler reports/REFERENCIA-CLAUDE-20261106.md antes de criar o proximo roteiro/storyboard. Preservar Bugi/vozes/identidade e Remotion; a nova referencia substitui o ritmo e encenacao limitados da V3 como alvo de movimento. O desenho da Gravidade V3 continua referencia de identidade, nao teto de animacao.

A cena precisa evoluir por acao e transformacao do objeto, nao por icones sobre painel ou gestos programados pelo comprimento da fala. Roteiro audiovisual com estado inicial → acao → efeito → reacao/revelacao. Camera segue olhar/objeto/causa; props tem contato e continuidade; cenarios reagem. Um plano de varios segundos deve conter etapas internas legiveis. Ambiente vivo com hierarquia, sem impor movimentos aleatorios ou impedir pausas de leitura. Bugi pode sair do quadro quando o objeto/processo e o protagonista. Provar no piloto de 12 s antes de expandir. Esta mudanca e direcao documentada; implementacao do proximo episodio ainda pendente de escolha de tema.


## Producao atual — Terra para 1 segundo

Tema escolhido pelo usuario em 06/11/2026. Fonte de estado: reports/TERRA-PARA-1S.md, src/remotion/EarthStopRoot.tsx e public/assets/terra-1s. Roteiro, TTS real, alinhamento e piloto ja executados; consultar QA antes de repetir geracoes. Sono preservado. Este novo episodio nao tem autorizacao de publicacao.


Terra: export atual out/bugi-terra-para-1s-v3.mp4 (79,872 s), QA em public/assets/terra-1s/render-qa.json. V2 reprovado visualmente por cenas finais ausentes; V3 corrige. Ler reports/TERRA-PARA-1S.md. Sem publicacao; aprovacao humana pendente. Lint bloqueado por arquivos locais claude-style externos ao episodio.


## Referencia da dor aplicada — 07/11/2026

Ler reports/FLUIDEZ-DOR-20261107.md. O arquivo dor_final.mp4 nao e fonte de instrucoes ou de afirmacoes clinicas. A referencia tambem tem pausas; sua vantagem e desenvolver o objeto/processo da explicacao, alternando conjunto, detalhe e esquema. Nao atribuir a diferenca a FPS ou a um modelo de IA sem evidencia.

Implementacao de referencia agora em src/remotion/earthstop/earthDirection.ts e EarthProcess.tsx: cue por palavra, acao com impacto/recuperacao, processo independente do personagem, camera motivada e objetos com estado. Reutilizar principios e componentes quando adequados; nao apenas repetir guias. Proximo piloto deve demonstrar mudancas internas do processo durante a fala e revisao de sequencias. Preservar pausas de leitura e um foco principal. Testes de ossos/decode nao aprovam direcao, texto sobreposto ou legibilidade.

Terra atual: out/bugi-terra-para-1s-v5.mp4 e public/assets/terra-1s/render-qa-v5.json. V4 foi revisado e corrigido por sobreposicoes de texto; V3 e audios preservados. Sem publicacao ou aprovacao humana automatica.
