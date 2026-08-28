const express = require("express");
const cors = require("cors");
const connection = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");

require("dotenv").config();

// ========================================
// CONFIGURAÇÃO DE E-MAIL
// ========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const codigosSenha = new Map();



const app = express();

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

app.use(cors());
app.use(express.json());


// ========================================
// MIDDLEWARE JWT
// ========================================

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensagem: "Token não enviado!"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensagem: "Token não enviado!"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = decoded.id;

        next();

    } catch (error) {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado!"
        });

    }
}

// ========================================
// ESQUECI A SENHA - ENVIAR CÓDIGO
// ========================================

app.post("/esqueci-senha/enviar-codigo", (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            mensagem: "Digite seu e-mail!"
        });
    }

    // Procura o usuário pelo e-mail
    const sql = `
        SELECT id, nome, email
        FROM usuarios
        WHERE email = ?
    `;

    connection.query(
        sql,
        [email],
        async (error, result) => {

            if (error) {
                console.log(
                    "Erro ao buscar usuário:",
                    error
                );

                return res.status(500).json({
                    mensagem: "Erro interno do servidor!"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    mensagem: "E-mail não encontrado!"
                });
            }

            const usuario = result[0];

            // Gera código de 6 dígitos
            const codigo = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            // Código válido por 10 minutos
            const expiraEm =
                Date.now() + 10 * 60 * 1000;

            // Guarda temporariamente
            codigosSenha.set(email, {
                codigo,
                expiraEm,
                usuarioId: usuario.id
            });

            try {

                // Envia o e-mail
                await transporter.sendMail({

                    from: `"Finance App" <${process.env.EMAIL_USER}>`,

                    to: usuario.email,

                    subject:
                        "Código para redefinir sua senha",

                    html: `
                        <div
                            style="
                                font-family: Arial, sans-serif;
                                max-width: 500px;
                                margin: auto;
                                padding: 30px;
                                background: #0f172a;
                                color: white;
                                border-radius: 12px;
                            "
                        >

                            <h2
                                style="
                                    color: #8b5cf6;
                                "
                            >
                                Finance App
                            </h2>

                            <p>
                                Olá, ${usuario.nome}!
                            </p>

                            <p>
                                Recebemos uma solicitação
                                para redefinir sua senha.
                            </p>

                            <p>
                                Seu código de verificação é:
                            </p>

                            <div
                                style="
                                    font-size: 32px;
                                    font-weight: bold;
                                    letter-spacing: 8px;
                                    color: #a78bfa;
                                    margin: 25px 0;
                                "
                            >
                                ${codigo}
                            </div>

                            <p>
                                Esse código é válido por
                                10 minutos.
                            </p>

                            <p
                                style="
                                    color: #94a3b8;
                                    font-size: 13px;
                                "
                            >
                                Se você não solicitou a
                                alteração da senha,
                                ignore este e-mail.
                            </p>

                        </div>
                    `
                });

                return res.status(200).json({
                    mensagem:
                        "Código enviado para seu e-mail!"
                });

            } catch (errorEmail) {

                console.log(
                    "Erro ao enviar e-mail:",
                    errorEmail
                );

                // Se o envio falhar,
                // remove o código criado
                codigosSenha.delete(email);

                return res.status(500).json({
                    mensagem:
                        "Não foi possível enviar o código."
                });
            }
        }
    );
});


// ========================================
// ESQUECI A SENHA - VERIFICAR CÓDIGO
// ========================================

