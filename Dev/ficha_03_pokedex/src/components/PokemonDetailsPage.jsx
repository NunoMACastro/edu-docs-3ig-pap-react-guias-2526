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
 * - Estado e eventos (navegação por estados + favoritos)
 * - Listas (stats, tipos e habilidades)
 * - Condicionais (modo vazio, badges de oculto e botões)
 *
 * Props:
 * @param {object} pokemon - Dados completos do Pokémon selecionado.
 * @param {boolean} isFavorite - Indica se o Pokémon é favorito.
 * @param {(id: number) => void} onToggleFavorite - Alterna favorito.
 * @param {() => void} onBack - Volta para a lista principal.
 *
 * @returns {JSX.Element} Página de detalhes completa.
 */
function PokemonDetailsPage({ pokemon, isFavorite, onToggleFavorite, onBack }) {
    const formattedNumber = `#${String(pokemon.id).padStart(3, "0")}`;
    const heightInMetres = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);
    const statsTotal = pokemon.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0,
    );

    /**
     * Alterna favorito a partir do botão da página de detalhes.
     */
    function handleFavoriteClick() {
        onToggleFavorite(pokemon.id);
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

    return (
        <article className="pokemon-details">
            <header className="pokemon-details__header">
                <button type="button" onClick={onBack}>
                    ← Voltar
                </button>
                <button type="button" onClick={handleFavoriteClick}>
                    {isFavorite ? "❤️ Favorito" : "🤍 Favorito"}
                </button>
            </header>

            <div className="pokemon-details__layout">
                <aside className="pokemon-details__sidebar">
                    <span className="pokemon-details__number">
                        {formattedNumber}
                    </span>
                    <h2 className="pokemon-details__name">{pokemon.name}</h2>
                    <img
                        className="pokemon-details__image"
                        src={
                            pokemon.sprites?.other?.["official-artwork"]
                                ?.front_default ||
                            pokemon.sprites?.front_default ||
                            ""
                        }
                        alt={`Artwork oficial de ${pokemon.name}`}
                    />
                    <div className="pokemon-details__types">
                        {pokemon.types.map((typeInfo) => (
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
                        {pokemon.stats.map((stat) => {
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
                        {pokemon.abilities.map((abilityInfo) => (
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
                        <p>Experiência base: {pokemon.base_experience}</p>
                        <p>Ordem: {pokemon.order}</p>
                    </div>
                </section>
            </div>
        </article>
    );
}

export default PokemonDetailsPage;
