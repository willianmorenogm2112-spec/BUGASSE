# ESTILO.md — Direção de Arte & Identidade Visual (Skill Reel Adaptada)

## 1. Paleta Canônica do Estúdio
- **Azul-Petróleo (`#122638`)**: Superfícies estruturais, jaqueta do Bugi, painéis de HUD.
- **Abismo Estúdio (`#08121B`)**: Fundo de contraste profundo e contornos de legibilidade.
- **Ciano Elétrico (`#39C8D5`)**: Destaques de palavras-chave científicas nas legendas, vetores de velocidade/inércia e detalhes da jaqueta do Bugi.
- **Coral Vibrante (`#FF6B50`)**: Cabelo espetado fixo do Bugi, alertas de colapso físico e sola dos tênis.
- **Amarelo Alerta (`#FFD166`)**: Destaques secundários nas legendas dinâmicas, cronômetro e equações físicas.
- **Creme Quente (`#FFF7E9`)**: Texto principal das legendas, camiseta e tênis do Bugi.

## 2. Tipografia e Legendas Sincronizadas (`@remotion/captions`)
- **Fonte de Legendas e Títulos**: `Bricolage Grotesque` (Peso 700/800, `fontSize: 64px` no canvas `1080 × 1920`).
- **Blocos Curtos de Leitura Rápida**:
  - Máximo de **4 a 6 palavras visíveis simultaneamente** na zona segura inferior.
  - A palavra pronunciada no instante atual recebe escala `1.08x` e destaque cromático alternado entre **Ciano (`#39C8D5`)** para termos físicos e **Amarelo (`#FFD166`)** para números/impacto.
- **Contorno de Leitura**: Stroke escuro `#08121B` (`6px`) + fundo translúcido arredondado (`rgba(8, 18, 27, 0.90)`).

## 3. Direção de Câmera 2D
- **1º Segundo (Hook Impact)**: Zoom punch-in rápido (`1.0x -> 1.15x` nos primeiros 18 frames) acompanhado de efeito sonoro de ativação da regra física.
- **Descobertas Científicas**: Zoom suave (`1.08x`) focado no vetor ou infográfico **HyperFrames** quando o narrador explica a lei física.