app.post("/esqueci-senha/verificar-codigo", (req, res) => {

    const {
        email,
        codigo
    } = req.body;


    if (!email || !codigo) {
        return res.status(400).json({
            mensagem: "Informe o e-mail e o código!"
        });
    }


    const dadosCodigo = codigosSenha.get(email);


    // Verifica se existe código para esse e-mail
    if (!dadosCodigo) {
        return res.status(400).json({
            mensagem:
                "Nenhum código foi solicitado para esse e-mail!"
        });
    }


    // Verifica se expirou
    if (Date.now() > dadosCodigo.expiraEm) {

        codigosSenha.delete(email);

        return res.status(400).json({
            mensagem:
                "O código expirou. Solicite um novo código!"
        });
    }


    // Verifica se o código está correto
    if (String(codigo) !== String(dadosCodigo.codigo)) {
        return res.status(400).json({
            mensagem:
                "Código inválido!"
        });
    }


    // Marca o código como verificado
    dadosCodigo.verificado = true;

    codigosSenha.set(
        email,
        dadosCodigo
    );


    return res.status(200).json({
        mensagem:
            "Código verificado com sucesso!"
    });

});


// ========================================
// ESQUECI A SENHA - REDEFINIR SENHA
// ========================================

app.post("/esqueci-senha/redefinir", async (req, res) => {

    const {
        email,
        novaSenha,
        confirmarSenha
    } = req.body;


    // Verifica os campos
    if (!email || !novaSenha || !confirmarSenha) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos!"
        });
    }


    // Verifica se as senhas são iguais
    if (novaSenha !== confirmarSenha) {
        return res.status(400).json({
            mensagem:
                "A nova senha e a confirmação não são iguais!"
        });
    }


    // Tamanho mínimo da senha
    if (novaSenha.length < 6) {
        return res.status(400).json({
            mensagem:
                "A nova senha precisa ter pelo menos 6 caracteres!"
        });
    }


    // Busca o código que foi enviado
    const dadosCodigo = codigosSenha.get(email);


    if (!dadosCodigo) {
        return res.status(400).json({
            mensagem:
                "Solicitação de recuperação não encontrada!"
        });
    }


    // Verifica novamente se expirou
    if (Date.now() > dadosCodigo.expiraEm) {

        codigosSenha.delete(email);

        return res.status(400).json({
            mensagem:
                "O código expirou. Solicite um novo código!"
        });
    }


    // Só permite trocar a senha se o código
    // já tiver sido verificado
    if (!dadosCodigo.verificado) {
        return res.status(400).json({
            mensagem:
                "Verifique o código antes de redefinir a senha!"
        });
    }


    try {

        // Criptografa a nova senha
        const novaSenhaHash =
            await bcrypt.hash(
                novaSenha,
                10
            );


        const sql = `
            UPDATE usuarios
            SET senha = ?
            WHERE id = ?
        `;


        connection.query(
            sql,
            [
                novaSenhaHash,
                dadosCodigo.usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao redefinir senha:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao redefinir senha!"
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        mensagem:
                            "Usuário não encontrado!"
                    });
                }


                // Código não pode ser reutilizado
                codigosSenha.delete(email);


                return res.status(200).json({
                    mensagem:
                        "Senha redefinida com sucesso!"
                });

            }
        );

    } catch (error) {

        console.log(
            "Erro ao criptografar nova senha:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro ao redefinir senha!"
        });
    }

});



// ========================================
// ROTA INICIAL
// ========================================

app.get("/", (req, res) => {

    res.send("Finance App API funcionando!");

});


// ========================================
// CADASTRO NORMAL
// ========================================

app.post("/cadastro", async (req, res) => {

    const {
        nome,
        email,
        senha
    } = req.body;


    if (!nome || !email || !senha) {

        return res.status(400).json({
            mensagem: "Preencha todos os campos!"
        });

    }


    try {

        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );


        const sql = `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
        `;


        connection.query(
            sql,
            [
                nome,
                email,
                senhaHash
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro cadastro:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao cadastrar usuário"
                    });

                }


                return res.status(201).json({

                    mensagem:
                        "Usuário cadastrado com sucesso!",

                    usuarioId:
                        result.insertId

                });

            }
        );


    } catch (error) {

        console.log(
            "Erro cadastro:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro ao cadastrar usuário"
        });

    }

});


