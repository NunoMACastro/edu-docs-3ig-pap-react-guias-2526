# Documentacao da API

## Base URL

- Dev: [BASE_URL_DEV]
- Prod: [BASE_URL_PROD]

## Autenticacao

- Metodo: [JWT | COOKIE | OUTRO]
- Header (JWT): Authorization: Bearer <token>
- Cookies (se aplicavel): credentials + httpOnly

## Contrato de erro

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

## Status codes

- 200 OK
- 201 Created
- 204 No Content
- 400 INVALID_ID
- 401 NOT_AUTHENTICATED
- 403 FORBIDDEN
- 404 NOT_FOUND
- 409 DUPLICATE_KEY
- 422 VALIDATION_ERROR
- 500 INTERNAL_ERROR

## Regras de erro por ID

- ID malformado: 400 INVALID_ID
- ID valido mas inexistente: 404 NOT_FOUND

## Endpoints

| Metodo | URL | Auth | Descricao |
| --- | --- | --- | --- |
| GET | /api/tarefas | Nao | Lista tarefas |
| POST | /api/tarefas | Sim | Cria tarefa |
| GET | /api/tarefas/:id | Sim | Detalhe da tarefa |
| PATCH | /api/tarefas/:id | Sim | Atualiza tarefa |
| DELETE | /api/tarefas/:id | Sim | Remove tarefa |
| POST | /auth/login | Nao | Login |
| GET | /auth/me | Sim | Utilizador atual |
| POST | /auth/logout | Sim | Logout |

## PATCH /api/tarefas/:id (body permitido)

- titulo (string nao vazia)
- feito (boolean)

## Exemplos

```text
GET /api/tarefas
200 OK
{
  "items": [ { "_id": "...", "titulo": "Estudar", "feito": false } ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

Nota: a resposta usa sempre envelope, mesmo sem query params.

```text
POST /api/tarefas
Body: { "titulo": "Rever React" }

201 Created
{ "_id": "...", "titulo": "Rever React", "feito": false }
```

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Titulo e obrigatorio", "details": ["titulo"] } }
```

## Paginacao e filtros

```text
GET /api/tarefas?page=1&limit=20
GET /api/tarefas?q=estudar&feito=false
GET /api/tarefas?sort=createdAt&order=desc
```

```json
{ "items": [], "page": 1, "limit": 20, "total": 42 }
```

## Regras de query

- page: >= 1 (default 1)
- limit: 1..100 (default 20)
- q: pesquisa por titulo
- feito: true/false
- sort: createdAt/updatedAt
- order: asc/desc

## Uploads

```text
POST /api/upload
Body: multipart/form-data (campo: file)
```

- Tipos permitidos: [TIPOS]
- Tamanho maximo: [TAMANHO]
