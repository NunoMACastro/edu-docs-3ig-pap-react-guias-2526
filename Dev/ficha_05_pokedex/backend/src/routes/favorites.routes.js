/* backend/src/routes/favorites.routes.js */
import { Router } from "express";

// Cria um router dedicado a esta feature (favoritos).
// Router() e como uma mini-app dentro do Express.
const router = Router();

// Estado em memoria: comeca com alguns ids para testar.
let favorites = [1, 4, 25];

// Helper para manter o formato de erro sempre igual.
// Assim o frontend sabe sempre onde esta a mensagem de erro.
// details tem valor por defeito: [] (array vazio).
function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

// Converte e valida o id (tem de ser inteiro positivo).
// parseId recebe um valor (string/numero) e devolve numero ou null.
function parseId(value) {
    // Number(...) tenta converter string -> numero.
    const numericId = Number(value);

    // Number.isInteger garante que nao e 2.5, NaN, etc.
    if (!Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }

    return numericId;
}

// GET /api/favorites
// (req, res) sao os objetos de request e response do Express.
router.get("/", (req, res) => {
    // Devolve o array completo de ids favoritos.
    res.status(200).json(favorites);
});

// POST /api/favorites
router.post("/", (req, res) => {
    // O id vem do body (JSON).
    // req.body pode ser undefined se faltar express.json().
    // Desestruturacao: const { id } = ... apanha a propriedade "id".
    const { id } = req.body || {};
    const numericId = parseId(id);

    // Body invalido -> 422 (dados invalidos no body).
    if (!numericId) {
        // return para parar aqui e nao continuar a funcao.
        return sendError(
            res,
            422,
            "VALIDATION_ERROR",
            "Id obrigatorio e numerico",
        );
    }

    // Evita duplicados.
    // includes verifica se o array ja tem aquele numero.
    if (favorites.includes(numericId)) {
        return sendError(res, 409, "DUPLICATE_KEY", "Pokemon ja e favorito");
    }

    // Atualiza o array de forma imutavel.
    // Usamos [...] para criar um novo array (boa pratica em JS/React).
    // O operador ... "espalha" (spread) os valores do array antigo.
    favorites = [...favorites, numericId];
    res.status(201).json({ id: numericId });
});

// DELETE /api/favorites/:id
router.delete("/:id", (req, res) => {
    // O id vem da URL (params).
    // req.params.id e sempre string, por isso validamos.
    const numericId = parseId(req.params.id);

    // Param invalido -> 400 (problema no URL).
    if (!numericId) {
        return sendError(res, 400, "INVALID_ID", "Id invalido");
    }

    // Se nao existir, devolve 404.
    if (!favorites.includes(numericId)) {
        return sendError(res, 404, "NOT_FOUND", "Favorito nao encontrado");
    }

    // Remove o id e devolve confirmacao.
    // filter cria um novo array sem o id escolhido.
    // (id) => id !== numericId e uma funcao que diz o que fica.
    favorites = favorites.filter((id) => id !== numericId);
    res.status(200).json({ id: numericId });
});

// Exporta o router para ser ligado no app.js.
export default router;
