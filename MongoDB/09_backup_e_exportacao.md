# MongoDB (12.º Ano) - 09 · Backup e exportação

> **Objetivo deste ficheiro**
> Conhecer ferramentas de backup básicas.
> Exportar e importar dados do Atlas.
> Saber quando usar dump vs export.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] mongoexport e mongoimport](#sec-1)
-   [2. [ESSENCIAL] mongodump e mongorestore](#sec-2)
-   [3. [EXTRA] Quando usar cada um](#sec-3)
-   [Exercícios - Backup](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** testa primeiro export/import.
-   **Como estudar:** usa um dataset pequeno de tarefas.

<a id="sec-1"></a>

## 1. [ESSENCIAL] mongoexport e mongoimport

### Modelo mental

`mongoexport` gera ficheiros JSON/CSV. É útil para partilhar dados.

> **Nota:** export/import pode perder tipos BSON e índices.

```bash
mongoexport --uri "$MONGODB_URI" --collection=tarefas --out=tarefas.json
mongoimport --uri "$MONGODB_URI" --collection=tarefas --file=tarefas.json
```

### Checkpoint

-   Quando usas `mongoexport`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] mongodump e mongorestore

### Modelo mental

`mongodump` cria um snapshot completo (mais fiel), e `mongorestore` repõe.

```bash
mongodump --uri "$MONGODB_URI" --db escola --out backup
mongorestore --uri "$MONGODB_URI" backup
```

### Checkpoint

-   Qual a diferença entre dump e export?

<a id="sec-3"></a>

## 3. [EXTRA] Quando usar cada um

-   **export/import:** partilhar dados e migrar pequenos conjuntos.
-   **dump/restore:** backup completo e restauração rápida.

> **Nota de segurança:** evita passar credenciais na linha de comandos em ambientes partilhados e guarda backups em local seguro.

<a id="exercicios"></a>

## Exercícios - Backup

1. Exporta a coleção `tarefas` para JSON.
2. Apaga a coleção e importa de novo.
3. Cria um dump completo da base `escola`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: notas sobre perdas de tipos e segurança dos backups.
-   2026-01-13: criação do ficheiro sobre backup e exportação.
