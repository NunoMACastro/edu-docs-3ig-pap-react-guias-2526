import { useEffect, useState } from "react";
import Section from "../components/Section.jsx";

/*
Este componente demonstra a diferença entre comunicação síncrona e assíncrona
usando promessas e async/await. Existem três modos principais:

1. Bloqueante: simula uma operação síncrona que bloqueia a UI.
2. Assíncrono em sequência: executa pedidos um após o outro sem bloquear a UI.
3. Assíncrono em paralelo: executa todos os pedidos ao mesmo tempo sem bloquear a UI.

O componente também mede quantas vezes a UI consegue atualizar (ticks)
durante a execução dos pedidos, evidenciando o impacto do bloqueio
na responsividade da interface.

A seguir temos a lista de pedidos e funções auxiliares para simular
atrasos e bloqueios.
*/

const pedidosBase = [
    { id: "A", label: "Pedido A", ms: 1200 },
    { id: "B", label: "Pedido B", ms: 1600 },
    { id: "C", label: "Pedido C", ms: 900 },
];

/**
 * Espera assíncrona simples.
 * Conceito: Promise + setTimeout simulam tarefas demoradas.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Bloqueio síncrono do thread principal.
 * Conceito: loop ocupa a CPU e impede a UI de atualizar.
 * @param {number} ms
 */
function bloquear(ms) {
    const fim = performance.now() + ms;
    while (performance.now() < fim) {
        // Simula CPU ocupada (UI bloqueada).
    }
}

/**
 * Cria uma cópia dos pedidos com estado inicial.
 * Conceito: não alterar dados base, criar novos objetos.
 * @returns {Array}
 */
function criarPedidos() {
    return pedidosBase.map((pedido) => ({
        ...pedido,
        state: "ready",
        progress: 0,
    }));
}

/**
 * Secção de comunicação síncrona vs assíncrona.
 * Mostra bloqueio, sequência e paralelo com indicadores visuais simples.
 */
