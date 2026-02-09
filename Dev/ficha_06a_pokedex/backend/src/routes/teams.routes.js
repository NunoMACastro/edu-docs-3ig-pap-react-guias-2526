import { Router } from "express";

const router = Router();

router.get("/", (_req, res) =>
    res.status(501).json({
        error: {
            code: "NOT_READY",
            message: "Secção 06B ainda não aplicada",
        },
    }),
);

export default router;
