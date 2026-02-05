import { getTypeGradient } from "@/components/typeData.js";

/**
 * ============================================
 * PokemonCard
 * ============================================
 *
 * Descrição: Cartão individual com número, imagem,
 * tipos e favorito, usado na lista principal.
 *
 * CONCEITOS APLICADOS:
 * - Props e composição (dados e handlers entram via props)
 * - Eventos (click no card + button de favorito)
 * - Renderização condicional (círculo de favorito)
 * - Listas e acesso a propriedades de objetos (map dos tipos)
 *
 * Props:
 * @param {object} pokemon - Dados completos do Pokémon.
 * @param {boolean} isFavorite - Indica se está nos favoritos.
 * @param {(id: number) => void} onToggleFavorite - Alterna favorito.
 * @param {(pokemon: object) => void} onClick - Mostra detalhes.
 *
 * @returns {JSX.Element} Cartão estilizado do Pokémon.
 */
function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onClick }) {
    /**
     * Handler do clique no botão de favorito.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} event - Evento do clique.
     */
    function handleFavoriteClick(event) {
        event.stopPropagation();
        onToggleFavorite(pokemon.id);
    }

    /**
     * Abre a vista de detalhes.
     */
    function handleCardClick() {
        onClick(pokemon);
    }

    const pokemonNumber = `#${String(pokemon.id).padStart(3, "0")}`;
    const artwork =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.front_default ||
        "";

    return (
        <article className="pokemon-card" onClick={handleCardClick}>
            <div className="pokemon-card__header">
                <span className="pokemon-card__number">{pokemonNumber}</span>
                <button
                    className="pokemon-card__favorite"
                    type="button"
                    onClick={handleFavoriteClick}
                    aria-label={
                        isFavorite
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                    }
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>
            <img
                className="pokemon-card__image"
                src={artwork}
                alt={`Imagem oficial de ${pokemon.name}`}
                loading="lazy"
            />
            <h3 className="pokemon-card__name">{pokemon.name}</h3>
            <div className="pokemon-card__types">
                {pokemon.types.map((typeInfo) => {
                    const typeName = typeInfo.type.name;
                    const gradient = getTypeGradient(typeName);
                    return (
                        <span
                            key={typeName}
                            className="pokemon-card__type"
                            style={{ background: gradient }}
                        >
                            {typeName}
                        </span>
                    );
                })}
            </div>
        </article>
    );
}

export default PokemonCard;
