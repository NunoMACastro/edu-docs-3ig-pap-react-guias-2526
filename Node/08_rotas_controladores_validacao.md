# Node.js (12.º Ano) - 08 · Rotas, controladores e validação

> **Objetivo deste ficheiro**
> Criar rotas e controllers organizados.
> Validar dados com e sem Zod.
> Usar verbos HTTP de forma consistente.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Router](#sec-1)
-   [2. [ESSENCIAL] Controller](#sec-2)
-   [3. [ESSENCIAL] Validação com Zod (opcional)](#sec-3)
-   [4. [EXTRA] Boas práticas de API](#sec-4)
-   [Exercícios - Rotas e validação](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria Router e Controller antes da validação.
-   **Como estudar:** monta uma rota por vez e testa com Postman/Thunder Client.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Router

### Exemplo

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

### Checkpoint

-   Onde é que validas o `id`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Controller

### Exemplo

```js
// src/controllers/todos.controller.js
import * as service from "../services/todos.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listar = asyncHandler(async (_req, res) => {
    const itens = await service.listar();
    res.json(itens);
});

export const obter = asyncHandler(async (req, res) => {
    const item = await service.obter(req.params.id);
    if (!item) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Todo não encontrado", details: [] },
        });
    }
    res.json(item);
});

export const criar = asyncHandler(async (req, res) => {
    const novo = await service.criar(req.body);
    res.status(201).json(novo);
});

export const atualizar = asyncHandler(async (req, res) => {
    const item = await service.atualizar(req.params.id, req.body);
    if (!item) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Todo não encontrado", details: [] },
        });
    }
    res.json(item);
});

export const remover = asyncHandler(async (req, res) => {
    const ok = await service.remover(req.params.id);
    if (!ok) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Todo não encontrado", details: [] },
        });
    }
    res.status(204).send();
});
```

### Checkpoint

-   Que status code devolves ao criar?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Validação com Zod (opcional)

### Exemplo

> **Nota:** para usar Zod, instala com `npm i zod`. Se não quiseres Zod, remove o middleware `validate` e faz validações simples no controller.

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

```js
// src/schemas/todo.schemas.js
import { z } from "zod";

export const idParamSchema = z.object({
    id: z.string().uuid("id precisa ser UUID válido"),
});

export const todoCreateSchema = z.object({
    titulo: z.string().min(1),
    concluido: z.boolean().optional().default(false),
});

export const todoUpdateSchema = todoCreateSchema.partial();
```

### Checkpoint

-   Qual é a vantagem de usar Zod?

<a id="sec-4"></a>

## 4. [EXTRA] Boas práticas de API

-   `GET` para ler, `POST` para criar, `PATCH` para atualizar, `DELETE` para remover.
-   Usa `201` ao criar e `204` ao remover.
-   Mensagens de erro claras ajudam o front‑end.

<a id="exercicios"></a>

## Exercícios - Rotas e validação

1. Adiciona o campo `descricao` opcional no schema.
2. Cria uma rota `GET /todos/:id` e devolve 404 se não existir.
3. Testa um `POST` inválido e confirma o erro de validação.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base de rotas, controllers e validação.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
