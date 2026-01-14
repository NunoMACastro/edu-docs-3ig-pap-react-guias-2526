# [NOME_PROJETO]

[RESUMO_CURTO_EM_1_2_FRASES]

## Features

- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

## Stack

- Frontend: [STACK_FRONTEND]
- Backend: [STACK_BACKEND]
- Base de dados: [STACK_DB]
- Autenticação: [COOKIE_HTTPONLY | BEARER]

## Decisões padrão do kit

- Contrato de erro: `{ "error": { "code": "...", "message": "...", "details": [] } }`
- Listas devolvem envelope: `{ "items": [], "page": 1, "limit": 20, "total": 0 }`
- POST/GET detalhe devolvem objeto; PATCH devolve objeto atualizado; DELETE devolve `204`.
- Autenticação recomendada: cookie httpOnly com JWT. Alternativa: Bearer token (documentar header).
- Timestamps: `createdAt` / `updatedAt`.
- Paginação: `page >= 1`, `limit` default 20, máximo 100.

## Requisitos

- Node.js [VERSÃO]
- npm [VERSÃO]
- [OUTROS_REQUISITOS]

## Como correr (dev)

### Instalação

```bash
# frontend
cd frontend
npm install

# backend
cd backend
npm install
```

### Variáveis de ambiente

- Criar `.env` no backend.
- Criar `.env` no frontend (se necessário).
- Entregar `.env.example` com todas as variáveis.

```text
# backend
PORT=3000
MONGODB_URI=...
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=...

# frontend
VITE_API_BASE=http://localhost:3000
```

### Comandos

```text
- npm run dev: [DESCRIÇÃO]
- npm run test: [DESCRIÇÃO]
- npm run build: [DESCRIÇÃO]
- npm run start: [DESCRIÇÃO]
```

## Estrutura de documentação

- DOCUMENTACAO_TECNICA.md
- API.md
- DADOS.md
- TESTES.md
- DEPLOY.md
- DOCUMENTACAO_CODIGO.md
- DOCUMENTACAO_IA.md
- AGENTS.md
- AI_CONTEXT.md
- AI_PROFILES.md
- AI_CONTRACTS.md
- AI_TESTING.md
- AI_LIMITS.md
- AI_CHANGELOG.md

## Troubleshooting

- Backend não arranca: confirmar `.env` e `MONGODB_URI`.
- CORS bloqueado: confirmar `CORS_ORIGIN`.
- Página em branco: confirmar `div#root` e consola.

## Checklist de entrega

- [ ] README completo e sem placeholders
- [ ] API documentada (exemplos + erros)
- [ ] Dados documentados (campos/validações/índices)
- [ ] Testes mínimos descritos e como correr
- [ ] Deploy/operação com dev/prod e backups
- [ ] Documentação para IA com regras e limites

## Proibido entregar com placeholders

- Remover `[NOME_PROJETO]`, `[FEATURE_X]`, `TODO`, `TBD`, `???`.

## Licença

[LICENÇA]

## Contacto

[CONTACTO]
