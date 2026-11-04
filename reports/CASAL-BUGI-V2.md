# Casal Bugi — revisão de design

Branch codex/casal-bugi-design-20261104. Nova personagem original em SVG, BugiCompanion.tsx, com linguagem de contornos/olhos/paleta compatível com Bugi. Ambos usam escala local 0,66 e origem sentada y=549. Passageira com cabelo castanho, presilha ciano, casaco coral e emblema amarelo; rosto mais arredondado e proporção reduzida.

Expressões por turno: sobrancelhas de irritação/ironia, olhar lateral, piscadas, sorriso e boca articulada. No Bugi, boca fixa de smile/grin/determined era selecionada durante falas; agora falar seleciona open_o e usa mouthOpenness animada, retornando à expressão de repouso nas pausas.

Voz, roteiro, gráficos e composição de 1578 quadros preservados. Movimento labial é estimativa guiada por palavras e oscilação determinística; não é alinhamento fonético. Lint passou. Render, inspeção de quadros e decode registrados ao final; aprovação artística humana pendente. Rollback: reverter apenas commits desta branch.
