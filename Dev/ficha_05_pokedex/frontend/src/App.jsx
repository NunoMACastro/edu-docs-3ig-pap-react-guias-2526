import { Route, Routes } from "react-router-dom";
import FavoritesPage from "@/components/FavoritesPage.jsx";
import Layout from "@/components/Layout.jsx";
import NotFound from "@/components/NotFound.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";

/**
 * ============================================
 * App
 * ============================================
 *
 * Descrição: Componente raiz apenas com rotas.
 *
 * CONCEITOS APLICADOS:
 * - Rotas com React Router
 * - Layout com Outlet
 *
 * @returns {JSX.Element} Aplicação com Router.
 */
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<PokemonListPage />} />
                <Route path="pokemon/:id" element={<PokemonDetailsPage />} />
                <Route path="favoritos" element={<FavoritesPage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
