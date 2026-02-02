# Tutorial passo a passo — Pokédex v4 (Ficha 06)

## MongoDB Atlas + Auth (cookies) + Axios + Paginação + Upload (12.º ano)

Este tutorial **começa exatamente onde termina a Ficha 5**.

A Ficha 5 tinha:

- Frontend React + Vite com Router
- Backend Express com favoritos em memória

Nesta Ficha 6, vais evoluir a app com:

- MongoDB Atlas (persistência dos dados)
- Autenticação com JWT em cookies HttpOnly
- Axios central com CSRF automático
- Paginação server-side
- Upload de avatar

Estes conceitos estão explicados na documentação fornecida juntamente com a Ficha 6.  
No entanto, **antes de começarmos a implementar**, vamos rever cada conceito com definições claras.

---

# 0) Antes de começares (muito importante)

## 0.1) O que **não muda** (vem da Ficha 5)

Tu já tens:

- Frontend React + Vite com Router (`/`, `/pokemon/:id`, `/favoritos`, `*`)
- Consumo da PokéAPI (lista/detalhe/pesquisa/filtros)
- Context API para estado global (pokemon, loading/erro, favoritos)
- Backend Express com rotas para favoritos (mas ainda em **memória**)

Nesta ficha, **não vais recriar a app**: vais **refatorar** e **expandir** o que já tens.

(Refatorar = “mudar o código para ficar melhor, sem mudar o que ele faz”.)

---

## 0.2) O que vai mudar (objetivos desta ficha)

Vamos acrescentar 6 blocos grandes:

1. **MongoDB Atlas (persistência)**
    - O backend liga a uma base de dados real (Atlas)
    - Favoritos deixam de ser “array em memória” e passam a ser persistentes

2. **Autenticação (register/login/logout)**
    - JWT guardado num **cookie HttpOnly**
    - Endpoint `GET /api/auth/me` para a SPA “restaurar sessão” após refresh

3. **CSRF mínimo (para cookies)**
    - Cookie `csrfToken` (não HttpOnly) + header `X-CSRF-Token` em requests mutáveis
    - Serve para perceberes o problema real do CSRF em SPAs com cookies

4. **Axios**
    - Deixas de ter `fetch` espalhado pela app
    - Cria-se um `apiClient` central com `baseURL` + `withCredentials` + CSRF header automático

5. **Paginação + pesquisa (server-side)**
    - Criar recurso **Equipas (Teams)** por utilizador
    - Listar equipas com `?page=1&limit=10&q=...`

6. **Upload**
    - Upload de avatar no perfil e servir como ficheiro estático (`/uploads/...`)

> Se sentires que não há tempo, o “core obrigatório” é:  
> **Auth + Mongo + Axios + Favoritos persistentes + Equipas paginadas**  
> Upload e testes podem ficar como extra.

---

## 0.3) Regras desta ficha (para não partir o projeto)

1. **Cria um commit de “base” antes de mexer**

```bash
git status
git add -A
git commit -m "Ficha 5: estado final (base para Ficha 6)"
```

2. **Trabalha numa branch** (ou com uma cópia do projeto)

```bash
git checkout -b ficha-06
```

3. **Faz checkpoints**  
   Depois de cada “Paragem” (A, B, C…), faz commit. Se algo correr mal, voltas atrás.

---

## 0.4) Paragens (checkpoints)

- **Paragem A** — Confirmar que Ficha 5 corre (frontend+backend)
- **Paragem B** — Migrar páginas para `src/pages/` (checkpoint de compatibilidade)
- **Paragem C** — Backend liga ao Atlas + `GET /api/health` OK
- **Paragem D** — Register/Login/Me com cookies OK
- **Paragem E** — Favoritos por utilizador em MongoDB OK
- **Paragem F** — Axios no frontend (com cookies + CSRF) OK
- **Paragem G** — Equipas paginadas + pesquisa OK
- **Paragem H** — Upload de avatar OK (extra)
- **Paragem I** — Tooling/testes (extra)

---

# 1) Conceitos essenciais (definições antes de usar)

> Objetivo desta secção: quando mais tarde aparecer “JWT”, “CSRF”, “paginação”, etc., tu já sabes exatamente o que é e **para que serve**.

## 1.1) Variáveis de ambiente e ficheiros `.env`

**Variáveis de ambiente** são valores “de configuração” que mudam de computador para computador (ou de dev para produção), por exemplo:

- porta do servidor (`PORT`)
- URL do frontend (`CLIENT_ORIGIN`)
- connection string do MongoDB (`MONGODB_URI`)
- segredos (`JWT_SECRET`)

O ficheiro `.env` é só uma forma prática de definir estas variáveis em desenvolvimento.

**Regra de ouro:** `.env` **não vai para o Git** (tem segredos).  
O que vai para o Git é um `.env.example` com valores de exemplo.

---

## 1.2) MongoDB Atlas e “connection string”

**MongoDB Atlas** é a versão “cloud” do MongoDB (base de dados alojada online).

A **connection string** é o “endereço + credenciais” para o backend se ligar à base de dados:

- cluster/host
- username/password
- base de dados
- opções (retryWrites, etc.)

No nosso projeto, esta string vive no `.env` como `MONGODB_URI`.

---

## 1.3) Mongoose (ODM)

O **Mongoose** é uma biblioteca que ajuda o Node.js a trabalhar com MongoDB.

Ele dá-te:

- **Schemas**: descrevem como é um documento (campos, tipos, validações)
- **Models**: permitem criar, ler, atualizar e apagar (CRUD) com métodos simples
- validação e transformação (`toJSON`, `timestamps`, etc.)

---

## 1.4) Hash de passwords (bcrypt)

Nunca guardamos passwords em texto simples.

Em vez disso:

1. fazemos **hash** da password (com `bcrypt`)
2. guardamos o hash na base de dados
3. no login, comparamos “password do utilizador” vs “hash guardado”

Isto protege os utilizadores caso a base de dados seja roubada.

---

## 1.5) JWT (JSON Web Token)

Um **JWT** é um “token assinado” que representa uma sessão/autenticação.

- “Assinado” significa que o servidor consegue verificar se foi ele que o criou.
- Normalmente guarda um identificador (`userId`) e uma data de expiração.

Neste projeto:

- o backend cria o JWT no login/registo
- o frontend **não guarda** o token manualmente
- o token vai num cookie

---

## 1.6) Cookies HttpOnly

Um **cookie HttpOnly**:

- é guardado pelo browser
- é enviado automaticamente em pedidos para o backend
- **não pode ser lido por JavaScript** (logo é mais difícil roubar com XSS)

Por isso é mais seguro do que guardar tokens em `localStorage`.

---

## 1.7) CORS (Cross-Origin Resource Sharing)

O frontend (`http://localhost:5173`) e o backend (`http://localhost:3000`) são **origens diferentes**.

Sem CORS, o browser bloqueia pedidos por segurança.

No backend, configuramos CORS para:

- aceitar pedidos do frontend (`origin`)
- permitir cookies (`credentials: true`)

---

## 1.8) CSRF (Cross-Site Request Forgery)

Com cookies, o browser envia-os automaticamente.

**CSRF** é quando um site malicioso tenta “forçar” o teu browser a fazer um pedido ao nosso backend, aproveitando o facto de já estares autenticado.

Solução mínima (didática) nesta ficha:

- o backend cria um `csrfToken` num cookie **não HttpOnly**
- o frontend lê esse cookie e manda o valor num header `X-CSRF-Token`
- o backend só aceita POST/PUT/PATCH/DELETE se cookie e header coincidirem

Nota: isto é um “CSRF mínimo” para perceber o conceito. Em produção pode haver estratégias mais completas.

---

## 1.9) Axios e Interceptors

**Axios** é uma alternativa ao `fetch` para fazer pedidos HTTP.

Vantagens:

- `baseURL` central
- `withCredentials` para cookies
- interceptors (código que corre automaticamente antes de cada request)

Nesta ficha, usamos interceptor para:

- detetar requests mutáveis (POST/PUT/PATCH/DELETE)
- adicionar automaticamente o header CSRF

---

## 1.10) Paginação server-side

Paginação server-side significa que **o backend devolve só uma parte** dos dados de cada vez.

Parâmetros típicos:

- `page` (página atual)
- `limit` (quantos itens por página)
- `q` (pesquisa)

Resposta típica:

- `items`: itens desta página
- `page`, `limit`
- `total`: total de itens na BD

Isto é essencial quando tens muitos dados.

---

## 1.11) Upload (multipart/form-data) e ficheiros estáticos

Quando envias ficheiros (imagens), não usas JSON: usas **multipart/form-data**.

No backend usamos `multer` para:

- receber o ficheiro
- guardar em disco (`uploads/`)
- devolver um URL para o frontend (`/uploads/nome-do-ficheiro.png`)

Depois o backend serve essa pasta como “ficheiros estáticos”.

---

# 2) Estrutura final esperada (ver antes de implementar)

> Isto é para tu teres uma “bússola”: sabes para onde estás a ir e evitas criar ficheiros repetidos ou espalhados.

## 2.1) Backend (estrutura final)

```txt
backend/
  .env                  (local, não vai para Git)
  .env.example          (exemplo, vai para Git)
  src/
    db/
      connect.js
    models/
      User.js
      Team.js
    middlewares/
      requireAuth.js
      requireCsrf.js
    routes/
      auth.routes.js
      favorites.routes.js
      teams.routes.js
      users.routes.js
    utils/
      cookies.js
      csrf.js
    app.js
    server.js
  uploads/              (fica no disco; em dev vai no gitignore)
  package.json
```

## 2.2) Frontend (estrutura final)

```txt
frontend/
  .env
  .env.example
  src/
    components/
      ProtectedRoute.jsx
    context/
      PokedexContext.jsx
    pages/
      LoginPage.jsx
      RegisterPage.jsx
      ProfilePage.jsx
      TeamsPage.jsx
      FavoritesPage.jsx
    services/
      apiClient.js
      authApi.js
      favoritesApi.js
      teamsApi.js
      usersApi.js
    App.jsx
    main.jsx
  package.json
```

## 2.3) Estrutura alvo (depois do patch da Ficha 6)

Isto é **onde cada coisa vai ficar** (com foco nos ficheiros novos):

```txt
pokedex-v3/
  backend/
    .env                (novo, NÃO vai para git)
    .env.example        (novo, vai para git)
    uploads/            (novo, opcional - upload de avatar)
    src/
      db/
        connect.js      (novo)
      models/
        User.js         (novo)
        Team.js         (novo)
      middlewares/
        requireAuth.js  (novo)
        requireCsrf.js  (novo)
      utils/
        cookies.js      (novo)
        csrf.js         (novo)
      routes/
        auth.routes.js      (novo)
        favorites.routes.js (ALTERAR - passa a Mongo+Auth, mas contrato igual à Ficha 5)
        teams.routes.js     (novo)
        users.routes.js     (novo, opcional - upload)
      app.js            (ALTERAR)
      server.js         (ALTERAR)
  frontend/
    .env                (novo, NÃO vai para git)
    src/
      services/
        apiClient.js     (novo)
        favoritesApi.js  (ALTERAR - passa a axios, mesma assinatura)
        authApi.js       (novo)
        teamsApi.js      (novo)
        usersApi.js      (novo, opcional)
      context/
        PokedexContext.jsx (ALTERAR - boot auth + favoritos por user)
      components/
        Layout.jsx
        ProtectedRoute.jsx (novo)
        ... (componentes pequenos)
      pages/
        PokemonListPage.jsx     (já migrado na Paragem B)
        PokemonDetailsPage.jsx  (já migrado)
        FavoritesPage.jsx       (já migrado)
        NotFound.jsx            (já migrado)
        LoginPage.jsx           (novo)
        RegisterPage.jsx        (novo)
        ProfilePage.jsx         (novo)
        TeamsPage.jsx           (novo)
      App.jsx              (ALTERAR - novas rotas + protected routes)
```

