# Conformidade da entrega (2026-10-01)

Esta especificação complementa `2026-09-30-visao-geral.md` e
`2026-09-30-execucao-validacao.md`. Ela registra as correções necessárias após
a revisão do repositório contra o enunciado oficial da AP1.

## O quê e por quê

Completar os metadados acadêmicos da entrega, registrar de forma honesta a
procedência das conversas e tornar a verificação determinística também no
Windows. O histórico existente deve ser preservado; correções entram como novos
commits, sem rebase, squash, exclusão do repositório ou `push --force`.

## Critérios de aceitação

- O README identifica David Pinheiro Tavares e João Gonçalves Feio.
- O README contém a URL pública da aplicação, stack, ferramentas e modelos
  efetivamente conhecidos, sem inventar identificadores não expostos.
- O registro de prompts aponta para a conversa pública fornecida e diferencia
  claramente link compartilhado, transcrição parcial e exportação bruta.
- Conversas ou respostas ausentes não são reconstruídas nem atribuídas a autores
  ou modelos sem evidência.
- `npm run check:generated` trata CRLF e LF como equivalentes e passa no Windows
  sem regravar os 3.905 arquivos gerados.
- `npm run verify` executa determinismo, testes e build com sucesso no Windows.
- O README não afirma que artefatos inexistentes estão versionados.
- Cada integrante realiza e commita contribuições reais usando a própria conta;
  pacotes prontos não são usados para simular autoria.
- A contagem oficial continua sendo produzida por `cloc`, com testes separados.

## Fora do escopo

- Reescrever, apagar ou recriar o histórico para trocar autores de commits.
- Criar commits em nome de João ou atribuir a ele código produzido por terceiros.
- Declarar que um link compartilhado é uma exportação bruta completa.
- Inventar horas trabalhadas, prompts, modelos, sessões ou resultados de testes.

