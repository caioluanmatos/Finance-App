const express = require("express");
const cors = require("cors");
const connection = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Primeira API");
});

app.post("/cadastro", (req, res) => {
    console.log("Rota cadastro chamada");
    console.log(req.body);

    const { nome, email, senha } = req.body;

    const sql =
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    connection.query(sql, [nome, email, senha], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erro ao cadastrar");
        }

        console.log("Usuário salvo com ID:", result.insertId);
        res.send("Usuário cadastrado com sucesso!");
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});