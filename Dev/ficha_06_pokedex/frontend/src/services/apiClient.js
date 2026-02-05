/**
 * Trecho: frontend/src/services/apiClient.js
 * Objetivo: centralizar chamadas HTTP e injetar CSRF automaticamente nas mutações.

 */

import axios from "axios";

/**
 * Lê valor de um cookie por nome.
 *
 * @param {string} name
 * @returns {string | null}
 */
function getCookie(name) {
    const chunk = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    if (!chunk) return null;
    return decodeURIComponent(chunk.split("=").slice(1).join("="));
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    // Sem isto o browser não envia/recebe cookies cross-origin.
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toLowerCase();
    // Só métodos que alteram estado precisam de prova CSRF.
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
        const csrf = getCookie("csrfToken");
        if (csrf) {
            config.headers = config.headers ?? {};
            // Header esperado no backend (requireCsrf).
            config.headers["X-CSRF-Token"] = csrf;
        }
    }

    return config;
});

export default api;