// ========================================
// LOGIN NORMAL
// ========================================

app.post("/login", (req, res) => {

    const {
        email,
        senha
    } = req.body;


    if (!email || !senha) {

        return res.status(400).json({
            mensagem:
                "Informe e-mail e senha!"
        });

    }


    const sql = `
        SELECT *
        FROM usuarios
        WHERE email = ?
    `;


    connection.query(
        sql,
        [email],
        async (error, result) => {

            if (error) {

                console.log(
                    "Erro login:",
                    error
                );

                return res.status(500).json({
                    mensagem:
                        "Erro ao fazer login"
                });

            }


            if (result.length === 0) {

                return res.status(401).json({
                    mensagem:
                        "E-mail ou senha inválidos!"
                });

            }


            const usuario = result[0];


            try {

                const senhaCorreta =
                    await bcrypt.compare(
                        senha,
                        usuario.senha
                    );


                if (!senhaCorreta) {

                    return res.status(401).json({
                        mensagem:
                            "E-mail ou senha inválidos!"
                    });

                }


                const token =
                    jwt.sign(
                        {
                            id: usuario.id
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1h"
                        }
                    );


                return res.status(200).json({

                    mensagem:
                        "Login realizado com sucesso!",

                    token,

                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email
                    }

                });


            } catch (error) {

                console.log(
                    "Erro senha:",
                    error
                );

                return res.status(500).json({
                    mensagem:
                        "Erro ao verificar senha"
                });

            }

        }
    );

});


// ========================================
// LOGIN COM GOOGLE
// ========================================

app.post("/login/google", async (req, res) => {

    const {
        credential
    } = req.body;


    if (!credential) {

        return res.status(400).json({
            mensagem:
                "Token do Google não enviado!"
        });

    }


    try {

        // Verifica se o token realmente veio
        // do Google e pertence ao nosso app.

        const ticket =
            await googleClient.verifyIdToken({

                idToken: credential,

                audience:
                    process.env.GOOGLE_CLIENT_ID

            });


        const payload =
            ticket.getPayload();


        if (!payload) {

            return res.status(401).json({
                mensagem:
                    "Token do Google inválido!"
            });

        }


        // Dados enviados pelo Google

        const nome =
            payload.name;

        const email =
            payload.email;

        const foto =
            payload.picture;


        if (!email) {

            return res.status(400).json({
                mensagem:
                    "E-mail da conta Google não encontrado!"
            });

        }


        // Procura se essa conta já existe

        const sqlBuscar = `
            SELECT *
            FROM usuarios
            WHERE email = ?
        `;


        connection.query(
            sqlBuscar,
            [email],
            async (error, result) => {

                if (error) {

                    console.log(
                        "Erro busca Google:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao buscar usuário"
                    });

                }


                // ========================================
                // CONTA JÁ EXISTE
                // ========================================

                if (result.length > 0) {

                    const usuario =
                        result[0];


                    const token =
                        jwt.sign(
                            {
                                id: usuario.id
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: "1h"
                            }
                        );


                    return res.status(200).json({

                        mensagem:
                            "Login com Google realizado com sucesso!",

                        token,

                        usuario: {

                            id:
                                usuario.id,

                            nome:
                                usuario.nome,

                            email:
                                usuario.email,

                            foto:
                                foto

                        }

                    });

                }


                // ========================================
                // PRIMEIRO LOGIN COM GOOGLE
                // ========================================

                // Como a tabela atual exige uma senha,
                // criamos uma senha aleatória e criptografada.

                const senhaAleatoria =
                    `${Date.now()}-${Math.random()}`;


                const senhaHash =
                    await bcrypt.hash(
                        senhaAleatoria,
                        10
                    );


                const sqlCadastrar = `
                    INSERT INTO usuarios
                    (nome, email, senha)
                    VALUES (?, ?, ?)
                `;


                connection.query(
                    sqlCadastrar,
                    [
                        nome,
                        email,
                        senhaHash
                    ],
                    (
                        errorCadastro,
                        resultCadastro
                    ) => {

                        if (errorCadastro) {

                            console.log(
                                "Erro cadastro Google:",
                                errorCadastro
                            );

                            return res.status(500).json({
                                mensagem:
                                    "Erro ao cadastrar usuário Google"
                            });

                        }


                        const usuarioId =
                            resultCadastro.insertId;


                        const token =
                            jwt.sign(
                                {
                                    id: usuarioId
                                },
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: "1h"
                                }
                            );


                        return res.status(201).json({

                            mensagem:
                                "Conta Google criada com sucesso!",

                            token,

                            usuario: {

                                id:
                                    usuarioId,

                                nome:
                                    nome,

                                email:
                                    email,

                                foto:
                                    foto

                            }

                        });

                    }
                );

            }
        );


    } catch (error) {

        console.log(
            "Erro no login Google:",
            error
        );


        return res.status(401).json({
            mensagem:
                "Login com Google inválido!"
        });

    }

});


