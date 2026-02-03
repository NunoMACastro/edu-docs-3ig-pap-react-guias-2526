# Tutorial passo a passo - Pokédex v4 (Ficha 06) (12.º ano)

Este tutorial continua diretamente a Ficha 05.
A app mantém o visual, a navegação e as páginas principais - ou seja, o aluno não começa do zero e não perde o trabalho anterior.
Home/Details/Favorites continuam a funcionar como antes (mesma UX), mas agora com sessão e base de dados.

O foco desta ficha não é criar uma app “maior”. É tornar a mesma app real, com as preocupações que existem fora da sala de aula:

- Persistência real: o que guardavas em memória passa para MongoDB Atlas
- Sessão real: o utilizador passa a ter conta e login:
    - `POST /api/auth/register`
    - `POST /api/auth/login`
    - `GET /api/auth/me`
    - `POST /api/auth/logout`
- JWT guardado em cookie HttpOnly

Segurança web real:

- Configurar CORS para permitir credenciais
- Implementar CSRF para proteger mutações (POST/DELETE/etc.)

Organização profissional no frontend:

- pages/ para rotas (componentes que representam páginas)
- components/ para UI reutilizável
- services/ para centralizar toda a comunicação com a API

Integração completa:

- rotas protegidas
- sessão restaurada ao fazer refresh
- upload de avatar (exemplo completo de multipart/form-data)

> Nesta ficha não estamos a “inventar novas features” ao acaso.
> Estamos a fazer o que os programadores fazem em projetos reais:
> refactor, integração, segurança, persistência, e código organizado.
> No fim, vais ter uma Pokédex fullstack que funciona como uma aplicação real. Espero eu... :D

## 0) O que vais construir e o que muda vs Ficha 05

### O que é

A Ficha 06 pega no **código final da Ficha 05** e evolui a app para uma versão com autenticação, persistência em MongoDB, equipas paginadas e perfil com upload de avatar.

### Teoria

1. **Conceitos-chave**

- **SPA (Single Page Application)**: a página não recarrega por completo em cada ação; o JavaScript atualiza só partes do ecrã.
- **Frontend vs Backend**: o frontend trata da interface e experiência do utilizador; o backend trata de regras, segurança e dados.
- **Contrato de API**: é um acordo fixo sobre endpoints, formatos de pedido e resposta.
- **Continuidade entre fichas**: não começamos do zero; evoluímos uma base existente sem partir comportamento já validado.

2. **Como funciona**

- Numa SPA, quando clicas numa rota, o React Router troca componentes sem fazer novo pedido HTML ao servidor.
- Quando precisas de dados, o frontend faz pedidos HTTP ao backend (por exemplo `GET /api/favorites`).
- O backend recebe pedido, valida, consulta dados e devolve resposta com status code e JSON.
- Se o contrato mudar a meio (ex.: shape da resposta), a UI deixa de interpretar corretamente e “parece que está tudo certo” mas falha em runtime.

3. **Porque estamos a fazer assim neste projeto**

- Esta secção existe para fixar que a Ficha 06 é evolução da Ficha 05.
- Mantemos os contratos estáveis para poderes focar nas novidades (auth, Mongo, CSRF, upload) sem debugging desnecessário.
- A separação clara frontend/backend evita misturar responsabilidades e facilita testes por camada.

4. **Erros comuns e sintomas**

- Mudar endpoint sem atualizar service -> botões deixam de funcionar com erro 404/405.
- Alterar shape da resposta sem querer -> `undefined` no frontend quando tenta ler dados.
- “Funciona no Postman, não funciona na app” -> chamada da SPA vai para URL diferente da esperada.
- Recomeçar projeto em vez de evoluir -> perdes compatibilidade e ficas com versões paralelas.

5. **Boas práticas e segurança**

- Contratos estáveis reduzem risco de regressões silenciosas.
- Separar camadas ajuda a limitar impacto de erros de segurança.
- Manter nomenclatura consistente de rotas e pastas reduz enganos humanos.

### Porque fazemos isto

Na Ficha 05 tinhas favoritos em memória e frontend/backend já separados. Agora vais fechar o ciclo real de uma SPA fullstack:

- sessão com cookies HttpOnly
- proteção CSRF para mutações
- dados por utilizador na base de dados
- frontend organizado por responsabilidade (`pages` vs `components`)

### Contratos obrigatórios desta ficha

#### Favorites (compatível com Ficha 05)

| Método | Endpoint             | Body               | Resposta           |
| ------ | -------------------- | ------------------ | ------------------ |
| GET    | `/api/favorites`     | -                  | `number[]`         |
| POST   | `/api/favorites`     | `{ "id": number }` | `{ "id": number }` |
| DELETE | `/api/favorites/:id` | -                  | `{ "id": number }` |

Mesmo guardando no Mongo/User internamente, para o frontend o contrato mantém-se: `GET -> number[]`.

> Não uses variantes alternativas. Este contrato é único em toda a Ficha 06.

### Checkpoint 0

- O projeto da Ficha 05 arranca em duas janelas:
    - `backend/` com `npm run dev`
    - `frontend/` com `npm run dev`
- A rota `GET http://localhost:3000/api/favorites` ainda responde (estado base da Ficha 05).

---

## 1) Pré-requisitos e estrutura final (backend + frontend)

Antes de mudar código, fixamos a estrutura final alvo para evitar imports partidos e passos fora de ordem.

### Teoria

1. **Conceitos-chave**

- **Estrutura de projeto**: organização física dos ficheiros para refletir responsabilidades.
- **`pages` vs `components`**: `pages` são ecrãs ligados ao router; `components` são peças reutilizáveis.
- **`services` layer**: funções de acesso a API, para não espalhar requests pelos componentes.
- **`.env`, `.env.example`, `.gitignore`**: configuração local, exemplo versionado e proteção de segredos.

2. **Como funciona “por baixo”**

- O bundler (Vite) resolve imports com base em paths e alias (`@`).
- Se moveres ficheiros sem atualizar imports, o build falha com “module not found”.
- `.env` é lido em runtime/build conforme a ferramenta; `.env.example` serve de checklist de variáveis.
- `gitignore` impede segredos e artefactos locais de entrarem no repositório.

3. **Porque estamos a fazer assim neste projeto**

- O projeto vai crescer com auth, equipas e perfil; sem estrutura clara, a manutenção fica caótica.
- A separação `backend/` e `frontend/` torna comando, dependência e debug muito mais previsíveis.
- O refactor `pages/components` prepara terreno para rotas protegidas e layout composto.

4. **Erros comuns e sintomas**

- Import quebrado após `mv` -> erro no Vite ao arrancar.
- `@` não configurado -> imports absolutos deixam de resolver.
- `.env` com segredo no Git -> risco de exposição acidental.
- ficheiro em `components/` tratado como rota -> acoplamento desnecessário e confusão.

5. **Boas práticas e segurança**

- Usa naming previsível (`*.routes.js`, `*Api.js`, `*Page.jsx`).
- Mantém `pages` focadas em composição de ecrã e fluxo; lógica de API nos `services`.
- Nunca versionar credenciais reais; usar sempre `.env.example` como contrato de configuração.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - separação saudável

```txt
pages/LoginPage.jsx -> usa authApi.login()
components/LoginForm.jsx -> só UI e eventos
services/authApi.js -> chamadas HTTP
```

> Exemplo isolado - anti-padrão

```txt
PokemonCard.jsx faz fetch direto ao backend e também decide rotas
(isto mistura UI, rede e navegação no mesmo ponto)
```

### Porque fazemos isto

Se o aluno sabe o “mapa final” desde o início, não se perde a meio da migração.

### Estrutura final esperada

```text
backend/
  .env
  .env.example
  package.json
  uploads/
    .gitkeep
  src/
    app.js
    server.js
    db/
      connect.js
    middlewares/
      requireAuth.js
      requireCsrf.js
    models/
      User.js
      Team.js
    routes/
      auth.routes.js
      favorites.routes.js
      teams.routes.js
      users.routes.js
    utils/
      cookies.js
      csrf.js

frontend/
  .env
  .env.example
  package.json
  src/
    App.jsx
    main.jsx
    context/
      PokedexContext.jsx
    pages/
      PokemonListPage.jsx      (Home)
      PokemonDetailsPage.jsx   (Details)
      FavoritesPage.jsx        (Favoritos)
      TeamsPage.jsx            (Equipas)
      ProfilePage.jsx          (Perfil)
      LoginPage.jsx            (Login)
      RegisterPage.jsx         (Registo)
      NotFound.jsx             (NotFound)
    components/
      Layout.jsx
      ProtectedRoute.jsx
      PokemonCard.jsx
      SearchBar.jsx
      TypeFilter.jsx
      LoadingSpinner.jsx
      ErrorMessage.jsx
      typeData.js
    services/
      apiClient.js
      authApi.js
      favoritesApi.js
      teamsApi.js
      usersApi.js
      pokeApi.js
```

### Checkpoint 1

- Tens as pastas `backend/` e `frontend/` na raiz do projeto.
- O alias `@` continua ativo no frontend (confirmar em `frontend/vite.config.js`).

---

## 2) Backend: setup, env e ligação MongoDB Atlas

### O que é

Vamos preparar o backend para usar MongoDB Atlas e configuração por variáveis de ambiente.

### Teoria

1. **Conceitos-chave**

- **Bootstrap do servidor**: sequência de arranque antes de aceitar pedidos.
- **Fail fast**: se configuração crítica falhar, o processo termina cedo e com erro claro.
- **MongoDB Atlas**: base de dados gerida na cloud.
- **Mongoose**: camada ODM para mapear documentos Mongo em objetos JavaScript.

2. **Como funciona “por baixo”**

- `server.js` carrega variáveis de ambiente, liga à base de dados e só depois abre a porta.
- Se `MONGODB_URI` estiver em falta/inválida, `mongoose.connect` rejeita e o processo deve parar.
- Atlas exige credenciais corretas e origem/IP autorizado; falhas aqui parecem “backend caiu sem motivo”.
- No MongoDB, guardas documentos em coleções; não há tabelas/joins clássicos como num SQL tradicional.

