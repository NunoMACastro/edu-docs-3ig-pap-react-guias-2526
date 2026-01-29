import InfoCard from "./InfoCard.jsx";

function PropsComposicao() {
  const dados = {
    titulo: "Módulo de React",
    nivel: "Intermédio",
    horas: 12,
    tags: ["JSX", "Props", "Componentes"],
  };

  return (
    <div className="panel panel--split">
      <InfoCard
        titulo={dados.titulo}
        nivel={dados.nivel}
        horas={dados.horas}
        tags={dados.tags}
      >
        <p>
          As props são entradas do componente. Podes passar texto,
          números, booleanos, arrays e funções. Aqui, o conteúdo
          dentro do componente é recebido em children.
        </p>
      </InfoCard>
      <div>
        <h3>Exemplo de conteúdo</h3>
        <ul>
          <li>Texto e número simples</li>
          <li>Array com map</li>
          <li>Key correta em listas</li>
          <li>Uso de children</li>
        </ul>
      </div>
    </div>
  );
}

export default PropsComposicao;