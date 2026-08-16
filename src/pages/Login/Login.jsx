import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


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
            });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        console.log(email);
        console.log(senha);

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
                console.log("Status:", response.status);

                if (!response.ok) {
                    throw new Error("E-mail ou senha inválidos");
                }

                return response.json();
            })
            .then((data) => {
                console.log("Resposta:", data);

                localStorage.setItem("token", data.token);

                console.log("Token salvo");

                navigate("/dashboard");
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }

    return (
        <main>
            <section>
                <div className="logo-area">
                    <img src={logo} alt="Logo Finance App" />

                    <h1>Finance App</h1>

                    <p>Organize hoje. Conquiste amanhã.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>

                    <div className="input-group">
                        <FaUser />

                        <input
                            type="email"
                            id="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <label htmlFor="password">Senha</label>

                    <div className="input-group">
                        <FaLock />

                        <input
                            type="password"
                            id="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="remember-me">
                        <label>
                            <input type="checkbox" />
                            Lembrar-me
                        </label>
                    </div>

                    <button type="submit">
                        Entrar
                    </button>

                    <div className="register-link">
                        <p>Não possui uma conta?</p>

                        <Link to="/cadastro">
                            Criar conta
                        </Link>
                    </div>

                    <hr />
                </form>
            </section>
        </main>
    );
}

export default Login;