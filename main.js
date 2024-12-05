const express = require("express");

const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const req = require("express/lib/request");
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

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "1111",
//     database: "ActivitesDB",
//     connectTimeout: 10000,
//     port: 3306,
//
// });

connection.connect(error => {
    if (error) throw error;
    console.log("La connection est reussi.");
});

app.get("/data1", (req, res) => {
    connection.query("SELECT * FROM Activites a JOIN TypesActivite t ON a.idTypeActivite = t.idTypeActivite;", (error, results) => {
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
    connection.query("SELECT DISTINCT typeActivite, idTypeActivite FROM TypesActivite", (error, results) => {
        if (error) throw error;
        res.json(results); // Отправляем полученные данные в формате JSON
    });
});



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/main.html");
})


app.get("/creer_activite", (req, res) => {
    res.sendFile(__dirname + "/creer-activite.html");
})

app.get("/creer_utilisateur", (req, res) => {
    res.sendFile(__dirname + "/creer-utilisateur.html");
})

// POST route to search and store results
app.post("/search", (req, res) => {
    const { debut, fin, type } = req.body;

    // Validation initiale des paramètres
    if (!debut && !fin && !type) {
        return res.status(400).json({ error: "Au moins un paramètre est requis : 'debut', 'fin' ou 'type'." });
    }

    // Construction dynamique de la requête
    let query = "SELECT * FROM Activites a JOIN TypesActivite t ON a.idTypeActivite = t.idTypeActivite WHERE 1=1"; // `1=1` simplifie l'ajout de clauses conditionnelles
    const params = [];

    if (debut) {
        query += " AND a.date >= ?";
        params.push(debut);
    }

    if (fin) {
        query += " AND a.date <= ?";
        params.push(fin);
    }

    if (type) {
        query += " AND a.idTypeActivite IN (SELECT DISTINCT t2.idTypeActivite FROM TypesActivite t2 WHERE t2.activiteGenerique = ?)";
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



// Creer activite

app.get("/data4", (req, res) => {
    connection.query("SELECT DISTINCT mail FROM Utilisateurs", (error, results) => {
        if (error) throw error;
        res.json(results); // Отправляем полученные данные в формате JSON
    });

})

app.post("/creer_activite_form", (req, res) => {
    const { mail, type, commune, descriptif, date} = req.body;
    let params = [ mail, type, commune, descriptif, date];
    // Validation initiale des paramètres
    if (!mail || !commune || !type || !descriptif || !date) {
        return res.status(400).json({ error: "Tous les paramètre sont requis"});
    }
    // Construction dynamique de la requête
    console.log(params);
    let query = `
INSERT INTO Activites (mailOrganisateur, idTypeActivite, commune, descriptif, date)
VALUES
    (?, ?, ?, ?, ?)
`;


    // Exécution de la requête SQL
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.status(500).json({ error: "Erreur lors de la création de l'activité" });
        }

        res.status(201).json({ message: "Activité créée avec succès", results });
    });
});

app.post("/creer_utilisateur_form", (req, res) => {
    const { mail, nom, prenom, telephone } = req.body;
    let params = [ mail, nom, prenom, telephone];
    // Validation initiale des paramètres
    if (!mail || !nom || !prenom || !telephone) {
        return res.status(400).json({ error: "Tous les paramètre sont requis"});
    }
    // Construction dynamique de la requête
    console.log(params);
    let query = `
INSERT INTO Utilisateurs (mail, nom, prenom, telephone)
VALUES
    (?, ?, ?, ?)
`;


    // Exécution de la requête SQL
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
        }

        res.status(201).json({ message: "Urilisateur créée avec succès", results });
    });
});
