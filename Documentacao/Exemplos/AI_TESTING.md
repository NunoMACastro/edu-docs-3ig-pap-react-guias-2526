# AI_TESTING.md

Testes automaticos:
- npm run test
- npm run test -- --coverage

Validacao manual:
- GET /api/tarefas devolve { items, page, limit, total }
- POST /api/tarefas sem titulo -> 422
- Frontend mostra erro no ecra
