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
    if (!context) {
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    }
    return context;
}
