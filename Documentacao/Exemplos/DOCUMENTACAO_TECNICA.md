# Documentacao Tecnica

## Objetivo

- Descrever arquitetura, camadas e responsabilidades.
- Registar fluxos criticos e decisoes tecnicas.

## Arquitetura

```text
Request -> Route -> Controller -> Service -> DB -> Response
```

### Camadas

- Routes: ligam URLs a controllers
- Controllers: validacao e status codes
- Services: regras de negocio
- Repositories/DB: acesso a dados

## Estrutura de pastas

```text
src/
  routes/
  controllers/
  services/
  repositories/
  models/
  middlewares/
  utils/
```

### Responsabilidades

- routes/: definicao de endpoints
- controllers/: validacao e respostas
- services/: regras de negocio
- repositories/: operacoes de BD
- models/: schemas e modelos
- middlewares/: auth, validacoes, logs
- utils/: helpers reutilizaveis

## Fluxos criticos

### Login

1. POST /auth/login com email e password
2. Controller valida credenciais
3. Service cria sessao/token
4. Response 200 com utilizador

### Upload

1. POST /upload com multipart/form-data
2. Middleware valida ficheiro
3. Service guarda e devolve URL

### Paginacao

1. GET /api/tarefas?page=1&limit=20
2. Response com { items, page, limit, total }

## Integracoes externas

- [SERVICO_EXTERNO_1]
- [SERVICO_EXTERNO_2]

## Decisoes tecnicas (ADR)

```text
Titulo: [DECISAO]
Contexto: [CONTEXTO]
Decisao: [DECISAO_TOMADA]
Consequencias: [IMPACTO]
```
