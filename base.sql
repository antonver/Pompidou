-- Création de la base de données
CREATE DATABASE ActivitesDB;

-- Utilisation de la base de données
USE ActivitesDB;

-- Table des Utilisateurs
CREATE TABLE Utilisateurs (
                              idUtilisateur INT AUTO_INCREMENT PRIMARY KEY,
                              mail VARCHAR(100) NOT NULL UNIQUE,
                              nom VARCHAR(50),
                              prenom VARCHAR(50),
                              telephone VARCHAR(15)
);

-- Table des TypesActivité
CREATE TABLE TypesActivite (
                               idTypeActivite INT AUTO_INCREMENT PRIMARY KEY,
                               typeActivite VARCHAR(50) NOT NULL,
                               activiteGenerique VARCHAR(50)
);

-- Table des Activités
CREATE TABLE Activites (
                           idActivite INT AUTO_INCREMENT PRIMARY KEY,
                           mailOrganisateur VARCHAR(100) NOT NULL,
                           idTypeActivite INT NOT NULL,
                           commune VARCHAR(50),
                           descriptif TEXT,
                           date DATE,
                           FOREIGN KEY (mailOrganisateur) REFERENCES Utilisateurs(mail),
                           FOREIGN KEY (idTypeActivite) REFERENCES TypesActivite(idTypeActivite)
);

-- Insérer des utilisateurs
INSERT INTO Utilisateurs (mail, nom, prenom, telephone)
VALUES
    ('utilisateur1@example.com', 'Dupont', 'Jean', '0123456789'),
    ('utilisateur2@example.com', 'Martin', 'Claire', '0987654321');

-- Insérer des types d'activités
INSERT INTO TypesActivite (typeActivite, activiteGenerique)
VALUES
    ('sport', ''),
    ('randonnée', 'sport'),
    ('randonnée sportive', 'randonnée');

-- Insérer des activités
INSERT INTO Activites (mailOrganisateur, idTypeActivite, commune, descriptif, date)
VALUES
    ('utilisateur1@example.com', 1, 'Paris', 'Séance de sport en plein air', '20241114'),
    ('utilisateur2@example.com', 2, 'Lyon', 'Randonnée dans les montagnes', '20241115');
