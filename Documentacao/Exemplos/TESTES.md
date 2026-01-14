# Documentacao de Testes

## Comandos

```bash
npm run test
npm run test -- --coverage
```

## Requisitos

- .env configurado
- Base de dados de teste: [NOME_DB_TESTE]
- Seed opcional: [SCRIPT_SEED]

## Testes criticos

- GET /api/tarefas devolve 200 e array
- POST /api/tarefas devolve 201
- POST /auth/login devolve 200

## Output esperado

```text
 PASS  tests/tarefas.test.js
  ✓ GET /api/tarefas devolve 200
  ✓ POST /api/tarefas devolve 201
```

## Cobertura

- Target: [PERCENTAGEM]
- Excecoes: [EXCECOES]

## Validacao manual

- GET /api/tarefas devolve array
- POST /api/tarefas sem titulo -> 422
- Frontend mostra erro
