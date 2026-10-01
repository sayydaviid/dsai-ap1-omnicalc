# Execução, verificação e distribuição (2026-09-30)

## O quê e por quê
Servidor estático local com Node nativo, build independente de ferramentas npm,
testes automatizados, relatório cloc e instruções para completar a entrega.

## Critérios de aceitação
- npm start serve apenas index.html, favicon e src/ em 127.0.0.1:5173.
- Bloquear travessia de diretório, caminhos fora de src/ e métodos diferentes de GET/HEAD.
- npm run build cria dist/ sem testes, prompts, scripts nem histórico Git.
- npm test executa testes de todo o catálogo com código de saída de falha real.
- npm run verify reúne testes, determinismo, integridade de catálogo e build.
- Contador oficial utiliza cloc instalado pelo usuário, sem substituir pelo estimador.
- ZIP inclui código gerado já pronto, comandos Windows e documentação.
- Não inventar commits dos alunos, exportações brutas de ferramentas ou URL pública.

## Fora do escopo
Instalar Node.js automaticamente ou enviar o repositório para uma conta não autorizada.
