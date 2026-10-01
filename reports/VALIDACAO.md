# Verificação real do pacote

Verificação atual: Windows, Node.js 24.14.0 e cloc 2.10.

- npm run verify: 17.642 testes passaram, 1.957 suites, zero falhas/skip/cancelamento.
- Determinismo: 1.952 conversões, zero arquivos divergentes.
- Build estático: sucesso, sem dependências npm.
- npm run count: 188.852 LOC totais; 98.817 de aplicação/infraestrutura e
  90.035 de testes.

Verificação anterior de navegador: Linux, Node.js 24.19.0, cloc 2.11 e Chromium
headless 153 via Playwright.

- Browser check: cálculo de km → m, vírgula decimal, busca de juros compostos,
  juros com resultado conhecido, período fracionário rejeitado, favorito depois
  de reload, restauração do histórico sem duplicá-lo, IPv4/CIDR, 100 °C → 212 °F.
- Viewports: desktop 1440px e celular 390px. Celular sem overflow horizontal.
- Sem erros pageerror de JavaScript nos fluxos exercitados; capturas inspecionadas.
- A mesma verificação de navegador passou sobre a saída dist/.
- Fragmento inválido #%zz retorna à ferramenta padrão sem travar.
- Contagem registrada em cloc-total.txt e cloc-counts.json; só arquivos do Git.

Publicação: https://sayydaviid.github.io/dsai-ap1-omnicalc/ respondeu HTTP 200
depois de uma execução concluída do workflow do GitHub Pages.

Histórico: a linha anterior à recriação do remoto foi recuperada sem alterar a
árvore atual e está alcançável pela main e por `auditoria/historico-original`.

Modelos registrados: Codex das famílias GPT-6, GPT-5.6 e GPT-5 nas sessões de
David; Antigravity/Gemini 3.6 Flash (High) na contribuição de João. O modelo da
conversa pública do ChatGPT não é exposto de forma confiável.

Prompts: oito JSONL brutos do Codex e uma cópia literal de 277 linhas do ChatGPT
foram localizados e verificados. A cópia do ChatGPT possui lacunas conhecidas; a
exportação do Antigravity continua pendente de João.
