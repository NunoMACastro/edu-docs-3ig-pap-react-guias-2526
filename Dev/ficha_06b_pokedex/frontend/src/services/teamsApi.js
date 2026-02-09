import api from "./apiClient.js";

export async function listTeams({ page = 1, limit = 6, q = "" } = {}) {
    const res = await api.get("/api/teams", {
        params: { page, limit, q },
    });
    return res.data;
}

export async function createTeam(payload) {
    const res = await api.post("/api/teams", payload);
    return res.data;
}

export async function removeTeam(id) {
    const res = await api.delete(`/api/teams/${id}`);
    return res.data;
}
