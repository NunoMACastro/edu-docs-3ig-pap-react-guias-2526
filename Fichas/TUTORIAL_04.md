# Tutorial passo a passo — Migração da Pokédex Explorer (Ficha 03) para Pokédex v2 com Router (Ficha 04) (12.º ano)

Este tutorial **continua diretamente a Ficha 3**.
A ideia é simples: **mantemos a mesma app**, o mesmo visual e os mesmos dados,
mas **substituímos a navegação por estado** por **rotas reais** com React Router.

---

## 0) O que vais construir (igual à Ficha 3, agora com Router)

Uma Pokédex digital com dados reais da **PokéAPI**, agora com rotas reais:

- Lista dos **151 Pokémon (Gen 1)**
- Pesquisa por nome (input controlado)
- Filtro por tipo (botões)
- Favoritos com persistência (`localStorage`)
- Página de detalhes **com rota dinâmica** `/pokemon/:id`
- Query string para partilhar filtros: `?q=...&type=...`
- Layout com menu e rota 404

### 0.1) Ligações diretas aos 10 temas

1. **Fundamentos e setup** — Vite, estrutura base, `index.html`, `main.jsx`.
2. **JSX e componentes** — UI dividida em componentes pequenos.
3. **Props e composição** — dados e handlers via props.
4. **Estado e eventos** — `useState`, cliques, inputs.
5. **Listas e condicionais** — `map`, `filter`, `&&`, ternários.
6. **Formulários controlados** — input com `value` e `onChange`.
7. **Assíncrono** — `fetch`, `async/await`, `Promise.all`.
8. **useEffect e dados externos** — carregar API e guardar/ler do `localStorage`.
9. **React Router fundamentos** — `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`.
10. **Navegação e rotas dinâmicas** — `useParams`, `useNavigate`, query string e 404.

### 0.2) Mapa de fases (visão rápida)

- Fase 1 — Router mínimo (BrowserRouter + App com Routes simples)
- Fase 2 — Layout com `Outlet` + `NavLink`
- Fase 2.5 — Router sem mexer na lógica (só no return)
- Fase 3 — Extrair lista para `PokemonListPage` (ainda sem query string)
- Fase 4 — Migrar detalhes para `/pokemon/:id`
- Fase 5 — Migrar filtros para query string (`q` e `type`)
- Fase 6 — FavoritesPage e rota 404 (`*`)

---

## 1) Pré‑requisitos

- Ficha 3 concluída e a correr (`pokedex-explorer`)
- Node.js (18 ou superior)
- npm
- VS Code (ou outro editor)

---

## 2) Criar a v2 a partir da v1 (sem recomeçar do zero)

### 2.1) Duplicar a pasta (opção simples)

```bash
cp -R pokedex-explorer pokedex-v2
cd pokedex-v2
```

**No Windows:** duplica a pasta no Explorador **ou** usa:

```bat
xcopy /E /I pokedex-explorer pokedex-v2
cd pokedex-v2
```

### 2.2) OU criar uma branch (se usares Git)

```bash
git checkout -b ficha4-router
```

### 2.3) Instalar o React Router

Entra na pasta do projeto (se ainda não estiveres lá) e instala o React Router:

```bash
npm install react-router-dom
```

### 2.4) Alias `@` (mantém o da Ficha 3)

Não mexas no `vite.config.js` — mantém exatamente o da Ficha 3.
Mantém também o `jsconfig.json` igual ao da Ficha 3 para o VS Code.

### Checkpoint

- `import App from "@/App.jsx"` funciona sem erros?

### Erros comuns

- Alterar o `vite.config.js` sem necessidade e quebrar os imports.
- Esquecer o `jsconfig.json` e o editor sublinhar `@/`.

### Como depurar

- Erro típico: `Failed to resolve import "@/..."`.
- Confirma se o alias `@` está igual ao da Ficha 3.

---

## 3) Reaproveitar o que já existe

Nesta migração, **não voltas a escrever tudo**. Vais **reaproveitar**:

- `SearchBar`, `TypeFilter`, `PokemonCard`, `LoadingSpinner`, `ErrorMessage`
- `services/pokeApi.js`
- `typeData.js` (com **cores e gradientes** da Ficha 3)
- `styles/index.css` e `styles/pokedex.css` **da Ficha 3**

**Nota de organização:** nesta ficha **mantemos a estrutura da Ficha 3**.
As novas “páginas” do Router ficam em `components/` para não introduzir uma
mudança estrutural agora. Em contexto profissional, faz sentido separar
`pages/` e `data/`, mas isso fica para uma ficha futura.

---

## 4) Estrutura final (objetivo da ficha)

```
src/
  main.jsx
  App.jsx
  styles/
    index.css
    pokedex.css
  services/
    pokeApi.js
  components/
    ErrorMessage.jsx
    LoadingSpinner.jsx
    PokemonCard.jsx
    PokemonDetailsPage.jsx
    SearchBar.jsx
    TypeFilter.jsx
    typeData.js
    Layout.jsx
    PokemonListPage.jsx
    FavoritesPage.jsx
    NotFound.jsx
```

---

## 5) Estilos (mantém os da Ficha 3)

**Não substituas os estilos.** A Ficha 4 deve ficar com o mesmo visual da Ficha 3.
Mantém:

- `src/styles/index.css`
- `src/styles/pokedex.css`

Se por alguma razão não os tens, copia exatamente os ficheiros da Ficha 3.

---

## 5.5) Conceitos essenciais antes do Router (revisão rápida)

Antes de entrares nas fases, revê estes conceitos. Esta secção liga a Ficha 3
à Ficha 4 e evita que os temas “caiam do céu”.

### 5.5.1) O que são rotas

Rotas são **caminhos de URL** que mapeiam para componentes.
Numa SPA (Single Page App), mudar de rota **não recarrega a página**:
apenas muda o componente que aparece no ecrã.

### 5.5.2) O que é o React Router

O React Router é a biblioteca que **interpreta a URL** e decide
**que componente renderizar**. Ele também trata da navegação sem reload
quando usas `Link`/`NavLink`.

### 5.5.3) BrowserRouter, Routes, Route (o “mapa”)

- `BrowserRouter` liga a app ao histórico do browser.
- `Routes` é o contentor onde declaras as rotas.
- `Route` diz: “quando a URL é X, mostra Y”.

Exemplo mental: `Route` é uma regra do mapa; `Routes` é o conjunto de regras.

### 5.5.4) Navegação sem reload (Link, NavLink, useNavigate)

- `Link` navega sem recarregar a página.
- `NavLink` faz o mesmo, mas adiciona estado “ativo” para estilos.
- `useNavigate` permite navegar **por código** (ex.: clique num card).

### 5.5.4.1) Mini-sandbox do Router (3 ficheiros, sem Pokédex)

Se algum aluno estiver perdido, faz este mini-teste isolado antes de continuar:

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
```

```jsx
// src/App.jsx
import { Routes, Route, NavLink } from "react-router-dom";

function Home() {
    return <h1>Home</h1>;
}

function Sobre() {
    return <h1>Sobre</h1>;
}

function Contactos() {
    return <h1>Contactos</h1>;
}

function App() {
    return (
        <div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sobre">Sobre</NavLink>
                <NavLink to="/contactos">Contactos</NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contactos" element={<Contactos />} />
            </Routes>
        </div>
    );
}

