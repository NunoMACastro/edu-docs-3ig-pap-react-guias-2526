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

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use(requireCsrf);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, res) => {
    res.status(404).json({
        error: { code: "NOT_FOUND", message: "Rota inexistente" },
    });
});

app.use((err, _req, res, _next) => {
    console.error(err);

    if (res.headersSent) {
        return;
    }

    const status = Number(err.status) || 500;
    return res.status(status).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message || "Erro interno no servidor",
        },
    });
});

export default app;
