import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "./Login.css";
import logo from "../../assets/images/Logo/logoapp.png";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000")
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(
                    "Erro ao conectar com a API:",
                    error
                );
            });
    }, []);


    // =========================
    // LOGIN NORMAL
    // =========================

    function handleSubmit(event) {
        event.preventDefault();

        fetch("http://localhost:3000/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                senha,
            }),
        })
            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "E-mail ou senha inválidos"
                    );
                }

                return response.json();
            })

            .then((data) => {

                console.log(
                    "Login normal:",
                    data
                );

                localStorage.setItem(
                    "token",
                    data.token
                );

                if (data.usuario?.nome) {

                    localStorage.setItem(
                        "nomeUsuario",
                        data.usuario.nome
                    );

                }

                // Login normal não usa foto Google
                localStorage.removeItem(
                    "fotoUsuario"
                );

                navigate("/dashboard");

            })

            .catch((error) => {

                console.error(
                    "Erro no login:",
                    error
                );

                alert(
                    "E-mail ou senha inválidos"
                );

            });
    }


    // =========================
    // LOGIN GOOGLE
    // =========================

    function handleGoogleSuccess(
        credentialResponse
    ) {

        console.log(
            "Resposta Google:",
            credentialResponse
        );


        if (!credentialResponse.credential) {

            alert(
                "Não foi possível obter os dados do Google."
            );

            return;

        }


        fetch(
            "http://localhost:3000/login/google",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    credential:
                        credentialResponse.credential,
                }),
            }
        )

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Erro ao entrar com Google"
                    );

                }

                return response.json();

            })

            .then((data) => {

                console.log(
                    "Login Google:",
                    data
                );


                // =========================
                // SALVAR TOKEN
                // =========================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // =========================
                // SALVAR NOME
                // =========================

                if (data.usuario?.nome) {

                    localStorage.setItem(
                        "nomeUsuario",
                        data.usuario.nome
                    );

                }


                // =========================
                // SALVAR FOTO GOOGLE
                // =========================

                if (data.usuario?.foto) {

                    localStorage.setItem(
                        "fotoUsuario",
                        data.usuario.foto
                    );

                } else {

                    localStorage.removeItem(
                        "fotoUsuario"
                    );

                }


                console.log(
                    "Nome salvo:",
                    data.usuario?.nome
                );

                console.log(
                    "Foto salva:",
                    data.usuario?.foto
                );


                navigate("/dashboard");

            })

            .catch((error) => {

                console.error(
                    "Erro no Google Login:",
                    error
                );

                alert(
                    "Não foi possível entrar com Google."
                );

            });

    }


    // =========================
    // ERRO GOOGLE
    // =========================

    function handleGoogleError() {

        console.error(
            "Falha ao realizar login com Google"
        );

        alert(
            "Falha ao entrar com Google."
        );

    }


    return (

        <main>

            <section>

                <div className="logo-area">

                    <img
                        src={logo}
                        alt="Logo Finance App"
                    />

                    <h1>
                        Finance App
                    </h1>

                    <p>
                        Organize hoje.
                        Conquiste amanhã.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* EMAIL */}

                    <label htmlFor="email">
                        E-mail
                    </label>


                    <div className="input-group">

                        <FaUser />

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

                    <label htmlFor="password">
                        Senha
                    </label>


                    <div className="input-group">

                        <FaLock />

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


                    {/* LEMBRAR */}

                    <div className="remember-me">

                        <label>

                            <input
                                type="checkbox"
                            />

                            Lembrar-me

                        </label>

                    </div>


                    {/* LOGIN NORMAL */}

                    <button type="submit">

                        Entrar

                    </button>


                    {/* LOGIN GOOGLE */}

                    <div className="google-login-area">

                        <div className="login-divider">

                            <span>
                                ou
                            </span>

                        </div>


                        <GoogleLogin

                            onSuccess={
                                handleGoogleSuccess
                            }

                            onError={
                                handleGoogleError
                            }

                            text="continue_with"

                            shape="rectangular"

                            width="320"

                        />

                    </div>


                    {/* CADASTRO */}

                    <div className="register-link">

                        <p>
                            Não possui uma conta?
                        </p>

                        <Link to="/cadastro">

                            Criar conta

                        </Link>

                    </div>

                </form>

            </section>

        </main>

    );

}

export default Login;