function AsyncBasico() {
    const [logs, setLogs] = useState([]);
    const [modo, setModo] = useState("idle");
    const [ticks, setTicks] = useState(0);
    const [pedidos, setPedidos] = useState(criarPedidos);

    useEffect(() => {
        if (modo === "idle" || modo === "done") {
            return;
        }

        let animationId;
        const loop = () => {
            setTicks((prev) => prev + 1);
            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [modo]);

    /**
     * Atualiza o estado de um pedido específico.
     * Conceito: map cria um novo array com o item atualizado.
     * @param {string} id
     * @param {object} patch
     */
    function atualizarPedido(id, patch) {
        setPedidos((prev) =>
            prev.map((pedido) =>
                pedido.id === id ? { ...pedido, ...patch } : pedido
            )
        );
    }

    /**
     * Executa um pedido e atualiza o progresso em passos.
     * Conceito: await pausa a função sem bloquear a UI.
     * @param {{id: string, label: string, ms: number}} pedido
     */
    async function executarPedido(pedido) {
        atualizarPedido(pedido.id, { state: "running", progress: 0 });
        setLogs((prev) => [...prev, `${pedido.label} iniciou`]);

        const passos = 5;
        for (let i = 1; i <= passos; i += 1) {
            await esperar(pedido.ms / passos);
            atualizarPedido(pedido.id, { progress: i * 20 });
        }

        atualizarPedido(pedido.id, { state: "done", progress: 100 });
        setLogs((prev) => [...prev, `${pedido.label} terminou`]);
    }

    /**
     * Limpa os logs e repõe o estado inicial.
     */
    function limpar() {
        setLogs([]);
        setModo("idle");
        setTicks(0);
        setPedidos(criarPedidos());
    }

    /**
     * Simula pedido síncrono bloqueante.
     * Usa setTimeout(0) para garantir render antes do bloqueio.
     */
    function correrBloqueante() {
        setTicks(0);
        setModo("blocking");
        setLogs(["1) Início", "2) Pedido síncrono (UI bloqueada)"]);
        const bloqueio = criarPedidos().map((pedido, index) =>
            index === 0
                ? {
                    ...pedido,
                    label: "Pedido S",
                    state: "running",
                    progress: 0,
                }
                : pedido
        );
        setPedidos(bloqueio);

        setTimeout(() => {
            bloquear(3400);
            atualizarPedido("A", { state: "done", progress: 100 });
            setLogs((prev) => [
                ...prev,
                "3) Resposta recebida (síncrono)",
            ]);
            setModo("done");
        }, 0);
    }

    /**
     * Executa pedidos de forma sequencial (um a um).
     * Conceito: await em série cria "fila".
     */
    async function correrSequencia() {
        setTicks(0);
        setModo("seq");
        setLogs(["1) Início", "2) Pedidos em sequência"]);
        setPedidos(criarPedidos());

        try {
            for (const pedido of pedidosBase) {
                await executarPedido(pedido);
            }
            setLogs((prev) => [...prev, "3) Sequência concluída"]);
            setModo("done");
        } catch {
            setLogs((prev) => [...prev, "Erro nos pedidos"]);
            setModo("error");
        }
    }

    /**
     * Executa pedidos em paralelo com Promise.all.
     * Conceito: tarefas independentes correm ao mesmo tempo.
     */
    async function correrParalelo() {
        setTicks(0);
        setModo("par");
        setLogs(["1) Início", "2) Pedidos em paralelo"]);
        setPedidos(criarPedidos());

        try {
            await Promise.all(pedidosBase.map((pedido) => executarPedido(pedido)));
            setLogs((prev) => [...prev, "3) Paralelo concluído"]);
            setModo("done");
        } catch {
            setLogs((prev) => [...prev, "Erro nos pedidos"]);
            setModo("error");
        }
    }

    const statusLabel = {
        idle: "Pronto",
        blocking: "Bloqueado",
        seq: "Assíncrono (sequência)",
        par: "Assíncrono (paralelo)",
        done: "Concluído",
        error: "Erro",
    }[modo];

    return (
        <Section
            step={7}
            title="Comunicação síncrona e assíncrona"
            subtitle="Promessas e async/await controlam tarefas que demoram."
            accent="#2f6f7e"
        >
            <div className="panel">
                <div className="note">
                    As batidas medem quantas vezes a UI consegue atualizar.
                    No bloqueante elas param; no assíncrono continuam.
                </div>
                <div className="button-row">
                    <button onClick={correrBloqueante}>Bloqueante</button>
                    <button className="alt" onClick={correrSequencia}>
                        Assíncrono (sequência)
                    </button>
                    <button className="alt" onClick={correrParalelo}>
                        Assíncrono (paralelo)
                    </button>
                    <button className="ghost" onClick={limpar}>
                        Limpar
                    </button>
                </div>
                <p className="status">Estado: {statusLabel}</p>
                <p className="panel__text">UI viva: {ticks} batidas</p>
                <div className="form__row">
                    <label htmlFor="teste-ui">Teste de UI</label>
                    <input
                        id="teste-ui"
                        placeholder="Tenta escrever aqui..."
                    />
                </div>
                <div className="panel panel--grid">
                    {pedidos.map((pedido) => (
                        <div className="mini-card" key={pedido.id}>
                            <p className="mini-card__title">{pedido.label}</p>
                            <p className="panel__text">
                                {pedido.state === "ready" && "Pronto"}
                                {pedido.state === "running" && "A correr"}
                                {pedido.state === "done" && "Concluído"}
                            </p>
                            <p className="panel__text">
                                Progresso: {pedido.progress}%
                            </p>
                        </div>
                    ))}
                </div>
                <ul className="log">
                    {logs.length === 0 ? (
                        <li>Sem logs ainda.</li>
                    ) : (
                        logs.map((linha, index) => (
                            <li key={`${linha}-${index}`}>{linha}</li>
                        ))
                    )}
                </ul>
            </div>
        </Section>
    );
}

export default AsyncBasico;
