/**
 * Trecho: frontend/src/services/teamsApi.js
 * Objetivo: centralizar chamadas HTTP das equipas com paginação e CRUD básico.

 */

import api from "./apiClient.js";

/**
 * Lista equipas paginadas.
 *
 * @param {{page?: number, limit?: number, q?: string}} [param0]
 * @returns {Promise<any>}
 */
export async function listTeams({ page = 1, limit = 6, q = "" } = {}) {
    const res = await api.get("/api/teams", {
        params: { page, limit, q },
    });
    return res.data;
}

/**
 * Cria uma nova equipa.
 *
 * @param {{name: string, pokemonIds: number[]}} payload
 * @returns {Promise<any>}
 */
export async function createTeam(payload) {
    const res = await api.post("/api/teams", payload);
    return res.data;
}

/**
 * Remove equipa por ID.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function removeTeam(id) {
    const res = await api.delete(`/api/teams/${id}`);
    return res.data;
}
