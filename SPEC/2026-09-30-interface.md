# Interface (2026-09-30)

## O quê e por quê
Catálogo responsivo em português com categorias, busca e calculadora selecionada.
Tema escuro com destaque verde, sem fontes/CDNs externas. Favoritos e histórico
são locais ao navegador e continuam opcionais quando armazenamento falha.

## Critérios de aceitação
- Buscar por nome, símbolo e categoria, ignorando acentos e maiúsculas.
- Paginar o catálogo para não criar milhares de elementos simultâneos.
- Abrir uma calculadora por URL usando fragmento com seu identificador.
- Formulários com labels, navegação por teclado e região de resultado ao vivo.
- Aceitar vírgula decimal e listas separadas por ponto e vírgula ou linha.
- Mostrar fórmula, resultado, unidade, exemplo e mensagens de erro legíveis.
- Favoritar, filtrar favoritos, manter até 50 cálculos e restaurar do histórico.
- Não executar expressão fornecida pelo usuário nem inserir HTML de entrada.
- Copiar resultado com mensagem de sucesso ou falha.
- Layout utilizável em 390px e em desktop.

## Fora do escopo
Sincronização de histórico entre dispositivos ou usuários.
