# React.js (12.º Ano) - 11 · Consumo de API com backend Node.js

> **Objetivo deste ficheiro**
> Entender a ligação entre frontend React e backend Node.js.
> Criar uma API simples com Express e consumir dados com fetch.
> Tratar loading, erro e problemas de CORS.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Modelo cliente-servidor](#sec-1)
-   [2. [ESSENCIAL] Criar uma API simples em Node.js](#sec-2)
-   [3. [ESSENCIAL] Consumir a API no React](#sec-3)
-   [4. [ESSENCIAL] CORS e erros comuns](#sec-4)
-   [5. [EXTRA] Proxy no Vite e variáveis de ambiente](#sec-5)
-   [Exercícios - Consumo de API com backend Node.js](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria a API e faz o fetch antes de usar proxy.
-   **Como estudar:** corre o backend e o frontend em terminais diferentes.
-   **Ligações:** revê `08_useEffect_e_dados.md` para o fetch com `useEffect`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Modelo cliente-servidor

### Modelo mental

O React corre no browser (cliente). O Node.js corre no servidor (backend). O React pede dados ao backend por HTTP e recebe JSON.

Pensa nisto como uma conversa simples:

-   **Cliente (React):** "Dá-me a lista de alunos."
-   **Servidor (Node.js):** "Aqui tens em JSON."

O backend é o sítio certo para lógica que não deve ficar no browser (acesso à base de dados, regras de negócio, validações). O frontend mostra os dados e reage ao utilizador.

Termos importantes (simples):

| Termo         | Significado                                    |
| ------------- | ---------------------------------------------- |
| **API**       | Conjunto de rotas que devolvem dados           |
| **Endpoint**  | Uma rota específica (ex.: `/api/alunos`)       |
| **HTTP**      | A forma como o browser comunica com o servidor |
| **JSON**      | Formato de dados (texto estruturado)           |
| **Porta**     | Número que identifica o serviço (ex.: 3000)    |
| **localhost** | O teu computador a fazer de servidor           |

Métodos HTTP mais usados (começa por estes dois):

-   **GET:** pedir dados (ler).
-   **POST:** enviar dados para criar algo novo.

> **Nota:** cada resposta tem um código (ex.: 200 = OK, 404 = não encontrado).

### Sintaxe base (passo a passo)

-   **O backend expõe endpoints:** `/api/alunos`, `/api/cursos`, etc.
-   **O frontend faz pedidos HTTP:** com `fetch`.
-   **A resposta vem em JSON:** e tens de a converter com `res.json()`.
-   **Cada serviço tem uma porta:** ex.: backend `3000`, frontend `5173`.
-   **O caminho completo inclui protocolo + host + porta:** `http://localhost:3000/api/alunos`.

### Exemplo

```text
# Fluxo básico de dados
# 1) React faz um pedido HTTP
# 2) Node.js responde com JSON
# 3) React mostra os dados na UI
```

```text
# Exemplo de pedido e resposta (simplificado)
# Pedido: GET http://localhost:3000/api/alunos
# Resposta: 200 OK
# [
#   { "id": 1, "nome": "Ana", "curso": "Web" },
#   { "id": 2, "nome": "Bruno", "curso": "Redes" }
# ]
```

### Erros comuns

-   Pensar que o React pode aceder diretamente a uma base de dados.
-   Misturar código do servidor com código do frontend.
-   Confundir porta do backend com a do frontend.

### Boas práticas

-   Mantém backend e frontend separados.
-   Usa JSON como formato padrão de resposta.
-   Dá nomes claros aos endpoints (ex.: `/api/alunos`).

### Checkpoint

-   Qual é a diferença entre cliente e servidor?
-   O que significa a porta num URL como `http://localhost:3000`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar uma API simples em Node.js

### Modelo mental

O Express cria um servidor HTTP rápido. Cada rota devolve dados em JSON.

Pensa no Express como um "porteiro" que recebe pedidos e decide o que devolver. Cada pedido chega com:

-   **req (request):** o pedido do cliente.
-   **res (response):** a resposta que o servidor vai enviar.

### Sintaxe base (passo a passo)

-   **Cria uma pasta para o backend.**
-   **Inicializa um projeto Node:** `npm init -y`.
-   **Instala dependências:** `express` e `cors`.
-   **Cria `index.js`:** configura o servidor.
-   **Define uma rota `GET /api/alunos`.**
-   **Arranca o servidor com `node index.js`.**

> **Nota sobre CommonJS vs ESM:** por omissão, o Node usa **CommonJS**, que escreve imports com `require(...)` e exports com `module.exports`. O formato **ESM** usa `import`/`export` e exige `"type": "module"` no `package.json` (ou ficheiros `.mjs`). Aqui usamos `require` para evitar configuração extra.

### Exemplo

```bash
# Cria uma pasta para o backend
mkdir backend
cd backend
# Inicia um projeto Node simples
npm init -y
# Instala Express e CORS para permitir pedidos do frontend
npm install express cors
```

```js
// backend/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Permite pedidos do frontend (origem diferente)
app.use(cors());
// Permite receber JSON no corpo do pedido (útil em POST/PUT)
app.use(express.json());

// Dados simulados (podem vir de uma base de dados)
const alunos = [
    { id: 1, nome: "Ana", curso: "Web" },
    { id: 2, nome: "Bruno", curso: "Redes" },
];

// Rota que devolve JSON
app.get("/api/alunos", (req, res) => {
    // Envia a lista como resposta
    res.json(alunos);
});

app.listen(PORT, () => {
    // Mensagem para confirmar que o servidor arrancou
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
```

```bash
# Corre o servidor Node
node index.js
```

### Erros comuns

-   Esquecer o `cors` e bloquear pedidos do browser.
-   Usar uma porta diferente sem atualizar o frontend.
-   Escrever a rota errada e receber 404.

### Boas práticas

-   Mantém o backend num terminal separado.
-   Usa nomes de rotas claros e previsíveis.
-   Testa a rota no browser antes de ligar ao React.

### Checkpoint

-   Porque é que usamos `require` neste ficheiro?
-   O que muda se o projeto usar `"type": "module"`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Consumir a API no React

### Modelo mental

No React, fazes o pedido com `fetch` dentro do `useEffect`. Guardas o resultado no estado e mostras loading enquanto esperas.

O `fetch` é **assíncrono**, ou seja, o React não fica parado à espera. Por isso precisamos de estados:

-   **loading:** para indicar que está a carregar.
-   **erro:** para mostrar uma mensagem se algo falhar.
-   **dados:** para mostrar a lista quando chegar.

Quando o estado muda, o React volta a renderizar e atualiza o ecrã.

### Sintaxe base (passo a passo)

-   **Cria os estados:** `dados`, `loading`, `erro`.
-   **No `useEffect`, faz o pedido:** usa `fetch`.
-   **Converte a resposta:** `await res.json()`.
-   **Atualiza os estados:** dados no sucesso, erro no `catch`.
-   **Desliga o loading no fim.**

### Exemplo

```jsx
// src/pages/ListaAlunos.jsx
import { useEffect, useState } from "react";

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        // Função async para poder usar await
        async function carregar() {
            try {
                // Faz o pedido ao backend Node
                const res = await fetch("http://localhost:3000/api/alunos");
                if (!res.ok) {
                    // Se a resposta não for 2xx, tratamos como erro
                    throw new Error("Resposta inválida");
                }
                // Converte JSON para objeto JS
                const dados = await res.json();
                // Guarda os dados recebidos
                setAlunos(dados);
            } catch (e) {
                // Mensagem simples de erro
                setErro("Falha ao carregar alunos");
            } finally {
                // Desativa o loading quando termina
                setLoading(false);
            }
        }

        carregar();
    }, []);

    if (loading) {
        return <p>A carregar...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <ul>
            {alunos.map((aluno) => (
                <li key={aluno.id}>
                    {/* Mostra dados recebidos do backend */}
                    {aluno.nome} - {aluno.curso}
                </li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

### Erros comuns

-   Fazer o `fetch` fora do `useEffect` e repetir pedidos.
-   Esquecer o `key` na lista.
-   Não verificar `res.ok` e tentar ler JSON de erro.
-   Tentar usar `await` diretamente no `useEffect`.

### Boas práticas

-   Mostra sempre loading, erro e sucesso.
-   Evita repetir pedidos sem necessidade.
-   Mantém a URL da API num só lugar (ex.: ficheiro `services`).

### Checkpoint

-   Porque é que o `fetch` deve ficar dentro de `useEffect`?
-   Para que servem os estados `loading` e `erro`?

<a id="sec-4"></a>

## 4. [ESSENCIAL] CORS e erros comuns

### Modelo mental

O browser bloqueia pedidos entre origens diferentes por segurança. Uma origem é composta por **protocolo + domínio + porta**. Exemplo:

-   Frontend: `http://localhost:5173`
-   Backend: `http://localhost:3000`

Como as portas são diferentes, o browser considera origens diferentes. O `cors` no backend permite esses pedidos.

### Sintaxe base (passo a passo)

-   **Ativa o CORS no backend:** `app.use(cors())`.
-   **Garante que o backend está a correr:** sem servidor, dá erro de rede.
-   **Usa o URL correto no `fetch`:** com a porta certa.
-   **Opcional:** restringe a origem permitida.

### Exemplo

```js
// backend/index.js
const cors = require("cors");

// Esta linha permite o browser aceitar pedidos do frontend
app.use(cors());
```

```js
// Exemplo com origem específica (mais seguro)
app.use(
    cors({
        // Só aceita pedidos desta origem
        origin: "http://localhost:5173",
    })
);
```

> **Aviso:** se vires erros de CORS no console do browser, confirma se o backend tem `cors` ativo e se o servidor está a correr.

### Erros comuns

-   Backend desligado e o frontend mostrar erro.
-   Escrever o URL errado e receber 404.
-   Esquecer que a porta do Vite normalmente é 5173.

### Boas práticas

-   Testa a API no browser antes do React (ex: `http://localhost:3000/api/alunos`).
-   Se possível, limita as origens permitidas.

### Checkpoint

-   Porque é que `http://localhost:5173` e `http://localhost:3000` são origens diferentes?
-   Qual é o papel do `cors` no backend?

<a id="sec-5"></a>

## 5. [EXTRA] Proxy no Vite e variáveis de ambiente

### Modelo mental

Um proxy evita escrever o URL completo e reduz problemas de CORS. Variáveis de ambiente permitem trocar URLs sem mexer no código.

Isto é útil porque:

-   Em desenvolvimento usas `localhost`.
-   Em produção usas o domínio real.
-   Não queres andar a mudar o código sempre que o endereço muda.

### Sintaxe base (passo a passo)

-   **Configura proxy no `vite.config.js`:** aponta `/api` para o backend.
-   **Cria um ficheiro `.env`:** com `VITE_API_BASE`.
-   **Lê no código:** `import.meta.env.VITE_API_BASE`.
-   **Nunca guardes segredos no frontend:** tudo o que está no React é público.

### Exemplo

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        // Proxy encaminha /api para o backend local
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
});
```

```bash
# .env (na raiz do projeto React)
# Prefixo VITE_ é obrigatório no Vite
VITE_API_BASE=http://localhost:3000
```

```jsx
// src/services/api.js
// Base URL vem de uma variável de ambiente
const API_BASE = import.meta.env.VITE_API_BASE || "";

export function fetchAlunos() {
    // Usa /api quando existe proxy configurado
    return fetch(`${API_BASE}/api/alunos`).then((res) => res.json());
}
```

### Erros comuns

-   Esquecer de reiniciar o Vite depois de mudar o config.
-   Escrever `VITE_API_BASE` sem reiniciar o servidor do Vite.
-   Tentar guardar segredos no frontend (eles ficam públicos).

### Boas práticas

-   Centraliza os pedidos num ficheiro `services`.
-   Usa `.env` só para valores públicos (URLs, nomes de projeto).

### Checkpoint

-   Porque é que tens de reiniciar o Vite depois de mudar o proxy?
-   Porque é que não deves guardar segredos num `.env` do frontend?

<a id="exercicios"></a>

## Exercícios - Consumo de API com backend Node.js

1. Cria a pasta `backend`. Entra nela no terminal e executa `npm init -y`. Abre o `package.json` e confirma que foi criado.
2. Ainda em `backend`, instala `express` e `cors` com `npm install express cors`. Confirma no `package.json` que as dependências aparecem.
3. Cria `backend/index.js`. Importa `express` e `cors`, cria o `app`, define a porta e adiciona uma rota `GET /api/alunos` que devolve um array simples.
4. Corre `node index.js`. Abre `http://localhost:3000/api/alunos` no browser e confirma que aparece JSON.
5. No React, cria `ListaAlunos.jsx`. Adiciona estados `alunos`, `loading` e `erro`, e coloca o `fetch` dentro do `useEffect`.
6. No `ListaAlunos`, mostra "A carregar..." enquanto `loading` for `true`. Depois mostra a lista quando os dados chegarem e garante que o `loading` é desligado.
7. Mostra uma mensagem se ocorrer erro.
8. Adiciona mais um campo ao JSON (ex: `turma`).
9. Mostra o novo campo no React.
10. Muda a porta do backend e atualiza o fetch.
11. Configura um proxy no Vite para usar `/api`.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas e exercícios iniciais em formato guia.
-   2026-01-12: nota CommonJS vs ESM, checkpoints e exercícios 1-6 mais guiados.
