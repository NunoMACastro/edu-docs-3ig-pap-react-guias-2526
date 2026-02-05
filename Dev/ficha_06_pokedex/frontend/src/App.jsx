/**
 * Trecho: frontend/src/App.jsx
 * Objetivo: declarar a árvore final de rotas públicas e privadas usando `ProtectedRoute`.
 * Este ficheiro liga pages, layout e fallback de rota num único ponto de entrada.

 */

import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import FavoritesPage from "@/pages/FavoritesPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PokemonDetailsPage from "@/pages/PokemonDetailsPage.jsx";
import PokemonListPage from "@/pages/PokemonListPage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import TeamsPage from "@/pages/TeamsPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PokemonListPage />} />
                <Route path="pokemon/:id" element={<PokemonDetailsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="registo" element={<RegisterPage />} />

                <Route
                    path="favoritos"
                    element={
                        <ProtectedRoute>
                            <FavoritesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="equipas"
                    element={
                        <ProtectedRoute>
                            <TeamsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="perfil"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