// ========================================
// PERFIL
// ========================================

app.get(
    "/perfil",
    verificarToken,
    (req, res) => {

        const usuarioId =
            req.usuarioId;


        const sql = `
            SELECT
                id,
                nome,
                email
            FROM usuarios
            WHERE id = ?
        `;


        connection.query(
            sql,
            [usuarioId],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro perfil:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao buscar perfil"
                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({
                        mensagem:
                            "Usuário não encontrado"
                    });

                }


                return res.status(200).json(
                    result[0]
                );

            }
        );

    }
);

// ========================================
// ALTERAR SENHA DO PERFIL
// ========================================

app.put(
    "/perfil/senha",
    verificarToken,
    async (req, res) => {

        const usuarioId = req.usuarioId;

        const {
            senhaAtual,
            novaSenha,
            confirmarSenha
        } = req.body;


        // Verifica se todos os campos foram enviados
        if (
            !senhaAtual ||
            !novaSenha ||
            !confirmarSenha
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos!"
            });
        }


        // Confirma se as duas novas senhas são iguais
        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({
                mensagem:
                    "A nova senha e a confirmação não são iguais!"
            });
        }


        // Tamanho mínimo
        if (novaSenha.length < 6) {
            return res.status(400).json({
                mensagem:
                    "A nova senha precisa ter pelo menos 6 caracteres!"
            });
        }


        const sqlBuscar = `
            SELECT *
            FROM usuarios
            WHERE id = ?
        `;


        connection.query(
            sqlBuscar,
            [usuarioId],
            async (error, result) => {

                if (error) {
                    console.log(
                        "Erro ao buscar usuário:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao buscar usuário!"
                    });
                }


                if (result.length === 0) {
                    return res.status(404).json({
                        mensagem:
                            "Usuário não encontrado!"
                    });
                }


                const usuario = result[0];


                try {

                    // Compara a senha digitada
                    // com a senha criptografada do banco
                    const senhaCorreta =
                        await bcrypt.compare(
                            senhaAtual,
                            usuario.senha
                        );


                    if (!senhaCorreta) {
                        return res.status(401).json({
                            mensagem:
                                "Senha atual incorreta!"
                        });
                    }


                    // Criptografa a nova senha
                    const novaSenhaHash =
                        await bcrypt.hash(
                            novaSenha,
                            10
                        );


                    const sqlAtualizar = `
                        UPDATE usuarios
                        SET senha = ?
                        WHERE id = ?
                    `;


                    connection.query(
                        sqlAtualizar,
                        [
                            novaSenhaHash,
                            usuarioId
                        ],
                        (errorAtualizar) => {

                            if (errorAtualizar) {
                                console.log(
                                    "Erro ao alterar senha:",
                                    errorAtualizar
                                );

                                return res.status(500).json({
                                    mensagem:
                                        "Erro ao alterar senha!"
                                });
                            }


                            return res.status(200).json({
                                mensagem:
                                    "Senha alterada com sucesso!"
                            });
                        }
                    );

                } catch (error) {

                    console.log(
                        "Erro ao verificar senha:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao alterar senha!"
                    });
                }
            }
        );
    }
);




