// Sélection de l'élément HTML pour afficher les messages de succès ou d'erreur
const success = document.querySelector("#success");

// Fonction principale pour charger les données ou gérer les événements
async function loadData() {
    try {
        // Ajout d'un gestionnaire d'événement sur le formulaire de création d'utilisateur
        document.getElementById('createUtilisateurForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

            const form = event.target; // Récupère le formulaire soumis
            const formData = new FormData(form); // Récupère les données du formulaire en tant qu'objet FormData

            // Conversion des données du formulaire en un objet JSON
            const jsonData = Object.fromEntries(formData.entries());

            try {
                // Envoie une requête POST au serveur pour créer un utilisateur
                const response = await fetch('/creer_utilisateur_form', {
                    method: 'POST', // Méthode HTTP POST
                    headers: {
                        'Content-Type': 'application/json', // Type de contenu JSON
                    },
                    body: JSON.stringify(jsonData), // Corps de la requête contenant les données utilisateur
                });

                // Vérifie si la requête a réussi
                if (response.ok) {
                    // Affiche un message de succès si l'utilisateur a été créé
                    success.textContent = "Utilisateur était crée";
                    success.className = "alert alert-success";
                } else {
                    // Affiche un message d'erreur si l'utilisateur n'a pas été créé
                    success.textContent = "Utilisateur n'était pas crée";
                    success.className = "alert alert-danger";
                }

            } catch (error) {
                // Gère les erreurs réseau ou autres
                console.error("Erreur", error);
            }
        });

    } catch (error) {
        // Gère les erreurs survenues lors de l'exécution de la fonction principale
        console.error("Erreur:", error);
    }
}

// Attache la fonction `loadData` pour s'exécuter une fois le DOM complètement chargé
document.addEventListener("DOMContentLoaded", loadData);
