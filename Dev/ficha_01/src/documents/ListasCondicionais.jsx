import { useState } from "react";

const tarefasIniciais = [
  { id: 1, titulo: "Ler o enunciado", feito: true },
  { id: 2, titulo: "Criar componentes", feito: false },
  { id: 3, titulo: "Rever props", feito: false },
  { id: 4, titulo: "Testar no browser", feito: true },
];

function ListasCondicionais() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [mostrarFeitas, setMostrarFeitas] = useState(true);

  const tarefasVisiveis = mostrarFeitas
    ? tarefas
    : tarefas.filter((tarefa) => !tarefa.feito);

  function limparLista() {
    setTarefas([]);
  }

  function alternarFiltro() {
    setMostrarFeitas((prev) => !prev);
  }

  return (
    <div className="panel">
      <div className="button-row">
        <button onClick={alternarFiltro}>
          {mostrarFeitas ? "Esconder feitas" : "Mostrar todas"}
        </button>
        <button className="ghost" onClick={limparLista}>
          Limpar lista
        </button>
      </div>
      {!mostrarFeitas && (
        <p className="note">
          A lista está filtrada para ver apenas pendentes.
        </p>
      )}
      {tarefasVisiveis.length === 0 ? (
        <p>Nenhuma tarefa para mostrar.</p>
      ) : (
        <ul className="task-list">
          {tarefasVisiveis.map((tarefa) => (
            <li
              key={tarefa.id}
              className={`task-item${tarefa.feito ? " done" : ""
                }`}
            >
              <span>{tarefa.titulo}</span>
              <span className="tag">
                {tarefa.feito ? "Feita" : "Pendente"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListasCondicionais;