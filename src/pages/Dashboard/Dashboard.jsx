import "./Dashboard.css";
import { useEffect, useState } from "react";;

function Dashboard() {
    const [transacoes, setTransacoes] = useState([]);

    useEffect(() => {
    fetch("http://localhost:3000/transacoes", {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token"),
        },
    })
        .then((response) => response.json())
        .then((data) => {

            if (Array.isArray(data)) {
                setTransacoes(data);
            } else {
                console.log("Resposta do servidor:", data);
                setTransacoes([]);
            }

        })
        .catch((error) => {
            console.error(
                "Erro ao buscar transações:",
                error
            );
        });
}, []);

    const receitas = transacoes
        .filter((transacao) => transacao.tipo === "receita")
        .reduce(
            (total, transacao) =>
                total + Number(transacao.valor),
            0
        );

    const despesas = transacoes
        .filter((transacao) => transacao.tipo === "despesa")
        .reduce(
            (total, transacao) =>
                total + Number(transacao.valor),
            0
        );

    const saldo = receitas - despesas;

    const formatarMoeda = (valor) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    return (
        <div className="dash-layout">

            <aside className="dash-sidebar">
                <h2 className="dash-logo">
                    Finance App
                </h2>

                <nav className="dash-menu">
                    <a
                        className="dash-active"
                        href="#"
                    >
                        Dashboard
                    </a>

                    <a href="#">Transações</a>
                    <a href="#">Receitas</a>
                    <a href="#">Despesas</a>
                    <a href="#">Metas</a>
                    <a href="#">Perfil</a>
                </nav>

                <button className="dash-logout">
                    Sair
                </button>
            </aside>

            <div className="dash-main">

                <header className="dash-header">
                    <div>
                        <p>
                            Visão geral financeira
                        </p>

                        <h1>
                            Dashboard
                        </h1>
                    </div>

                    <div className="dash-user">
                        <div className="dash-avatar">
                            C
                        </div>

                        <div>
                            <strong>
                                Caio Luan
                            </strong>

                            <span>
                                Minha conta
                            </span>
                        </div>
                    </div>
                </header>

                <div className="dash-cards">

                    <div className="dash-card dash-balance">
                        <span>
                            Saldo atual
                        </span>

                        <strong>
                            {formatarMoeda(saldo)}
                        </strong>

                        <small>
                            Saldo disponível
                        </small>
                    </div>

                    <div className="dash-card">
                        <span>
                            Receitas
                        </span>

                        <strong>
                            {formatarMoeda(receitas)}
                        </strong>

                        <small>
                            Total de entradas
                        </small>
                    </div>

                    <div className="dash-card">
                        <span>
                            Despesas
                        </span>

                        <strong>
                            {formatarMoeda(despesas)}
                        </strong>

                        <small>
                            Total de saídas
                        </small>
                    </div>

                </div>

                <div className="dash-content-grid">

                    <div className="dash-panel dash-chart">

                        <div className="dash-panel-header">
                            <div>
                                <span>
                                    Resumo financeiro
                                </span>

                                <h2>
                                    Receitas x Despesas
                                </h2>
                            </div>

                            <select>
                                <option>
                                    Este mês
                                </option>

                                <option>
                                    Últimos 3 meses
                                </option>

                                <option>
                                    Este ano
                                </option>
                            </select>
                        </div>

                        <div className="dash-chart-area">
                            <strong>
                                Gráfico financeiro
                            </strong>

                            <span>
                                Os dados serão exibidos aqui
                            </span>
                        </div>

                    </div>

                    <div className="dash-panel">

                        <div className="dash-panel-header">
                            <div>
                                <span>
                                    Movimentações
                                </span>

                                <h2>
                                    Últimas transações
                                </h2>
                            </div>

                            <button>
                                Ver todas
                            </button>
                        </div>

                        <div className="dash-transactions">

                            {transacoes.length === 0 ? (
                                <p>
                                    Nenhuma transação encontrada.
                                </p>
                            ) : (
                                transacoes
                                    .slice(0, 5)
                                    .map((transacao) => (
                                        <div
                                            className="dash-transaction"
                                            key={transacao.id}
                                        >
                                            <div
                                                className={`dash-transaction-icon ${
                                                    transacao.tipo === "receita"
                                                        ? "income"
                                                        : "expense"
                                                }`}
                                            >
                                                {transacao.tipo === "receita"
                                                    ? "+"
                                                    : "-"}
                                            </div>

                                            <div className="dash-transaction-info">
                                                <strong>
                                                    {transacao.descricao}
                                                </strong>

                                                <span>
                                                    {new Date(
                                                        transacao.data
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </span>
                                            </div>

                                            <strong
                                                className={
                                                    transacao.tipo === "receita"
                                                        ? "dash-income-value"
                                                        : "dash-expense-value"
                                                }
                                            >
                                                {transacao.tipo === "receita"
                                                    ? "+ "
                                                    : "- "}
                                                {formatarMoeda(
                                                    Number(
                                                        transacao.valor
                                                    )
                                                )}
                                            </strong>
                                        </div>
                                    ))
                            )}

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;