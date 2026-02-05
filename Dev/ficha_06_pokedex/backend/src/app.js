/**
 * Trecho: backend/src/app.js
 * Objetivo: montar a pipeline do Express na ordem certa (CORS -> parsers -> rotas -> 404 -> erros).

 */

import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { requireCsrf } from "./middlewares/requireCsrf.js";

const app = express();
const uploadsDir = path.join(process.cwd(), "uploads");

// CORS tem de vir cedo para responder corretamente a preflight e pedidos cross-origin.
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        // Sem credentials=true os cookies de sessão não viajam entre frontend e backend.
        credentials: true,
    }),
);
// Parser de JSON para req.body em endpoints application/json.
app.use(express.json());
// Parser de cookies para req.cookies (necessário em auth/csrf).
app.use(cookieParser());
// Ficheiros estáticos de avatar servidos em /uploads/...
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
});

// Login/register/me não passam no guard global de CSRF.
app.use("/api/auth", authRoutes);

// A partir daqui, todas as mutações exigem X-CSRF-Token válido.
app.use(requireCsrf);

app.use("/api/favorites", favoritesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, res) => {
    res.status(404).json({
        error: { code: "NOT_FOUND", message: "Rota inexistente" },
    });
});

app.use((err, _req, res, next) => {
    if (!err) {
        return next();
    }

    if (res.headersSent) {
        return next(err);
    }

    const isUploadError =
        err.code === "LIMIT_FILE_SIZE" ||
        err.code === "LIMIT_UNEXPECTED_FILE" ||
        err.name === "MulterError";

    const status = err.status ?? (err.code === "LIMIT_FILE_SIZE" ? 413 : 400);

    const message =
        err.message || (isUploadError ? "Erro no upload" : "Pedido inválido");

    // ATENÇÃO (armadilha): erros de upload podem parecer "genéricos".
    // Nota: mantemos resposta curta aqui para ficar alinhada com o enunciado.
    return res.status(status).json({
        error: {
            code: isUploadError ? "UPLOAD_ERROR" : "BAD_REQUEST",
            message,
        },
    });
});

export default app;
