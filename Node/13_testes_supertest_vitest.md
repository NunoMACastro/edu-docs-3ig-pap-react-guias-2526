# Node.js (12.º Ano) - 13 · Testes com Supertest e Vitest

> **Objetivo deste ficheiro**
> Criar testes de API simples.
> Usar Supertest com o `app` Express.
> Integrar Vitest nos scripts do projeto.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Instalar dependências](#sec-1)
-   [2. [ESSENCIAL] Teste de exemplo](#sec-2)
-   [3. [EXTRA] Dicas e estrutura de testes](#sec-3)
-   [Exercícios - Testes](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria um teste health primeiro.
-   **Como estudar:** corre `npm run test` e vê o resultado.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Instalar dependências

```bash
npm i -D supertest vitest
```

### Checkpoint

-   Porque é que Supertest importa o `app` e não o `server`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Teste de exemplo

```js
// tests/health.test.js
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

### Checkpoint

-   Qual é a vantagem de ter testes para endpoints?

<a id="sec-3"></a>

## 3. [EXTRA] Dicas e estrutura de testes

### Estrutura típica

```
tests/
  health.test.js
  todos.test.js
```

### Exemplo adicional

```js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("todos", () => {
    it("cria um todo válido", async () => {
        const res = await request(app)
            .post("/api/v1/todos")
            .send({ titulo: "Estudar Node" });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            titulo: "Estudar Node",
            concluido: false,
        });
    });
});
```

### Checkpoint

-   Que hook usas para preparar dados antes de cada teste?

<a id="exercicios"></a>

## Exercícios - Testes

1. Cria um teste para `GET /api/v1/todos`.
2. Cria um teste para `POST /api/v1/todos` com body inválido.
3. Corre `npm run test:watch` e confirma o auto‑run.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre Supertest e Vitest.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
