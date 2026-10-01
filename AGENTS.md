# Regras de trabalho

- Leia SPEC/, PLAN.md e TASKS.md antes de modificar comportamento.
- Escreva e faça commit da spec antes do código correspondente.
- Commits devem declarar Agent: e Spec: com os valores reais.
- Código em src/conversions e tests/conversions é gerado por scripts/generate.mjs.
  Edite catálogo/gerador, regenere e teste; não faça ajustes isolados na saída.
- Não adicione padding, dependências copiadas ou dados para aumentar o cloc.
- Node.js >= 20, ESM, sem dependências externas. Preserve a execução offline.
- Antes de entregar: npm run verify e npm run count (este exige cloc externo).
- Declare honestamente limites, código gerado, publicação e exportações pendentes.
