const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function requireCsrf(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.get("x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res.status(403).json({
            error: { code: "CSRF_INVALID", message: "CSRF token inválido" },
        });
    }

    return next();
}