---

# 3) Paragem A — confirma que a Ficha 5 está mesmo estável

## 3.1) Backend

```bash
cd backend
npm install
node src/server.js
```

Confirma no browser:

- `http://localhost:3000/api/favorites` devolve JSON (do sistema “em memória”)

## 3.2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Confirma:

- consegues navegar
- consegues marcar favoritos
- refresh mantém favoritos **enquanto o backend estiver ligado**

Se isto falhar: não avances. Corrige já aqui.

## 3.3) Paragem B — migrar páginas para `src/pages/` (OBRIGATÓRIA)

### 3.3.1) Criar pasta `pages/`

Cria:

```txt
frontend/src/pages/
```

### 3.3.2) Mover (cut/paste) apenas as “pages” (as usadas nas rotas)

Move estes ficheiros **de** `frontend/src/components/` **para** `frontend/src/pages/`:

- `PokemonListPage.jsx`
- `PokemonDetailsPage.jsx`
- `FavoritesPage.jsx`
- `NotFound.jsx`

Ou seja, no fim ficas com:

```txt
frontend/src/
  components/
    Layout.jsx
    ... (componentes “pequenos”)
  pages/
    PokemonListPage.jsx
    PokemonDetailsPage.jsx
    FavoritesPage.jsx
    NotFound.jsx
```

### 3.3.3) Atualizar imports no `frontend/src/App.jsx`

No `App.jsx`, atualiza os imports destas 4 páginas para apontarem para `pages/`:

- Antes (exemplo típico):
    - `import PokemonListPage from "@/components/PokemonListPage.jsx";`
- Depois:
    - `import PokemonListPage from "@/pages/PokemonListPage.jsx";`

**Dica rápida:** faz “Find All References” (VS Code) e substitui onde for preciso.

### 3.3.4) Garantir que os imports dentro das páginas não quebram

Quando mudas uma página de pasta, **imports relativos** podem partir.

- Se tens imports do tipo `./PokemonCard.jsx` dentro de uma page, isso pode falhar depois de mover.
- O ideal é usares o alias `@/` (se já o tens no projeto).

Exemplos:

- Antes (relativo): `import PokemonCard from "./PokemonCard.jsx";`
- Depois (alias): `import PokemonCard from "@/components/PokemonCard.jsx";`

### 3.3.5) Checkpoint (commit)

```bash
git add -A
git commit -m "Paragem B: migrar pages de components para pages"
```

---

# 4) Configuração (.env) — Sim, faz sentido e é o correto

## 4.1) Backend — criar `.env` e `.env.example`

Cria `backend/.env` (não vai para o Git):

```bash
PORT=3000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/pokedex_v4?retryWrites=true&w=majority

JWT_SECRET=uma_chave_grande_e_dificil_de_adivinhar
JWT_EXPIRES_IN=7d

COOKIE_SECURE=false
```

Cria `backend/.env.example` (vai para o Git, sem segredos reais):

```bash
PORT=3000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/pokedex_v4?retryWrites=true&w=majority

JWT_SECRET=CHANGE_ME
JWT_EXPIRES_IN=7d

COOKIE_SECURE=false
```

### Atualiza `.gitignore` do backend

Confirma que tens algo assim em `backend/.gitignore`:

```gitignore
.env
uploads/
```

> Nota: em produção, `COOKIE_SECURE=true` e tens de usar HTTPS, senão cookies `secure` não funcionam.

---

## 4.2) Frontend — `.env` e `.env.example`

Cria `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Cria `frontend/.env.example`:

```bash
VITE_API_URL=http://localhost:3000
```

---

## 4.3) Patch de Compatibilidade

### 4.3.1) Migração controlada + MongoDB Atlas + Auth + Axios (sem “recomeçar” o projeto)

Nesta ficha, vamos fazer uma **migração controlada** do que já tens (Ficha 5) para o que vais precisar (Ficha 6).
Profissionalmente, separamos os componentes em React consoante a sua função (páginas, componentes pequenos, etc.).

Na ficha anterior, todas as páginas estavam em `src/components/`, o que não é ideal.
Nesta ficha, vamos mover as páginas para `src/pages/` (Paragem B), para depois poderes criar novas páginas (Login, Register, Profile, Teams) sem confusão.

Para fazer esta migração precisamos de:

1. Criar a pasta `src/pages/`
2. Mover as páginas existentes para lá
3. Atualizar os imports no `App.jsx`
4. Garantir que os imports dentro das páginas não quebram
5. Fazer commit (checkpoint)

### 4.3.2) Ponto de partida (estrutura da Ficha 5)

A Ficha 5 termina com esta estrutura base:

```txt
pokedex-v3/
  backend/
    src/
      server.js
      app.js
      routes/
        favorites.routes.js
      data/
        favorites.memory.js
    package.json
  frontend/
    src/
      context/
        PokedexContext.jsx
      services/
        favoritesApi.js
      components/
        Layout.jsx
        PokemonListPage.jsx
        PokemonDetailsPage.jsx
        FavoritesPage.jsx
        NotFound.jsx
        ...
      App.jsx
      main.jsx
    package.json
    vite.config.js
```

---

# 5) BACKEND — Mongo + Auth + CSRF + Favoritos + Teams + Upload

> Regra de ouro: primeiro garantimos o backend sólido, depois ligamos o frontend com Axios.

---

## 5.0) Patch de Compatibilidade (backend: mapa rápido)

### 5.0.1) Criar `backend/.env` e `backend/.env.example`

**Caminhos:**

- `backend/.env` (local, não versionar)
- `backend/.env.example` (exemplo para o repo)

Conteúdo sugerido:

```bash
PORT=3000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/pokedex_v4?retryWrites=true&w=majority

JWT_SECRET=uma_chave_grande_e_dificil_de_adivinhar
JWT_EXPIRES_IN=7d

COOKIE_SECURE=false
```

E no `.gitignore` do backend, adiciona:

- `.env`
- `uploads/`

### 5.0.2) Criar `backend/src/db/connect.js`

**Caminho:** `backend/src/db/connect.js`

```js
/**
 * @file connect.js
 * @description Liga o backend ao MongoDB via Mongoose.
 */

import mongoose from "mongoose";

/**
 * Liga ao MongoDB Atlas.
 *
 * @param {string} mongoUri - Connection string do MongoDB (Atlas).
 * @returns {Promise<void>}
 */
export async function connectToMongo(mongoUri) {
    if (!mongoUri) {
        throw new Error("MONGODB_URI em falta no .env");
    }

    await mongoose.connect(mongoUri);
    console.log("[mongo] Ligação estabelecida com sucesso");
}
```

### 5.0.3) Alterar `backend/src/server.js`

**Caminho:** `backend/src/server.js`

Objetivo: ler `.env`, ligar ao Mongo e só depois arrancar o servidor.

**Substitui o conteúdo do ficheiro por:**

```js
/**
 * @file server.js
 * @description Entry point do backend.
 * Ordem correta:
 * 1) Ler variáveis ambiente (.env)
 * 2) Ligar ao MongoDB
 * 3) Só depois arrancar o Express
 */

import "dotenv/config";
import app from "./app.js";
import { connectToMongo } from "./db/connect.js";

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

