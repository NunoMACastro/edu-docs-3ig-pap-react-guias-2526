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

## Erros e logs

- Usar contrato de erro padrao
- Nao expor segredos em logs

## Estrutura de ficheiros

- Separar controllers, services, repositories
- Evitar logica de negocio em controllers
