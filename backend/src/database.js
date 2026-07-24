const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "FinanceApp@123",
    database: "finance_app"
});

connection.connect((error) => {
    if (error) {
        console.log("Erro ao conectar no banco");
        console.log(error);
        return;
    }

    console.log("Banco de dados conectado!");
});

module.exports = connection;