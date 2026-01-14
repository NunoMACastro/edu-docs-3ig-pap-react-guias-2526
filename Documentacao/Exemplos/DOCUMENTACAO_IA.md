# Documentacao para Agentes de IA

## Objetivo

- Definir contexto, regras e limites para uso de IA.
- Manter consistencia entre frontend, backend e dados.

## Ficheiros base

- AGENTS.md
- AI_CONTEXT.md
- AI_PROFILES.md
- AI_CONTRACTS.md
- AI_TESTING.md
- AI_LIMITS.md
- AI_CHANGELOG.md

## Contrato de erro

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

## Testes e validacao

- npm run test
- Validacao manual listada em AI_TESTING.md
