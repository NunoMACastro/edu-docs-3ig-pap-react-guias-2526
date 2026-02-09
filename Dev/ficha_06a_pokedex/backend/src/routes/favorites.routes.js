import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

function parsePositiveInt(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

router.get("/", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.auth.userId).select("favorites");

        if (!user) {
            return res.status(404).json({
                error: {
                    code: "USER_NOT_FOUND",
                    message: "Utilizador não existe",
                },
            });
        }

        return res.status(200).json(user.favorites);
    } catch (err) {
        return next(err);
    }
});

router.post("/", requireAuth, async (req, res, next) => {
    try {
        const id = parsePositiveInt(req.body?.id);

        if (!id) {
            return res.status(422).json({
                error: { code: "VALIDATION_ERROR", message: "id inválido" },
            });
        }

        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({
                error: {
                    code: "USER_NOT_FOUND",
                    message: "Utilizador não existe",
                },
            });
        }

        if (user.favorites.includes(id)) {
            return res.status(409).json({
                error: {
                    code: "DUPLICATE_KEY",
                    message: "Pokémon já é favorito",
                },
            });
        }

        user.favorites.push(id);
        await user.save();

        return res.status(201).json({ id });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        const id = parsePositiveInt(req.params.id);

        if (!id) {
            return res.status(400).json({
                error: { code: "INVALID_ID", message: "id inválido" },
            });
        }

        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({
                error: {
                    code: "USER_NOT_FOUND",
                    message: "Utilizador não existe",
                },
            });
        }

        if (!user.favorites.includes(id)) {
            return res.status(404).json({
                error: { code: "NOT_FOUND", message: "Favorito não existe" },
            });
        }

        user.favorites = user.favorites.filter((favId) => favId !== id);
        await user.save();

        return res.status(200).json({ id });
    } catch (err) {
        return next(err);
    }
});

export default router;
