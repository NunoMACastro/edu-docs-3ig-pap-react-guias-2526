/**
 * Trecho: backend/src/middlewares/requireCsrf.js
 * Objetivo: bloquear mutações sem prova CSRF (header + cookie a coincidir).

 */

// Métodos seguros não alteram estado e não exigem token CSRF.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Middleware CSRF (double submit cookie).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function requireCsrf(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    // Cookie vem automaticamente no pedido; header vem explicitamente do frontend.
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.get("x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        // 403 = pedido entendido, mas recusado por política de segurança.
        return res.status(403).json({
            error: { code: "CSRF_INVALID", message: "CSRF token inválido" },
        });
    }

    return next();
}
