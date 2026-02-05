import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage.jsx";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import { getTypeGradient } from "@/components/typeData.js";
import { usePokedex } from "@/context/PokedexContext.jsx";

// Rótulos legíveis para os stats dos Pokémon.
const STAT_LABELS = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Ataque Esp.",
    "special-defense": "Defesa Esp.",
    speed: "Velocidade",
};

function PokemonDetailsPage() {
    const { pokemon, favorites, loading, error, toggleFavorite, reload } =
        usePokedex();

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const numericId = Number(id);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={reload} />;
    }

    const current = pokemon.find((item) => item.id === numericId);

    if (!current) {
        return <p className="pokedex__empty">Pokémon não encontrado.</p>;
    }

    const formattedNumber = `#${String(current.id).padStart(3, "0")}`;
    const heightInMetres = (current.height / 10).toFixed(1);
    const weightInKg = (current.weight / 10).toFixed(1);
    const statsTotal = current.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0,
    );

    function handleFavoriteClick() {
        toggleFavorite(current.id);
    }

    function handleBack() {
        navigate({ pathname: "/", search: location.search });
    }

    function getStatLabel(statName) {
        return STAT_LABELS[statName] || statName;
    }

    return (
        <article className="pokemon-details">
            <header className="pokemon-details__header">
                <button type="button" onClick={handleBack}>
                    ← Voltar
                </button>
                <button type="button" onClick={handleFavoriteClick}>
                    {favorites.includes(current.id)
                        ? "❤️ Favorito"
                        : "🤍 Favorito"}
                </button>
            </header>

            <div className="pokemon-details__layout">
                <aside className="pokemon-details__sidebar">
                    <span className="pokemon-details__number">
                        {formattedNumber}
                    </span>
                    <h2 className="pokemon-details__name">{current.name}</h2>
                    <img
                        className="pokemon-details__image"
                        src={
                            current.sprites?.other?.["official-artwork"]
                                ?.front_default ||
                            current.sprites?.front_default ||
                            ""
                        }
                        alt={`Artwork oficial de ${current.name}`}
                    />
                    <div className="pokemon-details__types">
                        {current.types.map((typeInfo) => (
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
                        {current.stats.map((stat) => {
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
                        {current.abilities.map((abilityInfo) => (
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
                        <p>Experiência base: {current.base_experience}</p>
                        <p>Ordem: {current.order}</p>
                    </div>
                </section>
            </div>
        </article>
    );
}

export default PokemonDetailsPage;
