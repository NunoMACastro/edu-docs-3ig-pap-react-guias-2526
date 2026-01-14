# Documentacao de Codigo

## Convencoes de nomes

- camelCase para variaveis e funcoes
- PascalCase para componentes e classes
- Funcoes com verbo: get/create/update/delete
- Booleanos: is/has/can/should

## Comentarios

- Explicar decisoes e contexto
- Evitar comentarios redundantes

## JSDoc

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

## Contratos internos (DTOs e services)

- Documentar entradas e saidas dos services
- Indicar campos obrigatorios e tipos
- Manter alinhado com API.md e DADOS.md

## Erros e logs

- Usar contrato de erro padrao
- Nao expor segredos em logs

## Estrutura de ficheiros

- Separar controllers, services, repositories
- Evitar logica de negocio em controllers

## Lint e formatacao (recomendado)

- ESLint para regras de estilo
- Prettier para formatacao automatica
