# Node.js - Materiais Didáticos (12.º Ano)

Conjunto de materiais em Markdown para o módulo de Node.js.

## Como usar

-   Começa no ficheiro `01_introducao_e_setup.md` e segue a ordem.
-   Faz os exemplos no teu projeto e depois resolve os exercícios.
-   Os blocos [EXTRA] são opcionais para quem quer aprofundar.
-   Os exemplos usam muitas vezes `todos` (tarefas) — no módulo React podes ver `tarefas` ou `alunos`; o mais importante é o padrão.

## Pré-requisitos

-   **Node.js + npm:** idealmente Node 20 LTS (Node 18+ funciona).
-   **Editor de código:** VS Code ou equivalente.
-   **Terminal:** para correr comandos (`npm`, `node`).

## Setup rápido

```bash
# criar projeto Node com ES Modules (ESM)
mkdir api-aula && cd api-aula
npm init -y
npm pkg set type=module
npm i express cors
```

## Comandos mais usados

-   `npm install`: instala dependências.
-   `npm run dev`: inicia o servidor local (nodemon).
-   `npm run start`: inicia o servidor em modo normal.
-   `npm run test`: corre os testes (se existirem).

## Portas típicas

-   **API Node (backend):** `http://localhost:3000`

## Troubleshooting rápido

-   **Erro de import:** confirma a extensão `.js` nos imports.
-   **__dirname não definido:** usa `fileURLToPath` em ESM.
-   **CORS bloqueado:** garante a origem correta no backend.
-   **nodemon não reinicia:** verifica `--watch src` e `--ext js,mjs`.
-   Vê mais em `15_troubleshooting.md`.

## Índice de ficheiros

-   [01 - Introdução e setup de projeto](01_introducao_e_setup.md)
-   [02 - Módulos em Node (ESM vs CommonJS)](02_modulos_node.md)
-   [03 - Node core útil](03_node_core.md)
-   [04 - HTTP nativo vs Express](04_http_vs_express.md)
-   [05 - Guia JS Node + Express](05_guia_js_node_express.md)
-   [06 - Express básico (app, middlewares e estáticos)](06_express_basico.md)
-   [07 - Estrutura de pastas (MVC leve)](07_estrutura_mvc.md)
-   [08 - Rotas, controladores e validação](08_rotas_controladores_validacao.md)
-   [09 - Erros e asyncHandler](09_erros_e_async_handler.md)
-   [10 - Persistência em ficheiro JSON](10_persistencia_json.md)
-   [11 - Segurança, logging e compressão](11_seguranca_logging.md)
-   [12 - Configuração e 12-Factor](12_config_e_12factor.md)
-   [13 - Testes com Supertest e Vitest](13_testes_supertest_vitest.md)
-   [14 - Views com EJS (SSR opcional)](14_ejs_views.md)
-   [15 - Troubleshooting](15_troubleshooting.md)
