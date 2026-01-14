# Fullstack (12.º Ano) - 03 · Setup e correr os 3 juntos

> **Objetivo deste ficheiro**
> Ligar frontend, backend e MongoDB Atlas.
> Definir variáveis de ambiente essenciais.
> Saber correr os três serviços em simultâneo.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Portas e URLs](#sec-1)
-   [2. [ESSENCIAL] Variáveis de ambiente](#sec-2)
-   [3. [ESSENCIAL] Correr frontend e backend](#sec-3)
-   [4. [EXTRA] Cookies e credentials (auth)](#sec-4)
-   [5. [EXTRA] Proxy no Vite (opcional)](#sec-5)
-   [Exercícios - Setup fullstack](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** primeiro liga o backend ao Mongo, depois o React.
-   **Como estudar:** abre dois terminais e confirma a resposta do backend.
-   **Ligações úteis:**
    -   React: `../React/11_consumo_api_e_backend_node.md`
    -   Node: `../Node/04_express_basico.md`
    -   MongoDB: `../MongoDB/01_introducao_e_setup_atlas.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Portas e URLs

-   **Frontend (Vite):** `http://localhost:5173`
-   **Backend (Express):** `http://localhost:3000`

### Checkpoint

-   Porque é que 5173 e 3000 são origens diferentes?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Variáveis de ambiente

### Backend (.env)

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/escola
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_BASE=http://localhost:3000
```

> **Nota:** variáveis do frontend não guardam segredos.

### Checkpoint

-   Que variável aponta para o Atlas?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Correr frontend e backend

### Terminal 1 (backend)

```bash
npm run dev
```

### Terminal 2 (frontend)

```bash
npm run dev
```

### Teste rápido

-   Abre `http://localhost:3000/api/tarefas` no browser.
-   Confirma JSON (mesmo vazio).

### Erros comuns

-   Esquecer o `.env` do backend.
-   CORS bloqueado por `CORS_ORIGIN` errado.

### Checkpoint

-   Em que terminal corre o backend?

<a id="sec-4"></a>

## 4. [EXTRA] Cookies e credentials (auth)

Se estiveres a usar cookies httpOnly para auth, tens de ativar **credentials** dos dois lados.

### Backend (Express)

```js
import cors from "cors";

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
```

### Frontend (fetch)

```js
await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, {
    credentials: "include",
});
```

### Frontend (axios)

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
});
```

> **Nota:** quando usas cookies, lembra-te de SameSite e do risco de CSRF.

<a id="sec-5"></a>

## 5. [EXTRA] Proxy no Vite (opcional)

Se preferires, podes usar proxy em dev, evitando CORS e o `VITE_API_BASE`.

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
});
```

<a id="exercicios"></a>

## Exercícios - Setup fullstack

1. **Backend ligado ao Atlas**
   Passos:
   - Configura `MONGODB_URI` no `.env`.
   - Arranca o backend e confirma ligação.
   Critério de aceitação:
   - O servidor arranca sem erros de ligação.
   Dica de debugging:
   - Vê o log de ligação e a mensagem de erro do Mongo.

2. **GET /api/tarefas no browser**
   Passos:
   - Faz `GET /api/tarefas` diretamente no browser.
   - Confirma o JSON com envelope.
   Critério de aceitação:
   - Recebes `{ items, page, limit, total }`.
   Dica de debugging:
   - Abre DevTools → Network e confirma status + body.

3. **React ligado ao backend**
   Passos:
   - Configura `VITE_API_BASE`.
   - Faz fetch no React e mostra a lista.
   Critério de aceitação:
   - A lista aparece sem erros de CORS.
   Dica de debugging:
   - Verifica `CORS_ORIGIN` e a origem do frontend.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com setup fullstack.
-   2026-01-14: cookies/credentials, proxy e exercícios guiados.
