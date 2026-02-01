import { Router } from "express";
import {
    addFavorite,
    hasFavorite,
    listFavorites,
    removeFavorite,
} from "../data/favorites.memory.js";

const router = Router();

function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

function parseId(value) {
    const numericId = Number(value);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }
    return numericId;
}

router.get("/", (req, res) => {
    res.status(200).json(listFavorites());
});

router.post("/", (req, res) => {
    const { id } = req.body || {};
    const numericId = parseId(id);

    if (!numericId) {
        return sendError(
            res,
            422,
            "VALIDATION_ERROR",
            "Id obrigatorio e numerico",
        );
    }

    if (hasFavorite(numericId)) {
        return sendError(res, 409, "DUPLICATE_KEY", "Pokemon ja e favorito");
    }

    addFavorite(numericId);
    return res.status(201).json({ id: numericId });
});

router.delete("/:id", (req, res) => {
    const numericId = parseId(req.params.id);

    if (!numericId) {
        return sendError(res, 400, "INVALID_ID", "Id invalido");
    }

    if (!hasFavorite(numericId)) {
        return sendError(res, 404, "NOT_FOUND", "Favorito nao encontrado");
    }

    removeFavorite(numericId);
    return res.status(200).json({ id: numericId });
});

export default router;
