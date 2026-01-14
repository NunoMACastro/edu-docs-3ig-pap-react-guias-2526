# AI_CONTRACTS.md

Contrato de erro (padrao):
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }

Endpoint: GET /api/tarefas
200 OK
[
  { "_id": "...", "titulo": "Estudar", "feito": false }
]

Endpoint: POST /api/tarefas
Body: { "titulo": "Rever React" }
201 Created
{ "_id": "...", "titulo": "Rever React", "feito": false }
