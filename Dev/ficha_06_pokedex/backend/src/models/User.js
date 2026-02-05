/**
 * Trecho: backend/src/models/User.js
 * Objetivo: definir o schema do utilizador (credenciais, favoritos e avatar) e esconder `passwordHash` no JSON de resposta.
 * Este ficheiro existe aqui para sustentar auth, favorites e perfil nas secções seguintes.

 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        favorites: {
            type: [Number],
            default: [],
        },
        avatarUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.passwordHash;
                return ret;
            },
        },
    },
);

const User = mongoose.model("User", userSchema);

export default User;
