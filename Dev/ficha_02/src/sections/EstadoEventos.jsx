import { useState } from "react";
import Section from "../components/Section.jsx";

const ritmos = [
    { id: "foco", label: "Foco", dica: "Trabalho individual e silencioso." },
    { id: "equipa", label: "Equipa", dica: "Atividade em pares ou grupos." },
    { id: "duvidas", label: "Dúvidas", dica: "Tempo para perguntas." },
];

/**
 * Secção de estado e eventos.
 * Usa useState para guardar escolhas e responder a cliques.
 * Conceito: estado muda a UI sem recarregar a página.
 */
function EstadoEventos() {
    const [ritmo, setRitmo] = useState("foco");
    const [energia, setEnergia] = useState(2);
    const ritmoAtivo = ritmos.find((item) => item.id === ritmo);

    /**
     * Aumenta a energia até ao máximo.
     * Conceito: update de estado com função para usar o valor anterior.
     */
    function aumentarEnergia() {
        setEnergia((prev) => Math.min(prev + 1, 5));
    }

    /**
     * Diminui a energia até ao mínimo.
     * Conceito: o estado nunca deve ficar negativo.
     */
    function reduzirEnergia() {
        setEnergia((prev) => Math.max(prev - 1, 0));
    }

    /**
     * Repõe a energia no valor inicial.
     * Conceito: reset é uma atualização direta de estado.
     */
    function resetarEnergia() {
        setEnergia(2);
    }

    const nivelEnergia =
        energia >= 4 ? "Alta" : energia >= 2 ? "Média" : "Baixa";

    return (
        <Section
            step={4}
            title="Estado e eventos"
            subtitle="useState reage a cliques e guarda escolhas do utilizador."
            accent="#d3562a"
        >
            <div className="panel panel--split">
                <div className="card">
                    <h3 className="card__title">Modo da aula</h3>
                    <p className="panel__text">
                        Selecionado: <strong>{ritmoAtivo.label}</strong>
                    </p>
                    <div className="button-row">
                        {ritmos.map((item) => (
                            <button
                                key={item.id}
                                className={
                                    ritmo === item.id ? "alt" : "ghost"
                                }
                                onClick={() => setRitmo(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="note">{ritmoAtivo.dica}</div>
                </div>
                <div className="card">
                    <h3 className="card__title">Medidor de energia</h3>
                    <p className="counter__value">{energia}</p>
                    <p className="panel__text">Nível: {nivelEnergia}</p>
                    <div className="button-row">
                        <button onClick={aumentarEnergia}>Mais energia</button>
                        <button className="ghost" onClick={reduzirEnergia}>
                            Menos energia
                        </button>
                        <button className="ghost" onClick={resetarEnergia}>
                            Reset
                        </button>
                    </div>
                    {energia === 0 && (
                        <p className="form__help">
                            Pausa rápida para recuperar.
                        </p>
                    )}
                </div>
            </div>
        </Section>
    );
}

export default EstadoEventos;
