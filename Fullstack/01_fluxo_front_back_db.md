# Fullstack (12.º Ano) - 01 · Fluxo React → Express → MongoDB

> **Objetivo deste ficheiro**
> Ver o ciclo completo de um pedido fullstack.
> Entender onde vive cada parte (React, Node, MongoDB).
> Usar o mesmo domínio de tarefas com contrato consistente.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O fluxo completo (request → response)](#sec-1)
-   [2. [ESSENCIAL] Onde vive cada parte](#sec-2)
-   [3. [ESSENCIAL] Contrato base de tarefas](#sec-3)
-   [4. [ESSENCIAL] Fluxo de dados no React](#sec-4)
-   [5. [EXTRA] Pontes para auth/upload/paginacao](#sec-5)
-   [Exercícios - Fluxo fullstack](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca o fluxo e o contrato antes de extras.
-   **Como estudar:** segue o pedido do início ao fim e confirma o JSON.
-   **Ligações úteis:**
    -   React: `../React/11_consumo_api_e_backend_node.md`
    -   Node: `../Node/06_express_basico.md`
    -   MongoDB: `../MongoDB/04_node_driver_fundamentos.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] O fluxo completo (request → response)

### Modelo mental

1. **React (frontend)** faz um pedido HTTP (`fetch`).
2. **Express (backend)** recebe, valida e decide a resposta.
3. **MongoDB** guarda ou devolve dados.
4. **Express** devolve JSON.
5. **React** atualiza o estado e mostra na UI.

### Diagrama simples

```
React UI -> fetch -> Express -> MongoDB
React UI <- JSON  <- Express <- MongoDB
```

### Checkpoint

-   Onde acontece a validação final?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Onde vive cada parte

### Backend (Node/Express)

-   **Rotas** recebem o pedido (`/api/tarefas`).
-   **Controllers** validam e escolhem status codes.
-   **DB** (Mongo/Mongoose) guarda e devolve dados.

### Frontend (React)

-   **Serviços** fazem `fetch`.
-   **Componentes** mostram `loading/erro/dados`.

### Checkpoint

-   Em que ficheiro fica o `fetch` no React?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Contrato base de tarefas

### Formato de erro (padrão)

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Exemplo de contrato

```text
GET /api/tarefas
200 OK
[
  { "_id": "...", "titulo": "Estudar Mongo", "feito": false }
]
```

```text
POST /api/tarefas
Body: { "titulo": "Rever React" }

201 Created
{ "_id": "...", "titulo": "Rever React", "feito": false }
```

### Erros comuns

-   Backend devolver um formato diferente do que o frontend espera.
-   Usar 200 em erros de validação.

### Boas práticas

-   Mantém o mesmo formato de erro em todas as rotas.
-   Usa status codes coerentes (200/201/400/404/409/422).

### Checkpoint

-   Porque é que o contrato facilita o frontend?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Fluxo de dados no React

### Modelo mental

-   **Dados descem** (props).
-   **Ações sobem** (callbacks).
-   **Estado sobe** quando vários componentes precisam do mesmo dado.

### Exemplo curto

```jsx
function App() {
    const [tarefas, setTarefas] = useState([]);
    return <ListaTarefas tarefas={tarefas} onAdd={(t) => setTarefas((p) => [...p, t])} />;
}
```

### Checkpoint

-   Quando é que faz sentido “levantar estado”?

<a id="sec-5"></a>

## 5. [EXTRA] Pontes para auth/upload/paginacao

-   **Auth:** vê `../React/16_autenticacao_em_spa_jwt_sessions_cookies.md`.
-   **Upload:** vê `../React/17_upload_paginacao_filtros_e_cliente_api.md`.
-   **Paginação/Filtros:** vê `../MongoDB/07_queries_e_indexacao.md`.

<a id="exercicios"></a>

## Exercícios - Fluxo fullstack

1. Faz `GET /api/tarefas` no backend e mostra a lista no React.
2. Faz `POST /api/tarefas` e atualiza a lista sem recarregar.
3. Força um erro de validação e mostra a mensagem na UI.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com o fluxo fullstack base.
