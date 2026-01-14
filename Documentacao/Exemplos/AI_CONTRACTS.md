# AI_CONTRACTS.md

Contrato de erro (padrao):
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }

Endpoint: GET /api/tarefas
200 OK
{
  "items": [ { "_id": "...", "titulo": "Estudar", "feito": false } ],
  "page": 1,
  "limit": 20,
  "total": 1
}

Endpoint: POST /api/tarefas
Body: { "titulo": "Rever React" }
201 Created
{ "_id": "...", "titulo": "Rever React", "feito": false }
