function InfoCard({ titulo, nivel, horas, tags, children }) {
  return (
    <article className="info-card">
      <div>
        <span className="pill">{nivel}</span>
        <h3>{titulo}</h3>
        <p className="info-card__meta">Carga: {horas} horas</p>
      </div>
      <div className="info-card__tags">
        {tags.map((tag) => (
          <span className="pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="info-card__body">{children}</div>
    </article>
  );
}

export default InfoCard;