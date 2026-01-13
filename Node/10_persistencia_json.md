# Node.js (12.º Ano) - 10 · Persistência em ficheiro JSON

> **Objetivo deste ficheiro**
> Guardar dados num ficheiro JSON de forma segura.
> Separar repository e service.
> Preparar a transição para uma base de dados real.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Repository em ficheiro](#sec-1)
-   [2. [ESSENCIAL] Service simples](#sec-2)
-   [3. [EXTRA] Limitações e cuidados](#sec-3)
-   [Exercícios - Persistência JSON](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** implementa repository + service primeiro.
-   **Como estudar:** abre o ficheiro JSON e confirma as alterações.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Repository em ficheiro

### Exemplo

```js
// src/repositories/todos.repo.file.js
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const F = path.join(__dirname, "..", "data", "todos.json");

async function lerTodos() {
    try {
        return JSON.parse(await fs.readFile(F, "utf8"));
    } catch (e) {
        if (e.code === "ENOENT") return [];
        throw e;
    }
}

async function gravarTodos(lista) {
    await fs.mkdir(path.dirname(F), { recursive: true });
    const tmp = F + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(lista, null, 2), "utf8");
    await fs.rename(tmp, F);
}

export async function listar() {
    return lerTodos();
}

export async function obter(id) {
    const L = await lerTodos();
    return L.find((t) => t.id === id) || null;
}

export async function criar({ titulo, concluido = false }) {
    const novo = {
        id: crypto.randomUUID(),
        titulo,
        concluido,
        criadoEm: Date.now(),
    };
    const L = await lerTodos();
    L.push(novo);
    await gravarTodos(L);
    return novo;
}

export async function atualizar(id, patch) {
    const L = await lerTodos();
    const idx = L.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    L[idx] = { ...L[idx], ...patch, atualizadoEm: Date.now() };
    await gravarTodos(L);
    return L[idx];
}

export async function remover(id) {
    const L = await lerTodos();
    const filtrado = L.filter((t) => t.id !== id);
    if (filtrado.length === L.length) return false;
    await gravarTodos(filtrado);
    return true;
}
```

### Checkpoint

-   Porque usamos ficheiro temporário `.tmp`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Service simples

```js
// src/services/todos.service.js
import * as repo from "../repositories/todos.repo.file.js";
export const listar = () => repo.listar();
export const obter = (id) => repo.obter(id);
export const criar = (data) => repo.criar(data);
export const atualizar = (id, patch) => repo.atualizar(id, patch);
export const remover = (id) => repo.remover(id);
```

### Checkpoint

-   Qual é a função do service?

<a id="sec-3"></a>

## 3. [EXTRA] Limitações e cuidados

-   Duas escritas ao mesmo tempo podem sobrescrever dados.
-   É aceitável para aula, mas não para produção.
-   Trocar por BD mais tarde é simples se o repository estiver isolado.

<a id="exercicios"></a>

## Exercícios - Persistência JSON

1. Adiciona o campo `prioridade` ao `criar`.
2. Cria função `pesquisar(padrao)` que filtra por texto.
3. Guarda estatísticas num ficheiro JSON separado.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre persistência em ficheiro.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
