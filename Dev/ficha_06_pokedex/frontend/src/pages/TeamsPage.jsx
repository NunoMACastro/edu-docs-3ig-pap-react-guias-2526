/**
 * Trecho: frontend/src/pages/TeamsPage.jsx
 * Objetivo: gerir UI de equipas (listar, criar, apagar) com paginação e pesquisa.

 */

import { useEffect, useState } from "react";
import { createTeam, listTeams, removeTeam } from "@/services/teamsApi.js";

/**
 * Página de gestão de equipas.
 *
 * @returns {JSX.Element}
 */
function TeamsPage() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [q, setQ] = useState("");
    const [name, setName] = useState("");
    const [pokemonIdsInput, setPokemonIdsInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Carrega uma página de equipas.
     *
     * @param {number} [targetPage=page]
     * @returns {Promise<void>}
     */
    async function load(targetPage = page) {
        setLoading(true);
        setError("");

        try {
            // Mantemos limit fixo na UI para experiência consistente.
            const data = await listTeams({ page: targetPage, limit: 6, q });
            setItems(data.items);
            setTotal(data.total);
            setPage(data.page);
            setPages(data.pages);
        } catch {
            setError("Erro ao carregar equipas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Sempre que q muda, voltamos à primeira página para evitar páginas vazias inesperadas.
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    /**
     * Cria equipa com validação básica antes do POST.
     *
     * @param {import("react").FormEvent<HTMLFormElement>} event
     * @returns {Promise<void>}
     */
    async function handleCreate(event) {
        event.preventDefault();
        setError("");

        // Parsing + dedupe de IDs introduzidos em texto livre.
        const pokemonIds = [
            ...new Set(
                pokemonIdsInput
                    .split(",")
                    .map((x) => Number(x.trim()))
                    .filter((x) => Number.isInteger(x) && x > 0),
            ),
        ];

        if (!name.trim()) {
            setError("Nome da equipa é obrigatório.");
            return;
        }

        if (pokemonIds.length < 1 || pokemonIds.length > 6) {
            setError("Indica entre 1 e 6 IDs de Pokémon.");
            return;
        }

        try {
            await createTeam({ name: name.trim(), pokemonIds });
            setName("");
            setPokemonIdsInput("");
            // Recarrega primeira página para mostrar equipa recém-criada.
            await load(1);
        } catch {
            setError("Não foi possível criar equipa.");
        }
    }

    /**
     * Remove equipa e recarrega página atual.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async function handleDelete(id) {
        try {
            await removeTeam(id);
            await load(page);
        } catch {
            setError("Não foi possível apagar equipa.");
        }
    }

    return (
        <section className="pokedex__results">
            <h2>Equipas</h2>

            <form onSubmit={handleCreate}>
                <label>
                    Nome da equipa
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    IDs Pokémon (separados por vírgula)
                    <input
                        value={pokemonIdsInput}
                        onChange={(e) => setPokemonIdsInput(e.target.value)}
                        placeholder="1, 4, 7"
                        required
                    />
                </label>
                <button type="submit">Criar equipa</button>
            </form>

            <label>
                Pesquisar por nome
                <input value={q} onChange={(e) => setQ(e.target.value)} />
            </label>

            {loading && <p>A carregar...</p>}
            {error && <p className="pokedex__empty">{error}</p>}

            {!loading && !error && (
                <>
                    <p>Total: {total}</p>
                    <ul>
                        {items.map((team) => (
                            <li key={team._id}>
                                <strong>{team.name}</strong> - [
                                {team.pokemonIds.join(", ")}]
                                <button
                                    type="button"
                                    onClick={() => handleDelete(team._id)}
                                >
                                    Apagar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => load(page - 1)}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {page} de {pages}
                        </span>
                        <button
                            type="button"
                            disabled={page >= pages}
                            onClick={() => load(page + 1)}
                        >
                            Seguinte
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default TeamsPage;
