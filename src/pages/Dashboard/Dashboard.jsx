import "./Dashboard.css";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function Dashboard() {

    const [transacoes, setTransacoes] = useState([]);

    const [periodo, setPeriodo] = useState("mes");


    /* =========================
       BUSCAR TRANSAÇÕES
    ========================= */

    useEffect(() => {

        fetch("http://localhost:3000/transacoes", {
            headers: {
                Authorization:
                    "Bearer " +
                    localStorage.getItem("token")
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

                if (Array.isArray(data)) {

                    setTransacoes(data);

                } else {

                    console.log(
                        "Resposta do servidor:",
                        data
                    );

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


    /* =========================
       TOTAL DE RECEITAS
    ========================= */

    const receitas = transacoes

        .filter(
            (transacao) =>
                transacao.tipo === "receita"
        )

        .reduce(
            (total, transacao) =>
                total +
                Number(transacao.valor),

            0
        );


    /* =========================
       TOTAL DE DESPESAS
    ========================= */

    const despesas = transacoes

        .filter(
            (transacao) =>
                transacao.tipo === "despesa"
        )

        .reduce(
            (total, transacao) =>
                total +
                Number(transacao.valor),

            0
        );


    const saldo = receitas - despesas;


    /* =========================
       FORMATAR DINHEIRO
    ========================= */

    const formatarMoeda = (valor) => {

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    };


    /* =========================
       FILTRAR PERÍODO
    ========================= */

    const hoje = new Date();


    const transacoesFiltradas =
        transacoes.filter((transacao) => {

            const dataTransacao =
                new Date(transacao.data);


            /* ESTE MÊS */

            if (periodo === "mes") {

                return (
                    dataTransacao.getMonth() ===
                        hoje.getMonth()

                    &&

                    dataTransacao.getFullYear() ===
                        hoje.getFullYear()
                );

            }


            /* ÚLTIMOS 3 MESES */

            if (periodo === "3meses") {

                const tresMesesAtras =
                    new Date(hoje);

                tresMesesAtras.setMonth(
                    hoje.getMonth() - 2
                );

                tresMesesAtras.setDate(1);

                return (
                    dataTransacao >=
                    tresMesesAtras
                );

            }


            /* ESTE ANO */

            if (periodo === "ano") {

                return (
                    dataTransacao.getFullYear() ===
                    hoje.getFullYear()
                );

            }


            return true;

        });


    /* =========================
       NOMES DOS MESES
    ========================= */

    const nomesMeses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];


    /* =========================
       DEFINIR MESES DO GRÁFICO
    ========================= */

    let mesesExibidos = [];


    if (periodo === "mes") {

        mesesExibidos = [
            hoje.getMonth()
        ];

    }


    if (periodo === "3meses") {

        for (let i = 2; i >= 0; i--) {

            const dataMes =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth() - i,
                    1
                );

            mesesExibidos.push(
                dataMes.getMonth()
            );

        }

    }


    if (periodo === "ano") {

        mesesExibidos = [
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11
        ];

    }


    /* =========================
       CALCULAR VALORES POR MÊS
    ========================= */

    const receitasPorMes =
        mesesExibidos.map((mes) => {

            return transacoesFiltradas

                .filter((transacao) => {

                    const dataTransacao =
                        new Date(transacao.data);

                    return (
                        dataTransacao.getMonth() === mes
                        &&
                        transacao.tipo === "receita"
                    );

                })

                .reduce(
                    (total, transacao) =>
                        total +
                        Number(transacao.valor),

                    0
                );

        });


    const despesasPorMes =
        mesesExibidos.map((mes) => {

            return transacoesFiltradas

                .filter((transacao) => {

                    const dataTransacao =
                        new Date(transacao.data);

                    return (
                        dataTransacao.getMonth() === mes
                        &&
                        transacao.tipo === "despesa"
                    );

                })

                .reduce(
                    (total, transacao) =>
                        total +
                        Number(transacao.valor),

                    0
                );

        });


    /* =========================
       DADOS DO GRÁFICO
    ========================= */

    const dadosGrafico = {

        labels:
            mesesExibidos.map(
                (mes) =>
                    nomesMeses[mes]
            ),

        datasets: [

            {
                label: "Receitas",

                data:
                    receitasPorMes,

                backgroundColor:
                    "rgba(34, 197, 94, 0.75)",

                borderColor:
                    "rgb(34, 197, 94)",

                borderWidth: 1,

                borderRadius: 6
            },


            {
                label: "Despesas",

                data:
                    despesasPorMes,

                backgroundColor:
                    "rgba(239, 68, 68, 0.75)",

                borderColor:
                    "rgb(239, 68, 68)",

                borderWidth: 1,

                borderRadius: 6
            }

        ]

    };


    /* =========================
       OPÇÕES DO GRÁFICO
    ========================= */

    const opcoesGrafico = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {
                    color: "#cbd5e1"
                }

            },


            tooltip: {

                callbacks: {

                    label: function (context) {

                        return (
                            context.dataset.label +
                            ": " +
                            formatarMoeda(
                                context.raw
                            )
                        );

                    }

                }

            }

        },


        scales: {

            x: {

                ticks: {
                    color: "#cbd5e1"
                },

                grid: {
                    color:
                        "rgba(255,255,255,0.05)"
                }

            },


            y: {

                beginAtZero: true,

                ticks: {

                    color: "#94a3b8",

                    callback: function (value) {

                        return "R$ " + value;

                    }

                },

                grid: {

                    color:
                        "rgba(255,255,255,0.05)"

                }

            }

        }

    };


    return (

        <div className="dash-layout">


            {/* SIDEBAR */}

            <aside className="dash-sidebar">

                <h2 className="dash-logo">
                    Finance App
                </h2>


                <nav className="dash-menu">

                    <Link
                        className="dash-active"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>


                    <Link to="/transacoes">
                        Transações
                    </Link>


                    <Link to="/receitas">
                        Receitas
                    </Link>


                    <Link to="/despesas">
                        Despesas
                    </Link>


                    <Link to="/metas">
                        Metas
                    </Link>


                    <Link to="/perfil">
                        Perfil
                    </Link>

                </nav>


                <button className="dash-logout">
                    Sair
                </button>

            </aside>


            {/* CONTEÚDO */}

            <div className="dash-main">


                {/* HEADER */}

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


                {/* CARDS */}

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


                {/* CONTEÚDO INFERIOR */}

                <div className="dash-content-grid">


                    {/* GRÁFICO */}

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


                            <select
                                value={periodo}
                                onChange={(e) =>
                                    setPeriodo(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="mes">
                                    Este mês
                                </option>

                                <option value="3meses">
                                    Últimos 3 meses
                                </option>

                                <option value="ano">
                                    Este ano
                                </option>

                            </select>

                        </div>


                        <div className="dash-chart-area">

                            <Bar
                                data={dadosGrafico}
                                options={opcoesGrafico}
                            />

                        </div>


                    </div>


                    {/* ÚLTIMAS TRANSAÇÕES */}

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


                            <Link to="/transacoes">
                                Ver todas
                            </Link>

                        </div>


                        <div className="dash-transactions">


                            {transacoes.length === 0 ? (

                                <p>
                                    Nenhuma transação encontrada.
                                </p>

                            ) : (

                                transacoes

                                    .slice(0, 5)

                                    .map(
                                        (transacao) => (

                                            <div
                                                className="dash-transaction"
                                                key={
                                                    transacao.id
                                                }
                                            >


                                                <div
                                                    className={`dash-transaction-icon ${
                                                        transacao.tipo ===
                                                        "receita"
                                                            ? "income"
                                                            : "expense"
                                                    }`}
                                                >

                                                    {transacao.tipo ===
                                                    "receita"
                                                        ? "+"
                                                        : "-"}

                                                </div>


                                                <div className="dash-transaction-info">

                                                    <strong>
                                                        {
                                                            transacao.descricao
                                                        }
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
                                                        transacao.tipo ===
                                                        "receita"
                                                            ? "dash-income-value"
                                                            : "dash-expense-value"
                                                    }
                                                >

                                                    {transacao.tipo ===
                                                    "receita"
                                                        ? "+ "
                                                        : "- "}


                                                    {formatarMoeda(
                                                        Number(
                                                            transacao.valor
                                                        )
                                                    )}

                                                </strong>


                                            </div>

                                        )
                                    )

                            )}


                        </div>


                    </div>


                </div>


            </div>


        </div>

    );

}


export default Dashboard;