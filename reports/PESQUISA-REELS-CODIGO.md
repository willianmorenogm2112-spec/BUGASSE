# Pesquisa de Reels produzíveis com código e IA

Data: 2026-11-04. Projeto existente BUGASSE. Base local: f35e29d. Branch: codex/pesquisa-reels-20261104. Escopo autorizado nesta etapa: pesquisar referências, verificar ferramentas/skills e propor o modelo; criação do vídeo fica para a etapa posterior indicada pelo usuário.

## Resultado recomendado

Cartoon editorial 2D com profundidade por camadas, Bugi articulado e humor físico. Ações e explicação se alternam; gráficos aparecem quando tornam uma consequência compreensível. Remotion mantém a timeline e o render principais. HyperFrames pode fornecer elementos pré-renderizados e verificados. A Skill Reel orienta timing, legendas, áudio e QA. FilmCraft é acabamento opcional após existir MP4 válido.

Esta escolha é julgamento de adequação à identidade e à base existente, não ranking de audiência ou promessa de viralização. Não significa copiar o visual de um criador específico.

## Método e grau de evidência

Pesquisa em fontes dos próprios projetos/criadores, navegação em publicações Instagram, inspeção do repositório local e leitura de código/skills. Algumas consultas web ao Instagram deram throttling/429; o navegador conseguiu mostrar perfis, publicações e amostras visuais. Não se realizou audição ou análise quadro a quadro integral de todos os candidatos. Onde houve apenas descrição, miniatura, catálogo ou código, isso está indicado. Contagens de views/likes não foram usadas como critério.

“Feito com código” é separado em: animação/gráficos definidos por código; montagem programática que usa gravação real; IA gerando imagens/voz; e vídeo generativo. Uma montagem programática com apresentador gravado não é imagem 100% sintetizada por código. A aparência final sozinha não comprova ferramentas originais.

## Seleção principal de Reels e exemplos reproduzíveis

