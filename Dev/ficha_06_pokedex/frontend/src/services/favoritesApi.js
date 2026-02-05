/**
 * Trecho: frontend/src/services/favoritesApi.js
 * Objetivo: isolar o contrato canónico de favoritos num único módulo.

 */

import api from "./apiClient.js";

/**
 * GET /api/favorites -> number[]
 *
 * @returns {Promise<number[]>}
 */
export async function getFavorites() {
    const res = await api.get("/api/favorites");
    return res.data;
}

/**
 * POST /api/favorites { id } -> { id }
 *
 * @param {number} id
 * @returns {Promise<{id: number}>}
 */
export async function addFavorite(id) {
    const res = await api.post("/api/favorites", { id });
    return res.data;
}

/**
 * DELETE /api/favorites/:id -> { id }
 *
 * @param {number} id
 * @returns {Promise<{id: number}>}
 */
export async function removeFavorite(id) {
    const res = await api.delete(`/api/favorites/${id}`);
    return res.data;
}
