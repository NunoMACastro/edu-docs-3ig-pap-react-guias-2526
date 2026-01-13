# Node.js (12.º Ano) - 12 · Configuração e 12‑Factor

> **Objetivo deste ficheiro**
> Usar variáveis de ambiente de forma correta.
> Criar um módulo `config` centralizado.
> Entender o básico do modelo 12‑Factor.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] .env e process.env](#sec-1)
-   [2. [ESSENCIAL] Módulo de config](#sec-2)
-   [3. [EXTRA] Boas práticas 12‑Factor](#sec-3)
-   [Exercícios - Configuração](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria `.env` e o módulo `config` primeiro.
-   **Como estudar:** muda valores e confirma no `console.log`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] .env e process.env

### Exemplo (.env)

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=false
```

### Exemplo (usar no código)

```js
const PORT = Number(process.env.PORT || 3000);
```

### Checkpoint

-   Porque é que `process.env` devolve strings?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Módulo de config

```js
// src/utils/config.js
function reqEnv(name, def = undefined) {
    const v = process.env[name] ?? def;
    if (v === undefined) throw new Error(`Falta variável de ambiente: ${name}`);
    return v;
}

export const config = Object.freeze({
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    corsCredentials: process.env.CORS_CREDENTIALS === "true",
});
```

### Checkpoint

-   Onde centralizas as variáveis do projeto?

<a id="sec-3"></a>

## 3. [EXTRA] Boas práticas 12‑Factor

-   Nada de segredos hardcoded.
-   Config por ambiente (`.env` ou variáveis do serviço).
-   Logs como streams (evitar `console.log` espalhado).

### Checkpoint

-   Porque é que `.env` facilita trabalho em equipa?

<a id="exercicios"></a>

## Exercícios - Configuração

1. Adiciona `API_BASE_URL` ao `.env`.
2. Expõe `apiBaseUrl` no módulo `config`.
3. Usa `config.apiBaseUrl` num service.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre `.env` e 12‑Factor.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
