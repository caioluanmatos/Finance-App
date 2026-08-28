import "./Perfil.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Perfil() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mensagemSenha, setMensagemSenha] = useState("");
    const [erroSenha, setErroSenha] = useState("");

    const [corTema, setCorTema] = useState(
        localStorage.getItem("corTema") || "roxo"
    );


    // ========================================
    // BUSCAR PERFIL
    // ========================================

    useEffect(() => {

        const fotoSalva =
            localStorage.getItem("fotoUsuario");

        if (fotoSalva) {
            setFoto(fotoSalva);
        }


        fetch("http://localhost:3000/perfil", {

            headers: {
                Authorization:
                    "Bearer " +
                    localStorage.getItem("token")
            }

        })
            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "Erro ao buscar perfil"
                    );
                }

                return response.json();

            })
            .then((dados) => {

                setNome(dados.nome);
                setEmail(dados.email);

            })
            .catch((error) => {

                console.error(
                    "Erro ao buscar perfil:",
                    error
                );

            });

    }, []);


    // ========================================
    // ALTERAR SENHA
    // ========================================

    function handleAlterarSenha(event) {

        event.preventDefault();

        setMensagemSenha("");
        setErroSenha("");


        if (
            !senhaAtual ||
            !novaSenha ||
            !confirmarSenha
        ) {

            setErroSenha(
                "Preencha todos os campos."
            );

            return;
        }


        if (novaSenha !== confirmarSenha) {

            setErroSenha(
                "As novas senhas não são iguais."
            );

            return;
        }


        fetch(
            "http://localhost:3000/perfil/senha",
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        "Bearer " +
                        localStorage.getItem("token")
                },

                body: JSON.stringify({
                    senhaAtual,
                    novaSenha,
                    confirmarSenha
                })
            }
        )
            .then(async (response) => {

                const dados =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao alterar senha"
                    );
                }

                return dados;

            })
            .then((dados) => {

                setMensagemSenha(
                    dados.mensagem
                );

                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarSenha("");

            })
            .catch((error) => {

                setErroSenha(
                    error.message
                );

            });

    }


    // ========================================
    // ESCOLHER COR
    // ========================================

    function handleEscolherCor(cor) {

        setCorTema(cor);

        localStorage.setItem(
            "corTema",
            cor
        );

    }


    // ========================================
    // LOGOUT
    // ========================================

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("fotoUsuario");

        window.location.href = "/";

    }


    // ========================================
    // TELA
    // ========================================

    return (

        <div
            className="perfil-layout" data-tema={corTema}
        >

            {/* SIDEBAR */}

            <aside className="perfil-sidebar">

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

                    <Link to="/metas">
                        Metas
                    </Link>

                    <Link
                        to="/perfil"
                        className="perfil-active"
                    >
                        Perfil
                    </Link>

                </nav>


                <button
                    className="perfil-sair"
                    onClick={handleLogout}
                >
                    Sair
                </button>

            </aside>


            {/* CONTEÚDO */}

            <main className="perfil-main">


                <div className="perfil-topo">

                    <div>

                        <h1>
                            Perfil
                        </h1>

                        <p>
                            Gerencie seus dados,
                            segurança e aparência.
                        </p>

                    </div>

                </div>


                {/* DADOS DA CONTA */}

                <div className="perfil-card">

                    <div className="perfil-card-header">

                        <div>

                            <span>
                                Conta
                            </span>

                            <h2>
                                Seus dados
                            </h2>

                        </div>

                    </div>


                    <div className="perfil-dados">


                        <div className="perfil-avatar-area">

                            {foto ? (

                                <img
                                    src={foto}
                                    alt="Foto de perfil"
                                    className="perfil-avatar"
                                />

                            ) : (

                                <div className="perfil-avatar-placeholder">

                                    {nome
                                        ? nome
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}

                                </div>

                            )}

                        </div>


                        <div className="perfil-campos">

                            <div>

                                <label>
                                    Nome
                                </label>

                                <input
                                    type="text"
                                    value={nome}
                                    readOnly
                                />

                            </div>


                            <div>

                                <label>
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* SEGURANÇA */}

                <div className="perfil-card">

                    <div className="perfil-card-header">

                        <div>

                            <span>
                                Segurança
                            </span>

                            <h2>
                                Alterar senha
                            </h2>

                        </div>

                    </div>


                    <form
                        className="perfil-senha-form"
                        onSubmit={handleAlterarSenha}
                    >


                        <div>

                            <label>
                                Senha atual
                            </label>

                            <input
                                type="password"
                                placeholder="Digite sua senha atual"
                                value={senhaAtual}
                                onChange={(e) =>
                                    setSenhaAtual(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div>

                            <label>
                                Nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Digite a nova senha"
                                value={novaSenha}
                                onChange={(e) =>
                                    setNovaSenha(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div>

                            <label>
                                Confirmar nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Repita a nova senha"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {mensagemSenha && (

                            <p className="perfil-sucesso">

                                {mensagemSenha}

                            </p>

                        )}


                        {erroSenha && (

                            <p className="perfil-erro">

                                {erroSenha}

                            </p>

                        )}


                        <button
                            type="submit"
                            className="perfil-btn-senha"
                        >
                            Alterar senha
                        </button>

                    </form>

                </div>


                {/* APARÊNCIA */}

                <div className="perfil-card">

                    <div className="perfil-card-header">

                        <div>

                            <span>
                                Aparência
                            </span>

                            <h2>
                                Cor do tema
                            </h2>

                            <p>
                                Escolha a cor principal
                                do Finance App.
                            </p>

                        </div>

                    </div>


                    <div className="perfil-cores">


                        <button
                            type="button"
                            className={`perfil-cor roxo ${
                                corTema === "roxo"
                                    ? "selecionada"
                                    : ""
                            }`}
                            onClick={() =>
                                handleEscolherCor(
                                    "roxo"
                                )
                            }
                            aria-label="Tema roxo"
                        />


                        <button
                            type="button"
                            className={`perfil-cor azul ${
                                corTema === "azul"
                                    ? "selecionada"
                                    : ""
                            }`}
                            onClick={() =>
                                handleEscolherCor(
                                    "azul"
                                )
                            }
                            aria-label="Tema azul"
                        />


                        <button
                            type="button"
                            className={`perfil-cor verde ${
                                corTema === "verde"
                                    ? "selecionada"
                                    : ""
                            }`}
                            onClick={() =>
                                handleEscolherCor(
                                    "verde"
                                )
                            }
                            aria-label="Tema verde"
                        />


                        <button
                            type="button"
                            className={`perfil-cor vermelho ${
                                corTema === "vermelho"
                                    ? "selecionada"
                                    : ""
                            }`}
                            onClick={() =>
                                handleEscolherCor(
                                    "vermelho"
                                )
                            }
                            aria-label="Tema vermelho"
                        />

                    </div>

                </div>

            </main>

        </div>

    );

}

export default Perfil;