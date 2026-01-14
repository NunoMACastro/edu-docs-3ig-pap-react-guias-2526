# MongoDB (12.º Ano) - 05 · Mongoose: fundamentos

> **Objetivo deste ficheiro**
> Perceber o papel do Mongoose (ODM).
> Criar um Schema e um Model.
> Fazer CRUD básico com validação.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Instalar e ligar](#sec-1)
-   [2. [ESSENCIAL] Schema e Model](#sec-2)
-   [3. [ESSENCIAL] Onde isto vive num projeto Express](#sec-3)
-   [4. [ESSENCIAL] CRUD básico](#sec-4)
-   [5. [EXTRA] Encerramento limpo (shutdown)](#sec-5)
-   [Exercícios - Mongoose](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria o Model antes das rotas.
-   **Como estudar:** compara com o driver oficial no ficheiro 04.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Instalar e ligar

```bash
npm install mongoose
```

O **Mongoose** é um ODM: uma camada que adiciona **schemas**, validação e utilitários por cima do driver oficial.

```js
// src/db/mongoose.js
import mongoose from "mongoose";

export async function connectMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Falta MONGODB_URI no .env");
    await mongoose.connect(uri);
}
```

### Checkpoint

-   Qual a vantagem de usar Mongoose?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Schema e Model

**Schema** define a estrutura e regras; **Model** é a classe que liga ao Mongo e permite CRUD na coleção.

```js
// src/models/tarefa.model.js
import mongoose from "mongoose";

const tarefaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        feito: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" } }
);

export const Tarefa = mongoose.model("Tarefa", tarefaSchema);
```

### Checkpoint

-   Para que serve `timestamps`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Onde isto vive num projeto Express

### Modelo mental

O Mongoose encaixa no **back-end MVC**: ligação em `db/`, modelos em `models/`, e uso nos controllers/serviços.

### Exemplo de pastas (referência)

```
src/
  config/
  db/
  models/
  controllers/
  routes/
  middlewares/
```

Configuração (URI, etc.) vive no `.env` e pode ser centralizada em `src/config`.

### Onde iniciar a ligação

```js
// src/server.js
import { app } from "./app.js";
import { connectMongo } from "./db/mongoose.js";

const PORT = Number(process.env.PORT || 3000);

await connectMongo();
app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
```

### Exemplo curto no controller

```js
// src/controllers/tarefas.controller.js
import { Tarefa } from "../models/tarefa.model.js";

export async function listar(_req, res, next) {
    try {
        const tarefas = await Tarefa.find().lean();
        res.json(tarefas);
    } catch (e) {
        next(e);
    }
}
```

### Checkpoint

-   Em que pasta ficam os Models?

<a id="sec-4"></a>

## 4. [ESSENCIAL] CRUD básico

```js
// src/routes/tarefas.router.js
import { Router } from "express";
import { Tarefa } from "../models/tarefa.model.js";

const r = Router();

r.get("/", async (_req, res, next) => {
    try {
        const tarefas = await Tarefa.find().lean();
        res.json(tarefas);
    } catch (e) {
        next(e);
    }
});

r.post("/", async (req, res, next) => {
    try {
        const tarefa = await Tarefa.create({ titulo: req.body?.titulo });
        res.status(201).json(tarefa);
    } catch (e) {
        next(e);
    }
});

export default r;
```

### Erros comuns

-   Esquecer `await` na ligação ao Mongo.
-   Criar o Model com nome diferente do ficheiro.

### Boas práticas

-   Usa `.lean()` em listas para melhorar performance (devolve objetos simples, sem métodos do Mongoose).
-   Centraliza o erro no `errorHandler`.

### Checkpoint

-   Porque usamos `lean()` em listas?

<a id="sec-5"></a>

## 5. [EXTRA] Encerramento limpo (shutdown)

```js
import mongoose from "mongoose";

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});
```

<a id="exercicios"></a>

## Exercícios - Mongoose

1. **Parte A (ligação):** cria `src/db/mongoose.js` com `connectMongo()`.
   **Critério:** o servidor arranca sem erro de ligação.
2. **Parte B (GET):** cria `GET /api/tarefas` com `.lean()`.
   **Critério:** devolve um array JSON.
3. **Parte C (POST + validação):** cria `POST /api/tarefas` e valida `titulo` (min 3).
   **Critério:** dados inválidos devolvem `422` com `{ error: { code, message } }`.
4. **Parte D (bónus):** adiciona o campo `prioridade`.
   **Critério:** o documento devolvido inclui `prioridade`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: explicação curta de ODM, Schema/Model e `lean()`.
-   2026-01-14: ponte MVC, shutdown e exercícios guiados.
-   2026-01-13: criação do ficheiro com fundamentos de Mongoose.
