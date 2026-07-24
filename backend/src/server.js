const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Primeira Api");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});





app.post("/cadastro", (req, res) => {

    console.log(req.body);
    console.log("Rota cadastro foi chamada");

    res.send("Cadastro recebido");

});