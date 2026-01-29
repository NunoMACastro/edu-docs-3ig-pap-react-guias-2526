import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Configuração do Vite.
 *
 * Objetivo: criar o alias "@" para apontar para a pasta "src".
 * Assim, os imports ficam mais curtos e mais fáceis de ler.
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(process.cwd(), "src"),
        },
    },
});
