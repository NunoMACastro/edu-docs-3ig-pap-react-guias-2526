import { Link } from "react-router-dom";

/**
 * ============================================
 * NotFound
 * ============================================
 *
 * Descrição: Página 404 simples.
 *
 * CONCEITOS APLICADOS:
 * - Rota fallback
 * - Link para voltar à lista
 *
 * NOTAS PEDAGÓGICAS:
 * - A rota `*` deve ficar no fim.
 *
 * @returns {JSX.Element} Página 404.
 */
function NotFound() {
    return (
        <p className="pokedex__empty">
            Página não encontrada. <Link to="/">Voltar à lista</Link>
        </p>
    );
}

export default NotFound;
