import "./Transacoes.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Transacoes() {
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState("receita");
    const [data, setData] = useState("");

    const [transacoes, setTransacoes] = useState([]);

    // ID da transação que está sendo editada
    const [editandoId, setEditandoId] = useState(null);

    // =========================
    // Buscar transações
    // =========================

    useEffect(() => {
        fetch("http://localhost:3000/transacoes", {
            headers: {
                Authorization:
                    "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Erro ao buscar transações"
                    );
                }

                return response.json();
            })
            .then((data) => {
                setTransacoes(data);
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }, []);

    // =========================
    // Criar ou editar transação
    // =========================

    function handleSubmit(event) {
        event.preventDefault();

        // Se existir um ID sendo editado,
        // fazemos PUT
        if (editandoId !== null) {

            fetch(
                `http://localhost:3000/transacoes/${editandoId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")
                    },

                    body: JSON.stringify({
                        descricao,
                        valor,
                        tipo,
                        data
                    })
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            "Erro ao editar transação"
                        );
                    }

                    return response.json();
                })
                .then((dataResposta) => {
                    console.log(
                        "Resposta:",
                        dataResposta
                    );

                    alert(
                        "Transação editada com sucesso!"
                    );

                    // Atualiza a transação na tela
                    setTransacoes((listaAtual) =>
                        listaAtual.map((transacao) =>
                            transacao.id === editandoId
                                ? {
                                    ...transacao,
                                    descricao,
                                    valor,
                                    tipo,
                                    data
                                }
                                : transacao
                        )
                    );

                    limparFormulario();
                })
                .catch((error) => {
                    console.error("Erro:", error);

                    alert(
                        "Erro ao editar transação"
                    );
                });

            return;
        }

        // =========================
        // Criar nova transação
        // =========================

        fetch("http://localhost:3000/transacoes", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer " +
                    localStorage.getItem("token")
            },

            body: JSON.stringify({
                descricao,
                valor,
                tipo,
                data
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Erro ao cadastrar transação"
                    );
                }

                return response.json();
            })
            .then((dataResposta) => {
                console.log(
                    "Resposta:",
                    dataResposta
                );

                alert(
                    "Transação adicionada com sucesso!"
                );

                // Coloca a nova transação
                // imediatamente na lista
                setTransacoes((listaAtual) => [
                    {
                        id: dataResposta.transacaoId,
                        descricao,
                        valor,
                        tipo,
                        data
                    },

                    ...listaAtual
                ]);

                limparFormulario();
            })
            .catch((error) => {
                console.error("Erro:", error);

                alert(
                    "Erro ao cadastrar transação"
                );
            });
    }

    // =========================
    // Selecionar para editar
    // =========================

    function handleEditar(transacao) {
        setEditandoId(transacao.id);

        setDescricao(transacao.descricao);
        setValor(transacao.valor);
        setTipo(transacao.tipo);

        // MySQL pode devolver data com horário.
        // O input type="date" precisa de YYYY-MM-DD.
        setData(
            String(transacao.data).split("T")[0]
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // =========================
    // Cancelar edição
    // =========================

    function handleCancelarEdicao() {
        limparFormulario();
    }

    // =========================
    // Limpar formulário
    // =========================

    function limparFormulario() {
        setDescricao("");
        setValor("");
        setTipo("receita");
        setData("");

        setEditandoId(null);
    }

    // =========================
    // Excluir transação
    // =========================

    function handleExcluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta transação?"
        );

        if (!confirmar) {
            return;
        }

        fetch(
            `http://localhost:3000/transacoes/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        "Bearer " +
                        localStorage.getItem("token")
                }
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Erro ao excluir transação"
                    );
                }

                return response.json();
            })
            .then((dataResposta) => {
                console.log(
                    "Resposta:",
                    dataResposta
                );

                alert(
                    "Transação excluída com sucesso!"
                );

                setTransacoes((listaAtual) =>
                    listaAtual.filter(
                        (transacao) =>
                            transacao.id !== id
                    )
                );

                // Caso esteja editando
                // justamente a transação excluída
                if (editandoId === id) {
                    limparFormulario();
                }
            })
            .catch((error) => {
                console.error("Erro:", error);

                alert(
                    "Erro ao excluir transação"
                );
            });
    }

    return (
        <div className="transacoes-page">

            <div className="transacoes-topo">

                <Link
                    to="/dashboard"
                    className="btn-voltar"
                >
                    Voltar
                </Link>

                <div>
                    <h1>Transações</h1>

                    <p>
                        Gerencie suas receitas e despesas
                    </p>
                </div>

            </div>

            <form
                className="transacoes-form"
                onSubmit={handleSubmit}
            >

                <div>
                    <label>Descrição</label>

                    <input
                        type="text"
                        placeholder="Ex: Mercado"
                        value={descricao}
                        onChange={(e) =>
                            setDescricao(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Valor</label>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="R$ 0,00"
                        value={valor}
                        onChange={(e) =>
                            setValor(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Tipo</label>

                    <select
                        value={tipo}
                        onChange={(e) =>
                            setTipo(e.target.value)
                        }
                    >
                        <option value="receita">
                            Receita
                        </option>

                        <option value="despesa">
                            Despesa
                        </option>

                    </select>
                </div>

                <div>
                    <label>Data</label>

                    <input
                        type="date"
                        value={data}
                        onChange={(e) =>
                            setData(e.target.value)
                        }
                        required
                    />
                </div>

                <button type="submit">
                    {editandoId !== null
                        ? "Salvar alterações"
                        : "Adicionar transação"}
                </button>

                {editandoId !== null && (
                    <button
                        type="button"
                        className="btn-cancelar"
                        onClick={
                            handleCancelarEdicao
                        }
                    >
                        Cancelar edição
                    </button>
                )}

            </form>

            <div className="transacoes-lista">

                <div className="transacoes-lista-header">

                    <div>
                        <span>Histórico</span>

                        <h2>
                            Minhas transações
                        </h2>

                        <p>
                            Acompanhe suas últimas movimentações financeiras.
                        </p>
                    </div>

                </div>

                {transacoes.length === 0 ? (

                    <div className="transacoes-vazia">

                        <p>
                            Nenhuma transação encontrada.
                        </p>

                    </div>

                ) : (

                    <div className="transacoes-items">

                        {transacoes.map(
                            (transacao) => (

                                <div
                                    key={
                                        transacao.id
                                    }
                                    className="transacao-item"
                                >

                                    <div className="transacao-info">

                                        <div
                                            className={`transacao-icon ${
                                                transacao.tipo ===
                                                "receita"
                                                    ? "receita"
                                                    : "despesa"
                                            }`}
                                        >
                                            {transacao.tipo ===
                                            "receita"
                                                ? "+"
                                                : "-"}
                                        </div>

                                        <div>

                                            <strong>
                                                {
                                                    transacao.descricao
                                                }
                                            </strong>

                                            <span>
                                                {transacao.tipo ===
                                                "receita"
                                                    ? "Receita"
                                                    : "Despesa"}
                                            </span>

                                        </div>

                                    </div>

                                    <strong
                                        className={
                                            transacao.tipo ===
                                            "receita"
                                                ? "transacao-valor receita"
                                                : "transacao-valor despesa"
                                        }
                                    >

                                        {transacao.tipo ===
                                        "receita"
                                            ? "+"
                                            : "-"}{" "}

                                        R${" "}

                                        {Number(
                                            transacao.valor
                                        ).toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}

                                    </strong>

                                    <button
                                        className="btn-editar"
                                        onClick={() =>
                                            handleEditar(
                                                transacao
                                            )
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn-excluir"
                                        onClick={() =>
                                            handleExcluir(
                                                transacao.id
                                            )
                                        }
                                    >
                                        Excluir
                                    </button>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Transacoes;