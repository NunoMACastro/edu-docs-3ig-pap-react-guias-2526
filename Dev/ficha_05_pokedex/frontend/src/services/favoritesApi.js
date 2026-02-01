const API_BASE = "http://localhost:3000";

export async function getFavorites() {
    const res = await fetch(`${API_BASE}/api/favorites`);
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}

export async function addFavorite(id) {
    const res = await fetch(`${API_BASE}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}

export async function removeFavorite(id) {
    const res = await fetch(`${API_BASE}/api/favorites/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro API");
    return res.json();
}
