import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokedex } from "@/context/PokedexContext.jsx";

function RegisterPage() {
    const { register } = usePokedex();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await register({ username, email, password });
            navigate("/", { replace: true });
        } catch {
            setError("Não foi possível criar conta.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Registo</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        minLength={3}
                        required
                    />
                </label>
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
                        minLength={6}
                        required
                    />
                </label>
                <button type="submit" disabled={submitting}>
                    {submitting ? "A criar..." : "Criar conta"}
                </button>
            </form>
            {error && <p className="pokedex__empty">{error}</p>}
        </section>
    );
}

export default RegisterPage;