3. **Porque estamos a fazer assim neste projeto**

- Precisas de persistência real: sem Mongo, favoritos/equipas desaparecem ao reiniciar.
- Configuração por `.env` evita hardcode de segredos no código.
- Arranque controlado simplifica diagnóstico: se o servidor sobe, tens uma base mínima de confiança.

4. **Erros comuns e sintomas**

- Backend arranca e fecha logo -> connection string inválida.
- `MongoServerError: bad auth` -> utilizador/password Atlas errados.
- Timeout de ligação -> IP não autorizado ou rede bloqueada.
- `MONGODB_URI em falta` -> variável mal escrita no `.env`.

5. **Boas práticas e segurança**

- Tratar falhas de arranque como críticas (não ignorar erro de DB).
- Nunca expor `MONGODB_URI` com credenciais reais em screenshots ou commits.
- Usar `NODE_ENV` para separar comportamentos dev/prod quando necessário.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - ordem certa

```txt
1) Carregar .env
2) Ligar ao Mongo
3) app.listen(...)
```

> Exemplo isolado - ordem errada

```txt
1) app.listen(...)
2) Só depois tentar Mongo
Resultado: app parece “up”, mas endpoints que dependem de DB falham.
```

### Porque fazemos isto

Sem base de dados e sem `.env`, as próximas secções (auth, equipas, favoritos por utilizador) não conseguem funcionar de forma estável.

### 2.1) Instalar dependências

No `backend/`:

```bash
# Executa estes comandos na pasta indicada imediatamente acima do bloco.
# Mantém a ordem dos comandos para evitar erros de setup.
npm install cors mongoose dotenv bcrypt jsonwebtoken cookie-parser multer
npm install -D nodemon
```

### 2.2) Criar `.env` e `.env.example`

`backend/.env`:

```env
# Porta onde o Express vai escutar pedidos HTTP no ambiente local.
PORT=3000
# Usado para distinguir comportamentos de desenvolvimento/produção (cookies, logs, etc.).
NODE_ENV=development
# Origem permitida no CORS para o frontend (tem de bater certo com o URL do Vite).
CLIENT_ORIGIN=http://localhost:5173
# Connection string do MongoDB Atlas (host + credenciais + nome da base de dados).
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/pokedex_v4?retryWrites=true&w=majority
# Segredo usado para assinar/verificar JWT; nunca publicar valor real no Git.
JWT_SECRET=troca_isto_por_um_seguro
```

`backend/.env.example`:

```env
# Exemplo da porta local do backend.
PORT=3000
# Exemplo de ambiente (dev/prod).
NODE_ENV=development
# Exemplo da origem do frontend permitida pelo CORS.
CLIENT_ORIGIN=http://localhost:5173
# Exemplo de URI do Atlas (substituir USER/PASSWORD por credenciais reais locais).
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/pokedex_v4?retryWrites=true&w=majority
# Exemplo de segredo JWT (no projeto real deve ser forte e privado).
JWT_SECRET=define_um_valor_seguro
```

`backend/.gitignore` (garante estas entradas):

```gitignore
# Dependências instaladas localmente (recriadas com npm install).
node_modules
# Segredos/configuração local por máquina.
.env
# Ficheiros de upload gerados em runtime.
uploads/*
# Mantém só um ficheiro vazio para garantir que a pasta existe no repositório.
!uploads/.gitkeep
```

### 2.3) Ligar ao MongoDB

`backend/src/db/connect.js`:

```js
/**
 * Trecho: backend/src/db/connect.js
 * Objetivo: centralizar ligação ao MongoDB e falhar cedo quando faltar configuração crítica.

 */

import mongoose from "mongoose";

/**
 * Liga a aplicação ao MongoDB Atlas antes do backend aceitar pedidos.
 *
 * @returns {Promise<void>}
 * @throws {Error} Quando MONGODB_URI não existe.
 */
export async function connectToMongo() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        // Falha explícita para evitar servidor "meio vivo" sem base de dados.
        throw new Error("MONGODB_URI em falta no backend/.env");
    }

    // Se a URI estiver inválida ou o Atlas rejeitar, esta Promise rejeita e o bootstrap trata.
    await mongoose.connect(uri);
    console.log("[mongo] ligado com sucesso");
}
```

`backend/src/server.js`:

```js
/**
 * Trecho: backend/src/server.js
 * Objetivo: arrancar o backend pela ordem correta (env -> mongo -> listen).

 */

import "dotenv/config";
import app from "./app.js";
import { connectToMongo } from "./db/connect.js";

const port = Number(process.env.PORT ?? 3000);

/**
 * Garante que variáveis críticas existem antes de ligar serviços externos.
 *
 * @returns {void}
 * @throws {Error}
 */
function assertRequiredEnv() {
    const required = ["MONGODB_URI", "JWT_SECRET"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Variáveis em falta no backend/.env: ${missing.join(", ")}`,
        );
    }
}

/**
 * Bootstrap da aplicação.
 *
 * @returns {Promise<void>}
 */
async function bootstrap() {
    // Fail fast: se faltar configuração crítica, não abrimos a porta HTTP.
    assertRequiredEnv();

    // Fail fast: se Mongo falhar, não abrimos a porta HTTP.
    await connectToMongo();

    app.listen(port, () => {
        console.log(`[server] http://localhost:${port}`);
    });
}

bootstrap().catch((err) => {
    // Erro fatal de arranque: termina o processo para evitar estado inconsistente.
    console.error("[fatal] falha ao arrancar", err);
    process.exit(1);
});
```

### Checkpoint 2

- `npm run dev` no backend arranca sem erro de `MONGODB_URI` e de `JWT_SECRET`.
- Se o Atlas estiver mal configurado, o backend falha no arranque (comportamento correto: fail fast).

### Erros comuns (env + Mongo)

- `MONGO_URI` em vez de `MONGODB_URI`.
- `JWT_SECRECT` (typo) em vez de `JWT_SECRET`.
- IP não autorizado no Atlas (Network Access).
- User/password errados na connection string.
- Falta de `dotenv/config` no `server.js`.

---

## 3) Backend: auth (register/login/logout), cookies, CSRF e CORS

### O que é

Nesta secção criamos sessão com JWT em cookie HttpOnly e proteção CSRF nas mutações.

### Teoria

1. **Conceitos-chave**

- **Autenticação**: provar quem és (login).
- **Autorização**: decidir o que podes fazer (acesso a recursos).
- **JWT**: token assinado, não encriptado; contém claims (ex.: `userId`, expiração).
- **Cookie HttpOnly**: cookie que JavaScript não consegue ler, mas o browser envia automaticamente.
- **CORS**: política de origens para pedidos entre frontend e backend em hosts/portas diferentes.
- **CSRF**: ataque que explora o envio automático de cookies em pedidos mutáveis.

2. **Como funciona “por baixo”**

- No login/register, o backend cria JWT e envia em `Set-Cookie`.
- Em pedidos seguintes, o browser anexa o cookie automaticamente ao backend dessa origem.
- `requireAuth` lê cookie e faz `jwt.verify`; se falhar, devolve 401.
- Para CSRF, usa-se **double submit cookie pattern**: backend envia `csrfToken` (não HttpOnly), frontend lê e manda no header `X-CSRF-Token`; backend compara cookie/header.
- Métodos seguros (`GET/HEAD/OPTIONS`) não alteram estado e passam sem token CSRF.
- Preflight `OPTIONS` acontece antes de algumas mutações cross-origin e precisa de CORS coerente.

```txt
Login -> backend cria JWT -> Set-Cookie: token (HttpOnly)
      -> backend cria csrfToken -> Set-Cookie: csrfToken (não HttpOnly)

Pedidos seguintes:
- Browser envia cookies automaticamente
- Frontend lê csrfToken e envia header X-CSRF-Token
- Backend compara cookie csrfToken vs header X-CSRF-Token
```

3. **Porque estamos a fazer assim neste projeto**

- Cookies HttpOnly reduzem impacto de XSS (token não fica exposto ao JavaScript da página).
- Como cookies são automáticos, precisas de proteção CSRF explícita nas mutações.
- `auth/me` permite restaurar sessão após refresh sem guardar token manualmente.
- Guard global de CSRF após `/api/auth` simplifica proteção de recursos restantes.

4. **Erros comuns e sintomas**

- Login 200 mas sessão não persiste -> faltou `withCredentials` no cliente.
- Erro CORS no browser sem status útil -> `origin`/`credentials` mal configurados.
- 403 em POST/DELETE -> header `X-CSRF-Token` ausente ou diferente do cookie.
- 401 em rota protegida com cookie presente -> JWT expirado/inválido ou `JWT_SECRET` mudou.
- Logout “não limpa” -> opções de `clearCookie` não compatíveis com cookie original.

| Status | Leitura rápida                                  |
| ------ | ----------------------------------------------- |
| 401    | sem sessão / token inválido                     |
| 403    | CSRF inválido (ou pedido recusado por política) |
| 422    | payload inválido (cliente corrige)              |
| 404    | recurso não existe                              |

5. **Boas práticas e segurança**

- Não usar `origin: *` com credenciais.
- Distinguir claramente 401 (não autenticado) de 403 (proibido/CSRF inválido).
- `SameSite` e `Secure` devem ser ajustados ao ambiente (dev/prod).
- Não guardar password nem token em logs.
- Tratar `JWT_SECRET` como segredo sensível.

> Nota rápida (dev vs prod): em produção, `secure: true` exige HTTPS; em dev (`http`) pode bloquear cookies, por isso controlamos pelo `NODE_ENV`.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - cartão de acesso

```txt
Cookie token = cartão de acesso que o browser apresenta sozinho.
Header CSRF = palavra-passe curta pedida em ações sensíveis.
```

> Exemplo isolado - leitura de status

```txt
401 -> sessão em falta/inválida
403 -> sessão pode existir, mas proteção CSRF falhou
```

### Porque importa (porque fazemos isto)

Com cookies, o browser envia credenciais automaticamente. Isso pede duas coisas obrigatórias:

1. CORS com `credentials: true`
2. proteção CSRF para `POST/PUT/PATCH/DELETE`

- Backend: `cors({ origin: CLIENT_ORIGIN, credentials: true })`
- Frontend: `axios.create({ withCredentials: true })`

Se faltar uma destas duas peças, o login pode “parecer” funcionar mas a sessão não persiste.

### 3.0) Mapa mental Auth + Cookies + CSRF + CORS

Aqui está um resumo visual do fluxo de autenticação e proteção CSRF.
Basicamente o user faz login (1), o frontend pede dados do user (2), e depois faz mutações protegidas (3).

> mutações = pedidos que alteram estado (POST/PUT/PATCH/DELETE)

```txt
(1) POST /api/auth/login
    -> Set-Cookie: token (HttpOnly)
    -> Set-Cookie: csrfToken (não HttpOnly)

