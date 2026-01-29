import Section from "../components/Section.jsx";

const mapa = [
    {
        id: "root",
        titulo: "index.html",
        detalhe: "Tem o div com id root para o React.",
    },
    {
        id: "main",
        titulo: "main.jsx",
        detalhe: "Cria a raiz e renderiza <App />.",
    },
    {
        id: "app",
        titulo: "App.jsx",
        detalhe: "Componente principal da página.",
    },
];

const fluxo = [
    "O browser carrega o index.html",
    "main.jsx monta a raiz React",
    "App.jsx devolve o JSX da UI",
];

const comandos = ["npm create vite@latest", "npm install", "npm run dev"];

/**
 * Secção de fundamentos e setup.
 * Explica o fluxo index.html -> main.jsx -> App.jsx e mostra comandos base.
 * Conceito: renderização de listas com map e noção de ponto de entrada.
 */
function Fundamentos() {
    const rootId = "root";
    const exemplo = `createRoot(document.getElementById("${rootId}")).render(<App />);`;

    return (
        <Section
            step={1}
            title="Fundamentos e setup"
            subtitle="Do index.html ao App: o caminho até ao ecrã."
            accent="#d3562a"
        >
            <div className="panel panel--split">
                <div className="card">
                    <h3 className="card__title">Fluxo até ao ecrã</h3>
                    <ul className="bullet-list">
                        {fluxo.map((passo) => (
                            <li key={passo}>
                                <span className="bullet-dot" />
                                {passo}
                            </li>
                        ))}
                    </ul>
                    <div className="preview">Exemplo: {exemplo}</div>
                </div>
                <div>
                    <h3 className="panel__title">Comandos essenciais</h3>
                    <ul className="bullet-list">
                        {comandos.map((comando) => (
                            <li key={comando}>
                                <span className="bullet-dot" />
                                {comando}
                            </li>
                        ))}
                    </ul>
                    <p className="panel__text">
                        O React só precisa de um #root para começar a desenhar.
                    </p>
                </div>
            </div>
            <div className="panel panel--grid">
                {mapa.map((item) => (
                    <div className="mini-card" key={item.id}>
                        <p className="mini-card__title">{item.titulo}</p>
                        <p className="mini-card__value">{item.detalhe}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

export default Fundamentos;
