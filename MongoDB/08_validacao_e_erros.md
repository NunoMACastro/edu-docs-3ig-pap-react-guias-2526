# MongoDB (12.º Ano) - 08 · Validação e erros

> **Objetivo deste ficheiro**
> Validar dados no Mongoose.
> Normalizar erros para o frontend.
> Evitar dados inconsistentes na coleção.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Validação no schema](#sec-1)
-   [2. [ESSENCIAL] Normalizar erros](#sec-2)
-   [3. [ESSENCIAL] Casos reais: ID inválido e duplicate key](#sec-3)
-   [4. [EXTRA] Dicas de mensagens](#sec-4)
-   [Exercícios - Validação](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** garante validações básicas antes de avançar.
-   **Como estudar:** provoca erros e confirma o JSON devolvido.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Validação no schema

```js
// src/models/tarefa.model.js
const tarefaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, minlength: 3 },
    feito: { type: Boolean, default: false },
});
```

### Erros comuns

-   Confiar apenas no frontend e não validar no backend.

### Checkpoint

-   Onde deve acontecer a validação final?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Normalizar erros

### Modelo mental

O frontend espera sempre o mesmo formato:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Mensagem", "details": [] } }
```

### Exemplo

```js
function mapError(err) {
    if (err?.name === "ValidationError") {
        return {
            status: 422,
            error: {
                code: "VALIDATION_ERROR",
                message: "Dados inválidos",
                details: Object.values(err.errors).map((e) => ({
                    field: e.path,
                    message: e.message,
                })),
            },
        };
    }
    if (err?.name === "CastError") {
        return {
            status: 400,
            error: {
                code: "INVALID_ID",
                message: "ID inválido",
                details: [{ field: err.path, value: err.value }],
            },
        };
    }
    if (err?.code === 11000) {
        const fields = Object.keys(err.keyPattern || {});
        return {
            status: 409,
            error: {
                code: "DUPLICATE_KEY",
                message: "Já existe um registo com esse valor",
                details: fields.map((f) => ({ field: f })),
            },
        };
    }
    return {
        status: 500,
        error: { code: "SERVER_ERROR", message: "Erro interno", details: [] },
    };
}

// no errorHandler
const payload = mapError(err);
res.status(payload.status).json({ error: payload.error });
```

### Checkpoint

-   Porque é que o frontend beneficia de erros consistentes?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Casos reais: ID inválido e duplicate key

### ID inválido (CastError)

Política do curso: **ID inválido devolve 400** com `INVALID_ID`.

`CastError` é o erro de conversão do Mongoose quando um valor não cabe no tipo esperado (ex.: `ObjectId`).

```js
import mongoose from "mongoose";

// exemplo em GET/PUT/DELETE /api/tarefas/:id
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
        error: { code: "INVALID_ID", message: "ID inválido", details: [] },
    });
}
```

Se preferires não validar, o Mongoose lança `CastError` e o `mapError` trata.

### Duplicate key (E11000)

```js
// src/models/utilizador.model.js
const utilizadorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
});
```

Ao tentar inserir um email repetido, o Mongo devolve `E11000` e o `mapError` devolve **409**.

### Erros comuns

-   Enviar um ID inválido e não tratar o erro.
-   Marcar `unique: true` e esquecer de tratar `E11000`.

### Checkpoint

-   Que status code usas para `INVALID_ID`?
-   Que status code usas para `DUPLICATE_KEY`?

<a id="sec-4"></a>

## 4. [EXTRA] Dicas de mensagens

-   Mensagens curtas e específicas ajudam o utilizador.
-   Não exponhas detalhes internos em produção.

<a id="exercicios"></a>

## Exercícios - Validação

1. Adiciona validação `minlength: 5` ao `titulo`.
2. Provoca um `CastError` com um ID inválido e confirma `400` + JSON de erro.
3. Cria um campo `unique` (ex.: `email`) e provoca `E11000`, confirmando `409`.
4. Mostra os erros no frontend com `e.message`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: tratamento de `CastError`/`E11000` com exemplos reais e nota explicativa.
-   2026-01-13: criação do ficheiro sobre validação e erros.
