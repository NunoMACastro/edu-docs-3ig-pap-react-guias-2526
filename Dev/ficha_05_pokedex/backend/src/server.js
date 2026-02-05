/* backend/src/server.js */
// "import" traz codigo de outro ficheiro.
// Aqui trazemos a configuracao da app Express (middlewares + rotas).
import app from "./app.js";

// "const" cria uma constante (o valor nao deve mudar).
// Porta onde o servidor vai ficar "a ouvir" pedidos HTTP.
const PORT = 3000;

// app.listen abre a porta e fica a ouvir pedidos.
// A funcao dentro de listen corre quando o servidor esta pronto.
app.listen(PORT, () => {
    // Template string: usa ${PORT} para juntar texto + valor.
    console.log(`API a correr em http://localhost:${PORT}`);
});
