# Node.js (12.º Ano) - 15 · Troubleshooting

> **Objetivo deste ficheiro**
> Identificar erros comuns em projetos Node.
> Ter respostas rápidas para os problemas mais frequentes.
> Melhorar a rotina de debug.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Erros comuns e soluções rápidas](#sec-1)
-   [2. [EXTRA] Estratégia de depuração](#sec-2)
-   [3. [EXTRA] Ferramentas úteis](#sec-3)
-   [Exercícios - Troubleshooting](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** consulta os erros mais comuns primeiro.
-   **Como estudar:** tenta reproduzir e aplicar a solução.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Erros comuns e soluções rápidas

1. **ERR_MODULE_NOT_FOUND**
    - Causa: caminho errado ou extensão em falta.
    - Solução: confirma `./ficheiro.js` e a extensão.

2. **__dirname não definido em ESM**
    - Solução:
    ```js
    import path from "node:path";
    import { fileURLToPath } from "node:url";
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    ```

3. **CORS com credentials bloqueado**
    - Causa: `origin="*"` com `credentials: true`.
    - Solução: define origem concreta.

4. **Codespaces: Error forwarding port**
    - Solução: escuta em `0.0.0.0`.

5. **nodemon não reinicia**
    - Solução: confirma `--watch src` e `--ext js,mjs`.

6. **ENOENT ao ler JSON**
    - Causa: ficheiro não existe.
    - Solução: `fs.mkdir(..., { recursive: true })`.

7. **Cannot set headers after they are sent**
    - Causa: resposta enviada duas vezes.
    - Solução: retorna após `res.status(...).json(...)`.

8. **Porta ocupada**
    - Solução: muda `PORT` ou termina o processo.

9. **Cannot read properties of undefined**
    - Causa: `req.body` vazio.
    - Solução: confirma `express.json()` e `Content-Type`.

<a id="sec-2"></a>

## 2. [EXTRA] Estratégia de depuração

1. Lê o erro completo (ficheiro e linha).
2. Reproduz de forma consistente.
3. Isola a camada (rota, controller, service, repo).
4. Escreve um teste que falhe.
5. Documenta a lição.

<a id="sec-3"></a>

## 3. [EXTRA] Ferramentas úteis

-   `npm doctor`
-   `npx envinfo --system --binaries`
-   `node --watch src/server.js`

<a id="exercicios"></a>

## Exercícios - Troubleshooting

1. Provoca um erro de import e corrige-o.
2. Força um `req.body` vazio e confirma o erro.
3. Escreve um mini‑teste para reproduzir um bug.

<a id="changelog"></a>

## Changelog

-   2025-11-10: lista base de erros e ferramentas.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
