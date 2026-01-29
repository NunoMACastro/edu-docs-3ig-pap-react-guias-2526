import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function incrementar() {
    setCount((prev) => prev + 1);
  }

  function reduzir() {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  }

  function reset() {
    setCount(0);
  }

  return (
    <div className="counter">
      <h3>Estado numérico</h3>
      <p className="counter__value">{count}</p>
      <div className="button-row">
        <button onClick={incrementar}>Somar</button>
        <button className="ghost" onClick={reduzir}>
          Subtrair
        </button>
        <button className="ghost" onClick={reset}>
          Reset
        </button>
      </div>
      <p>
        A atualização usa a forma funcional para evitar erros quando o
        novo valor depende do anterior.
      </p>
    </div>
  );
}

export default Counter;