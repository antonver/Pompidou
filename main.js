// Importation des modules nécessaires
const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques et gérer les données JSON/urlencoded
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la base de données
const connection = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_antonver",
    password: "fBa$mka#9CwFfQ&",
    database: "freedb_Web project",
    connectTimeout: 1000000,
    port: 3306,
});

// Connexion à la base de données
connection.connect((error) => {
    if (error) {
        throw error;
    }
    console.log("Connexion réussie à la base de données.");
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

// Routes

// Route principale
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/main.html");
});

// Pages HTML spécifiques
app.get("/creer_activite", (req, res) => {
    res.sendFile(__dirname + "/creer-activite.html");
});

app.get("/creer_utilisateur", (req, res) => {
    res.sendFile(__dirname + "/creer-utilisateur.html");
});

// Routes pour les données
// Obtenir toutes les activités avec leurs types associés
app.get("/data1", (req, res) => {
    const query = `
        SELECT * 
        FROM Activites a 
        JOIN TypesActivite t 
        ON a.idTypeActivite = t.idTypeActivite;
    `;
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtenir les activités génériques distinctes
app.get("/data2", (req, res) => {
    const query = "SELECT DISTINCT activiteGenerique FROM TypesActivite";
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtenir les types d'activités distincts
app.get("/data3", (req, res) => {
    const query = "SELECT DISTINCT typeActivite, idTypeActivite FROM TypesActivite";
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.json({ error: "Erreur interne du serveur", details: error.message });
        }
        res.json(results);
    });
});

// Obtenir les communes et descriptions des activités
app.get("/data5", (req, res) => {
    const query = "SELECT commune, descriptif FROM Activites";
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtenir les emails d'utilisateurs
app.get("/data4", (req, res) => {
    const query = "SELECT DISTINCT mail FROM Utilisateurs";
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Route POST pour la recherche dynamique d'activités
app.post("/search", (req, res) => {
    const { debut, fin, type } = req.body;

    // Validation des paramètres
    if (!debut && !fin && !type) {
        return res.json({ error: "Au moins un paramètre est requis : 'debut', 'fin' ou 'type'." });
    }

    // Construction dynamique de la requête
    let query = `
        SELECT * 
        FROM Activites a 
        JOIN TypesActivite t 
        ON a.idTypeActivite = t.idTypeActivite 
        WHERE 1=1
    `;
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
        query += `
            AND a.idTypeActivite IN (
                SELECT DISTINCT t2.idTypeActivite 
                FROM TypesActivite t2 
                WHERE t2.activiteGenerique = ?
            )
        `;
        params.push(type);
    }

    // Exécution de la requête SQL
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.json({ error: "Erreur lors de la recherche d'activités." });
        }
        res.json(results);
    });
});

// Route POST pour créer une activité
app.post("/creer_activite_form", (req, res) => {
    const { mail, type, commune, descriptif, date } = req.body;

    // Validation des paramètres
    if (!mail || !type || !commune || !descriptif || !date) {
        return res.json({ error: "Tous les paramètres sont requis." });
    }

    // Requête pour insérer une activité
    const query = `
        INSERT INTO Activites (mailOrganisateur, idTypeActivite, commune, descriptif, date)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [mail, type, commune, descriptif, date];

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.json({ error: "Erreur lors de la création de l'activité." });
        }
        res.json({ message: "Activité créée avec succès", results });
        res.json({ message: "Activité créée avec succès", results });
    });
});

// Route POST pour créer un utilisateur
app.post("/creer_utilisateur_form", (req, res) => {
    const { mail, nom, prenom, telephone } = req.body;

    // Validation des paramètres
    if (!mail || !nom || !prenom || !telephone) {
        return res.json({ error: "Tous les paramètres sont requis." });
    }

    // Requête pour insérer un utilisateur
    const query = `
        INSERT INTO Utilisateurs (mail, nom, prenom, telephone)
        VALUES (?, ?, ?, ?)
    `;
    const params = [mail, nom, prenom, telephone];

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error);
            return res.json({ error: "Erreur lors de la création de l'utilisateur." });
        }
        res.json({ message: "Utilisateur créé avec succès", results });
    });
});
