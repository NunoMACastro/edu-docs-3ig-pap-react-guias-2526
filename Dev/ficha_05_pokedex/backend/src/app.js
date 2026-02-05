// backend/src/app.js
// import: traz dependencias instaladas pelo npm ou ficheiros locais.
import express from "express"; // framework para criar a API HTTP
import cors from "cors"; // middleware para permitir pedidos cross-origin
import favoritesRoutes from "./routes/favorites.routes.js"; // rotas de favoritos

// Cria a aplicacao Express (o "motor" do servidor).
const app = express();

// app.use(...) adiciona um middleware.
// A ORDEM dos middlewares importa.
// Permite pedidos do frontend (porta 5173) para a API (porta 3000).
app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

// Faz o parse de JSON do body e coloca o resultado em req.body.
// Sem isto, req.body fica undefined.
app.use(express.json());

// Liga o router de favoritos ao prefixo /api/favorites.
// Ou seja, dentro do router usas "/" e aqui defines o caminho base.
app.use("/api/favorites", favoritesRoutes);

// Exporta a app para o server.js arrancar o servidor.
// "default" significa que este e o export principal do ficheiro.
export default app;
