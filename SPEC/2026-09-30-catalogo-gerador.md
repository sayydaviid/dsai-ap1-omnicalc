# Catálogo e gerador (2026-09-30)

## O quê e por quê
Representar unidades com fator e deslocamento em relação à unidade-base da
dimensão: base = valor * fator + deslocamento. Gerar um módulo JS por par
direcional, com metadados, validação e cálculo, mais um índice pesquisável.
Temperaturas usam Kelvin e não aceitam valores abaixo do zero absoluto.
Armazenamento distingue unidades decimais e binárias e bits e bytes.

## Critérios de aceitação
- Pelo menos 1.000 conversões reais em comprimento, área, volume, massa, tempo,
  velocidade, pressão, energia, potência, força, frequência, ângulo, dados e temperatura.
- Um par nunca converte unidades de categorias distintas nem a mesma unidade.
- Rejeitar entrada não numérica, NaN, infinito e resultado não finito.
- Distinguir galão US e imperial, e tonelada métrica, curta e longa.
- Definições e fontes de constantes devem ser auditáveis.
- Geração determinística: executar novamente não muda os arquivos produzidos.
- Gerador deve limpar somente arquivos próprios dentro dos diretórios de saída.
- Testes com exemplos numéricos explícitos, inversão, sinais, limites e erros.
- Declarar a origem mecânica da saída e medir o total, sem inflar com comentários.

## Fora do escopo
Unidades de câmbio e convenções ambíguas sem qualificador.
