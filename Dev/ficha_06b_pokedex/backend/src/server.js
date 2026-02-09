import "dotenv/config";
import app from "./app.js";
import { connectToMongo } from "./db/connect.js";

const PORT = Number(process.env.PORT ?? 3000);

function assertRequiredEnv() {
    const required = ["MONGODB_URI", "JWT_SECRET"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Variáveis em falta no .env: ${missing.join(", ")}`);
    }
}

async function bootstrap() {
    assertRequiredEnv();
    await connectToMongo();

    app.listen(PORT, () => {
        console.log(`API a correr em http://localhost:${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error("[fatal] falha ao arrancar o backend", err);
    process.exit(1);
});
