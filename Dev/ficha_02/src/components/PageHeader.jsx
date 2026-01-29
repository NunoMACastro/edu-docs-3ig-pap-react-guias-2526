const chips = [
    "Fundamentos",
    "JSX",
    "Props",
    "Estado",
    "Listas",
    "Formulários",
    "Async",
    "useEffect",
    "Guilherme não copies!",
];

/**
 * Cabeçalho principal da página.
 * Mostra o título, objetivos e tags dos temas da ficha.
 * Conceito: renderização de listas com map (chips).
 */
function PageHeader() {
    return (
        <header className="hero">
            <div>
                <p className="hero__eyebrow">React 18 - Ficha 02</p>
                <h1 className="hero__title">O belo do React</h1>
                <p className="hero__lead">
                    Cada área aplica um conceito com exemplos pequenos, interações e dados locais.
                </p>
                <div className="hero__chips">
                    {chips.map((chip) => (
                        <span className="chip" key={chip}>
                            {chip}
                        </span>
                    ))}
                </div>
            </div>
            <div className="hero__card">
                <h2>Objetivo da ficha</h2>
                <ul className="hero__list">
                    <li>
                        <span className="hero__dot" />
                        Perceber os fundamentos do React
                    </li>
                    <li>
                        <span className="hero__dot" />
                        Perceber os conceitos básicos de JSX, props e estado
                    </li>
                    <li>
                        <span className="hero__dot" />
                        Praticar listas, formulários e async
                    </li>
                    <li>
                        <span className="hero__dot" />
                        Usar useEffect para dados externos
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default PageHeader;
