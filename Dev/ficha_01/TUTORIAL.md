# Tutorial passo a passo - React Primeiros Passos (12.º ano)

Este tutorial explica, do início ao fim, como criar o projeto **react-primeiros-passos**.
O objetivo é treinar os **5 primeiros temas de React** de forma gradual, com exemplos simples e claros.

> Tudo será feito com **React + Vite**. O projeto é só frontend.

---

## 0) O que vais construir

Uma página com 5 secções, cada uma mostrando um tema:

1. Fundamentos e setup
2. JSX e componentes
3. Props e composição
4. Estado e eventos
5. Listas e condicionais

Cada secção terá exemplos pequenos para veres o resultado no browser.
Todos os componentes ficam em `src/documents`, exceto o `App.jsx`, que fica em `src`.

---

## 1) Pré-requisitos

Antes de começar, confirma que tens:

-   Node.js (versão 18 ou superior)
-   npm (vem com o Node)
-   Um editor de código (VS Code, por exemplo)
-   Terminal aberto na pasta `Temp`

Para confirmar Node e npm:

```bash
node -v
npm -v
```

Se estes comandos não funcionarem, instala o Node e tenta de novo.

---

## 2) Criar o projeto base com Vite

1. No terminal, entra na pasta `Temp`.
2. Cria o projeto com Vite:

```bash
npm create vite@latest react-primeiros-passos -- --template react
```

3. Entra na pasta:

```bash
cd react-primeiros-passos
```

4. Instala dependências:

```bash
npm install
```

5. Abre a pasta no editor de código.

> Se a pasta já existir, usa outro nome (ex: `react-primeiros-passos-2`).

---

## 3) Limpeza inicial do projeto

O Vite cria ficheiros de exemplo. Vamos simplificar.

1. Apaga o ficheiro `src/App.jsx` (vamos criar outro).
2. Apaga o ficheiro `src/App.css` (não vamos usar).
3. Mantém o `src/main.jsx`, mas vamos editar.

> Não apagues `index.html` nem `package.json`.

---

## 4) Criar a pasta de componentes

Dentro de `src`, cria a pasta `documents`.

No terminal, dentro do projeto:

```bash
mkdir -p src/documents
```

Todos os componentes do projeto vão viver aqui, exceto o `App.jsx`, que fica em `src`.

---

## 5) Configurar o ponto de entrada (main.jsx)

Edita `src/main.jsx` para ligar o React ao componente `App` que vai estar em `src`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

O que isto faz:

-   Liga o React ao `div#root` do `index.html`.
-   Importa o nosso componente principal `App`.
-   Carrega os estilos globais.

> O ReactDOM é um módulo que permite interagir com o DOM do browser. Normalmente instalamos via npm, mas o Vite já trata disso.
> O createRoot prepara o React para controlar o conteúdo do `div#root`.
> Se abrirem o `index.html` vão ver que só tem um `div` vazio com id `root`. Esse é o ponto onde o React vai inserir a nossa aplicação.
> Aqui criamos a raiz do React e dizemos para renderizar o componente `App` dentro do `div#root`.

---

## 6) Criar o ficheiro de estilos base

Cria `src/styles.css` com um estilo simples mas agradável.
Isto ajuda os alunos a verem o layout e as secções com clareza.

