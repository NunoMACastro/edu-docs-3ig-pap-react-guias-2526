import Section from "../components/Section.jsx";

const regras = [
    { id: 1, titulo: "Elemento pai", exemplo: "<section>...</section>" },
    { id: 2, titulo: "className", exemplo: 'className="card"' },
    { id: 3, titulo: "htmlFor", exemplo: '<label htmlFor="nome" />' },
    { id: 4, titulo: "style em objeto", exemplo: 'style={{ color: "#2f6f7e" }}' },
];

const etiquetas = ["fragment", "camelCase", "data-*", "props"];

/**
 * Card simples para mostrar uma regra do JSX.
 * @param {object} props
 * @param {string} props.titulo - Nome da regra.
 * @param {string} props.exemplo - Exemplo curto de sintaxe.
 */
function RegraCard({ titulo, exemplo }) {
    return (
        <div className="mini-card">
            <p className="mini-card__title">{titulo}</p>
            <p className="mini-card__value">{exemplo}</p>
        </div>
    );
}

/**
 * Secção sobre JSX e componentes.
 * Mostra expressões, fragmentos e estilos inline sem complicar.
 * Conceito: JSX é JavaScript, por isso aceita variáveis e expressões.
 */
function JsxComponentes() {
    const turma = "12A";
    const sala = "Lab 2";
    const vagas = 18;
    const aberto = vagas <= 20;
    const estadoStyle = {
        color: aberto ? "#2f6f7e" : "#d3562a",
        fontWeight: 600,
    };

    const cabecalho = (
        <>
            <h3 className="card__title">Aula JSX</h3>
            <p className="card__meta">
                Turma {turma} - Sala {sala}
            </p>
        </>
    );

    return (
        <Section
            step={2}
            title="JSX e componentes"
            subtitle="JSX mistura HTML com JavaScript para compor a UI."
            accent="#2f6f7e"
        >
            <div className="panel panel--split">
                <div className="card" data-turma={turma}>
                    {cabecalho}
                    <p className="panel__text">Vagas: {vagas}</p>
                    <p className="panel__text">
                        Estado: <span style={estadoStyle}>{aberto ? "Aberto" : "Lotado"}</span>
                    </p>
                    <div className="badge-row">
                        {etiquetas.map((tag) => (
                            <span className="badge" key={tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="form__help">
                        JSX permite fragmentos e expressar dados no return.
                    </p>
                </div>
                <div>
                    <h3 className="panel__title">Regras em 4 blocos</h3>
                    <div className="panel panel--grid">
                        {regras.map((regra) => (
                            <RegraCard
                                key={regra.id}
                                titulo={regra.titulo}
                                exemplo={regra.exemplo}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}

export default JsxComponentes;
