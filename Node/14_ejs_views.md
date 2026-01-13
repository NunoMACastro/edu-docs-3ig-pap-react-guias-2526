# Node.js (12.º Ano) - 14 · Views com EJS (SSR opcional)

> **Objetivo deste ficheiro**
> Entender o básico do EJS para renderização no servidor.
> Configurar views e layouts no Express.
> Criar rotas de páginas com `res.render`.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é EJS](#sec-1)
-   [2. [ESSENCIAL] Instalar e estruturar views](#sec-2)
-   [3. [ESSENCIAL] Configurar na app](#sec-3)
-   [4. [ESSENCIAL] Router de páginas](#sec-4)
-   [5. [EXTRA] Formulários, CSRF e assets](#sec-5)
-   [Exercícios - EJS](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** configura views e cria uma página.
-   **Como estudar:** começa com `/` e depois adiciona `/todos`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é EJS

### Modelo mental

EJS é um motor de templates para gerar HTML no servidor.

-   `<% código %>`
-   `<%= expr_escapada %>` (seguro por defeito)
-   `<%- expr_sem_escape %>` (usar com cuidado)

### Checkpoint

-   Qual é a diferença entre `<%=` e `<%-`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Instalar e estruturar views

```bash
npm i ejs express-ejs-layouts
```

```
src/
  views/
    layout.ejs
    partials/
      head.ejs
      header.ejs
      footer.ejs
    pages/
      home.ejs
      todos/
        index.ejs
        new.ejs
```

### Checkpoint

-   Onde colocas os ficheiros `.ejs`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Configurar na app

```js
// excerto de src/app.js
import path from "node:path";
import { fileURLToPath } from "node:url";
import expressLayouts from "express-ejs-layouts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

app.use("/static", express.static(path.join(__dirname, "public")));

app.locals.appName = "Minha App";
app.locals.fmtData = (ts) =>
    new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(ts);
```

### Checkpoint

-   Que linha define o motor de templates?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Router de páginas

```js
// src/routes/pages.router.js
import { Router } from "express";
import * as todos from "../services/todos.service.js";

const pages = Router();

pages.get("/", (_req, res) => {
    res.render("pages/home", { titulo: "Bem-vindo", agora: Date.now() });
});

pages.get("/todos", async (_req, res, next) => {
    try {
        const lista = await todos.listar();
        res.render("pages/todos/index", { titulo: "Lista de Tarefas", lista });
    } catch (e) {
        next(e);
    }
});

pages.get("/todos/new", (_req, res) => {
    res.render("pages/todos/new", {
        titulo: "Novo Todo",
        errors: [],
        values: {},
    });
});

pages.post("/todos", async (req, res, next) => {
    try {
        const { titulo } = req.body;
        if (!titulo?.trim()) {
            return res.status(400).render("pages/todos/new", {
                titulo: "Novo Todo",
                errors: [{ message: "Título é obrigatório" }],
                values: { titulo },
            });
        }
        await todos.criar({ titulo });
        res.redirect("/todos");
    } catch (e) {
        next(e);
    }
});

export default pages;
```

### Checkpoint

-   Que método usa o EJS para devolver HTML?

<a id="sec-5"></a>

## 5. [EXTRA] Formulários, CSRF e assets

-   Ativa `express.urlencoded` para ler formulários.
-   Em produção, usa tokens CSRF.
-   Assets vão para `public/` e são servidos com `express.static`.

<a id="exercicios"></a>

## Exercícios - EJS

1. Cria uma página `/about` com `res.render`.
2. Adiciona um botão para marcar um todo como concluído.
3. Mostra uma mensagem de erro quando o título está vazio.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre EJS e SSR.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
