import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner.jsx";
import { usePokedex } from "@/context/PokedexContext.jsx";

function ProtectedRoute({ children }) {
    const { user, authReady } = usePokedex();
    const location = useLocation();

    if (!authReady) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
