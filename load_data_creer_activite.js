// Sélection des éléments HTML nécessaires
// Cette ligne sélectionne un élément dans le DOM (Document Object Model) en utilisant son id "type".
// document.querySelector() Cette méthode recherche dans la page HTML un élément correspondant au sélecteur CSS passé en argument.
const type_ = document.querySelector("#type"); // Dropdown pour les types d'activités
const success = document.querySelector("#success"); // Message de succès ou d'erreur

// Fonction principale pour charger les données et gérer les événements
//fonction asynchrone qui s'appelle loadData
async function loadData() {
    try {
        // Récupération des données depuis les points de terminaison '/data3' et '/data4'
        // await = la ligne suivante ne s'exécute pas tant que fetch() n’a pas terminé de recevoir une réponse du serveur
        // fetch('/data3') on va recuperer dans le main.js la requete pour la base de donnee pour Obtenir les types d'activités
        const response3 = await fetch('/data3'); // Types d'activités
        const response4 = await fetch('/data4'); // Mails des utilisateurs

        // Vérification des réponses des requêtes
        if (!response3.ok || !response4.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        // Conversion des réponses en JSON
        //response.json() = lit le corps de la réponse HTTP et le convertit en un objet JavaScript format est JSON.
        const data3 = await response3.json(); // Liste des types d'activités
        const data4 = await response4.json(); // Liste des mails des utilisateurs

        // Remplissage du dropdown / liste deroulante pour les types d'activités
        for (let i = 0; i < data3.length; i++) {
            // Récupère l'élément à l'index i dans le tableau data3
            const item = data3[i];
            // document.createElement('option') : Crée dynamiquement un élément <option> HTML. Cet élément sera utilisé pour ajouter une option au dropdown.
            const option = document.createElement('option'); // Création d'une option
            // La valeur est récupérée à partir de l'objet courant item dans data3.
            option.value = item.idTypeActivite; // Valeur de l'option
            // item.typeActivite : Le texte visible, tiré de l'objet courant item
            option.textContent = item.typeActivite; // Texte visible
            // Ajoute l'élément <option> nouvellement créé comme enfant du dropdown.
            type_.appendChild(option); // Ajout de l'option au dropdown
        }

        // Remplissage du dropdown pour les mails des utilisateurs
        const mail = document.querySelector("#mail");
        for (let i = 0; i < data4.length; i++) {
            const item = data4[i];
            const option = document.createElement('option'); // Création d'une option
            option.value = item.mail; // Valeur de l'option
            option.textContent = item.mail; // Texte visible
            mail.appendChild(option); // Ajout de l'option au dropdown
        }

        // Gestionnaire d'événements pour le formulaire de création d'activités
        //document.getElementById('createActivityForm') = Sélectionne l'élément HTML avec l’id createActivityForm
        //.addEventListener('submit', async function (event) { ... }) =  quand on submit ou appui sur entree l'evenement est declenché
        //function (event) { ... } = Callback
        document.getElementById('createActivityForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire


            // C’est l’élément HTML qui a déclenché l’événement.
            // Ici, cela correspond au formulaire createActivityForm
            const form = event.target; // Récupère le formulaire soumis
            // Crée un objet FormData à partir du formulaire.
            // Cet objet permet de récupérer facilement les données saisies dans le formulaire, avec leurs noms de champs et leurs valeurs.

            const formData = new FormData(form); // Récupère les données du formulaire
            // formData.entries() :
            // Retourne un itérateur sur les paires clé-valeur du formulaire (par exemple, ["nomActivite", "Randonnée"]).
            //Object.fromEntries()
            // Convertit cet itérateur en un objet JavaScript.
            const jsonData = Object.fromEntries(formData.entries()); // Conversion des données en JSON

            try {
                // Envoi d'une requête POST pour créer une activité
                const response = await fetch('/creer_activite_form', {
                    method: 'POST', // Méthode HTTP POST
                    headers: {
                        'Content-Type': 'application/json', // Type de contenu JSON
                    },
                    body: JSON.stringify(jsonData), // Corps de la requête contenant les données de l'activité
                });

                // Affichage du message de succès ou d'erreur en fonction de la réponse
                if (response.ok) {
                    success.textContent = "Activité était créée"; // Message en cas de succès
                    success.className = "alert alert-success"; // Classe pour un affichage visuel réussi
                } else {
                    success.textContent = "Activité n'était pas créée"; // Message en cas d'échec
                    success.className = "alert alert-danger"; // Classe pour un affichage visuel d'erreur
                }
            } catch (error) {
                // Gestion des erreurs réseau ou autres
                console.error("Erreur", error);
            }
        });
    } catch (error) {
        // Gestion des erreurs globales lors de la récupération des données ou de l'initialisation
        console.error("Erreur:", error);
    }
}

// Exécution de la fonction loadData après que le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", loadData);