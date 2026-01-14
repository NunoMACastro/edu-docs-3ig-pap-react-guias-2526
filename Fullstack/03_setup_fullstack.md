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
-   [4. [EXTRA] Proxy no Vite (opcional)](#sec-4)
-   [Exercícios - Setup fullstack](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** primeiro liga o backend ao Mongo, depois o React.
-   **Como estudar:** abre dois terminais e confirma a resposta do backend.
-   **Ligações úteis:**
    -   React: `../React/11_consumo_api_e_backend_node.md`
    -   Node: `../Node/06_express_basico.md`
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

## 4. [EXTRA] Proxy no Vite (opcional)

Se preferires, podes usar proxy e evitar o `VITE_API_BASE`.

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

1. Liga o backend ao Atlas e confirma que arranca sem erros.
2. Faz `GET /api/tarefas` e confirma JSON no browser.
3. Liga o React e mostra a lista no ecrã.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com setup fullstack.
