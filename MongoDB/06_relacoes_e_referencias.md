# MongoDB (12.º Ano) - 06 · Relações e referências

> **Objetivo deste ficheiro**
> Entender embed vs reference.
> Usar `ObjectId` para ligar documentos.
> Experimentar `populate` no Mongoose.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Embed vs reference](#sec-1)
-   [2. [ESSENCIAL] Exemplo com tarefas e utilizadores](#sec-2)
-   [3. [EXTRA] Quando evitar relações](#sec-3)
-   [Exercícios - Relações](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina o conceito antes do `populate`.
-   **Como estudar:** cria 2 coleções e liga por ID.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Embed vs reference

### Modelo mental

-   **Embed:** guarda sub-documentos dentro do documento pai.
-   **Reference:** guarda apenas o `ObjectId` do documento relacionado.

> **Nota:** `ObjectId` é o identificador único padrão do MongoDB.

### Exemplo rápido

```json
// embed
{ "titulo": "Projeto", "tarefas": [ { "titulo": "A" }, { "titulo": "B" } ] }

// reference
{ "titulo": "Tarefa A", "utilizadorId": "64f..." }
```

### Exemplos concretos

-   **Embed:** guardar histórico/snapshot dentro do documento (ex.: comentários fixos de uma tarefa).
-   **Reference:** entidade que muda e é usada em muitos sítios (ex.: utilizador).

### Checkpoint

-   Quando faz sentido usar embed?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Exemplo com tarefas e utilizadores

### Schema (Mongoose)

```js
// src/models/utilizador.model.js
import mongoose from "mongoose";

const utilizadorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
});

export const Utilizador = mongoose.model("Utilizador", utilizadorSchema);
```

```js
// src/models/tarefa.model.js
import mongoose from "mongoose";

const tarefaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    utilizadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilizador" },
});

export const Tarefa = mongoose.model("Tarefa", tarefaSchema);
```

### Rota com populate

```js
const tarefas = await Tarefa.find().populate("utilizadorId", "nome");
```

O `populate` resolve a referência e traz dados do documento relacionado (parecido com um join).

> **Nota:** `populate` é conveniente, mas pode ser pesado em listas grandes.

### Erros comuns

-   Usar `populate` sem `ref` no schema.
-   Guardar `utilizadorId` como string normal.

### Checkpoint

-   O que faz o `populate`?

<a id="sec-3"></a>

## 3. [EXTRA] Quando evitar relações

-   Se a informação é pequena e raramente muda, embed pode ser melhor.
-   Se o documento cresce muito, reference evita duplicação.

<a id="exercicios"></a>

## Exercícios - Relações

1. Cria a coleção `utilizadores`.
2. Cria 3 tarefas com `utilizadorId`.
3. Faz `populate` e confirma que aparece o nome.

<a id="changelog"></a>

## Changelog

-   2026-01-14: nota curta sobre `ObjectId` e `populate`.
-   2026-01-14: notas de realidade sobre `populate` e exemplos práticos.
-   2026-01-13: criação do ficheiro sobre relações.
