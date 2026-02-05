/**
 * Trecho: backend/src/utils/cookies.js
 * Objetivo: definir opções de cookies num único sítio para evitar inconsistências entre set/clear.

 */

const isProd = process.env.NODE_ENV === "production";

/**
 * Opções base partilhadas por todos os cookies da app.
 *
 * @returns {{path: string, sameSite: string, secure: boolean}}
 */
function baseCookieOptions() {
    return {
        // Manter o mesmo path é essencial para clearCookie funcionar corretamente.
        path: "/",
        sameSite: "lax",
        secure: isProd,
    };
}

/**
 * Cookie de autenticação (JWT).
 *
 * @returns {{path: string, sameSite: string, secure: boolean, httpOnly: boolean, maxAge: number}}
 */
export function authCookieOptions() {
    return {
        ...baseCookieOptions(),
        // HttpOnly protege token contra acesso direto via JavaScript no browser.
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

/**
 * Cookie CSRF (precisa de ser legível no frontend para enviar no header).
 *
 * @returns {{path: string, sameSite: string, secure: boolean, httpOnly: boolean, maxAge: number}}
 */
export function csrfCookieOptions() {
    return {
        ...baseCookieOptions(),
        // Não HttpOnly de propósito: o cliente lê este valor para X-CSRF-Token.
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

/**
 * Opções usadas ao limpar cookies; devem bater com as opções usadas no set.
 *
 * @returns {{path: string, sameSite: string, secure: boolean}}
 */
export function clearCookieOptions() {
    return {
        ...baseCookieOptions(),
    };
}
