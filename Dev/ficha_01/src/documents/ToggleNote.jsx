import { useState } from "react";

function ToggleNote() {
  const [ativo, setAtivo] = useState(true);

  function alternar() {
    setAtivo((prev) => !prev);
  }

  return (
    <div className="counter">
      <h3>Eventos e booleanos</h3>
      <p>{ativo ? "Estado ligado" : "Estado desligado"}</p>
      {ativo && (
        <div className="note">O React renderiza conforme o estado.</div>
      )}
      <button onClick={alternar}>Alternar</button>
    </div>
  );
}

export default ToggleNote;