async function start() {
    await connectToMongo(process.env.MONGODB_URI);

    app.listen(PORT, () => {
        console.log(`[api] Backend a correr em http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("[api] Falha ao arrancar:", err);
    process.exit(1);
});
```

### 5.0.4) Criar modelos

#### 5.0.4.1) `backend/src/models/User.js`

**Caminho:** `backend/src/models/User.js`

```js
/**
 * @file User.js
 * @description Modelo User (com favoritos dentro do user).
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: { type: String, required: true },
        displayName: { type: String, required: true, trim: true },
        avatarUrl: { type: String, default: "" },
        favorites: { type: [Number], default: [] },
    },
    { timestamps: true },
);

userSchema.set("toJSON", {
    transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
    },
});

export const User = mongoose.model("User", userSchema);
```

#### 5.0.4.2) `backend/src/models/Team.js`

**Caminho:** `backend/src/models/Team.js`

```js
/**
 * @file Team.js
 * @description Modelo Team (equipas do utilizador).
 */

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: "User",
        },
        name: { type: String, required: true, trim: true },
        pokemonIds: {
            type: [Number],
            default: [],
            validate: {
                validator(value) {
                    return Array.isArray(value) && value.length <= 6;
                },
                message: "Uma equipa pode ter no máximo 6 Pokémon",
            },
        },
    },
    { timestamps: true },
);

export const Team = mongoose.model("Team", teamSchema);
```

### 5.0.5) Criar utils + middlewares

#### 5.0.5.1) `backend/src/utils/cookies.js`

**Caminho:** `backend/src/utils/cookies.js`

```js
/**
 * @file cookies.js
 * @description Opções de cookies (dev vs prod).
 */

function isSecureCookie() {
    return process.env.COOKIE_SECURE === "true";
}

/**
 * Cookie de autenticação: HttpOnly.
 *
 * @returns {import("express").CookieOptions}
 */
export function authCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: isSecureCookie(),
        path: "/",
    };
}

/**
 * Cookie CSRF: não HttpOnly (frontend precisa ler).
 *
 * @returns {import("express").CookieOptions}
 */
export function csrfCookieOptions() {
    return {
        httpOnly: false,
        sameSite: "lax",
        secure: isSecureCookie(),
        path: "/",
    };
}
```

#### 5.0.5.2) `backend/src/utils/csrf.js`

**Caminho:** `backend/src/utils/csrf.js`

```js
/**
 * @file csrf.js
 * @description Gera tokens CSRF simples.
 */

import crypto from "crypto";

/** @returns {string} */
export function createCsrfToken() {
    return crypto.randomBytes(24).toString("hex");
}
```

#### 5.0.5.3) `backend/src/middlewares/requireCsrf.js`

**Caminho:** `backend/src/middlewares/requireCsrf.js`

```js
/**
 * @file requireCsrf.js
 * @description CSRF mínimo para pedidos mutáveis.
 *
 * Regra:
 * - POST/PUT/PATCH/DELETE exigem:
 *   - cookie csrfToken
 *   - header x-csrf-token
 *   - e ambos iguais
 *
 * Importante:
 * - NÃO aplicamos CSRF a /api/auth/login e /api/auth/register,
 *   porque o utilizador ainda não tem csrfToken definido.
 */

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function requireCsrf(req, res, next) {
    if (!MUTATING.has(req.method)) return next();

    const url = req.originalUrl ?? "";
    const isAuthLoginOrRegister =
        req.method === "POST" &&
        (url.startsWith("/api/auth/login") ||
            url.startsWith("/api/auth/register"));

    if (isAuthLoginOrRegister) return next();

    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res
            .status(403)
            .json({ error: "CSRF token em falta ou inválido" });
    }

    return next();
}
```

#### 5.0.5.4) `backend/src/middlewares/requireAuth.js`

**Caminho:** `backend/src/middlewares/requireAuth.js`

```js
/**
 * @file requireAuth.js
 * @description Protege endpoints: exige cookie JWT válido.
 */

import jwt from "jsonwebtoken";

/**
 * @param {import("express").Request & { user?: { userId: string } }} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Não autenticado" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        return next();
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}
```

### 5.0.6) Criar rotas novas (e dizer onde as ligar)

#### 5.0.6.1) `backend/src/routes/auth.routes.js`

**Caminho:** `backend/src/routes/auth.routes.js`

```js
/**
 * @file auth.routes.js
 * @description Autenticação:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 *
 * Segurança:
 * - bcrypt para passwordHash
 * - JWT em cookie HttpOnly
 * - rate limiting no login (evita brute force “fácil”)
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { User } from "../models/User.js";
import { authCookieOptions, csrfCookieOptions } from "../utils/cookies.js";
import { createCsrfToken } from "../utils/csrf.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
});

/**
 * Assina um JWT.
 *
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
    if (!process.env.JWT_SECRET) {
        // Fail fast: sem secret não há JWT seguro.
        throw new Error("JWT_SECRET em falta no .env");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    });
}

/**
 * Validação mínima de email.
 * (Em produção usarias validação mais completa.)
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return (
        typeof email === "string" && email.includes("@") && email.includes(".")
    );
}

router.post("/register", async (req, res) => {
    const { email, password, displayName } = req.body ?? {};

    if (!isValidEmail(email) || !password || !displayName) {
        return res
            .status(422)
            .json({ error: "email, password e displayName são obrigatórios" });
    }

    if (String(password).length < 8) {
        return res
            .status(422)
            .json({ error: "password deve ter pelo menos 8 chars" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email já registado" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
        email,
        passwordHash,
        displayName,
    });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(201).json({ user: user.toJSON() });
});

router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!isValidEmail(email) || !password) {
        return res
            .status(422)
            .json({ error: "email e password são obrigatórios" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.json({ user: user.toJSON() });
});

/**
 * Logout.
 * Nota pedagógica:
 * - CSRF no logout é opcional (CSRF logout é “nuisance”).
 * - Se quiseres, podes exigir CSRF aqui também.
 */
router.post("/logout", (_req, res) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });
    return res.status(204).send();
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    return res.json({ user: user.toJSON() });
});

export default router;
```

#### 5.0.6.2) `backend/src/routes/teams.routes.js`

**Caminho:** `backend/src/routes/teams.routes.js`

```js
/**
 * @file teams.routes.js
 * @description Equipas do utilizador autenticado.
 *
 * Treina:
 * - GET com paginação e pesquisa
 * - POST para criar
 * - DELETE com ownership
 */

import express from "express";
import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

/**
 * Lê e valida query params de listagem.
 *
 * @param {import("express").Request} req
 * @returns {{ page: number, limit: number, q: string }}
 */
function readListQuery(req) {
    const page = Math.max(1, Number.parseInt(req.query.page ?? "1", 10) || 1);
    const limit = Math.max(
        1,
        Number.parseInt(req.query.limit ?? "10", 10) || 10,
    );
    const q = String(req.query.q ?? "").trim();
    return { page, limit, q };
}

/**
 * Normaliza lista de IDs de Pokémon.
 *
 * @param {unknown} value
 * @returns {number[]}
 */
function normalizePokemonIds(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((n) => Number.parseInt(n, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
}

router.get("/", requireAuth, async (req, res) => {
    const { page, limit, q } = readListQuery(req);

    const filter = {
        userId: req.user.userId,
        ...(q ? { name: { $regex: q, $options: "i" } } : {}),
    };

    const total = await Team.countDocuments(filter);

    const items = await Team.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.json({ items, page, limit, total });
});

router.post("/", requireAuth, async (req, res) => {
    const { name, pokemonIds } = req.body ?? {};

    if (!name || String(name).trim().length < 2) {
        return res
            .status(422)
            .json({ error: "name é obrigatório (mínimo 2 chars)" });
    }

    const safeIds = normalizePokemonIds(pokemonIds);

    if (safeIds.length > 6) {
        return res.status(422).json({ error: "Máximo 6 Pokémon por equipa" });
    }

    const team = await Team.create({
        userId: req.user.userId,
        name: String(name).trim(),
        pokemonIds: safeIds,
    });

    return res.status(201).json({ team });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const id = req.params.id;

    // Evita CastError do Mongoose para IDs inválidos
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({ error: "id inválido" });
    }

    const deleted = await Team.findOneAndDelete({
        _id: id,
        userId: req.user.userId,
    });

    if (!deleted)
        return res.status(404).json({ error: "Equipa não encontrada" });

    return res.status(204).send();
});

export default router;
```

#### 5.0.6.3) `backend/src/routes/users.routes.js` (opcional upload)

**Caminho:** `backend/src/routes/users.routes.js`

```js
/**
 * @file users.routes.js
 * @description Perfil do utilizador (me) + upload de avatar.
 *
 * Upload:
 * - multipart/form-data
 * - campo "avatar"
 * - guardamos no disco (uploads/)
 * - guardamos o URL no User.avatarUrl
 */

import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { requireAuth } from "../middlewares/requireAuth.js";
import { User } from "../models/User.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads/ está na raiz do backend
const uploadDir = path.join(__dirname, "..", "..", "uploads");

/**
 * Storage do multer:
 * - destination: pasta uploads/
 * - filename: timestamp + nome "safe"
 */
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename(_req, file, cb) {
        // Segurança básica: remove espaços e reduz risco de path injection
        const safeName = file.originalname
            .replaceAll(" ", "_")
            .replaceAll("..", ".");
        cb(null, `${Date.now()}__${safeName}`);
    },
});

/**
 * Aceitar apenas imagens.
 *
 * @param {import("express").Request} _req
 * @param {Express.Multer.File} file
 * @param {(error: Error|null, acceptFile: boolean) => void} cb
 */
function imageFilter(_req, file, cb) {
    const ok = file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Só imagens"), ok);
}

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    return res.json({ user: user.toJSON() });
});

router.post(
    "/me/avatar",
    requireAuth,
    upload.single("avatar"),
    async (req, res) => {
        if (!req.file)
            return res.status(422).json({ error: "Ficheiro em falta" });

        const user = await User.findById(req.user.userId);
        if (!user)
            return res.status(404).json({ error: "Utilizador não encontrado" });

        user.avatarUrl = `/uploads/${req.file.filename}`;
        await user.save();

        return res.json({ user: user.toJSON() });
    },
);

export default router;
```

### 5.0.7) ALTERAR `backend/src/routes/favorites.routes.js` (patch compatível)

**Caminho:** `backend/src/routes/favorites.routes.js`

Objetivo:

- Passar para Mongo + por user autenticado
- **Sem mudar o contrato da Ficha 5**:
    - `GET` devolve array
    - `POST` devolve `{ id }`
    - `DELETE` devolve `{ id }`

Substitui o conteúdo por este patch:

```js
/**
 * @file favorites.routes.js
 * @description Favoritos por utilizador autenticado (Mongo),
 * mantendo o contrato da Ficha 5:
 * - GET /api/favorites -> number[]
 * - POST /api/favorites { id } -> { id }
 * - DELETE /api/favorites/:id -> { id }
 */

import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { User } from "../models/User.js";

const router = express.Router();

function parseId(value) {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}

router.get("/", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });
    return res.status(200).json(user.favorites);
});

router.post("/", requireAuth, async (req, res) => {
    const numericId = parseId(req.body?.id);
    if (!numericId)
        return res.status(422).json({ error: "Id obrigatorio e numerico" });

    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    if (user.favorites.includes(numericId)) {
        return res.status(409).json({ error: "Pokemon ja e favorito" });
    }

    user.favorites.push(numericId);
    await user.save();

    return res.status(201).json({ id: numericId });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const numericId = parseId(req.params.id);
    if (!numericId) return res.status(400).json({ error: "Id invalido" });

    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    if (!user.favorites.includes(numericId)) {
        return res.status(404).json({ error: "Favorito nao encontrado" });
    }

    user.favorites = user.favorites.filter((x) => x !== numericId);
    await user.save();

    return res.status(200).json({ id: numericId });
});

export default router;
```

### 5.0.8) ALTERAR `backend/src/app.js` (onde ligar tudo)

**Caminho:** `backend/src/app.js`

O teu `app.js` da Ficha 5 já tem:

- `cors(...)`
- `express.json()`
- `app.use("/api/favorites", ...)`

Na Ficha 6, altera para:

- `credentials: true` no CORS
- `cookie-parser`
- `requireCsrf` antes das rotas mutáveis
- novas rotas `/api/auth`, `/api/teams`, `/api/users`
- (opcional) `app.use("/uploads", express.static("uploads"))`

### Conteúdo completo recomendado (substitui o ficheiro todo)

```js
/**
 * @file app.js
 * @description Config do Express: middlewares + rotas.
 *
 * Ordem importante:
 * - cors com credentials
 * - json + cookieParser
 * - static (uploads)
 * - CSRF middleware
 * - routes
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requireCsrf } from "./middlewares/requireCsrf.js";

import authRoutes from "./routes/auth.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        credentials: true,
        allowedHeaders: ["Content-Type", "X-CSRF-Token"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
);

app.use(express.json());
app.use(cookieParser());

// Uploads públicos (dev):
app.use("/uploads", express.static("uploads"));

// CSRF mínimo (antes de routes que mudam dados):
app.use(requireCsrf);

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
```

---

## 5.1) Dependências novas (backend)

Em `backend/`:

```bash
npm install mongoose dotenv cookie-parser jsonwebtoken bcrypt
npm install multer
npm install express-rate-limit
npm install cors
```

Opcional (recomendado, para dev):

```bash
npm install -D nodemon
```

Se usares `nodemon`, sugere-se este script no `backend/package.json`:

```json
{
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js"
    }
}
```

---

## 5.2) MongoDB Atlas — criar cluster (resumo prático)

No MongoDB Atlas:

1. Criar cluster (free tier serve)
2. Criar Database User (username/password)
3. Network Access:
    - Em dev/sala: pode ser “Allow from anywhere (0.0.0.0/0)”
    - Em produção isto é má prática (tens de restringir IPs)

---

## 5.3) Ligar ao MongoDB antes de aceitar pedidos

### 5.3.1) Criar `src/db/connect.js`

Cria `backend/src/db/connect.js`:

```js
/**
 * @file connect.js
 * @description Liga o backend ao MongoDB via Mongoose.
 *
 * Ideia-chave:
 * - O servidor NÃO deve começar a aceitar pedidos sem a BD estar pronta.
 * - Se a BD falhar, é melhor falhar cedo (fail fast).
 */

import mongoose from "mongoose";

/**
 * Liga ao MongoDB Atlas.
 *
 * @param {string} mongoUri - Connection string do MongoDB (Atlas).
 * @returns {Promise<void>}
 * @throws {Error} Se a connection string estiver em falta ou se a ligação falhar.
 */
export async function connectToMongo(mongoUri) {
    if (!mongoUri) {
        throw new Error("MONGODB_URI em falta no .env");
    }

    await mongoose.connect(mongoUri);

    console.log("[mongo] Ligação estabelecida com sucesso");
}
```

---

## 5.4) Modelos (Mongoose): `User` e `Team`

### 5.4.1) Criar `src/models/User.js`

Cria `backend/src/models/User.js`:

```js
/**
 * @file User.js
 * @description Modelo User.
 *
 * Segurança:
 * - Guardamos password como hash (bcrypt) -> passwordHash
 * - Nunca enviamos passwordHash para o frontend (toJSON transform)
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        displayName: {
            type: String,
            required: true,
            trim: true,
        },

        avatarUrl: {
            type: String,
            default: "",
        },

        /**
         * Favoritos simples: IDs numéricos dos Pokémon.
         * Opção A (desta ficha): guardar dentro do User.
         */
        favorites: {
            type: [Number],
            default: [],
        },
    },
    { timestamps: true },
);

userSchema.set("toJSON", {
    transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
    },
});

export const User = mongoose.model("User", userSchema);
```

### 5.4.2) Criar `src/models/Team.js`

Cria `backend/src/models/Team.js`:

```js
/**
 * @file Team.js
 * @description Modelo Team (equipa de Pokémon).
 *
 * Regras:
 * - pertence a um utilizador (userId)
 * - tem um name
 * - tem no máximo 6 Pokémon (pokemonIds)
 */

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: "User",
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        pokemonIds: {
            type: [Number],
            default: [],
            validate: {
                validator(value) {
                    return Array.isArray(value) && value.length <= 6;
                },
                message: "Uma equipa pode ter no máximo 6 Pokémon",
            },
        },
    },
    { timestamps: true },
);

export const Team = mongoose.model("Team", teamSchema);
```

---

## 5.5) Utils: cookies e CSRF

### 5.5.1) Criar `src/utils/cookies.js`

Cria `backend/src/utils/cookies.js`:

```js
/**
 * @file cookies.js
 * @description Opções de cookies (dev vs prod).
 *
 * Nota:
 * - Em produção, normalmente: COOKIE_SECURE=true e HTTPS.
 * - sameSite "lax" é um equilíbrio bom para SPAs (protege alguma coisa sem partir UX).
 */

/**
 * Determina se o cookie deve ser secure (HTTPS).
 *
 * @returns {boolean}
 */
function isSecureCookie() {
    return process.env.COOKIE_SECURE === "true";
}

/**
 * Cookie de autenticação: HttpOnly (JS não consegue ler).
 *
 * @returns {import("express").CookieOptions}
 */
export function authCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: isSecureCookie(),
        path: "/",
        // maxAge é opcional; sem isto é "session cookie"
        // maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

/**
 * Cookie CSRF: não HttpOnly (frontend precisa ler).
 *
 * @returns {import("express").CookieOptions}
 */
export function csrfCookieOptions() {
    return {
        httpOnly: false,
        sameSite: "lax",
        secure: isSecureCookie(),
        path: "/",
        // maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}
```

### 5.5.2) Criar `src/utils/csrf.js`

Cria `backend/src/utils/csrf.js`:

```js
/**
 * @file csrf.js
 * @description Gera tokens CSRF simples.
 *
 * Aqui usamos crypto.randomBytes para obter um token imprevisível.
 * (Se fosse um token previsível, um atacante podia adivinhar.)
 */

import crypto from "crypto";

/**
 * Cria um token CSRF aleatório.
 *
 * @returns {string}
 */
export function createCsrfToken() {
    return crypto.randomBytes(24).toString("hex");
}
```

---

## 5.6) Middlewares: `requireCsrf` e `requireAuth`

### 5.6.1) Criar `src/middlewares/requireCsrf.js`

Cria `backend/src/middlewares/requireCsrf.js`:

```js
/**
 * @file requireCsrf.js
 * @description CSRF mínimo para pedidos mutáveis.
 *
 * Regra:
 * - POST/PUT/PATCH/DELETE exigem:
 *   - cookie csrfToken
 *   - header x-csrf-token
 *   - e ambos iguais
 *
 * Importante:
 * - NÃO aplicamos CSRF a /api/auth/login e /api/auth/register,
 *   porque o utilizador ainda não tem csrfToken definido.
 */

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function requireCsrf(req, res, next) {
    if (!MUTATING.has(req.method)) return next();

    const url = req.originalUrl ?? "";
    const isAuthLoginOrRegister =
        req.method === "POST" &&
        (url.startsWith("/api/auth/login") ||
            url.startsWith("/api/auth/register"));

    if (isAuthLoginOrRegister) return next();

    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res
            .status(403)
            .json({ error: "CSRF token em falta ou inválido" });
    }

    return next();
}
```

### 5.6.2) Criar `src/middlewares/requireAuth.js`

Cria `backend/src/middlewares/requireAuth.js`:

```js
/**
 * @file requireAuth.js
 * @description Protege endpoints: exige cookie JWT válido.
 *
 * Este middleware:
 * - lê o cookie "token"
 * - valida o JWT
 * - coloca req.user.userId para as rotas usarem
 */

import jwt from "jsonwebtoken";

/**
 * @param {import("express").Request & { user?: { userId: string } }} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Não autenticado" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        return next();
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}
```

---

## 5.7) Rotas de autenticação: register/login/logout/me

### 5.7.1) Contrato de API (auth)

**POST `/api/auth/register`**

Request JSON:

```json
{ "email": "a@a.com", "password": "12345678", "displayName": "Ana" }
```

Response (201):

```json
{
    "user": {
        "_id": "...",
        "email": "...",
        "displayName": "...",
        "favorites": [],
        "avatarUrl": ""
    }
}
```

**POST `/api/auth/login`**

Request JSON:

```json
{ "email": "a@a.com", "password": "12345678" }
```

Response (200) + cookies `token` e `csrfToken`.

**GET `/api/auth/me`**

Response (200):

```json
{
    "user": {
        "_id": "...",
        "email": "...",
        "displayName": "...",
        "favorites": [25, 1]
    }
}
```

Se não estiver autenticado: 401.

---

### 5.7.2) Criar `src/routes/auth.routes.js`

Cria `backend/src/routes/auth.routes.js`:

```js
/**
 * @file auth.routes.js
 * @description Autenticação:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 *
 * Segurança:
 * - bcrypt para passwordHash
 * - JWT em cookie HttpOnly
 * - rate limiting no login (evita brute force “fácil”)
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { User } from "../models/User.js";
import { authCookieOptions, csrfCookieOptions } from "../utils/cookies.js";
import { createCsrfToken } from "../utils/csrf.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
});

/**
 * Assina um JWT.
 *
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
    if (!process.env.JWT_SECRET) {
        // Fail fast: sem secret não há JWT seguro.
        throw new Error("JWT_SECRET em falta no .env");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    });
}

/**
 * Validação mínima de email.
 * (Em produção usarias validação mais completa.)
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return (
        typeof email === "string" && email.includes("@") && email.includes(".")
    );
}

router.post("/register", async (req, res) => {
    const { email, password, displayName } = req.body ?? {};

    if (!isValidEmail(email) || !password || !displayName) {
        return res
            .status(422)
            .json({ error: "email, password e displayName são obrigatórios" });
    }

    if (String(password).length < 8) {
        return res
            .status(422)
            .json({ error: "password deve ter pelo menos 8 chars" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email já registado" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
        email,
        passwordHash,
        displayName,
    });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(201).json({ user: user.toJSON() });
});

router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!isValidEmail(email) || !password) {
        return res
            .status(422)
            .json({ error: "email e password são obrigatórios" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.json({ user: user.toJSON() });
});

/**
 * Logout.
 * Nota pedagógica:
 * - CSRF no logout é opcional (CSRF logout é “nuisance”).
 * - Se quiseres, podes exigir CSRF aqui também.
 */
router.post("/logout", (_req, res) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });
    return res.status(204).send();
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    return res.json({ user: user.toJSON() });
});

export default router;
```

---

## 5.8) Favoritos persistentes (por utilizador)

### 5.8.1) Contrato de API (favorites)

- `GET /api/favorites` → `{ favorites: number[] }`
- `POST /api/favorites/:id` → `{ favorites: number[] }`
- `DELETE /api/favorites/:id` → `{ favorites: number[] }`

### 5.8.2) Criar `src/routes/favorites.routes.js`

Cria `backend/src/routes/favorites.routes.js`:

```js
/**
 * @file favorites.routes.js
 * @description Favoritos por utilizador autenticado.
 *
 * Mudança em relação à Ficha 5:
 * - antes era um array “global” em memória
 * - agora é por utilizador, guardado em MongoDB (User.favorites)
 */

import express from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

/**
 * Converte e valida um id de Pokémon.
 *
 * @param {string} idParam
 * @returns {number|null}
 */
function parsePokemonId(idParam) {
    const id = Number.parseInt(idParam, 10);
    return Number.isFinite(id) && id > 0 ? id : null;
}

router.get("/", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    return res.json({ favorites: user.favorites });
});

router.post("/:id", requireAuth, async (req, res) => {
    const pokemonId = parsePokemonId(req.params.id);
    if (!pokemonId) return res.status(422).json({ error: "id inválido" });

    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    if (!user.favorites.includes(pokemonId)) {
        user.favorites.push(pokemonId);
        await user.save();
    }

    return res.status(201).json({ favorites: user.favorites });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const pokemonId = parsePokemonId(req.params.id);
    if (!pokemonId) return res.status(422).json({ error: "id inválido" });

    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    user.favorites = user.favorites.filter((x) => x !== pokemonId);
    await user.save();

    return res.json({ favorites: user.favorites });
});

export default router;
```

---

## 5.9) Equipas (paginação + pesquisa)

### 5.9.1) Contrato de API (teams)

Request:

```
GET /api/teams?page=1&limit=5&q=elite
```

Response:

```json
{
    "items": [{ "_id": "...", "name": "...", "pokemonIds": [1, 4] }],
    "page": 1,
    "limit": 5,
    "total": 23
}
```

### 5.9.2) Criar `src/routes/teams.routes.js`

Cria `backend/src/routes/teams.routes.js`:

```js
/**
 * @file teams.routes.js
 * @description Equipas do utilizador autenticado.
 *
 * Treina:
 * - GET com paginação e pesquisa
 * - POST para criar
 * - DELETE com ownership
 */

import express from "express";
import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

/**
 * Lê e valida query params de listagem.
 *
 * @param {import("express").Request} req
 * @returns {{ page: number, limit: number, q: string }}
 */
function readListQuery(req) {
    const page = Math.max(1, Number.parseInt(req.query.page ?? "1", 10) || 1);
    const limit = Math.max(
        1,
        Number.parseInt(req.query.limit ?? "10", 10) || 10,
    );
    const q = String(req.query.q ?? "").trim();
    return { page, limit, q };
}

/**
 * Normaliza lista de IDs de Pokémon.
 *
 * @param {unknown} value
 * @returns {number[]}
 */
function normalizePokemonIds(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((n) => Number.parseInt(n, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
}

router.get("/", requireAuth, async (req, res) => {
    const { page, limit, q } = readListQuery(req);

    const filter = {
        userId: req.user.userId,
        ...(q ? { name: { $regex: q, $options: "i" } } : {}),
    };

    const total = await Team.countDocuments(filter);

    const items = await Team.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.json({ items, page, limit, total });
});

router.post("/", requireAuth, async (req, res) => {
    const { name, pokemonIds } = req.body ?? {};

    if (!name || String(name).trim().length < 2) {
        return res
            .status(422)
            .json({ error: "name é obrigatório (mínimo 2 chars)" });
    }

    const safeIds = normalizePokemonIds(pokemonIds);

    if (safeIds.length > 6) {
        return res.status(422).json({ error: "Máximo 6 Pokémon por equipa" });
    }

    const team = await Team.create({
        userId: req.user.userId,
        name: String(name).trim(),
        pokemonIds: safeIds,
    });

    return res.status(201).json({ team });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const id = req.params.id;

    // Evita CastError do Mongoose para IDs inválidos
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({ error: "id inválido" });
    }

    const deleted = await Team.findOneAndDelete({
        _id: id,
        userId: req.user.userId,
    });

    if (!deleted)
        return res.status(404).json({ error: "Equipa não encontrada" });

    return res.status(204).send();
});

export default router;
```

---

## 5.10) Upload de avatar (extra guiado)

### 5.10.1) Criar pasta `uploads/`

Na raiz do backend:

```bash
mkdir -p uploads
```

### 5.10.2) Criar `src/routes/users.routes.js`

Cria `backend/src/routes/users.routes.js`:

```js
/**
 * @file users.routes.js
 * @description Perfil do utilizador (me) + upload de avatar.
 *
 * Upload:
 * - multipart/form-data
 * - campo "avatar"
 * - guardamos no disco (uploads/)
 * - guardamos o URL no User.avatarUrl
 */

import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { requireAuth } from "../middlewares/requireAuth.js";
import { User } from "../models/User.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads/ está na raiz do backend
const uploadDir = path.join(__dirname, "..", "..", "uploads");

/**
 * Storage do multer:
 * - destination: pasta uploads/
 * - filename: timestamp + nome "safe"
 */
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename(_req, file, cb) {
        // Segurança básica: remove espaços e reduz risco de path injection
        const safeName = file.originalname
            .replaceAll(" ", "_")
            .replaceAll("..", ".");
        cb(null, `${Date.now()}__${safeName}`);
    },
});

/**
 * Aceitar apenas imagens.
 *
 * @param {import("express").Request} _req
 * @param {Express.Multer.File} file
 * @param {(error: Error|null, acceptFile: boolean) => void} cb
 */
function imageFilter(_req, file, cb) {
    const ok = file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Só imagens"), ok);
}

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user)
        return res.status(404).json({ error: "Utilizador não encontrado" });

    return res.json({ user: user.toJSON() });
});

router.post(
    "/me/avatar",
    requireAuth,
    upload.single("avatar"),
    async (req, res) => {
        if (!req.file)
            return res.status(422).json({ error: "Ficheiro em falta" });

        const user = await User.findById(req.user.userId);
        if (!user)
            return res.status(404).json({ error: "Utilizador não encontrado" });

        user.avatarUrl = `/uploads/${req.file.filename}`;
        await user.save();

        return res.json({ user: user.toJSON() });
    },
);

export default router;
```

---

## 5.11) `app.js` (CORS + cookies + CSRF + rotas + health + static)

Cria/atualiza `backend/src/app.js`:

```js
/**
 * @file app.js
 * @description Config do Express: middlewares + rotas.
 *
 * Ordem importante:
 * - cors com credentials
 * - json + cookieParser
 * - static (uploads)
 * - CSRF middleware
 * - routes
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requireCsrf } from "./middlewares/requireCsrf.js";

import authRoutes from "./routes/auth.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        credentials: true,
        allowedHeaders: ["Content-Type", "X-CSRF-Token"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
);

app.use(express.json());
app.use(cookieParser());

// Uploads públicos (dev):
app.use("/uploads", express.static("uploads"));

// CSRF mínimo (antes de routes que mudam dados):
app.use(requireCsrf);

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
```

---

## 5.12) `server.js` (fail fast)

Cria/atualiza `backend/src/server.js`:

```js
/**
 * @file server.js
 * @description Entry point do backend.
 *
 * Ordem correta:
 * 1) Ler variáveis ambiente (.env)
 * 2) Ligar ao MongoDB
 * 3) Só depois arrancar o servidor Express
 */

import "dotenv/config";
import app from "./app.js";
import { connectToMongo } from "./db/connect.js";

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

async function start() {
    await connectToMongo(process.env.MONGODB_URI);

    app.listen(PORT, () => {
        console.log(`[api] Backend a correr em http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("[api] Falha ao arrancar:", err);
    process.exit(1);
});
```

---

## 5.13) Paragem C/D/E — testes manuais (backend)

### 5.13.1) Arrancar backend

```bash
cd backend
node src/server.js
```

### 5.13.2) Health check

- `GET http://localhost:3000/api/health` → `{ ok: true }`

### 5.13.3) Register/login (com Postman/Insomnia)

1. `POST /api/auth/register`
2. Confirmar cookies `token` e `csrfToken` no response (via tool)
3. `GET /api/auth/me` → devolve o user
4. `GET /api/favorites` → `{ favorites: [] }` (precisa estar autenticado)

Checkpoint sugerido:

```bash
git add -A
git commit -m "Ficha 6: Backend Mongo + Auth + Favorites + Teams + Upload"
```

---

# 6) FRONTEND — Axios + Services + Context + Rotas + Páginas

> Agora ligamos o frontend ao backend com Axios e cookies.

---

## 6.0) Patch de Compatibilidade (frontend: mapa rápido)

### 6.0.1) Criar `frontend/.env`

**Caminho:** `frontend/.env`

```bash
VITE_API_URL=http://localhost:3000
```

E garante que `frontend/.gitignore` ignora `.env` (se ainda não ignorar).

### 6.0.2) Criar `frontend/src/services/apiClient.js`

**Caminho:** `frontend/src/services/apiClient.js`

```js
/**
 * @file apiClient.js
 * @description Axios central:
 * - baseURL
 * - withCredentials para cookies (JWT HttpOnly)
 * - CSRF header automático em requests mutáveis
 */

import axios from "axios";

/**
 * Lê um cookie pelo nome.
 *
 * @param {string} name
 * @returns {string}
 */
function getCookie(name) {
    const parts = document.cookie.split(";").map((p) => p.trim());
    const found = parts.find((p) => p.startsWith(`${name}=`));
    return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : "";
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toUpperCase();
    const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    if (mutating) {
        const csrf = getCookie("csrfToken");
        if (csrf) config.headers["X-CSRF-Token"] = csrf;
    }

    return config;
});
```

### 6.0.3) ALTERAR `frontend/src/services/favoritesApi.js` (mesma assinatura!)

**Caminho:** `frontend/src/services/favoritesApi.js`

Objetivo:

- trocar `fetch` por `axios`
- manter:
    - `getFavorites() -> number[]`
    - `addFavorite(id) -> {id}`
    - `removeFavorite(id) -> {id}`

```js
import { api } from "./apiClient";

/**
 * favoritesApi.js
 *
 * Mantém EXACTAMENTE o mesmo contrato da Ficha 5:
 * - GET    /api/favorites          -> devolve Array<number>
 * - POST   /api/favorites { id }   -> devolve { id }
 * - DELETE /api/favorites/:id      -> devolve { id }
 */

export async function getFavorites() {
    const res = await api.get("/api/favorites");
    return res.data; // Array<number>
}

export async function addFavorite(id) {
    const res = await api.post("/api/favorites", { id });
    return res.data; // { id }
}

export async function removeFavorite(id) {
    const res = await api.delete(`/api/favorites/${id}`);
    return res.data; // { id }
}
```

### 6.0.4) Criar páginas novas (agora em `src/pages/`)

> **Objetivo:** acrescentar páginas de **login/registo**, e páginas novas protegidas (**equipas** e **perfil**).  
> **Nota:** as páginas que já existiam na Ficha 5 (lista/detalhe/favoritos) devem ser **movidas** para `src/pages/` na **Paragem B** (sem mudar o conteúdo).

#### 6.0.4.1) Criar `frontend/src/pages/LoginPage.jsx`

**Caminho:** `frontend/src/pages/LoginPage.jsx`

```jsx
/**
 * @file LoginPage.jsx
 * @description Página de login.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @returns {JSX.Element}
 */
export default function LoginPage() {
    const { login } = usePokedex();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submete login.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate("/favoritos");
        } catch (err) {
            setError("Login falhou. Confirma email e password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1>Login</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "A entrar..." : "Entrar"}
                </button>
            </form>

            <p>
                Não tens conta? <Link to="/registar">Registar</Link>
            </p>
        </main>
    );
}
```

#### 6.0.4.2) Criar `frontend/src/pages/RegisterPage.jsx`

**Caminho:** `frontend/src/pages/RegisterPage.jsx`

```jsx
/**
 * @file RegisterPage.jsx
 * @description Página de registo.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @returns {JSX.Element}
 */
export default function RegisterPage() {
    const { register } = usePokedex();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submete registo.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register({ displayName, email, password });
            navigate("/favoritos");
        } catch (err) {
            setError(
                "Registo falhou. Verifica se o email já existe e se a password tem 8+ chars.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1>Registar</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password (mínimo 8 chars)
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "A criar..." : "Criar conta"}
                </button>
            </form>

            <p>
                Já tens conta? <Link to="/login">Login</Link>
            </p>
        </main>
    );
}
```

#### 6.0.4.3) Criar `frontend/src/pages/TeamsPage.jsx`

**Caminho:** `frontend/src/pages/TeamsPage.jsx`

```jsx
/**
 * @file TeamsPage.jsx
 * @description Página de Equipas (protegida).
 *
 * Objetivos:
 * - listar equipas paginadas
 * - pesquisar por nome (q)
 * - criar nova equipa (nome + ids)
 * - apagar equipa
 */

import React, { useEffect, useMemo, useState } from "react";
import * as teamsApi from "../services/teamsApi.js";

/**
 * Calcula número de páginas.
 *
 * @param {number} total
 * @param {number} limit
 * @returns {number}
 */
function calcPages(total, limit) {
    if (limit <= 0) return 1;
    return Math.max(1, Math.ceil(total / limit));
}

/**
 * Converte string com ids "1, 25, 150" em [1,25,150].
 *
 * @param {string} raw
 * @returns {number[]}
 */
function parseIds(raw) {
    return raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => Number.parseInt(x, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
}

/**
 * @returns {JSX.Element}
 */
export default function TeamsPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [q, setQ] = useState("");
    const [search, setSearch] = useState("");

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Criar equipa
    const [name, setName] = useState("");
    const [rawIds, setRawIds] = useState("");

    const pages = useMemo(() => calcPages(total, limit), [total, limit]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError("");
            setLoading(true);

            try {
                const data = await teamsApi.listTeams({
                    page,
                    limit,
                    q: search,
                });
                if (cancelled) return;

                setItems(data.items);
                setTotal(data.total);
            } catch {
                if (!cancelled) setError("Falha ao carregar equipas.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page, limit, search]);

    /**
     * Aplica pesquisa e volta à página 1.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        setSearch(q.trim());
    }

    /**
     * Cria equipa e recarrega lista.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleCreate(e) {
        e.preventDefault();
        setError("");

        try {
            const pokemonIds = parseIds(rawIds);

            await teamsApi.createTeam({
                name: name.trim(),
                pokemonIds,
            });

            // Reset form
            setName("");
            setRawIds("");

            // Volta ao topo e força reload
            setPage(1);
            setSearch((s) => s);
        } catch (err) {
            setError("Falha ao criar equipa. Confirma o nome e máximo 6 IDs.");
        }
    }

    /**
     * Apaga equipa e recarrega.
     *
     * @param {string} id
     */
    async function handleDelete(id) {
        setError("");

        try {
            await teamsApi.deleteTeam(id);
            // Reload “rápido”: remove localmente e ajusta total
            setItems((prev) => prev.filter((t) => t._id !== id));
            setTotal((t) => Math.max(0, t - 1));
        } catch {
            setError("Falha ao apagar equipa.");
        }
    }

    return (
        <main style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1>Equipas</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <section style={{ marginBottom: 18 }}>
                <h2>Pesquisar</h2>

                <form onSubmit={handleSearch}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Pesquisar por nome..."
                    />
                    <button type="submit">Pesquisar</button>
                </form>
            </section>

            <section style={{ marginBottom: 18 }}>
                <h2>Criar equipa</h2>

                <form onSubmit={handleCreate}>
                    <label>
                        Nome
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Pokémon IDs (separados por vírgula, máx. 6)
                        <input
                            value={rawIds}
                            onChange={(e) => setRawIds(e.target.value)}
                            placeholder="ex: 1, 4, 7, 25"
                        />
                    </label>

                    <button type="submit">Criar</button>
                </form>
            </section>

            <section>
                <h2>Lista</h2>

                {loading ? <p>A carregar...</p> : null}

                {items.length === 0 && !loading ? (
                    <p>Sem equipas para mostrar.</p>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0,
                            display: "grid",
                            gap: 12,
                        }}
                    >
                        {items.map((t) => (
                            <li
                                key={t._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: 12,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <strong>{t.name}</strong>
                                        <div>
                                            Pokémon:{" "}
                                            {Array.isArray(t.pokemonIds)
                                                ? t.pokemonIds.join(", ")
                                                : ""}
                                        </div>
                                    </div>

                                    <button onClick={() => handleDelete(t._id)}>
                                        Apagar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginTop: 12,
                    }}
                >
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {page} / {pages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(pages, p + 1))}
                        disabled={page >= pages}
                    >
                        Seguinte
                    </button>
                </div>
            </section>
        </main>
    );
}
```

#### 6.0.4.4) Criar `frontend/src/pages/ProfilePage.jsx`

**Caminho:** `frontend/src/pages/ProfilePage.jsx`

```jsx
/**
 * @file ProfilePage.jsx
 * @description Página de perfil (protegida) com upload de avatar.
 */

import React, { useState } from "react";
import { usePokedex } from "../context/PokedexContext.jsx";
import * as usersApi from "../services/usersApi.js";

/**
 * @returns {JSX.Element}
 */
export default function ProfilePage() {
    const { user, refreshSession } = usePokedex();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Faz upload e depois refresca /me para atualizar user no Context.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setLoading(true);

        try {
            await usersApi.uploadAvatar(file);
            await refreshSession();
        } catch {
            setError("Upload falhou. Confirma se é imagem e <= 2MB.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1>Perfil</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <p>
                <strong>Nome:</strong> {user?.displayName}
            </p>
            <p>
                <strong>Email:</strong> {user?.email}
            </p>

            {user?.avatarUrl ? (
                <div>
                    <p>Avatar atual:</p>
                    <img
                        src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
                        alt="avatar"
                        width={120}
                        height={120}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                </div>
            ) : (
                <p>Sem avatar.</p>
            )}

            <div style={{ marginTop: 12 }}>
                <label>
                    Upload avatar:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </label>
            </div>

            {loading ? <p>A enviar...</p> : null}
        </main>
    );
}
```

### 6.0.5) Criar componente de rota protegida

#### 6.0.5.1) Criar `frontend/src/components/ProtectedRoute.jsx`

**Caminho:** `frontend/src/components/ProtectedRoute.jsx`

```jsx
/**
 * @file ProtectedRoute.jsx
 * @description Componente de proteção de rotas.
 *
 * Lógica:
 * - enquanto authReady=false, mostramos “a carregar”
 * - quando authReady=true:
 *   - se user existe -> renderiza children
 *   - senão -> redireciona para /login
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {
    const { user, authReady } = usePokedex();

    if (!authReady) {
        return <p>A carregar sessão...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
```

### 6.0.6) ALTERAR rotas do frontend

#### 6.0.6.1) Alterar `frontend/src/App.jsx`

> **Faz replace do ficheiro todo.**  
> Este `App.jsx` é a versão da Ficha 5 (com `Layout` e rotas nested), com as rotas novas + proteção em `/favoritos`, `/equipas`, `/perfil`.

**Caminho:** `frontend/src/App.jsx`

```jsx
/* src/App.jsx */
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import NotFound from "@/components/NotFound.jsx";

// Páginas existentes (vieram da Ficha 5; foram movidas para /pages)
import PokemonListPage from "@/pages/PokemonListPage.jsx";
import PokemonDetailsPage from "@/pages/PokemonDetailsPage.jsx";
import FavoritesPage from "@/pages/FavoritesPage.jsx";

// NOVO (Ficha 6)
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import TeamsPage from "@/pages/TeamsPage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PokemonListPage />} />
                <Route path="pokemon/:id" element={<PokemonDetailsPage />} />

                {/* Rotas públicas (sem login) */}
                <Route path="login" element={<LoginPage />} />
                <Route path="registar" element={<RegisterPage />} />

                {/* Rotas protegidas (exigem sessão) */}
                <Route
                    path="favoritos"
                    element={
                        <ProtectedRoute>
                            <FavoritesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="equipas"
                    element={
                        <ProtectedRoute>
                            <TeamsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="perfil"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
```

### 6.0.7) ALTERAR o Context (obrigatório para não quebrar o arranque)

> Na Ficha 5, o `loadInitialData()` chamava `getFavorites()` logo ao arrancar.  
> Na Ficha 6, **favoritos exigem login**, por isso isso dava 401 e partia a app logo ao carregar.

#### 6.0.7.1) Substituir `frontend/src/context/PokedexContext.jsx`

> **Faz replace do ficheiro todo.**  
> Mantém tudo o que tinhas (pokemon + favoritos), e adiciona o mínimo necessário para auth.

**Caminho:** `frontend/src/context/PokedexContext.jsx`

```jsx
/* src/context/PokedexContext.jsx */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { fetchPokemonList } from "@/services/pokeApi.js";
import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "@/services/favoritesApi.js";
import {
    login as loginApi,
    logout as logoutApi,
    me as meApi,
    register as registerApi,
} from "@/services/authApi.js";

// Gen 1 = 151
const POKEMON_LIMIT = 151;

const PokedexContext = createContext(null);

export function PokedexProvider({ children }) {
    // -----------------------------
    // Estado principal (Ficha 5)
    // -----------------------------
    const [pokemon, setPokemon] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // -----------------------------
    // NOVO (Ficha 6) — Autenticação
    // -----------------------------
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    // ----------------------------------------------------------------------
    // Helper: tenta obter sessão atual.
    // - Se não houver sessão (401), devolve null (não é erro "fatal").
    // - Se houver outro erro (rede, 500, etc), re-lança.
    // ----------------------------------------------------------------------
    const safeMe = useCallback(async () => {
        try {
            const { user: meUser } = await meApi();
            return meUser;
        } catch (err) {
            const status = err?.response?.status;

            // 401 = sem sessão (normal antes de login)
            if (status === 401) return null;

            // outros erros: queremos saber
            throw err;
        }
    }, []);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fazemos Pokémon SEMPRE (app pode funcionar sem login)
            const pokemonPromise = fetchPokemonList(POKEMON_LIMIT);

            // Tentamos recuperar sessão (pode ser null)
            const meUser = await safeMe();

            // Quando chegamos aqui, já sabemos se há ou não user
            setUser(meUser);
            setAuthReady(true);

            // Agora terminamos o fetch da lista
            const pokemonList = await pokemonPromise;
            setPokemon(pokemonList);

            // Favoritos só fazem sentido se houver sessão
            if (meUser) {
                const favoritesList = await getFavorites();
                setFavorites(favoritesList);
            } else {
                setFavorites([]);
            }
        } catch (err) {
            console.error(err);
            setError("Falha ao carregar dados.");

            // IMPORTANTÍSSIMO: mesmo com erro, marcamos authReady para o UI não ficar preso.
            setAuthReady(true);
        } finally {
            setLoading(false);
        }
    }, [safeMe]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // ------------------------------------------------------------
    // Favoritos (igual à Ficha 5, mas agora exige login)
    // ------------------------------------------------------------
    const toggleFavorite = useCallback(
        async (pokemonId) => {
            // Se não houver sessão, não tentamos chamar a API (vai dar 401)
            if (!user) {
                alert("Precisas de fazer login para usar favoritos.");
                return;
            }

            setError(null);

            try {
                const isFavorite = favorites.includes(pokemonId);

                if (isFavorite) {
                    await removeFavorite(pokemonId);
                    setFavorites((prev) =>
                        prev.filter((id) => id !== pokemonId),
                    );
                } else {
                    await addFavorite(pokemonId);
                    setFavorites((prev) => [...prev, pokemonId]);
                }
            } catch (err) {
                console.error(err);
                setError("Falha ao atualizar favoritos.");
            }
        },
        [favorites, user],
    );

    // ------------------------------------------------------------
    // NOVO (Ficha 6) — ações de auth
    // ------------------------------------------------------------
    const refreshSession = useCallback(async () => {
        setError(null);

        try {
            const meUser = await safeMe();
            setUser(meUser);
            setAuthReady(true);

            if (meUser) {
                const favoritesList = await getFavorites();
                setFavorites(favoritesList);
            } else {
                setFavorites([]);
            }

            return meUser;
        } catch (err) {
            console.error(err);
            setError("Falha ao atualizar sessão.");
            setAuthReady(true);
            return null;
        }
    }, [safeMe]);

    const register = useCallback(async ({ displayName, email, password }) => {
        setError(null);

        try {
            const { user: newUser } = await registerApi({
                displayName,
                email,
                password,
            });
            setUser(newUser);
            setAuthReady(true);

            // após registo, favoritos vazios
            setFavorites([]);
            return newUser;
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.error || "Falha no registo.";
            setError(msg);
            throw err;
        }
    }, []);

    const login = useCallback(async ({ email, password }) => {
        setError(null);

        try {
            const { user: loggedUser } = await loginApi({ email, password });
            setUser(loggedUser);
            setAuthReady(true);

            // carregar favoritos do backend
            const favoritesList = await getFavorites();
            setFavorites(favoritesList);

            return loggedUser;
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.error || "Falha no login.";
            setError(msg);
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        setError(null);

        try {
            await logoutApi();
        } catch (err) {
            // Mesmo que o backend falhe a limpar cookies,
            // localmente vamos "terminar sessão" para não bloquear o utilizador.
            console.error(err);
        } finally {
            setUser(null);
            setFavorites([]);
            setAuthReady(true);
        }
    }, []);

    const value = useMemo(
        () => ({
            // dados
            pokemon,
            favorites,
            loading,
            error,

            // favoritos
            toggleFavorite,

            // auth
            user,
            authReady,
            register,
            login,
            logout,
            refreshSession,
        }),
        [
            pokemon,
            favorites,
            loading,
            error,
            toggleFavorite,
            user,
            authReady,
            register,
            login,
            logout,
            refreshSession,
        ],
    );

    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}

export function usePokedex() {
    const ctx = useContext(PokedexContext);
    if (!ctx)
        throw new Error("usePokedex deve ser usado dentro de PokedexProvider");
    return ctx;
}
```

### 6.0.8) Criar services novos (axios)

#### 6.0.8.1) Criar `frontend/src/services/authApi.js`

**Caminho:** `frontend/src/services/authApi.js`

```js
/**
 * @file authApi.js
 * @description Chamadas de autenticação.
 */

import { api } from "./apiClient";

/**
 * Regista utilizador.
 *
 * @param {{ email: string, password: string, displayName: string }} data
 * @returns {Promise<{ user: any }>}
 */
export async function register(data) {
    const res = await api.post("/api/auth/register", data);
    return res.data;
}

/**
 * Login.
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user: any }>}
 */
export async function login(data) {
    const res = await api.post("/api/auth/login", data);
    return res.data;
}

/**
 * Logout.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
    await api.post("/api/auth/logout");
}

/**
 * Restaura sessão (se houver cookie JWT válido).
 *
 * @returns {Promise<{ user: any }>}
 */
export async function me() {
    const res = await api.get("/api/auth/me");
    return res.data;
}
```

#### 6.0.8.2) Criar `frontend/src/services/teamsApi.js`

**Caminho:** `frontend/src/services/teamsApi.js`

```js
/**
 * @file teamsApi.js
 * @description Equipas paginadas.
 */

import { api } from "./apiClient";

/**
 * Lista equipas com paginação e pesquisa.
 *
 * @param {{ page: number, limit: number, q: string }} params
 * @returns {Promise<{ items: any[], page: number, limit: number, total: number }>}
 */
export async function listTeams(params) {
    const res = await api.get("/api/teams", { params });
    return res.data;
}

/**
 * Cria equipa.
 *
 * @param {{ name: string, pokemonIds: number[] }} data
 * @returns {Promise<{ team: any }>}
 */
export async function createTeam(data) {
    const res = await api.post("/api/teams", data);
    return res.data;
}

/**
 * Apaga equipa.
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTeam(id) {
    await api.delete(`/api/teams/${id}`);
}
```

#### 6.0.8.3) Criar `frontend/src/services/usersApi.js`

**Caminho:** `frontend/src/services/usersApi.js`

```js
/**
 * @file usersApi.js
 * @description Upload de avatar.
 */

import { api } from "./apiClient";

/**
 * Faz upload do avatar.
 *
 * @param {File} file
 * @returns {Promise<{ user: any }>}
 */
export async function uploadAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);

    const res = await api.post("/api/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}
```

---

## 6.1) Instalar Axios

Em `frontend/`:

```bash
npm install axios
```

---

## 6.2) Axios central: `apiClient.js` (com CSRF automático)

Cria `frontend/src/services/apiClient.js`:

```js
/**
 * @file apiClient.js
 * @description Axios central:
 * - baseURL
 * - withCredentials para cookies (JWT HttpOnly)
 * - CSRF header automático em requests mutáveis
 */

import axios from "axios";

/**
 * Lê um cookie pelo nome.
 *
 * @param {string} name
 * @returns {string}
 */
function getCookie(name) {
    const parts = document.cookie.split(";").map((p) => p.trim());
    const found = parts.find((p) => p.startsWith(`${name}=`));
    return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : "";
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toUpperCase();
    const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    if (mutating) {
        const csrf = getCookie("csrfToken");
        if (csrf) config.headers["X-CSRF-Token"] = csrf;
    }

    return config;
});
```

---

## 6.3) Services (camada de API)

> Isto é a “camada que fala com o backend”.  
> O resto da app chama funções simples, e não fica cheio de `axios.get(...)`.

### 6.3.1) `authApi.js`

Cria `frontend/src/services/authApi.js`:

```js
/**
 * @file authApi.js
 * @description Chamadas de autenticação.
 */

import { api } from "./apiClient";

/**
 * Regista utilizador.
 *
 * @param {{ email: string, password: string, displayName: string }} data
 * @returns {Promise<{ user: any }>}
 */
export async function register(data) {
    const res = await api.post("/api/auth/register", data);
    return res.data;
}

/**
 * Login.
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user: any }>}
 */
export async function login(data) {
    const res = await api.post("/api/auth/login", data);
    return res.data;
}

/**
 * Logout.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
    await api.post("/api/auth/logout");
}

/**
 * Restaura sessão (se houver cookie JWT válido).
 *
 * @returns {Promise<{ user: any }>}
 */
export async function me() {
    const res = await api.get("/api/auth/me");
    return res.data;
}
```

### 6.3.2) `favoritesApi.js`

Cria `frontend/src/services/favoritesApi.js`:

```js
/**
 * @file favoritesApi.js
 * @description Favoritos por utilizador autenticado.
 */

import { api } from "./apiClient";

/**
 * Lista favoritos.
 *
 * @returns {Promise<{ favorites: number[] }>}
 */
export async function getFavorites() {
    const res = await api.get("/api/favorites");
    return res.data;
}

/**
 * Adiciona favorito.
 *
 * @param {number} pokemonId
 * @returns {Promise<{ favorites: number[] }>}
 */
export async function addFavorite(pokemonId) {
    const res = await api.post(`/api/favorites/${pokemonId}`);
    return res.data;
}

/**
 * Remove favorito.
 *
 * @param {number} pokemonId
 * @returns {Promise<{ favorites: number[] }>}
 */
export async function removeFavorite(pokemonId) {
    const res = await api.delete(`/api/favorites/${pokemonId}`);
    return res.data;
}
```

### 6.3.3) `teamsApi.js`

Cria `frontend/src/services/teamsApi.js`:

```js
/**
 * @file teamsApi.js
 * @description Equipas paginadas.
 */

import { api } from "./apiClient";

/**
 * Lista equipas com paginação e pesquisa.
 *
 * @param {{ page: number, limit: number, q: string }} params
 * @returns {Promise<{ items: any[], page: number, limit: number, total: number }>}
 */
export async function listTeams(params) {
    const res = await api.get("/api/teams", { params });
    return res.data;
}

/**
 * Cria equipa.
 *
 * @param {{ name: string, pokemonIds: number[] }} data
 * @returns {Promise<{ team: any }>}
 */
export async function createTeam(data) {
    const res = await api.post("/api/teams", data);
    return res.data;
}

/**
 * Apaga equipa.
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTeam(id) {
    await api.delete(`/api/teams/${id}`);
}
```

### 6.3.4) `usersApi.js` (upload)

Cria `frontend/src/services/usersApi.js`:

```js
/**
 * @file usersApi.js
 * @description Upload de avatar.
 */

import { api } from "./apiClient";

/**
 * Faz upload do avatar.
 *
 * @param {File} file
 * @returns {Promise<{ user: any }>}
 */
export async function uploadAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);

    const res = await api.post("/api/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}
```

Checkpoint (Paragem F):

```bash
git add -A
git commit -m "Ficha 6: Axios central + services"
```

---

## 6.4) Context: adicionar Auth + boot de sessão + favoritos do backend

### 6.4.1) Teoria: “boot” da SPA

Quando a SPA abre:

- não sabemos se o user está autenticado
- chamamos `/api/auth/me`
- se der 200 → user existe e podemos buscar favoritos (ou usar `user.favorites`)
- se der 401 → sem sessão

Para evitar “flash” de UI errada, criamos `authReady`.

---

### 6.4.2) `PokedexContext.jsx` (versão final completa)

> Importante: este ficheiro **substitui** o teu Context da Ficha 5.  
> Mantém a ideia de “estado global” e acrescenta Auth + favoritos do backend.  
> Se o teu Context da Ficha 5 tiver mais lógica (filtros, etc.), integra-a aqui.

Cria/atualiza `frontend/src/context/PokedexContext.jsx`:

```jsx
/**
 * @file PokedexContext.jsx
 * @description Context global da app:
 * - Auth (user, authReady, login, register, logout)
 * - Favoritos (favoriteIds, toggleFavorite)
 *
 * Nota pedagógica:
 * - O token JWT está em cookie HttpOnly, por isso o frontend não “vê” o token.
 * - Para saber se há sessão, chamamos /api/auth/me.
 */

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import * as authApi from "../services/authApi.js";
import * as favoritesApi from "../services/favoritesApi.js";

/**
 * @typedef {Object} PokedexContextValue
 * @property {any|null} user
 * @property {boolean} authReady
 * @property {number[]} favoriteIds
 * @property {(data: {email: string, password: string, displayName: string}) => Promise<void>} register
 * @property {(data: {email: string, password: string}) => Promise<void>} login
 * @property {() => Promise<void>} logout
 * @property {() => Promise<void>} refreshSession
 * @property {(pokemonId: number) => Promise<void>} toggleFavorite
 */

const PokedexContext = createContext(null);

/**
 * Hook de acesso ao Context.
 *
 * @returns {PokedexContextValue}
 */
export function usePokedex() {
    const value = useContext(PokedexContext);
    if (!value)
        throw new Error(
            "usePokedex tem de ser usado dentro de <PokedexProvider>",
        );
    return value;
}

/**
 * Provider do Context.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function PokedexProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    /**
     * Lista de IDs favoritos (vêm do backend).
     * Guardamos separado para ser rápido verificar includes().
     */
    const [favoriteIds, setFavoriteIds] = useState([]);

    /**
     * Restaura sessão ao arrancar a SPA.
     *
     * Lógica:
     * - tenta /me
     * - se OK: seta user e favorites
     * - se 401: user = null e favorites = []
     */
    async function refreshSession() {
        try {
            const data = await authApi.me();
            setUser(data.user);

            // Nesta ficha, favorites estão no próprio user.
            // Também podias chamar GET /api/favorites, mas não é obrigatório.
            setFavoriteIds(
                Array.isArray(data.user?.favorites) ? data.user.favorites : [],
            );
        } catch (err) {
            // 401 ou falha de rede
            setUser(null);
            setFavoriteIds([]);
        } finally {
            setAuthReady(true);
        }
    }

    useEffect(() => {
        refreshSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Registar utilizador.
     *
     * @param {{ email: string, password: string, displayName: string }} data
     * @returns {Promise<void>}
     */
    async function register(data) {
        const res = await authApi.register(data);
        setUser(res.user);
        setFavoriteIds(
            Array.isArray(res.user?.favorites) ? res.user.favorites : [],
        );
        setAuthReady(true);
    }

    /**
     * Login.
     *
     * @param {{ email: string, password: string }} data
     * @returns {Promise<void>}
     */
    async function login(data) {
        const res = await authApi.login(data);
        setUser(res.user);
        setFavoriteIds(
            Array.isArray(res.user?.favorites) ? res.user.favorites : [],
        );
        setAuthReady(true);
    }

    /**
     * Logout.
     *
     * @returns {Promise<void>}
     */
    async function logout() {
        await authApi.logout();
        setUser(null);
        setFavoriteIds([]);
    }

    /**
     * Alterna favorito (add/remove).
     *
     * Regras:
     * - se não houver user, não faz sentido (rota protegida deve evitar isto)
     * - decide add ou remove pelo estado atual do array
     *
     * @param {number} pokemonId
     * @returns {Promise<void>}
     */
    async function toggleFavorite(pokemonId) {
        if (!user) return;

        const has = favoriteIds.includes(pokemonId);

        if (has) {
            const data = await favoritesApi.removeFavorite(pokemonId);
            setFavoriteIds(data.favorites);
        } else {
            const data = await favoritesApi.addFavorite(pokemonId);
            setFavoriteIds(data.favorites);
        }
    }

    const value = useMemo(
        () => ({
            user,
            authReady,
            favoriteIds,
            register,
            login,
            logout,
            refreshSession,
            toggleFavorite,
        }),
        [user, authReady, favoriteIds],
    );

    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}
```

---

## 6.5) ProtectedRoute (rotas protegidas)

Cria `frontend/src/components/ProtectedRoute.jsx`:

```jsx
/**
 * @file ProtectedRoute.jsx
 * @description Componente de proteção de rotas.
 *
 * Lógica:
 * - enquanto authReady=false, mostramos “a carregar”
 * - quando authReady=true:
 *   - se user existe -> renderiza children
 *   - senão -> redireciona para /login
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {
    const { user, authReady } = usePokedex();

    if (!authReady) {
        return <p>A carregar sessão...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
```

---

## 6.6) Páginas: Login e Register

### 6.6.1) `LoginPage.jsx`

Cria `frontend/src/pages/LoginPage.jsx`:

```jsx
/**
 * @file LoginPage.jsx
 * @description Página de login.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @returns {JSX.Element}
 */
export default function LoginPage() {
    const { login } = usePokedex();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submete login.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate("/favoritos");
        } catch (err) {
            setError("Login falhou. Confirma email e password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1>Login</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "A entrar..." : "Entrar"}
                </button>
            </form>

            <p>
                Não tens conta? <Link to="/registar">Registar</Link>
            </p>
        </main>
    );
}
```

### 6.6.2) `RegisterPage.jsx`

Cria `frontend/src/pages/RegisterPage.jsx`:

```jsx
/**
 * @file RegisterPage.jsx
 * @description Página de registo.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

/**
 * @returns {JSX.Element}
 */
export default function RegisterPage() {
    const { register } = usePokedex();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submete registo.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register({ displayName, email, password });
            navigate("/favoritos");
        } catch (err) {
            setError(
                "Registo falhou. Verifica se o email já existe e se a password tem 8+ chars.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1>Registar</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <form onSubmit={handleSubmit}>
                <label>
                    Nome
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password (mínimo 8 chars)
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "A criar..." : "Criar conta"}
                </button>
            </form>

            <p>
                Já tens conta? <Link to="/login">Login</Link>
            </p>
        </main>
    );
}
```

---

## 6.7) Página Favoritos (protegida)

> Se na Ficha 5 já tinhas `FavoritesPage`, podes manter o layout.  
> A diferença é que agora os IDs vêm do backend via Context (`favoriteIds`), e o toggle usa `toggleFavorite`.

Cria `frontend/src/pages/FavoritesPage.jsx`:

```jsx
/**
 * @file FavoritesPage.jsx
 * @description Página de favoritos (protegida).
 *
 * Estratégia:
 * - temos apenas IDs no backend
 * - para mostrar nomes/imagens, precisamos de ir à PokéAPI buscar detalhes
 * - fazemos Promise.all para buscar todos os Pokémon favoritos
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePokedex } from "../context/PokedexContext.jsx";

const POKE_API = "https://pokeapi.co/api/v2/pokemon";

/**
 * Busca detalhes de um Pokémon por id.
 *
 * @param {number} id
 * @returns {Promise<any>}
 */
async function fetchPokemonById(id) {
    const res = await fetch(`${POKE_API}/${id}`);
    if (!res.ok) throw new Error("Falha ao buscar Pokémon");
    return res.json();
}

/**
 * @returns {JSX.Element}
 */
export default function FavoritesPage() {
    const { favoriteIds, toggleFavorite } = usePokedex();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError("");
            setLoading(true);

            try {
                const data = await Promise.all(
                    favoriteIds.map((id) => fetchPokemonById(id)),
                );
                if (!cancelled) setItems(data);
            } catch {
                if (!cancelled)
                    setError("Falha ao carregar detalhes dos favoritos.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (favoriteIds.length === 0) {
            setItems([]);
            return;
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [favoriteIds]);

    return (
        <main style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1>Favoritos</h1>

            {loading ? <p>A carregar...</p> : null}
            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            {favoriteIds.length === 0 ? (
                <p>Ainda não tens favoritos.</p>
            ) : (
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        display: "grid",
                        gap: 12,
                    }}
                >
                    {items.map((p) => (
                        <li
                            key={p.id}
                            style={{ border: "1px solid #ddd", padding: 12 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <img
                                    src={p.sprites?.front_default}
                                    alt={p.name}
                                    width={64}
                                    height={64}
                                />
                                <div style={{ flex: 1 }}>
                                    <strong>
                                        #{p.id} {p.name}
                                    </strong>
                                    <div>
                                        <Link to={`/pokemon/${p.id}`}>
                                            Ver detalhes
                                        </Link>
                                    </div>
                                </div>

                                <button onClick={() => toggleFavorite(p.id)}>
                                    Remover
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
```

---

## 6.8) Página Teams (paginação + pesquisa + create + delete)

Cria `frontend/src/pages/TeamsPage.jsx`:

```jsx
/**
 * @file TeamsPage.jsx
 * @description Página de Equipas (protegida).
 *
 * Objetivos:
 * - listar equipas paginadas
 * - pesquisar por nome (q)
 * - criar nova equipa (nome + ids)
 * - apagar equipa
 */

import React, { useEffect, useMemo, useState } from "react";
import * as teamsApi from "../services/teamsApi.js";

/**
 * Calcula número de páginas.
 *
 * @param {number} total
 * @param {number} limit
 * @returns {number}
 */
function calcPages(total, limit) {
    if (limit <= 0) return 1;
    return Math.max(1, Math.ceil(total / limit));
}

/**
 * Converte string com ids "1, 25, 150" em [1,25,150].
 *
 * @param {string} raw
 * @returns {number[]}
 */
function parseIds(raw) {
    return raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => Number.parseInt(x, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
}

/**
 * @returns {JSX.Element}
 */
export default function TeamsPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [q, setQ] = useState("");
    const [search, setSearch] = useState("");

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Criar equipa
    const [name, setName] = useState("");
    const [rawIds, setRawIds] = useState("");

    const pages = useMemo(() => calcPages(total, limit), [total, limit]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError("");
            setLoading(true);

            try {
                const data = await teamsApi.listTeams({
                    page,
                    limit,
                    q: search,
                });
                if (cancelled) return;

                setItems(data.items);
                setTotal(data.total);
            } catch {
                if (!cancelled) setError("Falha ao carregar equipas.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page, limit, search]);

    /**
     * Aplica pesquisa e volta à página 1.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        setSearch(q.trim());
    }

    /**
     * Cria equipa e recarrega lista.
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    async function handleCreate(e) {
        e.preventDefault();
        setError("");

        try {
            const pokemonIds = parseIds(rawIds);

            await teamsApi.createTeam({
                name: name.trim(),
                pokemonIds,
            });

            // Reset form
            setName("");
            setRawIds("");

            // Volta ao topo e força reload
            setPage(1);
            setSearch((s) => s);
        } catch (err) {
            setError("Falha ao criar equipa. Confirma o nome e máximo 6 IDs.");
        }
    }

    /**
     * Apaga equipa e recarrega.
     *
     * @param {string} id
     */
    async function handleDelete(id) {
        setError("");

        try {
            await teamsApi.deleteTeam(id);
            // Reload “rápido”: remove localmente e ajusta total
            setItems((prev) => prev.filter((t) => t._id !== id));
            setTotal((t) => Math.max(0, t - 1));
        } catch {
            setError("Falha ao apagar equipa.");
        }
    }

    return (
        <main style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1>Equipas</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <section style={{ marginBottom: 18 }}>
                <h2>Pesquisar</h2>

                <form onSubmit={handleSearch}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Pesquisar por nome..."
                    />
                    <button type="submit">Pesquisar</button>
                </form>
            </section>

            <section style={{ marginBottom: 18 }}>
                <h2>Criar equipa</h2>

                <form onSubmit={handleCreate}>
                    <label>
                        Nome
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Pokémon IDs (separados por vírgula, máx. 6)
                        <input
                            value={rawIds}
                            onChange={(e) => setRawIds(e.target.value)}
                            placeholder="ex: 1, 4, 7, 25"
                        />
                    </label>

                    <button type="submit">Criar</button>
                </form>
            </section>

            <section>
                <h2>Lista</h2>

                {loading ? <p>A carregar...</p> : null}

                {items.length === 0 && !loading ? (
                    <p>Sem equipas para mostrar.</p>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0,
                            display: "grid",
                            gap: 12,
                        }}
                    >
                        {items.map((t) => (
                            <li
                                key={t._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: 12,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <strong>{t.name}</strong>
                                        <div>
                                            Pokémon:{" "}
                                            {Array.isArray(t.pokemonIds)
                                                ? t.pokemonIds.join(", ")
                                                : ""}
                                        </div>
                                    </div>

                                    <button onClick={() => handleDelete(t._id)}>
                                        Apagar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginTop: 12,
                    }}
                >
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {page} / {pages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(pages, p + 1))}
                        disabled={page >= pages}
                    >
                        Seguinte
                    </button>
                </div>
            </section>
        </main>
    );
}
```

---

## 6.9) Página Profile (avatar) (extra)

Cria `frontend/src/pages/ProfilePage.jsx`:

```jsx
/**
 * @file ProfilePage.jsx
 * @description Página de perfil (protegida) com upload de avatar.
 */

import React, { useState } from "react";
import { usePokedex } from "../context/PokedexContext.jsx";
import * as usersApi from "../services/usersApi.js";

/**
 * @returns {JSX.Element}
 */
export default function ProfilePage() {
    const { user, refreshSession } = usePokedex();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Faz upload e depois refresca /me para atualizar user no Context.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setLoading(true);

        try {
            await usersApi.uploadAvatar(file);
            await refreshSession();
        } catch {
            setError("Upload falhou. Confirma se é imagem e <= 2MB.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1>Perfil</h1>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <p>
                <strong>Nome:</strong> {user?.displayName}
            </p>
            <p>
                <strong>Email:</strong> {user?.email}
            </p>

            {user?.avatarUrl ? (
                <div>
                    <p>Avatar atual:</p>
                    <img
                        src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
                        alt="avatar"
                        width={120}
                        height={120}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                </div>
            ) : (
                <p>Sem avatar.</p>
            )}

            <div style={{ marginTop: 12 }}>
                <label>
                    Upload avatar:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </label>
            </div>

            {loading ? <p>A enviar...</p> : null}
        </main>
    );
}
```

---

## 6.10) Atualizar Router (`App.jsx`) com rotas protegidas

Cria/atualiza `frontend/src/App.jsx`:

```jsx
/**
 * @file App.jsx
 * @description Router da app.
 *
 * Nesta ficha:
 * - /login e /registar são públicas
 * - /favoritos, /equipas e /perfil são protegidas
 *
 * Nota:
 * - Mantém as tuas rotas existentes (lista, detalhes, etc.)
 * - Aqui mostramos um exemplo completo com as rotas novas.
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// As tuas páginas existentes da Ficha 5 (exemplos):
// import HomePage from "./pages/HomePage.jsx";
// import PokemonDetailsPage from "./pages/PokemonDetailsPage.jsx";

export default function App() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registar" element={<RegisterPage />} />

            {/* Rotas protegidas */}
            <Route
                path="/favoritos"
                element={
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/equipas"
                element={
                    <ProtectedRoute>
                        <TeamsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/perfil"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* Mantém as tuas rotas da Ficha 5 aqui */}
            {/* <Route path="/" element={<HomePage />} /> */}
            {/* <Route path="/pokemon/:id" element={<PokemonDetailsPage />} /> */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/favoritos" replace />} />
        </Routes>
    );
}
```

---

## 6.11) Garantir que o Provider envolve a app (`main.jsx`)

No `frontend/src/main.jsx`, confirma que tens algo neste estilo:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { PokedexProvider } from "./context/PokedexContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <PokedexProvider>
                <App />
            </PokedexProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
```

Checkpoint (Paragem G/H dependendo se fizeste Profile):

```bash
git add -A
git commit -m "Ficha 6: Auth + Protected routes + Favorites + Teams + (Profile upload)"
```

---

# 7) Testes manuais (frontend)

Checklist:

1. **Registar** → entra e fica autenticado
2. **Refresh** → continua autenticado (`/api/auth/me`)
3. **Favoritos**
    - adicionar/remover funciona
    - sair e entrar com outro user → favoritos diferentes
4. **Equipas**
    - criar equipa
    - paginação e pesquisa funcionam
5. **Perfil / Avatar (extra)**
    - upload funciona
    - avatar aparece depois do refresh

---

# 8) Erros comuns (e como resolver)

## 8.1) Cookies não aparecem

- no backend: `cors({ credentials: true, origin: ... })`
- no frontend: axios `withCredentials: true`
- estás a usar os URLs certos (`5173` e `3000`)

## 8.2) 403 CSRF token inválido

- tens de mandar header `X-CSRF-Token` (o interceptor faz isso)
- o cookie `csrfToken` tem de existir (só aparece depois de login/register)
- faz logout e login de novo

## 8.3) Mongo não liga

- IP não autorizado no Atlas
- password com caracteres especiais sem encoding
- URI errada ou base de dados mal escrita

## 8.4) Upload não aparece

- confirma `app.use("/uploads", express.static("uploads"))`
- confirma que `uploads/` existe
- confirma que `avatarUrl` começa por `/uploads/`

---

# 9) Checklist final (avaliação)

Core:

- MongoDB Atlas ligado e sem erros
- Auth completo (register/login/logout/me)
- Favoritos persistentes e por utilizador
- Axios centralizado com cookies + CSRF
- Equipas paginadas + pesquisa

Extra:

- Upload avatar funcional
- Código organizado e comentado com lógica (não comentários genéricos)

## 9.1) Checklist final de integração

1. **Backend**
    - `backend/.env` existe e tem `MONGO_URI` + `JWT_SECRET`.
    - `server.js` usa `connectDB()` antes de `app.listen()`.
    - `app.js` tem `cookieParser()` + `requireCsrf` + CORS com `credentials: true`.

2. **Frontend**
    - `frontend/.env` tem `VITE_API_URL`.
    - `apiClient.js` está a usar `withCredentials: true`.
    - `PokedexContext.jsx` já não chama `getFavorites()` sem sessão.
    - `App.jsx` protege `/favoritos`, `/equipas`, `/perfil`.

3. **Teste rápido**
    - Abre a app, deve aparecer a lista (sem login).
    - Vai a `/favoritos` → deve redirecionar para `/login`.
    - Faz registo/login → entra em `/favoritos`.
    - Cria uma equipa em `/equipas`.

---

Fim.
