import mongoose from "mongoose";

export async function connectToMongo() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI em falta no backend/.env");
    }

    await mongoose.connect(uri);
    console.log("[mongo] ligado com sucesso");
}
