import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function LoginPage() {
    const { login } = usePokedex();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login({ email, password });
            navigate(redirectTo, { replace: true });
        } catch {
            setError("Login inválido.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? "A entrar..." : "Entrar"}
                </button>
            </form>
            {error && <p className="pokedex__empty">{error}</p>}
        </section>
    );
}

export default LoginPage;
