# Linhas de produção: Bugi 2D e Bugi 3D

## Bugi 2D

É o pipeline de produção comprovado até aqui: rig SVG, cenários 2D, Remotion e os Shorts já renderizados. Nenhum arquivo existente foi movido ou renomeado para evitar regressões.

## Bugi 3D

É uma linha separada em `bugi-3d/`, baseada no kit low-poly fornecido em 5 de novembro de 2026. Compartilha marca, roteiro, fontes, voz e QA, mas tem rig, catálogo, câmera e cenários próprios.

## Regra de seleção

- Use 2D para episódios no estilo atual e para continuidade dos vídeos já publicados.
- Use 3D quando a hipótese exigir espaço, profundidade, máquinas, fluxo de material ou câmera tridimensional que tragam ganho narrativo claro.
- Não misture rigs no mesmo episódio até existir um teste de composição e direção de arte aprovado.

## Próximo marco técnico

Criar um piloto 3D de 8–12 segundos com o preset `bugi`, validar o player Three.js e então provar a integração do mesmo conteúdo visual em uma composição Remotion antes do primeiro episódio completo.
