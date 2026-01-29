import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";
import Fundamentos from "./documents/Fundamentos.jsx";
import JsxComponentes from "./documents/JsxComponentes.jsx";
import PropsComposicao from "./documents/PropsComposicao.jsx";
import EstadoEventos from "./documents/EstadoEventos.jsx";
import ListasCondicionais from "./documents/ListasCondicionais.jsx";

function App() {
  return (
    <div className="page">
      <PageHeader />
      <main className="content">
        <Section
          step={1}
          title="Fundamentos e setup"
          subtitle="O que e React, porque o JSX ajuda e como o projeto liga ao root."
        >
          <Fundamentos />
        </Section>
        <Section
          step={2}
          title="JSX e componentes"
          subtitle="Regras do JSX, expressao dinamica e pequenos blocos visuais."
        >
          <JsxComponentes />
        </Section>
        <Section
          step={3}
          title="Props e composicao"
          subtitle="Entradas do componente, tipos de props e uso de children."
        >
          <PropsComposicao />
        </Section>
        <Section
          step={4}
          title="Estado e eventos"
          subtitle="useState, handlers e atualizacao segura do estado."
        >
          <EstadoEventos />
        </Section>
        <Section
          step={5}
          title="Listas e condicionais"
          subtitle="map com key, mensagens para lista vazia e filtros simples."
        >
          <ListasCondicionais />
        </Section>
      </main>
    </div>
  );
}

export default App;
