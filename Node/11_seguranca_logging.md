# Node.js (12.º Ano) - 11 · Segurança, logging e compressão

> **Objetivo deste ficheiro**
> Aplicar proteções básicas numa API Express.
> Configurar logging simples e estruturado.
> Entender porquê estas práticas são importantes.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] CORS, Helmet e rate-limit](#sec-1)
-   [2. [ESSENCIAL] Logging e compressão](#sec-2)
-   [3. [EXTRA] Autenticação (nota rápida)](#sec-3)
-   [Exercícios - Segurança](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** configura CORS, Helmet, rate‑limit e logging.
-   **Como estudar:** aplica no teu `app.js` e testa um endpoint.

<a id="sec-1"></a>

## 1. [ESSENCIAL] CORS, Helmet e rate‑limit

### Modelo mental

-   **CORS** controla quem pode chamar a API.
-   **Helmet** adiciona headers de segurança.
-   **Rate-limit** evita abuso.

### Exemplo (copiar para `src/app.js`)

```js
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(
    ","
);

app.use(helmet());
app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
    })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
```

### Checkpoint

-   Porque é que `origin="*"` não funciona com `credentials: true`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Logging e compressão

### Modelo mental

-   **morgan** é simples e rápido para aulas.
-   **pino** gera logs estruturados (JSON).
-   **compression** reduz tamanho das respostas.

### Exemplo (pino)

```js
import pino from "pino";
import pinoHttp from "pino-http";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
app.use(pinoHttp({ logger }));
```

### Checkpoint

-   Qual é a vantagem de logs estruturados?

<a id="sec-3"></a>

## 3. [EXTRA] Autenticação (nota rápida)

-   Nunca guardes passwords em claro.
-   Usa `bcryptjs` ou `argon2`.
-   Tokens devem expirar e, idealmente, usar refresh tokens.

<a id="exercicios"></a>

## Exercícios - Segurança

1. Configura CORS com origem `http://localhost:5173`.
2. Liga `helmet` e confirma que os headers aparecem na resposta.
3. Adiciona `rateLimit` com máximo de 20 pedidos por minuto.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre CORS, Helmet, logging e compressão.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
