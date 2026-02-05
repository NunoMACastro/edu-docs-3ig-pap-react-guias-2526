/**
 * Trecho: frontend/src/pages/ProfilePage.jsx
 * Objetivo: permitir upload de avatar e refletir a alteração no perfil atual.

 */

import { useState } from "react";
import { usePokedex } from "@/context/PokedexContext.jsx";
import { uploadAvatar } from "@/services/usersApi.js";

/**
 * Página de perfil com upload de avatar.
 *
 * @returns {JSX.Element}
 */
function ProfilePage() {
    const { user, refreshSession } = usePokedex();
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /**
     * Envia imagem para o backend e atualiza sessão local.
     *
     * @param {import("react").FormEvent<HTMLFormElement>} event
     * @returns {Promise<void>}
     */
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
            // refreshSession volta a pedir /api/auth/me para apanhar avatarUrl novo.
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
                            // Construção de URL absoluta com base no backend configurado no frontend.
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