// ========================================
// CADASTRAR TRANSAÇÃO
// ========================================

app.post(
    "/transacoes",
    verificarToken,
    (req, res) => {

        const {
            descricao,
            valor,
            tipo,
            data
        } = req.body;


        const usuarioId =
            req.usuarioId;


        if (
            !descricao ||
            valor === undefined ||
            !tipo ||
            !data
        ) {

            return res.status(400).json({
                mensagem:
                    "Preencha todos os campos da transação!"
            });

        }


        if (
            tipo !== "receita" &&
            tipo !== "despesa"
        ) {

            return res.status(400).json({
                mensagem:
                    "Tipo de transação inválido!"
            });

        }


        const sql = `
            INSERT INTO transacoes
            (
                descricao,
                valor,
                tipo,
                data,
                usuario_id
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        connection.query(
            sql,
            [
                descricao,
                valor,
                tipo,
                data,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro transação:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao cadastrar transação!"
                    });

                }


                return res.status(201).json({

                    mensagem:
                        "Transação cadastrada com sucesso!",

                    transacaoId:
                        result.insertId

                });

            }
        );

    }
);


// ========================================
// LISTAR TRANSAÇÕES
// ========================================

app.get(
    "/transacoes",
    verificarToken,
    (req, res) => {

        const usuarioId =
            req.usuarioId;


        const sql = `
            SELECT *
            FROM transacoes
            WHERE usuario_id = ?
            ORDER BY data DESC
        `;


        connection.query(
            sql,
            [usuarioId],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao listar transações:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao buscar transações!"
                    });

                }


                return res.status(200).json(
                    result
                );

            }
        );

    }
);


// ========================================
// EXCLUIR TRANSAÇÃO
// ========================================

app.delete(
    "/transacoes/:id",
    verificarToken,
    (req, res) => {

        const id =
            req.params.id;

        const usuarioId =
            req.usuarioId;


        const sql = `
            DELETE FROM transacoes
            WHERE id = ?
            AND usuario_id = ?
        `;


        connection.query(
            sql,
            [
                id,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao excluir:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao excluir transação"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        mensagem:
                            "Transação não encontrada"
                    });

                }


                return res.status(200).json({
                    mensagem:
                        "Transação excluída com sucesso!"
                });

            }
        );

    }
);


// ========================================
// EDITAR TRANSAÇÃO
// ========================================

app.put(
    "/transacoes/:id",
    verificarToken,
    (req, res) => {

        const id =
            req.params.id;


        const {
            descricao,
            valor,
            tipo,
            data
        } = req.body;


        const usuarioId =
            req.usuarioId;


        if (
            !descricao ||
            valor === undefined ||
            !tipo ||
            !data
        ) {

            return res.status(400).json({
                mensagem:
                    "Preencha todos os campos da transação!"
            });

        }


        if (
            tipo !== "receita" &&
            tipo !== "despesa"
        ) {

            return res.status(400).json({
                mensagem:
                    "Tipo de transação inválido!"
            });

        }


        const sql = `
            UPDATE transacoes

            SET
                descricao = ?,
                valor = ?,
                tipo = ?,
                data = ?

            WHERE id = ?
            AND usuario_id = ?
        `;


        connection.query(
            sql,
            [
                descricao,
                valor,
                tipo,
                data,
                id,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao editar:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao editar transação"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        mensagem:
                            "Transação não encontrada"
                    });

                }


                return res.status(200).json({
                    mensagem:
                        "Transação editada com sucesso!"
                });

            }
        );

    }
);

// ========================================
// CADASTRAR META
// ========================================

app.post(
    "/metas",
    verificarToken,
    (req, res) => {

        const {
            nome,
            valor_meta,
            valor_atual = 0
        } = req.body;

        const usuarioId =
            req.usuarioId;


        if (
            !nome ||
            valor_meta === undefined
        ) {

            return res.status(400).json({
                mensagem:
                    "Informe o nome e o valor da meta!"
            });

        }


        if (
            Number(valor_meta) <= 0 ||
            Number(valor_atual) < 0
        ) {

            return res.status(400).json({
                mensagem:
                    "Os valores da meta são inválidos!"
            });

        }


        const sql = `
            INSERT INTO metas
            (
                nome,
                valor_meta,
                valor_atual,
                usuario_id
            )
            VALUES (?, ?, ?, ?)
        `;


        connection.query(
            sql,
            [
                nome,
                valor_meta,
                valor_atual,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao cadastrar meta:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao cadastrar meta!"
                    });

                }


                return res.status(201).json({

                    mensagem:
                        "Meta cadastrada com sucesso!",

                    metaId:
                        result.insertId

                });

            }
        );

    }
);


// ========================================
// LISTAR METAS
// ========================================

app.get(
    "/metas",
    verificarToken,
    (req, res) => {

        const usuarioId =
            req.usuarioId;


        const sql = `
            SELECT *
            FROM metas
            WHERE usuario_id = ?
            ORDER BY criado_em DESC
        `;


        connection.query(
            sql,
            [usuarioId],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao listar metas:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao buscar metas!"
                    });

                }


                return res.status(200).json(
                    result
                );

            }
        );

    }
);


// ========================================
// EDITAR META
// ========================================

app.put(
    "/metas/:id",
    verificarToken,
    (req, res) => {

        const id =
            req.params.id;

        const {
            nome,
            valor_meta,
            valor_atual
        } = req.body;

        const usuarioId =
            req.usuarioId;


        if (
            !nome ||
            valor_meta === undefined ||
            valor_atual === undefined
        ) {

            return res.status(400).json({
                mensagem:
                    "Preencha todos os campos da meta!"
            });

        }


        if (
            Number(valor_meta) <= 0 ||
            Number(valor_atual) < 0
        ) {

            return res.status(400).json({
                mensagem:
                    "Os valores da meta são inválidos!"
            });

        }


        const sql = `
            UPDATE metas

            SET
                nome = ?,
                valor_meta = ?,
                valor_atual = ?

            WHERE id = ?
            AND usuario_id = ?
        `;


        connection.query(
            sql,
            [
                nome,
                valor_meta,
                valor_atual,
                id,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao editar meta:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao editar meta!"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        mensagem:
                            "Meta não encontrada!"
                    });

                }


                return res.status(200).json({
                    mensagem:
                        "Meta editada com sucesso!"
                });

            }
        );

    }
);


// ========================================
// EXCLUIR META
// ========================================

app.delete(
    "/metas/:id",
    verificarToken,
    (req, res) => {

        const id =
            req.params.id;

        const usuarioId =
            req.usuarioId;


        const sql = `
            DELETE FROM metas
            WHERE id = ?
            AND usuario_id = ?
        `;


        connection.query(
            sql,
            [
                id,
                usuarioId
            ],
            (error, result) => {

                if (error) {

                    console.log(
                        "Erro ao excluir meta:",
                        error
                    );

                    return res.status(500).json({
                        mensagem:
                            "Erro ao excluir meta!"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        mensagem:
                            "Meta não encontrada!"
                    });

                }


                return res.status(200).json({
                    mensagem:
                        "Meta excluída com sucesso!"
                });

            }
        );

    }
);


// ========================================
// SERVIDOR
// ========================================

app.listen(3000, () => {

    console.log(
        "Servidor rodando na porta 3000"
    );

});

