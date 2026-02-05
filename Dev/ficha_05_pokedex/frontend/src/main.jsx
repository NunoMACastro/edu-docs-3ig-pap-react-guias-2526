import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { PokedexProvider } from "@/context/PokedexContext.jsx";
import "@/styles/index.css";
import "@/styles/pokedex.css";

// Cria a raiz React no div#root do index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
    // StrictMode ajuda a encontrar problemas em desenvolvimento.
    // Em modo dev, alguns efeitos podem correr duas vezes.
    <React.StrictMode>
        {/* Router para ativar as rotas da aplicacao */}
        {/* BrowserRouter usa o historico do browser (URLs reais) */}
        <BrowserRouter>
            {/* Provider coloca o estado global disponivel para toda a app */}
            <PokedexProvider>
                <App />
            </PokedexProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
