import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

const POKEMON_LIMIT = 151;

function Layout() {
    const { pokemon, favorites } = usePokedex();
    const [params] = useSearchParams();

    const searchTerm = params.get("q") || "";
    const selectedType = params.get("type") || "all";

    const filteredCount = pokemon.filter((poke) => {
        const matchesSearch = poke.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        const matchesType =
            selectedType === "all" ||
            poke.types.some((typeInfo) => typeInfo.type.name === selectedType);

        return matchesSearch && matchesType;
    }).length;

    const favoritesCount = favorites.length;
    const heroTotal = pokemon.length || POKEMON_LIMIT;

    const queryString = params.toString();
    const listTo = queryString ? `/?${queryString}` : "/";
    const favoritesTo = queryString
        ? `/favoritos?${queryString}`
        : "/favoritos";

    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Descobre e explora os 151 Pokémon originais
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total de Pokémon
                            <strong>{heroTotal}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>{favoritesCount}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Resultados filtrados
                            <strong>{filteredCount}</strong>
                        </div>
                    </div>
                </div>
                <div className="pokedex__hero-pokeball" aria-hidden="true" />
            </header>

            <nav className="type-filter" aria-label="Navegação principal">
                <span className="type-filter__label">Navegação</span>
                <div className="type-filter__buttons">
                    <NavLink
                        to={listTo}
                        end
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Lista
                    </NavLink>
                    <NavLink
                        to={favoritesTo}
                        className={({ isActive }) =>
                            `type-filter__button${isActive ? " active" : ""}`
                        }
                        style={({ isActive }) => ({
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive
                                ? "var(--primary)"
                                : "var(--bg-surface)",
                            border: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid var(--border)",
                            color: isActive ? "#fff" : "var(--text-dark)",
                        })}
                    >
                        Favoritos
                    </NavLink>
                </div>
            </nav>

            <Outlet />
        </div>
    );
}

export default Layout;
