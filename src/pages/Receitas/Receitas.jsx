import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Receitas.css";
const API_URL = import.meta.env.VITE_API_URL;

function Receitas() {

    const navigate = useNavigate();

    const [receitas, setReceitas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const nomeUsuario =
        localStorage.getItem("nomeUsuario") || "Usuário";

    const fotoUsuario =
        localStorage.getItem("fotoUsuario");


    // =====================================
    // BUSCAR RECEITAS
    // =====================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch(
            `${API_URL}/transacoes`,
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        )
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
                        "Erro ao buscar receitas"
                    );
                }

                return response.json();
            })

            .then((data) => {

                const somenteReceitas =
                    data.filter(
                        (transacao) =>
                            transacao.tipo === "receita"
                    );

                setReceitas(
                    somenteReceitas
                );
            })

            .catch((error) => {

                console.error(
                    "Erro ao buscar receitas:",
                    error
                );
            })

            .finally(() => {

                setCarregando(false);

            });

    }, [navigate]);


    // =====================================
    // CALCULAR TOTAL
    // =====================================

    const totalReceitas =
        receitas.reduce(
            (total, receita) => {
                return (
                    total +
                    Number(receita.valor)
                );
            },
            0
        );


    // =====================================
    // FORMATAR VALOR
    // =====================================

    function formatarMoeda(valor) {

        return Number(valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    // =====================================
    // FORMATAR DATA
    // =====================================

    function formatarData(data) {

        if (!data) {
            return "";
        }

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );
    }


    // =====================================
    // LOGOUT
    // =====================================

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("fotoUsuario");

        navigate("/");
    }


    // =====================================
    // HTML
    // =====================================

    return (

        <div className="receitas-layout">


            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="receitas-sidebar">

                <h2 className="receitas-logo">
                    Finance App
                </h2>


                <nav className="receitas-menu">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/transacoes">
                        Transações
                    </Link>

                    <Link
                        to="/receitas"
                        className="receitas-active"
                    >
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


                <button
                    className="receitas-logout"
                    onClick={handleLogout}
                >
                    Sair
                </button>

            </aside>


            {/* =========================
                CONTEÚDO PRINCIPAL
            ========================= */}

            <div className="receitas-main">


                {/* HEADER */}

                <div className="receitas-header">

                    <div className="receitas-titulo">

                        <p>
                            Controle financeiro
                        </p>

                        <h1>
                            Receitas
                        </h1>

                    </div>


                    {/* USUÁRIO */}

                    <div className="receitas-user">

                        <div className="receitas-avatar">

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


                        <div className="receitas-user-info">

                            <strong>
                                {nomeUsuario}
                            </strong>

                            <span>
                                Minha conta
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    CARD TOTAL
                ========================= */}

                <div className="receitas-resumo">

                    <span className="receitas-resumo-titulo">
                        Total de receitas
                    </span>

                    <strong className="receitas-resumo-valor">

                        {formatarMoeda(
                            totalReceitas
                        )}

                    </strong>

                    <small>
                        Soma de todas as entradas cadastradas
                    </small>

                </div>


                {/* =========================
                    HISTÓRICO
                ========================= */}

                <div className="receitas-panel">


                    <div className="receitas-panel-header">

                        <div>

                            <span>
                                Entradas
                            </span>

                            <h2>
                                Histórico de receitas
                            </h2>

                        </div>


                        <Link
                            to="/transacoes"
                            className="receitas-nova"
                        >
                            Nova receita
                        </Link>

                    </div>


                    {/* CARREGANDO */}

                    {carregando && (

                        <p className="receitas-message">
                            Carregando receitas...
                        </p>

                    )}


                    {/* SEM RECEITAS */}

                    {!carregando &&
                        receitas.length === 0 && (

                            <p className="receitas-message">
                                Nenhuma receita cadastrada.
                            </p>

                        )}


                    {/* LISTA */}

                    {!carregando &&
                        receitas.length > 0 && (

                            <div className="receitas-lista">

                                {receitas.map(
                                    (receita) => (

                                        <div
                                            className="receita-item"
                                            key={receita.id}
                                        >

                                            <div className="receita-icon">
                                                +
                                            </div>


                                            <div className="receita-info">

                                                <strong>
                                                    {receita.descricao}
                                                </strong>

                                                <span>

                                                    {formatarData(
                                                        receita.data
                                                    )}

                                                </span>

                                            </div>


                                            <strong className="receita-valor">

                                                +{" "}

                                                {formatarMoeda(
                                                    receita.valor
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

export default Receitas;