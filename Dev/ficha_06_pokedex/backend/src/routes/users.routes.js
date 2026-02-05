/**
 * Trecho: backend/src/routes/users.routes.js
 * Objetivo: receber upload de avatar e guardar URL pública no perfil do utilizador.

 */

import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// Diretório único de uploads; usado aqui e no express.static do app.js.
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    // Guarda sempre na pasta uploads da raiz do backend.
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        // Nome pseudo-único para reduzir colisões entre uploads.
        const ext =
            path.extname(file.originalname || "").toLowerCase() || ".png";
        cb(
            null,
            `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
        );
    },
});

const upload = multer({
    storage,
    // Limite de 2MB evita uploads gigantes em ambiente pedagógico.
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        // ATENÇÃO (armadilha): mimetype pode ser falsificado; aqui é filtro básico de sala de aula.
        // Nota: não corrigimos aqui para manter o snippet alinhado com o enunciado.
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
    async (req, res) => {
        if (!req.file) {
            // 422 quando o campo avatar não foi enviado.
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

        // Mantemos contrato simples: devolver apenas a URL pública.
        return res.status(200).json({ avatarUrl: user.avatarUrl });
    },
);

export default router;