```css
:root {
    --bg: #f3efe6;
    --surface: #fffaf3;
    --ink: #1f1b16;
    --muted: #5b5349;
    --accent: #d77c2f;
    --accent-strong: #b45a13;
    --line: #e2d6c7;
    --shadow: 0 18px 40px -30px rgba(31, 27, 22, 0.6);
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
    color: var(--ink);
    background: radial-gradient(
        circle at 10% 10%,
        #f8e7cf,
        #f3efe6 50%,
        #e6ece6 100%
    );
}

.page {
    min-height: 100vh;
    padding: 48px 20px 80px;
}

.hero {
    max-width: 960px;
    margin: 0 auto 36px;
    padding: 28px 32px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 24px;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
}

.hero::after {
    content: "";
    position: absolute;
    inset: auto -20% -40% auto;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(215, 124, 47, 0.12);
}

.hero__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.72rem;
    color: var(--muted);
    margin: 0 0 12px;
}

.hero h1 {
    font-size: clamp(2rem, 3vw, 3rem);
    margin: 0 0 12px;
}

.hero p {
    margin: 0 0 18px;
    color: var(--muted);
    max-width: 70ch;
}

.hero__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(215, 124, 47, 0.1);
    color: var(--accent-strong);
    font-size: 0.85rem;
}

.content {
    max-width: 980px;
    margin: 0 auto;
    display: grid;
    gap: 28px;
}

.section {
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 24px 26px 28px;
    background: var(--surface);
    box-shadow: var(--shadow);
    animation: rise 0.6s ease both;
    animation-delay: var(--delay, 0ms);
}

.section__header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
}

.section__step {
    font-size: 0.9rem;
    color: var(--accent-strong);
    font-weight: 600;
}

.section h2 {
    margin: 0;
}

.section__subtitle {
    margin: 0;
    color: var(--muted);
}

.panel {
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 18px;
    background: #fffdf8;
    display: grid;
    gap: 16px;
}

.panel--split {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    align-items: start;
}

.panel__row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.mini-card {
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: #ffffff;
}

.mini-card__title {
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0 0 8px;
}

.info-card {
    border-radius: 18px;
    border: 1px solid var(--line);
    padding: 18px;
    background: #ffffff;
    display: grid;
    gap: 12px;
}

.info-card h3 {
    margin: 6px 0 4px;
}

.info-card__meta {
    color: var(--muted);
    margin: 0;
}

.info-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.info-card__body {
    color: var(--muted);
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

button {
    border: 1px solid var(--accent-strong);
    background: var(--accent);
    color: #fff;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
}

button:hover {
    transform: translateY(-1px);
    background: var(--accent-strong);
}

button.ghost {
    background: transparent;
    color: var(--accent-strong);
}

.counter {
    display: grid;
    gap: 10px;
    align-items: start;
}

.counter__value {
    font-size: 2rem;
    margin: 0;
}

.note {
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(215, 124, 47, 0.08);
    color: var(--accent-strong);
}

.task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
}

.task-item {
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
}

.task-item.done {
    opacity: 0.7;
}

.tag {
    font-size: 0.8rem;
    color: var(--muted);
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--line);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .hero {
        padding: 22px;
    }

    .section {
        padding: 20px;
    }
}
```

---

## 7) Criar o App base (primeira versão)

Vamos criar o `App` mínimo, só para ver algo a renderizar antes de adicionar componentes.

Cria `src/App.jsx`:

```jsx
function App() {
    return (
        <div className="page">
            <main className="content">
                <h1>Projeto React passo a passo</h1>
                <p>Vamos construir as secções uma a uma.</p>
            </main>
        </div>
    );
}

export default App;
```

Se correres agora, já tens uma página simples.

---

## 8) Componente PageHeader (primeiro componente real)

Cria `src/documents/PageHeader.jsx`:

```jsx
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
```

Agora atualiza `src/App.jsx` para usar o componente:

```jsx
import PageHeader from "./documents/PageHeader.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <p>O resto das secções vão aparecer aqui.</p>
            </main>
        </div>
    );
}

export default App;
```

---

## 9) Componente Section (container reutilizável)

Este componente vai servir de container para cada secção do tutorial. Ou seja, criamos um layout padrão para todas as secções.

Cria `src/documents/Section.jsx`:

```jsx
function Section({ step, title, subtitle, children }) {
    return (
        <section className="section" style={{ "--delay": `${step * 90}ms` }}>
            <div className="section__header">
                <span className="section__step">Passo {step}</span>
                <h2>{title}</h2>
                <p className="section__subtitle">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

export default Section;
```

Atualiza `App.jsx` para usar a primeira `Section`, mesmo com texto provisório.
Assim consegues ver o layout antes de criar o conteúdo.

```jsx
import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Section
                    step={1}
                    title="Fundamentos e setup"
                    subtitle="O que é React?"
                >
                    <p>Em breve vamos criar o componente Fundamentos.</p>
                </Section>
            </main>
        </div>
    );
}

export default App;
```

