# Tutorial passo a passo — Pokédex v3 com Backend + Context (Ficha 05) (12.º ano)

Este tutorial **continua diretamente a Ficha 4**.
A app mantém o Router, as páginas e a experiência do utilizador.

O que muda nesta ficha é a **arquitetura**:

- Passamos os **favoritos** para um **backend Node.js + Express** (API própria)
- Passamos o estado principal para **Context API** (estado global limpo)

> Nesta ficha **não estamos a inventar novas features**.
> Estamos a tornar o projeto mais “real” e mais fácil de manter.
> Vamos basicamente refatorar a app para algo mais profissional.

---

## 0) O que vais construir

### 0.1) Ponto da situação (Ficha 4)

- SPA com React Router (`/`, `/pokemon/:id`, `/favoritos`, `*`).
- Lista com pesquisa/filtros.
- Favoritos guardados no browser.

> Nota: Um SPA é uma Single Page Application — uma app que corre toda no browser, sem recarregar páginas.

### 0.2) Objetivos desta ficha

1. **Backend**

- Criar uma API simples que guarda favoritos.
- Sem base de dados (por agora), só memória.

2. **Context**

- Tirar estado do `App.jsx`.
- Criar um `PokedexProvider` que fornece dados e ações às páginas.

### 0.3) O que fica exatamente igual

- Rotas e navegação.
- Componentes visuais (cards, header, etc.).
- Lógica geral: marcar/desmarcar favorito, mostrar favoritos.

### 0.4) Checkpoint final (como sabes que acabaste)

- O frontend abre e funciona como antes.
- Ao marcar um favorito, ele fica guardado no backend.
- Ao fazer refresh, continua favorito.
- Ao reiniciar o backend, volta ao array inicial (porque é memória).

---

## 1) Pré-requisitos e ambiente

### 1.1) Vais ter dois terminais sempre

- **Terminal A**: backend Express (porta 3000)
- **Terminal B**: frontend Vite (porta 5173)

### 1.2) Confirma Node e npm

```bash
node -v
npm -v
```

### 1.3) Se algo falhar logo aqui

- **Porta ocupada** (`EADDRINUSE`) → tens outro servidor ligado.
- **Erro de imports** no Node → falta `"type": "module"`.

---

## 2) Criar a v3 (cópia da v2)

### Porque duplicar

Nesta fase estás a aprender arquitetura. É normal partir coisas.
Duplicar evita perderes uma versão estável.

### Passo prático

- Faz copy/paste da pasta da Ficha 4.
- Renomeia para `pokedex-v3`.

Depois confirma:

```bash
npm install
npm run dev
```

---

## 3) Estrutura final esperada

```txt
pokedex-v3/
  backend/
    package.json
    src/
      app.js
      server.js
      routes/
        favorites.routes.js
  src/
    context/
      PokedexContext.jsx
    services/
      pokeApi.js
      favoritesApi.js
    components/
    ...
```

### Porque isto é uma estrutura boa

- Separa “UI” de “dados”.
- Ajuda-te a navegar no projeto.
- Prepara a transição para MongoDB (em vez de arrays).

---

## 4) Conceitos essenciais (explicação curta mas sólida)

### 4.1) Cliente ↔ Servidor

O React corre no browser e só consegue guardar dados localmente.
Quando queres dados partilhados e regras centralizadas, precisas de backend.

```txt
React (browser) ──fetch──▶ Express (server) ──▶ responde JSON
```

### 4.2) HTTP em 60 segundos

- `GET` → pedir dados (não altera nada)
- `POST` → criar/ adicionar
- `DELETE` → remover

### 4.3) Status codes (porque importam)

O status diz ao frontend como interpretar a resposta:

- `200` OK → correu bem
- `201` Created → criaste algo
- `400` Bad Request → parâmetro de URL inválido
- `404` Not Found → não existe
- `409` Conflict → já existe (duplicado)
- `422` Unprocessable Entity → body inválido

Repara na diferença entre `400` e `422`:

- `400` → erro no URL (`/favorites/abc`)
- `422` → erro no body (`{}` ou `{ id: "abc" }`)

### 4.4) CORS (porque o browser bloqueia)

Detalhe que aparece muito no mundo real: **preflight**.

- Em certos pedidos, o browser envia primeiro um `OPTIONS` automático.
- O objetivo é perguntar ao servidor: “tu aceitas este tipo de pedido?”

Nesta ficha, como usamos o middleware `cors`, isso fica resolvido sem drama.

