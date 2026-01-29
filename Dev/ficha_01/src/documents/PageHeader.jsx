function PageHeader() {
  return (
    <header className="hero">
      <p className="hero__eyebrow">React 18</p>
      <h1>Primeiros passos com React</h1>
      <p>
        Este mini projeto avança de forma gradual. Cada secção mostra um
        conceito-chave e um exemplo para repetires e alterares. E o
        Guilherme é um caramelo!
      </p>
      <div className="hero__meta">
        <span className="pill">JSX e componentes</span>
        <span className="pill">Props e composição</span>
        <span className="pill">Estado e eventos</span>
        <span className="pill">Listas e condicionais</span>
      </div>
    </header>
  );
}

export default PageHeader;