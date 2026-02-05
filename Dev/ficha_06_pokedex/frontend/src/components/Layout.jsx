/**
 * Trecho: frontend/src/components/Layout.jsx
 * Objetivo: renderizar a navegação principal com links condicionais pelo estado de sessão.
 * Este layout centraliza a experiência pública/privada da app sem duplicação de navbar.

 */

import { NavLink, Outlet, useLocation } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function Layout() {
    const { pokemon, favorites, user, logout } = usePokedex();
    const location = useLocation();
    const queryString = location.search;
    const homeTo = queryString ? `/${queryString}` : "/";
    const favoritesTo = queryString ? `/favoritos${queryString}` : "/favoritos";

    async function handleLogout() {
        try {
            await logout();
        } catch (err) {
            console.error(err);
            window.alert("Não foi possível terminar sessão.");
        }
    }

    return (
        <div className="pokedex">
            <header className="pokedex__hero">
                <div>
                    <h1 className="pokedex__hero-title">Pokédex Digital</h1>
                    <p className="pokedex__hero-subtitle">
                        Sessão, equipas e perfil com avatar
                    </p>
                    <div className="pokedex__hero-stats">
                        <div className="pokedex__hero-stat">
                            Total
                            <strong>{pokemon.length || 151}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Favoritos
                            <strong>{favorites.length}</strong>
                        </div>
                        <div className="pokedex__hero-stat">
                            Utilizador
                            <strong>
                                {user ? user.username : "visitante"}
                            </strong>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="type-filter" aria-label="Navegação principal">
                <div className="type-filter__buttons">
                    <NavLink to={homeTo} end className="type-filter__button">
                        Home
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink
                                to={favoritesTo}
                                className="type-filter__button"
                            >
                                Favoritos
                            </NavLink>
                            <NavLink
                                to="/equipas"
                                className="type-filter__button"
                            >
                                Equipas
                            </NavLink>
                            <NavLink
                                to="/perfil"
                                className="type-filter__button"
                            >
                                Perfil
                            </NavLink>
                            <button
                                type="button"
                                className="type-filter__button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="type-filter__button">
                                Login
                            </NavLink>
                            <NavLink
                                to="/registo"
                                className="type-filter__button"
                            >
                                Registo
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </div>
    );
}

export default Layout;
