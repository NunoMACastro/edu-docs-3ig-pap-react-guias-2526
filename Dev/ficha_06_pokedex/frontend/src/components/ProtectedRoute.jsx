/**
 * Trecho: frontend/src/components/ProtectedRoute.jsx
 * Objetivo: bloquear rotas privadas até existir sessão válida.

 */

import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import { usePokedex } from "@/context/PokedexContext.jsx";

/**
 * Guarda de rota privada.
 *
 * @param {{children: import("react").ReactNode}} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children }) {
    const { user, authReady } = usePokedex();
    const location = useLocation();

    if (!authReady) {
        // Evita redirecionar para login antes de acabar restoreSession.
        return <LoadingSpinner />;
    }

    if (!user) {
        // Guardamos origem para possível redireção pós-login.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
