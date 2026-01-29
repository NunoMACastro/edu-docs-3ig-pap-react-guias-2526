import PageHeader from "./components/PageHeader.jsx";
import Fundamentos from "./sections/Fundamentos.jsx";
import JsxComponentes from "./sections/JsxComponentes.jsx";
import PropsComposicao from "./sections/PropsComposicao.jsx";
import EstadoEventos from "./sections/EstadoEventos.jsx";
import ListasCondicionais from "./sections/ListasCondicionais.jsx";
import FormulariosControlados from "./sections/FormulariosControlados.jsx";
import AsyncBasico from "./sections/AsyncBasico.jsx";
import UseEffectDados from "./sections/UseEffectDados.jsx";

/**
 * Componente raiz da aplicação.
 * Monta o cabeçalho e organiza todas as secções da ficha.
 * Conceito: composição de componentes (App junta blocos menores).
 */
function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Fundamentos />
                <JsxComponentes />
                <PropsComposicao />
                <EstadoEventos />
                <ListasCondicionais />
                <FormulariosControlados />
                <AsyncBasico />
                <UseEffectDados />
            </main>
            <footer className="footer">
                Ficha 02 React - Usa os botões para explorar cada conceito.
            </footer>
        </div>
    );
}

export default App;
