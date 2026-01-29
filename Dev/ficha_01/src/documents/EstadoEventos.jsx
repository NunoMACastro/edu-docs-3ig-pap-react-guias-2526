import Counter from "./Counter.jsx";
import ToggleNote from "./ToggleNote.jsx";

function EstadoEventos() {
  return (
    <div className="panel panel--split">
      <Counter />
      <ToggleNote />
    </div>
  );
}

export default EstadoEventos;