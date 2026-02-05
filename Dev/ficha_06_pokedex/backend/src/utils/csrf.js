/**
 * Trecho: backend/src/utils/csrf.js
 * Objetivo: gerar token CSRF aleatório para o padrão double-submit-cookie.

 */

import crypto from "node:crypto";

/**
 * Gera um token CSRF em hexadecimal.
 *
 * @returns {string}
 */
export function createCsrfToken() {
    return crypto.randomBytes(24).toString("hex");
}
