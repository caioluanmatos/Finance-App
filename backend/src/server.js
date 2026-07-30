const express = require("express");
const cors = require("cors");
const connection = require("./database");
const bcrypt = require("bcrypt");

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
            return res.send("E-mail ou senha inválidos!");
        }

        const usuario = result[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.send("E-mail ou senha inválidos!");
        }

        res.send("Login realizado com sucesso!");
    });
});

// ====================
// Servidor
// ====================

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});