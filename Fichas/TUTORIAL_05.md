# Tutorial passo a passo — Pokédex v3 com Backend + Context (Ficha 05) (12.º ano)

Este tutorial **continua diretamente a Ficha 4**.
A app mantém o Router e o visual, mas agora ganha duas peças novas:

- **Backend Node.js + Express** (API própria para favoritos)
- **Context API** (estado global limpo, sem prop drilling)

> Projeto: **React + Vite (frontend)** + **Node + Express (backend)**.
> Não usamos base de dados nesta ficha (dados em memória no backend).

---

## 0) O que vais construir

Uma Pokédex digital igual à Ficha 4, mas agora com backend real:

- Lista, pesquisa, filtros e detalhes (igual à v2)
- Favoritos **guardados no backend** (não em `localStorage`)
- Context API para partilhar estado global (pokemon, favoritos, loading/erro)
- Rotas reais (`/`, `/pokemon/:id`, `/favoritos`, `*`)

### 0.1) Ligações diretas aos temas 1–12

1. **Fundamentos e setup** — Vite, estrutura base, `main.jsx`.
2. **JSX e componentes** — UI dividida em componentes pequenos.
3. **Props e composição** — refactor para Context (menos props).
4. **Estado e eventos** — `useState`, handlers, inputs.
5. **Listas e condicionais** — `map`, `filter`, ternários.
6. **Formulários controlados** — pesquisa controlada.
7. **Assíncrono** — `fetch`, `async/await`.
8. **useEffect e dados externos** — carregar API no arranque.
9. **React Router fundamentos** — `BrowserRouter`, `Routes`, `Route`.
10. **Navegação e rotas dinâmicas** — `useParams`, `useSearchParams`.
11. **Consumo de API e backend Node** — Express + CORS + fetch.
12. **Context API e estado global** — Provider + `useContext`.

### 0.2) Mapa de fases (visão rápida)

- Fase 1 — Criar a v3 a partir da v2
- Fase 2 — Backend mínimo (Express + CORS)
- Fase 3 — Contrato e rotas de favoritos
- Fase 4 — Testes rápidos ao backend
- Fase 5 — Serviço de API no frontend
- Fase 6 — Context API (PokedexProvider)
- Fase 7 — `App.jsx` sem estado (rotas limpas)
- Fase 8 — Layout e Pages a usar Context

---

## 1) Pré-requisitos

- Ficha 4 funcional (rotas, filtros, favoritos em `localStorage`)
- Node.js (18 ou superior)
- npm
- Terminal + editor (VS Code)

Antes de começar:

```bash
npm run dev
```

Confirma que a Ficha 4 está a funcionar bem.

---

## 2) Criar a v3 a partir da v2

Vamos duplicar a pasta da Ficha 4 para manter tudo limpo.

### macOS / Linux

```bash
cp -R pokedex-v2 pokedex-v3
cd pokedex-v3
```

### Windows (cmd)

```bash
xcopy /E /I pokedex-v2 pokedex-v3
cd pokedex-v3
```

A partir daqui, **trabalha sempre em `pokedex-v3`**.

---

## 3) Estrutura final (objetivo da ficha)

```
pokedex-v3/
  backend/
    package.json
    src/
      app.js
      server.js
      routes/
        favorites.routes.js
  src/
    App.jsx
    main.jsx
    context/
      PokedexContext.jsx
    services/
      pokeApi.js
      favoritesApi.js
    components/
    styles/
```

> Repara: o frontend continua igual, só adicionamos uma pasta `backend/` e um `context/`.

---

## 4) Conceitos essenciais (rápido)

- **Backend e a fonte de verdade**: o frontend só mostra e edita.
- **Contrato de API**: define URLs, métodos, body, resposta e erros.
- **Context**: evita passar props por muitos níveis.

---

# PARTE A — BACKEND

## 5) Fase 1 — Backend mínimo (Express + CORS)

### 5.1) Criar pasta e instalar dependências

Na raiz do projeto:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors
```

No `backend/package.json`, garante `"type": "module"`:

```json
{
    "type": "module"
}
```

### 5.2) `backend/src/app.js`

Cria `backend/src/app.js`:

```js
import express from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

export default app;
```

### 5.3) `backend/src/server.js`

Cria `backend/src/server.js`:

```js
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`);
});
```

Checkpoint:

