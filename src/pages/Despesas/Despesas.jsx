import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Despesas.css";

function Despesas() {
    const navigate = useNavigate();

    const [despesas, setDespesas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const nomeUsuario =
        localStorage.getItem("nomeUsuario") || "Usuário";

    const fotoUsuario =
        localStorage.getItem("fotoUsuario");


    // =========================
    // BUSCAR DESPESAS
    // =========================

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:3000/transacoes", {
            headers: {
                Authorization:
                    "Bearer " + token
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("nomeUsuario");
                    localStorage.removeItem("fotoUsuario");

                    navigate("/");

                    throw new Error(
                        "Sessão expirada"
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        "Erro ao buscar despesas"
                    );
                }

                return response.json();
            })

            .then((data) => {
                const somenteDespesas =
                    data.filter(
                        (transacao) =>
                            transacao.tipo === "despesa"
                    );

                setDespesas(
                    somenteDespesas
                );
            })

            .catch((error) => {
                console.error(
                    "Erro ao buscar despesas:",
                    error
                );
            })

            .finally(() => {
                setCarregando(false);
            });

    }, [navigate]);


    // =========================
    // TOTAL
    // =========================

    const totalDespesas =
        despesas.reduce(
            (total, despesa) =>
                total +
                Number(despesa.valor),
            0
        );


    // =========================
    // FORMATAR MOEDA
    // =========================

    function formatarMoeda(valor) {
        return Number(valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    // =========================
    // FORMATAR DATA
    // =========================

    function formatarData(data) {
        if (!data) {
            return "";
        }

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );
    }


    // =========================
    // LOGOUT
    // =========================

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("fotoUsuario");

        navigate("/");
    }


    return (
        <div className="despesas-layout">

            <aside className="despesas-sidebar">

                <h2>
                    Finance App
                </h2>

                <nav>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/transacoes">
                        Transações
                    </Link>

                    <Link to="/receitas">
                        Receitas
                    </Link>

                    <Link
                        className="despesas-active"
                        to="/despesas"
                    >
                        Despesas
                    </Link>

                    <Link to="/metas">
                        Metas
                    </Link>

                    <Link to="/perfil">
                        Perfil
                    </Link>

                </nav>

                <button
                    onClick={handleLogout}
                >
                    Sair
                </button>

            </aside>


            <div className="despesas-main">

                <div className="despesas-header">

                    <div>

                        <p>
                            Controle financeiro
                        </p>

                        <h1>
                            Despesas
                        </h1>

                    </div>


                    <div className="despesas-user">

                        <div className="despesas-avatar">

                            {fotoUsuario ? (

                                <img
                                    src={fotoUsuario}
                                    alt={nomeUsuario}
                                />

                            ) : (

                                nomeUsuario
                                    .charAt(0)
                                    .toUpperCase()

                            )}

                        </div>


                        <div>

                            <strong>
                                {nomeUsuario}
                            </strong>

                            <span>
                                Minha conta
                            </span>

                        </div>

                    </div>

                </div>


                <div className="despesas-resumo">

                    <span>
                        Total de despesas
                    </span>

                    <strong>
                        {formatarMoeda(
                            totalDespesas
                        )}
                    </strong>

                    <small>
                        Todas as saídas cadastradas
                    </small>

                </div>


                <div className="despesas-panel">

                    <div className="despesas-panel-header">

                        <div>

                            <span>
                                Saídas
                            </span>

                            <h2>
                                Histórico de despesas
                            </h2>

                        </div>


                        <Link to="/transacoes">
                            Nova despesa
                        </Link>

                    </div>


                    {carregando ? (

                        <p className="despesas-message">
                            Carregando despesas...
                        </p>

                    ) : despesas.length === 0 ? (

                        <p className="despesas-message">
                            Nenhuma despesa cadastrada.
                        </p>

                    ) : (

                        <div className="despesas-lista">

                            {despesas.map(
                                (despesa) => (

                                    <div
                                        className="despesa-item"
                                        key={despesa.id}
                                    >

                                        <div className="despesa-icon">
                                            -
                                        </div>


                                        <div className="despesa-info">

                                            <strong>
                                                {despesa.descricao}
                                            </strong>

                                            <span>
                                                {formatarData(
                                                    despesa.data
                                                )}
                                            </span>

                                        </div>


                                        <strong className="despesa-valor">

                                            -{" "}

                                            {formatarMoeda(
                                                despesa.valor
                                            )}

                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Despesas;