export default App;
```

### 5.5.5) Outlet e rotas aninhadas

`Outlet` é o “buraco” onde aparece a rota filha.
Rotas aninhadas permitem ter **um Layout fixo** (menu/hero) e trocar apenas
o conteúdo.

### 5.5.6) O que são hooks

Hooks são funções do React que “ligam” o componente a estado, efeitos
ou ao Router. **Regra de ouro:** só podem ser chamados **dentro de componentes**
e **sempre na mesma ordem**.

### 5.5.7) Hooks do Router usados nesta ficha

- `useParams()` lê valores dinâmicos do caminho (`/pokemon/:id`).
- `useSearchParams()` lê/escreve a query string (`?q=...&type=...`).
- `useNavigate()` navega programaticamente.
- `useLocation()` dá acesso à URL atual (inclui `search`).

### 5.5.8) Query string como estado

A query string é parte da URL e é perfeita para filtros: é **partilhável**,
**reproduzível** e sobrevive a refresh. Na Ficha 4, `searchTerm` fica em `q`
e o tipo fica em `type`.

### 5.5.9) Rota 404 (fallback)

A rota `*` é um “apanha tudo”. Se nenhuma rota coincidir, aparece a 404.

### 5.5.10) Dev vs Prod (resumo rápido)

**Observações (Dev vs Prod):**

- **Dev** é o modo de desenvolvimento local (`npm run dev`): mais avisos e verificações. É normal ver efeitos duplicados.
- **Prod** é o build final (`npm run build` + `npm run preview`): código otimizado, mais rápido e sem efeitos duplicados do StrictMode. É o código que vai ser colocado no servidor.
- Se vires comportamento “estranho” em dev (duplicações, logs extra), confirma se acontece também em prod.

**Observações:**

- Nesta ficha **não mudamos UI nem dados**: só mudamos a navegação.
- Se alguma palavra não fizer sentido, volta a esta secção durante as fases.

---

## 6) Observações do React Router

Este capítulo organiza o Router em 3 ideias simples (6.1–6.3) e termina
com uma lista do que vais **substituir/remover** quando chegares à fase certa
(6.4). Lê agora e volta aqui sempre que precisares de contexto.

### 6.1) Outlet e rotas aninhadas (pai e filha)

**Observações:**

- A rota **pai** define a moldura (menu, cabeçalho).
- A rota **filha** é o conteúdo que muda.
- O `<Outlet />` é a “janela” onde a filha aparece.

Exemplo curto:

```jsx
<Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="sobre" element={<Sobre />} />
</Route>
```

Micro‑snippet (o `Layout` com `Outlet`):

```jsx
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <nav>...</nav>
            <Outlet />
        </div>
    );
}
// Sem <Outlet />, a rota filha nunca aparece.
```

**Erros comuns:**

- Esquecer o `<Outlet />` no `Layout` e ver a página vazia.
- Escrever `path="/sobre"` na rota filha (quebra a lógica do layout).

**Boas práticas:**

- Mantém os `path` das rotas filhas **relativos** ao `Layout`.
- Deixa o `Layout` focado em moldura (sem lógica de dados).
- Usa `NavLink` quando precisares de estado ativo no menu.

**Como depurar:**

- Se o menu aparece mas o conteúdo não, confirma o `<Outlet />`.
- Se a rota filha não aparece, revê se o `path` é relativo.

### 6.2) `useParams` vs `useSearchParams` (tudo vem como texto)

**Observações:**

- `useParams()` lê valores do **caminho**: `/pokemon/:id`.
- `useSearchParams()` lê valores da **query string**: `?q=pika&type=fire`.

**Regra de ouro:** tudo vem como **string** (ou `null`).

```jsx
const { id } = useParams();
const numericId = Number(id); // Converte para número

const [params] = useSearchParams();
const searchTerm = params.get("q") ?? ""; // Evita null
```

**Erros comuns:**

- Comparar `id` (string) com número e não encontrar resultados.
- Fazer `searchParams.get("q").trim()` quando o valor é `null`.
- Esquecer que `useSearchParams` **não atualiza** estado local automaticamente.

**Boas práticas:**

- Converte `id` para número com `Number(id)` antes de comparar.
- Normaliza `searchTerm` (de `q`) e `type` com `|| ""` para evitar `null`.
- Mantém a URL como fonte de verdade dos filtros.

### 6.3) Rota `*` no fim (apanha tudo)

**Observações:**

- A rota `*` é o **fallback**.
- Se nenhuma rota combinar, ela aparece.

**Erros comuns:**

- Colocar `*` no meio e “comer” todas as rotas seguintes.
- Esquecer a rota `*` e ver uma página vazia em caminhos inválidos.

**Boas práticas:**

- Coloca a rota `*` **sempre no fim** da lista de rotas.
- Usa uma página 404 simples com `Link` para voltar.

**Como depurar:**

- Abre `/qualquer-coisa` e confirma que aparece a 404.
- Se não aparece, revê a ordem das rotas no `Routes`.

---

## 6.4) O que vai ser removido/substituído mais à frente

Na migração para Router, **mais à frente** deixamos de usar navegação por estado.
Na **Fase 2.5** essa navegação ainda existe (é a ponte), e só depois é que a
substituímos por rotas reais.

**Vai ser removido/substituído:**

- `currentPage` (a página passa a ser decidida pela **URL**).
- `selectedPokemon` (o Pokémon vem de `/pokemon/:id`).
- `handlePokemonClick` + `handleBackToList` por `useNavigate` e rotas reais.

**Observações:**  
a URL passa a ser a **fonte de verdade** da navegação.

---

## 6.5) Backup do `App` da Ficha 3

Antes de começares a mexer no Router, guarda o `App.jsx` da Ficha 3.
Assim consegues comparar ou voltar atrás sem stress.

Escolhe **uma** destas opções:

- **Backup rápido:** copia `src/App.jsx` para `src/App.ficha3.jsx`.
- **Git:** faz commit antes de mexer.

---

## 7) Fase 1 — Router mínimo

Objetivo: garantir que o Router está a funcionar **antes** de migrar a UI.

### Observações

Primeiro garantimos a **ligação do Router**.
Se o Router não estiver ativo, tudo o resto falha (Routes, NavLink, useParams).
Nesta fase, o objetivo é apenas confirmar o “fio elétrico” entre `main.jsx` e `App.jsx`.

### 7.1) `src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.jsx";
import "@/styles/index.css";
import "@/styles/pokedex.css";

/**
 * ============================================
 * PONTO DE ENTRADA
 * ============================================
 *
 * Descrição: Lê o elemento root e monta o componente
 * principal da Pokédex dentro de React StrictMode.
 *
 * CONCEITOS APLICADOS:
 * - Fundamentos (entrada do React + StrictMode)
 * - React Router (BrowserRouter)
 * - Imports via alias (@)
 * - Estilos globais carregados antes da renderização
 *
 * NOTAS PEDAGÓGICAS:
 * - Sem BrowserRouter, Link/Routes/useParams falham.
 * - Este ficheiro não deve ter lógica de UI.
 *
 * @returns {void}
 */
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* O Router tem de envolver toda a app */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
```

### 7.2) `src/App.jsx` (versão mínima)

Este bloco **SUBSTITUI** temporariamente o `App.jsx` da Ficha 3.
Fazemos isto para testar o Router sem interferir com a UI da Ficha 3.

```jsx
import { Routes, Route } from "react-router-dom";

/**
 * ============================================
 * App (Fase 1)
 * ============================================
 *
 * Descrição: Router mínimo para confirmar que as rotas
 * estão a funcionar antes de migrar o resto da app.
 *
 * CONCEITOS APLICADOS:
 * - Routes + Route
 */
function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<p className="pokedex__empty">Router OK</p>}
            />
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Esquecer o `BrowserRouter` e ver erros ao usar `Routes`.
- Manter o `App.jsx` antigo ao lado (duas versões no mesmo ficheiro).
- Não ter `div#root` no `index.html` e a app não montar.

### Como depurar

- Se vires ecrã branco, confirma se o `App.jsx` foi mesmo substituído.
- Abre o console e confirma se há erros do Router (ex.: `useRoutes()`).

