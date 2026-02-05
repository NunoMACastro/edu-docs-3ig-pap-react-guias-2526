/**
 * Trecho: backend/src/models/Team.js
 * Objetivo: definir a estrutura de dados de uma equipa no MongoDB.

 */

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            // Índice acelera listagens por utilizador.
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        pokemonIds: {
            type: [Number],
            validate: {
                // Regra de negócio: equipa entre 1 e 6 IDs válidos.
                validator: (arr) =>
                    Array.isArray(arr) &&
                    arr.length >= 1 &&
                    arr.length <= 6 &&
                    arr.every((id) => Number.isInteger(id) && id > 0),
                message: "pokemonIds deve ter entre 1 e 6 ids válidos",
            },
        },
    },
    { timestamps: true },
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
