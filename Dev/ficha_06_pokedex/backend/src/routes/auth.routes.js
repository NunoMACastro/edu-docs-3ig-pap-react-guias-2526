/**
 * Trecho: backend/src/routes/auth.routes.js
 * Objetivo: gerir ciclo de sessão (register/login/me/logout) com cookies e JWT.

 */

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireCsrf } from "../middlewares/requireCsrf.js";
import {
    authCookieOptions,
    csrfCookieOptions,
    clearCookieOptions,
} from "../utils/cookies.js";
import { createCsrfToken } from "../utils/csrf.js";

const router = Router();
const SALT_ROUNDS = 10;

/**
 * Assina JWT com identificação mínima do utilizador.
 *
 * @param {string} userId
 * @returns {string}
 */
function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Normaliza email para evitar duplicados com maiúsculas/espaços.
 *
 * @param {unknown} email
 * @returns {string}
 */
function normalizeEmail(email) {
    return String(email ?? "")
        .trim()
        .toLowerCase();
}

/**
 * Validação de input para registo.
 *
 * @param {{username: unknown, email: unknown, password: unknown}} param0
 * @returns {string | null}
 */
function basicValidation({ username, email, password }) {
    if (!username || String(username).trim().length < 3) {
        return "Username deve ter pelo menos 3 caracteres";
    }

    if (!email || !normalizeEmail(email).includes("@")) {
        return "Email inválido";
    }

    if (!password || String(password).length < 6) {
        return "Password deve ter pelo menos 6 caracteres";
    }

    return null;
}

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body ?? {};
    const validationError = basicValidation({ username, email, password });

    if (validationError) {
        // 422 = estrutura do pedido válida, mas dados falham regras de negócio.
        return res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: validationError },
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const alreadyExists = await User.findOne({ email: normalizedEmail });

    if (alreadyExists) {
        // 409 = conflito com estado atual (email já existe).
        return res.status(409).json({
            error: { code: "DUPLICATE_EMAIL", message: "Email já registado" },
        });
    }

    // bcrypt é intencionalmente "lento" para dificultar brute force offline.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        username: String(username).trim(),
        email: normalizedEmail,
        passwordHash,
    });

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    // token -> HttpOnly; csrfToken -> legível para o frontend (header CSRF).
    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
        // 422 para payload incompleto.
        return res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Credenciais inválidas",
            },
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        // 401 não revela se o email existe ou não (evita enumeração fácil).
        return res.status(401).json({
            error: { code: "INVALID_CREDENTIALS", message: "Login inválido" },
        });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
        return res.status(401).json({
            error: { code: "INVALID_CREDENTIALS", message: "Login inválido" },
        });
    }

    const token = signToken(user.id);
    const csrfToken = createCsrfToken();

    res.cookie("token", token, authCookieOptions());
    res.cookie("csrfToken", csrfToken, csrfCookieOptions());

    return res.status(200).json({ user });
});

router.get("/me", requireAuth, async (req, res) => {
    const user = await User.findById(req.auth.userId);

    if (!user) {
        // Pode acontecer se conta foi apagada depois do token ter sido emitido.
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    return res.status(200).json({ user });
});

router.post("/logout", requireAuth, requireCsrf, (_req, res) => {
    // Clear usa as mesmas opções-base para garantir que o browser remove mesmo os cookies.
    res.clearCookie("token", clearCookieOptions());
    res.clearCookie("csrfToken", clearCookieOptions());
    return res.status(200).json({ ok: true });
});

export default router;