### Checkpoint

- A página mostra “Router OK”?

---

## 8) Fase 2 — Layout com `Outlet` + `NavLink`

### Observações

O `Layout` é a “moldura fixa” e o `<Outlet />` é a “janela” onde a página muda.
O Layout é a moldura; o `Outlet` é o sítio onde a página da rota aparece.
Aqui ainda não ligamos dados; só garantimos que a moldura aparece em todas as rotas.

### 8.1) `src/components/Layout.jsx`

Cria o ficheiro. Vamos **reutilizar as classes da Ficha 3** para
não mexer nos estilos.

```jsx
import { NavLink, Outlet } from "react-router-dom";

/**
 * ============================================
 * Layout
 * ============================================
 *
 * Descrição: Moldura base da app com hero e navegação.
 *
 * CONCEITOS APLICADOS:
 * - Layout route + Outlet
 * - NavLink para estado ativo
 *
 * NOTAS PEDAGÓGICAS:
 * - Sem <Outlet />, as páginas filhas não aparecem.
 * - Reutilizamos classes existentes para manter o visual.
 */

/**
 * @returns {JSX.Element} Layout principal.
 */
function Layout() {
    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Descobre e explora os 151 Pokémon originais
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total de Pokémon
                            <strong>151</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>0</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Resultados filtrados
                            <strong>0</strong>
                        </div>
                    </div>
                </div>
                <div className="pokedex__hero-pokeball" aria-hidden="true" />
            </header>

            {/*
                Navegação com classes já existentes (sem alterar CSS).
                O NavLink aplica a classe "active" e o style mantém a aparência
                de botão (inclui background/border e realce ativo).
            */}
            <nav className="type-filter" aria-label="Navegação principal">
                <span className="type-filter__label">Navegação</span>
                <div className="type-filter__buttons">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Lista
                    </NavLink>
                    <NavLink
                        to="/favoritos"
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Favoritos
                    </NavLink>
                </div>
            </nav>

            {/* A rota filha aparece aqui */}
            <Outlet />
        </div>
    );
}

export default Layout;
```

> Os contadores ainda são placeholders. Vamos ligá‑los na Fase 5.

### 8.2) `src/App.jsx` (com Layout)

Este bloco **SUBSTITUI** o `App.jsx` da fase anterior.
Precisamos do `Layout` para ter `Outlet` e navegação comum em todas as rotas.

```jsx
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.jsx";

/**
 * ============================================
 * App (Fase 2)
 * ============================================
 *
 * Descrição: Estrutura base com Layout + rota filha.
 *
 * CONCEITOS APLICADOS:
 * - Routes aninhadas
 * - Layout route
 */
function App() {
    return (
        <Routes>
            {/* Rota pai com Layout (moldura fixa). */}
            <Route path="/" element={<Layout />}>
                {/* Rota filha index = "/". */}
                <Route
                    index
                    element={
                        <p className="pokedex__empty">
                            Página temporária (fase 2). A lista vem na fase 3.
                        </p>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Esquecer o `<Outlet />` no `Layout` e ver só o hero.
- Usar `<a href>` em vez de `NavLink` (recarrega a página).
- Esquecer o `end` no link da lista e ele ficar ativo em todas as rotas.

### Como depurar

- Se o menu aparece e o conteúdo não, revê o `Outlet`.
- Confirma se a rota filha está dentro de `<Route path=\"/\" element={<Layout />}>`.

### Checkpoint

- O hero aparece?
- “Lista” fica ativa apenas em `/`?

---

## 8.5) Fase 2.5 — Router sem mexer na lógica

Objetivo: a app fica **igual à Ficha 3**.  
Mudança: **só mexemos no `return`**.
Não substituas o ficheiro todo: troca apenas o bloco do `return`.

### Parte A — Mantém‑se igual (lógica)

Tudo o que é estado, `useEffect`, fetch, favoritos, filtragem e handlers
fica **exatamente igual** ao que já tens da Ficha 3.
Isso inclui a navegação por estado com `currentPage` e `selectedPokemon`.

### Parte B — O que muda (renderização via Router)

O `return` passa a ser controlado pelo Router.  
Em vez de “mostrar a lista diretamente”, colocamos a lista **inline**
dentro de um `Route index` (o ecrã principal em `/`).
Quando estás em `/`, o Router renderiza exatamente esse `index`.

#### Antes (mini trecho do return antigo)

```jsx
return (
    <div className="pokedex">
        <header className="pokedex__hero">...</header>
        {currentPage === "list" && (/* lista + filtros + grid */)}
        {currentPage === "details" && selectedPokemon && (
            /* detalhes */
        )}
    </div>
);
```

#### Depois (só o return com Routes + Layout)

```jsx
return (
    <Routes>
        <Route
            path="/"
            element={
                <Layout
                    /* se já tens contadores reais no Layout,
                       passa aqui pokemon e favorites */
                />
            }
        >
            <Route
                index
                element={
                    <>
                        {/* Aqui metes inline o que antes renderizavas no App */}
                        {currentPage === "list" && (/* lista + filtros + grid */)}
                        {currentPage === "details" && selectedPokemon && (
                            /* detalhes */
                        )}
                    </>
                }
            />
        </Route>
    </Routes>
);
```

### Checkpoint

- A app deve estar **igual** à Ficha 3 (mesma UI e comportamento).
- A diferença é que agora está “dentro de rotas”.

---

## 9) Ficheiros reutilizados (ajustar, não reescrever)

Nesta fase confirmas os ficheiros base. Se já os tens da Ficha 3, **mantém**
e **apenas ajusta** onde indicado.

Mantém também os cabeçalhos e JSDoc da Ficha 3 (não apagues comentários).

### 9.1) `src/components/typeData.js` (igual à Ficha 3)

Este ficheiro **é exatamente o mesmo** da Ficha 3.
Mantém‑no em `src/components/typeData.js` e não o reescrevas.
Não alteres cores, gradientes ou helpers.

Exemplo de import (o conteúdo fica igual ao da Ficha 3):

```js
import { getTypeGradient, TYPE_SEQUENCE } from "@/components/typeData.js";
```

### 9.2) `src/services/pokeApi.js` (mesmo helper da Ficha 3)

Mantém a lógica da Ficha 3. Este ficheiro **já está** em `src/services/`,
por isso não o reescrevas nem o movas.
Não alteres o formato dos dados devolvidos (mantém o objeto Pokémon da Ficha 3).

Exemplo de import:

```js
import { fetchPokemonList } from "@/services/pokeApi.js";
```

### 9.3) `LoadingSpinner.jsx` (igual à Ficha 3)

Mantém o componente **exatamente igual** ao da Ficha 3.
Não alteres classes, texto nem estrutura.

Exemplo de import:

```js
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
```

### 9.4) `ErrorMessage.jsx` (igual à Ficha 3)

Mantém o componente **igual ao da Ficha 3**.
Se tiveres texto, classes ou emojis, mantém exatamente como está.

Exemplo de import:

```js
import ErrorMessage from "@/components/ErrorMessage.jsx";
```

### 9.5) `SearchBar.jsx` (igual à Ficha 3)

Mantém o componente **igual ao da Ficha 3**.
Se a tua versão tiver ícone/emoji, mantém; se não tiver, não adiciones.

Exemplo de import:

```js
import SearchBar from "@/components/SearchBar.jsx";
```

### 9.6) `TypeFilter.jsx` (igual à Ficha 3, só muda o import)

Mantém o componente **igual ao da Ficha 3**.
A única mudança é o import do `typeData`.

```js
import { getTypeGradient, TYPE_SEQUENCE } from "@/components/typeData.js";
```

### 9.7) `PokemonCard.jsx` (igual à Ficha 3, só muda o import)