Se um dia vires um pedido `OPTIONS` no Network, não entres em pânico:
normalmente é o browser a fazer o seu trabalho.

---

Frontend em `http://localhost:5173` e backend em `http://localhost:3000` são origens diferentes.
Sem CORS, o browser bloqueia pedidos por segurança.

### 4.5) Contrato de API

Definimos exatamente:

- que endpoints existem
- que JSON entram/saem
- que erros podem acontecer

Contrato desta ficha:

| Ação          | Método | URL                  | Body          | Resposta      |
| ------------- | ------ | -------------------- | ------------- | ------------- |
| Ler favoritos | GET    | `/api/favorites`     | —             | `[1,4,25]`    |
| Adicionar     | POST   | `/api/favorites`     | `{ "id": 7 }` | `{ "id": 7 }` |
| Remover       | DELETE | `/api/favorites/:id` | —             | `{ "id": 7 }` |

### 4.6) Context API (o porquê)

Na Ficha 4, tinhas algo do género:

- `App` tem estado
- `App` passa para `Layout`
- `Layout` passa para `Page`
- `Page` passa para `Card`

Isto chama-se **prop drilling**.

Com Context:

- o Provider guarda estado num sítio só
- qualquer filho pode ler com `usePokedex()`

---

# PARTE A — BACKEND

## 5) Criar o backend Express

### 5.0) Mini‑teoria: Express, middleware, CORS e ES Modules

Antes de escrever código, vale a pena perceber _o que_ estamos a montar.

#### O que é o Express (em 1 minuto)

O **Express** é uma biblioteca que te ajuda a criar um servidor HTTP em Node.

- O servidor recebe pedidos (requests) vindos do browser (ou do Postman/curl).
- O teu código decide _o que responder_ (response), normalmente em **JSON**.

> Pensa no Express como uma “central de atendimento”: chegam pedidos com um URL e um método (GET/POST/DELETE) e tu defines as regras de resposta.

#### O que é um middleware

Um **middleware** é uma função que corre _no meio do caminho_ entre o pedido entrar e a resposta sair.

No Express, o fluxo é (simplificado):

```txt
Request ─▶ middleware 1 ─▶ middleware 2 ─▶ rota ─▶ Response
```

Exemplos desta ficha:

- `cors(...)`  
  Mete os headers necessários para o browser aceitar pedidos entre origens diferentes.
- `express.json()`  
  Lê o corpo do pedido (body) e converte JSON em `req.body`.

#### Porque separamos `app.js` e `server.js`

- `app.js` define **a aplicação** (middlewares + rotas).  
  Isto é “configuração”.
- `server.js` faz apenas `app.listen(...)` para **arrancar**.

Isto é uma prática comum porque:

- facilita testes (podes importar `app` sem abrir portas)
- mantém o ficheiro de arranque simples e óbvio

#### CORS em linguagem simples

O browser tem uma regra de segurança: por defeito, não deixa um site num domínio/porta “A” fazer pedidos a um servidor “B”.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Isto são **origens diferentes** (porta diferente) → o browser bloqueia, a não ser que o backend diga explicitamente que aceita.

Nesta ficha, fazemos isso com:

- `cors({ origin: "http://localhost:5173" })`

> Nota importante (mundo real): deixar `origin: "*"` é prático para testes, mas é má ideia em produção.

#### ES Modules no Node (`"type": "module"`)

Ao meteres `"type": "module"` no `package.json`, o Node passa a aceitar:

- `import ... from ...`
- `export default ...`

E ganhas consistência com o frontend (que já usa ES Modules).

---

### 5.1) Criar pasta e instalar dependências

Na raiz do projeto:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors
```

### 5.2) Ativar ES Modules

No `backend/package.json`, adiciona:

```json
{
    "type": "module"
}
```

Sem isto, o Node não reconhece `import ... from ...`.

### 5.3) Criar estrutura `src/`

Cria:

- `backend/src/app.js`
- `backend/src/server.js`

#### O papel de cada ficheiro

- `app.js` → configura o Express (middlewares + rotas)
- `server.js` → só arranca o servidor na porta

#### `backend/src/app.js`

```js
// backend/src/app.js
import express from "express";
import cors from "cors";
import favoritesRoutes from "./routes/favorites.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

app.use("/api/favorites", favoritesRoutes);

export default app;
```

O que acontece aqui (em português simples):

1. `cors(...)` deixa o frontend falar com o backend.
2. `express.json()` permite ler JSON no `req.body`.
3. `app.use("/api/favorites", ...)` liga o router.

#### `backend/src/server.js`

```js
/* backend/src/server.js */
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`);
});
```

