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
    -   Node: `../Node/06_rotas_controladores_validacao.md`
    -   MongoDB: `../MongoDB/08_validacao_e_erros.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Endpoints base de tarefas

### Contrato mínimo

-   `GET /api/tarefas` → lista (envelope)
-   `GET /api/tarefas/:id` → detalhe
-   `POST /api/tarefas` → cria
-   `PATCH /api/tarefas/:id` → atualiza
-   `DELETE /api/tarefas/:id` → remove

### Exemplo (resposta GET)

```json
{
  "items": [ { "_id": "...", "titulo": "Estudar Mongo", "feito": false } ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

### Porque usamos envelope sempre

-   O frontend fica mais simples e previsível.
-   Evitas ter dois formatos diferentes (com/sem paginação).

### PATCH /api/tarefas/:id (body permitido)

-   `titulo` (string não vazia)
-   `feito` (boolean)

**PUT vs PATCH:** `PUT` substitui o recurso completo, `PATCH` altera só campos específicos.

### Checkpoint

-   Porque é que usamos `PATCH` e não `PUT` para updates parciais?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Formato de erro e status codes

### Formato padrão

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Casos comuns

-   **Regra base:** id malformado → `400 INVALID_ID`; id válido mas inexistente → `404 NOT_FOUND`.
-   **400 INVALID_ID** → id inválido
-   **404 NOT_FOUND** → id válido mas recurso não existe
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

-   `?page=1&limit=20`
-   `?q=react`
-   `?feito=true`
-   `?sort=createdAt&order=desc`

### Regras dos params

-   `page`: >= 1 (default 1)
-   `limit`: 1..100 (default 20)
-   `q`: pesquisa por título
-   `feito`: true/false
-   `sort`: campo permitido (ex.: `createdAt`, `updatedAt`)
-   `order`: `asc` ou `desc`

> **Nota:** o backend deve garantir `createdAt/updatedAt` (timestamps).

### Resposta recomendada

```json
{ "items": [], "page": 1, "limit": 20, "total": 42 }
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

1. **GET /api/tarefas com envelope**
   Passos:
   - Implementa GET com defaults `page=1` e `limit=20`.
   - Devolve sempre `{ items, page, limit, total }`.
   Critério de aceitação:
   - Response inclui `items`, `page`, `limit`, `total`.
   Dica de debugging:
   - Confirma o JSON no Network do browser.

2. **INVALID_ID vs NOT_FOUND**
   Passos:
   - Chama `GET /api/tarefas/:id` com um id malformado.
   - Chama com um id válido que não existe.
   Critério de aceitação:
   - Malformado → `400 INVALID_ID`.
   - Válido mas inexistente → `404 NOT_FOUND`.
   Dica de debugging:
   - Usa `mongoose.Types.ObjectId.isValid`.

3. **Validação de PATCH**
   Passos:
   - Envia `PATCH` com `titulo` vazio e `feito` não boolean.
   - Garante `422` e JSON de erro.
   Critério de aceitação:
   - Erro coerente com `VALIDATION_ERROR`.
   Dica de debugging:
   - Confirma o body real no Network.

4. **Campo unique**
   Passos:
   - Marca um campo como `unique`.
   - Cria dois registos iguais.
   Critério de aceitação:
   - `409 DUPLICATE_KEY` com JSON de erro.
   Dica de debugging:
   - Confirma o índice na BD.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com contrato e erros base.
-   2026-01-14: envelope em GET, regras de erro e exercícios guiados.
