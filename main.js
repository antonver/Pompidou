// Importation des modules nécessaires
const express = require("express"); // importe express Express.js framework web pour Node.js
const mysql = require("mysql2");

const app = express(); // sert a creer l'app express
const PORT = 3000; // le port est configuré sur 3000

// Middleware pour servir les fichiers statiques et gérer les données JSON/urlencoded
app.use(express.static("public")); // express configure les fichiers dans le dossier public en static, static ne change pas le code
app.use(express.json()); // configure express pour qu'il puisse analyser le json
app.use(express.urlencoded({ extended: true })); //permet au serveur de comprendre les requêtes HTTP contenant des données encodées dans l’URL

// Configuration de la base de données
// connexion à une base de données MySQL
const connection = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_antonver",
    password: "fBa$mka#9CwFfQ&",
    database: "freedb_Web project",
    connectTimeout: 1000000,
    port: 3306,
});

// Connexion à la base de données
// call back est appellé une fois que la tentative de connexion est terminée
// petit debug pour savoir si la base de donnée est connectée ou erreur
connection.connect((error) => {
    if (error) {
        throw error;
    }
    console.log("Connexion réussie à la base de données.");
});

// Démarrage du serveur
//demarre le serveur express et ecoute les requetes qui vont arriver
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
// attend les connexions a partir d'un navigateur ou un autre client

// Routes

// Route principale
// GET est une méthode HTTP utilisée lorsqu’un client (par exemple, un navigateur) demande des données ou une page.
// req , res servent de callback = request et result
//
app.get("/", (req, res) => {
    //res.senFile = methode qui envoie le fichier statique main.html
    res.sendFile(__dirname + "/main.html");
});



// Pages HTML spécifiques
// pareil quand on va cliquer sur le bouton creer activite le app get va nous afficher la page creer-activite.html
app.get("/creer_activite", (req, res) => {
    res.sendFile(__dirname + "/creer-activite.html");
});

app.get("/creer_utilisateur", (req, res) => {
    res.sendFile(__dirname + "/creer-utilisateur.html");
});

// Routes pour les données
// Obtenir toutes les activités avec leurs types associés
//express renvoie le resultat du'une requete sql quand on demande data1
app.get("/data1", (req, res) => {
    const query = `
        SELECT * 
        FROM Activites a 
        JOIN TypesActivite t 
        ON a.idTypeActivite = t.idTypeActivite;
    `;
    // connexion . requete ( requete + call back une fois que la requete est terminé, affiche le resultat ou erreur)
    //connection.query() = Exécute la requête SQL et appelle un callback avec les erreurs ou résultats.
    // error	Gère les erreurs qui surviennent pendant l’exécution de la requête.
    // results	Contient les données retournées par la base si la requête réussit.
    //
    connection.query(query, (error, results) => {
        // si erreur renvoie erreur
        if (error) throw error;
        //sinon Envoie les données au client en format JSON.
        //res.json(results)	Envoie les données au client en format JSON.
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
            return res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
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
// express.post permet d ' envoyer sur le serveur
// req Contient toutes les informations sur la requête HTTP envoyée par le client
// res Utilisé pour envoyer une réponse au client.
// app.post("/search")	Crée une route POST pour recevoir les critères de recherche du client.

app.post("/search", (req, res) => {
    const { debut, fin, type } = req.body;

    // Validation des paramètres
    // il faut rentrer au moins une donnée pour faire fonctionner search
    if (!debut && !fin && !type) {
        return res.status(400).json({ error: "Au moins un paramètre est requis : 'debut', 'fin' ou 'type'." });
    }

    // Construction dynamique de la requête / s'adapte en fonction des données renseignés
    let query = `
        SELECT * 
        FROM Activites a 
        JOIN TypesActivite t 
        ON a.idTypeActivite = t.idTypeActivite 
        WHERE 1=1 
    `; // Cela garantit que la requête est toujours valide, même si aucun filtre n'est ajouté.
    const params = []; // tableau destiné à stocker les valeurs des critères de recherche

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
            return res.status(500).json({ error: "Erreur lors de la recherche d'activités." });
        }
        res.json(results);
    });
});

// Route POST pour créer une activité
// req Contient toutes les informations sur la requête HTTP envoyée par le client
// res Utilisé pour envoyer une réponse au client.
app.post("/creer_activite_form", (req, res) => {
    const { mail, type, commune, descriptif, date } = req.body;

    // Validation des paramètres
    if (!mail || !type || !commune || !descriptif || !date) {
        return res.status(400).json({ error: "Tous les paramètres sont requis." });
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
            return res.status(500).json({ error: "Erreur lors de la création de l'activité." });
        }
        res.status(201).json({ message: "Activité créée avec succès", results });
    });
});

// Route POST pour créer un utilisateur
app.post("/creer_utilisateur_form", (req, res) => {
    const { mail, nom, prenom, telephone } = req.body;

    // Validation des paramètres
    if (!mail || !nom || !prenom || !telephone) {
        return res.status(400).json({ error: "Tous les paramètres sont requis." });
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
            return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
        }
        res.status(201).json({ message: "Utilisateur créé avec succès", results });
    });
});
