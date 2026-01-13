# Node.js (12.º Ano) - 04 · HTTP nativo vs Express

> **Objetivo deste ficheiro**
> Comparar HTTP nativo com Express.
> Perceber o que o Express automatiza.
> Preparar o terreno para a app base.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] HTTP nativo (exemplo mínimo)](#sec-1)
-   [2. [ESSENCIAL] Porque Express](#sec-2)
-   [3. [EXTRA] Quando usar HTTP puro](#sec-3)
-   [Exercícios - HTTP vs Express](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** entende a diferença e avança para `06_express_basico.md`.
-   **Como estudar:** compara os dois exemplos e lista as diferenças.

<a id="sec-1"></a>

## 1. [ESSENCIAL] HTTP nativo (exemplo mínimo)

### Exemplo

```js
import http from "node:http";

const server = http.createServer((req, res) => {
    if (req.url === "/") return res.writeHead(200).end("Olá");
    res.writeHead(404).end("Não encontrado");
});

server.listen(3000);
```

### Checkpoint

-   Que linha devolve 404?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Porque Express

### Modelo mental

O Express automatiza tarefas repetitivas:

-   Roteamento simples (`app.get`, `app.post`).
-   Middlewares (CORS, JSON, autenticação).
-   Gestão centralizada de erros.

### Checkpoint

-   Dá um exemplo de algo que o Express simplifica.

<a id="sec-3"></a>

## 3. [EXTRA] Quando usar HTTP puro

-   Microprojetos educativos para mostrar o “básico”.
-   Serviços minimalistas sem dependências.

### Checkpoint

-   Em que cenário escolhes HTTP nativo?

<a id="exercicios"></a>

## Exercícios - HTTP vs Express

1. Cria um servidor HTTP que responde "OK" em `/health`.
2. Lista 3 vantagens práticas do Express.

<a id="changelog"></a>

## Changelog

-   2025-11-10: conteúdo base sobre HTTP nativo e Express.
-   2026-01-12: reestruturação para o layout padrão e exercícios curtos.
