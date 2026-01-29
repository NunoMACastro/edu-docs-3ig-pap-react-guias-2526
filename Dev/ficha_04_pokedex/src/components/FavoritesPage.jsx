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
    const navigate = useNavigate();
    const [params] = useSearchParams();

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
