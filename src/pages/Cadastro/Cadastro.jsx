import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";

const API_URL = import.meta.env.VITE_API_URL;

function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        console.log("Entrou no cadastro");

        fetch(`${API_URL}/cadastro`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                nome,
                email,
                senha,
            }),
        })
            .then((response) => {
                console.log(
                    "Status:",
                    response.status
                );

                return response.text();
            })

            .then((data) => {
                console.log(
                    "Resposta:",
                    data
                );

                alert(
                    "Cadastro realizado com sucesso!"
                );

                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
            })

            .catch((error) => {
                console.error(
                    "Erro:",
                    error
                );
            });
    }

    return (
        <main className="cadastro-page">

            <div className="cadastro-card">

                <h1>
                    Cadastre-se
                </h1>

                <p className="cadastro-subtitulo">
                    Preencha seus dados para criar sua conta.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* NOME */}

                    <div className="cadastro-input-group">

                        <label htmlFor="nome">
                            Nome
                        </label>

                        <input
                            type="text"
                            id="nome"
                            placeholder="Digite seu nome"
                            value={nome}

                            onChange={(e) =>
                                setNome(
                                    e.target.value
                                )
                            }

                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="cadastro-input-group">

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Digite seu e-mail"
                            value={email}

                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }

                            required
                        />

                    </div>


                    {/* SENHA */}

                    <div className="cadastro-input-group">

                        <label htmlFor="password">
                            Senha
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Digite sua senha"
                            value={senha}

                            onChange={(e) =>
                                setSenha(
                                    e.target.value
                                )
                            }

                            required
                        />

                    </div>


                    {/* CONFIRMAR SENHA */}

                    <div className="cadastro-input-group">

                        <label htmlFor="confirmPassword">
                            Confirmar senha
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Digite sua senha novamente"
                            value={confirmarSenha}

                            onChange={(e) =>
                                setConfirmarSenha(
                                    e.target.value
                                )
                            }

                            required
                        />

                    </div>


                    {/* BOTÃO */}

                    <button
                        type="submit"
                        className="cadastro-button"
                    >
                        Criar conta
                    </button>

                </form>


                {/* LOGIN */}

                <div className="cadastro-login">

                    <p>
                        Já possui uma conta?
                    </p>

                    <Link to="/">
                        Entrar
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default Cadastro;