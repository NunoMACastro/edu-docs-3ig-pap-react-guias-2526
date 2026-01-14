# MongoDB (12.º Ano) - 01 · Introdução e setup no Atlas

> **Objetivo deste ficheiro**
> Perceber o que é o MongoDB e para que serve.
> Criar um cluster no MongoDB Atlas.
> Ligar ao cluster com `mongosh` e guardar a string no backend.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é o MongoDB](#sec-1)
-   [2. [ESSENCIAL] Criar cluster no Atlas](#sec-2)
-   [3. [ESSENCIAL] String de ligação e mongosh](#sec-3)
-   [4. [EXTRA] Boas práticas iniciais](#sec-4)
-   [Exercícios - Introdução e setup](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** segue o setup do Atlas antes de abrir o mongosh.
-   **Como estudar:** cria o cluster e testa a ligação.
-   **Ligações:** depois disto, passa para `02_modelo_documentos_e_colecoes.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é o MongoDB

### Modelo mental

MongoDB é uma base de dados **NoSQL** orientada a documentos. Em vez de tabelas e linhas, tens **coleções** e **documentos** (JSON).

-   **Documento:** um objeto JSON (ex.: uma tarefa).
-   **Coleção:** conjunto de documentos do mesmo tipo (ex.: `tarefas`).
-   **Database:** agrupador de coleções (ex.: `escola`).

### Checkpoint

-   Qual é a diferença entre documento e coleção?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar cluster no Atlas

### Passo a passo

1. Cria conta em https://www.mongodb.com/atlas.
2. Cria um **Project** e um **Cluster** (Free Tier).
3. Cria um **Database User** (username + password).
4. Em **Network Access**, autoriza o teu IP.
5. Em **Database**, cria a base `escola` (podes criar ao primeiro insert).

> **Nota:** para aula, podes usar `0.0.0.0/0`, mas não é recomendável em projetos reais.

### Erros comuns

-   Esquecer o user/password e ficar com `Authentication failed`.
-   Não autorizar o IP e receber `IP not allowed`.

### Checkpoint

-   Onde adicionas o teu IP no Atlas?

<a id="sec-3"></a>

## 3. [ESSENCIAL] String de ligação e mongosh

### Modelo mental

O Atlas dá-te uma string `mongodb+srv://...`. Essa string **fica no backend**, nunca no frontend.

O `mongosh` é a **shell oficial do MongoDB**: uma consola onde executas comandos para criar, ler e alterar dados.

### Exemplo

```bash
# exemplo (substitui pelos teus dados)
mongosh "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/escola"
```

### Como aceder ao mongosh

1. Instala o `mongosh` (MongoDB Shell) a partir do Atlas ou do site do MongoDB.
2. Abre o Terminal.
3. Cola o comando `mongosh "mongodb+srv://..."` com a tua string.
4. Quando ligares, vais ver o prompt `>` e podes escrever comandos.

### Dica de organização

Guarda a string no `.env` do backend:

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/escola
```

### Checkpoint

-   Porque a string nunca deve estar no frontend?

<a id="sec-4"></a>

## 4. [EXTRA] Boas práticas iniciais

-   Usa passwords fortes.
-   Cria um utilizador com permissões mínimas.
-   Mantém a string de ligação no `.env`.

<a id="exercicios"></a>

## Exercícios - Introdução e setup

1. Cria um cluster Free Tier no Atlas.
2. Liga com `mongosh` e confirma que vês a base `admin`.
3. Cria a base `escola` e a coleção `tarefas` (podes fazer no ficheiro 03).

<a id="changelog"></a>

## Changelog

-   2026-01-14: passos simples para aceder ao `mongosh`.
-   2026-01-14: explicação do que é o `mongosh`.
-   2026-01-14: correção de acentos e clareza de termos.
-   2026-01-13: criação do ficheiro com setup Atlas.
