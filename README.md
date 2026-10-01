# OmniCalc

**1.974 ferramentas locais:** 1.952 conversões de unidades e 22 calculadoras de
matemática, finanças, geometria, estatística e redes. Busca, categorias, favoritos,
histórico e resultados explicados. Interface em português e sem dependências npm.

## Abrir no Windows

1. Instale [Node.js](https://nodejs.org/) 20 ou superior, se ainda não tiver.
2. Extraia o ZIP inteiro em uma pasta. Não execute dentro do arquivo compactado.
3. Dê dois cliques em **INICIAR.bat**.
4. O navegador abre em http://127.0.0.1:5173. Deixe o terminal aberto.

Não precisa de `npm install`, Python, Docker, banco, API nem Ollama.
Depois de instalar Node, funciona sem acesso à internet. A aplicação não recebe
dados de terceiros; o servidor entrega arquivos estáticos ao navegador.

No terminal, Windows, Linux ou macOS:

```bash
npm start
```

Alternativa sem npm: `node scripts/serve.mjs`.
Não abra index.html por file://: módulos JavaScript precisam do servidor local.
Se a porta estiver ocupada, encerre a outra instância. Para usar outra porta no
PowerShell: `$env:PORT=5174; npm start`.

## Verificar e gerar

```bash
npm test                 # todos os testes; log completo em reports/tests.tap.txt
npm run generate        # recria somente módulos/testes gerados do catálogo
npm run check:generated # verifica determinismo sem regravar
npm run build           # saída estática em dist/
npm run preview         # abre o servidor para dist/
npm run verify          # determinismo + todos os testes + build
```

No Windows, TESTAR.bat executa a verificação. Os módulos já estão gerados no ZIP;
você não precisa gerar novamente para usar a aplicação.

## Funcionalidades

Conversões: comprimento, área, volume, massa, tempo, velocidade, pressão, energia,
potência, força, frequência, ângulo, armazenamento digital e temperatura.

Calculadoras especiais: operações aritméticas, porcentagem, variação percentual,
regra de três, desconto, montante de juros simples/compostos, círculo, retângulo,
hipotenusa, cilindro, média, mediana, desvios padrão, transferência de dados e
sub-redes IPv4, incluindo /31 e /32. As ferramentas de finanças são exemplos
matemáticos, sem taxas atuais. Prefixo /31 aplica a convenção ponto a ponto.

Use vírgula ou ponto decimal, sem separador de milhar. Para estatística, separe
valores por ponto e vírgula ou linha: `1,5; 2; 3`. A barra `/` foca a busca.
Cada ferramenta pode ser aberta por um link como `/#ipv4-subnet`.

## Arquitetura e código gerado

JavaScript ESM, HTML, CSS e Node nativo. Sem React, TypeScript ou bundler, por
decisão registrada em PLAN.md para simplificar execução e distribuição offline.
Cada conversão tem um módulo executável carregado sob demanda pela interface.
Ela não carrega todos os módulos de cálculo de uma vez.

```text
SPEC/                   especificações datadas, anteriores ao código no Git
src/catalog/units.js    unidades, fatores e deslocamentos auditáveis
src/conversions/        1.952 módulos gerados e utilizados pela interface
src/core/               validação numérica e calculadoras especiais
src/ui/                 interface, busca, favoritos e histórico
tests/conversions/      testes gerados por par de unidades
tests/                  exemplos independentes e testes de infraestrutura
scripts/                gerador, servidor, build, testes e contagem
prompts/sessoes/         registros disponíveis e instruções de exportação
reports/                resultados reais de testes e cloc
```

**A maior parte do volume é gerada mecanicamente por template.** O gerador foi
escrito com auxílio do Codex. Nenhuma linha gerada deve ser apresentada como
100 mil linhas únicas, escritas manualmente ou diretamente pela IA. A aplicação
usa esses módulos, mas eles repetem a mesma estrutura entre pares de unidades.
Não foram copiadas bibliotecas, dependências ou implementações de outros projetos
para aumentar a contagem. Consulte SOURCES.md para constantes e limites numéricos.

O oráculo racional dos testes usa as constantes do mesmo catálogo: verifica o
motor e regressões, mas não valida sozinho a correção das constantes. Há também
exemplos conhecidos independentes para cada família. Números usam dupla precisão;
não há precisão decimal arbitrária ou processamento simbólico.

## Contagem oficial de linhas

Requer [cloc](https://github.com/AlDanial/cloc) instalado e no PATH, além de Git.
`npm run count` executa a regra, separa aplicação/infraestrutura de testes e
atualiza este bloco. Só arquivos versionados entram. Faça git add dos novos
arquivos antes de medir.

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

Os arquivos de dados/catalogação JSON, a documentação, logs, favicon SVG e dist/
estão excluídos conforme a regra. `src/catalog/conversions.js` contém metadados JS
em uma única linha; o volume medido vem dos módulos e testes, não de dados por linha.

## Resultado da validação

- 17.639 testes passaram; nenhuma falha, cancelamento ou teste ignorado.
- 1.952 conversões reconstruídas sem diferenças: geração determinística.
- Build estático executado com sucesso.
- Interface conferida em Chromium headless: cálculo, vírgula decimal, busca,
  validação, favorito após recarregar, restauração do histórico, CIDR e celular
  de 390px sem overflow horizontal; sem erros de JavaScript nos fluxos testados.
- Capturas desktop/mobile incluídas em reports/ui-desktop.png e ui-mobile.png no ZIP.
- Node utilizado na validação: 24.19.0; requisito declarado: Node >= 20.
- O código Windows está incluído, mas a validação foi executada em Linux.

## SDD e procedência

Ferramenta: Codex em ChatGPT Work. A família do agente desta execução é GPT-6;
o identificador exato e o nível de raciocínio não são expostos ao projeto.
O usuário solicitou 5.6 high, mas a sessão não pôde ser trocada para esse modelo.
Não há uso de API de modelos em execução nem custo de tokens para regenerar.

O ZIP inclui `.git/` com commits reais: specs/plano/tarefas primeiro, depois
implementações por parte do sistema. Autoria inicial: **Codex Workspace**,
`codex-workspace@localhost`, um marcador transparente do ambiente. Não representa
commit assinado ou realizado na conta de David ou do colega. Datas não foram
retroativas. O primeiro commit deixou os trailers em uma linha com `\n` literal;
os commits seguintes usam trailers separados corretamente. Esse detalhe está
registrado aqui sem reescrever o histórico.

## Completar a entrega da AP1

Este pacote entrega a aplicação local, não todas as exigências administrativas.
A [atividade](https://gustavopinto.org/assets/slides/dsai-2026/ap1.html) exige
repositório público, URL pública, autores reais e exportações completas.

| Item | Situação |
| --- | --- |
| Aplicação local, gerador e testes | Concluído |
| Specs antes do código, plano e tarefas | Concluído |
| Mais de 100.000 LOC pelo cloc | Consulte resultado real acima |
| Participante 1 | David Pinheiro Tavares — confirmar nome/conta |
| Participante 2 | PREENCHER |
| Repositório público novo | CRIAR na conta da dupla |
| URL pública | PUBLICAR e substituir este campo pela URL |
| Commits das duas contas reais | PENDENTE; os commits de ambiente não substituem |
| Exportações brutas de todos os prompts | PENDENTE; registro parcial não substitui |
| Aceitação de código gerado | Não garantida; abordagem deve ser declarada |

Configure sua identidade local antes de continuar. Cada integrante usa sua
própria conta e registra alterações reais; não troque autores de commits passados.

```bash
git config user.name "SEU NOME REAL"
git config user.email "EMAIL ASSOCIADO A SUA CONTA GITHUB"
git status
```

Crie um repositório vazio público, por exemplo `dsai-ap1-omnicalc`, sem README
automático. Configure o remote com a URL exibida pelo GitHub e faça git push.
Não use upload de arquivos pela interface web, squash ou push --force.

Para publicar por GitHub Pages: o workflow `.github/workflows/pages.yml` já está
incluído. Depois do push, em Settings → Pages escolha **GitHub Actions** como
fonte. O workflow gera dist/ e publica como site estático; a interface usa caminhos
relativos para funcionar dentro de /nome-do-repositorio/. Aguarde o workflow e
copie a URL real no README. A publicação não foi executada neste pacote.

Antes de cada novo commit de código, registre a spec anterior e adicione trailers:

```text
interface: descreve a mudança concreta

Agent: codex/MODELO_REAL_VERIFICADO
Spec: SPEC/2026-09-30-interface.md
```

Exporte também a conversa anterior de planejamento, com erros, correções e todos
os prompts. Veja prompts/sessoes/README.md. Não apresente o registro parcial
incluído como exportação bruta completa.

## Apresentação sugerida, sem slides

Abra a URL pública. Mostre km → m, Celsius → Fahrenheit, MiB → MB e a calculadora
IPv4. Favorite uma ferramenta e restaure um cálculo do histórico. Mostre as specs
e sua ordem no Git. Explique o gerador e os limites, depois o cloc e testes. Escolha
os três prompts reais na exportação completa, sem inventar resultados de sessões.
Contabilize horas, prompts e sessões a partir dos registros reais da dupla.

## Continuar no Codex com 5.6 high

Dentro da pasta, abra `codex`, use `/model` e selecione GPT-5.6 e High **se essas
opções estiverem disponíveis na sua conta**. Confira com `/status`. Não existe
seleção de modelo pela aplicação OmniCalc; essa é uma configuração do agente.
Leia AGENTS.md e modifique o catálogo/gerador, evitando editar a saída gerada.
