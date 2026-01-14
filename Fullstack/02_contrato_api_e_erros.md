# Fullstack (12.º Ano) - 02 · Contrato de API e erros

> **Objetivo deste ficheiro**
> Definir o contrato único entre frontend e backend.
> Normalizar erros e status codes.
> Preparar paginação, filtros e upload.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Endpoints base de tarefas](#sec-1)
-   [2. [ESSENCIAL] Formato de erro e status codes](#sec-2)
-   [3. [ESSENCIAL] Paginação e filtros](#sec-3)
-   [4. [EXTRA] Upload e auth (ligação rápida)](#sec-4)
-   [Exercícios - Contrato e erros](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** define o contrato antes de escrever código.
-   **Como estudar:** testa cada endpoint e confirma o JSON.
-   **Ligações úteis:**
    -   React: `../React/11_consumo_api_e_backend_node.md`
    -   Node: `../Node/08_rotas_controladores_validacao.md`
    -   MongoDB: `../MongoDB/08_validacao_e_erros.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Endpoints base de tarefas

### Contrato mínimo

-   `GET /api/tarefas` → lista
-   `GET /api/tarefas/:id` → detalhe
-   `POST /api/tarefas` → cria
-   `PATCH /api/tarefas/:id` → atualiza
-   `DELETE /api/tarefas/:id` → remove

### Exemplo (resposta GET)

```json
[
  { "_id": "...", "titulo": "Estudar Mongo", "feito": false }
]
```

### Checkpoint

-   Porque é que usamos `PATCH` e não `PUT` para updates parciais?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Formato de erro e status codes

### Formato padrão

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Casos comuns

-   **400 INVALID_ID** → id inválido
-   **404 NOT_FOUND** → recurso não existe
-   **409 DUPLICATE_KEY** → valor repetido
-   **422 VALIDATION_ERROR** → campos inválidos

### Exemplo (erro de validação)

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Título obrigatório", "details": [] } }
```

### Checkpoint

-   Qual é o status code para `DUPLICATE_KEY`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Paginação e filtros

### Query string

-   `?page=1&limit=10`
-   `?q=react`
-   `?sort=criadoEm`

### Resposta recomendada

```json
{ "items": [], "page": 1, "limit": 10, "total": 42 }
```

### Boas práticas

-   `page` e `limit` chegam como string.
-   Mantém sempre o mesmo formato de resposta.

### Checkpoint

-   Porque é que devolvemos `total`?

<a id="sec-4"></a>

## 4. [EXTRA] Upload e auth (ligação rápida)

-   **Upload:** `multipart/form-data` em `POST /api/upload`.
-   **Auth:** usar cookies httpOnly e `credentials: "include"` no frontend.

<a id="exercicios"></a>

## Exercícios - Contrato e erros

1. Implementa `GET /api/tarefas` e confirma `200`.
2. Força um `INVALID_ID` e confirma `400` com JSON de erro.
3. Cria uma validação `titulo` obrigatório e confirma `422`.
4. Adiciona um campo `unique` e confirma `409`.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com contrato e erros base.