Aqui já vês **props** (`step`, `title`, `subtitle`) e **children** (o conteúdo dentro da tag).

---

## 10) Secção 1 - Fundamentos e setup

Cria `src/documents/Fundamentos.jsx`:

```jsx
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
```

Agora substitui o texto provisório no `App.jsx` por `<Fundamentos />`.
Repara que o componente `Fundamentos` já fica dentro do componente `Section`! Ou seja, é filho.

```jsx
import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";
import Fundamentos from "./documents/Fundamentos.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Section
                    step={1}
                    title="Fundamentos e setup"
                    subtitle="O que é React, porque o JSX ajuda e como o projeto liga ao root."
                >
                    <Fundamentos />
                </Section>
            </main>
        </div>
    );
}

export default App;
```

Pontos pedagógicos:

-   Estrutura do projeto
-   Onde se mexe no código
-   Como ver mudanças no browser

---

## 11) Secção 2 - JSX e componentes

Cria `src/documents/JsxComponentes.jsx`:

```jsx
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
```

Agora adiciona a segunda secção ao `App.jsx`:

```jsx
import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";
import Fundamentos from "./documents/Fundamentos.jsx";
import JsxComponentes from "./documents/JsxComponentes.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Section
                    step={1}
                    title="Fundamentos e setup"
                    subtitle="O que é React, porque o JSX ajuda e como o projeto liga ao root."
                >
                    <Fundamentos />
                </Section>
                <Section
                    step={2}
                    title="JSX e componentes"
                    subtitle="Regras do JSX, expressão dinâmica e pequenos blocos visuais."
                >
                    <JsxComponentes />
                </Section>
            </main>
        </div>
    );
}

export default App;
```

O que o aluno aprende aqui:

-   JSX dentro de JavaScript
-   Variáveis em `{}`
-   Ternário para condição simples

---

## 12) Secção 3 - Props e composição

Vamos criar dois componentes: `InfoCard` e `PropsComposicao`.

### 12.1) InfoCard

Cria `src/documents/InfoCard.jsx`:

```jsx
function InfoCard({ titulo, nivel, horas, tags, children }) {
    return (
        <article className="info-card">
            <div>
                <span className="pill">{nivel}</span>
                <h3>{titulo}</h3>
                <p className="info-card__meta">Carga: {horas} horas</p>
            </div>
            <div className="info-card__tags">
                {tags.map((tag) => (
                    <span className="pill" key={tag}>
                        {tag}
                    </span>
                ))}
            </div>
            <div className="info-card__body">{children}</div>
        </article>
    );
}

export default InfoCard;
```

### 12.2) PropsComposicao

Cria `src/documents/PropsComposicao.jsx`:

```jsx
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
                <h3>Checklist de props</h3>
                <ul>
                    <li>Props são só leitura.</li>
                    <li>Props com chaves recebem valores JS.</li>
                    <li>children permite compor blocos.</li>
                </ul>
            </div>
        </div>
    );
}

export default PropsComposicao;
```

Agora adiciona a terceira secção ao `App.jsx`:

```jsx
import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";
import Fundamentos from "./documents/Fundamentos.jsx";
import JsxComponentes from "./documents/JsxComponentes.jsx";
import PropsComposicao from "./documents/PropsComposicao.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Section
                    step={1}
                    title="Fundamentos e setup"
                    subtitle="O que é React, porque o JSX ajuda e como o projeto liga ao root."
                >
                    <Fundamentos />
                </Section>
                <Section
                    step={2}
                    title="JSX e componentes"
                    subtitle="Regras do JSX, expressão dinâmica e pequenos blocos visuais."
                >
                    <JsxComponentes />
                </Section>
                <Section
                    step={3}
                    title="Props e composição"
                    subtitle="Entradas do componente, tipos de props e uso de children."
                >
                    <PropsComposicao />
                </Section>
            </main>
        </div>
    );
}

export default App;
```

Aqui praticas:

-   Props simples (texto e número)
-   Array com `map`
-   `key` correta
-   `children`

---

## 13) Secção 4 - Estado e eventos

Criamos um componente principal e dois exemplos: `Counter` e `ToggleNote`.

