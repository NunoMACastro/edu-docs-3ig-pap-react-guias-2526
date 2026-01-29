function Fundamentos() {
  return (
    <div className="panel">
      <p>
        React é uma biblioteca para descrever a interface. Em vez de
        dizer ao browser cada passo, descreves o estado final e o React
        atualiza o DOM.
      </p>
      <div className="panel__row">
        <div className="mini-card">
          <p className="mini-card__title">Estrutura base</p>
          <ul>
            <li>index.html contém o div com id root.</li>
            <li>main.jsx liga o React ao root.</li>
            <li>App.jsx é o componente principal.</li>
          </ul>
        </div>
        <div className="mini-card">
          <p className="mini-card__title">Setup rápido</p>
          <ol>
            <li>npm install</li>
            <li>npm run dev</li>
            <li>editar src/App.jsx</li>
          </ol>
        </div>
      </div>
      <div className="note">
        Dica: muda pequenos textos e observa o recarregamento
        automático.
      </div>
    </div>
  );
}

export default Fundamentos;