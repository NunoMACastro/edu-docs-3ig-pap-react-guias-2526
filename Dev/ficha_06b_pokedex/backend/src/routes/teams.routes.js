import { Router } from "express";
import mongoose from "mongoose";
import Team from "../models/Team.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

function parsePositiveInt(value, fallback) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return fallback;
    return n;
}

router.get("/", requireAuth, async (req, res, next) => {
    try {
        const page = parsePositiveInt(req.query.page, 1);
        const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
        const q = String(req.query.q ?? "")
            .trim()
            .slice(0, 50);

        const filter = { userId: req.auth.userId };
        if (q) {
            filter.name = { $regex: q, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Team.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Team.countDocuments(filter),
        ]);

        const pages = Math.max(1, Math.ceil(total / limit));

        return res.status(200).json({ items, total, page, limit, pages });
    } catch (err) {
        return next(err);
    }
});

router.post("/", requireAuth, async (req, res, next) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        const pokemonIdsRaw = Array.isArray(req.body?.pokemonIds)
            ? req.body.pokemonIds
            : [];

        const pokemonIds = [...new Set(pokemonIdsRaw.map(Number))].filter(
            (id) => Number.isInteger(id) && id > 0,
        );

        if (!name) {
            return res.status(422).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "name é obrigatório",
                },
            });
        }

        if (pokemonIds.length < 1 || pokemonIds.length > 6) {
            return res.status(422).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "pokemonIds deve ter entre 1 e 6 elementos",
                },
            });
        }

        const team = await Team.create({
            userId: req.auth.userId,
            name,
            pokemonIds,
        });

        return res.status(201).json(team);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: {
                    code: "INVALID_ID",
                    message: "id de equipa inválido",
                },
            });
        }

        const team = await Team.findOne({
            _id: req.params.id,
            userId: req.auth.userId,
        });

        if (!team) {
            return res.status(404).json({
                error: { code: "NOT_FOUND", message: "Equipa não encontrada" },
            });
        }

        await team.deleteOne();

        return res.status(200).json({ id: req.params.id });
    } catch (err) {
        return next(err);
    }
});

export default router;
