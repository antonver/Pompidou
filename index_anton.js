const express = require("express");

const app = express();
const PORT = 3000;


const mysql = require("mysql")
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connection = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_antonver",
    password: "fBa$mka#9CwFfQ&",
    database: "freedb_Web project",
    connectTimeout: 10000,
    port: 3306,
});

// // const connection = mysql.createConnection({
// //     host: "localhost",
// //     user: "root",
// //     password: "1111",
// //     database: "my_new_database",
// //     connectTimeout: 10000,
// //     port: 3306,
// //
// // });
//
connection.connect(error => {
    if (error) throw error;
    console.log("La connection est reussi.");
});


app.get("/data1", (req, res) => {
    connection.query("SELECT * FROM TypesActivite", (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get("/data2", (req, res) => {
    connection.query("SELECT DISTINCT activiteGenerique FROM TypesActivite", (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get("/data3", (req, res) => {
    connection.query("SELECT DISTINCT typeActivite FROM TypesActivite", (error, results) => {
        if (error) throw error;
        res.json(results); // Отправляем полученные данные в формате JSON
    });
});

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(PORT, () => {
});


app.post("/search", (req, res) => {
    const { debut, fin, type } = req.body;
    const query = `
        SELECT * FROM TypesActivite 
        WHERE date >= $debut AND date <= $fin AND typeActivite = $type
    `;
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
