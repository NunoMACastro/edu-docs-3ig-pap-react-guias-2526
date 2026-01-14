# MongoDB (12.º Ano) - 04 · Driver oficial (Node)

> **Objetivo deste ficheiro**
> Ligar ao Atlas com o driver oficial.
> Criar um helper de ligação reutilizável.
> Fazer CRUD básico em tarefas via Node.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Instalar e configurar](#sec-1)
-   [2. [ESSENCIAL] Helper de ligação](#sec-2)
-   [3. [ESSENCIAL] Onde isto vive num projeto Express](#sec-3)
-   [4. [ESSENCIAL] CRUD básico](#sec-4)
-   [5. [EXTRA] Encerramento limpo (shutdown)](#sec-5)
-   [Exercícios - Driver oficial](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria a ligação antes das rotas.
-   **Como estudar:** testa uma rota GET e confirma o JSON.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Instalar e configurar

```bash
npm install mongodb
```

O **driver oficial** é a biblioteca Node que comunica diretamente com o MongoDB, sem camadas extra.

`.env` no backend:

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/escola
```

### Checkpoint

-   Onde guardas a string de ligação?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Helper de ligação

```js
// src/db/mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Falta MONGODB_URI no .env");

let client;
let db;

export async function getDb() {
    if (db) return db;
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    return db;
}

export async function closeDb() {
    if (client) await client.close();
}
```

### Checkpoint

-   Porque é que o helper evita abrir várias ligações?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Onde isto vive num projeto Express

### Modelo mental

O driver vive no **back-end**, dentro da estrutura MVC. O objetivo é ter a ligação num ficheiro só e usar nos controllers/serviços.

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
import { getDb } from "./db/mongo.js";

const PORT = Number(process.env.PORT || 3000);

await getDb();
app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
```

### Exemplo curto no controller

```js
// src/controllers/tarefas.controller.js
import { getDb } from "../db/mongo.js";

export async function listar(_req, res, next) {
    try {
        const db = await getDb();
        const tarefas = await db.collection("tarefas").find().toArray();
        res.json(tarefas);
    } catch (e) {
        next(e);
    }
}
```

### Checkpoint

-   Em que ficheiro faz sentido chamar `getDb()` no arranque?

<a id="sec-4"></a>

## 4. [ESSENCIAL] CRUD básico

### Exemplo (Express)

```js
// src/routes/tarefas.router.js
import { Router } from "express";
import { getDb } from "../db/mongo.js";

const r = Router();

r.get("/", async (_req, res, next) => {
    try {
        const db = await getDb();
        const tarefas = await db.collection("tarefas").find().toArray();
        res.status(200).json(tarefas);
    } catch (e) {
        next(e);
    }
});

r.post("/", async (req, res, next) => {
    try {
        const { titulo } = req.body || {};
        if (!titulo) {
            return res.status(422).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Título obrigatório",
                    details: [],
                },
            });
        }

        const db = await getDb();
        const doc = { titulo, feito: false, criadoEm: new Date() };
        const result = await db.collection("tarefas").insertOne(doc);
        res.status(201).json({ ...doc, _id: result.insertedId });
    } catch (e) {
        next(e);
    }
});

export default r;
```

### Boas práticas

-   Centraliza erros no `errorHandler` (ver Node/09).
-   Mantém o formato de erro consistente.

### Checkpoint

-   Porque é que usamos `insertOne` e não `insertMany` aqui?

<a id="sec-5"></a>

## 5. [EXTRA] Encerramento limpo (shutdown)

```js
// exemplo simples para fechar a ligação ao sair
import { closeDb } from "./db/mongo.js";

process.on("SIGINT", async () => {
    await closeDb();
    process.exit(0);
});
```

<a id="exercicios"></a>

## Exercícios - Driver oficial

1. **Parte A (ligação):** cria `src/db/mongo.js` com `getDb()`.
   **Critério:** o servidor arranca sem erro de ligação.
2. **Parte B (GET):** cria `GET /api/tarefas`.
   **Critério:** devolve um array JSON (mesmo vazio).
3. **Parte C (POST + validação):** cria `POST /api/tarefas` com `titulo` obrigatório.
   **Critério:** sem `titulo` devolve `422` com `{ error: { code, message } }`.
4. **Parte D (bónus):** adiciona `feito: false` e `criadoEm` no documento.
   **Critério:** resposta inclui esses campos.

<a id="changelog"></a>

## Changelog

-   2026-01-14: nota curta sobre o papel do driver oficial.
-   2026-01-14: ponte MVC, shutdown e exercícios guiados.
-   2026-01-13: criação do ficheiro com driver oficial.
