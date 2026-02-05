/**
 * Trecho: frontend/src/services/usersApi.js
 * Objetivo: subir avatar via multipart/form-data.

 */

import api from "./apiClient.js";

/**
 * Faz upload de avatar.
 *
 * @param {File} file
 * @returns {Promise<{avatarUrl: string}>}
 */
export async function uploadAvatar(file) {
    const formData = new FormData();
    // O nome do campo tem de bater com upload.single("avatar") no backend.
    formData.append("avatar", file);

    // Sem header manual: o browser/axios definem o boundary multipart corretamente.
    const res = await api.post("/api/users/avatar", formData);

    return res.data;
}
