// src/services/favoritesApi.js

// Base da API (muda aqui se a porta ou host mudar).
// E uma string com o endereco do backend.
const API_BASE = "http://localhost:3000";

// GET /api/favorites -> devolve um array de ids.
// async significa que a funcao devolve uma Promise.
export async function getFavorites() {
    // fetch faz um pedido HTTP e devolve uma Promise.
    // await pausa aqui ate a resposta chegar.
    const res = await fetch(`${API_BASE}/api/favorites`);
    // res.ok indica se o status esta em 2xx.
    if (!res.ok) throw new Error("Erro API");
    // Converte o JSON da resposta para objeto JS.
    // res.json() tambem devolve uma Promise.
    return res.json();
}

// POST /api/favorites -> adiciona um id aos favoritos.
export async function addFavorite(id) {
    // body vai em JSON, por isso usamos JSON.stringify(...)
    const res = await fetch(`${API_BASE}/api/favorites`, {
        method: "POST",
        // Diz ao servidor que o body esta em JSON.
        headers: { "Content-Type": "application/json" },
        // Envia o id no body.
        body: JSON.stringify({ id }),
    });
    // Se o backend respondeu com 4xx/5xx, lancamos erro.
    if (!res.ok) throw new Error("Erro API");
    // Devolve o JSON com o id confirmado pelo servidor.
    return res.json();
}

// DELETE /api/favorites/:id -> remove um id.
export async function removeFavorite(id) {
    // Aqui colocamos o id no URL (endpoint com parametro).
    const res = await fetch(`${API_BASE}/api/favorites/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro API");
    // Devolve o JSON com o id removido.
    return res.json();
}
