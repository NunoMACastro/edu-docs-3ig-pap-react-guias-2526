# Deploy e Operacao

## Ambientes

```text
Dev
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Prod
- Frontend: https://app.exemplo.pt
- Backend: https://api.exemplo.pt
```

## Variaveis de ambiente

```text
PORT=3000
MONGODB_URI=...
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=...
```

## Build e run

```bash
npm run build
npm run start
```

## Logs e monitorizacao

- Logs: [LOCAL_LOGS]
- Health check: GET /health
- Alertas: [SISTEMA_ALERTAS]

## Backup e restore

```bash
mongodump --uri "$MONGODB_URI" --out ./backups/AAAA-MM-DD
mongorestore --uri "$MONGODB_URI" ./backups/AAAA-MM-DD
```

- Frequencia: [DIARIO | SEMANAL]
- Local: [LOCAL_BACKUP]

## Responsaveis

- Operacao: [CONTACTO]
- Incidentes: [CONTACTO]