### 13.1) EstadoEventos

Cria `src/documents/EstadoEventos.jsx`:

```jsx
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
```

### 13.2) Counter

Cria `src/documents/Counter.jsx`:

```jsx
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
```

### 13.3) ToggleNote

Cria `src/documents/ToggleNote.jsx`:

```jsx
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
```

Agora adiciona a quarta secção ao `App.jsx`:

```jsx
import PageHeader from "./documents/PageHeader.jsx";
import Section from "./documents/Section.jsx";
import Fundamentos from "./documents/Fundamentos.jsx";
import JsxComponentes from "./documents/JsxComponentes.jsx";
import PropsComposicao from "./documents/PropsComposicao.jsx";
import EstadoEventos from "./documents/EstadoEventos.jsx";

function App() {
    return (
        <div className="page">
            <PageHeader />
            <main className="content">
                <Section
                    step={1}
                    title="Fundamentos e setup"
                    subtitle="O que é React, porque o JSX ajuda e como o projeto liga ao root."
                >
                    <Fundamentos />
                </Section>
                <Section
                    step={2}
                    title="JSX e componentes"
                    subtitle="Regras do JSX, expressão dinâmica e pequenos blocos visuais."
                >
                    <JsxComponentes />
                </Section>
                <Section
                    step={3}
                    title="Props e composição"
                    subtitle="Entradas do componente, tipos de props e uso de children."
                >
                    <PropsComposicao />
                </Section>
                <Section
                    step={4}
                    title="Estado e eventos"
                    subtitle="useState, handlers e atualização segura do estado."
                >
                    <EstadoEventos />
                </Section>
            </main>
        </div>
    );
}

export default App;
```

Pontos pedagógicos:

-   `useState`
-   Evento `onClick`
-   Renderização condicional com `&&`

---

## 14) Secção 5 - Listas e condicionais

Cria `src/documents/ListasCondicionais.jsx`:

```jsx
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
                            className={`task-item${
                                tarefa.feito ? " done" : ""
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
```

Por fim, adiciona a quinta secção ao `App.jsx`:

```jsx
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
                    subtitle="O que é React, porque o JSX ajuda e como o projeto liga ao root."
                >
                    <Fundamentos />
                </Section>
                <Section
                    step={2}
                    title="JSX e componentes"
                    subtitle="Regras do JSX, expressão dinâmica e pequenos blocos visuais."
                >
                    <JsxComponentes />
                </Section>
                <Section
                    step={3}
                    title="Props e composição"
                    subtitle="Entradas do componente, tipos de props e uso de children."
                >
                    <PropsComposicao />
                </Section>
                <Section
                    step={4}
                    title="Estado e eventos"
                    subtitle="useState, handlers e atualização segura do estado."
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
```

O que o aluno pratica:

-   `map` para listas
-   `key` com id real
-   `filter` para filtrar dados
-   Condicional ternário para lista vazia

---

## 15) Executar o projeto

1. No terminal, dentro do projeto:

```bash
npm run dev
```

2. Abre o link que o terminal mostrar (por exemplo `http://localhost:5173`).
3. Testa os botões e altera textos para ver o resultado.

---

## 16) Checklist final

Confirma que tens:

-   `index.html` com `<div id="root"></div>`
-   `src/main.jsx` a renderizar `<App />`
-   `src/documents` com os componentes da página
-   `src/styles.css` ligado no `main.jsx`
-   Projeto a correr com `npm run dev`

---

## 17) Exercícios sugeridos (para consolidar)

1. Muda o texto da `PageHeader` para o nome da tua turma.
2. Adiciona mais uma tag em `PropsComposicao`.
3. Cria um novo botão no `Counter` para somar +5.
4. No `ToggleNote`, mostra uma mensagem diferente quando está desligado.
5. No `ListasCondicionais`, adiciona uma nova tarefa manualmente no array inicial.

---

## 18) Dicas finais

-   Faz uma mudança de cada vez e observa o resultado no browser.
-   Usa o console do browser para ver erros.
-   Se algo não aparece, confirma o caminho dos imports.

Fim. Agora tens um projeto completo e didático para os 5 primeiros temas de React.
