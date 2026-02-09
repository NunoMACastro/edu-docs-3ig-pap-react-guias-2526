import { getTypeGradient, TYPE_SEQUENCE } from "@/components/typeData.js";

/**
 * ============================================
 * TypeFilter
 * ============================================
 *
 * Descrição: Botões de filtro que permitem alternar por tipo de Pokémon.
 *
 * CONCEITOS APLICADOS:
 * - Props e composição (passagem de selectedType + onTypeChange)
 * - Eventos (clique em botões)
 * - Renderização condicional (classe activa)
 *
 * Props:
 * @param {string} selectedType - Tipo atualmente selecionado.
 * @param {(type: string) => void} onTypeChange - Handler para alterar o tipo.
 *
 * @returns {JSX.Element} Filtros por tipo com gradientes.
 */
function TypeFilter({ selectedType, onTypeChange }) {
    /**
     * Dispara o handler externo com o tipo alvo.
     *
     * @param {string} type - Tipo clicado.
     */
    function handleTypeChange(type) {
        onTypeChange(type);
    }

    return (
        <div className="type-filter">
            <span className="type-filter__label">Filtrar por Tipo</span>
            <div className="type-filter__buttons">
                {TYPE_SEQUENCE.map((type) => {
                    const gradient =
                        type === "all"
                            ? "linear-gradient(135deg, #2d3436, #636e72)"
                            : getTypeGradient(type);

                    return (
                        <button
                            key={type}
                            type="button"
                            className={`type-filter__button${selectedType === type ? " active" : ""
                                }`}
                            style={{ background: gradient }}
                            onClick={() => handleTypeChange(type)}
                            aria-label={
                                type === "all" ? "Mostrar todos os tipos" : `Filtrar por tipo ${type}`
                            }
                        >
                            {type === "all" ? "Todos" : type}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default TypeFilter;
