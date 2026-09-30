# Verificação real do pacote

Ambiente: Linux, Node.js 24.19.0, cloc 2.11, Chromium headless 153 via Playwright.

- npm run verify: 17.639 testes passaram, 1.956 suites, zero falhas/skip/cancelamento.
- Determinismo: 1.952 conversões, zero arquivos divergentes.
- Build estático: sucesso, sem dependências npm.
- Browser check: cálculo de km → m, vírgula decimal, busca de juros compostos,
  juros com resultado conhecido, período fracionário rejeitado, favorito depois
  de reload, restauração do histórico sem duplicá-lo, IPv4/CIDR, 100 °C → 212 °F.
- Viewports: desktop 1440px e celular 390px. Celular sem overflow horizontal.
- Sem erros pageerror de JavaScript nos fluxos exercitados; capturas inspecionadas.
- A mesma verificação de navegador passou sobre a saída dist/.
- Fragmento inválido #%zz retorna à ferramenta padrão sem travar.
- Contagem registrada em cloc-total.txt e cloc-counts.json; só arquivos do Git.

Windows: iniciadores incluídos; não foi executado em Windows neste ambiente.
Publicação e GitHub: workflow fornecido, sem publicação ou push feitos nesta sessão.
Modelo: GPT-6 é a família exposta; não houve mudança para GPT-5.6 high.
Prompts: o contexto parcial está incluído; falta a exportação bruta completa.