- Se correr `node src/server.js`, aparece a mensagem no terminal.

---

## 6) Fase 2 — Contrato de favoritos

Vamos definir um contrato simples para guardar IDs de Pokémon favoritos.

### Endpoints

- **GET** `/api/favorites` → devolve lista de IDs
- **POST** `/api/favorites` → adiciona ID
- **DELETE** `/api/favorites/:id` → remove ID

### Exemplo de resposta (GET)

```json
[1, 4, 25]
```

### Exemplo de body (POST)

```json
{ "id": 25 }
```

### Formato de erro (padrao da disciplina)

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Status codes que vamos usar

- `400 INVALID_ID` → id malformado no URL
- `404 NOT_FOUND` → id valido, mas não existe
- `409 DUPLICATE_KEY` → favorito ja existe
- `422 VALIDATION_ERROR` → body invalido

---

## 7) Fase 3 — Rotas de favoritos (incremental)

### 7.1) Criar o ficheiro base

Cria `backend/src/routes/favorites.routes.js`:

```js
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

export default router;
```

### 7.2) GET /api/favorites

Abaixo, adiciona a rota GET:

```js
router.get("/", (req, res) => {
    res.status(200).json(favorites);
});
```

### 7.3) POST /api/favorites

Agora adiciona a rota POST (validacao + duplicados):

```js
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
```

### 7.4) DELETE /api/favorites/:id

Adiciona a rota DELETE:

```js
router.delete("/:id", (req, res) => {
    const numericId = parseId(req.params.id);

    if (!numericId) {
        return sendError(res, 400, "INVALID_ID", "Id invalido");
    }

    if (!favorites.includes(numericId)) {
        return sendError(res, 404, "NOT_FOUND", "Favorito não encontrado");
    }

    favorites = favorites.filter((id) => id !== numericId);
    res.status(200).json({ id: numericId });
});
```

### 7.5) Ligar rotas no `app.js`

No `backend/src/app.js`, importa e liga as rotas:

```js
import favoritesRoutes from "./routes/favorites.routes.js";

app.use("/api/favorites", favoritesRoutes);
```

Checkpoint:

- O backend tem rotas de favoritos ligadas.

---

## 8) Fase 4 — Testar o backend (rápido)

Na pasta `backend/`:

```bash
node src/server.js
```

Noutro terminal, testa:

```bash
curl http://localhost:3000/api/favorites
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"id": 7}'
curl -X DELETE http://localhost:3000/api/favorites/7
```

Se o backend responder com JSON, está OK.

---

# PARTE B — FRONTEND

## 9) Fase 5 — Serviço de API no frontend

Vamos criar um ficheiro para falar com o backend.

Cria `src/services/favoritesApi.js`:

```js
const API_BASE = "http://localhost:3000";

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const hasJson = contentType.includes("application/json");
    const data = hasJson ? await response.json() : null;

    if (!response.ok) {
        const message = data?.error?.message || "Erro na API";
        throw new Error(message);
    }

    return data;
}

export function getFavorites() {
    return apiRequest("/api/favorites");
}

export function addFavorite(id) {
    return apiRequest("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ id }),
    });
}

export function removeFavorite(id) {
    return apiRequest(`/api/favorites/${id}`, {
        method: "DELETE",
    });
}
```

Checkpoint:

- Tens um módulo dedicado para falar com o backend.

---

## 10) Fase 6 — Context API (estado global)

Vamos criar um Provider que guarda:

- Lista de Pokémon (PokéAPI)
- Favoritos (backend)
- Loading + erro
- `toggleFavorite` e `reload`

Cria `src/context/PokedexContext.jsx`:

```jsx
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
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
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
                    setFavorites((prev) =>
                        prev.filter((favId) => favId !== id),
                    );
                } else {
                    await addFavorite(id);
                    setFavorites((prev) => [...prev, id]);
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
    if (!context) {
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    }
    return context;
}
```

Notas:

- Mantemos o `POKEMON_LIMIT` aqui, para o Context ser a fonte de verdade.
- O `reload` volta a buscar pokemon + favoritos.

---

## 11) Fase 7 — Ligar o Provider no `main.jsx`

No `src/main.jsx`, envolve o `<App />`:

```jsx
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

Checkpoint:

- O Provider está acima de todas as páginas.

---

## 12) Fase 8 — `App.jsx` (incremental)

Agora o estado sai do `App` e entra no Context.
**Não vais escrever o `App` de uma só vez.**

### 12.1) Limpar imports e constantes

No topo de `src/App.jsx`:

- Remove `useEffect`, `useState`.
- Remove o import de `fetchPokemonList`.
- Remove `POKEMON_LIMIT` e `FAVORITES_KEY`.

O import fica apenas com React Router e as páginas:

```js
import { Route, Routes } from "react-router-dom";
import FavoritesPage from "@/components/FavoritesPage.jsx";
import Layout from "@/components/Layout.jsx";
import NotFound from "@/components/NotFound.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
```

### 12.2) Apagar estado e efeitos antigos

Apaga do `App`:

- `useState` de `pokemon`, `loading`, `error`, `favorites`
- `useEffect` de `loadPokemonList` e `localStorage`
- Funcoes `toggleFavorite`, `handleRetry`, `loadPokemonList`

### 12.3) Ajustar o JSX das rotas

Substitui o `return` para não passar props:

```jsx
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
```

Checkpoint:

- O `App.jsx` ficou apenas com rotas.

---

## 13) Fase 9 — Layout e Pages a usar Context

Agora vamos buscar o estado com `usePokedex()`.

### 13.1) `Layout.jsx`

No topo, importa o hook:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
```

Substitui a assinatura do componente:

```js
function Layout() {
    const { pokemon, favorites } = usePokedex();
    // ... resto igual
}
```

Não precisas de mudar mais nada.

---

### 13.2) `PokemonListPage.jsx`

No topo, importa:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
```

Depois, troca a assinatura e usa o Context:

```js
function PokemonListPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();
    // ... resto igual
}
```

Onde estava `onToggleFavorite`, usa `toggleFavorite`.
Onde estava `onRetry`, usa `reload`.

---

### 13.3) `PokemonDetailsPage.jsx`

No topo:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
```

Assinatura:

```js
function PokemonDetailsPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();
    // ... resto igual
}
```

Substitui `onToggleFavorite` por `toggleFavorite` e `onRetry` por `reload`.

---

### 13.4) `FavoritesPage.jsx`

No topo:

```js
import { usePokedex } from "@/context/PokedexContext.jsx";
```

Assinatura:

```js
function FavoritesPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();
    // ... resto igual
}
```

Substitui `onToggleFavorite` por `toggleFavorite` e `onRetry` por `reload`.

---

Checkpoint:

- Nenhuma Page recebe props do `App`.
- O estado vive todo no Context.

---

## 14) Checkpoints rápidos por fase

- **Fase 1:** pasta `backend/` criada.
- **Fase 2:** contrato de favoritos definido.
- **Fase 3:** GET/POST/DELETE a responderem.
- **Fase 4:** testes com `curl` OK.
- **Fase 5:** `favoritesApi.js` criado.
- **Fase 6:** `PokedexProvider` montado.
- **Fase 7:** `App.jsx` só tem rotas.
- **Fase 8:** Layout/Pages usam `usePokedex`.

---

## 15) Estrutura final (check rápido)

```
src/
  App.jsx
  main.jsx
  context/
    PokedexContext.jsx
  services/
    pokeApi.js
    favoritesApi.js
  components/
  styles/
backend/
  src/
    app.js
    server.js
    routes/
      favorites.routes.js
```

---

## 16) Executar o projeto

### Terminal 1 (backend)

```bash
cd backend
node src/server.js
```

### Terminal 2 (frontend)

Na raiz do projeto:

```bash
npm run dev
```

Abre `http://localhost:5173`.

---

## 17) Checklist final

- [ ] Backend a correr em `http://localhost:3000`
- [ ] GET/POST/DELETE favoritos funcionam
- [ ] Favoritos aparecem ao recarregar a página
- [ ] Context API está a fornecer dados
- [ ] Rotas `/`, `/pokemon/:id`, `/favoritos`, `*` continuam OK

---

## 18) Resumo de erros comuns

- **CORS bloqueado**: a origin no backend não e `http://localhost:5173`.
- **Erro na API**: backend não está ligado.
- **`usePokedex` fora do Provider**: Provider não envolve o App.
- **JSON não lido**: esqueceste `app.use(express.json())`.
- **IDs errados**: `id` chega como string e não e convertido.
- **Favoritos a zero**: backend reiniciou (dados em memoria).

---

Fim.