### Checkpoint

Na pasta `backend/`:

```bash
node src/server.js
```

Se arrancar, segue.

---

## 6) Rotas de favoritos (`favorites.routes.js`)

### 6.0) Mini‑teoria: REST, Router, validação e “persistência” em memória

Este capítulo é onde se decide o “contrato” entre frontend e backend.

#### O que significa “API REST básica” aqui

REST, nesta ficha, significa apenas:

- tens **recursos** (neste caso: `favorites`)
- tens **endpoints** previsíveis (`/api/favorites`)
- usas **métodos HTTP** para dizer a intenção:
    - `GET` para ler
    - `POST` para adicionar
    - `DELETE` para remover

Não é “magia” nem um standard único — é uma forma organizada de pensar URLs e ações.

#### Porque usamos `Router()` em vez de meter tudo no `app.js`

O `Router()` é como um “mini‑app” do Express só para uma feature.

Vantagens:

- código mais fácil de encontrar
- cada feature tem o seu ficheiro
- no `app.js` só fazes “ligações” (`app.use("/api/favorites", router)`)

#### O que é “persistência em memória”

Quando fazemos:

```js
let favorites = [1, 4, 25];
```

isso significa:

- os dados vivem na RAM do servidor
- enquanto o processo do Node estiver ligado, a lista mantém-se
- quando reinicias o servidor, a variável volta ao início

Isto é ótimo para aprender, mas tem limitações óbvias:

- não é partilhado entre vários servidores
- perdes dados ao reiniciar
- não aguenta concorrência “a sério” (muitos pedidos ao mesmo tempo)

Mais tarde, substituis esta variável por uma base de dados.

#### Validação: onde e porquê

A validação é a barreira que impede “lixo” de entrar no teu sistema.

Nesta ficha, validamos:

- `id` tem de ser numérico
- tem de ser inteiro
- tem de ser > 0

O objetivo não é “ser chato” — é evitar estados impossíveis (ex.: favorito `-3`).

#### Status codes e consistência de erros

Um **status code** é um sinal rápido para o cliente:

- “correu bem” (200/201)
- “o pedido está errado” (400/422)
- “o recurso não existe” (404)
- “há conflito/duplicado” (409)

E a _forma_ do erro (JSON) deve ser estável.  
Se o backend devolver sempre:

```json
{ "error": { "code": "...", "message": "...", "details": [] } }
```

então o frontend consegue:

- mostrar mensagens
- tomar decisões (ex.: se `code === "DUPLICATE_KEY"`, não repetir pedido)

---

### 6.1) Porque usamos um Router separado

Em projetos reais, não metes tudo no `app.js`.
Organizas por features:

- `routes/favorites.routes.js`
- `routes/users.routes.js` (mais tarde)
- etc.

### 6.2) Implementação

Cria `backend/src/routes/favorites.routes.js`:

```js
/* backend/src/routes/favorites.routes.js */
import { Router } from "express";

const router = Router();

let favorites = [1, 4, 25];

function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

function parseId(value) {
    const numericId = Number(value);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }

    return numericId;
}

router.get("/", (req, res) => {
    res.status(200).json(favorites);
});

router.post("/", (req, res) => {
    const { id } = req.body || {};
    const numericId = parseId(id);

    if (!numericId) {
        return sendError(
            res,
            422,
            "VALIDATION_ERROR",
            "Id obrigatorio e numerico",
        );
    }

    if (favorites.includes(numericId)) {
        return sendError(res, 409, "DUPLICATE_KEY", "Pokemon ja e favorito");
    }

    favorites = [...favorites, numericId];
    res.status(201).json({ id: numericId });
});

router.delete("/:id", (req, res) => {
    const numericId = parseId(req.params.id);

    if (!numericId) {
        return sendError(res, 400, "INVALID_ID", "Id invalido");
    }

    if (!favorites.includes(numericId)) {
        return sendError(res, 404, "NOT_FOUND", "Favorito nao encontrado");
    }

    favorites = favorites.filter((id) => id !== numericId);
    res.status(200).json({ id: numericId });
});

export default router;
```

### 6.3) Leitura guiada

#### Dados em memória

- `favorites = [1,4,25]` é o estado inicial.
- Serve para teres algo logo no primeiro GET.

#### Validação de ID

- `parseId` evita IDs como `"abc"`, `-3`, `2.5`.

#### Erros consistentes