Mantém o componente **igual ao da Ficha 3**.
A única mudança é o import do `typeData`.

```js
import { getTypeGradient } from "@/components/typeData.js";
```

---

## 10) Fase 3 — Extrair a lista para `PokemonListPage`

Objetivo: tirar a lógica de lista do `App.jsx` e colocar numa **page**.
Nesta fase ainda **não usamos query string** (isso vem na Fase 5).

### Observações

O `App` deixa de renderizar a lista diretamente e passa a **entregar dados** a uma page.
A page é responsável pela UI da lista (filtros, grid e estados visuais),
mas o estado global continua no `App`.

**Reutilização:** usa `SearchBar`, `TypeFilter`, `PokemonCard`, `LoadingSpinner`
e `ErrorMessage` exatamente como estão na Ficha 3; só ajusta imports.

### Nota importante sobre hooks

> **Hooks só podem ser chamados dentro do corpo de um componente.**
> Não coloques `useState`, `useMemo`, `useEffect` fora do `function`.

Antes de usares callbacks pela primeira vez nesta ficha, reve a secao "Callbacks e fluxo de dados" em `React/03_props_e_composicao.md#sec-3`.

### 10.1) Fase A — lista simples

Este bloco **SUBSTITUI** o anterior (se existir).
Evita ter duas versões da lista ativas ao mesmo tempo.

```jsx
import { useNavigate } from "react-router-dom";
import PokemonCard from "@/components/PokemonCard.jsx";

/**
 * ============================================
 * PokemonListPage (Fase A)
 * ============================================
 *
 * Descrição: Lista base sem filtros.
 *
 * CONCEITOS APLICADOS:
 * - Props + listas
 * - Navegação programática com useNavigate
 */

/**
 * @param {object} props
 * @param {Array} props.pokemon - Lista de Pokémon.
 * @param {number[]} props.favorites - IDs favoritos.
 * @param {(id: number) => void} props.onToggleFavorite - Alterna favorito.
 * @returns {JSX.Element}
 */
function PokemonListPage({ pokemon, favorites, onToggleFavorite }) {
    const navigate = useNavigate(); // navegação programática

    function handlePokemonClick(pokemonItem) {
        navigate(`/pokemon/${pokemonItem.id}`);
    }

    return (
        <section className="pokedex__results">
            <div className="pokedex__grid">
                {pokemon.map((poke) => (
                    <PokemonCard
                        key={poke.id}
                        pokemon={poke}
                        isFavorite={favorites.includes(poke.id)}
                        onToggleFavorite={onToggleFavorite}
                        onClick={handlePokemonClick}
                    />
                ))}
            </div>
        </section>
    );
}

export default PokemonListPage;
```

### 10.2) Fase B — pesquisa por nome (`useState`)

Este bloco **SUBSTITUI** o anterior.
Assim adicionas pesquisa sem manter duas lógicas de filtro em paralelo.

```jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "@/components/SearchBar.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";

/**
 * ============================================
 * PokemonListPage (Fase B)
 * ============================================
 *
 * Descrição: Lista com pesquisa por nome.
 */
/**
 * @param {object} props
 * @param {Array} props.pokemon - Lista de Pokémon.
 * @param {number[]} props.favorites - IDs favoritos.
 * @param {(id: number) => void} props.onToggleFavorite - Alterna favorito.
 * @returns {JSX.Element} Página com pesquisa por nome.
 */
function PokemonListPage({ pokemon, favorites, onToggleFavorite }) {
    const navigate = useNavigate(); // navegação programática
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPokemon = pokemon.filter((poke) =>
        poke.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );

    function handlePokemonClick(pokemonItem) {
        navigate(`/pokemon/${pokemonItem.id}`);
    }

    return (
        <>
            <section className="pokedex__controls">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </section>

            <section className="pokedex__results">
                <div className="pokedex__grid">
                    {filteredPokemon.map((poke) => (
                        <PokemonCard
                            key={poke.id}
                            pokemon={poke}
                            isFavorite={favorites.includes(poke.id)}
                            onToggleFavorite={onToggleFavorite}
                            onClick={handlePokemonClick}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

export default PokemonListPage;
```

### 10.3) Fase C — filtro por tipo (`useState`)

Este bloco **SUBSTITUI** o anterior.
Agora adicionamos o filtro por tipo sem duplicar o `filtered`.

```jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "@/components/SearchBar.jsx";
import TypeFilter from "@/components/TypeFilter.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";

/**
 * ============================================
 * PokemonListPage (Fase C)
 * ============================================
 *
 * Descrição: Lista com pesquisa e filtro por tipo.
 */
/**
 * @param {object} props
 * @param {Array} props.pokemon - Lista de Pokémon.
 * @param {number[]} props.favorites - IDs favoritos.
 * @param {(id: number) => void} props.onToggleFavorite - Alterna favorito.
 * @returns {JSX.Element} Página com pesquisa e filtro por tipo.
 */
function PokemonListPage({ pokemon, favorites, onToggleFavorite }) {
    const navigate = useNavigate(); // navegação programática
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const filteredPokemon = pokemon.filter((poke) => {
        const matchesSearch = poke.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesType =
            selectedType === "all" ||
            poke.types.some((typeInfo) => typeInfo.type.name === selectedType);

        return matchesSearch && matchesType;
    });

    function handlePokemonClick(pokemonItem) {
        navigate(`/pokemon/${pokemonItem.id}`);
    }

    return (
        <>
            <section className="pokedex__controls">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <TypeFilter
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                />
            </section>

            <section className="pokedex__results">
                <div className="pokedex__grid">
                    {filteredPokemon.map((poke) => (
                        <PokemonCard
                            key={poke.id}
                            pokemon={poke}
                            isFavorite={favorites.includes(poke.id)}
                            onToggleFavorite={onToggleFavorite}
                            onClick={handlePokemonClick}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

export default PokemonListPage;
```

### 10.4) Versão final (ainda sem query string)

Este bloco **SUBSTITUI** o anterior. Aqui já adicionamos
loading, erro e “lista vazia” como na Ficha 3.
Faz isto para centralizar os estados visuais numa única versão da page.

```jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "@/components/SearchBar.jsx";
import TypeFilter from "@/components/TypeFilter.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import ErrorMessage from "@/components/ErrorMessage.jsx";

/**
 * ============================================
 * PokemonListPage (pré‑query string)
 * ============================================
 *
 * Descrição: Página principal com lista e filtros locais.
 */
/**
 * @param {object} props
 * @param {Array} props.pokemon - Lista de Pokémon.
 * @param {number[]} props.favorites - IDs favoritos.
 * @param {boolean} props.loading - Estado de carregamento.
 * @param {string|null} props.error - Mensagem de erro.
 * @param {() => void} props.onRetry - Handler do botão de retry.
 * @param {(id: number) => void} props.onToggleFavorite - Alterna favorito.
 * @returns {JSX.Element} Página com lista, filtros e estados.
 */
function PokemonListPage({
    pokemon,
    favorites,
    loading,
    error,
    onRetry,
    onToggleFavorite,
}) {
    const navigate = useNavigate(); // navegação programática
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const filteredPokemon = pokemon.filter((poke) => {
        const matchesSearch = poke.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesType =
            selectedType === "all" ||
            poke.types.some((typeInfo) => typeInfo.type.name === selectedType);

        return matchesSearch && matchesType;
    });

    const resultsCount = filteredPokemon.length;

    function handlePokemonClick(pokemonItem) {
        navigate(`/pokemon/${pokemonItem.id}`);
    }

    return (
        <>
            <section className="pokedex__controls">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <TypeFilter
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                />
            </section>

            <section className="pokedex__results">
                {loading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} onRetry={onRetry} />}

                {!loading && !error && resultsCount === 0 && (
                    <p className="pokedex__empty">
                        Nenhum Pokémon encontrado. Ajusta a pesquisa ou o filtro
                        de tipo.
                    </p>
                )}

                {!loading && !error && resultsCount > 0 && (
                    <div className="pokedex__grid">
                        {filteredPokemon.map((poke) => (
                            <PokemonCard
                                key={poke.id}
                                pokemon={poke}
                                isFavorite={favorites.includes(poke.id)}
                                onToggleFavorite={onToggleFavorite}
                                onClick={handlePokemonClick}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default PokemonListPage;
```

