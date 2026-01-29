/**
 * Componente de layout para cada passo da ficha.
 * Usa props para configurar título/subtítulo e children para o conteúdo interno.
 * @param {object} props
 * @param {number} props.step - Número do passo.
 * @param {string} props.title - Título da secção.
 * @param {string} props.subtitle - Subtítulo explicativo.
 * @param {string} props.accent - Cor usada no destaque do passo.
 * @param {*} props.children - Conteúdo inserido dentro da secção.
 */
function Section({ step, title, subtitle, accent, children }) {
    const sectionStyle = {
        "--delay": `${step * 120}ms`,
        "--section-accent": accent,
    };

    return (
        <section className="section" style={sectionStyle}>
            <div className="section__header">
                <span className="section__step">Passo {step}</span>
                <h2 className="section__title">{title}</h2>
                <p className="section__subtitle">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

export default Section;
