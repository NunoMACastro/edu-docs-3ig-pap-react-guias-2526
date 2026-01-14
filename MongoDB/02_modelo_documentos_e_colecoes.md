# MongoDB (12.º Ano) - 02 · Modelo de documentos e coleções

> **Objetivo deste ficheiro**
> Entender documentos, coleções e bases de dados.
> Perceber o papel do campo `_id`.
> Definir um modelo base para tarefas.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Documento, coleção e database](#sec-1)
-   [2. [ESSENCIAL] Estrutura de uma tarefa](#sec-2)
-   [3. [EXTRA] JSON vs BSON](#sec-3)
-   [Exercícios - Modelo de dados](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca documento, coleção e `_id`.
-   **Como estudar:** escreve exemplos pequenos e compara com JSON normal.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Documento, coleção e database

### Modelo mental

-   **Documento:** um objeto com campos (JSON).
-   **Coleção:** um conjunto de documentos do mesmo tipo.
-   **Database:** agrupamento de coleções.
-   **_id:** identificador único; por defeito é um `ObjectId` gerado pelo MongoDB.

### Exemplo (documento de tarefa)

```json
{
  "_id": "...",
  "titulo": "Estudar MongoDB",
  "feito": false,
  "criadoEm": "2026-01-13T10:00:00Z"
}
```

### Erros comuns

-   Misturar tipos no mesmo campo (string vs número).
-   Criar documentos com campos muito diferentes.

### Boas práticas

-   Mantém um modelo base consistente.
-   Usa nomes simples e claros.

### Checkpoint

-   O que é uma coleção numa frase?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Estrutura de uma tarefa

### Modelo mental

Vamos usar sempre **tarefas** para manter consistência no curso.

Campos recomendados:

-   `titulo` (string)
-   `feito` (boolean)
-   `criadoEm` (data)
-   `atualizadoEm` (data)

### Exemplo (modelo base)

```json
{
  "titulo": "Rever Node",
  "feito": false,
  "criadoEm": "2026-01-13T10:00:00Z",
  "atualizadoEm": "2026-01-13T10:00:00Z"
}
```

### Checkpoint

-   Porque é que `criadoEm` é útil?

<a id="sec-3"></a>

## 3. [EXTRA] JSON vs BSON

### Modelo mental

O MongoDB guarda documentos em **BSON**, uma versao binaria do JSON. Isso permite guardar tipos como `Date` e `ObjectId`.

### Checkpoint

-   Que tipo extra existe no BSON que não existe no JSON?

<a id="exercicios"></a>

## Exercícios - Modelo de dados

1. Desenha um documento de tarefa com mais 1 campo a tua escolha.
2. Decide que campos são obrigatórios e porque.

<a id="changelog"></a>

## Changelog

-   2026-01-14: nota curta sobre `_id` e `ObjectId`.
-   2026-01-14: correção de acentos e uniformização de termos.
-   2026-01-13: criação do ficheiro com modelo base.