(2) GET /api/auth/me
    -> cookie token é enviado automaticamente
    -> requireAuth valida JWT

(3) POST /api/favorites
    -> cookie token + cookie csrfToken + header X-CSRF-Token
    -> requireAuth + requireCsrf
```

### Passos

### 3.1) Modelo User + utils (cookies/csrf)

`backend/src/models/User.js`:

```js
/**
 * Trecho: backend/src/models/User.js
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
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
        favorites: {
            type: [Number],
            default: [],
        },
        avatarUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.passwordHash;
                return ret;
            },
        },
    },
);

const User = mongoose.model("User", userSchema);

export default User;
```

#### 3.1.1) Utils de cookies e CSRF

`backend/src/utils/cookies.js`:

```js
/**
 * Trecho: backend/src/utils/cookies.js
 * Objetivo: definir opções de cookies num único sítio para evitar inconsistências entre set/clear.

 */

const isProd = process.env.NODE_ENV === "production";

/**
 * Opções base partilhadas por todos os cookies da app.
 *
 * @returns {{path: string, sameSite: string, secure: boolean}}
 */
function baseCookieOptions() {
    return {
        // Manter o mesmo path é essencial para clearCookie funcionar corretamente.
        path: "/",
        sameSite: "lax",
        secure: isProd,
    };
}

/**
 * Cookie de autenticação (JWT).
 *
 * @returns {{path: string, sameSite: string, secure: boolean, httpOnly: boolean, maxAge: number}}
 */
export function authCookieOptions() {
    return {
        ...baseCookieOptions(),
        // HttpOnly protege token contra acesso direto via JavaScript no browser.
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

/**
 * Cookie CSRF (precisa de ser legível no frontend para enviar no header).
 *
 * @returns {{path: string, sameSite: string, secure: boolean, httpOnly: boolean, maxAge: number}}
 */
export function csrfCookieOptions() {
    return {
        ...baseCookieOptions(),
        // Não HttpOnly de propósito: o cliente lê este valor para X-CSRF-Token.
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

/**
 * Opções usadas ao limpar cookies; devem bater com as opções usadas no set.
 *
 * @returns {{path: string, sameSite: string, secure: boolean}}
 */
export function clearCookieOptions() {
    return {
        ...baseCookieOptions(),
    };
}
```

`backend/src/utils/csrf.js`:

```js
/**
 * Trecho: backend/src/utils/csrf.js
 * Objetivo: gerar token CSRF aleatório para o padrão double-submit-cookie.

 */

import crypto from "node:crypto";

/**
 * Gera um token CSRF em hexadecimal.
 *
 * @returns {string}
 */
export function createCsrfToken() {
    return crypto.randomBytes(24).toString("hex");
}
```

### 3.2) `requireAuth`

`backend/src/middlewares/requireAuth.js`:

```js
/**
 * Trecho: backend/src/middlewares/requireAuth.js
 * Objetivo: proteger rotas privadas validando o JWT recebido via cookie HttpOnly.

 */

import jwt from "jsonwebtoken";

/**
 * Middleware de autenticação.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function requireAuth(req, res, next) {
    // O cookie "token" é enviado automaticamente pelo browser quando withCredentials=true.
    const token = req.cookies?.token;

    if (!token) {
        // 401 = não autenticado (sem sessão).
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Sessão em falta" },
        });
    }

    try {
        // Verifica assinatura e expiração do JWT usando o segredo do backend.
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos o userId em req.auth para os handlers seguintes.
        req.auth = { userId: payload.userId };
        return next();
    } catch {
        // 401 novamente: token existe mas é inválido/expirado.
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Sessão inválida" },
        });
    }
}
```

### 3.3) `requireCsrf` + preflight/CORS

Antes do snippet, fixa estas duas regras práticas:

- `OPTIONS` (preflight) deve passar para o browser conseguir avançar para a mutação real.
- CORS e CSRF resolvem problemas diferentes: CORS controla origem; CSRF valida intenção da mutação autenticada.

`backend/src/middlewares/requireCsrf.js`:

```js
/**
 * Trecho: backend/src/middlewares/requireCsrf.js
 * Objetivo: bloquear mutações sem prova CSRF (header + cookie a coincidir).

 */

// Métodos seguros não alteram estado e não exigem token CSRF.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Middleware CSRF (double submit cookie).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function requireCsrf(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    // Cookie vem automaticamente no pedido; header vem explicitamente do frontend.
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.get("x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        // 403 = pedido entendido, mas recusado por política de segurança.
        return res.status(403).json({
            error: { code: "CSRF_INVALID", message: "CSRF token inválido" },
        });
    }

    return next();
}
```

### 3.4) Rotas de autenticação (`register`/`login`/`me`/`logout`)

`backend/src/routes/auth.routes.js`:

```js
/**
 * Trecho: backend/src/routes/auth.routes.js
 * Objetivo: gerir ciclo de sessão (register/login/me/logout) com cookies e JWT.

 */

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireCsrf } from "../middlewares/requireCsrf.js";
import {
    authCookieOptions,
    csrfCookieOptions,
    clearCookieOptions,
} from "../utils/cookies.js";
import { createCsrfToken } from "../utils/csrf.js";

const router = Router();
const SALT_ROUNDS = 10;

/**
 * Assina JWT com identificação mínima do utilizador.
 *
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Normaliza email para evitar duplicados com maiúsculas/espaços.
 *
 * @param {unknown} email
 * @returns {string}
 */
function normalizeEmail(email) {
    return String(email ?? "")
        .trim()
        .toLowerCase();
}

/**
 * Validação de input para registo.
 *
 * @param {{username: unknown, email: unknown, password: unknown}} param0
 * @returns {string | null}
 */
function basicValidation({ username, email, password }) {
    if (!username || String(username).trim().length < 3) {
        return "Username deve ter pelo menos 3 caracteres";
    }

    if (!email || !normalizeEmail(email).includes("@")) {
        return "Email inválido";
    }

    if (!password || String(password).length < 6) {
        return "Password deve ter pelo menos 6 caracteres";
    }

    return null;
}

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body ?? {};
    const validationError = basicValidation({ username, email, password });

    if (validationError) {
        // 422 = estrutura do pedido válida, mas dados falham regras de negócio.
        return res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: validationError },
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const alreadyExists = await User.findOne({ email: normalizedEmail });

    if (alreadyExists) {
        // 409 = conflito com estado atual (email já existe).
        return res.status(409).json({
            error: { code: "DUPLICATE_EMAIL", message: "Email já registado" },
        });
    }

    // bcrypt é intencionalmente "lento" para dificultar brute force offline.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        username: String(username).trim(),
        email: normalizedEmail,
        passwordHash,
    });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    // token -> HttpOnly; csrfToken -> legível para o frontend (header CSRF).
    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
        // 422 para payload incompleto.
        return res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Credenciais inválidas",
            },
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        // 401 não revela se o email existe ou não (evita enumeração fácil).
        return res.status(401).json({
            error: { code: "INVALID_CREDENTIALS", message: "Login inválido" },
        });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
        return res.status(401).json({
            error: { code: "INVALID_CREDENTIALS", message: "Login inválido" },
        });
    }

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(200).json({ user });
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.auth.userId);

    if (!user) {
        // Pode acontecer se conta foi apagada depois do token ter sido emitido.
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    return res.status(200).json({ user });
});

router.post("/logout", requireAuth, requireCsrf, (_req, res) => {
    // Clear usa as mesmas opções-base para garantir que o browser remove mesmo os cookies.
    res.clearCookie("token", clearCookieOptions());
    res.clearCookie("csrfToken", clearCookieOptions());
    return res.status(200).json({ ok: true });
});

export default router;
```

### 3.5) `app.js` com CORS, cookies e ordem correta de middlewares

`backend/src/app.js`:

```js
/**
 * Trecho: backend/src/app.js
 * Objetivo: montar a pipeline do Express na ordem certa (CORS -> parsers -> rotas -> 404 -> erros).

 */

import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { requireCsrf } from "./middlewares/requireCsrf.js";

const app = express();
const uploadsDir = path.join(process.cwd(), "uploads");

// CORS tem de vir cedo para responder corretamente a preflight e pedidos cross-origin.
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        // Sem credentials=true os cookies de sessão não viajam entre frontend e backend.
        credentials: true,
    }),
);
// Parser de JSON para req.body em endpoints application/json.
app.use(express.json());
// Parser de cookies para req.cookies (necessário em auth/csrf).
app.use(cookieParser());
// Ficheiros estáticos de avatar servidos em /uploads/...
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
});

// Login/register/me não passam no guard global de CSRF.
app.use("/api/auth", authRoutes);

// A partir daqui, todas as mutações exigem X-CSRF-Token válido.
app.use(requireCsrf);

app.use("/api/favorites", favoritesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, res) => {
    res.status(404).json({
        error: { code: "NOT_FOUND", message: "Rota inexistente" },
    });
});

app.use((err, _req, res, next) => {
    if (!err) {
        return next();
    }

    if (res.headersSent) {
        return next(err);
    }

    const isUploadError =
        err.code === "LIMIT_FILE_SIZE" ||
        err.code === "LIMIT_UNEXPECTED_FILE" ||
        err.name === "MulterError";

    const status = err.status ?? (err.code === "LIMIT_FILE_SIZE" ? 413 : 400);

    const message =
        err.message || (isUploadError ? "Erro no upload" : "Pedido inválido");

    // ATENÇÃO (armadilha): erros de upload podem parecer "genéricos".
    // Nota: mantemos resposta curta aqui para ficar alinhada com o enunciado.
    return res.status(status).json({
        error: {
            code: isUploadError ? "UPLOAD_ERROR" : "BAD_REQUEST",
            message,
        },
    });
});