| Referência e acesso | Evidência obtida | O que estudar | Aplicação ao Bugi | Limite |
|---|---|---|---|---|
| [Skill Reel — exemplo aprovado](https://github.com/Felpborges/skill-reel/tree/main/modelo/exemplo) | Vídeo local presente, ffprobe 38,8s, 540x960, 30 FPS, H.264/AAC; folha de 16 quadros inspecionada; mapa e documentação lidos | Relação palavra/elemento, alternância de enquadramento e concisão da legenda | Fazer objeto, vetor e reação entrarem na fala correspondente; preservar rosto/mãos livres | É gravação humana + gráficos por código; não é rig de personagem nem autorização ampla para reutilizar assets |
| [Problemathic — Bessel / membranas vibrantes](https://www.instagram.com/problemathicvideos/reel/Ct1TMMoMzes/) | Publicação, grade e miniatura verificadas no navegador; player reporta 10s; [Membrane.py](https://github.com/AnadeOre/Manim-Animations/blob/master/Bessel_Membrane/Membrane.py) lido pelo conector GitHub | Uma regra matemática gera mudança visual contínua; superfície em perspectiva | Explicar elasticidade, ondas ou vibração por deformação visível; usar diagramas breves junto da atuação | Reprodução amostrada não sustentou auditoria completa de movimento; código tem caminho absoluto do autor e não foi executado; licença de reutilização não confirmada |
| [PlotLab — limite de sin(x)/x](https://www.instagram.com/plotlab01/reel/DfRYdM1O9JW/) | Publicação e descrição verificadas no navegador, miniaturas do perfil; [autor declara uso de Manim](https://sohaib-hasan.github.io/plotlab.html) | Explicação visual em passos e relação geometria/texto | Microexplicação de uma lei em 2–4s, com unidade e vetor legíveis | Não foi obtido código-fonte deste Reel nem auditada sua sequência integral; não usar apresentação de aula como formato dominante do canal |
| [Marc Cleroux — 17 video effects Claude can create](https://www.instagram.com/reel/Def9pj5TWtA/) | Original aberto, descrição e amostra visual observadas; referência também identificada na galeria oficial HyperFrames | Trocas de representação, conteúdo dentro de conteúdo, gráficos como ênfase | Comparação normal/bugado, detalhe do pé, velocidade e enquadramento de reação | Apresentador real; o título não comprova que todas as imagens sejam geradas por código. Não levar a interface de tutorial para a história do Bugi |
| [Harper Carroll — 10 Days of AI Basics, Day 1](https://www.instagram.com/reel/C4eNPF3PdpG/) | Original ligado pela galeria oficial HyperFrames como referência de edição; não inspecionado integralmente | Candidato para explicação curta em camadas | Referência secundária de densidade e hierarquia | Inferência de adequação, sem afirmar observação detalhada ou tecnologia do original |
| [Dr. Cintas — Motion graphics in seconds](https://www.instagram.com/reel/DPoXbzZjb8J/) | Original ligado pela galeria oficial HyperFrames; não inspecionado integralmente | Candidato para relação fala/elemento animado | Referência secundária para um gráfico explicativo breve | Tema é ferramenta, não simulação física; código original não comprovado |

## Referências técnicas e visuais complementares

1. [HyperFrames — galeria oficial](https://hyperframes.heygen.com/examples). A página declara que os exemplos exibidos foram feitos na ferramenta; o navegador listou cartoons, 3D, explicações e remixes de Reels. A autoria do original e a versão refeita em HyperFrames são coisas diferentes. Parte das mídias falhou no carregamento e uma amostra de cartoon não foi suficiente para validar qualidade de atuação. A galeria não substitui um teste local.
2. Catálogo HyperFrames consultado localmente com a CLI 0.9.9: `lottie-character-walk` (7,5s, 1920x1080, personagem articulado andando, parando e apontando, conforme descrição); `caption-editorial-emphasis`; `camera-rig-depth-stack`; `pendulum-swing`. São exemplos de componentes, não Reels completos nem garantia de física cientificamente correta. O catálogo reportou 448 entradas; não foram instaladas ou renderizadas nesta etapa.
3. [Remotion — Rocket Launches Timeline](https://www.remotion.dev/prompts/rocket-launches-timeline). Página oficial com prompt de trajetórias cronológicas. Serve de referência para rastros, escala temporal e comparação. Não há comprovação aqui de publicação como Reel; não usar seus dados sem conferir fontes.
4. [Remotion — Three.js Top 20 Games Sold](https://www.remotion.dev/prompts/threejs-top-20-games-sold-ranking-1). Exemplo oficial de agente de código + Remotion/React Three Fiber, com câmera percorrendo torres de dados. O exemplo declara 1920x1080 a 60 FPS, portanto exige recomposição vertical. Útil para estudar escala/câmera, não para substituir a atuação do Bugi.
5. [Problemathic — Lorenz](https://github.com/AnadeOre/Manim-Animations/tree/master/Lorenz). Arquivos de simulação identificados pelo conector; fonte disponível para estudo de trajetórias e caos. Não executados, render não verificado e licença não confirmada.
6. [Manim Reel Generator](https://github.com/diwenne/math_reels). README descreve geração de animações 9:16 com Gemini escrevendo código Manim. É prova de uma proposta de pipeline disponível, não de qualidade comprovada nem de segurança para executar código gerado sem isolamento. Não instalado.
7. [Kurzgesagt — processo oficial](https://kurzgesagt.org/what-we-do?visit=videos). Referência de acabamento editorial, metáforas visuais e som. O estúdio descreve trabalho de ilustração e animação 2D/3D orientado pela voz; não é exemplo de produção 100% automatizada por IA/código.
8. [Short enviado pelo usuário](https://www.youtube.com/shorts/Yrg0pZ5jbRg). Análise anterior em REFERENCIA-Yrg0pZ5jbRg.md: útil para causa/consequência, escala e encenação; tecnologia original não comprovada. É complemento em Shorts, não foi apresentado como Reel do Instagram.

## Comparação de modelos para o canal

| Modelo | Adequação editorial | Esforço adicional | Recomendação |
|---|---|---|---|
| Cartoon 2D com profundidade e atuação | Alta: mantém Bugi, identidade e humor físico | Melhorar poses, contato, cenários em camadas e continuidade | Principal para o piloto |
| Explicação gráfica tipo Manim | Alta para explicar leis; menor para história com personagem | Diagramas determinísticos; não exige adotar nova engine se Remotion resolve | Apoio visual breve |
| Cartoon 3D com câmera espacial | Boa para grandes escalas e revelações | Modelagem/rig/materiais/cenário; ainda sem prova local | Evolução futura após piloto 2D validado |
| Apresentador humano + interfaces VSL | Bom para tutorial de ferramentas | Exige gravação humana e tratamento específico | Apenas referência de montagem; não é formato principal do canal |

Remotion suporta 3D por [@remotion/three](https://www.remotion.dev/docs/three), integrando React Three Fiber. Portanto, “3D exige Blender” seria incorreto: Blender é uma opção de autoria de assets; cenas 3D também podem ser construídas por código. Essa possibilidade não significa que o BUGASSE já tenha rig 3D ou que igualar acabamento seja automático.

## Ferramentas, acesso e instalações verificadas

| Item | Implementado / presente | Testado nesta etapa | Evidência / bloqueio |
|---|---|---|---|
| Skill Reel upstream | Clone local integral em .agents/skills/reel-upstream | Leitura de SKILL, regras, CORTE, ESTILO, README e exemplo | Commit b9c1222297ce8ff8d15f19f5218afc08cab279bf; licença geral não identificada na raiz/API. README documenta fontes OFL e SFX procedurais; não confundir com licença de todo o código |
| Adaptação Bugi | .agents/skills/reel e skill-reel-adaptacao presentes | Leitura e comparação com código atual | Documentação adaptada contém alegações desatualizadas de mix e fallback; auditoria anterior prevalece como evidência de execução |
| HyperFrames | Skills locais core + registry + CLI; CLI cache 0.9.9 | --version, doctor --json, catalog, usage | Node/Chrome/FFmpeg/ffprobe detectados; doctor ok=false por RAM baixa e opcionais ausentes. Render não testado nesta etapa |
| Remotion | Skills oficiais do plugin; pacotes 4.0.540 | npm ls confirmou remotion/player/web-renderer | Lint/test/build passaram na análise anterior desta mesma sessão; não repetidos sem mudança de código. Render ponta a ponta continua pendente |
| FilmCraft | Skill/adaptador local; repo público acessível | Leitura do upstream e release v0.17.0 | CLI não encontrado no PATH ou tools/bin previamente inspecionado; não executado. Release possui ZIP Windows x64, mas presença de CLI Windows no pacote não foi confirmada |
| PhotoCraft | Repo público também acessível; skill já existente | Acesso de leitura confirmado | CLI não encontrado; não usado nesta pesquisa |
| Whisper | Detector upstream rodou, mas apresentou falso positivo | Checagem independente por shutil.which | whisper-cli e whisper-cpp ausentes; detector aceitou C:/WINDOWS/system32/main.CPL como “main”. Modelo também ausente. Não declarar transcrição local pronta |

Acesso aos repositórios confirmado pelo conector GitHub: skill-reel, filmcraft, photocraft e hyperframes, com pull=true e push=false. Isso comprova leitura pública, não permissão para alterar o upstream.

Nenhuma skill necessária precisou ser reinstalada. O npx offline resolveu a CLI já em cache sem instalação global e sem alterar package.json. Não houve download de editor, instalação de modelo de 1,6 GB, assinatura Pro ou chamada paga. Usage do harness foi consultado, mas não comprova plano Pro do HyperFrames. O template `animated-science-explainer` é documentado como Pro; não foi puxado, nem foi assumido acesso. O caminho recomendado não depende desse template pago.

Recursos no diagnóstico: 15,9 GB de RAM total, aproximadamente 0,4 GB disponível; 9,8 GB livres no volume consultado. São medidas momentâneas. Não começar render pesado nesse estado sem reduzir pressão de memória. Docker ausente é opcional para render local.

## Modelo operacional proposto

Especificação em MODELO-REELS-BUGI.md. Conteúdo/rig/câmera/legendas e export no Remotion; assets de imagem e voz com origem real registrada; HyperFrames como enriquecimento pontual, sem uma segunda timeline principal; FilmCraft apenas se binário e operação forem verificados.

Antes do piloto: resolver assets reais e alinhamento da voz, impedir conclusões sem arquivos, corrigir paridade Player/export e validar o fundo Google. São pendências de implementação, não bloqueios para escolher o modelo nesta pesquisa.

## Fontes de ferramentas

- [Skill Reel](https://github.com/Felpborges/skill-reel), README e modelo/exemplo/LEIA.md.
- [FilmCraft](https://github.com/storytold/filmcraft) e [release v0.17.0](https://github.com/storytold/filmcraft/releases/tag/v0.17.0): CLI/MCP e acabamento, não gerador de atuação do personagem.
- [PhotoCraft](https://github.com/storytold/photocraft): leitura confirmada, sem execução.
- [HyperFrames](https://github.com/heygen-com/hyperframes), [exemplos](https://hyperframes.heygen.com/examples), [guia explicativo](https://hyperframes.heygen.com/guides/faceless-explainer).
- [Remotion showcase](https://www.remotion.dev/showcase), [prompts](https://www.remotion.dev/prompts), [integração Three.js](https://www.remotion.dev/docs/three).
- [Manim Community](https://www.manim.community/): animação matemática por Python; não instalado nesta pesquisa.

Logs: comandos e saídas preservados na conversa; resumo técnico neste documento e INSTALL-STATUS.md. Arquivos modificados limitados aos relatórios. Pesquisa não inclui vídeo novo nem aprovação artística. Estudos de terceiros não autorizam copiar personagem, voz, cena, música ou assets; os exemplos sem licença clara ficam como referência de princípios.
