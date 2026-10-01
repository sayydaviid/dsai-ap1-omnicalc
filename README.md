# OmniCalc

O OmniCalc é uma aplicação web que reúne calculadoras e conversores de unidades.
A aplicação funciona localmente e não depende de banco de dados ou API externa.
O projeto possui 1.974 ferramentas: 1.952 conversões e 22 calculadoras adicionais
de matemática, finanças, geometria, estatística e redes.

A interface está em português e possui busca, categorias, favoritos, histórico e
explicações dos resultados. O projeto não usa dependências npm.

## Entrega da AP1

- Aplicação publicada: https://sayydaviid.github.io/dsai-ap1-omnicalc/
- Repositório: https://github.com/sayydaviid/dsai-ap1-omnicalc
- Integrantes: David Pinheiro Tavares e João Gonçalves Feio
- Stack: JavaScript ESM, HTML, CSS e Node.js nativo

Ferramentas e modelos registrados:

- ChatGPT, na conversa pública indicada em `prompts/sessoes/`; o modelo não é
  exposto na página compartilhada e por isso não é inventado aqui;
- Codex, família GPT-6, sem identificador exato exposto, na geração inicial;
- Codex com GPT-5.6 High, conforme registrado nos dois commits de validação
  conduzidos por David;
- Codex com GPT-5 nesta sessão de correção de conformidade.

Existem seis specs datadas. O repositório contém um link público de conversa e
um registro parcial de contexto; as exportações brutas completas continuam
pendentes e não são substituídas pelo link. As horas de trabalho devem ser
informadas pelos integrantes com base em seus registros reais.

## Como executar

É necessário ter o Node.js 20 ou superior.

No Windows:

1. Extraia todo o conteúdo do ZIP para uma pasta.
2. Dê dois cliques em `INICIAR.bat`.
3. Acesse http://127.0.0.1:5173 e mantenha o terminal aberto.

Também é possível executar pelo terminal no Windows, Linux ou macOS:

```bash
npm start
```

Não é necessário executar `npm install`. Depois que o Node.js estiver instalado, a aplicação pode ser usada sem acesso à internet. O servidor apenas entrega os
arquivos estáticos ao navegador e não recebe dados de terceiros.

Como alternativa ao npm, use `node scripts/serve.mjs`. Não abra o `index.html`
diretamente com `file://`, pois os módulos JavaScript precisam do servidor local.
Se a porta 5173 estiver ocupada, encerre a outra instância ou use outra porta. No
PowerShell:

```powershell
$env:PORT=5174; npm start
```

## Testes e geração

```bash
npm test                 # executa todos os testes; log em reports/tests.tap.txt
npm run generate         # recria os módulos e testes gerados a partir do catálogo
npm run check:generated  # verifica o determinismo sem regravar arquivos
npm run build            # cria a saída estática em dist/
npm run preview          # inicia o servidor para conferir dist/
npm run verify           # verifica determinismo, testes e build
```

No Windows, `TESTAR.bat` executa a verificação. Os módulos já estão gerados no
ZIP, portanto não é preciso gerá-los novamente para usar a aplicação.

## Funcionalidades

As conversões abrangem comprimento, área, volume, massa, tempo, velocidade,
pressão, energia, potência, força, frequência, ângulo, armazenamento digital e
temperatura.

As 22 calculadoras adicionais incluem operações aritméticas, porcentagem,
variação percentual, regra de três, desconto, juros simples e compostos, círculo,
retângulo, hipotenusa, cilindro, média, mediana, desvios padrão, transferência de
dados e sub-redes IPv4, inclusive `/31` e `/32`. Os cálculos financeiros são
apenas exemplos matemáticos e não usam taxas atuais. O prefixo `/31` segue a
convenção para enlaces ponto a ponto.

Os campos aceitam vírgula ou ponto decimal, mas não separador de milhar. Nas
calculadoras de estatística, os valores podem ser separados por ponto e vírgula
ou por linha, como em `1,5; 2; 3`. A tecla `/` leva o foco para a busca. Cada
ferramenta também pode ser aberta por um link direto, como `/#ipv4-subnet`.

