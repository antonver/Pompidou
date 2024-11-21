const express = require("express");

const app = express();
const PORT = 3000;


const mysql = require("mysql")
app.use(express.static('public'));


const connection = mysql.createConnection({
    host: "sql7.freemysqlhosting.net",
    user: "sql7746118",
    password: "Jgclfec5nT",
    database: "sql7746118",
    connectTimeout: 100000000,
    port: 3306,
});

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "1111",
//     database: "my_new_database",
//     connectTimeout: 10000,
//     port: 3306,
//
// });

connection.connect(error => {
    if (error) throw error;
    console.log("La connection est reussi.");
});


app.get("/data", (req, res) => {
    connection.query("SELECT * FROM TypesActivite", (error, results) => {
        if (error) throw error;
        res.json(results); // Отправляем полученные данные в формате JSON
    });
});

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(PORT, () => {
    console.log(`Server est lancé: http://localhost:${PORT}`);
});
