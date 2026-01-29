import Section from "../components/Section.jsx";

const trilhos = [
    {
        id: 1,
        nome: "Frontend",
        horas: 12,
        nivel: "Base",
        ativo: true,
        detalhes: { sala: "B2", turma: "12A" },
        tags: ["JSX", "Componentes", "UI"],
    },
    {
        id: 2,
        nome: "Lógica",
        horas: 10,
        nivel: "Intermédio",
        ativo: true,
        detalhes: { sala: "B3", turma: "12B" },
        tags: ["Props", "Estado", "Eventos"],
    },
    {
        id: 3,
        nome: "Projeto",
        horas: 14,
        nivel: "Avançado",
        ativo: false,
        detalhes: { sala: "Lab 1", turma: "12C" },
        tags: ["Listas", "Formulários", "Async"],
    },
];

/**
 * Card de curso para demonstrar props com vários tipos.
 * @param {object} props
 * @param {string} props.nome - Nome do trilho.
 * @param {number} props.horas - Carga horária.
 * @param {string} props.nivel - Nível do trilho.
 * @param {boolean} props.ativo - Indica se há inscrições.
 * @param {{sala: string, turma: string}} props.detalhes - Dados extra.
 * @param {string[]} props.tags - Lista de tags.
 * @param {*} props.children - Conteúdo extra inserido pelo componente pai.
 */
function CursoCard({ nome, horas, nivel, ativo, detalhes, tags, children }) {
    const style = ativo ? { borderColor: "#2f6f7e" } : { opacity: 0.75 };
    const resumo = `Sala ${detalhes.sala} | Turma ${detalhes.turma}`;

    return (
        <article className="card" style={style}>
            <h3 className="card__title">{nome}</h3>
            <p className="card__meta">
                {horas} horas - Nível {nivel}
            </p>
            <p className="panel__text">
                Estado: {ativo ? "Inscrições abertas" : "Em pausa"}
            </p>
            <p className="panel__text">{resumo}</p>
            <div className="badge-row">
                {tags.map((tag) => (
                    <span className="badge" key={tag}>
                        {tag}
                    </span>
                ))}
            </div>
            {children}
        </article>
    );
}

/**
 * Secção de props e composição.
 * Mostra props com números, booleanos, objetos, arrays e children.
 * Conceito: o pai passa dados e o filho só usa para renderizar.
 */
function PropsComposicao() {
    return (
        <Section
            step={3}
            title="Props e composição"
            subtitle="Props são entradas e o children encaixa conteúdo extra."
            accent="#f0b429"
        >
            <div className="panel panel--grid">
                {trilhos.map((trilho) => {
                    const snippet = `<CursoCard nome="${trilho.nome}" horas={${trilho.horas}} />`;

                    return (
                        <CursoCard key={trilho.id} {...trilho}>
                            <div className="preview">
                                Exemplo rápido: {snippet}
                            </div>
                        </CursoCard>
                    );
                })}
            </div>
        </Section>
    );
}

export default PropsComposicao;
