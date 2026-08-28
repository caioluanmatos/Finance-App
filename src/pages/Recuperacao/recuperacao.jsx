import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./recuperacao.css";

function RecuperarSenha() {

    const navigate = useNavigate();

    // Etapas:
    // 1 = informar e-mail
    // 2 = informar código
    // 3 = criar nova senha
    const [etapa, setEtapa] = useState(1);

    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const [carregando, setCarregando] = useState(false);


    // ========================================
    // 1 - ENVIAR CÓDIGO
    // ========================================

    async function enviarCodigo(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");
        setCarregando(true);

        try {

            const response = await fetch(
                "http://localhost:3000/esqueci-senha/enviar-codigo",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao enviar código."
                );
            }

            setMensagem(data.mensagem);

            // Vai para etapa do código
            setEtapa(2);

        } catch (error) {

            setErro(error.message);

        } finally {

            setCarregando(false);
        }
    }


    // ========================================
    // 2 - VERIFICAR CÓDIGO
    // ========================================

    async function verificarCodigo(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");
        setCarregando(true);

        try {

            const response = await fetch(
                "http://localhost:3000/esqueci-senha/verificar-codigo",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        codigo
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Código inválido."
                );
            }

            setMensagem(data.mensagem);

            // Vai para criação da nova senha
            setEtapa(3);

        } catch (error) {

            setErro(error.message);

        } finally {

            setCarregando(false);
        }
    }


    // ========================================
    // 3 - REDEFINIR SENHA
    // ========================================

    async function redefinirSenha(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");

        if (novaSenha !== confirmarSenha) {

            setErro(
                "As senhas não são iguais!"
            );

            return;
        }

        if (novaSenha.length < 6) {

            setErro(
                "A senha precisa ter pelo menos 6 caracteres!"
            );

            return;
        }

        setCarregando(true);

        try {

            const response = await fetch(
                "http://localhost:3000/esqueci-senha/redefinir",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        novaSenha,
                        confirmarSenha
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao redefinir senha."
                );
            }

            setMensagem(
                "Senha redefinida com sucesso!"
            );

            // Volta para login após 2 segundos
            setTimeout(() => {

                navigate("/");

            }, 2000);

        } catch (error) {

            setErro(error.message);

        } finally {

            setCarregando(false);
        }
    }


    return (

        <div className="recuperar-page">

            <div className="recuperar-card">

                <div className="recuperar-logo">
                    Finance App
                </div>


                {/* =====================================
                    ETAPA 1 - EMAIL
                ===================================== */}

                {etapa === 1 && (

                    <>

                        <h1>
                            Esqueceu sua senha?
                        </h1>

                        <p className="recuperar-subtitulo">
                            Digite seu e-mail e enviaremos
                            um código de verificação.
                        </p>


                        <form onSubmit={enviarCodigo}>

                            <label>
                                E-mail
                            </label>

                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />


                            <button
                                type="submit"
                                disabled={carregando}
                            >

                                {carregando
                                    ? "Enviando..."
                                    : "Enviar código"
                                }

                            </button>

                        </form>

                    </>

                )}


                {/* =====================================
                    ETAPA 2 - CÓDIGO
                ===================================== */}

                {etapa === 2 && (

                    <>

                        <h1>
                            Verifique seu e-mail
                        </h1>

                        <p className="recuperar-subtitulo">
                            Enviamos um código de 6 dígitos
                            para:
                        </p>

                        <p className="recuperar-email">
                            {email}
                        </p>


                        <form onSubmit={verificarCodigo}>

                            <label>
                                Código de verificação
                            </label>

                            <input
                                className="codigo-input"
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                placeholder="000000"
                                value={codigo}
                                onChange={(event) => {

                                    const valor =
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        );

                                    setCodigo(valor);
                                }}
                                required
                            />


                            <button
                                type="submit"
                                disabled={carregando}
                            >

                                {carregando
                                    ? "Verificando..."
                                    : "Verificar código"
                                }

                            </button>

                        </form>


                        <button
                            className="botao-voltar-etapa"
                            type="button"
                            onClick={() => {

                                setEtapa(1);
                                setCodigo("");
                                setMensagem("");
                                setErro("");

                            }}
                        >
                            Alterar e-mail
                        </button>

                    </>

                )}


                {/* =====================================
                    ETAPA 3 - NOVA SENHA
                ===================================== */}

                {etapa === 3 && (

                    <>

                        <h1>
                            Crie uma nova senha
                        </h1>

                        <p className="recuperar-subtitulo">
                            Escolha uma nova senha para
                            acessar sua conta.
                        </p>


                        <form onSubmit={redefinirSenha}>

                            <label>
                                Nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Nova senha"
                                value={novaSenha}
                                onChange={(event) =>
                                    setNovaSenha(
                                        event.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Confirmar nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Confirme a nova senha"
                                value={confirmarSenha}
                                onChange={(event) =>
                                    setConfirmarSenha(
                                        event.target.value
                                    )
                                }
                                required
                            />


                            <button
                                type="submit"
                                disabled={carregando}
                            >

                                {carregando
                                    ? "Alterando..."
                                    : "Redefinir senha"
                                }

                            </button>

                        </form>

                    </>

                )}


                {/* MENSAGENS */}

                {erro && (
                    <p className="recuperar-erro">
                        {erro}
                    </p>
                )}

                {mensagem && (
                    <p className="recuperar-sucesso">
                        {mensagem}
                    </p>
                )}


                <button
                    className="voltar-login"
                    type="button"
                    onClick={() => navigate("/")}
                >
                    ← Voltar para o Login
                </button>

            </div>

        </div>
    );
}

export default RecuperarSenha;