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

export function PokedexProvider({ children }) {
    const [pokemon, setPokemon] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);
    const [error, setError] = useState(null);

    const refreshSession = useCallback(async () => {
        const data = await authApi.restoreSession();
        setUser(data.user);
        return data.user;
    }, []);

    const bootstrap = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const pokemonList = await fetchPokemonList(POKEMON_LIMIT);
            setPokemon(pokemonList);

            let restoredUser = null;
            try {
                restoredUser = await refreshSession();
            } catch (err) {
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
            setAuthReady(true);
        }
    }, [refreshSession]);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = useCallback(async ({ email, password }) => {
        const data = await authApi.login({ email, password });
        setUser(data.user);
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
            setUser(null);
            setFavorites([]);
        }
    }, []);

    const toggleFavorite = useCallback(
        async (pokemonId) => {
            if (!user) {
                window.alert("Faz login para gerir favoritos.");
                return;
            }

            if (favorites.includes(pokemonId)) {
                await favoritesApi.removeFavorite(pokemonId);
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

    return (
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}

export function usePokedex() {
    const ctx = useContext(PokedexContext);

    if (!ctx) {
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    }

    return ctx;
}
