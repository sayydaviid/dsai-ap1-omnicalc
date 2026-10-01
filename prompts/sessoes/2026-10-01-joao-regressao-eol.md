# Registro de Sessão: Teste de Regressão CRLF/LF (João)

- **Data**: 2026-10-01
- **Autor**: João Gonçalves Feio
- **Ferramenta / Agente**: Antigravity AI (Gemini 3.6 Flash (High))
- **Spec**: `SPEC/2026-09-30-catalogo-gerador.md`

## Objetivo
Implementar teste de regressão automatizado para comprovar que a verificação do gerador (`scripts/generate.mjs --check`) tolera variações de finais de linha (CRLF no Windows vs LF no Linux), mas detecta divergências reais no conteúdo gerado.

## Ações Realizadas
1. Inspeção de `scripts/generate.mjs`, especificamente da função `normalizeNewlines`.
2. Criação do arquivo de teste `tests/generator.test.js` cobrindo:
   - Equivalência entre `\r\n` (CRLF) e `\n` (LF) na normalização.
   - Detecção de modificações reais no conteúdo independentemente do final de linha.
   - Execução de `scripts/generate.mjs --check` para confirmar 0 divergências na árvore atual.
3. Inclusão da suite em `tests/run.test.js`.
4. Validação local completa com `npm run check:generated`, `npm test` (17.642 testes aprovados sem falhas), `npm run verify` e `git diff --check`.
