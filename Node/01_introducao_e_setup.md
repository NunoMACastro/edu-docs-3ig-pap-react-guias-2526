# Node.js (12.º Ano) - 01 · Introdução e setup de projeto

> **Objetivo deste ficheiro**
> Entender o que é o Node.js e como funciona.
> Conhecer casos de uso e limitações.
> Criar um projeto Node com ES Modules e estrutura base.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é o Node.js](#sec-1)
-   [2. [ESSENCIAL] Porque precisamos de Node](#sec-2)
-   [3. [ESSENCIAL] Como o Node funciona por dentro](#sec-3)
-   [4. [ESSENCIAL] Quando usar ou evitar](#sec-4)
-   [5. [ESSENCIAL] Instalar e manter Node](#sec-5)
-   [6. [ESSENCIAL] Primeiro script](#sec-6)
-   [7. [EXTRA] Glossário rápido](#sec-7)
-   [8. [EXTRA] Arquitetura cliente-servidor aplicada ao Node](#sec-8)
-   [9. [EXTRA] O que é uma API REST](#sec-9)
-   [10. [ESSENCIAL] Criar projeto e instalar dependências](#sec-10)
-   [11. [ESSENCIAL] Scripts no package.json](#sec-11)
-   [12. [ESSENCIAL] .gitignore e pastas base](#sec-12)
-   [13. [ESSENCIAL] Ficheiros iniciais](#sec-13)
-   [14. [EXTRA] Ferramentas de estilo (ESLint/Prettier)](#sec-14)
-   [Exercícios - Introdução e setup](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** começa pela introdução e pelo setup.
-   **Como estudar:** lê, testa comandos e aplica ao teu projeto.
-   **Ligações:** este ficheiro junta a introdução e o setup inicial.

### Próximos passos

-   Continua com `02_modulos_node.md` para dominar ESM.
-   Se o foco for Express, segue para `04_http_vs_express.md` e `06_express_basico.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é o Node.js

### Modelo mental

Node.js é um **runtime JavaScript fora do browser**. Usa o motor **V8** (o mesmo do Chrome) para executar JS diretamente no sistema operativo.

-   **Single-threaded com I/O não bloqueante:** existe um único thread principal, mas operações de disco/rede são delegadas ao sistema (libuv).
-   **Ecossistema npm:** milhões de pacotes para HTTP, autenticação, testes, etc.

### Mini linha temporal

| Ano       | Evento                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------- |
| 2008      | Google lança o motor V8 (rápido, JIT).                                                         |
| 2009      | Ryan Dahl combina V8 + libuv e cria Node.js.                                                   |
| 2010-2014 | Explosão de módulos npm, Express surge como micro-framework.                                   |
| 2015      | Fundação Node.js é criada; LTS passa a ser o standard.                                         |
| Hoje      | Node é usado por gigantes (Netflix, PayPal, NASA) e por escolas para ensinar back-end moderno. |

### Checkpoint

-   O que é o Node.js numa frase?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Porque precisamos de Node

### Modelo mental

Node permite usar **o mesmo idioma no front e no back**, acelera o ensino e ajuda a criar APIs rápidas.

### Pontos chave

-   **Mesmo idioma no front e no back:** partilhas utilitários (validações, modelos de dados).
-   **Tempo de resposta baixo em APIs:** ideal para tarefas I/O (DB, APIs externas).
-   **Ferramentas de build:** Vite, ESLint, Prettier e tooling web vivem em Node.
-   **Comunidade gigante:** é provável que já exista um pacote npm para o teu problema.

### Checkpoint

-   Porque é que Node é bom para APIs I/O‑bound?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Como o Node funciona por dentro

### Modelo mental

Node combina três peças principais:

1. **V8**: compila JS para código máquina (JIT).
2. **Libuv**: gere threads para I/O (rede, ficheiros, timers).
3. **Event loop**: decide o que executar a seguir.

![event loop summary](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_event_loop_diagram.svg/640px-Node.js_event_loop_diagram.svg.png)

> O JS continua single‑threaded, mas o Node usa threads auxiliares para operações demoradas.

### Checkpoint

-   Que componente trata das operações de I/O?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Quando usar ou evitar

### Modelo mental

Node é ótimo para muitas chamadas I/O, mas não é a melhor escolha para tarefas pesadas de CPU.

| Ideal quando…                                                                  | Menos indicado quando…                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| APIs REST leves que fazem muitas chamadas I/O (bases de dados, APIs externas). | Necessitas de operações CPU‑intensivas (renderização 3D, machine learning pesado).    |
| Aplicações em tempo real (chat, notificações, sockets).                        | Precisas de forte tipagem e ferramentas corporativas específicas (Java/Spring, .NET). |
| Ferramentas de build/CLI e automações.                                         | Tens dependências nativas complexas que já existem noutra linguagem.                  |

### Boas práticas

-   Se o problema é CPU‑bound, considera Worker Threads ou outra linguagem.

### Checkpoint

-   Dá um exemplo de uso ideal para Node.

<a id="sec-5"></a>

## 5. [ESSENCIAL] Instalar e manter Node

### Sintaxe base (passo a passo)

-   **Versão recomendada:** LTS (Node 20 LTS ou superior).
-   **Gestores de versão:** `nvm`, `fnm` ou `asdf`.
-   **Verificação:** `node -v`, `npm -v`.
-   **Atualização:** `nvm install --lts` ou site oficial.

### Checkpoint

-   Porque é que se recomenda LTS?

<a id="sec-6"></a>

## 6. [ESSENCIAL] Primeiro script

### Exemplo

```bash
node -e "console.log('Olá Node!')"
```

Ou cria `hello.js`:

```js
console.log("Primeiro script Node");
```

### Checkpoint

-   Que comando executa um ficheiro `.js` em Node?

<a id="sec-7"></a>

## 7. [EXTRA] Glossário rápido

-   **Runtime:** ambiente que executa JavaScript (Node, browser).
-   **Event loop:** orquestrador de tarefas assíncronas.
-   **LTS:** versão com suporte longo, mais estável.
-   **npm:** gestor de pacotes.
-   **npx:** executa comandos de pacotes sem instalação global.
-   **ES Modules (ESM):** sintaxe moderna de `import/export` (padrão do curso).
-   **CommonJS (histórico):** sistema antigo baseado em `require`/`module.exports`.

<a id="sec-8"></a>

## 8. [EXTRA] Arquitetura cliente-servidor aplicada ao Node

### Modelo mental

-   **Cliente:** app que consome a API (browser, mobile, outra API).
-   **Servidor Node:** aplicação Express que responde a pedidos HTTP.
-   **Canal:** HTTP/HTTPS transporta headers e body.

Fluxo típico:

1. O cliente envia `GET https://api.exemplo.com/api/v1/todos`.
2. O Node recebe o pedido e passa por middlewares.
3. O controller chama serviços e repositories.
4. O servidor devolve resposta com `status` e `body` JSON.

### Componentes‑chave

-   **DNS / URL:** traduz `api.exemplo.com` para IP.
-   **Porta:** identifica o serviço (80/443 público, 3000/5173 em dev).
-   **Stateless:** cada pedido traz o que é necessário (token, filtros).

### Demonstração visual

```
Browser (cliente) --HTTP--> Express (servidor) --fs/DB--> Ficheiro/BD
                               |                        ^
                               \------ resposta JSON ----/
```

### Checkpoint

-   O que significa “stateless” numa API?

<a id="sec-9"></a>

## 9. [EXTRA] O que é uma API REST

### Modelo mental

REST é um conjunto de princípios para APIs HTTP previsíveis:

1. **Recursos** representados por URLs (ex.: `/api/v1/todos`).
2. **Métodos HTTP** representam ações (`GET`, `POST`, `PATCH/PUT`, `DELETE`).
3. **Stateless**: cada pedido é independente.

### Exemplo REST com Node/Express

| Método | URL                 | Descrição                         |
| ------ | ------------------- | --------------------------------- |
| GET    | `/api/v1/todos`     | Lista todas as tarefas.           |
| POST   | `/api/v1/todos`     | Cria nova tarefa (body JSON).     |
| GET    | `/api/v1/todos/:id` | Lê uma tarefa específica.         |
| PATCH  | `/api/v1/todos/:id` | Atualiza parcialmente um recurso. |
| DELETE | `/api/v1/todos/:id` | Remove uma tarefa.                |

### Boas práticas

-   Usa códigos HTTP adequados (200, 201, 400, 404, 500).
-   Documenta o formato do JSON de entrada/saída.

### Checkpoint

-   Para que serve o método PATCH?

<a id="sec-10"></a>

## 10. [ESSENCIAL] Criar projeto e instalar dependências

```bash
mkdir api-aula && cd api-aula
npm init -y
npm pkg set type=module
npm i express cors helmet morgan compression
npm i -D nodemon
npm i zod            # opcional (validação)
npm i -D prettier eslint eslint-config-prettier eslint-plugin-import
```

### Porque estes comandos?

-   `npm init -y` cria o `package.json`.
-   `npm pkg set type=module` ativa **ESM** (`import/export`).
-   `npm i` instala dependências de produção.
-   `npm i -D` instala ferramentas de desenvolvimento.

### Checkpoint

-   Porque é que definimos `"type": "module"`?

<a id="sec-11"></a>

## 11. [ESSENCIAL] Scripts no package.json

```json
{
    "name": "api-aula",
    "type": "module",
    "scripts": {
        "dev": "nodemon --env-file .env --watch src --ext js,mjs --exec \"node src/server.js\"",
        "start": "node src/server.js",
        "lint": "eslint .",
        "format": "prettier -w .",
        "test": "vitest --run",
        "test:watch": "vitest"
    }
}
```

### Checkpoint

-   Que script usas para iniciar o servidor em desenvolvimento?

<a id="sec-12"></a>

## 12. [ESSENCIAL] .gitignore e pastas base

### .gitignore

```
node_modules
.env
coverage
dist
```

### Pastas base

```
src/
  app.js
  server.js
  routes/
  controllers/
  services/
  repositories/
  middlewares/
  schemas/
  utils/
  data/
  public/
```

### Checkpoint

-   Porque não se comita o `.env`?

<a id="sec-13"></a>

## 13. [ESSENCIAL] Ficheiros iniciais

-   Cria `src/app.js` e `src/server.js` como em `06_express_basico.md`.
-   Cria `routes/`, `controllers/`, `services/` e `repositories/` como em `07_estrutura_mvc.md`.

### Porque é útil esta estrutura?

-   **`app.js`** configura middlewares, rotas e erros.
-   **`server.js`** apenas faz `listen`.
-   **Routes → Controllers → Services → Repositories** evita misturar responsabilidades.
-   **`middlewares/`** centraliza validação, auth e erros.
-   **`schemas/`** documenta o formato dos dados.
-   **`utils/`** guarda helpers reutilizáveis.
-   **`data/`** serve para JSON em fase didática.
-   **`public/`** fica para ficheiros estáticos.

### Checklist antes de começar a programar

1. Node atualizado (LTS >= 18).
2. `.env` criado (não comitar).
3. Scripts `dev` e `lint` testados.
4. Pastas base criadas.
5. `app.js` e `server.js` separados.

### Checkpoint

-   Porque é que `app` e `server` ficam separados?

<a id="sec-14"></a>

## 14. [EXTRA] Ferramentas de estilo (ESLint/Prettier)

### Modelo mental

-   **ESLint** apanha erros e más práticas.
-   **Prettier** formata automaticamente.

### Exemplo de config ESM (Prettier)

```js
// prettier.config.js
export default {
    singleQuote: false,
    trailingComma: "es5",
};
```

### Nota

-   Como o projeto usa ESM, prefere `prettier.config.js` com `export default`.
-   Podes adicionar `.editorconfig` e `eslint.config.js` para padronizar ainda mais.

### Checkpoint

-   Qual é a diferença entre ESLint e Prettier?

<a id="exercicios"></a>

## Exercícios - Introdução e setup

1. Cria um projeto novo com `npm init -y` e define `"type": "module"`.
2. Adiciona o script `dev` e confirma que o `nodemon` reinicia o servidor.
3. Cria a pasta `src/` com `app.js` e `server.js` vazios.
4. Cria `prettier.config.js` com `export default` e corre `npm run format`.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdos base de introdução e setup.
-   2026-01-12: junção dos ficheiros 00 e reestruturação para o layout padrão.
