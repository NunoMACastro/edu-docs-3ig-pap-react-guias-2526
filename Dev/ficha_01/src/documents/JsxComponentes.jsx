function JsxComponentes() {
  const nome = "Rita";
  const pontos = 8;
  const estaLogado = true;

  const saudacao = `Olá, ${nome}`;
  const nivel = pontos >= 10 ? "Nível avançado" : "Nível inicial";

  return (
    <div className="panel">
      <div className="panel__row">
        <div className="mini-card">
          <p className="mini-card__title">Expressão em JSX</p>
          <p>{saudacao}</p>
          <p>2 + 3 = {2 + 3}</p>
        </div>
        <div className="mini-card">
          <p className="mini-card__title">Condição simples</p>
          <p>{estaLogado ? "Conta ativa" : "Visitante"}</p>
          <p>{nivel}</p>
        </div>
      </div>
      <div className="note">
        JSX aceita expressões com chaves. Para estilos, usa style como
        objeto e atributos como className.
      </div>
    </div>
  );
}

export default JsxComponentes;