# MongoDB - Materiais Didáticos (12.º Ano)

Conjunto de materiais em Markdown para o módulo de MongoDB (Atlas).

## Como usar

-   Começa no ficheiro `01_introducao_e_setup_atlas.md` e segue a ordem.
-   Faz os exemplos no teu projeto e depois resolve os exercícios.
-   Os blocos [ESSENCIAL] são a base; [EXTRA] é opcional para aprofundar.
-   Se estiveres a integrar com React/Node, começa por 04 e 05 depois do setup.

## Pré-requisitos

-   **Node.js + npm:** idealmente Node 20 LTS (Node 18+ funciona).
-   **Conta MongoDB Atlas:** gratuita (Free Tier).
-   **Editor de código:** VS Code ou equivalente.
-   **Terminal:** para correr comandos (`npm`, `node`, `mongosh`).

## Setup rápido

1. Cria um cluster gratuito no Atlas.
2. Cria um utilizador de base de dados.
3. Autoriza o teu IP (ou `0.0.0.0/0` apenas para aula).
4. Copia o `mongodb+srv://...`.
5. Guarda a string em `.env` no backend.

## Comandos mais usados

-   `mongosh "<mongodb+srv://...>"`: shell interativa para falar com o Atlas.
-   `npm install mongodb`: driver oficial (biblioteca Node para falar com o MongoDB).
-   `npm install mongoose`: ODM (camada com schemas, modelos e validação).

## Troubleshooting rápido

-   **Auth failed:** confirma user/pass e permissão no Atlas.
-   **IP not allowed:** adiciona o teu IP em Network Access.
-   **SRV record not found:** liga a rede correta ou muda de DNS.
-   **Timeout:** verifica se o cluster está ativo.

## Índice de ficheiros

-   [01 - Introdução e setup no Atlas](01_introducao_e_setup_atlas.md)
-   [02 - Modelo de documentos e coleções](02_modelo_documentos_e_colecoes.md)
-   [03 - CRUD básico com mongosh](03_crud_basico_mongosh.md)
-   [04 - Driver oficial (Node)](04_node_driver_fundamentos.md)
-   [05 - Mongoose: fundamentos](05_mongoose_fundamentos.md)
-   [06 - Relações e referências](06_relacoes_e_referencias.md)
-   [07 - Queries e indexação](07_queries_e_indexacao.md)
-   [08 - Validação e erros](08_validacao_e_erros.md)
-   [09 - Backup e exportação](09_backup_e_exportacao.md)
-   [10 - Troubleshooting](10_troubleshooting.md)
