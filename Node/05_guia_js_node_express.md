# Node.js (12.º Ano) - 05 · Guia JS Node + Express

> **Objetivo deste ficheiro**
> Reunir num só sítio o essencial de Node + Express.
> Servir como guia de referência rápida para aulas e projetos.
> Manter os exemplos em ES Modules (ESM).

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Setup rápido de projeto](#sec-1)
-   [2. [ESSENCIAL] Módulos em Node (ESM vs CommonJS)](#sec-2)
-   [3. [ESSENCIAL] Node core útil](#sec-3)
-   [4. [ESSENCIAL] HTTP nativo vs Express](#sec-4)
-   [5. [ESSENCIAL] Express: app base e middlewares](#sec-5)
-   [6. [ESSENCIAL] Estrutura de pastas (MVC leve)](#sec-6)
-   [7. [ESSENCIAL] Rotas, controllers e validação](#sec-7)
-   [8. [ESSENCIAL] Erros e asyncHandler](#sec-8)
-   [9. [ESSENCIAL] Persistência em ficheiro JSON](#sec-9)
-   [10. [ESSENCIAL] Segurança e logging](#sec-10)
-   [11. [ESSENCIAL] Config e 12‑Factor](#sec-11)
-   [12. [ESSENCIAL] Testes rápidos](#sec-12)
-   [13. [EXTRA] Views com EJS (SSR)](#sec-13)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** este guia é um resumo; usa os capítulos Node para detalhe.
-   **Como estudar:** copia snippets e aplica no teu projeto.

### Requisitos recomendados

-   Node ≥ 18 LTS (tem `fetch` global e boas APIs modernas).
-   npm ≥ 9.
-   VS Code com ESLint/Prettier.

### Glossário rápido

-   **Request:** pedido do cliente com método, URL, headers e body.
-   **Response:** resposta do servidor com status e body.
-   **Middleware:** função entre o pedido e a resposta.
-   **Router:** conjunto de rotas relacionadas.
-   **Controller:** adapta pedido e escolhe resposta.
-   **Service:** regras de negócio.
-   **Repository:** acesso a dados.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Setup rápido de projeto

```bash
mkdir api-aula && cd api-aula
npm init -y
npm pkg set type=module
npm i express cors helmet morgan compression
npm i -D nodemon
npm i zod            # opcional (validação)
npm i -D prettier eslint eslint-config-prettier eslint-plugin-import
```

Scripts essenciais:

```json
{
    "type": "module",
    "scripts": {
        "dev": "nodemon --env-file .env --watch src --ext js,mjs --exec \"node src/server.js\"",
        "start": "node src/server.js",
        "lint": "eslint .",
        "format": "prettier -w ."
    }
}
```

`.gitignore` básico:

```
node_modules
.env
coverage
dist
```

Pastas base:

```
src/
  app.js
  server.js
  routes/
  controllers/
  middlewares/
  services/
  utils/
  data/
  public/
```

<a id="sec-2"></a>

## 2. [ESSENCIAL] Módulos em Node (ESM vs CommonJS)

### ESM (padrão do curso)

```js
// utils/math.js
export const soma = (a, b) => a + b;

// noutro ficheiro
import { soma } from "./utils/math.js";
```

### CommonJS (histórico)

Sistema antigo com `require` e `module.exports`. Não é o padrão recomendado.

### Import dinâmico

```js
const mod = await import("./utils/math.js");
console.log(mod.soma(2, 3));
```

### __dirname em ESM

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

<a id="sec-3"></a>

## 3. [ESSENCIAL] Node core útil

```js
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { EventEmitter } from "node:events";
import crypto from "node:crypto";

const raiz = process.cwd();
const ficheiro = path.join(raiz, "data", "todos.json");
const id = crypto.randomUUID();

const bus = new EventEmitter();
bus.on("novo_todo", (todo) => console.log("Evento:", todo));
```

Notas rápidas:

-   `fs/promises` permite I/O assíncrono.
-   `crypto` evita IDs inseguros.
-   Streams são úteis para ficheiros grandes.

<a id="sec-4"></a>

## 4. [ESSENCIAL] HTTP nativo vs Express

```js
import http from "node:http";

const server = http.createServer((req, res) => {
    if (req.url === "/") return res.writeHead(200).end("Olá");
    res.writeHead(404).end("Não encontrado");
});

server.listen(3000);
```

Express automatiza routing, parsing de body e erros.

<a id="sec-5"></a>

## 5. [ESSENCIAL] Express: app base e middlewares

```js
// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import todosRouter from "./routes/todos.router.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsCredentials = process.env.CORS_CREDENTIALS === "true";

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: corsOrigin,
        credentials: corsCredentials,
    })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", ts: Date.now() })
);

app.use("/api/v1/todos", todosRouter);
app.use(notFound);
app.use(errorHandler);
```

```js
// src/server.js
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`API a escutar em http://localhost:${PORT}`)
);
```

<a id="sec-6"></a>

## 6. [ESSENCIAL] Estrutura de pastas (MVC leve)

```
src/
  app.js
  server.js
  routes/
  controllers/
  services/
  repositories/
  middlewares/
  utils/
  data/
  public/
```

Fluxo: `route → controller → service → repository → service → controller → res`.

<a id="sec-7"></a>

## 7. [ESSENCIAL] Rotas, controllers e validação

```js
// src/routes/todos.router.js
import { Router } from "express";
import * as ctrl from "../controllers/todos.controller.js";
import { validate } from "../middlewares/validate.js";
import {
    todoCreateSchema,
    todoUpdateSchema,
    idParamSchema,
} from "../schemas/todo.schemas.js";

const r = Router();

r.get("/", ctrl.listar);
r.get("/:id", validate({ params: idParamSchema }), ctrl.obter);
r.post("/", validate({ body: todoCreateSchema }), ctrl.criar);
r.patch(
    "/:id",
    validate({ params: idParamSchema, body: todoUpdateSchema }),
    ctrl.atualizar
);
r.delete("/:id", ctrl.remover);

export default r;
```

```js
// src/controllers/todos.controller.js
import * as service from "../services/todos.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listar = asyncHandler(async (_req, res) => {
    const itens = await service.listar();
    res.json(itens);
});
```

```js
// src/middlewares/validate.js
import { ZodError } from "zod";
export function validate(schemas = {}) {
    return (req, res, next) => {
        try {
            if (schemas.params) req.params = schemas.params.parse(req.params);
            if (schemas.query) req.query = schemas.query.parse(req.query);
            if (schemas.body) req.body = schemas.body.parse(req.body);
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                return res
                    .status(422)
                    .json({
                        error: {
                            code: "VALIDATION_ERROR",
                            message: "Validação falhou",
                            details: e.issues,
                        },
                    });
            }
            next(e);
        }
    };
}
```

<a id="sec-8"></a>

## 8. [ESSENCIAL] Erros e asyncHandler

```js
// src/middlewares/errors.js
function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

export function notFound(_req, res, _next) {
    return sendError(res, 404, "NOT_FOUND", "Rota não encontrada");
}

export function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const code = err.code || "SERVER_ERROR";
    const message = err.message || "Erro interno";
    const details =
        process.env.NODE_ENV !== "production" && err.stack ? [err.stack] : [];
    return sendError(res, status, code, message, details);
}
```

```js
// src/utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

<a id="sec-9"></a>

## 9. [ESSENCIAL] Persistência em ficheiro JSON

```js
// src/repositories/todos.repo.file.js
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const F = path.join(__dirname, "..", "data", "todos.json");

async function lerTodos() {
    try {
        return JSON.parse(await fs.readFile(F, "utf8"));
    } catch (e) {
        if (e.code === "ENOENT") return [];
        throw e;
    }
}
```

<a id="sec-10"></a>

## 10. [ESSENCIAL] Segurança e logging

Instalar (opcional):

```bash
npm i express-rate-limit pino pino-pretty
```

```js
import rateLimit from "express-rate-limit";
import pino from "pino";
import pinoHttp from "pino-http";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
app.use(pinoHttp({ logger }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
```

Nota rápida:

-   Nunca guardes passwords em claro.
-   Tokens devem expirar.

<a id="sec-11"></a>

## 11. [ESSENCIAL] Config e 12‑Factor

`.env` básico:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
```

```js
// src/utils/config.js
export const config = Object.freeze({
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    corsOrigin: process.env.CORS_ORIGIN || "*",
});
```

<a id="sec-12"></a>

## 12. [ESSENCIAL] Testes rápidos

```bash
npm i -D supertest vitest
```

```js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("health", () => {
    it("GET /api/health devolve ok", async () => {
        const res = await request(app).get("/api/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});
```

Scripts:

```json
{
    "test": "vitest --run",
    "test:watch": "vitest"
}
```

<a id="sec-13"></a>

## 13. [EXTRA] Views com EJS (SSR)

### Instalar

```bash
npm i ejs express-ejs-layouts
```

### Estrutura recomendada

```
views/
  layout.ejs
  partials/
    head.ejs
    header.ejs
    footer.ejs
  pages/
    home.ejs
    todos/
      index.ejs
      new.ejs
      show.ejs
      edit.ejs
```

### Configuração na app

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import expressLayouts from "express-ejs-layouts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

app.use("/static", express.static(path.join(__dirname, "public")));

app.locals.appName = "Minha App";
app.locals.fmtData = (ts) =>
    new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(ts);
```

### Router de páginas

```js
import { Router } from "express";
import * as todos from "../services/todos.service.js";

const pages = Router();

pages.get("/", (_req, res) => {
    res.render("pages/home", { titulo: "Bem-vindo", agora: Date.now() });
});

pages.get("/todos", async (_req, res, next) => {
    try {
        const lista = await todos.listar();
        res.render("pages/todos/index", { titulo: "Lista de Tarefas", lista });
    } catch (e) {
        next(e);
    }
});

pages.get("/todos/new", (_req, res) => {
    res.render("pages/todos/new", {
        titulo: "Novo Todo",
        errors: [],
        values: {},
    });
});
```

### Exemplo de layout e páginas

```ejs
<!-- views/layout.ejs -->
<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><%= typeof titulo !== "undefined" ? titulo + " - " : "" %><%= appName %></title>
    <link rel="stylesheet" href="/static/styles.css">
  </head>
  <body>
    <%- include("partials/header") %>
    <main class="container">
      <%- body %>
    </main>
    <%- include("partials/footer") %>
  </body>
</html>
```

```ejs
<!-- views/partials/header.ejs -->
<header class="site-header">
  <nav>
    <a href="/">Home</a>
    <a href="/todos">Todos</a>
    <a href="/todos/new">Novo</a>
  </nav>
</header>
```

```ejs
<!-- views/pages/home.ejs -->
<section>
  <h1><%= titulo %></h1>
  <p>Agora: <%= fmtData(agora) %></p>
  <p>Exemplo de escaping: <%= "<strong>isto aparece como texto</strong>" %></p>
  <p>Exemplo sem escape: <%- "<strong>negrito</strong>" %></p>
</section>
```

```ejs
<!-- views/pages/todos/index.ejs -->
<section>
  <h1><%= titulo %></h1>
  <% if (!lista || lista.length === 0) { %>
    <p>Sem tarefas ainda.</p>
  <% } else { %>
    <ul class="todos">
      <% for (const t of lista) { %>
        <li class="<%= t.concluido ? "done" : "" %>">
          <span><%= t.titulo %></span>
          <small>criado em <%= fmtData(t.criadoEm || Date.now()) %></small>
        </li>
      <% } %>
    </ul>
  <% } %>
</section>
```

### Dicas de segurança/performance

-   Usa `<%=` por defeito (escapado).
-   Ao embutir JSON em `<script>`, evita fechar a tag acidentalmente:
    ```ejs
    <script>
      const DATA = <%- JSON.stringify(obj).replace(/</g, "\\u003c") %>;
    </script>
    ```
-   Em produção, ativa cache de views (`app.set("view cache", true)`).

<a id="changelog"></a>

## Changelog

-   2025-11-10: guia inicial em formato JS.
-   2026-01-12: conversão para Markdown e alinhamento com o estilo React.
