import { useEffect, useState } from "react";
import Section from "../components/Section.jsx";

/**
 * Secção de useEffect e dados externos.
 * Conceito: efeitos correm depois do render para buscar dados.
 */
function UseEffectDados() {
    const [estado, setEstado] = useState("idle");
    const [itens, setItens] = useState([]);
    const [filtro, setFiltro] = useState("todos");

    /**
     * Faz o fetch dos dados e atualiza loading/erro.
     * Conceito: async/await com try/catch.
     */
    async function carregar() {
        setEstado("loading");

        try {
            const response = await fetch("/mini-data.json");
            if (!response.ok) {
                throw new Error("Erro a carregar dados");
            }
            const data = await response.json();
            setItens(data);
            setEstado("ready");
        } catch {
            setEstado("error");
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const itensFiltrados =
        filtro === "todos"
            ? itens
            : itens.filter((item) => item.categoria === filtro);

    useEffect(() => {
        if (estado === "ready") {
            const total = itensFiltrados.length;
            document.title = `React Ficha 02 - ${total} temas`;
        }
    }, [estado, filtro, itensFiltrados.length]);

    return (
        <Section
            step={8}
            title="useEffect e dados externos"
            subtitle="Efeitos correm depois do render e podem buscar dados."
            accent="#d3562a"
        >
            <div className="panel">
                <div className="button-row">
                    <button onClick={carregar}>Recarregar dados</button>
                    <select
                        value={filtro}
                        onChange={(event) => setFiltro(event.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="jsx">JSX</option>
                        <option value="props">Props</option>
                        <option value="estado">Estado</option>
                        <option value="listas">Listas</option>
                        <option value="forms">Formulários</option>
                        <option value="hooks">Hooks</option>
                    </select>
                </div>
                {estado === "loading" && (
                    <p className="status">A carregar dados...</p>
                )}
                {estado === "error" && (
                    <p className="form__error">
                        Não foi possível carregar os dados.
                    </p>
                )}
                {estado === "ready" && (
                    <div className="data-grid">
                        {itensFiltrados.map((item) => (
                            <div className="data-card" key={item.id}>
                                <h3 className="data-card__title">
                                    {item.tema}
                                </h3>
                                <p className="card__meta">
                                    Categoria: {item.categoria}
                                </p>
                                <p className="card__meta">
                                    Tempo: {item.tempo}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

export default UseEffectDados;
