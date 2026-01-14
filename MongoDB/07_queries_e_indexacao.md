# MongoDB (12.º Ano) - 07 · Queries e indexação

> **Objetivo deste ficheiro**
> Filtrar, ordenar e paginar resultados.
> Entender o papel dos índices.
> Aplicar queries no domínio de tarefas.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Filtros e ordenação](#sec-1)
-   [2. [ESSENCIAL] Paginação](#sec-2)
-   [3. [ESSENCIAL] Índices](#sec-3)
-   [4. [EXTRA] Verificar e sincronizar índices](#sec-4)
-   [Exercícios - Queries](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** começa por filtros e sort.
-   **Como estudar:** testa queries pequenas e confirma resultados.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Filtros e ordenação

### Exemplo (Mongoose)

```js
// tarefas não feitas, mais recentes primeiro
const tarefas = await Tarefa.find({ feito: false })
    .sort({ criadoEm: -1 })
    .lean();
```

### Erros comuns

-   Esquecer que `sort` usa 1 (asc) e -1 (desc).

### Checkpoint

-   Como ordenas por data decrescente?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Paginação

### Modelo mental

Usa `skip` e `limit` para devolver apenas um bloco de resultados.

```js
const page = Number(req.query.page || 1);
const limit = Number(req.query.limit || 10);
const skip = (page - 1) * limit;

const items = await Tarefa.find().skip(skip).limit(limit).lean();
const total = await Tarefa.countDocuments();

res.json({ items, page, limit, total });
```

### Checkpoint

-   Como calculas o `skip` da página 3?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Índices

### Modelo mental

Índices tornam as queries mais rápidas, mas aumentam o custo de escrita.

```js
// criar índice no Mongoose
Tarefa.schema.index({ feito: 1, criadoEm: -1 });
```

> **Nota:** os índices têm de existir na base de dados (Atlas). Em produção, `autoIndex` pode estar desligado (o Mongoose deixa de criar índices automaticamente ao arrancar).

### Boas práticas

-   Indexa campos usados em filtros frequentes.
-   Evita índices em coleções muito pequenas (não faz diferença).

### Checkpoint

-   Quando é que um índice ajuda?

<a id="sec-4"></a>

## 4. [EXTRA] Verificar e sincronizar índices

### Opções rápidas

-   **Atlas UI:** abre a coleção e confirma os índices existentes.
-   **Mongoose (dev):** usa `await Tarefa.syncIndexes()` com cuidado (compara o schema com os índices na base).

### Exemplo (mongosh)

```js
db.tarefas.getIndexes()
```

<a id="exercicios"></a>

## Exercícios - Queries

1. Cria uma rota `GET /api/tarefas?feito=false`.
2. Adiciona `page` e `limit` na query string.
3. Ordena por `criadoEm` desc.
4. Lista os índices da coleção e confirma que existe `feito_1_criadoEm_-1`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: notas sobre `autoIndex`/`syncIndexes` e verificação prática.
-   2026-01-13: criação do ficheiro sobre queries e índices.
