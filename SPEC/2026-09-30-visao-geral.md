# OmniCalc — visão geral (2026-09-30)

## O quê e por quê
Aplicação local e publicável de cálculo e conversão de unidades. Uma interface
pesquisável conecta módulos executáveis gerados a partir de um catálogo compacto.
O gerador economiza tokens; sua saída é declarada como código gerado, sem ocultar
a repetição estrutural. A quantidade de linhas não prova complexidade nem garante
aceitação acadêmica.

## Critérios de aceitação
- Executar com Node.js >= 20, sem dependências npm, banco ou chave de API.
- Permitir busca, categorias, favoritos, histórico e formulário de cálculo.
- Disponibilizar conversões entre todas as unidades de cada dimensão cadastrada.
- Não misturar dimensões e não oferecer conversão monetária com cotação fictícia.
- As calculadoras produzidas são utilizadas pela interface, não arquivos mortos.
- Contagem oficial por cloc apenas dos arquivos Git, com exclusões da atividade.
- Identificar linhas de testes e de aplicação separadamente no README.
- Manter especificações em commits anteriores às implementações.

## Fora do escopo
Login, backend de negócio, cotações externas, matemática simbólica, garantia de
nota, preenchimento de nomes do colega ou URL ainda não publicada.

## Entrega
ZIP com fontes, histórico Git real, inicializador Windows, testes, documentação e
build estático. Publicação em URL e exportações completas das conversas continuam
pendentes até o usuário concluir essas etapas.
