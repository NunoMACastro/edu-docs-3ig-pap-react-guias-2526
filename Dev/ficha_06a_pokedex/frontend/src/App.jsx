import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import FavoritesPage from "@/pages/FavoritesPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import NotFound from "@/pages/NotFound.jsx";
import PokemonDetailsPage from "@/pages/PokemonDetailsPage.jsx";
import PokemonListPage from "@/pages/PokemonListPage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";

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
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
