/**
 * Trecho: backend/src/server.js
 * Objetivo: arrancar o backend pela ordem correta (env -> mongo -> listen).

 */

import "dotenv/config";
import app from "./app.js";
import { connectToMongo } from "./db/connect.js";

const port = Number(process.env.PORT ?? 3000);

/**
 * Garante que variáveis críticas existem antes de ligar serviços externos.
 *
 * @returns {void}
 * @throws {Error}
 */
function assertRequiredEnv() {
    const required = ["MONGODB_URI", "JWT_SECRET"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Variáveis em falta no backend/.env: ${missing.join(", ")}`,
        );
    }
}

/**
 * Bootstrap da aplicação.
 *
 * @returns {Promise<void>}
 */
async function bootstrap() {
    // Fail fast: se faltar configuração crítica, não abrimos a porta HTTP.
    assertRequiredEnv();

    // Fail fast: se Mongo falhar, não abrimos a porta HTTP.
    await connectToMongo();

    app.listen(port, () => {
        console.log(`[server] http://localhost:${port}`);
    });
}

bootstrap().catch((err) => {
    // Erro fatal de arranque: termina o processo para evitar estado inconsistente.
    console.error("[fatal] falha ao arrancar", err);
    process.exit(1);
});
