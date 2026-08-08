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
// Rota Inicial
// ====================

app.get("/", (req, res) => {
    res.send("Primeira API");
});

// ====================
// Cadastro
// ====================

app.post("/cadastro",  async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    

    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    connection.query(sql, [nome, email, senhaHash], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erro ao cadastrar");
        }

        console.log("Usuário salvo com ID:", result.insertId);

        res.send("Usuário cadastrado com sucesso!");
    });
});

// ====================
// Login
// ====================

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";

    connection.query(sql, [email], async (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erro ao fazer login");
        }

        if (result.length === 0) {
            return res.status(401).send("E-mail ou senha inválidos!");
        }

        const usuario = result[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).send("E-mail ou senha inválidos!");
        }

        const token = jwt.sign(
            { id: usuario.id },
             process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            mensagem: "Login realizado com sucesso!",
            token: token
        });
    });
});

// ====================
// Servidor
// ====================

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});



//==============
//  verificar se o usuário enviou um JWT
//==============

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

app.get("/perfil", verificarToken, (req, res) => {
    res.json({
        mensagem: "Acesso autorizado!",
        usuarioId: req.usuarioId
    });
});