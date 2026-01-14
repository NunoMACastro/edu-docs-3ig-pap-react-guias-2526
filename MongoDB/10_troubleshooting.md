# MongoDB (12.º Ano) - 10 · Troubleshooting

> **Objetivo deste ficheiro**
> Resolver erros comuns de ligação ao Atlas.
> Identificar mensagens típicas do driver.
> Saber onde verificar configurações.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Erros de ligação mais comuns](#sec-1)
-   [2. [ESSENCIAL] String SRV do Atlas: o que significa](#sec-2)
-   [3. [ESSENCIAL] Erros de autenticação](#sec-3)
-   [4. [EXTRA] Dicas de diagnóstico](#sec-4)
-   [Exercícios - Troubleshooting](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** confirma primeiro IP, user e string de ligação.
-   **Como estudar:** simula um erro e resolve.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Erros de ligação mais comuns

### Mensagens típicas

-   `MongoNetworkError: connect ETIMEDOUT`
-   `MongoServerSelectionError: connection timed out`
-   `MongoParseError: URI malformed`
-   `getaddrinfo ENOTFOUND`
-   `SRV record not found`

### Causas prováveis

-   IP não autorizado no Atlas.
-   Cluster em pausa ou a iniciar.
-   DNS bloqueado ou rede errada.
-   String de ligação mal formatada.

### Soluções rápidas

-   Adiciona o IP atual em **Network Access**.
-   Confirma se o cluster está **Running**.
-   Testa noutra rede (hotspot).
-   Volta a copiar a URI no Atlas e confirma `mongodb+srv://`.

### Checkpoint

-   Onde adicionas o IP no Atlas?

<a id="sec-2"></a>

## 2. [ESSENCIAL] String SRV do Atlas: o que significa

### Modelo mental

`mongodb+srv://` usa um registo DNS (SRV) para descobrir automaticamente os hosts do cluster. Se o DNS falhar, vais ver erros como `SRV record not found` ou `ENOTFOUND`.

### Soluções rápidas

-   Testa noutra rede ou muda o DNS (ex.: 8.8.8.8).
-   Confirma se copiaste a string correta no Atlas.

### Checkpoint

-   O que é que a string SRV faz em poucas palavras?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Erros de autenticação

### Mensagens típicas

-   `Authentication failed`
-   `bad auth`

### Causas prováveis

-   User/password errados.
-   User sem permissão na database.

### Soluções rápidas

-   Recria o user e confirma permissão `readWrite`.
-   Verifica se o user está no **Project** certo.

### Checkpoint

-   Que permissão mínima é necessária para CRUD?

<a id="sec-4"></a>

## 4. [EXTRA] Dicas de diagnóstico

-   Mostra o valor de `MONGODB_URI` no arranque (sem password).
-   Confirma o nome da base na string.
-   Usa `mongosh` para validar a ligação antes do backend.

<a id="exercicios"></a>

## Exercícios - Troubleshooting

1. Simula um erro de password e identifica a mensagem.
2. Remove o IP da lista e confirma o erro.
3. Corrige e volta a ligar com `mongosh`.
   **Critério:** consegues correr `db.runCommand({ ping: 1 })` ou listar coleções.

<a id="changelog"></a>

## Changelog

-   2026-01-14: secção SRV e erros reais com causas e soluções.
-   2026-01-13: criação do ficheiro de troubleshooting.
