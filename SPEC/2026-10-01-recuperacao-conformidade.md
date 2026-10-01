# Recuperação da conformidade da entrega (2026-10-01)

Esta especificação complementa as specs de visão geral e de execução. Ela foi
escrita após a auditoria do repositório contra o enunciado oficial da AP1.

## O quê e por quê

Corrigir as evidências acadêmicas e a documentação depois da recriação do
repositório remoto e da reconstrução de parte do histórico. As correções devem
preservar as contribuições reais já publicadas, tornar o histórico anterior
auditável novamente e registrar somente sessões e resultados comprováveis.

## Critérios de aceitação

- Todas as correções posteriores entram por commits novos, sem novo rebase,
  squash, exclusão do repositório ou `push --force`.
- O histórico anterior à reconstrução volta a ser alcançável e auditável sem
  alterar a árvore atual nem substituir commits publicados.
- Os commits reais de David Pinheiro Tavares e João Gonçalves Feio permanecem
  identificáveis pelas respectivas contas.
- Exportações brutas disponíveis das ferramentas são copiadas sem reescrever a
  conversa, depois de uma verificação por segredos e dados sensíveis.
- Sessões ausentes ou não exportáveis continuam declaradas como pendentes; links
  e resumos editoriais não são apresentados como exportações brutas.
- O README informa a quantidade real de specs, ferramentas e modelos conhecidos,
  publicação, linhas de código, sessões disponíveis e limitações restantes.
- A validação registra o ambiente realmente usado, testes, determinismo, build,
  publicação e contagem `cloc` reproduzida com a regra oficial.
- Nenhuma autoria, duração de trabalho, conversa, modelo ou resultado é inventado.

## Fora do escopo

Reconstruir conversas que não estejam disponíveis, atribuir trabalho a outra
pessoa, ocultar a reconstrução já ocorrida ou garantir aceitação e nota.
