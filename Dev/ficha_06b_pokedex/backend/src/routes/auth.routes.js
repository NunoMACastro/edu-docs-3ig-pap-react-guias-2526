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

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function normalizeEmail(email) {
    return String(email ?? "")
        .trim()
        .toLowerCase();
}

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

router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body ?? {};
        const validationError = basicValidation({ username, email, password });

        if (validationError) {
            return res.status(422).json({
                error: { code: "VALIDATION_ERROR", message: validationError },
            });
        }

        const normalizedEmail = normalizeEmail(email);
        const alreadyExists = await User.findOne({ email: normalizedEmail });

        if (alreadyExists) {
            return res.status(409).json({
                error: { code: "DUPLICATE_EMAIL", message: "Email já registado" },
            });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            username: String(username).trim(),
            email: normalizedEmail,
            passwordHash,
        });

        const token = signToken(user.id);
        const csrfToken = createCsrfToken();

        res.cookie("token", token, authCookieOptions());
        res.cookie("csrfToken", csrfToken, csrfCookieOptions());

        return res.status(201).json({ user });
    } catch (err) {
        return next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const email = normalizeEmail(req.body?.email);
        const password = String(req.body?.password ?? "");

        if (!email || !password) {
            return res.status(422).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Credenciais inválidas",
                },
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
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
    } catch (err) {
        return next(err);
    }
});

router.get("/me", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({
                error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
            });
        }

        return res.status(200).json({ user });
    } catch (err) {
        return next(err);
    }
});

router.post("/logout", requireAuth, requireCsrf, (_req, res) => {
    res.clearCookie("token", clearCookieOptions());
    res.clearCookie("csrfToken", clearCookieOptions());
    return res.status(200).json({ ok: true });
});

export default router;
