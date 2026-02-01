import express from "express";
import cors from "cors";
import favoritesRoutes from "./routes/favorites.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

app.use("/api/favorites", favoritesRoutes);

export default app;