- `sendError` garante sempre `{ error: { ... } }`.
- Isto facilita o frontend: ele sabe sempre onde está a mensagem.

#### GET

- Devolve o array.

#### POST

- Valida body.
- Impede duplicados.
- Adiciona o id.

#### DELETE

- Valida param.
- Verifica se existe.
- Remove.

---

## 7) Testar o backend (antes do React)

### 7.0) Mini‑teoria: como testar uma API sem envolver React

Testar o backend primeiro é uma estratégia de engenharia muito usada:

- se a API falhar, sabes que o problema é do backend
- se a API estiver ok, o problema está no frontend (ou no CORS)
- evitas “debug às cegas” com 2 sistemas ao mesmo tempo

#### Ferramentas típicas

- **curl** (linha de comandos)  
  bom para aprender e ver exatamente o que estás a enviar
- **Postman / Insomnia**  
  bom para testar rápido e guardar coleções de requests
- **DevTools (Network)**  
  quando já ligares o React, confirmas se o browser está a enviar o que pensas

#### Preflight `OPTIONS` (o tal pedido “extra”)

Quando fazes um `POST` com JSON (ou headers “não simples”), o browser pode enviar antes um `OPTIONS` automático.

Isso não é bug:

- é o browser a perguntar “posso fazer este pedido?”
- o middleware `cors` responde com os headers corretos

Se vires `OPTIONS` no Network, respira: normalmente é esperado.

---

### Porque isto é obrigatório (mesmo)

Se ligares ao React sem testar, ficas sem saber se o erro está no backend ou no frontend.

### Terminal A

```bash
cd backend
node src/server.js
```

### Terminal B — testes (curl)

```bash
curl http://localhost:3000/api/favorites
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"id": 7}'
curl -X DELETE http://localhost:3000/api/favorites/7
```

### Mini-debug

- Se o GET falhar → o servidor não está a correr.
- Se o POST falhar → `express.json()` pode estar em falta.
- Se aparecer CORS aqui → estás a testar no browser (curl não aplica CORS).

---

## 7.1) Mini-lab — provocar erros de propósito (para aprender)

Isto é uma das melhores formas de perceber status codes: provocar erros controlados e ver o que o backend devolve.

Com o backend ligado, tenta:

### Erro 422 (body inválido)

```bash
curl -X POST http://localhost:3000/api/favorites   -H "Content-Type: application/json"   -d '{}'
```

O backend deve responder com `422` e um JSON com `error.code = "VALIDATION_ERROR"`.

### Erro 409 (duplicado)

Se o `1` já está nos favoritos iniciais, tenta adicionar:

```bash
curl -X POST http://localhost:3000/api/favorites   -H "Content-Type: application/json"   -d '{"id": 1}'
```

Deve dar `409` e `error.code = "DUPLICATE_KEY"`.

### Erro 400 (param inválido)

```bash
curl -X DELETE http://localhost:3000/api/favorites/abc
```

Deve dar `400` e `error.code = "INVALID_ID"`.

### Erro 404 (não existe)

Escolhe um id que não esteja na lista (ex.: 9999):

```bash
curl -X DELETE http://localhost:3000/api/favorites/9999
```

Deve dar `404` e `error.code = "NOT_FOUND"`.

> Este exercício é ouro quando, mais tarde, fores tu a desenhar contratos de API para projetos maiores.

---

# PARTE B — FRONTEND

## 7.2) (Extra) Como separar responsabilidades no frontend

### 7.2.1) Regra prática para decidir “onde isto vive”

Quando estás na dúvida onde meter uma função, usa esta regra:

1. **Fala com a rede (fetch)?**  
   Vai para `services/`.

2. **Coordena várias coisas e mexe em estado global (carregar, validar fluxo, fazer POST e depois atualizar UI)?**  
   Vai para `context/` (ações do Provider).

3. **Só desenha UI e dispara eventos (onClick/onChange)?**  
   Vai para `components/` ou `pages/` (dependendo se é página ou peça pequena).

> Objetivo final: componentes visuais devem ser “parvos”: recebem dados prontos e mostram.  
> A “inteligência” fica concentrada em services + context.

---

Quando a app cresce, o objetivo é que cada pasta tenha um papel claro:

- `services/`  
  Funções “puras” para falar com APIs (fetch) ou manipular dados.  
  Não deve ter JSX.

- `context/`  
  Estado global e ações (ex.: carregar dados, toggle favorito).  
  Serve de “ponte” entre UI e services.