export default app;
```

### 3.6) Tabela de diagnóstico rápido (401/403/422/500)

| Status | Se isto acontecer...                      | Verifica primeiro...                            |
| ------ | ----------------------------------------- | ----------------------------------------------- |
| 401    | login parece feito mas rota privada falha | cookie `token`, `withCredentials`, `JWT_SECRET` |
| 403    | mutações falham (`POST`/`DELETE`)         | header `X-CSRF-Token` e cookie `csrfToken`      |
| 422    | backend recusa dados do formulário        | payload (campos obrigatórios, tipos, limites)   |
| 500    | erro interno inesperado                   | logs do backend + último request no Network     |

### Checkpoint 3

1. `POST /api/auth/register` cria utilizador e devolve `user`.
2. Browser/cliente recebe cookies `token` (HttpOnly) e `csrfToken`.
3. `GET /api/auth/me` devolve o utilizador autenticado.
4. `POST /api/auth/logout` só funciona com CSRF header válido.

Critérios binários de validação (debug guiado):

- Se `/api/auth/me` devolver `401`, verifica: cookie `token` presente + `withCredentials: true` + `JWT_SECRET` estável.
- Se qualquer mutação devolver `403`, verifica: cookie `csrfToken` presente + header `X-CSRF-Token` a coincidir.
- Se `logout` devolver `200` mas sessão continuar, verifica: `clearCookie` usa as mesmas opções-base do `res.cookie`.

### Erros comuns (CORS/cookies/CSRF)

- `cors` sem `credentials: true`.
- frontend sem `withCredentials: true` no Axios.
- `CLIENT_ORIGIN` diferente da origem real do frontend.
- tentar mutações sem enviar `X-CSRF-Token`.
- limpar cookie com `path` diferente do usado no `res.cookie`.

---

## 4) Backend: modelos e rotas (users, teams, favorites)

### O que é

Agora fechamos os recursos de negócio: favoritos por utilizador, equipas com paginação e upload de avatar.

### Teoria

1. **Conceitos-chave**

- **Recurso**: entidade da API com identidade e regras (favorites, teams, users).
- **Validação**: verificar dados de entrada antes de persistir.
- **Conflito (409)**: pedido válido na forma, mas em choque com estado atual (ex.: favorito já existe).
- **Schema vs validação de rota**: schema garante integridade do modelo; rota devolve erros mais claros ao cliente.

2. **Como funciona “por baixo”**

- Favorites ficam no documento `User`, como array numérico.
- Teams guardam `userId`, nome e lista `pokemonIds`.
- Paginação usa `skip/limit`: “salta N e devolve M”.
- Pesquisa por `q` com `$regex` e `i` faz correspondência case-insensitive.
- Upload usa `multipart/form-data`: ficheiro vai em partes binárias, não em JSON puro.

3. **Porque estamos a fazer assim neste projeto**

- O contrato simples de favorites facilita compatibilidade com Ficha 05.
- Teams 1..6 reflete regra natural da Pokédex (equipa limitada).
- Upload de avatar fecha o ciclo de integração frontend/backend com ficheiros reais.
- Limitar `q` protege de regex demasiado pesada e pedidos abusivos.

4. **Erros comuns e sintomas**

- `422 id inválido` em favorites -> `id` veio string vazia/não inteiro.
- `409 Pokémon já é favorito` -> UI tentou adicionar duplicado.
- Team criada com IDs repetidos -> deduplicação ausente no cliente ou servidor.
- Upload retorna 413 -> ficheiro excede limite configurado.
- URL de avatar guarda path errado -> imagem não abre no browser.

5. **Boas práticas e segurança**

- Validar sempre no servidor, mesmo que frontend valide antes.
- Limitar tamanho de inputs (`q`, upload) para reduzir abuso.
- Não confiar apenas na extensão do ficheiro; tipo/mimetype também importa.
- Associar sempre dados ao `userId` autenticado para isolamento por utilizador.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - shape de paginação

```json
{
    "items": [],
    "total": 27,
    "page": 2,
    "limit": 6,
    "pages": 5
}
```

> Exemplo isolado - favorites canónico

```txt
POST /api/favorites  body { "id": 150 } -> { "id": 150 }
```

### Porque fazemos isto

A autenticação sem dados por utilizador não resolve o objetivo da app. Esta secção liga sessão + dados persistentes.

### 4.1) Contrato de favorites (único)

- `GET /api/favorites` -> `number[]`
- `POST /api/favorites` com body `{ "id": number }` -> `{ "id": number }`
- `DELETE /api/favorites/:id` -> `{ "id": number }`

`backend/src/routes/favorites.routes.js`:

```js
/**
 * Trecho: backend/src/routes/favorites.routes.js
 * Objetivo: gerir favoritos por utilizador mantendo contrato compatível com a Ficha 05.

 */

import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

/**
 * Converte input para inteiro positivo.
 *
 * @param {unknown} value
 * @returns {number | null}
 */
function parsePositiveInt(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

router.get("/", requireAuth, async (req, res) => {
    // GET devolve array de IDs, sem envelope extra (contrato canónico da ficha).
    const user = await User.findById(req.auth.userId).select("favorites");

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    return res.status(200).json(user.favorites);
});

router.post("/", requireAuth, async (req, res) => {
    const id = parsePositiveInt(req.body?.id);

    if (!id) {
        // 422 para body inválido (cliente consegue corrigir o pedido).
        return res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: "id inválido" },
        });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    if (user.favorites.includes(id)) {
        // 409 quando o mesmo favorito já existe.
        return res.status(409).json({
            error: { code: "DUPLICATE_KEY", message: "Pokémon já é favorito" },
        });
    }

    user.favorites.push(id);
    await user.save();

    return res.status(201).json({ id });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
        // 400 porque o parâmetro de rota já é inválido à partida.
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "id inválido" },
        });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    if (!user.favorites.includes(id)) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Favorito não existe" },
        });
    }

    user.favorites = user.favorites.filter((favId) => favId !== id);
    await user.save();

    return res.status(200).json({ id });
});

export default router;
```

### 4.2) Modelo Team e rotas de equipas

`backend/src/models/Team.js`:

```js
/**
 * Trecho: backend/src/models/Team.js
 * Objetivo: definir a estrutura de dados de uma equipa no MongoDB.

 */

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            // Índice acelera listagens por utilizador.
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        pokemonIds: {
            type: [Number],
            validate: {
                // Regra de negócio: equipa entre 1 e 6 IDs válidos.
                validator: (arr) =>
                    Array.isArray(arr) &&
                    arr.length >= 1 &&
                    arr.length <= 6 &&
                    arr.every((id) => Number.isInteger(id) && id > 0),
                message: "pokemonIds deve ter entre 1 e 6 ids válidos",
            },
        },
    },
    { timestamps: true },
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
```

`backend/src/routes/teams.routes.js`:

```js
/**
 * Trecho: backend/src/routes/teams.routes.js
 * Objetivo: criar/listar/apagar equipas com paginação e pesquisa por nome.

 */

import { Router } from "express";
import mongoose from "mongoose";
import Team from "../models/Team.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

/**
 * Valida inteiros positivos para query params de paginação.
 *
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
function parsePositiveInt(value, fallback) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return fallback;
    return n;
}

router.get("/", requireAuth, async (req, res) => {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
    // Limite de 50 chars protege de regex exagerada sem complicar a ficha.
    const q = String(req.query.q ?? "")
        .trim()
        .slice(0, 50);

    const filter = { userId: req.auth.userId };
    if (q) {
        // Pesquisa case-insensitive por nome.
        filter.name = { $regex: q, $options: "i" };
    }

    // Skip calcula quantos documentos saltar antes de ler a página atual.
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Team.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Team.countDocuments(filter),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({ items, total, page, limit, pages });
});

router.post("/", requireAuth, async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const pokemonIdsRaw = Array.isArray(req.body?.pokemonIds)
        ? req.body.pokemonIds
        : [];

    const pokemonIds = [...new Set(pokemonIdsRaw.map(Number))].filter(
        // Remove duplicados e rejeita valores não inteiros/<=0.
        (id) => Number.isInteger(id) && id > 0,
    );

    if (!name) {
        return res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: "name é obrigatório" },
        });
    }

    if (pokemonIds.length < 1 || pokemonIds.length > 6) {
        // 422 por regra de negócio da equipa Pokémon.
        return res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "pokemonIds deve ter entre 1 e 6 elementos",
            },
        });
    }

    const team = await Team.create({
        userId: req.auth.userId,
        name,
        pokemonIds,
    });

    return res.status(201).json(team);
});

router.delete("/:id", requireAuth, async (req, res) => {
    // Validação explícita evita CastError e devolve feedback imediato ao cliente.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "id de equipa inválido" },
        });
    }

    const team = await Team.findOne({
        _id: req.params.id,
        userId: req.auth.userId,
    });

    if (!team) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Equipa não encontrada" },
        });
    }

    await team.deleteOne();

    return res.status(200).json({ id: req.params.id });
});

export default router;
```

### 4.3) Upload de avatar (obrigatório)

Cria a pasta `backend/uploads/` com um ficheiro `backend/uploads/.gitkeep`.

`backend/src/routes/users.routes.js`:

```js
/**
 * Trecho: backend/src/routes/users.routes.js
 * Objetivo: receber upload de avatar e guardar URL pública no perfil do utilizador.

 */

