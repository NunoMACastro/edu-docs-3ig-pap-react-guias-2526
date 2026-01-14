# Documentacao de Dados

## Entidades

### Tarefas

```json
{ "_id": "...", "titulo": "Estudar", "feito": false, "criadoEm": "...", "userId": "..." }
```

Campos:

- titulo: string, obrigatorio, min 3
- feito: boolean, default false
- criadoEm: date
- userId: ObjectId, obrigatorio

### Utilizadores

```json
{ "_id": "...", "nome": "Ana", "email": "ana@escola.pt", "role": "user" }
```

Campos:

- nome: string, obrigatorio
- email: string, obrigatorio, unique
- role: string, default user

## Relacoes

- Tarefa pertence a utilizador (userId)

## Indices e constraints

- email: unique
- criadoEm: index

## Validacoes

- titulo: min 3, max 100
- email: formato valido

## Notas

- Decidir entre delete fisico ou soft delete
