/**
 * Trecho: frontend/src/services/authApi.js
 * Objetivo: encapsular endpoints de autenticação para manter páginas limpas.

 */

import api from "./apiClient.js";

/**
 * Regista utilizador e inicia sessão (cookies definidos pelo backend).
 *
 * @param {{username: string, email: string, password: string}} payload
 * @returns {Promise<any>}
 */
export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

/**
 * Faz login e recebe sessão por cookie.
 *
 * @param {{email: string, password: string}} payload
 * @returns {Promise<any>}
 */
export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
}

/**
 * Tenta restaurar sessão existente.
 *
 * @returns {Promise<any>}
 */
export async function restoreSession() {
    const res = await api.get("/api/auth/me");
    return res.data;
}

/**
 * Termina sessão atual.
 *
 * @returns {Promise<any>}
 */
export async function logout() {
    const res = await api.post("/api/auth/logout");
    return res.data;
}
