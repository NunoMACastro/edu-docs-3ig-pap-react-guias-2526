const API_BASE = "https://pokeapi.co/api/v2";

/**
 * Vai buscar a lista base e depois os detalhes de cada Pokémon.
 *
 * @param {number} limit - Quantos Pokémon carregar.
 * @returns {Promise<Array>} Lista detalhada de Pokémon.
 */
export async function fetchPokemonList(limit = 151) {
    const response = await fetch(`${API_BASE}/pokemon?limit=${limit}`);
    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista.");
    }

    const data = await response.json();

    const detailedPokemon = await Promise.all(
        data.results.map(async (entry) => {
            const detailResponse = await fetch(entry.url);
            if (!detailResponse.ok) {
                throw new Error(`Erro ao carregar ${entry.name}`);
            }
            return detailResponse.json();
        }),
    );

    return detailedPokemon;
}
