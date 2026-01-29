import { useState } from "react";
import Section from "../components/Section.jsx";

/**
 * Secção de formulários controlados.
 * Conceito: o estado é a fonte de verdade de cada input.
 */
function FormulariosControlados() {
    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("web");
    const [objetivo, setObjetivo] = useState("");
    const [aceito, setAceito] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    /**
     * Valida o formulário e mostra mensagens de erro/sucesso.
     * Conceito: onSubmit permite controlar o envio e evitar recarregar a página.
     * @param {Event} event
     */
    function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setSucesso("");

        if (nome.trim().length < 3) {
            setErro("Escreve um nome com pelo menos 3 letras.");
            return;
        }

        if (!aceito) {
            setErro("Precisas aceitar os termos para continuar.");
            return;
        }

        setSucesso("Formulário validado. Dados prontos para enviar!");
    }

    return (
        <Section
            step={6}
            title="Formulários controlados"
            subtitle="O estado é a fonte de verdade de cada input."
            accent="#f0b429"
        >
            <div className="panel panel--split">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__row">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Escreve o teu nome"
                        />
                        <span className="form__help">
                            Inputs controlados usam value + onChange.
                        </span>
                    </div>
                    <div className="form__row">
                        <label htmlFor="curso">Curso</label>
                        <select
                            id="curso"
                            value={curso}
                            onChange={(event) => setCurso(event.target.value)}
                        >
                            <option value="web">Técnico de Programação</option>
                            <option value="redes">Técnico de Redes</option>
                            <option value="design">Técnico de Design</option>
                        </select>
                    </div>
                    <div className="form__row">
                        <label htmlFor="objetivo">Objetivo da aula</label>
                        <textarea
                            id="objetivo"
                            value={objetivo}
                            onChange={(event) =>
                                setObjetivo(event.target.value)
                            }
                            placeholder="Quero praticar componentes..."
                        />
                    </div>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={aceito}
                            onChange={(event) =>
                                setAceito(event.target.checked)
                            }
                        />
                        Aceito os termos da turma
                    </label>
                    {erro && <p className="form__error">{erro}</p>}
                    {sucesso && <p className="form__success">{sucesso}</p>}
                    <button type="submit">Validar formulário</button>
                </form>
                <div className="preview">
                    <strong>Preview em tempo real</strong>
                    <p>Nome: {nome || "(vazio)"}</p>
                    <p>Curso: {curso}</p>
                    <p>Objetivo: {objetivo || "(sem objetivo)"}</p>
                    <p>Termos: {aceito ? "Aceites" : "Pendentes"}</p>
                </div>
            </div>
        </Section>
    );
}

export default FormulariosControlados;
