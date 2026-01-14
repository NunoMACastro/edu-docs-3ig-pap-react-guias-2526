# Documentação (12.º Ano) - 06 · Documentação de código

> **Objetivo deste ficheiro**
> Escrever comentários úteis (o porquê).
> Aplicar convenções de nomes consistentes.
> Usar JSDoc em funções públicas.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Comentários úteis (o porquê)](#sec-1)
-   [2. [ESSENCIAL] Convenções de nomes](#sec-2)
-   [3. [ESSENCIAL] JSDoc para funções públicas](#sec-3)
-   [4. [EXTRA] Good vs bad comments](#sec-4)
-   [Erros comuns](#erros-comuns)
-   [Boas práticas](#boas-práticas)
-   [Checkpoint](#checkpoint)
-   [Exercícios - Código](#exercícios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

Aqui vais aprender a **documentar o código no próprio código**, sem confundir isto com README ou documentação da API. Esta parte serve para quem vai ler o ficheiro e precisa de entender **o porquê** de certas decisões.

-   **Comentário útil:** explica intenção, contexto ou decisão técnica.
-   **Comentário inútil:** repete o que o código já diz.

-   **ESSENCIAL vs EXTRA:** começa por comentários e nomes.
-   **Como estudar:** escolhe um ficheiro do teu projeto e melhora-o.
-   **Objetivo final:** alguém entende o teu código sem te perguntar "porquê fizeste isto?".

Este ficheiro corresponde ao `DOCUMENTACAO_CODIGO.md` da estrutura completa.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Comentários úteis (o porquê)

Vais aprender **quando comentar** e o que escrever para ser útil.

### Modelo mental

Um bom comentário explica o motivo, não o óbvio.

### Para que servem os comentários

-   Explicar decisões que não são óbvias.
-   Guardar contexto que não está no código (ex.: regras do professor, limitações do cliente).
-   Alertar para casos especiais ou riscos.

### Exemplo

```js
// Guarda em cache para evitar repetição de pedidos
const cache = new Map();
```

### Comentário ruim vs útil (exemplo)

```js
// Incrementa o contador
contador++;
```

Esse comentário não ajuda porque o código já diz isso.

```js
// Incrementa para contar tentativas falhadas e bloquear após 3
contador++;
```

Agora há contexto: "porquê".

### Quando comentar

-   Quando há uma regra de negócio escondida.
-   Quando a solução foi um "workaround".
-   Quando o código está a lidar com um caso raro.

### Quando NÃO comentar

-   Quando o nome da variável já explica.
-   Quando o comentário só repete o óbvio.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Convenções de nomes

Vais aprender a **dar nomes que explicam o que o código faz**. Bons nomes evitam comentários desnecessários.

### Regras simples

-   `camelCase` para variáveis e funções.
-   `PascalCase` para componentes e classes.
-   Nomes claros: `getTarefas`, `createTarefa`.

### Boas práticas de naming (com exemplos)

-   Funções começam com verbo: `get`, `create`, `update`, `delete`.
-   Booleanos começam com `is`, `has`, `can`, `should`:
    -   `isAuthenticated`, `hasError`.
-   Coleções no plural: `tarefas`, `users`.
-   Evitar abreviações confusas: `cfg` -> `config`.

### Exemplo de renomeação

```js
// Mau
const data = fetchTarefas();

// Bom
const tarefas = fetchTarefas();
```

### Regra de ouro

Se precisares de um comentário para explicar o nome, então o nome não está bom.

<a id="sec-3"></a>

## 3. [ESSENCIAL] JSDoc para funções públicas

Vais aprender o que é JSDoc e porque ajuda quando outras pessoas usam as tuas funções.

### O que é JSDoc

É um formato de comentário que descreve **o que a função recebe e devolve**. Ajuda o editor a mostrar dicas (autocomplete) e evita confusões.

### Exemplo

```js
/**
 * Cria uma tarefa.
 * @param {{ titulo: string }} data
 * @returns {Promise<object>}
 */
export async function createTarefa(data) {
    // ...
}
```

### Quando usar JSDoc

-   Funções partilhadas (utils, services, controllers).
-   Funções com parâmetros menos óbvios.
-   Funções que outros colegas vão usar.

### Exemplo com mais detalhe

```js
/**
 * Marca uma tarefa como feita.
 * @param {string} id - ID da tarefa.
 * @param {boolean} feito - Novo estado.
 * @returns {Promise<{ _id: string, feito: boolean }>}
 */
export async function updateTarefaFeito(id, feito) {
    // ...
}
```

### Nota

Se mudares a função, atualiza o JSDoc no mesmo momento.

<a id="sec-4"></a>

## 4. [EXTRA] Good vs bad comments

### Mau

```js
// Soma dois números
const total = a + b;
```

### Bom

```js
// Soma com arredondamento para evitar erros de ponto flutuante
const total = Math.round((a + b) * 100) / 100;
```

### Outro exemplo

```js
// Obtém dados do servidor
const response = await fetch(url);
```

Esse comentário é fraco porque não explica "porquê".

```js
// Faz fetch a cada 30s porque os dados mudam em tempo real
const response = await fetch(url);
```

<a id="erros-comuns"></a>

## Erros comuns

-   Comentários redundantes.
-   Nomes vagos como `data`, `info`.
-   JSDoc em tudo (só no que é público/importante).
-   Comentários desatualizados (dizem uma coisa, o código faz outra).

<a id="boas-práticas"></a>

## Boas práticas

-   Comentários curtos e raros.
-   Usa nomes que expliquem a intenção.
-   Documenta interfaces usadas por outros ficheiros.
-   Prefere explicar decisões em vez de descrever linhas.

<a id="checkpoint"></a>

## Checkpoint

-   Qual foi o último comentário útil que escreveste?
-   O teu código tem nomes que dispensam comentários óbvios?

<a id="exercícios"></a>

## Exercícios - Código

1. Reescreve 2 comentários redundantes para ficarem mais úteis.
2. Renomeia 3 variáveis com nomes melhores e justifica o porquê.
3. Adiciona JSDoc a 1 função pública e valida se o editor mostra dicas.
4. Escolhe uma função e escreve um comentário que explique uma decisão técnica.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro sobre documentação de código.
-   2026-01-14: expansão pedagógica com explicações e exemplos detalhados.
-   2026-01-14: checklist de documentação de código oficial.
-   2026-01-14: alinhado com a estrutura completa de documentação.
