# Documentação (12.º Ano) - 08 · Deploy e operação

> **Objetivo deste ficheiro**
> Diferenciar ambientes dev e prod.
> Explicar como guardar segredos.
> Documentar logs, monitorização e backups.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Ambientes (dev/prod)](#sec-1)
-   [2. [ESSENCIAL] Segredos e .env](#sec-2)
-   [3. [ESSENCIAL] Logs e monitorização](#sec-3)
-   [4. [ESSENCIAL] Backup e restore](#sec-4)
-   [Erros comuns](#erros-comuns)
-   [Boas práticas](#boas-práticas)
-   [Checkpoint](#checkpoint)
-   [Exercícios - Deploy](#exercícios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

Aqui vais aprender a **explicar como o teu projeto funciona quando sai do teu computador**. O objetivo não é fazer deploy agora, é saber **o que tens de documentar** para alguém conseguir correr e manter o projeto com segurança.

Antes de avançares, duas definições rápidas:

-   **Deploy:** colocar a app num servidor para outras pessoas usarem.
-   **Operação:** manter a app a funcionar (logs, backups, segurança, monitorização).

### Checklist de operação oficial

-   URLs e ambientes (dev/prod).
-   Variáveis de ambiente e segredos.
-   Logs e monitorização.
-   Backups e restore.
-   Responsáveis e contactos em caso de falha.

Este ficheiro corresponde ao `DEPLOY.md` da estrutura mínima e completa.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Ambientes (dev/prod)

Vais perceber porque o projeto **não se comporta igual** em dev e em prod, e o que tens de escrever para evitar confusões.

### O que é dev e o que é prod (explicação simples)

-   **dev (desenvolvimento):** ambiente para programar, testar e errar. Mostra mais informação para poderes corrigir rápido.
-   **prod (produção):** ambiente real, com utilizadores reais. Deve ser estável, seguro e com menos detalhes expostos.

### Porque isto importa

Se não explicares isto, alguém pode:

-   Correr o projeto em modo errado.
-   Mostrar erros sensíveis aos utilizadores.
-   Usar dados reais quando queria testar.

### Modelo mental

-   **dev:** mais logs, mais erros visíveis.
-   **prod:** menos detalhes, mais segurança.

### O que tens de documentar

-   URLs de frontend e backend em dev e em prod.
-   Variáveis que mudam entre ambientes.
-   Comandos de build e arranque.

### Exemplo de bloco de documentação

```text
Ambiente dev
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- NODE_ENV=development

Ambiente prod
- Frontend: https://app.exemplo.pt
- Backend: https://api.exemplo.pt
- NODE_ENV=production
```

### Dica

Em dev usas dados de teste. Em prod usas dados reais. Nunca mistures.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Segredos e .env

Vais aprender a **separar configurações normais de segredos** e a explicar isto na documentação.

### O que são variáveis de ambiente (explicação simples)

São valores que **ficam fora do código** e mudam entre computadores/servidores. O código lê estes valores quando arranca.

-   No backend, é comum usar `process.env`.
-   No frontend (com Vite), é comum usar `import.meta.env`.

### O que é um segredo (explicação simples)

Um segredo é **um valor que não pode aparecer no Git nem no código**. Se alguém o vir, pode entrar no teu sistema.

### Regras básicas

-   Nunca guardar passwords no código.
-   Usar `.env` e variáveis do host.
-   Não enviar `.env` para Git.

### Exemplos de segredos

-   Passwords, tokens, chaves de API.
-   Strings de ligação a bases de dados.

### Exemplo de `.env.example`

```text
PORT=3000
MONGODB_URI=...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173
```

### Como documentar

-   Lista as variáveis por ambiente.
-   Explica para que serve cada uma.
-   Diz onde a pessoa deve colocar o valor real.

<a id="sec-3"></a>

## 3. [ESSENCIAL] Logs e monitorização

Vais perceber o que são logs e monitorização e como descrever isso de forma simples.

### O que são logs (explicação simples)

Logs são **mensagens que o programa escreve** para dizer o que está a acontecer. São como um diário do sistema.

### Para que servem

-   Perceber o que correu bem ou mal.
-   Encontrar erros mais rápido.
-   Ver quanto tempo um pedido demorou.

### Como fazer logs (exemplo simples)

```js
console.log("Servidor arrancou na porta 3000");
console.warn("Pedido lento: /api/tarefas");
console.error("Erro ao ligar à base de dados");
```

### Níveis de log (explicação curta)

-   **info:** algo normal aconteceu.
-   **warn:** algo estranho, mas não bloqueia.
-   **error:** algo falhou e precisa de atenção.

### O que documentar

-   Onde ver logs.
-   Níveis de log (info, warn, error).
-   O que fazer quando há erro.
-   Se os logs ficam guardados ou só aparecem no terminal.

### Exemplo de log útil

```text
[2026-01-14 10:32] INFO GET /api/tarefas 200 12ms
```

### Diferença entre logs e monitorização

-   **Logs** explicam o que já aconteceu.
-   **Monitorização** avisa quando algo está a acontecer agora (ou deixou de funcionar).

### Monitorização (explicação simples)

Monitorização é **saber se o serviço está vivo**. Pode ser só:

-   Um endpoint `GET /health` que responde 200.
-   Um aviso quando o servidor cai.

### Dica

Não guardes segredos nos logs e escreve quem deve ser contactado quando algo falha (professor, colega, equipa).

<a id="sec-4"></a>

## 4. [ESSENCIAL] Backup e restore

Vais aprender porque backup não é opcional e como explicar o processo de forma clara.

### O que é backup e restore (explicação simples)

-   **Backup:** guardar uma cópia dos dados.
-   **Restore:** voltar a colocar esses dados quando algo corre mal.

Sem backups, um erro ou ataque pode destruir o trabalho de semanas.

### Exemplo

-   `mongodump` para backup completo.
-   `mongorestore` para recuperar.

### Exemplo de comandos

```bash
mongodump --uri "$MONGODB_URI" --out ./backups/2026-01-14
mongorestore --uri "$MONGODB_URI" ./backups/2026-01-14
```

### Nota

Indica onde guardar backups e quem tem acesso.

### O que documentar

-   Frequência dos backups (diário, semanal).
-   Onde ficam guardados.
-   Quem pode restaurar.

<a id="erros-comuns"></a>

## Erros comuns

-   Misturar `.env` de dev com prod.
-   Logs com dados sensíveis.
-   Não documentar backups.
-   Não testar o restore.
-   Deixar variáveis de ambiente sem descrição.

<a id="boas-práticas"></a>

## Boas práticas

-   Documenta passos de deploy com listas numeradas.
-   Guarda segredos fora do repositório.
-   Define quem faz restore e quando.
-   Usa exemplos curtos e reais.
-   Atualiza quando mudares infraestrutura.

<a id="checkpoint"></a>

## Checkpoint

-   Sabes onde estão os logs do teu backend?
-   Consegues explicar a diferença entre dev e prod em 2 frases?
-   Tens um plano de backup e restore escrito?

<a id="exercícios"></a>

## Exercícios - Deploy

1. Descreve a diferença entre dev e prod no teu projeto (2 frases).
2. Lista todas as variáveis de ambiente usadas e para que servem.
3. Escreve um parágrafo sobre backups: onde, quando e quem.
4. Cria um bloco de documentação com URLs de dev e prod.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro sobre deploy e operação.
-   2026-01-14: expansão pedagógica com exemplos e guias de documentação.
-   2026-01-14: explicações de conceitos base (dev/prod, logs, monitorização, backups).
-   2026-01-14: checklist de operação oficial e alinhamento com estrutura mínima/completa.
