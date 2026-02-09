import api from "./apiClient.js";

export async function register(payload) {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
}

export async function login(payload) {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
}

export async function restoreSession() {
    const res = await api.get("/api/auth/me");
    return res.data;
}

export async function logout() {
    const res = await api.post("/api/auth/logout");
    return res.data;
}