- `components/`  
  Componentes visuais (cards, botões, layout).  
  Idealmente recebem dados já prontos para mostrar.

- `pages/` (se tiveres)  
  Páginas do Router: combinam componentes e regras de página.

Se fizeres isto bem:

- mudar backend → mexes em `services/`
- mudar regras globais → mexes em `context/`
- mudar visual → mexes em `components/`

---

## 8) Criar o serviço `favoritesApi.js`

### 8.0) Mini‑teoria: `fetch`, `res.ok`, JSON e propagação de erros

O `fetch` é simples de usar, mas tem dois “truques” importantes.

#### 1) `fetch` _não_ lança erro em HTTP 4xx/5xx

O `fetch` só lança erro automaticamente em situações como:

- sem internet
- DNS falhou
- servidor desligado
- timeout (dependendo do ambiente)

Se o servidor responder `404` ou `422`, o `fetch` considera isso “uma resposta válida” — por isso tens de decidir o que fazer.

É para isso que existe:

- `if (!res.ok) ...`

#### 2) O body (JSON) pode ter informação útil… mesmo em erro

Nesta ficha, o backend devolve um JSON de erro com `code` e `message`.  
Num projeto mais avançado, é comum fazer:

- ler o JSON
- extrair a mensagem
- lançar um erro com mais contexto

Aqui, mantemos a implementação simples (erro genérico), mas é importante perceber a ideia.

#### `Content-Type` (porque precisamos dele no POST)

No `POST`, enviamos JSON. O header:

- `"Content-Type": "application/json"`

diz ao servidor: “o body está em JSON”.  
Sem isto, `express.json()` pode não interpretar o body como esperas.

---

### 8.1) Objetivo

Ter um único módulo responsável por falar com o backend.

Cria `src/services/favoritesApi.js`:

```js
// src/services/favoritesApi.js

const API_BASE = "http://localhost:3000";

export async function getFavorites() {
    const res = await fetch(`${API_BASE}/api/favorites`);
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}

export async function addFavorite(id) {
    const res = await fetch(`${API_BASE}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}

