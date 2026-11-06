# Como continuar o mesmo projeto no Antigravity

Abra BUGASSE-animacao.code-workspace desta raiz pelo comando File > Open Workspace from File, ou abra diretamente a pasta BUGASSE-animacao. Inicie um chat novo para conferir o contexto sem historico de outro projeto.

Ha dois checkouts do mesmo repositorio nesta maquina: BUGASSE e BUGASSE-animacao. Compartilhar o Git nao torna seus arquivos/branches identicos. Na auditoria de 06/11/2026, BUGASSE estava em fix/animacao-2d-profissional-v2 e nao tinha SleepRoot.tsx nem o workflow visual atualizado. Nao fazer merge/reset automatico; usar o checkout que contem os artefatos pretendidos.

GEMINI.md inclui AGENTS.md e docs/CONTINUIDADE-AGENTES.md. A documentacao do Antigravity informa descoberta de regras na raiz aberta/ancestrais ate a raiz Git, sem varrer subpastas abaixo do workspace. Por isso abrir apenas Code ou outro checkout pode carregar contexto diferente. Chats do Codex nao sao o historico do Antigravity; o estado compartilhavel fica nos arquivos.

No Antigravity, confira Customizations / Rules ou Settings / Customizations, conforme a versao, e procure GEMINI.md/AGENTS.md. As regras deste projeto nao exigem configurar regras globais. A documentacao atual informa releitura antes de cada turno; um chat novo ajuda a testar o contexto sem instrucoes antigas. Nao e prova de carregamento so o arquivo existir.

Mensagem para verificar: Antes de editar, leia GEMINI.md e os documentos de continuidade. Informe a raiz e branch atuais, os dois guias de direcao que leu, a ultima versao do episodio de sono e seu estado de publicacao. Explique quais regras vai aplicar. Nao gere assets nem publique durante essa verificacao.

Resultado esperado: identifica o checkout de producao, as demonstracoes por fala, Remotion unico, Puck/Charon, preservacao do Bugi e arquivos reais do episodio. Se nao conseguir ler um arquivo, informa o caminho; nao assume que o carregou.

Fontes consultadas em 06/11/2026:
- https://antigravity.google/docs/rules/
- https://antigravity.google/docs/customization-discovery
- https://antigravity.google/docs/ide/workflows (a pagina alerta sobre descontinuacao do sistema antigo de workflows; usamos regras persistentes, sem depender de slash command legado).

Rollback: reverter o commit de integracao; o GEMINI.md e workspace auxiliares na pasta Code sao arquivos locais e podem ser removidos separadamente. Nenhuma configuracao global alterada. Validacao desta correcao: arquivos/includes e workspace conferidos; o reconhecimento pelo agente precisa ser confirmado na mensagem de verificacao. Nao foi enviado prompt ao Antigravity em nome do usuario.
