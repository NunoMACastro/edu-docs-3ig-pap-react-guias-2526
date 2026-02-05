/**
 * Trecho: backend/src/db/connect.js
 * Objetivo: centralizar ligação ao MongoDB e falhar cedo quando faltar configuração crítica.

 */

import mongoose from "mongoose";

/**
 * Liga a aplicação ao MongoDB Atlas antes do backend aceitar pedidos.
 *
 * @returns {Promise<void>}
 * @throws {Error} Quando MONGODB_URI não existe.
 */
export async function connectToMongo() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        // Falha explícita para evitar servidor "meio vivo" sem base de dados.
        throw new Error("MONGODB_URI em falta no backend/.env");
    }

    // Se a URI estiver inválida ou o Atlas rejeitar, esta Promise rejeita e o bootstrap trata.
    await mongoose.connect(uri);
    console.log("[mongo] ligado com sucesso");
}
