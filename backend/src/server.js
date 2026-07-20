const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Olá, mundo!");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});