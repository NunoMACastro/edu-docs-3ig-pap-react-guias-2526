# MongoDB (12.º Ano) - 03 · CRUD básico com mongosh

> **Objetivo deste ficheiro**
> Criar documentos com `insertOne` e `insertMany`.
> Ler dados com `find` e `findOne`.
> Atualizar e remover documentos.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Inserir documentos](#sec-1)
-   [2. [ESSENCIAL] Ler documentos](#sec-2)
-   [3. [ESSENCIAL] Atualizar documentos](#sec-3)
-   [4. [ESSENCIAL] Remover documentos](#sec-4)
-   [5. [EXTRA] Projeção de campos](#sec-5)
-   [6. [EXTRA] updateMany e operadores úteis](#sec-6)
-   [Exercícios - CRUD](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** faz insert e find antes de update/delete.
-   **Como estudar:** liga com `mongosh` ao Atlas.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Inserir documentos

### Exemplo

```js
use escola

db.tarefas.insertOne({
  titulo: "Estudar MongoDB",
  feito: false,
  criadoEm: new Date()
})

db.tarefas.insertMany([
  { titulo: "Rever React", feito: false, criadoEm: new Date() },
  { titulo: "Treinar Express", feito: true, criadoEm: new Date() }
])
```

> **Nota:** `use escola` muda a base de dados ativa no `mongosh`.

### Erros comuns

-   Inserir sem `titulo` e ficar com dados incompletos.

### Checkpoint

-   Qual a diferença entre `insertOne` e `insertMany`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Ler documentos

### Exemplo

```js
db.tarefas.find()

db.tarefas.find({ feito: false })

db.tarefas.findOne({ titulo: "Rever React" })
```

### Boas práticas

-   Usa filtros simples primeiro.
-   Evita `find()` sem filtro em coleções grandes.

### Checkpoint

-   Quando usas `findOne`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Atualizar documentos

### Exemplo

```js
// marcar tarefa como feita

db.tarefas.updateOne(
  { titulo: "Rever React" },
  { $set: { feito: true, atualizadoEm: new Date() } }
)
```

### Erros comuns

-   Esquecer o `$set` e substituir o documento inteiro.

### Checkpoint

-   Para que serve o operador `$set`?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Remover documentos

### Exemplo

```js
db.tarefas.deleteOne({ titulo: "Rever React" })

db.tarefas.deleteMany({ feito: true })
```

### Checkpoint

-   Qual a diferença entre `deleteOne` e `deleteMany`?

<a id="sec-5"></a>

## 5. [EXTRA] Projeção de campos

### Modelo mental

Projeção serve para devolver **só os campos necessários**, reduzindo o tamanho da resposta.

### Exemplo

```js
// devolve apenas titulo e feito (sem outros campos)
db.tarefas.find({ feito: false }, { titulo: 1, feito: 1 })
```

### Checkpoint

-   O que muda quando usas projeção?

<a id="sec-6"></a>

## 6. [EXTRA] updateMany e operadores úteis

### Exemplo

```js
// marcar todas as tarefas como não feitas
db.tarefas.updateMany({}, { $set: { feito: false } })

// incrementar um contador simples
db.tarefas.updateMany({}, { $inc: { visitas: 1 } })

// adicionar uma tag a uma tarefa
db.tarefas.updateMany(
  { titulo: "Estudar MongoDB" },
  { $push: { tags: "db" } }
)
```

### Checkpoint

-   Qual a diferença entre `$inc` e `$push`?

<a id="exercicios"></a>

## Exercícios - CRUD

1. Insere 3 tarefas novas.
2. Lista apenas tarefas não feitas.
3. Atualiza uma tarefa e adiciona `atualizadoEm`.
4. Remove uma tarefa pelo `titulo`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: nota sobre `use` no `mongosh`.
-   2026-01-14: extras de projeção e updateMany, com checkpoints.
-   2026-01-13: criação do ficheiro com CRUD básico no mongosh.
