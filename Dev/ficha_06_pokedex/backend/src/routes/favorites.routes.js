/**
 * Trecho: backend/src/routes/favorites.routes.js
 * Objetivo: gerir favoritos por utilizador mantendo contrato compatível com a Ficha 05.

 */

import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

/**
 * Converte input para inteiro positivo.
 *
 * @param {unknown} value
 * @returns {number | null}
 */
function parsePositiveInt(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

router.get("/", requireAuth, async (req, res) => {
    // GET devolve array de IDs, sem envelope adicional (contrato canónico da ficha).
    const user = await User.findById(req.auth.userId).select("favorites");

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    return res.status(200).json(user.favorites);
});

router.post("/", requireAuth, async (req, res) => {
    const id = parsePositiveInt(req.body?.id);

    if (!id) {
        // 422 para body inválido (cliente consegue corrigir o pedido).
        return res.status(422).json({
            error: { code: "VALIDATION_ERROR", message: "id inválido" },
        });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
        });
    }

    if (user.favorites.includes(id)) {
        // 409 quando o mesmo favorito já existe.
        return res.status(409).json({
            error: { code: "DUPLICATE_KEY", message: "Pokémon já é favorito" },
        });
    }

    user.favorites.push(id);
    await user.save();

    return res.status(201).json({ id });
});

router.delete("/:id", requireAuth, async (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
        // 400 porque o parâmetro de rota já é inválido à partida.
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "id inválido" },
        });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
        return res.status(404).json({
            error: { code: "USER_NOT_FOUND", message: "Utilizador não existe" },
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
});

export default router;
