/**
 * ============================================
 * LoadingSpinner
 * ============================================
 *
 * Descrição: Indicador visual para períodos de carregamento.
 *
 * CONCEITOS APLICADOS:
 * - Estados de loading (renderização condicional)
 * - Animações CSS para feedback visual
 *
 * @returns {JSX.Element} Spinner com texto.
 */
function LoadingSpinner() {
    return (
        <div className="loading-spinner">
            <span className="spinner-dot" />
            <span className="spinner-dot" />
            <span className="loading-spinner__text">A carregar Pokémon...</span>
        </div>
    );
}

export default LoadingSpinner;
