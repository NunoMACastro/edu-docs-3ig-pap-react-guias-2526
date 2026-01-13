# Node.js (12.º Ano) - 03 · Node core útil

> **Objetivo deste ficheiro**
> Conhecer os módulos core mais usados no dia a dia.
> Aprender a ler/escrever ficheiros com `fs/promises`.
> Perceber quando usar `path`, `process`, `os`, `events` e `crypto`.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] path e fs/promises](#sec-1)
-   [2. [ESSENCIAL] process, os e events](#sec-2)
-   [3. [ESSENCIAL] crypto e IDs](#sec-3)
-   [4. [EXTRA] Timers e event loop](#sec-4)
-   [5. [EXTRA] Streams e ficheiros grandes](#sec-5)
-   [Exercícios - Node core](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** aprende `path` e `fs/promises` primeiro.
-   **Como estudar:** copia os exemplos e testa com um ficheiro JSON.
-   **Ligações:** o repository em `10_persistencia_json.md` usa estes módulos.

<a id="sec-1"></a>

## 1. [ESSENCIAL] path e fs/promises

### Modelo mental

-   `path` ajuda a construir caminhos portáveis.
-   `fs/promises` permite I/O assíncrono com `await`.

### Exemplo

```js
import path from "node:path";
import fs from "node:fs/promises";

const raiz = process.cwd();
const ficheiro = path.join(raiz, "data", "todos.json");

export async function lerJSON(caminho, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(caminho, "utf8"));
    } catch (e) {
        if (e.code === "ENOENT") return fallback;
        throw e;
    }
}

export async function escreverJSON(caminho, dados) {
    await fs.mkdir(path.dirname(caminho), { recursive: true });
    const tmp = caminho + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(dados, null, 2), "utf8");
    await fs.rename(tmp, caminho);
}
```

### Checkpoint

-   Porque é que usamos `path.join`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] process, os e events

### Exemplo

```js
import os from "node:os";
import { EventEmitter } from "node:events";

console.log(process.env.NODE_ENV);
console.log(os.cpus().length, os.totalmem());

const bus = new EventEmitter();
bus.on("novo_todo", (todo) => console.log("Evento:", todo));
```

### Checkpoint

-   Para que serve o `EventEmitter`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] crypto e IDs

### Exemplo

```js
import crypto from "node:crypto";
const id = crypto.randomUUID();
```

### Boas práticas

-   Não uses `Math.random()` para algo que precise de segurança.

### Checkpoint

-   Porque preferir `randomUUID()`?

<a id="sec-4"></a>

## 4. [EXTRA] Timers e event loop

```js
setTimeout(() => console.log("Executa 1 vez"), 1000);
const id = setInterval(() => console.log("Loop"), 1000);
clearInterval(id);
```

### Checkpoint

-   O que faz `setInterval`?

<a id="sec-5"></a>

## 5. [EXTRA] Streams e ficheiros grandes

### Nota

Streams permitem ler ficheiros grandes “aos pedaços” sem encher a RAM. Guarda esta ideia para logs e exportações.

### Checkpoint

-   Quando é que faz sentido usar streams?

<a id="exercicios"></a>

## Exercícios - Node core

1. Lê um ficheiro JSON com `lerJSON` e mostra o resultado.
2. Gera um ID com `crypto.randomUUID()` e guarda num array.
3. Emite um evento com `EventEmitter` e confirma a mensagem.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre módulos core do Node.
-   2026-01-12: reestruturação para o layout padrão e exemplos organizados.
