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

// Limite da PokeAPI (Gen 1).
const POKEMON_LIMIT = 151;

// Criamos o Context vazio; vai ser preenchido pelo Provider.
// createContext cria um "canal" para partilhar dados sem props.
const PokedexContext = createContext(null);

export function PokedexProvider({ children }) {
    // children = tudo o que estiver dentro do <PokedexProvider> no JSX.
    // Estado global principal da app.
    // useState devolve [valorAtual, funcaoParaAtualizar].
    const [pokemon, setPokemon] = useState([]); // lista completa de Pokemon
    const [favorites, setFavorites] = useState([]); // ids favoritos
    const [loading, setLoading] = useState(true); // true enquanto carrega
    const [error, setError] = useState(null); // null = sem erro

    // Carrega dados iniciais em paralelo (PokeAPI + backend).
    // useCallback memoriza a funcao para manter a mesma referencia.
    const loadInitialData = useCallback(async () => {
        // Antes de pedir dados, marcamos "loading".
        setLoading(true);
        // Limpamos erros antigos.
        setError(null);

        try {
            // Promise.all espera pelos dois pedidos ao mesmo tempo.
            // Isto e mais rapido do que fazer um de cada vez.
            const [pokemonList, favoritesList] = await Promise.all([
                fetchPokemonList(POKEMON_LIMIT),
                getFavorites(),
            ]);

            // Atualiza o estado global com os dados recebidos.
            setPokemon(pokemonList);
            setFavorites(favoritesList);
        } catch (err) {
            console.error(err);
            // Mensagem simples para a UI.
            setError("Erro ao carregar dados.");
        } finally {
            // O loading acaba quer tenha havido erro ou nao.
            setLoading(false);
        }
    }, []);

    // Ao montar o Provider, carregamos os dados iniciais.
    // useEffect corre depois do primeiro render.
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Alterna favorito: se existir, remove; se nao existir, adiciona.
    // useCallback evita recriar a funcao a cada render.
    const toggleFavorite = useCallback(
        async (id) => {
            try {
                // Se o id ja esta nos favoritos, removemos.
                if (favorites.includes(id)) {
                    await removeFavorite(id);
                    // Atualizacao imutavel (novo array).
                    setFavorites(favorites.filter((favId) => favId !== id));
                } else {
                    // Se nao esta, adicionamos.
                    await addFavorite(id);
                    // Atualizacao imutavel (novo array).
                    setFavorites([...favorites, id]);
                }
            } catch (err) {
                console.error(err);
                window.alert("Não foi possível atualizar favoritos.");
            }
        },
        [favorites],
    );

    // Objeto que sera partilhado com toda a app via Context.
    // useMemo evita criar um novo objeto em cada render sem necessidade.
    const value = useMemo(
        () => ({
            pokemon,
            favorites,
            loading,
            error,
            toggleFavorite,
            // "reload" e apenas outro nome para a funcao loadInitialData.
            reload: loadInitialData,
        }),
        [pokemon, favorites, loading, error, toggleFavorite, loadInitialData],
    );

    return (
        // Fornece dados e acoes a todos os filhos.
        <PokedexContext.Provider value={value}>
            {children}
        </PokedexContext.Provider>
    );
}

export function usePokedex() {
    // Hook "bonito" para consumir o Context com seguranca.
    // Evita repetir useContext(PokedexContext) em todo o lado.
    const context = useContext(PokedexContext);
    if (!context)
        // Erro explicito para ajudar no debug.
        throw new Error("usePokedex deve ser usado dentro do PokedexProvider");
    return context;
}