### Erros comuns

- Colocar hooks fora do componente.
- Esquecer `.trim()` e ter filtros inconsistentes.
- Usar `selectedType === ""` em vez de `"all"`.

### Como depurar

- `console.log(searchTerm, selectedType)` para confirmar valores.
- Se a lista ficar vazia, confirma `resultsCount`.

### Checkpoint

- Pesquisa e filtro funcionam?
- A UI mantém o mesmo visual da Ficha 3?

---

## 11) `App.jsx` (Fase 3) — dados + favoritos

Este bloco **SUBSTITUI** o `App.jsx` da fase 2.5.
Fazemos isto para mover a lista para uma page e deixar o `App` apenas com
estado global e rotas.
O `App` passa a **gerir dados e favoritos**, e a rota `/` passa a renderizar
`PokemonListPage` dentro do `Layout`.

**Nota importante sobre `localStorage`:** usa **a mesma key da Ficha 3**.
Se usaste outra (ex.: `pokemonFavorites`), mantém exatamente esse valor
para não perder favoritos.

### 11.1) Parte A — Fica igual (lógica: estado e efeitos)

```jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;
const FAVORITES_KEY = "pokemonFavorites"; // Mantém a mesma key da Ficha 3

/**
 * ============================================
 * App (Fase 3)
 * ============================================
 *
 * Descrição: Estado global + lista numa page.
 */
function App() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    async function loadPokemonList() {
        setLoading(true);
        setError(null);
        try {
            const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(detailedPokemon);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    // Carrega dados quando o componente é montado.
    useEffect(() => {
        loadPokemonList();
    }, []);

    // Carrega favoritos guardados.
    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Persiste favoritos sempre que mudam.
    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    /**
     * Alterna um Pokémon nos favoritos usando o valor mais recente.
     *
     * @param {number} id - ID do Pokémon.
     */
    function toggleFavorite(id) {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            }
            return [...prev, id];
        });
    }

    /**
     * Tenta recarregar os dados da API.
     */
    function handleRetry() {
        loadPokemonList();
    }

    // A renderização começa no próximo bloco.
    return (
```

Até aqui tens a **mesma lógica** da Ficha 3.  
O que muda a seguir é **só a renderização**: o `Route index` passa a renderizar
`PokemonListPage`.

### 11.2) Parte B — Muda (renderização via Router)

```jsx
        <Routes>
            {/* Rota pai com Layout (moldura fixa). */}
            <Route path="/" element={<Layout />}>
                {/* Rota filha index = "/". */}
                <Route
                    index
                    element={
                        <PokemonListPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Esquecer de chamar `loadPokemonList()` dentro do `useEffect`.
- Apagar o `localStorage` key e perder favoritos sem querer.

### Como depurar

- `console.log(pokemon.length)` para confirmar o carregamento.
- Força um erro na URL da API e confirma a mensagem.

### Checkpoint

- A lista aparece com o mesmo visual da Ficha 3?

---

## 12) Fase 4 — Migrar detalhes para rota dinâmica `/pokemon/:id`

### Observações

O detalhe deixa de ser “uma secção escondida” e passa a ser **uma rota própria**.
O Pokémon escolhido vem sempre da URL (`/pokemon/:id`), não do estado local.

**Reutilização:** a estrutura da página de detalhe, classes e estilos
mantêm-se iguais à Ficha 3. Só muda a forma de obter o Pokémon (via URL).
Se a tua Ficha 3 usa emojis nos botões de favorito, mantém; se não usa, não adiciones.
Se entrares diretamente na rota de detalhe, usa os mesmos estados de
loading/erro da Ficha 3 para evitar o “não encontrado” durante o fetch.

### 12.1) `src/components/PokemonDetailsPage.jsx`

Cria a página a partir do componente da Ficha 3,
mas agora com `useParams` e `useNavigate`.

#### 12.1.1) Parte A — lógica e hooks (fora do return)

```jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import { getTypeGradient } from "@/components/typeData.js";

// Rótulos legíveis para os stats dos Pokémon.
const STAT_LABELS = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Ataque Esp.",
    "special-defense": "Defesa Esp.",
    speed: "Velocidade",
};

/**
 * ============================================
 * PokemonDetailsPage
 * ============================================
 *
 * Descrição: Página detalhada de cada Pokémon com layout em duas
 * colunas e barra de stats.
 *
 * CONCEITOS APLICADOS:
 * - useParams (parâmetro da rota)
 * - useNavigate (voltar para a lista)
 * - Listas e condicionais
 *
 * NOTAS PEDAGÓGICAS:
 * - Mantém as mesmas conversões da Ficha 3 (height/10, weight/10).
 * - `navigate(-1)` pode sair da app se o acesso for direto.
 * - Se chegares via URL direta, mostra loading/erro antes do “não encontrado”.
 *
 * Props:
 * @param {Array} pokemon - Lista completa de Pokémon.
 * @param {number[]} favorites - IDs favoritos.
 * @param {(id: number) => void} onToggleFavorite - Alterna favorito.
 * @param {boolean} loading - Estado de carregamento.
 * @param {string|null} error - Mensagem de erro.
 * @param {() => void} onRetry - Handler do botão de retry.
 *
 * @returns {JSX.Element} Página de detalhes completa.
 */
