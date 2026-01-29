import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import FavoritesPage from "@/components/FavoritesPage.jsx";
import Layout from "@/components/Layout.jsx";
import NotFound from "@/components/NotFound.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";
import { fetchPokemonList } from "@/services/pokeApi.js";

const POKEMON_LIMIT = 151;
const FAVORITES_KEY = "pokemonFavorites";

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

    return (
        <Routes>
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
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
