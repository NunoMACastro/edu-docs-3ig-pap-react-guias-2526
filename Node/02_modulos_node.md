# Node.js (12.º Ano) - 02 · Módulos em Node (ESM vs CommonJS)

> **Objetivo deste ficheiro**
> Dominar ES Modules (padrão do curso).
> Saber importar/exportar corretamente em Node.
> Entender CommonJS como referência histórica.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] ES Modules (padrão do curso)](#sec-1)
-   [2. [ESSENCIAL] Imports relativos e extensão .js](#sec-2)
-   [3. [ESSENCIAL] Tipos de export](#sec-3)
-   [4. [EXTRA] CommonJS (histórico)](#sec-4)
-   [5. [EXTRA] Import dinâmico e top-level await](#sec-5)
-   [6. [EXTRA] __dirname em ESM](#sec-6)
-   [Exercícios - Módulos](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca ESM e tipos de export; CommonJS é só histórico.
-   **Como estudar:** cria dois ficheiros e faz import/export reais.
-   **Ligações:** confirma `"type": "module"` no `package.json` (ver `01_introducao_e_setup.md`).

<a id="sec-1"></a>

## 1. [ESSENCIAL] ES Modules (padrão do curso)

### Modelo mental

ESM é a sintaxe moderna de módulos no JavaScript e é igual no browser e no Node.

### Exemplo

```js
// utils/math.js
export const soma = (a, b) => a + b;

// noutro ficheiro
import { soma } from "./utils/math.js";
```

### Checkpoint

-   Porque é que o curso usa ESM?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Imports relativos e extensão .js

### Modelo mental

Em Node ESM, **imports relativos precisam da extensão**.

### Exemplo

```js
import { soma } from "./utils/math.js";
```

### Boas práticas

-   Usa caminhos claros (`../` volta uma pasta).
-   Evita caminhos mágicos sem configuração extra.

### Checkpoint

-   O que acontece se esqueceres a extensão?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Tipos de export

### Named exports (recomendado)

```js
export function geraToken() {}
export const MAX_USERS = 10;
```

### Default exports

```js
export default function soma(a, b) {
    return a + b;
}
```

### Boas práticas

-   Prefere **named exports** para maior clareza.
-   Usa `default` só quando faz sentido.

### Checkpoint

-   Qual é a vantagem de named exports?

<a id="sec-4"></a>

## 4. [EXTRA] CommonJS (histórico)

### Nota

CommonJS é o sistema antigo do Node (2009). Usa `require` e `module.exports`. **Não é o padrão do curso.**

### Checkpoint

-   Porque é que CommonJS aparece como histórico?

<a id="sec-5"></a>

## 5. [EXTRA] Import dinâmico e top-level await

### Exemplo

```js
const mod = await import("./utils/math.js");
console.log(mod.soma(2, 3));
```

### Checkpoint

-   Em que situação usarias `import()` dinâmico?

<a id="sec-6"></a>

## 6. [EXTRA] __dirname em ESM

### Exemplo

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### Checkpoint

-   Porque é que `__dirname` não existe em ESM?

<a id="exercicios"></a>

## Exercícios - Módulos

1. Cria `utils/math.js` com `soma` e `subtrai` (named exports).
2. Importa no `index.js` e escreve dois `console.log` com resultados.
3. Cria um módulo com `export default` e testa um import com nome diferente.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre módulos e diferenças históricas.
-   2026-01-12: reestruturação para o layout padrão e reforço de ESM.
