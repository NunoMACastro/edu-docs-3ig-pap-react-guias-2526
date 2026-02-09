import api from "./apiClient.js";

export async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post("/api/users/avatar", formData);
    return res.data;
}
