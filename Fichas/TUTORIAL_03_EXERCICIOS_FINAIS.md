# Soluções — Exercícios finais (Ficha 3)

Base: parte do **código final do `App.jsx`** na secção 19.2 da ficha.
As soluções abaixo mostram **o que tens de acrescentar/alterar** para cada exercício.

---

## 1) Só favoritos (toggle)

### Alterações no `src/App.jsx`

**Estado novo:**

```jsx
const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
```

**Toggle na UI (dentro de `.pokedex__controls`):**

```jsx
<label className="favorites-toggle">
    <input
        type="checkbox"
        checked={showOnlyFavorites}
        onChange={() => setShowOnlyFavorites((prev) => !prev)}
    />
    Só favoritos
</label>
```

**Filtro atualizado:**

```jsx
const filteredPokemon = pokemon.filter((poke) => {
    const matchesSearch = poke.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
    const matchesType =
        selectedType === "all" ||
        poke.types.some((typeInfo) => typeInfo.type.name === selectedType);
    const matchesFavorites = !showOnlyFavorites || favorites.includes(poke.id);

    return matchesSearch && matchesType && matchesFavorites;
});
```

---

## 2) Ordenar (id asc/desc, nome)

### Alterações no `src/App.jsx`

**Estado novo:**

```jsx
const [sortBy, setSortBy] = useState("id-asc");
```

**Select na UI (em `.pokedex__controls`):**

```jsx
<label className="sort-select">
    Ordenar por
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="id-asc">ID (asc)</option>
        <option value="id-desc">ID (desc)</option>
        <option value="name-asc">Nome (A–Z)</option>
        <option value="name-desc">Nome (Z–A)</option>
    </select>
</label>
```

**Ordenação depois do filtro (usar isto na grelha):**

O sort recebe o array `filteredPokemon` e cria um novo array ordenado `sortedPokemon`.
a ordenação depende do valor de `sortBy`.
Ou seja, o sort recebe um a e b e compara-os conforme o critério selecionado.
```jsx
const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    switch (sortBy) {
        case "id-desc":
            return b.id - a.id; /
        case "name-asc":
            return a.name.localeCompare(b.name);
        case "name-desc":
            return b.name.localeCompare(a.name);
        case "id-asc":
        default:
            return a.id - b.id;
    }
});
```

**Na renderização da grelha:**

```jsx
{
    sortedPokemon.map((poke) => (
        <PokemonCard
            key={poke.id}
            pokemon={poke}
            isFavorite={favorites.includes(poke.id)}
            onToggleFavorite={toggleFavorite}
            onClick={handlePokemonClick}
        />
    ));
}
```

---

## 3) Limpar filtros

### Alterações no `src/App.jsx`

**Handler:**

```jsx
function handleClearFilters() {
    setSearchTerm("");
    setSelectedType("all");
}
```

**Botão na UI (em `.pokedex__controls`):**

```jsx
<button type="button" onClick={handleClearFilters}>
    Limpar filtros
</button>
```

> Nota: o enunciado só pede limpar `searchTerm` e `selectedType`.
> Se quiseres, também podes pôr `setShowOnlyFavorites(false)`.

---

## 4) Contador de carregados (X / 151)

### Alterações no `src/services/pokeApi.js`

Atualiza a função para aceitar um callback de progresso:

```js
const API_BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 151, onProgress) {
    const response = await fetch(`${API_BASE}/pokemon?limit=${limit}`);
    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista.");
    }

    const data = await response.json();
    let loaded = 0;

    const detailedPokemon = await Promise.all(
        data.results.map(async (entry) => {
            const detailResponse = await fetch(entry.url);
            if (!detailResponse.ok) {
                throw new Error(`Erro ao carregar ${entry.name}`);
            }
            const detail = await detailResponse.json();
            loaded += 1;
            if (onProgress) onProgress(loaded);
            return detail;
        }),
    );

    return detailedPokemon;
}
```

### Alterações no `src/App.jsx`

**Estado novo:**

```jsx
const [loadedCount, setLoadedCount] = useState(0);
```

**Na função `loadPokemonList`:**

```jsx
const loadPokemonList = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadedCount(0);
    try {
        const detailedPokemon = await fetchPokemonList(POKEMON_LIMIT, (count) =>
            setLoadedCount(count),
        );
        setPokemon(detailedPokemon);
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
    } finally {
        setLoading(false);
    }
}, []);
```

### Alterações no `src/components/LoadingSpinner.jsx`

```jsx
function LoadingSpinner({ loadedCount = 0, total = 151 }) {
    return (
        <div className="loading-spinner">
            <span className="spinner-dot" />
            <span className="spinner-dot" />
            <span className="loading-spinner__text">
                A carregar Pokémon... {loadedCount} / {total}
            </span>
        </div>
    );
}
```

**Na renderização (App):**

```jsx
{
    loading && (
        <LoadingSpinner loadedCount={loadedCount} total={POKEMON_LIMIT} />
    );
}
```

---

## 5) Acessibilidade — `aria-label` nos botões de tipo

### Alterações no `src/components/TypeFilter.jsx`

```jsx
<button
    key={type}
    type="button"
    className={`type-filter__button${selectedType === type ? " active" : ""}`}
    style={{ background: gradient }}
    onClick={() => handleTypeChange(type)}
    aria-label={
        type === "all" ? "Mostrar todos os tipos" : `Filtrar por tipo ${type}`
    }
>
    {type === "all" ? "Todos" : type}
</button>
```

---

## (Opcional) Dica de estilos

Se quiseres alinhar melhor os novos controlos, podes criar classes simples no `src/styles/pokedex.css`, por exemplo:

```css
.favorites-toggle,
.sort-select {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
```

Fim.
