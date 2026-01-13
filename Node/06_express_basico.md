# Node.js (12.º Ano) - 06 · Express básico (app, middlewares e estáticos)

> **Objetivo deste ficheiro**
> Criar a app Express base (`app.js` + `server.js`).
> Entender a ordem dos middlewares.
> Servir ficheiros estáticos e criar um healthcheck.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] app.js (middlewares e rotas)](#sec-1)
-   [2. [ESSENCIAL] server.js (listen)](#sec-2)
-   [3. [ESSENCIAL] Porque separar app e server](#sec-3)
-   [4. [EXTRA] Ordem recomendada dos middlewares](#sec-4)
-   [Exercícios - Express básico](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** monta `app.js` e `server.js` primeiro.
-   **Como estudar:** copia os snippets e adapta para o teu projeto.

<a id="sec-1"></a>

## 1. [ESSENCIAL] app.js (middlewares e rotas)

### Exemplo

> **Nota de dependências:** este exemplo usa `helmet`, `morgan`, `compression` e `express-rate-limit`. Instala com `npm i helmet morgan compression express-rate-limit`.

```js
// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

import path from "node:path";
import { fileURLToPath } from "node:url";

import todosRouter from "./routes/todos.router.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", ts: Date.now() })
);

app.use("/api/v1/todos", todosRouter);

app.use(notFound);
app.use(errorHandler);
```

### Checkpoint

-   Porque é que os middlewares de erro ficam no fim?

<a id="sec-2"></a>

## 2. [ESSENCIAL] server.js (listen)

### Exemplo

```js
// src/server.js
import { app } from "./app.js";

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`API a escutar em http://${HOST}:${PORT}`);
});
```

### Checkpoint

-   Que variável define a porta?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Porque separar app e server

### Modelo mental

Separar permite testar `app` sem abrir portas reais (Supertest) e manter o `server.js` mínimo.

### Checkpoint

-   Qual é a vantagem para testes?

<a id="sec-4"></a>

## 4. [EXTRA] Ordem recomendada dos middlewares

1. Segurança e utilitários (Helmet, CORS, logging).
2. Parsers de body (JSON, urlencoded).
3. Rotas da API.
4. 404 e handler de erros.

### Checkpoint

-   Porque a ordem importa?

<a id="exercicios"></a>

## Exercícios - Express básico

1. Adiciona um endpoint `GET /api/health` e testa no browser.
2. Liga `express.static` e serve um ficheiro dentro de `public/`.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base com app/server e middlewares.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
