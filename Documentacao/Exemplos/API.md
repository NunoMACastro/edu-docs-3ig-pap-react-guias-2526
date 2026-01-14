# Documentacao da API

## Base URL

- Dev: [BASE_URL_DEV]
- Prod: [BASE_URL_PROD]

## Autenticacao

- Metodo: [JWT | COOKIE | OUTRO]
- Header: Authorization: Bearer <token>

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

## Endpoints

| Metodo | URL | Auth | Descricao |
| --- | --- | --- | --- |
| GET | /api/tarefas | Nao | Lista tarefas |
| POST | /api/tarefas | Sim | Cria tarefa |
| GET | /api/tarefas/:id | Sim | Detalhe da tarefa |
| PUT | /api/tarefas/:id | Sim | Atualiza tarefa |
| DELETE | /api/tarefas/:id | Sim | Remove tarefa |
| POST | /auth/login | Nao | Login |
| GET | /auth/me | Sim | Utilizador atual |
| POST | /auth/logout | Sim | Logout |

## Exemplos

```text
GET /api/tarefas
200 OK
[
  { "_id": "...", "titulo": "Estudar", "feito": false }
]
```

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
GET /api/tarefas?page=1&limit=10
GET /api/tarefas?q=estudar&feito=false
```

```json
{ "items": [], "page": 1, "limit": 10, "total": 42 }
```

## Uploads

```text
POST /api/upload
Body: multipart/form-data (campo: file)
```

- Tipos permitidos: [TIPOS]
- Tamanho maximo: [TAMANHO]
