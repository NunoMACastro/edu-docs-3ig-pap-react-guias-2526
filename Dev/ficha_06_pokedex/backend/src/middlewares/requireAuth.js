/**
 * Trecho: backend/src/middlewares/requireAuth.js
 * Objetivo: proteger rotas privadas validando o JWT recebido via cookie HttpOnly.

 */

import jwt from "jsonwebtoken";

/**
 * Middleware de autenticação.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function requireAuth(req, res, next) {
    // O cookie "token" é enviado automaticamente pelo browser quando withCredentials=true.
    const token = req.cookies?.token;

    if (!token) {
        // 401 = não autenticado (sem sessão).
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Sessão em falta" },
        });
    }

    try {
        // Verifica assinatura e expiração do JWT usando o segredo do backend.
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos o userId em req.auth para os handlers seguintes.
        req.auth = { userId: payload.userId };
        return next();
    } catch {
        // 401 novamente: token existe mas é inválido/expirado.
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Sessão inválida" },
        });
    }
}
