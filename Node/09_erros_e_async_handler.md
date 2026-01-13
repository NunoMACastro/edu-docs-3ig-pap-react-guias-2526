# Node.js (12.º Ano) - 09 · Erros e asyncHandler

> **Objetivo deste ficheiro**
> Implementar 404 e handler de erros.
> Evitar `try/catch` repetidos com `asyncHandler`.
> Criar erros personalizados com status code.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Middlewares de erro](#sec-1)
-   [2. [ESSENCIAL] asyncHandler](#sec-2)
-   [3. [EXTRA] Erros personalizados](#sec-3)
-   [4. [EXTRA] Boas práticas didáticas](#sec-4)
-   [Exercícios - Erros](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** implementa `notFound` e `errorHandler` primeiro.
-   **Como estudar:** provoca erros e confirma as respostas.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Middlewares de erro

### Exemplo

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

### Checkpoint

-   Onde colocas estes middlewares no `app.js`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] asyncHandler

### Exemplo

```js
// src/utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

### Modelo mental

Em funções `async`, um erro vira uma `Promise` rejeitada. O `asyncHandler` encaminha automaticamente para o `errorHandler`.

### Checkpoint

-   Que problema o `asyncHandler` resolve?

<a id="sec-3"></a>

## 3. [EXTRA] Erros personalizados

```js
export class HttpError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

throw new HttpError("Todo não encontrado", 404);
```

### Checkpoint

-   Que status code usas para “não encontrado”?

<a id="sec-4"></a>

## 4. [EXTRA] Boas práticas didáticas

-   Em dev, mostra `stack` para aprenderes.
-   Em produção, devolve mensagens genéricas.
-   Se o erro for esperado, usa 400/422 com detalhes.

<a id="exercicios"></a>

## Exercícios - Erros

1. Cria um endpoint que lança um erro e confirma o `errorHandler`.
2. Usa `asyncHandler` numa rota `async` e remove o `try/catch`.
3. Cria um `HttpError` com status 400.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre erros e handlers.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