export async function removeFavorite(id) {
    const res = await fetch(`${API_BASE}/api/favorites/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}
```

### 8.2) Porque este ficheiro é importante

- É o “contrato” do frontend com a API.
- Se mudares `API_BASE`, mudas só aqui.

### 8.3) Como o erro se propaga

- Se `res.ok` falhar, lançamos `Error("Erro API")`.
- Esse erro vai ser apanhado no Provider (na fase seguinte).

---

### 8.4) Debug de pedidos no browser (DevTools)

Quando estiveres com o frontend ligado, abre as DevTools (F12) e usa:

- **Network** → para ver pedidos `GET/POST/DELETE`
- **Console** → para ver erros

O que deves confirmar:

1. Ao abrir a app, aparece um `GET http://localhost:3000/api/favorites` (status 200).
2. Ao clicar numa estrela, aparece:
    - `POST /api/favorites` (se estás a adicionar)
    - ou `DELETE /api/favorites/:id` (se estás a remover)
3. Se algo falhar, vê:
    - o **status**
    - a **response body** (a tua `error`)

> Dica: no separador Network, clica no pedido e abre “Response”.

---

## 9) Criar o Context (`PokedexContext.jsx`)

### 9.0) Mini‑teoria: estado global, Context API, Provider e `usePokedex()`

Este capítulo é o “coração” do frontend: decide onde vivem os dados e como circulam.

#### O que é “estado global” (na prática)

Estado global é informação que:

- é usada em várias páginas/componentes
- precisa de estar sincronizada (ex.: favoritos)
- não faz sentido estar duplicada em 3 sítios diferentes

Exemplos nesta ficha:

- `pokemon` (lista principal)
- `favorites` (ids favoritos)
- `loading` / `error` (estado de carregamento)

#### O problema: prop drilling

Prop drilling é quando tens de passar props por componentes intermédios que:

- não usam esses dados
- só servem de “passagem”

Isto cria:

- muito ruído nos componentes
- mais sítios para enganar (props em falta)
- mais dificuldade em mudar a estrutura da UI

#### A solução: Context API

Com Context:

- crias um “canal” de dados (Context)
- um Provider coloca esses dados disponíveis para baixo
- qualquer componente filho lê com `useContext(...)`

Nesta ficha, criamos um hook:

- `usePokedex()`

que é a interface “bonita” e segura para o resto da app.

#### Porque criamos um hook e não usamos `useContext` em todo o lado

Um hook como `usePokedex()` dá-te:

- uma mensagem de erro clara se alguém usar fora do Provider
- uma API consistente (sempre o mesmo formato de dados/ações)
- menos imports repetidos e menos “boilerplate” nas páginas

---

### 9.1) Objetivo

- Guardar estado global.
- Fornecer ações (toggle, reload).

Cria `src/context/PokedexContext.jsx`:

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

const POKEMON_LIMIT = 151;

const PokedexContext = createContext(null);

export function PokedexProvider({ children }) {
    const [pokemon, setPokemon] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [pokemonList, favoritesList] = await Promise.all([
                fetchPokemonList(POKEMON_LIMIT),
                getFavorites(),
            ]);

            setPokemon(pokemonList);
            setFavorites(favoritesList);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const toggleFavorite = useCallback(
        async (id) => {
            try {
                if (favorites.includes(id)) {
                    await removeFavorite(id);
                    setFavorites(favorites.filter((favId) => favId !== id));
                } else {
                    await addFavorite(id);
                    setFavorites([...favorites, id]);
                }
            } catch (err) {
                console.error(err);
                window.alert("Não foi possível atualizar favoritos.");
            }
        },
        [favorites],
    );

    const value = useMemo(
        () => ({
            pokemon,
            favorites,
            loading,
            error,
            toggleFavorite,
            reload: loadInitialData,
        }),
        [pokemon, favorites, loading, error, toggleFavorite, loadInitialData],
    );

    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}

export function usePokedex() {
    const context = useContext(PokedexContext);
    if (!context)
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    return context;
}
```

### 9.2) Explicação com “mapa mental”

Quando a app abre:

1. Provider monta
2. `useEffect` chama `loadInitialData`
3. `loadInitialData` faz:
    - PokéAPI → lista de Pokémon
    - Backend → favoritos
4. Atualiza o estado
5. Pages re-renderizam com dados

### 9.3) Porque `useCallback` aqui

O `useEffect` depende de `loadInitialData`.
Se `loadInitialData` fosse criado de novo em cada render, o efeito podia re-disparar.
Com `useCallback`, tens uma referência estável.

### 9.4) `toggleFavorite` e o detalhe da dependência

`toggleFavorite` depende de `favorites`.
Isto cria um “fecho” (closure): ele usa o array atual para decidir POST vs DELETE.

Mais tarde, quando aprenderes padrões mais avançados, podes melhorar isto usando updates funcionais.
Mas nesta ficha, está ok e cumpre o objetivo.

### 9.5) `useMemo` no `value`

Sem `useMemo`, o `value` seria um objeto novo em cada render.
Com `useMemo`, só muda quando algo realmente mudou.

### Nota sobre React Strict Mode

Em desenvolvimento, o React pode chamar efeitos duas vezes para detetar problemas.
Se vires pedidos duplicados, confirma se estás em dev e se é comportamento esperado.

---

## 9.6) Como pensar em dependências (`[]`) sem decorar

Isto é o que costuma confundir mais alunos: “o que meto nas dependências?”

### Regra 1 — Um efeito depende do que usa

Se dentro do `useEffect` usas uma função/variável que vem de fora, o efeito depende disso.

No Provider:

- O `useEffect` chama `loadInitialData`
- Logo, as dependências incluem `loadInitialData`

Por isso existe o:

```js
useEffect(() => {
    loadInitialData();
}, [loadInitialData]);
```

### Regra 2 — `useCallback` e `useMemo` são para estabilidade (não para “performance” nesta fase)

Nesta ficha, a razão principal é:

- evitar efeitos a disparar mais do que queres
- evitar re-renders em cascata por objetos/funções sempre novos

### Regra 3 — Closure (a “fotografia” do estado)

Em `toggleFavorite`, repara que a função usa `favorites` lá dentro.
Isso significa que a função “vê” o valor de `favorites` do render atual.

É por isso que `toggleFavorite` tem `[favorites]` nas dependências:
para garantir que, quando `favorites` muda, a função muda e passa a ver o valor certo.

> Mais tarde, vais aprender uma alternativa com updates funcionais para reduzir dependências.
> Mas nesta ficha o objetivo é perceber o fluxo, não micro-otimizações.

---

## 10) Ligar o Provider no `main.jsx`

### Objetivo

- Garantir que todas as páginas têm acesso ao Context.

No `src/main.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { PokedexProvider } from "@/context/PokedexContext.jsx";

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

### Checkpoint

- Se alguma página chamar `usePokedex()` fora do Provider, vais ter erro.

---

## 11) `App.jsx` passa a ser só rotas

### 11.1) O que vais remover do `App.jsx`

- `useState` de pokemon/favorites/loading/error
- `useEffect` de load
- lógica de `localStorage`
- `fetchPokemonList` e constantes relacionadas

### 11.2) O que fica

- imports do Router
- `<Routes>` e `<Route>`

O componente final fica assim (apenas a parte do `App`):

```jsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PokemonListPage />} />
                <Route path="pokemon/:id" element={<PokemonDetailsPage />} />
                <Route path="favoritos" element={<FavoritesPage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
```

---

## 12) Atualizar Layout e Pages para consumirem Context

### 12.0) Mini‑teoria: migração para Context, re-render e atualizações imutáveis

Aqui estás a fazer uma mudança que parece “cosmética” (tirar props), mas que na verdade muda a arquitetura.

#### O que muda quando passas props → Context

Antes:

- o `App` tinha o estado
- o `App` passava tudo para as pages
- as pages passavam para componentes

Agora:

- o estado está no Provider
- as pages vão buscar diretamente ao Provider
- o `App` fica “limpo” (rotas apenas)

Isto torna a app mais fácil de evoluir porque o Router e o estado deixam de estar misturados no mesmo ficheiro.

#### Re-render: porque a UI muda quando o estado muda

Em React, a regra é:

- quando chamas `setState(...)`, o componente volta a renderizar
- e todos os filhos que dependem desse estado também podem renderizar

Por isso, quando o Provider faz:

- `setFavorites([...favorites, id])`

o React redesenha:

- a lista
- a página de detalhes
- a página de favoritos

Tudo porque essas páginas “lêem” `favorites`.

#### Atualizações imutáveis (porque usamos `[...]` e `filter`)

Repara que nunca fazemos:

- `favorites.push(id)`

Em vez disso, criamos um **novo array**:

- adicionar: `setFavorites([...favorites, id])`
- remover: `setFavorites(favorites.filter(...))`

Isto é importante porque:

- React deteta mudanças por referência (um array novo = mudou)
- evita bugs de “estado alterado em silêncio”

---

### 12.1) Regra prática

Se antes tinhas isto:

```jsx
<PokemonListPage
    pokemon={pokemon}
    favorites={favorites}
    onToggleFavorite={toggleFavorite}
/>
```

Agora não passas props, e dentro da page fazes:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
const { pokemon, favorites, loading, error, toggleFavorite, reload } =
    usePokedex();
```

### 12.2) Substituições típicas (lista)

- `props.pokemon` → `pokemon`
- `props.favorites` → `favorites`
- `props.loading` → `loading`
- `props.error` → `error`
- `props.onToggleFavorite` → `toggleFavorite`
- `props.onRetry` → `reload`

### 12.3) Fluxo quando clicas num favorito (para perceberes o que acontece)

1. Utilizador clica na estrela
2. `toggleFavorite(id)` é chamado
3. Provider decide POST ou DELETE
4. Backend responde
5. Provider atualiza `favorites`
6. React re-renderiza lista/detalhes/favoritos

### Checkpoint

- Nenhuma page recebe props do App.
- Favoritos continuam a atualizar a UI.

---

## 12.4) Guia de migração por ficheiro (v2 → v3)

Esta secção serve para te orientar quando abres o projeto e vês 10 erros de props.

A ideia é simples: **as Pages deixam de receber props** e passam a ir buscar tudo ao Context.

### a) `Layout.jsx`

Procura por props no `Layout` (ex.: `favorites`, `pokemon`, etc.).  
Depois:

1. Importa o hook:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
```

2. Dentro do componente:

```js
const { pokemon, favorites } = usePokedex();
```

> O objetivo é o Layout poder, por exemplo, mostrar contadores ou links com base nos favoritos.

### b) `PokemonListPage.jsx`

Antes (exemplo típico):

```js
function PokemonListPage({ pokemon, favorites, loading, error, onToggleFavorite, onRetry }) { ... }
```

Depois:

```js
function PokemonListPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } = usePokedex();
    ...
}
```

E substituis:

- `onToggleFavorite(...)` → `toggleFavorite(...)`
- `onRetry` → `reload`

### c) `PokemonDetailsPage.jsx`

Mesma ideia:

- remover props
- ler do Context
- substituir handlers

Exemplo de assinatura:

```js
function PokemonDetailsPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();
}
```

### d) `FavoritesPage.jsx`

Esta é a página onde normalmente se nota logo se o Context está bem:

- remove props
- lê `pokemon` + `favorites`
- filtra os pokemon favoritos como fazias antes

### e) Componentes pequenos (Cards, Buttons)

Se algum componente pequeno recebia `isFavorite` ou `onToggleFavorite` por props, isso pode continuar igual.
Não é proibido usar props — o objetivo é evitar passar props por 4 níveis sem necessidade.

Regra prática:

- Props **entre componentes próximos** (pai→filho direto) = ok
- Props a atravessar 3–4 níveis = Context começa a compensar

---

## 13) Executar o projeto

### Terminal A (backend)

```bash
cd backend
node src/server.js
```

### Terminal B (frontend)

Na raiz do projeto:

```bash
npm run dev
```

---

## 14) Debug: erros comuns e como pensar neles

### 14.1) CORS policy blocked

Isto é o browser a bloquear. Confirma:

- backend tem `cors({ origin: "http://localhost:5173" })`

### 14.2) `Erro API` (no frontend)

Pensa por camadas:

1. Backend está a correr?
2. URL está certo?
3. Endpoint existe? (`/api/favorites`)

### 14.3) POST não funciona

Normalmente é um destes:

- faltou `express.json()`
- o body não é JSON válido

### 14.4) Favoritos voltam ao inicial

Isto é esperado nesta ficha.
O objetivo é perceber o fluxo cliente-servidor.

---

## 14.5) FAQ rápida

### “Porque é que o meu backend perde os favoritos?”

Porque nesta ficha os favoritos estão num array em memória.  
Memória do processo Node = quando o processo morre, os dados vão embora.

### “Então isto não é inútil?”

Não. Isto é exatamente o passo intermédio antes de uma BD:

- Hoje: `favorites = [...]`
- Amanhã: `favorites` vem de MongoDB

O frontend não tem de saber onde os dados vivem — ele só fala com a API.

### “Posso fazer o backend arrancar com `npm start`?”

Podes, criando scripts no `backend/package.json`.  
Nesta ficha não é obrigatório, mas fica como melhoria opcional.

Exemplo:

```json
{
    "scripts": {
        "start": "node src/server.js"
    }
}
```

### “Porque é que o curl não acusa CORS?”

CORS é uma regra do **browser**.  
Ferramentas como curl/Postman não aplicam essa regra.

### “Tenho erros estranhos e não sei por onde começar”

Segue esta ordem:

1. Backend ligado? (porta 3000)
2. Rotas respondem? (testa `GET /api/favorites` no browser)
3. Frontend faz pedidos? (Network tab)
4. Erro é status code ou JS error? (Console)

---

## 15) Desafios opcionais (extra)

Sem mexer na base da ficha, podes tentar:

1. Adicionar um endpoint `DELETE /api/favorites` para limpar tudo.
2. Guardar favoritos em ficheiro `favorites.json`.
3. Trocar `alert` por um componente de erro mais bonito.

---

## 16) Exercícios propostos (para consolidar)

1. **Botão “Recarregar”**  
   Na UI, adiciona um botão que chama `reload()` do Context e volta a buscar dados.

2. **Mensagem de erro decente**  
   Em vez de `alert`, cria um componente simples `<ErrorBanner message="..." />`.

3. **Simular backend offline**  
   Desliga o backend e abre a app.  
   O que aparece? Onde é apanhado o erro? O que faz `error` no Provider?

4. **Validar no frontend**  
   Antes de chamar `addFavorite`, garante que o id é número (`Number(id)`).  
   (Em projetos maiores, isto evita muitos 422.)

5. **Endpoint extra no backend** (opcional)  
   Implementa `DELETE /api/favorites` para limpar tudo e testa com curl.

---

## 16) Perguntas de revisão

1. Porque é que precisamos de CORS?

2. Qual a diferença entre `400` e `422`?

3. O que é prop drilling e como o Context resolve?

4. O que faz `Promise.all` e porque é útil?

5. Porque é que nesta ficha os favoritos não “persistem” quando reinicias o backend?

---

## 18) Checklist de entrega (para trabalhos de grupo)

Se isto fosse um mini-projeto a entregar, eu esperava:

- Projeto arranca com `npm install` e `npm run dev`.
- Backend arranca com `node src/server.js` dentro de `backend/`.
- Sem erros na consola ao abrir a home.
- Favoritos funcionam em lista, detalhes e página de favoritos.
- Código organizado por pastas (services/context/routes).
- Mensagens de commit (se estiverem a usar Git) descritivas.

---

Fim.
