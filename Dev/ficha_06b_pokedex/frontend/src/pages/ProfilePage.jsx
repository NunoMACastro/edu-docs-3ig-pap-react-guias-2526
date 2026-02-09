import { useState } from "react";
import { usePokedex } from "@/context/PokedexContext.jsx";
import { uploadAvatar } from "@/services/usersApi.js";

function ProfilePage() {
    const { user, refreshSession } = usePokedex();
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setFeedback("");

        if (!file) {
            setFeedback("Escolhe uma imagem.");
            return;
        }

        setSubmitting(true);

        try {
            await uploadAvatar(file);
            await refreshSession();
            setFeedback("Avatar atualizado com sucesso.");
            setFile(null);
        } catch {
            setFeedback("Não foi possível atualizar o avatar.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Perfil</h2>

            {user && (
                <>
                    <p>
                        <strong>{user.username}</strong> ({user.email})
                    </p>

                    {user.avatarUrl ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
                            alt={`Avatar de ${user.username}`}
                            width="140"
                            height="140"
                            style={{ objectFit: "cover", borderRadius: "12px" }}
                        />
                    ) : (
                        <p>Ainda sem avatar.</p>
                    )}
                </>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Nova imagem
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        required
                    />
                </label>

                <button type="submit" disabled={submitting}>
                    {submitting ? "A enviar..." : "Atualizar avatar"}
                </button>
            </form>

            {feedback && <p className="pokedex__empty">{feedback}</p>}
        </section>
    );
}

export default ProfilePage;
