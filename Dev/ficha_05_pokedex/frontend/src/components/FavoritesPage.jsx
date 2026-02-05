import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";
import { usePokedex } from "@/context/PokedexContext.jsx";

function FavoritesPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();

    const navigate = useNavigate();
    const [params] = useSearchParams();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={reload} />;
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
                        onToggleFavorite={toggleFavorite}
                        onClick={handlePokemonClick}
                    />
                ))}
            </div>
        </section>
    );
}

export default FavoritesPage;
