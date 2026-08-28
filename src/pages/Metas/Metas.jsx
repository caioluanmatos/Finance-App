import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Metas.css";

function Metas() {
    const navigate = useNavigate();

    const [metas, setMetas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [editandoId, setEditandoId] =
        useState(null);

    const [nome, setNome] =
        useState("");

    const [valorMeta, setValorMeta] =
        useState("");

    const [valorAtual, setValorAtual] =
        useState("");


    const nomeUsuario =
        localStorage.getItem("nomeUsuario") || "Usuário";

    const fotoUsuario =
        localStorage.getItem("fotoUsuario");


    // =====================================
    // TOKEN
    // =====================================

    const token =
        localStorage.getItem("token");


    // =====================================
    // BUSCAR METAS
    // =====================================

    function buscarMetas() {

        if (!token) {
            navigate("/");
            return;
        }

        setCarregando(true);

        fetch(
            "http://localhost:3000/metas",
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
                        "Erro ao buscar metas"
                    );
                }

                return response.json();
            })

            .then((data) => {

                setMetas(data);

            })

            .catch((error) => {

                console.error(
                    "Erro ao buscar metas:",
                    error
                );

            })

            .finally(() => {

                setCarregando(false);

            });
    }


    useEffect(() => {

        buscarMetas();

    }, []);


    // =====================================
    // FORMATAR MOEDA
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
    // CALCULAR PROGRESSO
    // =====================================

    function calcularProgresso(
        valorAtualMeta,
        valorMetaTotal
    ) {

        const atual =
            Number(valorAtualMeta);

        const total =
            Number(valorMetaTotal);

        if (total <= 0) {
            return 0;
        }

        const progresso =
            (atual / total) * 100;

        return Math.min(
            Math.round(progresso),
            100
        );
    }


    // =====================================
    // ABRIR FORMULÁRIO
    // =====================================

    function abrirNovaMeta() {

        setEditandoId(null);

        setNome("");
        setValorMeta("");
        setValorAtual("");

        setMostrarFormulario(true);
    }


    // =====================================
    // EDITAR META
    // =====================================

    function prepararEdicao(meta) {

        setEditandoId(meta.id);

        setNome(meta.nome);

        setValorMeta(
            String(meta.valor_meta)
        );

        setValorAtual(
            String(meta.valor_atual)
        );

        setMostrarFormulario(true);
    }


    // =====================================
    // CANCELAR
    // =====================================

    function cancelarFormulario() {

        setMostrarFormulario(false);

        setEditandoId(null);

        setNome("");
        setValorMeta("");
        setValorAtual("");
    }


    // =====================================
    // SALVAR META
    // =====================================

    function handleSubmit(event) {

        event.preventDefault();


        if (
            !nome ||
            !valorMeta
        ) {

            alert(
                "Preencha o nome e o valor da meta."
            );

            return;
        }


        if (
            Number(valorMeta) <= 0 ||
            Number(valorAtual || 0) < 0
        ) {

            alert(
                "Informe valores válidos."
            );

            return;
        }


        const dados = {

            nome,

            valor_meta:
                Number(valorMeta),

            valor_atual:
                Number(valorAtual || 0)

        };


        const url =
            editandoId
                ? `http://localhost:3000/metas/${editandoId}`
                : "http://localhost:3000/metas";


        const metodo =
            editandoId
                ? "PUT"
                : "POST";


        fetch(url, {

            method: metodo,

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    "Bearer " + token

            },

            body:
                JSON.stringify(dados)

        })

            .then((response) => {

                if (!response.ok) {

                    return response
                        .json()
                        .then((data) => {

                            throw new Error(
                                data.mensagem ||
                                "Erro ao salvar meta"
                            );

                        });

                }

                return response.json();
            })

            .then((data) => {

                alert(data.mensagem);

                cancelarFormulario();

                buscarMetas();

            })

            .catch((error) => {

                console.error(
                    "Erro ao salvar meta:",
                    error
                );

                alert(error.message);

            });
    }


    // =====================================
    // EXCLUIR META
    // =====================================

    function excluirMeta(id) {

        const confirmar =
            window.confirm(
                "Deseja realmente excluir esta meta?"
            );

        if (!confirmar) {
            return;
        }


        fetch(
            `http://localhost:3000/metas/${id}`,
            {

                method: "DELETE",

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }
        )

            .then((response) => {

                if (!response.ok) {

                    return response
                        .json()
                        .then((data) => {

                            throw new Error(
                                data.mensagem ||
                                "Erro ao excluir meta"
                            );

                        });

                }

                return response.json();
            })

            .then((data) => {

                alert(data.mensagem);

                buscarMetas();

            })

            .catch((error) => {

                console.error(
                    "Erro ao excluir meta:",
                    error
                );

                alert(error.message);

            });
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

        <div className="metas-layout">


            {/* SIDEBAR */}

            <aside className="metas-sidebar">

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

                    <Link to="/despesas">
                        Despesas
                    </Link>

                    <Link
                        to="/metas"
                        className="metas-active"
                    >
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


            {/* CONTEÚDO */}

            <div className="metas-main">


                {/* HEADER */}

                <div className="metas-header">

                    <div>

                        <p>
                            Planejamento financeiro
                        </p>

                        <h1>
                            Metas
                        </h1>

                    </div>


                    <div className="metas-user">

                        <div className="metas-avatar">

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


                {/* TOPO */}

                <div className="metas-topo">

                    <div>

                        <span>
                            Objetivos
                        </span>

                        <h2>
                            Minhas metas financeiras
                        </h2>

                    </div>


                    <button
                        onClick={abrirNovaMeta}
                    >
                        Nova meta
                    </button>

                </div>


                {/* FORMULÁRIO */}

                {mostrarFormulario && (

                    <form
                        className="meta-form"
                        onSubmit={handleSubmit}
                    >

                        <h3>

                            {editandoId
                                ? "Editar meta"
                                : "Nova meta"}

                        </h3>


                        <div className="meta-form-grid">

                            <div>

                                <label>
                                    Nome da meta
                                </label>

                                <input
                                    type="text"
                                    placeholder="Ex: Reserva de emergência"
                                    value={nome}
                                    onChange={(event) =>
                                        setNome(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div>

                                <label>
                                    Valor da meta
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="10000"
                                    value={valorMeta}
                                    onChange={(event) =>
                                        setValorMeta(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div>

                                <label>
                                    Valor atual
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0"
                                    value={valorAtual}
                                    onChange={(event) =>
                                        setValorAtual(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="meta-form-botoes">

                            <button
                                type="button"
                                className="meta-cancelar"
                                onClick={
                                    cancelarFormulario
                                }
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                className="meta-salvar"
                            >

                                {editandoId
                                    ? "Salvar alterações"
                                    : "Criar meta"}

                            </button>

                        </div>

                    </form>

                )}


                {/* CARREGANDO */}

                {carregando && (

                    <p className="metas-message">
                        Carregando metas...
                    </p>

                )}


                {/* SEM METAS */}

                {!carregando &&
                    metas.length === 0 && (

                        <div className="metas-vazio">

                            <h3>
                                Nenhuma meta cadastrada
                            </h3>

                            <p>
                                Crie sua primeira meta financeira.
                            </p>

                        </div>

                    )}


                {/* GRID */}

                {!carregando &&
                    metas.length > 0 && (

                        <div className="metas-grid">

                            {metas.map((meta) => {

                                const progresso =
                                    calcularProgresso(
                                        meta.valor_atual,
                                        meta.valor_meta
                                    );


                                const faltando =
                                    Math.max(
                                        Number(
                                            meta.valor_meta
                                        ) -
                                        Number(
                                            meta.valor_atual
                                        ),
                                        0
                                    );


                                return (

                                    <div
                                        className="meta-card"
                                        key={meta.id}
                                    >


                                        <div className="meta-card-header">

                                            <h3>
                                                {meta.nome}
                                            </h3>


                                            <span>
                                                {progresso}%
                                            </span>

                                        </div>


                                        <div className="meta-valores">

                                            <div>

                                                <span>
                                                    Guardado
                                                </span>

                                                <strong>

                                                    {formatarMoeda(
                                                        meta.valor_atual
                                                    )}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Objetivo
                                                </span>

                                                <strong>

                                                    {formatarMoeda(
                                                        meta.valor_meta
                                                    )}

                                                </strong>

                                            </div>

                                        </div>


                                        <div className="meta-barra">

                                            <div
                                                className="meta-progresso"
                                                style={{
                                                    width:
                                                        `${progresso}%`
                                                }}
                                            />

                                        </div>


                                        <small>

                                            Faltam{" "}

                                            {formatarMoeda(
                                                faltando
                                            )}

                                        </small>


                                        <div className="meta-acoes">

                                            <button
                                                className="meta-editar"
                                                onClick={() =>
                                                    prepararEdicao(
                                                        meta
                                                    )
                                                }
                                            >
                                                Editar
                                            </button>


                                            <button
                                                className="meta-excluir"
                                                onClick={() =>
                                                    excluirMeta(
                                                        meta.id
                                                    )
                                                }
                                            >
                                                Excluir
                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}

            </div>

        </div>
    );
}

export default Metas;