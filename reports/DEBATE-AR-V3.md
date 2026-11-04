# Debate Ar — revisão em tela inteira

Branch codex/debate-ar-tela-inteira-20261104. Mudanças: interior de carro preenchendo o quadro vertical, teto escuro, retrovisor, portas, puxadores, console e câmbio. Barra estrutural central do para-brisa removida. Vozes e conversa preservadas.

Explicação em cenas próprias: carro ilustrado lateral, rodas em movimento, compressor giratório e linhas de fluxo do ar. A relação carro/velocidade/calor aparece sem porcentagens inventadas. Animações determinísticas em React/SVG no mesmo Remotion do preview/export. Ilustração explicativa, sem simulação aerodinâmica quantitativa.

Arquivos: CarDebate.tsx, CarExplainer.tsx. Fonte do áudio e da explicação mantidas em DEBATE-AR-CONDICIONADO.md. A pesquisa confirmou ferramentas oficiais já disponíveis; nenhuma nova skill foi instalada. Não se afirma uso de render HyperFrames nesta revisão.

Verificação: lint passou. Export out/debate-ar-v3-tela-inteira.mp4: 33,813s, 6.191.358 bytes, 1014 quadros, 1080×1920/30fps. Decode FFmpeg integral sem erros. Folha qa/debate-ar/contato-v3.png inspecionada. Áudio/ganho iguais à v2 (medida anterior -14,0 LUFS, -2,5 dBFS; não medido novamente nesta revisão). Aprovação visual/auditiva humana pendente. Rollback: reverter apenas commits desta branch; versão anterior preservada.
