const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("./database");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ====================
// Middleware JWT
// ====================

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
            mensagem: "Formato do token inválido!"
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

// ====================
// Rota inicial
// ====================

app.get("/", (req, res) => {
    res.send("Primeira API");
});

// ====================
// Cadastro
// ====================

app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: "Nome, e-mail e senha são obrigatórios!"
        });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql =
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

        connection.query(
            sql,
            [nome, email, senhaHash],
            (error, result) => {
                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        mensagem: "Erro ao cadastrar usuário!"
                    });
                }

                console.log(
                    "Usuário salvo com ID:",
                    result.insertId
                );

                return res.status(201).json({
                    mensagem: "Usuário cadastrado com sucesso!"
                });
            }
        );
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            mensagem: "Erro ao criptografar a senha!"
        });
    }
});

// ====================
// Login
// ====================

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "E-mail e senha são obrigatórios!"
        });
    }

    const sql =
        "SELECT * FROM usuarios WHERE email = ?";

    connection.query(
        sql,
        [email],
        async (error, result) => {
            if (error) {
                console.log(error);

                return res.status(500).json({
                    mensagem: "Erro ao fazer login!"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    mensagem: "E-mail ou senha inválidos!"
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
                        mensagem: "E-mail ou senha inválidos!"
                    });
                }

                const token = jwt.sign(
                    {
                        id: usuario.id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                );

                return res.status(200).json({
                    mensagem: "Login realizado com sucesso!",
                    token
                });
            } catch (error) {
                console.log(error);

                return res.status(500).json({
                    mensagem: "Erro ao validar a senha!"
                });
            }
        }
    );
});

// ====================
// Perfil protegido
// ====================

app.get(
    "/perfil",
    verificarToken,
    (req, res) => {
        return res.status(200).json({
            mensagem: "Acesso autorizado!",
            usuarioId: req.usuarioId
        });
    }
);

// ====================
// Servidor
// ====================

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});