const express = require("express");

const app = express();
const PORT = 3000;


const mysql = require("mysql")
app.use(express.static('public'));

// Les exemples donnГ©s sont pour une connexion en local sur la fac
// Le user/database et password sont Г  modifier...
const connection = mysql.createConnection({
    host: "sql7.freemysqlhosting.net",
    user: "sql7746118",
    password: "Jgclfec5nT",
    database: "sql7746118",
    connectTimeout: 1000000,
    port: 3306,
});

connection.connect(error => {
    if (error) throw error;
    console.log("La connection est reussi.");
});


app.get("/data", (req, res) => {
let query = connection.query("SELECT * FROM users");
})
app.listen(PORT, () => {
    console.log(`Server est lancé: http://localhost:${PORT}`);
});
