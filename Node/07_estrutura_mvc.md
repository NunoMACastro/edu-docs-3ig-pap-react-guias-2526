# Node.js (12.º Ano) - 07 · Estrutura de pastas (MVC leve)

> **Objetivo deste ficheiro**
> Organizar pastas e responsabilidades na API.
> Entender o fluxo Routes → Controllers → Services → Repositories.
> Manter o projeto legível e fácil de manter.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Estrutura de pastas sugerida](#sec-1)
-   [2. [ESSENCIAL] Responsabilidades de cada camada](#sec-2)
-   [3. [EXTRA] Checklist para novas funcionalidades](#sec-3)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca a estrutura e as responsabilidades.
-   **Como estudar:** aplica esta estrutura no teu projeto.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Estrutura de pastas sugerida

```
src/
  app.js
  server.js
  routes/
    todos.router.js
  controllers/
    todos.controller.js
  services/
    todos.service.js
  repositories/
    todos.repo.file.js
  middlewares/
    errors.js
    validate.js
  schemas/
    todo.schemas.js
  utils/
    asyncHandler.js
    config.js
  data/
    todos.json
  public/
```

### Checkpoint

-   Onde guardas a lógica de negócio?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Responsabilidades de cada camada

-   **Routes:** ligam URLs a controllers.
-   **Controllers:** validam entrada e escolhem status codes.
-   **Services:** regras de negócio.
-   **Repositories:** acesso a dados (JSON ou BD).
-   **Middlewares:** validação, auth, erros.

### Boas práticas

-   Um ficheiro, um propósito.
-   Nomes consistentes (`todos.service.js`, `todos.controller.js`).

### Checkpoint

-   Qual é a diferença entre controller e service?

<a id="sec-3"></a>

## 3. [EXTRA] Checklist para novas funcionalidades

-   Precisas de rota nova? Atualiza `routes/`.
-   Há regras de negócio? Vai para `services/`.
-   Persistência? Cria/edita `repositories/`.
-   Validação? Usa `schemas/` ou `middlewares/validate`.

<a id="changelog"></a>

## Changelog

-   2025-11-10: estrutura base e analogias de camadas.
-   2026-01-12: reestruturação para o layout padrão.
