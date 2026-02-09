/**
 * ============================================
 * ErrorMessage
 * ============================================
 *
 * Descrição: Apresenta mensagem de erro e permite retomar o fetch.
 *
 * CONCEITOS APLICADOS:
 * - Tratamento de erros com renderização condicional
 * - Eventos (clique no botão de retry)
 *
 * Props:
 * @param {string} message - Texto do erro a mostrar.
 * @param {() => void} onRetry - Handler chamado ao clicar em "Tentar Novamente".
 *
 * @returns {JSX.Element} Bloco de erro com botão.
 */
function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message">
            <p className="error-message__title">Ops! Algo correu mal</p>
            <p className="error-message__details">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="error-message__button"
            >
                Tentar Novamente
            </button>
        </div>
    );
}

export default ErrorMessage;
