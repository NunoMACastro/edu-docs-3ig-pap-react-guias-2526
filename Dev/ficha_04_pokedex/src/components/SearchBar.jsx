/**
 * ============================================
 * SearchBar
 * ============================================
 *
 * Descrição: Input controlado que permite pesquisar nomes de Pokémon
 * em tempo real e demonstra formulários controlados + eventos.
 *
 * CONCEITOS APLICADOS:
 * - Formulários controlados (value e onChange)
 * - Eventos (onChange em input)
 * - Props e composição (App fornece dados e handler)
 *
 * Props:
 * @param {string} value - Termo atual de busca.
 * @param {(value: string) => void} onChange - Handler para atualizar o termo.
 *
 * @returns {JSX.Element} Campo de pesquisa estilizado.
 */
function SearchBar({ value, onChange }) {
    /**
     * Atualiza o termo de pesquisa quando o utilizador escreve.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - Evento do input.
     */
    function handleInputChange(event) {
        onChange(event.target.value);
    }

    return (
        <div className="search-bar">
            <input
                className="search-bar__input"
                type="search"
                autoComplete="off"
                value={value}
                onChange={handleInputChange}
                placeholder="Procurar Pokémon..."
                aria-label="Pesquisar Pokémon por nome"
            />
            <span className="search-bar__icon" aria-hidden="true">
                🔍
            </span>
        </div>
    );
}

export default SearchBar;
