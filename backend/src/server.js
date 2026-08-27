const express = require("express");
const cors = require("cors");
const connection = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        connection.query(
            sql,
            [nome, email, senhaHash],
            (error, result) => {

                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        mensagem: "Erro ao cadastrar usuário"
                    });
                }

                return res.status(201).json({
                    mensagem: "Usuário cadastrado com sucesso!",
                    usuarioId: result.insertId
                });
            }
        );

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário"
        });
    }
});


// ====================
// Login
// ====================

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ?
    `;

    connection.query(
        sql,
        [email],
        async (error, result) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    mensagem: "Erro ao fazer login"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    mensagem: "E-mail ou senha inválidos!"
                });
            }

            const usuario = result[0];

            const senhaCorreta = await bcrypt.compare(
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
        }
    );
});


// ====================
// Perfil protegido
// ====================

app.get("/perfil", verificarToken, (req, res) => {
    res.json({
        mensagem: "Acesso autorizado!",
        usuarioId: req.usuarioId
    });
});


// ====================
// Cadastrar transação
// ====================

app.post("/transacoes", verificarToken, (req, res) => {
    const {
        descricao,
        valor,
        tipo,
        data
    } = req.body;

    const usuarioId = req.usuarioId;

    const sql = `
        INSERT INTO transacoes
        (descricao, valor, tipo, data, usuario_id)
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
                console.log(error);

                return res.status(500).json({
                    mensagem: "Erro ao cadastrar transação!"
                });
            }

            return res.status(201).json({
                mensagem: "Transação cadastrada com sucesso!",
                transacaoId: result.insertId
            });
        }
    );
});


// ====================
// Listar transações
// ====================

app.get("/transacoes", verificarToken, (req, res) => {
    const usuarioId = req.usuarioId;

    const sql = `
        SELECT * FROM transacoes
        WHERE usuario_id = ?
        ORDER BY data DESC
    `;

    connection.query(
        sql,
        [usuarioId],
        (error, result) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    mensagem: "Erro ao buscar transações!"
                });
            }

            return res.status(200).json(result);
        }
    );
});


// ====================
// Excluir transação
// ====================

app.delete(
    "/transacoes/:id",
    verificarToken,
    (req, res) => {

        const id = req.params.id;
        const usuarioId = req.usuarioId;

        const sql = `
            DELETE FROM transacoes
            WHERE id = ?
            AND usuario_id = ?
        `;

        connection.query(
            sql,
            [id, usuarioId],
            (error, result) => {

                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        mensagem: "Erro ao excluir transação"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        mensagem: "Transação não encontrada"
                    });
                }

                return res.status(200).json({
                    mensagem: "Transação excluída com sucesso!"
                });
            }
        );
    }
);

app.put("/transacoes/:id", verificarToken, (req, res) => {

    const id = req.params.id;

    const {
        descricao,
        valor,
        tipo,
        data
    } = req.body;

    const usuarioId = req.usuarioId;

    const sql = `
       UPDATE transacoes
        SET descricao = ?, valor = ?, tipo = ?, data = ?
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

            if (error){
                console.log(error);

                return res.status(500).json({
                    mensagem: "erro ao editar transação"
                });
            }

            if (result.affectedRows === 0){
                return res.status(404).json({
                    mensagem:"Transação não encontrada"
                });
            }

                return res.status(200).json({
                    mensagem:"Transação editada com sucesso!"
                });


    }
);
    
});

// ====================
// Servidor
// ====================

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});