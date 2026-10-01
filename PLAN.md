# Plano (2026-09-30)

1. Registrar specs, plano e tarefas antes das implementações.
2. Definir unidades e motor de validação. Produzir módulos e testes determinísticos.
3. Implementar calculadoras especiais e exemplos independentes.
4. Construir catálogo, busca, formulários, favoritos e histórico local.
5. Implementar servidor local, build, contador cloc e pacote Windows.
6. Executar testes, verificar determinismo e medir código versionado.
7. Entregar ZIP; indicar os passos acadêmicos ainda pendentes.

Decisão: JavaScript ESM e Node.js nativo substituem React/TypeScript para reduzir
dependências e permitir execução offline sem instalar pacotes. Não há backend de
negócio: o servidor só entrega arquivos. A saída gerada usa a mesma implementação
no navegador e nos testes.
