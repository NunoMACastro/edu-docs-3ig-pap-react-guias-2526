import { useState } from "react";
import Section from "../components/Section.jsx";

const temas = ["UI", "API", "Dados"];
const equipasIniciais = [
    { id: 1, nome: "Aurora", pontos: 14, tema: "UI" },
    { id: 2, nome: "Orion", pontos: 18, tema: "API" },
    { id: 3, nome: "Atlas", pontos: 9, tema: "Dados" },
    { id: 4, nome: "Vega", pontos: 22, tema: "UI" },
];

const filtros = ["todas", ...temas];

/**
 * Secção de listas e condicionais.
 * Usa map/filter/sort para mostrar um ranking com filtros.
 * Conceito: a UI muda conforme o estado e as escolhas do utilizador.
 */
function ListasCondicionais() {
    const [equipas, setEquipas] = useState(equipasIniciais);
    const [indiceFiltro, setIndiceFiltro] = useState(0);
    const [ordenarPor, setOrdenarPor] = useState("pontos");
    const [mostrarTop, setMostrarTop] = useState(false);

    const filtroTema = filtros[indiceFiltro];

    /**
     * Simula uma ronda com variação aleatória de pontos.
     * Conceito: map cria uma nova lista sem alterar a original.
     */
    function simularRonda() {
        setEquipas((prev) =>
            prev.map((equipa) => {
                const variacao = Math.floor(Math.random() * 7) - 2;
                return {
                    ...equipa,
                    pontos: Math.max(0, equipa.pontos + variacao),
                };
            })
        );
    }

    /**
     * Restaura o ranking para o estado inicial.
     */
    function resetar() {
        setEquipas(equipasIniciais);
    }

    /**
     * Alterna o filtro de tema (todas -> UI -> API -> Dados).
     */
    function proximoFiltro() {
        setIndiceFiltro((prev) => (prev + 1) % filtros.length);
    }

    /**
     * Alterna a ordenação entre pontos e nome.
     */
    function alternarOrdem() {
        setOrdenarPor((prev) => (prev === "pontos" ? "nome" : "pontos"));
    }

    const filtradas =
        filtroTema === "todas"
            ? equipas
            : equipas.filter((equipa) => equipa.tema === filtroTema);

    const ordenadas = [...filtradas].sort((a, b) =>
        ordenarPor === "pontos"
            ? b.pontos - a.pontos
            : a.nome.localeCompare(b.nome)
    );

    const visiveis = mostrarTop ? ordenadas.slice(0, 3) : ordenadas;

    return (
        <Section
            step={5}
            title="Listas e condicionais"
            subtitle="Ranking de equipas com filtros e ordenação."
            accent="#2f6f7e"
        >
            <div className="panel">
                <div className="button-row">
                    <button onClick={simularRonda}>Simular ronda</button>
                    <button className="ghost" onClick={proximoFiltro}>
                        Filtro: {filtroTema}
                    </button>
                    <button className="ghost" onClick={alternarOrdem}>
                        Ordenar por {ordenarPor === "pontos" ? "nome" : "pontos"}
                    </button>
                    <button
                        className="ghost"
                        onClick={() => setMostrarTop((prev) => !prev)}
                    >
                        {mostrarTop ? "Mostrar todas" : "Mostrar top 3"}
                    </button>
                    <button className="ghost" onClick={resetar}>
                        Reset
                    </button>
                </div>
                {filtroTema !== "todas" && (
                    <p className="note">Filtro ativo: {filtroTema}.</p>
                )}
                {visiveis.length === 0 ? (
                    <p className="empty">Sem equipas para mostrar.</p>
                ) : (
                    <ul className="task-list">
                        {visiveis.map((equipa, index) => (
                            <li key={equipa.id} className="task-item">
                                <span>
                                    {index + 1}. {equipa.nome}
                                </span>
                                <div className="button-row">
                                    <span className="tag">{equipa.tema}</span>
                                    <span className="tag">
                                        {equipa.pontos} pts
                                    </span>
                                    {equipa.pontos >= 20 && (
                                        <span className="tag">Destaque</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Section>
    );
}

export default ListasCondicionais;
