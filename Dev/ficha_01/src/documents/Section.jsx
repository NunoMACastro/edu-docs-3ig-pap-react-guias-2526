function Section({ step, title, subtitle, children }) {
  return (
    <section className="section" style={{ "--delay": `${step * 90}ms` }}>
      <div className="section__header">
        <span className="section__step">Passo {step}</span>
        <h2>{title}</h2>
        <p className="section__subtitle">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default Section;