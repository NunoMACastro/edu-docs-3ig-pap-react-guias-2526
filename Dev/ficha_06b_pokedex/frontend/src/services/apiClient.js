import axios from "axios";

function getCookie(name) {
    const chunk = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    if (!chunk) return null;
    return decodeURIComponent(chunk.split("=").slice(1).join("="));
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const method = (config.method ?? "get").toLowerCase();
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
        const csrf = getCookie("csrfToken");
        if (csrf) {
            config.headers = config.headers ?? {};
            config.headers["X-CSRF-Token"] = csrf;
        }
    }

    return config;
});

export default api;
