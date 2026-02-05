import { Route, Routes } from "react-router-dom";
import FavoritesPage from "@/components/FavoritesPage.jsx";
import Layout from "@/components/Layout.jsx";
import NotFound from "@/components/NotFound.jsx";
import PokemonDetailsPage from "@/components/PokemonDetailsPage.jsx";
import PokemonListPage from "@/components/PokemonListPage.jsx";

// App fica responsavel apenas por definir as rotas.
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