function PokemonDetailsPage({
    pokemon,
    favorites,
    onToggleFavorite,
    loading,
    error,
    onRetry,
}) {
    const { id } = useParams(); // id vem da URL
    const navigate = useNavigate(); // navegação programática
    const location = useLocation(); // contém a query string atual

    // useParams devolve strings
    const numericId = Number(id);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    const current = pokemon.find((item) => item.id === numericId);

    if (!current) {
        return <p className="pokedex__empty">Pokémon não encontrado.</p>;
    }

    const formattedNumber = `#${String(current.id).padStart(3, "0")}`;
    const heightInMetres = (current.height / 10).toFixed(1);
    const weightInKg = (current.weight / 10).toFixed(1);
    const statsTotal = current.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0,
    );

    /**
     * Alterna favorito a partir do botão da página de detalhes.
     */
    function handleFavoriteClick() {
        onToggleFavorite(current.id);
    }

    /**
     * Volta para a lista, preservando a query string (se existir).
     */
    function handleBack() {
        // Mantém os filtros da URL ao voltar.
        navigate({ pathname: "/", search: location.search });
    }

    /**
     * Retorna o rótulo do stat em português.
     *
     * @param {string} statName - Nome técnico do stat.
     * @returns {string} Rótulo legível.
     */
    function getStatLabel(statName) {
        return STAT_LABELS[statName] || statName;
    }

    // A renderização começa no próximo bloco.
    return (
```

Até aqui ligaste os hooks do Router, trataste `loading`/`error` e encontraste
o Pokémon certo. A seguir vais renderizar a UI **igual à da Ficha 3**.

#### 12.1.2) Parte B — JSX (dentro do return)

```jsx
        <article className="pokemon-details">
            <header className="pokemon-details__header">
                <button type="button" onClick={handleBack}>
                    ← Voltar
                </button>
                <button type="button" onClick={handleFavoriteClick}>
                    {favorites.includes(current.id)
                        ? "❤️ Favorito"
                        : "🤍 Favorito"}
                </button>
            </header>

            <div className="pokemon-details__layout">
                <aside className="pokemon-details__sidebar">
                    <span className="pokemon-details__number">
                        {formattedNumber}
                    </span>
                    <h2 className="pokemon-details__name">{current.name}</h2>
                    <img
                        className="pokemon-details__image"
                        src={
                            current.sprites?.other?.["official-artwork"]
                                ?.front_default ||
                            current.sprites?.front_default ||
                            ""
                        }
                        alt={`Artwork oficial de ${current.name}`}
                    />
                    <div className="pokemon-details__types">
                        {current.types.map((typeInfo) => (
                            <span
                                key={typeInfo.type.name}
                                className="pokemon-details__type"
                                style={{
                                    background: getTypeGradient(
                                        typeInfo.type.name,
                                    ),
                                }}
                            >
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>
                    <div className="pokemon-details__measures">
                        <div className="pokemon-details__measure">
                            <span>Altura</span>
                            <strong>{heightInMetres} m</strong>
                        </div>
                        <div className="pokemon-details__measure">
                            <span>Peso</span>
                            <strong>{weightInKg} kg</strong>
                        </div>
                    </div>
                </aside>

                <section className="pokemon-details__main">
                    <div className="pokemon-details__stats">
                        {current.stats.map((stat) => {
                            const statLabel = getStatLabel(stat.stat.name);
                            const progress = Math.min(stat.base_stat, 255);
                            const width = (progress / 255) * 100;
                            return (
                                <div className="stat-row" key={stat.stat.name}>
                                    <div className="stat-row__label">
                                        <span>{statLabel}</span>
                                        <span>{stat.base_stat}</span>
                                    </div>
                                    <div className="stat-row__bar">
                                        <div
                                            className="stat-row__fill"
                                            style={{ width: `${width}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="stat-total">Total de stats: {statsTotal}</p>

                    <div className="pokemon-details__abilities">
                        <h3>Habilidades</h3>
                        {current.abilities.map((abilityInfo) => (
                            <div
                                className="ability-item"
                                key={abilityInfo.ability.name}
                            >
                                <span>{abilityInfo.ability.name}</span>
                                {abilityInfo.is_hidden && (
                                    <span className="ability-badge">
                                        Oculta
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pokemon-details__info">
                        <p>Experiência base: {current.base_experience}</p>
                        <p>Ordem: {current.order}</p>
                    </div>
                </section>
            </div>
        </article>
    );
}

export default PokemonDetailsPage;
```

### Nota sobre o botão “Voltar”

- `navigate(-1)` pode sair da app se o utilizador entrou diretamente no link.
- Por isso usamos `navigate({ pathname: "/", search: location.search })`
  para voltar à lista **e** preservar os filtros da URL.

### 12.2) Atualizar `src/App.jsx` com a rota dinâmica

Este bloco **SUBSTITUI** o `App.jsx` da fase 3.
Agora precisamos da rota dinâmica para detalhes.
Nesta fase o `App` ganha a rota `pokemon/:id` e passa `pokemon`, `loading`
e `error` para a página de detalhes.

### 12.2.1) Parte A — Fica igual (lógica: estado e efeitos)

```jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;
const FAVORITES_KEY = "pokemonFavorites"; // Mantém a mesma key da Ficha 3

/**
 * ============================================
 * App (Fase 4)
 * ============================================
 *
 * Descrição: Estado global + rotas principais.
 */
function App() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    async function loadPokemonList() {
        setLoading(true);
        setError(null);
        try {
            const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(detailedPokemon);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPokemonList();
    }, []);

    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(id) {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            }
            return [...prev, id];
        });
    }

    function handleRetry() {
        loadPokemonList();
    }

    // A renderização começa no próximo bloco.
    return (
```

Até aqui mantiveste o estado global como na Ficha 3.  
O que muda a seguir é **a renderização via Router**: adicionamos a rota
dinâmica `pokemon/:id` e ligamos a `PokemonDetailsPage`.

### 12.2.2) Parte B — Muda (rotas: adiciona `/pokemon/:id`)

```jsx
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route
                    index
                    element={
                        <PokemonListPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
                <Route
                    path="pokemon/:id"
                    element={
                        /* Rota dinâmica para detalhes. */
                        <PokemonDetailsPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Esquecer `Number(id)` e nunca encontrar o Pokémon.
- Manter lógica de `currentPage/selectedPokemon` do Router antigo.
- Não tratar o caso de `id` inválido e deixar a página em branco.
- Mostrar “Pokémon não encontrado” enquanto o fetch ainda está a carregar.

### Como depurar

- `console.log(id, typeof id)` para confirmar que é string.
- Testa `/pokemon/1` e `/pokemon/9999`.

### Checkpoint

- Clicar num card abre a rota `/pokemon/:id`?
- O detalhe mantém o mesmo comportamento da Ficha 3 (incluindo conversões)?

---

## 13) Fase 5 — Migrar filtros para query string

Nesta fase, a URL passa a ser a **fonte de verdade** para `searchTerm` (em `q`)
e `type`.

### Observações

Os filtros deixam de viver em `useState` e passam a viver na **query string**.
Quando navegas para detalhes, anexas `?q=...&type=...` para poderes voltar à lista
com os mesmos filtros (o detalhe precisa dessa query para regressar corretamente).

Quando atualizas o `searchTerm` pelo input, usamos `replace: true` para não
poluir o histórico a cada tecla.

**Reutilização:** `SearchBar`, `TypeFilter` e `PokemonCard` mantêm-se iguais;
apenas muda a origem do estado (URL).

### Parte A — Fica igual (lógica global)

Estado global no `App`, fetch e favoritos **não mudam**.

### Parte B — Muda (lógica da lista)

`PokemonListPage` passa a ler/escrever `searchTerm` e `type` pela URL,
mas o JSX da lista mantém‑se igual.

### 13.1) `src/components/PokemonListPage.jsx` (versão final)

Este bloco **SUBSTITUI** a versão com `useState`.
A fonte de verdade dos filtros passa a ser a URL (query string).

#### 13.1.1) Parte A — lógica e hooks (fora do return)

```jsx
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar.jsx";
import TypeFilter from "@/components/TypeFilter.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import ErrorMessage from "@/components/ErrorMessage.jsx";

/**
 * ============================================
 * PokemonListPage
 * ============================================
 *
 * Descrição: Página principal com lista e filtros via query string.
 *
 * CONCEITOS APLICADOS:
 * - useSearchParams (query string como estado)
 * - useMemo (evitar cálculos repetidos)
 * - Props + composição
 *
 * NOTAS PEDAGÓGICAS:
 * - A URL é a fonte de verdade para `searchTerm` (em `q`) e `type`.
 * - Hooks só podem ser chamados dentro do componente.
 *
 * Props:
 * @param {Array} pokemon - Lista de Pokémon.
 * @param {number[]} favorites - IDs favoritos.
 * @param {boolean} loading - Estado de carregamento.
 * @param {string|null} error - Mensagem de erro.
 * @param {() => void} onRetry - Handler do botão de retry.
 * @param {(id: number) => void} onToggleFavorite - Alterna favorito.
 *
 * @returns {JSX.Element} Página com filtros, lista e estados.
 */
function PokemonListPage({
    pokemon,
    favorites,
    loading,
    error,
    onRetry,
    onToggleFavorite,
}) {
    const navigate = useNavigate(); // navegação programática
    const [params, setParams] = useSearchParams(); // ler/escrever query string

    const searchTerm = params.get("q") || "";
    const selectedType = params.get("type") || "all";

    const filteredPokemon = useMemo(() => {
        return pokemon.filter((poke) => {
            const matchesSearch = poke.name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            const matchesType =
                selectedType === "all" ||
                poke.types.some(
                    (typeInfo) => typeInfo.type.name === selectedType,
                );

            return matchesSearch && matchesType;
        });
    }, [pokemon, searchTerm, selectedType]);

    const resultsCount = filteredPokemon.length;

    function updateSearchTerm(nextValue) {
        // Mantém os outros parâmetros e atualiza só `q`.
        const nextParams = Object.fromEntries(params.entries());

        if (nextValue) {
            nextParams.q = nextValue;
        } else {
            delete nextParams.q;
        }

        setParams(nextParams, { replace: true });
    }

    function updateType(nextType) {
        // Mantém os outros parâmetros e atualiza só `type`.
        const nextParams = Object.fromEntries(params.entries());

        if (nextType && nextType !== "all") {
            nextParams.type = nextType;
        } else {
            delete nextParams.type;
        }

        setParams(nextParams);
    }

    function handlePokemonClick(pokemonItem) {
        // Mantém a query string para voltar com os filtros ativos.
        const queryString = params.toString();
        const path = queryString
            ? `/pokemon/${pokemonItem.id}?${queryString}`
            : `/pokemon/${pokemonItem.id}`;
        navigate(path);
    }

    // A renderização começa no próximo bloco.
    return (
```

Até aqui ligaste a query string aos filtros e garantiste que a navegação
para detalhes preserva `q` e `type`. A seguir vais renderizar a UI da lista,
com os estados de loading/erro/vazio.

#### 13.1.2) Parte B — JSX (dentro do return)

```jsx
        <>
            <section className="pokedex__controls">
                <SearchBar value={searchTerm} onChange={updateSearchTerm} />
                <TypeFilter
                    selectedType={selectedType}
                    onTypeChange={updateType}
                />
            </section>

            <section className="pokedex__results">
                {loading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} onRetry={onRetry} />}

                {!loading && !error && resultsCount === 0 && (
                    <p className="pokedex__empty">
                        Nenhum Pokémon encontrado. Ajusta a pesquisa ou o filtro
                        de tipo.
                    </p>
                )}

                {!loading && !error && resultsCount > 0 && (
                    <div className="pokedex__grid">
                        {filteredPokemon.map((poke) => (
                            <PokemonCard
                                key={poke.id}
                                pokemon={poke}
                                isFavorite={favorites.includes(poke.id)}
                                onToggleFavorite={onToggleFavorite}
                                onClick={handlePokemonClick}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default PokemonListPage;
```

### 13.2) Atualizar o `Layout` para reativar os contadores

Este bloco **SUBSTITUI** o `Layout.jsx` da fase 2.
Agora o hero usa dados reais e contadores baseados nos filtros da URL.

```jsx
import { NavLink, Outlet, useSearchParams } from "react-router-dom";

const POKEMON_LIMIT = 151;

/**
 * ============================================
 * Layout
 * ============================================
 *
 * Descrição: Moldura base da app com hero, contadores e navegação.
 *
 * CONCEITOS APLICADOS:
 * - Layout route + Outlet
 * - NavLink com estado ativo
 * - Leitura da query string para contadores
 *
 * NOTAS PEDAGÓGICAS:
 * - Os contadores usam a mesma lógica de filtro da lista.
 * - `end` no NavLink evita o match por prefixo.
 *
 * Props:
 * @param {Array} pokemon - Lista completa de Pokémon.
 * @param {number[]} favorites - IDs favoritos.
 * @param {number} totalCount - Total esperado (fallback).
 *
 * @returns {JSX.Element} Layout principal com hero e navegação.
 */
function Layout({ pokemon = [], favorites = [], totalCount = POKEMON_LIMIT }) {
    const [params] = useSearchParams(); // ler query string atual
    const searchTerm = params.get("q") || "";
    const selectedType = params.get("type") || "all";

    const filteredCount = pokemon.filter((poke) => {
        const matchesSearch = poke.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesType =
            selectedType === "all" ||
            poke.types.some((typeInfo) => typeInfo.type.name === selectedType);

        return matchesSearch && matchesType;
    }).length;

    const favoritesCount = favorites.length;
    const heroTotal = pokemon.length || totalCount;

    const queryString = params.toString();
    const listTo = queryString ? `/?${queryString}` : "/";
    const favoritesTo = queryString
        ? `/favoritos?${queryString}`
        : "/favoritos";

    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Descobre e explora os 151 Pokémon originais
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total de Pokémon
                            <strong>{heroTotal}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>{favoritesCount}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Resultados filtrados
                            <strong>{filteredCount}</strong>
                        </div>
                    </div>
                </div>
                <div className="pokedex__hero-pokeball" aria-hidden="true" />
            </header>

            <nav className="type-filter" aria-label="Navegação principal">
                <span className="type-filter__label">Navegação</span>
                <div className="type-filter__buttons">
                    <NavLink
                        to={listTo}
                        end
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Lista
                    </NavLink>
                    <NavLink
                        to={favoritesTo}
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Favoritos
                    </NavLink>
                </div>
            </nav>

            <Outlet />
        </div>
    );
}

export default Layout;
```

### 13.3) Atualizar `src/App.jsx` para passar dados ao Layout

Este bloco **SUBSTITUI** o `App.jsx` da fase 4.
Passamos os dados ao `Layout` para atualizar os contadores.
Isto é feito ao passar `pokemon` e `favorites` como props do `Layout`, para
que o hero consiga calcular **total**, **favoritos** e **filtrados**.
Aqui o `Layout` recebe dados apenas para mostrar contadores; em apps maiores,
uma alternativa comum é Context/Store.

### 13.3.1) Parte A — Fica igual (lógica: estado e efeitos)

```jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;
const FAVORITES_KEY = "pokemonFavorites"; // Mantém a mesma key da Ficha 3

/**
 * ============================================
 * App
 * ============================================
 *
 * Descrição: Componente raiz com estado global e rotas.
 *
 * CONCEITOS APLICADOS:
 * - useEffect para carregar dados externos
 * - useState para estado global
 * - Rotas com React Router
 * - localStorage para persistência
 *
 * NOTAS PEDAGÓGICAS:
 * - Mantém o estado global aqui, não nas páginas.
 * - Evita duplicação de estado entre páginas.
 *
 * @returns {JSX.Element} Aplicação completa.
 */
function App() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    async function loadPokemonList() {
        setLoading(true);
        setError(null);
        try {
            const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(detailedPokemon);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPokemonList();
    }, []);

    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(id) {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            }
            return [...prev, id];
        });
    }

    function handleRetry() {
        loadPokemonList();
    }

    // A renderização começa no próximo bloco.
    return (
```

Até aqui tens o estado global (dados, loading/erro, favoritos).  
O que muda a seguir é **a renderização via Router**: passamos dados ao
`Layout` e ligamos as páginas às rotas.

### 13.3.2) Parte B — Muda (renderização via Router)

```jsx
        <Routes>
            {/* Rota pai com Layout (moldura fixa). */}
            <Route
                path="/"
                element={
                    <Layout
                        pokemon={pokemon}
                        favorites={favorites}
                        totalCount={POKEMON_LIMIT}
                    />
                }
            >
                {/* Rota filha index = "/". */}
                <Route
                    index
                    element={
                        <PokemonListPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
                <Route
                    path="pokemon/:id"
                    element={
                        /* Rota dinâmica para detalhes. */
                        <PokemonDetailsPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Esquecer `params.get("q") || ""` e lidar com `null`.
- Guardar `type=all` e depois filtrar como se fosse um tipo real.
- Comparar `selectedType` com número (é sempre string).
- Abrir detalhes sem anexar a query string e perder filtros no “Voltar”.

### Como depurar

- Abre `/?q=pi&type=fire` e confirma o filtro.
- `console.log(params.toString())` para ver a query atual.

### Checkpoint

- Filtros continuam após refresh?
- Os contadores do hero refletem os filtros?

---

## 14) Fase 6 — FavoritesPage e rota 404

### Observações

Depois de lista e detalhes, falta fechar o circuito: favoritos e 404.
O Router garante que **todas** as rotas válidas estão cobertas e que o
fallback aparece quando a rota não existe.

**Reutilização:** a lista de favoritos usa o mesmo `PokemonCard` e o mesmo grid.
Se entrares diretamente em `/favoritos`, usa os mesmos estados de loading/erro
da Ficha 3 para evitar mensagens incorretas.

### 14.1) `src/components/FavoritesPage.jsx`

```jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";

/**
 * ============================================
 * FavoritesPage
 * ============================================
 *
 * Descrição: Página que lista apenas favoritos.
 *
 * CONCEITOS APLICADOS:
 * - Filtros por estado global (favorites)
 * - Renderização condicional (lista vazia)
 *
 * NOTAS PEDAGÓGICAS:
 * - Reutiliza o mesmo card e grid da lista principal.
 * - Usa LoadingSpinner/ErrorMessage para evitar estados vazios falsos.
 *
 * Props:
 * @param {Array} pokemon - Lista completa de Pokémon.
 * @param {number[]} favorites - IDs favoritos.
 * @param {(id: number) => void} onToggleFavorite - Alterna favorito.
 * @param {boolean} loading - Estado de carregamento.
 * @param {string|null} error - Mensagem de erro.
 * @param {() => void} onRetry - Handler do botão de retry.
 *
 * @returns {JSX.Element} Página de favoritos.
 */
function FavoritesPage({
    pokemon,
    favorites,
    onToggleFavorite,
    loading,
    error,
    onRetry,
}) {
    const navigate = useNavigate(); // navegação programática
    const [params] = useSearchParams(); // ler query string atual

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    const favoritesList = pokemon.filter((poke) => favorites.includes(poke.id));

    if (favoritesList.length === 0) {
        return <p className="pokedex__empty">Ainda não tens favoritos.</p>;
    }

    function handlePokemonClick(pokemonItem) {
        const queryString = params.toString();
        const path = queryString
            ? `/pokemon/${pokemonItem.id}?${queryString}`
            : `/pokemon/${pokemonItem.id}`;
        navigate(path);
    }

    return (
        <section className="pokedex__results">
            <div className="pokedex__grid">
                {favoritesList.map((poke) => (
                    <PokemonCard
                        key={poke.id}
                        pokemon={poke}
                        isFavorite
                        onToggleFavorite={onToggleFavorite}
                        onClick={handlePokemonClick}
                    />
                ))}
            </div>
        </section>
    );
}

export default FavoritesPage;
```

### 14.2) `src/components/NotFound.jsx`

```jsx
import { Link } from "react-router-dom";

/**
 * ============================================
 * NotFound
 * ============================================
 *
 * Descrição: Página 404 simples.
 *
 * CONCEITOS APLICADOS:
 * - Rota fallback
 * - Link para voltar à lista
 *
 * NOTAS PEDAGÓGICAS:
 * - A rota `*` deve ficar no fim.
 *
 * @returns {JSX.Element} Página 404.
 */
function NotFound() {
    return (
        <p className="pokedex__empty">
            Página não encontrada. <Link to="/">Voltar à lista</Link>
        </p>
    );
}

export default NotFound;
```

### 14.3) Atualizar `src/App.jsx` (versão final)

Este bloco **SUBSTITUI** o `App.jsx` da fase 5.
É aqui que entram a rota de favoritos e a 404.
Adicionamos a rota `/favoritos` e o fallback `*`, mantendo o mesmo estado global.

### 14.3.1) Parte A — Fica igual (lógica: estado e efeitos)

```jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import FavoritesPage from "@/components/FavoritesPage.jsx";
import NotFound from "@/components/NotFound.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;
const FAVORITES_KEY = "pokemonFavorites"; // Mantém a mesma key da Ficha 3

function App() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    async function loadPokemonList() {
        setLoading(true);
        setError(null);
        try {
            const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(detailedPokemon);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPokemonList();
    }, []);

    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(id) {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            }
            return [...prev, id];
        });
    }

    function handleRetry() {
        loadPokemonList();
    }

    // A renderização começa no próximo bloco.
    return (
```

O estado continua igual ao das fases anteriores.  
O que muda a seguir é **a renderização via Router**: adicionamos a rota de
favoritos e o fallback 404.

### 14.3.2) Parte B — Muda (rotas: favoritos + 404)

```jsx
        <Routes>
            {/* Rota pai com Layout (moldura fixa). */}
            <Route
                path="/"
                element={
                    <Layout
                        pokemon={pokemon}
                        favorites={favorites}
                        totalCount={POKEMON_LIMIT}
                    />
                }
            >
                {/* Rota filha index = "/". */}
                <Route
                    index
                    element={
                        <PokemonListPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
                <Route
                    path="pokemon/:id"
                    element={
                        /* Rota dinâmica para detalhes. */
                        <PokemonDetailsPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
                <Route
                    path="favoritos"
                    element={
                        /* Rota estática para favoritos. */
                        <FavoritesPage
                            pokemon={pokemon}
                            favorites={favorites}
                            loading={loading}
                            error={error}
                            onRetry={handleRetry}
                            onToggleFavorite={toggleFavorite}
                        />
                    }
                />
                {/* Fallback 404: fica sempre no fim. */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

- Colocar a rota `*` no meio e “apanhar” tudo.
- Esquecer o `path="favoritos"` e ter link a apontar para 404.
- Não passar `pokemon`/`favorites` para a `FavoritesPage`.

### Como depurar

- Abre `/abc` e confirma a 404.
- Abre `/favoritos` e confirma a lista.

### Checkpoint

- A app mantém o visual da Ficha 3?
- Favoritos persistem após refresh?

---

## 15) Checkpoints rápidos por fase

- **Fase 1:** Router OK aparece.
- **Fase 2:** Layout com hero + navegação + `Outlet` funciona.
- **Fase 2.5:** App igual à Ficha 3, mas dentro de rotas (`Route index`).
- **Fase 3:** Lista renderiza dentro do layout.
- **Fase 4:** `/pokemon/1` abre detalhe real (comportamento igual à Ficha 3).
- **Fase 5:** `?q=pi&type=fire` filtra e mantém após refresh.
- **Fase 6:** `/favoritos` funciona e `*` mostra 404.

---

## 16) Estrutura final (check rápido)

```
src/
  App.jsx
  main.jsx
  styles/
  services/
  components/
```

---

## 17) Executar o projeto

```bash
npm run dev
```

---

## 18) Checklist final (para entregar)

- [ ] React Router instalado e configurado
- [ ] Rotas `/`, `/pokemon/:id`, `/favoritos`, `*`
- [ ] Pesquisa e filtros a funcionar
- [ ] Query string atualiza
- [ ] Favoritos com `localStorage`
- [ ] Loading, erro e vazio (com UI da Ficha 3)

---

## 19) Resumo de erros comuns

- Esquecer o `BrowserRouter` e ver erros ao usar `Link`/`Routes`.
- Esquecer o `<Outlet />` no `Layout` e a rota filha não aparece.
- Esquecer o `end` no `NavLink` da lista e ele ficar ativo em todas as rotas.
- Comparar `id` como número sem converter (`useParams` devolve string).
- Duplicar blocos `filtered` ao copiar fases.
- Esquecer `params.get("q") || ""` e lidar com `null`.
- Guardar `type=all` e depois tratar como tipo real.
- Colocar a rota `*` no meio e “apanhar” tudo.

---

Fim.