import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// Diretório único de uploads; usado aqui e no express.static do app.js.
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    // Guarda sempre na pasta uploads da raiz do backend.
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        // Nome pseudo-único para reduzir colisões entre uploads.
        const ext =
            path.extname(file.originalname || "").toLowerCase() || ".png";
        cb(
            null,
            `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
        );
    },
});

const upload = multer({
    storage,
    // Limite de 2MB evita uploads gigantes em ambiente pedagógico.
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        // ATENÇÃO (armadilha): mimetype pode ser falsificado; aqui é filtro básico de sala de aula.
        // Nota: não corrigimos aqui para manter o snippet alinhado com o enunciado.
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Ficheiro inválido: envia uma imagem"));
            return;
        }
        cb(null, true);
    },
});

router.post(
    "/avatar",
    requireAuth,
    upload.single("avatar"),
    async (req, res) => {
        if (!req.file) {
            // 422 quando o campo avatar não foi enviado.
            return res.status(422).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "avatar é obrigatório",
                },
            });
        }

        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({
                error: {
                    code: "USER_NOT_FOUND",
                    message: "Utilizador não existe",
                },
            });
        }

        user.avatarUrl = `/uploads/${req.file.filename}`;
        await user.save();

        // Mantemos contrato simples: devolver apenas a URL pública.
        return res.status(200).json({ avatarUrl: user.avatarUrl });
    },
);

export default router;
```

### Checkpoint 4

- `GET /api/favorites` já devolve favoritos do utilizador autenticado.
- `GET /api/teams?page=1&limit=5&q=` devolve `{ items, total, page, limit, pages }`.
- `POST /api/users/avatar` grava imagem e devolve `avatarUrl`.

---

## 5) Frontend: refactor obrigatório para pages/components

### O que é

Esta etapa separa ficheiros de rota (`pages`) dos componentes reutilizáveis (`components`).

### Teoria

1. **Conceitos-chave**

- **Refactor**: reorganizar sem mudar comportamento funcional esperado.
- **Rota de página**: componente que representa um ecrã completo ligado ao URL.
- **Componente reutilizável**: bloco UI reutilizado em várias páginas (cards, layout, loaders).

2. **Como funciona “por baixo”**

- O React Router instancia componentes por correspondência de rota.
- `pages` tendem a receber dados/estado global e orquestrar componentes.
- `components` recebem props e focam-se em apresentação/interação local.
- Quando mudas caminhos físicos, qualquer import antigo quebra imediatamente no build.

3. **Porque estamos a fazer assim neste projeto**

- Esta separação evita “ficheiro tudo-em-um”.
- Deixa o router mais legível (`App.jsx` mostra claramente ecrãs da app).
- Facilita onboarding: quem entra no projeto percebe logo onde editar cada tipo de ficheiro.

4. **Erros comuns e sintomas**

- Página movida mas import antigo mantido -> erro de compilação.
- Código de rota dentro de componente reutilizável -> acoplamento e bugs de navegação.
- `NotFound` em pasta errada -> fallback não renderiza como esperado.
- Misturar names iguais em duas pastas -> imports ambíguos/confusos.

5. **Boas práticas e segurança**

- Fazer refactor em passos pequenos e testar cada passo.
- Atualizar imports logo após cada `mv`.
- Não duplicar ficheiros “temporários” com lógica diferente para evitar drift.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - decisão simples

```txt
É rota com URL próprio? -> pages/
É peça reaproveitada em várias páginas? -> components/
```

> Exemplo isolado - organização

```txt
App.jsx usa pages
pages usam components + services + context
```

### Porque fazemos isto

Sem esta separação, o projeto cresce confuso e os imports ficam incoerentes.

### 5.1) Migrar as páginas que já existem

No root do projeto:

```bash
# Executa estes comandos na pasta indicada imediatamente acima do bloco.
# Mantém a ordem dos comandos para evitar erros de setup.
# Este mkdir cria a pasta de pages (rotas) sem mexer nos componentes reutilizáveis.
mkdir -p frontend/src/pages
# Move a rota Home para pages/.
mv frontend/src/components/PokemonListPage.jsx frontend/src/pages/PokemonListPage.jsx
# Move a rota de detalhe para pages/.
mv frontend/src/components/PokemonDetailsPage.jsx frontend/src/pages/PokemonDetailsPage.jsx
# Move a rota de favoritos para pages/.
mv frontend/src/components/FavoritesPage.jsx frontend/src/pages/FavoritesPage.jsx
# Move a rota de fallback 404 para pages/.
mv frontend/src/components/NotFound.jsx frontend/src/pages/NotFound.jsx
```

### 5.2) Criar novas páginas obrigatórias

Cria também em `frontend/src/pages/`:

- `LoginPage.jsx`
- `RegisterPage.jsx`
- `TeamsPage.jsx`
- `ProfilePage.jsx`

### 5.3) Atualizar imports do router

`frontend/src/App.jsx` vai passar a importar páginas de `@/pages/...`.

### Checkpoint 5

- A app continua a abrir sem erros de import.
- Rota `*` usa `@/pages/NotFound.jsx`.
- `components/` já não contém páginas de rota.

### Erros comuns (refactor de pastas)

- mover ficheiro e esquecer de corrigir imports no `App.jsx`.
- manter `NotFound` em `components` mas importar de `pages`.
- misturar componentes de UI com páginas na mesma pasta.

---

## 6) Frontend: Axios (`apiClient`) + services

### O que é

Vamos centralizar chamadas HTTP num cliente Axios único.

### Teoria

1. **Conceitos-chave**

- **Axios instance**: cliente HTTP configurado uma vez e reutilizado.
- **`baseURL`**: prefixo comum de todos os endpoints.
- **`withCredentials`**: permite envio/receção de cookies em pedidos cross-origin.
- **Interceptor**: função que corre antes/depois dos pedidos para aplicar lógica transversal.

2. **Como funciona “por baixo”**

- `axios.create(...)` devolve objeto com config base.
- Em cada request mutável, o interceptor lê `csrfToken` do cookie e injeta header.
- Se uma resposta falha, o erro Axios traz `err.response.status` quando há resposta HTTP.
- Sem `baseURL`, cada chamada precisa URL completa e o risco de inconsistência aumenta.

3. **Porque estamos a fazer assim neste projeto**

- Evitas repetir configuração em todos os services.
- Garante comportamento uniforme de cookies + CSRF em auth, favorites, teams e users.
- Services ficam curtos e focados no contrato de cada recurso.

4. **Erros comuns e sintomas**

- Pedidos vão para host errado -> `VITE_API_URL` em falta/errado.
- Sessão não mantém -> `withCredentials` ausente.
- 403 em mutações -> interceptor não adicionou `X-CSRF-Token`.
- Tratamento genérico de erro -> UI não distingue 401 de 403.

5. **Boas práticas e segurança**

- Centralizar clientes HTTP reduz bugs de configuração.
- Não codificar segredos no frontend; usar apenas URL pública de API.
- Tratar respostas de erro por status para mensagens úteis e debug rápido.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - leitura de erro Axios

```js
/**
 * Trecho: snippet do enunciado
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

if (err.response?.status === 401) {
    // sessão em falta
}
```

> Exemplo isolado - sem interceptor (o que evitar)

```txt
Cada POST/DELETE lembra-se "à mão" de mandar CSRF -> probabilidade alta de esqueceres um.
```

### Porque fazemos isto

Evitas duplicação de `baseURL`, `withCredentials` e header CSRF em cada request.

### 6.1) Variáveis de ambiente frontend

`frontend/.env`:

```env
# URL base do backend usada pelo Vite no cliente (axios baseURL).
VITE_API_URL=http://localhost:3000
```

`frontend/.env.example`:

```env
# Exemplo da URL base do backend para quem clonar o projeto.
VITE_API_URL=http://localhost:3000
```

### 6.2) Instalar Axios

No `frontend/`:

```bash
# Executa estes comandos na pasta indicada imediatamente acima do bloco.
# Mantém a ordem dos comandos para evitar erros de setup.
npm install axios
```

### 6.3) Criar `apiClient.js`

`frontend/src/services/apiClient.js`:

```js
/**
 * Trecho: frontend/src/services/apiClient.js
 * Objetivo: centralizar chamadas HTTP e injetar CSRF automaticamente nas mutações.

 */

import axios from "axios";

/**
 * Lê valor de um cookie por nome.
 *
 * @param {string} name
 * @returns {string | null}
 */
function getCookie(name) {
    const chunk = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    if (!chunk) return null;
    return decodeURIComponent(chunk.split("=").slice(1).join("="));
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    // Sem isto o browser não envia/recebe cookies cross-origin.
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toLowerCase();
    // Só métodos que alteram estado precisam de prova CSRF.
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
        const csrf = getCookie("csrfToken");
        if (csrf) {
            config.headers = config.headers ?? {};
            // Header esperado no backend (requireCsrf).
            config.headers["X-CSRF-Token"] = csrf;
        }
    }

    return config;
});

export default api;
```

### 6.4) Services canónicos

`frontend/src/services/authApi.js`:

```js
/**
 * Trecho: frontend/src/services/authApi.js
 * Objetivo: encapsular endpoints de autenticação para manter páginas limpas.

 */

import api from "./apiClient.js";

/**
 * Regista utilizador e inicia sessão (cookies definidos pelo backend).
 *
 * @param {{username: string, email: string, password: string}} payload
 * @returns {Promise<any>}
 */
export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

/**
 * Faz login e recebe sessão por cookie.
 *
 * @param {{email: string, password: string}} payload
 * @returns {Promise<any>}
 */
export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
}

/**
 * Tenta restaurar sessão existente.
 *
 * @returns {Promise<any>}
 */
export async function restoreSession() {
    const res = await api.get("/api/auth/me");
    return res.data;
}

/**
 * Termina sessão atual.
 *
 * @returns {Promise<any>}
 */
export async function logout() {
    const res = await api.post("/api/auth/logout");
    return res.data;
}
```

`frontend/src/services/favoritesApi.js`:

```js
/**
 * Trecho: frontend/src/services/favoritesApi.js
 * Objetivo: isolar o contrato canónico de favoritos num único módulo.

 */

import api from "./apiClient.js";

/**
 * GET /api/favorites -> number[]
 *
 * @returns {Promise<number[]>}
 */
export async function getFavorites() {
    const res = await api.get("/api/favorites");
    return res.data;
}

/**
 * POST /api/favorites { id } -> { id }
 *
 * @param {number} id
 * @returns {Promise<{id: number}>}
 */
export async function addFavorite(id) {
    const res = await api.post("/api/favorites", { id });
    return res.data;
}

/**
 * DELETE /api/favorites/:id -> { id }
 *
 * @param {number} id
 * @returns {Promise<{id: number}>}
 */
export async function removeFavorite(id) {
    const res = await api.delete(`/api/favorites/${id}`);
    return res.data;
}
```

`frontend/src/services/teamsApi.js`:

```js
/**
 * Trecho: frontend/src/services/teamsApi.js
 * Objetivo: centralizar chamadas HTTP das equipas com paginação e CRUD básico.

 */

import api from "./apiClient.js";

/**
 * Lista equipas paginadas.
 *
 * @param {{page?: number, limit?: number, q?: string}} [param0]
 * @returns {Promise<any>}
 */
export async function listTeams({ page = 1, limit = 6, q = "" } = {}) {
    const res = await api.get("/api/teams", {
        params: { page, limit, q },
    });
    return res.data;
}

/**
 * Cria uma nova equipa.
 *
 * @param {{name: string, pokemonIds: number[]}} payload
 * @returns {Promise<any>}
 */
export async function createTeam(payload) {
    const res = await api.post("/api/teams", payload);
    return res.data;
}

/**
 * Remove equipa por ID.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function removeTeam(id) {
    const res = await api.delete(`/api/teams/${id}`);
    return res.data;
}
```

`frontend/src/services/usersApi.js`:

```js
/**
 * Trecho: frontend/src/services/usersApi.js
 * Objetivo: subir avatar via multipart/form-data.

 */

import api from "./apiClient.js";

/**
 * Faz upload de avatar.
 *
 * @param {File} file
 * @returns {Promise<{avatarUrl: string}>}
 */
export async function uploadAvatar(file) {
    const formData = new FormData();
    // O nome do campo tem de bater com upload.single("avatar") no backend.
    formData.append("avatar", file);

    // Sem header manual: o browser/axios definem o boundary multipart corretamente.
    const res = await api.post("/api/users/avatar", formData);

    return res.data;
}
```

### Checkpoint 6

- Não há `fetch` para backend nos serviços principais.
- Todas as mutações passam pelo `apiClient` com CSRF header automático.
- `VITE_API_URL` é usado de forma consistente.

---

## 7) Frontend: Context atualizado (compatível com Ficha 05) + `authReady`

### O que é

Vamos evoluir o `PokedexContext` para incluir autenticação sem quebrar as páginas da Ficha 05.

### Teoria

1. **Conceitos-chave**

- **Context API**: mecanismo React para estado global sem prop drilling excessivo.
- **Provider**: componente que expõe o estado/funções para a árvore abaixo.
- **`authReady` pattern**: flag que indica se a restauração de sessão já terminou.
- **`useEffect` + dependências**: sincronização com efeitos externos (API, timers, subscrições).

2. **Como funciona “por baixo”**

- No primeiro render, a app ainda não sabe se há sessão válida.
- `bootstrap()` carrega dados base e tenta `restoreSession()`.
- Enquanto isso, `authReady` fica `false`; rotas protegidas devem esperar.
- `useCallback` estabiliza referência de funções; `useMemo` evita recomputar o objeto `value` sem necessidade.

3. **Porque estamos a fazer assim neste projeto**

- Evita redirecionar para login antes de confirmar sessão existente.
- Mantém compatibilidade com páginas da Ficha 05 (pokemon/favorites continuam no contexto).
- Centraliza login/logout/toggleFavorite para toda a app usar o mesmo fluxo.

4. **Erros comuns e sintomas**

- `usePokedex` fora de provider -> erro imediato em runtime.
- Redirect “falso” para login no refresh -> falta de `authReady` no fluxo.
- `useEffect` em loop -> dependências instáveis.
- Favoritos desatualizados -> não recarregar após login/restauração.

5. **Boas práticas e segurança**

- Context deve guardar estado de sessão mínimo necessário, não dados sensíveis em excesso.
- Separar funções assíncronas por responsabilidade (`bootstrap`, `login`, `logout`).
- Tratar exceções por tipo/status para UI mais previsível.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - sem `authReady`

```txt
Render inicial: user = null
ProtectedRoute interpreta como "não autenticado" e redireciona cedo demais.
```

> Exemplo isolado - com `authReady`

```txt
Enquanto authReady=false: mostra loading.
Só decide redirecionar quando a verificação de sessão termina.
```

### Porque fazemos isto

Sem `authReady`, as rotas protegidas podem redirecionar antes da restauração de sessão acabar.

### 7.1) Substituir `frontend/src/context/PokedexContext.jsx`

```jsx
/**
 * Trecho: frontend/src/context/PokedexContext.jsx
 * Objetivo: concentrar estado global da Pokédex + sessão + favoritos do utilizador.

 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { fetchPokemonList } from "@/services/pokeApi.js";
import * as authApi from "@/services/authApi.js";
import * as favoritesApi from "@/services/favoritesApi.js";

const POKEMON_LIMIT = 151;

const PokedexContext = createContext(null);

/**
 * Provider global do estado da aplicação.
 *
 * @param {{children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
export function PokedexProvider({ children }) {
    const [pokemon, setPokemon] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);
    const [error, setError] = useState(null);

    const refreshSession = useCallback(async () => {
        // Tenta reaproveitar cookie de sessão existente (sem guardar token no frontend).
        const data = await authApi.restoreSession();
        setUser(data.user);
        return data.user;
    }, []);

    const bootstrap = useCallback(async () => {
        // Estado inicial de loading para impedir decisões de UI prematuras.
        setLoading(true);
        setError(null);

        try {
            const pokemonList = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(pokemonList);

            let restoredUser = null;

            try {
                restoredUser = await refreshSession();
            } catch (err) {
                // 401 é esperado quando não há sessão; outros erros devem propagar.
                if (err?.response?.status !== 401) {
                    throw err;
                }
                setUser(null);
            }

            if (restoredUser) {
                const favoriteIds = await favoritesApi.getFavorites();
                setFavorites(favoriteIds);
            } else {
                setFavorites([]);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar dados iniciais.");
        } finally {
            setLoading(false);
            // authReady evita redirect prematuro no ProtectedRoute.
            setAuthReady(true);
        }
    }, [refreshSession]);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = useCallback(async ({ email, password }) => {
        const data = await authApi.login({ email, password });
        setUser(data.user);

        // Após login, carregamos favoritos reais do backend para sincronizar UI.
        const favoriteIds = await favoritesApi.getFavorites();
        setFavorites(favoriteIds);

        return data.user;
    }, []);

    const register = useCallback(async ({ username, email, password }) => {
        const data = await authApi.register({ username, email, password });
        setUser(data.user);
        setFavorites([]);
        return data.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            // Mesmo que o backend falhe, limpamos estado local para não manter UI "autenticada".
            setUser(null);
            setFavorites([]);
        }
    }, []);

    const toggleFavorite = useCallback(
        async (pokemonId) => {
            if (!user) {
                throw new Error("Tens de fazer login para gerir favoritos.");
            }

            if (favorites.includes(pokemonId)) {
                await favoritesApi.removeFavorite(pokemonId);
                // Atualização otimista simples após resposta do backend.
                setFavorites((prev) => prev.filter((id) => id !== pokemonId));
            } else {
                await favoritesApi.addFavorite(pokemonId);
                setFavorites((prev) =>
                    prev.includes(pokemonId) ? prev : [...prev, pokemonId],
                );
            }
        },
        [favorites, user],
    );

    const reloadFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([]);
            return;
        }

        const favoriteIds = await favoritesApi.getFavorites();
        setFavorites(favoriteIds);
    }, [user]);

    const value = useMemo(
        () => ({
            pokemon,
            favorites,
            user,
            loading,
            error,
            authReady,
            login,
            register,
            logout,
            toggleFavorite,
            reload: bootstrap,
            refreshSession,
            reloadFavorites,
        }),
        [
            pokemon,
            favorites,
            user,
            loading,
            error,
            authReady,
            login,
            register,
            logout,
            toggleFavorite,
            bootstrap,
            refreshSession,
            reloadFavorites,
        ],
    );

    // Provider expõe estado + ações para qualquer componente descendente.
    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}

/**
 * Hook de consumo do contexto com guard para uso fora do Provider.
 *
 * @returns {any}
 * @throws {Error}
 */
export function usePokedex() {
    const ctx = useContext(PokedexContext);

    if (!ctx) {
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    }

    return ctx;
}
```

### Checkpoint 7

- App arranca mesmo sem sessão (fica `user = null`, `authReady = true`).
- Com sessão ativa, favoritos são carregados do backend.
- `toggleFavorite` atualiza estado sem “setState no-op”.

---

## 8) Frontend: Router + ProtectedRoute + navegação condicional

### O que é

Nesta etapa protegemos páginas privadas e mostramos links certos conforme login.

### Teoria

1. **Conceitos-chave**

- **React Router v6**: sistema de roteamento declarativo com `Routes`/`Route`.
- **Nested routes**: rotas filhas renderizadas dentro de um layout pai via `Outlet`.
- **`Navigate`**: redirecionamento declarativo.
- **ProtectedRoute**: guarda de autenticação para rotas privadas.

2. **Como funciona “por baixo”**

- O router compara o URL atual com a árvore de rotas.
- Se existir rota pai com `element={<Layout/>}`, o `Outlet` define onde entra a página filha.
- `Navigate` troca a localização sem recarregar a página.
- `useLocation` permite guardar origem para voltar após login.

3. **Porque estamos a fazer assim neste projeto**

- A app precisa de áreas públicas (home/login/registo) e privadas (favoritos/equipas/perfil).
- Layout comum evita duplicar navegação em todas as páginas.
- Redireção pós-login melhora fluxo do utilizador (volta para onde queria entrar).

4. **Erros comuns e sintomas**

- Esquecer `Outlet` no Layout -> páginas filhas não aparecem.
- Rota privada sem guard -> acesso direto por URL sem login.
- `Navigate` sem `replace` em certos fluxos -> histórico confuso ao usar botão “voltar”.
- NotFound mal ligado -> rota inválida cai em página branca/erro.

5. **Boas práticas e segurança**

- Segurança real continua no backend; ProtectedRoute é UX/controle no cliente.
- Manter árvore de rotas explícita e legível.
- Evitar lógica de autenticação dispersa por múltiplas páginas.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - regra mental

```txt
Frontend protege experiência.
Backend protege dados.
Precisamos dos dois.
```

> Exemplo isolado - nested routes

```txt
/ (Layout)
  /login
  /favoritos
```

### Porque importa (porque fazemos isto)

Evitas acesso direto a páginas privadas por URL e eliminas estado visual inconsistente na navbar.

### 8.0) Mapa de rotas públicas vs privadas

```txt
Públicas: /, /pokemon/:id, /login, /registo
Privadas: /favoritos, /equipas, /perfil
Regra: privadas passam sempre por <ProtectedRoute />
```

### Passos

### 8.1) Criar `ProtectedRoute`

`frontend/src/components/ProtectedRoute.jsx`:

```jsx
/**
 * Trecho: frontend/src/components/ProtectedRoute.jsx
 * Objetivo: bloquear rotas privadas até existir sessão válida.

 */

import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import { usePokedex } from "@/context/PokedexContext.jsx";

/**
 * Guarda de rota privada.
 *
 * @param {{children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children }) {
    const { user, authReady } = usePokedex();
    const location = useLocation();

    if (!authReady) {
        // Evita redirecionar para login antes de acabar restoreSession.
        return <LoadingSpinner />;
    }

    if (!user) {
        // Guardamos origem para possível redireção pós-login.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
```

### 8.2) Atualizar `Layout` para links por estado de login

`frontend/src/components/Layout.jsx`:

```jsx
/**
 * Trecho: frontend/src/components/Layout.jsx
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

import { NavLink, Outlet } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function Layout() {
    const { pokemon, favorites, user, logout } = usePokedex();

    async function handleLogout() {
        try {
            await logout();
        } catch (err) {
            console.error(err);
            window.alert("Não foi possível terminar sessão.");
        }
    }

    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Sessão, equipas e perfil com avatar
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total
                            <strong>{pokemon.length || 151}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>{favorites.length}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Utilizador
                            <strong>
                                {user ? user.username : "visitante"}
                            </strong>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="type-filter" aria-label="Navegação principal">
                <div className="type-filter__buttons">
                    <NavLink to="/" end className="type-filter__button">
                        Home
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink
                                to="/favoritos"
                                className="type-filter__button"
                            >
                                Favoritos
                            </NavLink>
                            <NavLink
                                to="/equipas"
                                className="type-filter__button"
                            >
                                Equipas
                            </NavLink>
                            <NavLink
                                to="/perfil"
                                className="type-filter__button"
                            >
                                Perfil
                            </NavLink>
                            <button
                                type="button"
                                className="type-filter__button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="type-filter__button"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/registo"
                                className="type-filter__button"
                            >
                                Registo
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </div>
    );
}

export default Layout;
```

### 8.3) Router final

`frontend/src/App.jsx`:

```jsx
/**
 * Trecho: frontend/src/App.jsx
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import FavoritesPage from "@/pages/FavoritesPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PokemonDetailsPage from "@/pages/PokemonDetailsPage.jsx";
import PokemonListPage from "@/pages/PokemonListPage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import TeamsPage from "@/pages/TeamsPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PokemonListPage />} />
                <Route path="pokemon/:id" element={<PokemonDetailsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="registo" element={<RegisterPage />} />

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

export default App;
```

### 8.4) Login/Register (fluxo de redirect)

`frontend/src/pages/LoginPage.jsx`:

```jsx
/**
 * Trecho: frontend/src/pages/LoginPage.jsx
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function LoginPage() {
    const { login } = usePokedex();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login({ email, password });
            navigate(redirectTo, { replace: true });
        } catch {
            setError("Login inválido.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Login</h2>
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
                <button type="submit" disabled={submitting}>
                    {submitting ? "A entrar..." : "Entrar"}
                </button>
            </form>
            {error && <p className="pokedex__empty">{error}</p>}
        </section>
    );
}

export default LoginPage;
```

`frontend/src/pages/RegisterPage.jsx`:

```jsx
/**
 * Trecho: frontend/src/pages/RegisterPage.jsx
 * Objetivo: explicar o que este snippet faz e onde encaixa no fluxo da ficha.

 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function RegisterPage() {
    const { register } = usePokedex();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await register({ username, email, password });
            navigate("/", { replace: true });
        } catch {
            setError("Não foi possível criar conta.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Registo</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
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
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? "A criar..." : "Criar conta"}
                </button>
            </form>
            {error && <p className="pokedex__empty">{error}</p>}
        </section>
    );
}

export default RegisterPage;
```

### 8.5) Teams (carregar/criar/apagar/paginar)

`frontend/src/pages/TeamsPage.jsx`:

```jsx
/**
 * Trecho: frontend/src/pages/TeamsPage.jsx
 * Objetivo: gerir UI de equipas (listar, criar, apagar) com paginação e pesquisa.

 */

import { useEffect, useState } from "react";
import { createTeam, listTeams, removeTeam } from "@/services/teamsApi.js";

/**
 * Página de gestão de equipas.
 *
 * @returns {JSX.Element}
 */
function TeamsPage() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [q, setQ] = useState("");
    const [name, setName] = useState("");
    const [pokemonIdsInput, setPokemonIdsInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Carrega uma página de equipas.
     *
     * @param {number} [targetPage=page]
     * @returns {Promise<void>}
     */
    async function load(targetPage = page) {
        setLoading(true);
        setError("");

        try {
            // Mantemos limit fixo na UI para experiência consistente.
            const data = await listTeams({ page: targetPage, limit: 6, q });
            setItems(data.items);
            setTotal(data.total);
            setPage(data.page);
            setPages(data.pages);
        } catch {
            setError("Erro ao carregar equipas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Sempre que q muda, voltamos à primeira página para evitar páginas vazias inesperadas.
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    /**
     * Cria equipa com validação básica antes do POST.
     *
     * @param {import("react").FormEvent<HTMLFormElement>} event
     * @returns {Promise<void>}
     */
    async function handleCreate(event) {
        event.preventDefault();
        setError("");

        // Parsing + dedupe de IDs introduzidos em texto livre.
        const pokemonIds = [
            ...new Set(
                pokemonIdsInput
                    .split(",")
                    .map((x) => Number(x.trim()))
                    .filter((x) => Number.isInteger(x) && x > 0),
            ),
        ];

        if (!name.trim()) {
            setError("Nome da equipa é obrigatório.");
            return;
        }

        if (pokemonIds.length < 1 || pokemonIds.length > 6) {
            setError("Indica entre 1 e 6 IDs de Pokémon.");
            return;
        }

        try {
            await createTeam({ name: name.trim(), pokemonIds });
            setName("");
            setPokemonIdsInput("");
            // Recarrega primeira página para mostrar equipa recém-criada.
            await load(1);
        } catch {
            setError("Não foi possível criar equipa.");
        }
    }

    /**
     * Remove equipa e recarrega página atual.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async function handleDelete(id) {
        try {
            await removeTeam(id);
            await load(page);
        } catch {
            setError("Não foi possível apagar equipa.");
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Equipas</h2>

            <form onSubmit={handleCreate}>
                <label>
                    Nome da equipa
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    IDs Pokémon (separados por vírgula)
                    <input
                        value={pokemonIdsInput}
                        onChange={(e) => setPokemonIdsInput(e.target.value)}
                        placeholder="1, 4, 7"
                        required
                    />
                </label>
                <button type="submit">Criar equipa</button>
            </form>

            <label>
                Pesquisar por nome
                <input value={q} onChange={(e) => setQ(e.target.value)} />
            </label>

            {loading && <p>A carregar...</p>}
            {error && <p className="pokedex__empty">{error}</p>}

            {!loading && !error && (
                <>
                    <p>Total: {total}</p>
                    <ul>
                        {items.map((team) => (
                            <li key={team._id}>
                                <strong>{team.name}</strong> - [
                                {team.pokemonIds.join(", ")}]
                                <button
                                    type="button"
                                    onClick={() => handleDelete(team._id)}
                                >
                                    Apagar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => load(page - 1)}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {page} de {pages}
                        </span>
                        <button
                            type="button"
                            disabled={page >= pages}
                            onClick={() => load(page + 1)}
                        >
                            Seguinte
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default TeamsPage;
```

### Checkpoint 8

- Rotas privadas redirecionam para `/login` sem sessão.
- Depois de login, links privados aparecem no `Layout`.
- Teams cria/apaga e refresca por chamada real à API.

Critérios binários de validação (debug guiado):

- Se rota privada não redirecionar sem login, verifica se está embrulhada em `<ProtectedRoute>`.
- Se redirecionar cedo demais no refresh, verifica `authReady` antes de decidir `Navigate`.
- Se login for bem-sucedido mas não regressar à origem, verifica `location.state?.from` + `navigate(..., { replace: true })`.

### 8.6) Erros comuns de navegação/autenticação

- esquecer `authReady` no `ProtectedRoute`.
- chamar `navigate` antes de `login` terminar.
- rota privada sem wrapper `ProtectedRoute`.

---

## 9) Upload de avatar obrigatório: backend + frontend (Profile)

### O que é

Vamos ligar a rota `/api/users/avatar` à página de perfil.

### Teoria

1. **Conceitos-chave**

- **`multipart/form-data`**: formato HTTP para enviar ficheiros e campos no mesmo pedido.
- **FormData**: API do browser para construir esse payload.
- **Multer**: middleware Express para parsing de uploads.
- **Static files**: ficheiros servidos diretamente por URL (`/uploads/...`).

2. **Como funciona “por baixo”**

- O browser envia fronteiras (boundaries) multipart com metadados e bytes do ficheiro.
- Multer intercepta pedido, valida tipo/tamanho e grava no disco.
- Depois da gravação, a rota guarda no utilizador um caminho público (`avatarUrl`).
- `express.static(...)` mapeia a pasta física para URL pública.

3. **Porque estamos a fazer assim neste projeto**

- Avatar é um caso realista de integração fullstack com ficheiros.
- Reutilizamos sessão já autenticada para associar imagem ao utilizador certo.
- O retorno `{ avatarUrl }` simplifica atualização imediata da UI.

4. **Erros comuns e sintomas**

- 400 no upload com mensagem de ficheiro inválido -> tipo não imagem.
- 413 no upload -> ficheiro maior que limite.
- Upload 200 mas imagem não abre -> static não aponta para o diretório certo.
- Frontend envia JSON em vez de FormData -> `req.file` fica vazio.

5. **Boas práticas e segurança**

- Limitar tamanho de upload protege servidor e disco.
- Não confiar só no nome/extensão do ficheiro.
- Idealmente, em cenários reais, usar armazenamento dedicado e varredura de conteúdo.
- Manter diretório de uploads controlado e sem execução de código.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - analogia

```txt
FormData é como um envelope com vários compartimentos:
- campo "avatar" com ficheiro
- outros campos opcionais de texto
```

> Exemplo isolado - sintoma clássico

```txt
Se `req.file` é undefined, quase sempre o cliente não enviou multipart corretamente.
```

### Porque fazemos isto

É o exemplo completo de `multipart/form-data` com atualização de sessão visual na UI.

### 9.1) Criar `frontend/src/pages/ProfilePage.jsx`

```jsx
/**
 * Trecho: frontend/src/pages/ProfilePage.jsx
 * Objetivo: permitir upload de avatar e refletir a alteração no perfil atual.

 */

import { useState } from "react";
import { usePokedex } from "@/context/PokedexContext.jsx";
import { uploadAvatar } from "@/services/usersApi.js";

/**
 * Página de perfil com upload de avatar.
 *
 * @returns {JSX.Element}
 */
function ProfilePage() {
    const { user, refreshSession } = usePokedex();
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /**
     * Envia imagem para o backend e atualiza sessão local.
     *
     * @param {import("react").FormEvent<HTMLFormElement>} event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        setFeedback("");

        if (!file) {
            setFeedback("Escolhe uma imagem.");
            return;
        }

        setSubmitting(true);

        try {
            await uploadAvatar(file);
            // refreshSession volta a pedir /api/auth/me para apanhar avatarUrl novo.
            await refreshSession();
            setFeedback("Avatar atualizado com sucesso.");
            setFile(null);
        } catch {
            setFeedback("Não foi possível atualizar o avatar.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Perfil</h2>

            {user && (
                <>
                    <p>
                        <strong>{user.username}</strong> ({user.email})
                    </p>

                    {user.avatarUrl ? (
                        <img
                            // Construção de URL absoluta com base no backend configurado no frontend.
                            src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
                            alt={`Avatar de ${user.username}`}
                            width="140"
                            height="140"
                            style={{ objectFit: "cover", borderRadius: "12px" }}
                        />
                    ) : (
                        <p>Ainda sem avatar.</p>
                    )}
                </>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Nova imagem
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        required
                    />
                </label>

                <button type="submit" disabled={submitting}>
                    {submitting ? "A enviar..." : "Atualizar avatar"}
                </button>
            </form>

            {feedback && <p className="pokedex__empty">{feedback}</p>}
        </section>
    );
}

export default ProfilePage;
```

### Checkpoint 9

- Upload devolve `avatarUrl` e o browser mostra imagem nova após `refreshSession()`.
- URL da imagem abre diretamente: `http://localhost:3000/uploads/...`.

---

## 10) Checkpoint final: testes manuais completos + erros comuns

### O que é

Validação funcional fim-a-fim da ficha.

### Teoria

1. **Conceitos-chave**

- **Teste manual E2E**: validação do fluxo completo de ponta a ponta.
- **Sintoma vs causa**: a mensagem visível nem sempre indica a origem real.
- **Ferramentas de debug**: DevTools Network, Application/Cookies, curl, Postman/Insomnia.

2. **Como funciona “por baixo”**

- Cada clique relevante gera request HTTP observável no separador Network.
- No browser, erros CORS aparecem no console e podem bloquear antes de veres resposta útil.
- `401`, `403`, `422`, `500` têm significados diferentes e orientam diagnóstico.
- Cookies podem existir no storage, mas só são enviados se origin/credentials/políticas permitirem.

3. **Porque estamos a fazer assim neste projeto**

- A Ficha 06 junta muitas peças; só testes fim-a-fim confirmam integração real.
- A checklist final evita o “parece funcionar” baseado em meia dúzia de cliques.
- Validar status codes acelera muito o debug e evita tentativas aleatórias.

4. **Erros comuns e sintomas**

- “CORS error” no browser e nada no backend -> bloqueio no cliente antes de chegar à rota.
- 401 em rotas privadas após login -> cookie não enviado/aceite.
- 403 em mutações -> header CSRF em falta ou token desfasado.
- 500 em endpoint de dados -> erro interno (stack no backend, input inesperado, DB).
- UI sem atualização após ação com 200 -> estado local não foi sincronizado.

5. **Boas práticas e segurança**

- Testar sempre cenários de sucesso e falha.
- Verificar explicitamente status code e payload, não só “apareceu algo no ecrã”.
- Não mascarar erros no frontend com mensagens genéricas sem logs úteis.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - triagem rápida

```txt
Se for 401: olha para sessão/cookie.
Se for 403: olha para CSRF.
Se for 422: olha para validação do payload.
Se for 500: olha para logs do backend.
```

> Exemplo isolado - ordem de debug

```txt
1) Confirmar request chegou
2) Ver status
3) Ver payload
4) Ver logs
```

### Porque fazemos isto

Se não testares o fluxo completo (login -> favoritos -> equipas -> avatar -> logout), falhas de integração passam despercebidas.

### 10.1) Testes obrigatórios

1. **Health + arranque**
    - `GET /api/health` devolve `{ ok: true }`.
2. **Registo e login**
    - criar conta em `/registo`, fazer logout, voltar a fazer login em `/login`.
3. **Sessão restaurada**
    - refresh da página com sessão ativa mantém utilizador autenticado (`/api/auth/me`).
4. **Favoritos (contrato correto)**
    - marcar/desmarcar favorito e confirmar requests:
        - `GET /api/favorites` -> array de ids
        - `POST /api/favorites` body `{ id }`
        - `DELETE /api/favorites/:id`
5. **Rotas protegidas**
    - sem login, `/favoritos`, `/equipas`, `/perfil` redirecionam para `/login`.
6. **Equipas**
    - criar equipa, pesquisar por nome, paginar, apagar equipa.
7. **Avatar**
    - upload de imagem no perfil e imagem visível após refresh.
8. **Logout**
    - logout limpa sessão; rotas protegidas deixam de ser acessíveis.

### 10.2) Erros comuns finais

- **CORS/cookies**: origem errada em `CLIENT_ORIGIN`.
- **CSRF**: mutações a falhar com 403 por ausência do header.
- **Imports**: `App.jsx` ainda a importar páginas de `components`.
- **Env vars**: frontend sem `VITE_API_URL` ou backend sem `JWT_SECRET`.
- **Uploads**: `express.static(uploadsDir)` em falta no `app.js`.

### 10.3) Mini playbook transversal de debug (rápido)

```txt
1) Confirmar se o request chegou ao backend
2) Ler status HTTP (401/403/422/500)
3) Mapear status para camada provável (sessão, CSRF, validação, servidor)
4) Corrigir a causa mais provável e repetir o mesmo teste
```

Leitura guiada por status:

- `401` -> verificar sessão/cookies/JWT.
- `403` -> verificar CSRF (cookie + header).
- `422` -> verificar payload do cliente.
- `500` -> verificar logs e stack do backend.

---

## 11) Resumo / Checklist final

### Teoria

1. **Conceitos-chave**

- **Checklist de entrega**: verificação objetiva para garantir conclusão real.
- **Critério de aceite**: definição clara do que conta como “feito”.
- **Regressão**: quando uma alteração nova estraga algo que antes funcionava.

2. **Como funciona “por baixo”**

- Cada item da checklist representa uma dependência crítica entre camadas.
- Se um item falha, normalmente há efeito em cascata (ex.: auth falha -> rotas protegidas falham -> favoritos/equipas também).
- A checklist transforma validação subjetiva em validação mensurável.

3. **Porque estamos a fazer assim neste projeto**

- Ajuda-te a fechar a ficha com confiança, sem “buracos” escondidos.
- Serve também para preparação de avaliação: sabes exatamente o que demonstrar.
- Facilita manutenção futura: quando voltares ao projeto, tens um mapa de estado final esperado.

4. **Erros comuns e sintomas**

- Marcar item sem testar de verdade -> bug aparece na demonstração final.
- Testar só caminho feliz -> falhas de segurança/validação passam despercebidas.
- Ignorar logs porque “a UI parece ok” -> problemas latentes em produção.

5. **Boas práticas e segurança**

- Repetir checklist após alterações relevantes.
- Guardar evidências rápidas (prints de Network/logs) durante validação.
- Tratar segurança como requisito funcional, não como “extra”.

6. **Mini-exemplos pedagógicos (isolados)**
    > Exemplo isolado - forma de fechar tarefa

```txt
Item checklist + teste executado + resultado observado + estado final.
```

> Exemplo isolado - mentalidade profissional

```txt
"Funciona no meu computador" não substitui validação sistemática.
```

- [ ] Projeto está organizado em `backend/` e `frontend/`.
- [ ] Frontend separado em `src/pages` (rotas) e `src/components` (reutilização).
- [ ] `favorites` usa apenas 1 contrato (GET array, POST body `{id}`, DELETE `/:id`).
- [ ] Auth com JWT em cookie HttpOnly está funcional (`register/login/me/logout`).
- [ ] CSRF ativo para mutações e fluxo coerente com cookies.
- [ ] Axios central (`apiClient`) com `withCredentials` e `X-CSRF-Token` automático.
- [ ] Equipas com paginação/pesquisa em backend e frontend.
- [ ] Upload de avatar implementado e visível no perfil.
- [ ] Rotas protegidas funcionam com `ProtectedRoute` e `authReady`.
- [ ] Testes manuais fim-a-fim executados com sucesso.

Se tudo estiver marcado, a Ficha 06 está concluída e consistente com a Ficha 05.