## Estrutura do projeto

O projeto usa JavaScript ESM, HTML, CSS e recursos nativos do Node.js. A decisão
de não usar React, TypeScript ou bundler está registrada em `PLAN.md` e simplifica
a execução offline. Cada conversão possui um módulo executável, carregado pela
interface somente quando necessário.

```text
SPEC/                   especificações datadas, anteriores ao código no Git
src/catalog/units.js    unidades, fatores e deslocamentos
src/conversions/        1.952 módulos de conversão gerados
src/core/               validação numérica e calculadoras adicionais
src/ui/                 interface, busca, favoritos e histórico
tests/conversions/      testes gerados para os pares de unidades
tests/                  exemplos independentes e testes de infraestrutura
scripts/                gerador, servidor, build, testes e contagem
prompts/sessoes/        registros disponíveis e instruções de exportação
reports/                resultados dos testes e do cloc
```

Grande parte das linhas vem do gerador de conversões e testes, que repete uma
estrutura definida por template. O gerador foi escrito com auxílio do Codex. As
188 mil linhas não foram escritas manualmente e não representam 188 mil linhas de
lógica diferente. Não foram copiadas bibliotecas, dependências ou implementações
de outros projetos para aumentar a contagem.

Os testes das conversões usam as constantes do mesmo catálogo. Eles verificam o
motor e possíveis regressões, mas não comprovam sozinhos que todas as constantes
estão corretas. Também existem exemplos conhecidos e independentes para cada
família. Os cálculos usam dupla precisão numérica, sem precisão decimal arbitrária
ou processamento simbólico. As fontes e limitações das constantes estão em
`SOURCES.md`.

## Contagem de linhas

A contagem requer o [cloc](https://github.com/AlDanial/cloc) no `PATH`, além do
Git. O comando `npm run count` aplica a regra, separa aplicação/infraestrutura de
testes e atualiza o bloco abaixo. Somente arquivos versionados são contados, por
isso os arquivos novos devem passar por `git add` antes da medição.

```bash
cloc . --vcs=git \
  --exclude-dir=node_modules,vendor,dist,build,prompts \
  --exclude-lang=Markdown,JSON,YAML,CSV,Text,SVG \
  --not-match-f='(lock|\.min\.)'
```

<!-- CLOC:START -->

188.811 LOC totais; 98.814 aplicação/infraestrutura; 89.997 testes.

```text
github.com/AlDanial/cloc v 2.11  T=1.02 s (3847.5 files/s, 213846.0 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                    3921          25426           3915         188578
CSS                              1              0              0            152
HTML                             1              0              0             55
DOS Batch                        2              0              0             26
-------------------------------------------------------------------------------
SUM:                          3925          25426           3915         188811
-------------------------------------------------------------------------------
```

<!-- CLOC:END -->

Arquivos JSON de catalogação, documentação, logs, favicon SVG e `dist/` ficam
fora da contagem conforme a regra. O arquivo `src/catalog/conversions.js` guarda
metadados JavaScript em uma única linha. O maior volume está nos módulos e testes
gerados, não em dados distribuídos artificialmente por linha.

## Validação realizada

A validação registrou 17.639 testes aprovados, sem falhas, cancelamentos ou testes
ignorados. As 1.952 conversões foram geradas novamente sem diferenças, e o build
estático foi concluído.

A interface foi verificada no Chromium em modo headless. Foram testados cálculo,
vírgula decimal, busca, validação, permanência de favorito após recarregar,
restauração do histórico, CIDR e visualização em tela de 390 px sem rolagem
horizontal. Não ocorreram erros de JavaScript nesses fluxos. As capturas usadas
nessa conferência não foram versionadas; o resultado textual está em
`reports/VALIDACAO.md`.

A validação foi executada no Linux com Node.js 24.19.0. O requisito do projeto
continua sendo Node.js 20 ou superior. Os arquivos para Windows estão incluídos,
mas não foram testados nessa validação.
