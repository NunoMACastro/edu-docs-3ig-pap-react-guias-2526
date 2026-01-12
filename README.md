# React.js - Materiais Didáticos (12.º Ano)

Conjunto de materiais em Markdown para o módulo de React.js.

## Como usar

-   Começa no ficheiro `01_fundamentos_e_setup.md` e segue a ordem.
-   Faz os exemplos no teu projeto e depois resolve os exercícios.
-   Os blocos [EXTRA] são opcionais para quem quer aprofundar.
-   Os ficheiros 13 e 14 não têm exercícios; usam checklist e critérios de validação.

## Pré-requisitos

-   **Node.js + npm:** idealmente Node 18+.
-   **Editor de código:** VS Code ou equivalente.
-   **Terminal:** para correr comandos (`npm`, `node`).
-   **Browser atualizado:** Chrome, Edge ou Firefox.

## Setup rápido

```bash
# criar projeto React com Vite
npm create vite@latest meu-app -- --template react
cd meu-app
npm install
npm run dev
```

## Comandos mais usados

-   `npm install`: instala dependências.
-   `npm run dev`: inicia o servidor local.
-   `npm run build`: gera a versão final.
-   `npm run preview`: testa a versão final localmente.

## Portas típicas

-   **Vite (frontend):** `http://localhost:5173`
-   **Backend Node (exemplos):** `http://localhost:3000`

## Troubleshooting rápido

-   **Erro de dependências:** apaga `node_modules` e corre `npm install`.
-   **Página em branco:** confirma o `div#root` no `index.html`.
-   **CORS:** verifica se o backend tem `cors` ativo.
-   **StrictMode em dev:** alguns efeitos podem correr duas vezes (ver ficheiro 08).

## Índice de ficheiros

-   [01 - Fundamentos e setup de React](01_fundamentos_e_setup.md)
-   [02 - JSX e componentes](02_jsx_e_componentes.md)
-   [03 - Props e composição](03_props_e_composicao.md)
-   [04 - Estado e eventos](04_estado_e_eventos.md)
-   [05 - Listas e renderização condicional](05_listas_e_condicionais.md)
-   [06 - Formulários controlados](06_formularios_controlados.md)
-   [07 - Comunicação síncrona e assíncrona](07_comunicacao_sincrona_e_assincrona.md)
-   [08 - useEffect e dados externos](08_useEffect_e_dados.md)
-   [09 - React Router: fundamentos e setup](09_react_router_fundamentos.md)
-   [10 - Navegação e rotas dinâmicas](10_navegacao_e_rotas_dinamicas.md)
-   [11 - Consumo de API com backend Node.js](11_consumo_api_e_backend_node.md)
-   [12 - Context API e estado global](12_context_api_estado_global.md)
-   [13 - Organização e boas práticas](13_organizacao_e_boas_praticas.md)
-   [14 - Mini-projeto guiado (React puro)](14_miniprojeto_guiado.md)
