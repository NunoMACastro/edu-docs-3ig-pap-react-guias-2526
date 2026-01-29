import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/styles/index.css";
import "@/styles/pokedex.css";

/**
 * ============================================
 * PONTO DE ENTRADA
 * ============================================
 *
 * Descrição: Lê o elemento root e monta o componente
 * principal da Pokédex Explorer dentro de React StrictMode.
 *
 * CONCEITOS APLICADOS:
 * - Fundamentos (entrada do React + StrictMode)
 * - Importações relativas via alias Vite (@)
 * - Estilos globais são carregados antes da renderização
 *
 * @returns {void}
 */
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
