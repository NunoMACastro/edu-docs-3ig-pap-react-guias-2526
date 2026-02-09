import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
        cb(
            null,
            `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
        );
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Ficheiro inválido: envia uma imagem"));
            return;
        }
        cb(null, true);
    },
});

router.post(
    "/avatar",
    requireAuth,
    upload.single("avatar"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(422).json({
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "avatar é obrigatório",
                    },
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

            user.avatarUrl = `/uploads/${req.file.filename}`;
            await user.save();

            return res.status(200).json({ avatarUrl: user.avatarUrl });
        } catch (err) {
            return next(err);
        }
    },
);

export default router;
