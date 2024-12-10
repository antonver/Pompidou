// Sélection des éléments HTML nécessaires
const type_ = document.querySelector("#type"); // Dropdown pour les types d'activités
const success = document.querySelector("#success"); // Message de succès ou d'erreur

// Fonction principale pour charger les données et gérer les événements
async function loadData() {
    try {
        // Récupération des données depuis les points de terminaison '/data3' et '/data4'
        const response3 = await fetch('/data3'); // Types d'activités
        const response4 = await fetch('/data4'); // Mails des utilisateurs

        // Vérification des réponses des requêtes
        if (!response3.ok || !response4.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        // Conversion des réponses en JSON
        const data3 = await response3.json(); // Liste des types d'activités
        const data4 = await response4.json(); // Liste des mails des utilisateurs

        // Remplissage du dropdown pour les types d'activités
        data3.forEach(item => {
            const option = document.createElement('option'); // Création d'une option
            option.value = item.idTypeActivite; // Valeur de l'option
            option.textContent = item.typeActivite; // Texte visible
            type_.appendChild(option); // Ajout de l'option au dropdown
        });

        // Remplissage du dropdown pour les mails des utilisateurs
        const mail = document.querySelector("#mail"); // Assurez-vous que cet élément existe dans le HTML
        data4.forEach(item => {
            const option = document.createElement('option'); // Création d'une option
            option.value = item.mail; // Valeur de l'option
            option.textContent = item.mail; // Texte visible
            mail.appendChild(option); // Ajout de l'option au dropdown
        });

        // Gestionnaire d'événements pour le formulaire de création d'activités
        document.getElementById('createActivityForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

            const form = event.target; // Récupère le formulaire soumis
            const formData = new FormData(form); // Récupère les données du formulaire
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
