/**
 * ============================================
 * DADOS DOS TIPOS
 * ============================================
 *
 * Descrição: Mapeamento de cores e informações dos 18 tipos
 * originais usados na Pokédex Explorer. Centraliza gradientes
 * e valores para reutilizar em filtros e badges.
 *
 * CONCEITOS APLICADOS:
 * - Separação de dados e lógica visual
 * - Reutilização de helpers em múltiplos componentes
 */
const BASE_COLORS = {
    normal: { base: "#a8a878", dark: "#9a9068" },
    fire: { base: "#f08030", dark: "#d86020" },
    water: { base: "#6890f0", dark: "#5070d0" },
    electric: { base: "#f8d030", dark: "#e0b820" },
    grass: { base: "#78c850", dark: "#60a840" },
    ice: { base: "#98d8d8", dark: "#78b8b8" },
    fighting: { base: "#c03028", dark: "#a02018" },
    poison: { base: "#a040a0", dark: "#803080" },
    ground: { base: "#e0c068", dark: "#c0a050" },
    flying: { base: "#a890f0", dark: "#8870d0" },
    psychic: { base: "#f85888", dark: "#d83870" },
    bug: { base: "#a8b820", dark: "#889810" },
    rock: { base: "#b8a038", dark: "#988828" },
    ghost: { base: "#705898", dark: "#584878" },
    dragon: { base: "#7038f8", dark: "#5028d8" },
    dark: { base: "#705848", dark: "#584838" },
    steel: { base: "#b8b8d0", dark: "#9898b0" },
    fairy: { base: "#ee99ac", dark: "#d87098" },
};

const TYPE_NAMES = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
];

const DEFAULT_TYPE = "normal";

/**
 * Retorna a cor base de um tipo.
 *
 * @param {string} typeName - Nome do tipo.
 * @returns {string} Cor principal do tipo.
 */
export function getTypeColor(typeName) {
    return BASE_COLORS[typeName]?.base || BASE_COLORS[DEFAULT_TYPE].base;
}

/**
 * Retorna o gradiente associado a um tipo.
 *
 * @param {string} typeName - Nome do tipo.
 * @returns {string} Gradiente linear gerado a partir das cores.
 */
export function getTypeGradient(typeName) {
    const colors = BASE_COLORS[typeName] || BASE_COLORS[DEFAULT_TYPE];
    return `linear-gradient(135deg, ${colors.base}, ${colors.dark})`;
}

/**
 * Lista dos tipos disponíveis (inclui o tipo “all” para filtro global).
 */
export const TYPE_SEQUENCE = ["all", ...TYPE_NAMES];
