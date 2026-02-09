const isProd = process.env.NODE_ENV === "production";

function baseCookieOptions() {
    return {
        path: "/",
        sameSite: "lax",
        secure: isProd,
    };
}

export function authCookieOptions() {
    return {
        ...baseCookieOptions(),
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

export function csrfCookieOptions() {
    return {
        ...baseCookieOptions(),
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    };
}

export function clearCookieOptions() {
    return {
        ...baseCookieOptions(),
    };
}
