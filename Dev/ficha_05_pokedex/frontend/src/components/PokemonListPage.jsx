import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import PokemonCard from "@/components/PokemonCard.jsx";
import SearchBar from "@/components/SearchBar.jsx";
import TypeFilter from "@/components/TypeFilter.jsx";
import { usePokedex } from "@/context/PokedexContext.jsx";

function PokemonListPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();

    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

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
        const nextParams = Object.fromEntries(params.entries());

        if (nextValue) {
            nextParams.q = nextValue;
        } else {
            delete nextParams.q;
        }

        setParams(nextParams, { replace: true });
    }

    function updateType(nextType) {
        const nextParams = Object.fromEntries(params.entries());

        if (nextType && nextType !== "all") {
            nextParams.type = nextType;
        } else {
            delete nextParams.type;
        }

        setParams(nextParams);
    }

    function handlePokemonClick(pokemonItem) {
        const queryString = params.toString();
        const path = queryString
            ? `/pokemon/${pokemonItem.id}?${queryString}`
            : `/pokemon/${pokemonItem.id}`;
        navigate(path);
    }

    return (
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
                {error && <ErrorMessage message={error} onRetry={reload} />}

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
                                onToggleFavorite={toggleFavorite}
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
