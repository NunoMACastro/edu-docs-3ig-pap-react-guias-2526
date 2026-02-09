import api from "./apiClient.js";

export async function getFavorites() {
    const res = await api.get("/api/favorites");
    return res.data;
}

export async function addFavorite(id) {
    const res = await api.post("/api/favorites", { id });
    return res.data;
}

export async function removeFavorite(id) {
    const res = await api.delete(`/api/favorites/${id}`);
    return res.data;
}
