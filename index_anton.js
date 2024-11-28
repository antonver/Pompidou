const express = require("express");

const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mysql = require("mysql2");
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



const connection = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_antonver",
    password: "fBa$mka#9CwFfQ&",
    database: "freedb_Web project",
    connectTimeout: 1000000,
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
    connection.query("SELECT * FROM Activites", (error, results) => {
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


// POST route to search and store results
app.post("/search", (req, res) => {
    const { debut, fin, type } = req.body;

    // Validation initiale des paramètres
    if (!debut && !fin && !type) {
        return res.status(400).json({ error: "Au moins un paramètre est requis : 'debut', 'fin' ou 'type'." });
    }

    // Construction dynamique de la requête
    let query = "SELECT * FROM Activites WHERE 1=1"; // `1=1` simplifie l'ajout de clauses conditionnelles
    const params = [];

    if (debut) {
        query += " AND date >= ?";
        params.push(debut);
    }

    if (fin) {
        query += " AND date <= ?";
        params.push(fin);
    }

    if (type) {
        query += " AND idTypeActivite IN (SELECT DISTINCT idTypeActivite FROM TypesActivite WHERE activiteGenerique = ?)";
        params.push(type);
    }

    // Exécution de la requête SQL
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.status(500).json({ error: "Erreur lors de la recherche d'activités." });
        }

        res.json(results);
    });
});


// GET route to retrieve the results


