
/*

const express = require("express");
const app = express();
app.listen(8888);
const mysql = require("mysql");
const connexion = mysql.createConnection(
{
    host: "mysql.etu.umontpellier.fr",
    user: "e20190000222",password: "1234",
    database: "e20190000222"
});
connexion.connect(error=>
{
    if (error) throw error;
    console.log("Connexion !");
});

app.get("/produits", (req, res) => 
{
    sql = "SELECT * from produits;";
    connexion.query(sql, (err, resultat)=>{
        console.log(resultat);
        res.json(resultat);
    });
});
app.get("/activites", (req, res) => 
    {
        sql = "SELECT * from activites;";
        connexion.query(sql, (err, resultat)=>{
            console.log(resultat);
            res.json(resultat);

        });
    });

*/


//new 

var express = require("express");
var app = express();
app.listen(8888);

const mysql = require("mysql");

// Les exemples donnÃ©s sont pour une connexion en local sur la fac
// Le user/database et password sont Ã  modifier...
const connection = mysql.createConnection({
    host: "mysql.etu.umontpellier.fr",
    user: "e20190000222",
    password: "1234",
    database: "e20190000222"
  });
  
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

app.get('/', function(request, response) {
    response.sendFile('client.html', {root: __dirname});
});

app.get('/utilisateurs', function(request, response) {
    sql = "SELECT * from utilisateurs;";   
    connnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Resultat: " + result);
      });
    response.json([]);
});

app.get('/type_activites', function(request, response) {
    sql = "SELECT * from type_activites;";  
    connnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Resultat: " + result);
      });
    response.json([]);

}); app.get('/activites', function(request, response) {
    sql = "SELECT * from activites;";
    connnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Resultat: " + result);
      });
    response.json([]);
});