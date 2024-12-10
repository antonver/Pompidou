// Sélection des éléments HTML
const activitesBody = document.querySelector("#activities-tbody");
const type_ = document.querySelector("#type");

// Fonction utilitaire pour reformater la date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Exemple : "10 décembre 2024"
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options); // Format en français
}


// Fonction principale pour charger les données initiales
async function loadData() {
    try {
        // Récupération des données depuis le serveur
        const response1 = await fetch('/data1'); // Activités et types associés
        const response2 = await fetch('/data2'); // Activités génériques distinctes
        const response3 = await fetch('/data3'); // Types d'activités distincts

        // Vérification des réponses
        if (!response1.ok || !response2.ok || !response3.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        // Parsing des données en JSON
        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();

        // Affichage des activités dans le tableau
        for (let i = 0; i < data1.length; i++) {
            const item = data1[i];
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${item.idActivite}</td>
        <td>${item.mailOrganisateur}</td>
        <td>${item.typeActivite}</td>
        <td>${item.commune}</td>
        <td>${item.descriptif}</td>
        <td>${formatDate(item.date)}</td> <!-- Appel de la fonction pour reformater la date -->
    `;
            activitesBody.appendChild(tr);
        }

        // Remplissage des options pour les activités génériques
        for (let i = 0; i < data2.length; i++) {
            const item = data2[i];
            const option = document.createElement('option');
            option.value = item.activiteGenerique;
            option.textContent = item.activiteGenerique;
            type_.appendChild(option);
        }

        // Remplissage des options pour les types d'activités
        for (let i = 0; i < data3.length; i++) {
            const item = data3[i];
            const option = document.createElement('option');
            option.value = item.typeActivite;
            option.textContent = item.typeActivite;
            type_.appendChild(option);
        }

    } catch (error) {
        console.error("Erreur:", error);
    }

    // Gestionnaire d'événements pour la recherche multi-critères
    document.getElementById('multiCriteriaSearchForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêche la soumission par défaut

        const form = event.target;
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        try {
            const response4 = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response4.ok) {
                throw new Error("Erreur lors de la recherche");
            }

            const data4 = await response4.json();
            activitesBody.innerHTML = '';

// Ajout des résultats de la recherche
            for (let i = 0; i < data4.length; i++) {
                const item = data4[i];
                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${item.idActivite}</td>
        <td>${item.mailOrganisateur}</td>
        <td>${item.typeActivite}</td>
        <td>${item.commune}</td>
        <td>${item.descriptif}</td>
        <td>${formatDate(item.date)}</td> <!-- Appel de la fonction pour reformater la date -->
    `;
                activitesBody.appendChild(tr); // Ajout de la ligne au tableau
            }


        } catch (error) {
            console.error("Erreur:", error);
        }
    });

    // Initialisation de Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b252ZXIiLCJhIjoiY200YmllcGhjMDBsMjJrcXFzc3A4OWsxZyJ9.cB9Yw4FG_Nu0HbdZDUnLWA';

    const map = new mapboxgl.Map({
        container: 'map', // ID de l'élément HTML pour la carte
        style: 'mapbox://styles/mapbox/streets-v11', // Style de la carte
        center: [2.2137, 46.2276], // Centre par défaut (France)
        zoom: 5 // Niveau de zoom initial
    });

    // Fonction pour récupérer les coordonnées géographiques d'un lieu
    async function getCoordinates(place, callback) {
        try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${mapboxgl.accessToken}`);
            const data = await response.json();
            const coordinates = data.features[0].center;
            callback(null, coordinates);
        } catch (error) {
            callback(error, null);
        }
    }

    // Récupération des données des communes et description pour les marqueurs sur la carte
    try {
        const response5 = await fetch('/data5');
        if (!response5.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        const data5 = await response5.json();
        let offset = 0; // Offset pour éviter le chevauchement des marqueurs

        for (let i = 0; i < data5.length; i++) {
            const item = data5[i];
            getCoordinates(item.commune, (error, coordinates) => {
                if (error) {
                    console.error("Erreur lors de la récupération des coordonnées :", error);
                    return;
                }

                // Ajout d'un léger décalage pour éviter le chevauchement des marqueurs
                offset += 0.001;

                // Ajout du marqueur à la carte
                new mapboxgl.Marker()
                    .setLngLat([coordinates[0] + offset, coordinates[1] + offset])
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setText(item.descriptif))
                    .addTo(map);
            });
        }

    } catch (error) {
        console.error("Erreur:", error);
    }
}

// Chargement des données une fois le DOM prêt
document.addEventListener("DOMContentLoaded", loadData);
