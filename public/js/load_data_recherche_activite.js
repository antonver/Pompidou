
const activitesBody = document.querySelector("#activites-list");
const type_ = document.querySelector("#type");

async function loadData() {
    try {
        const response1 = await fetch('/data1');
        const response2 = await fetch('/data2');
        const response3 = await fetch('/data3');

        if (!response1.ok || !response2.ok || !response3.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();

        data1.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${item.idActivite}</td>
        <td>${item.mailOrganisateur}</td>
        <td>${item.typeActivite}</td>
        <td>${item.commune}</td>
        <td>${item.descriptif}</td>
        <td>${item.date}</td>
      `;
            activitesBody.appendChild(tr);
        });

        data2.forEach(item => {
            const option = document.createElement('option');
            option.value = item.activiteGenerique;
            option.textContent = item.activiteGenerique;
            type_.appendChild(option);
        });

        data3.forEach(item => {
            const option = document.createElement('option');
            option.value = item.typeActivite;
            option.textContent = item.typeActivite;
            type_.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur:", error);
    }

    document.getElementById('multiCriteriaSearchForm').addEventListener('submit', async function (event) {
        event.preventDefault();

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
            activitesBody.innerHTML = "";

            data4.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${item.idActivite}</td>
          <td>${item.mailOrganisateur}</td>
          <td>${item.typeActivite}</td>
          <td>${item.commune}</td>
          <td>${item.descriptif}</td>
          <td>${item.date}</td>
        `;
                activitesBody.appendChild(tr);
            });

        } catch (error) {
            console.error("Erreur:", error);
        }
    });
    // Mapbox initialization
    // Mapbox initialization
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b252ZXIiLCJhIjoiY200YmllcGhjMDBsMjJrcXFzc3A4OWsxZyJ9.cB9Yw4FG_Nu0HbdZDUnLWA';

    // Initialize the map once
    const map = new mapboxgl.Map({
        container: 'map', // Ensure this container is empty in your HTML
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.2137, 46.2276], // Default center
        zoom: 5 // Default zoom level
    });

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
    try {
        const response5 = await fetch('/data5');
        if (!response5.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }
        const data5 = await response5.json();

        let adding = 0;
        data5.forEach(item => {

            getCoordinates(item.commune, (error, coordinates) => {
                if (error) {
                    console.error('Error fetching coordinates:', error);
                    return;
                }
                adding += 0.001;
                // Add marker to the existing map
                const marker = new mapboxgl.Marker()
                    .setLngLat([coordinates[0]+ adding, coordinates[1] + adding])
                    .setPopup(new mapboxgl.Popup({offset: 25})
                        .setText(item.descriptif))
                    .addTo(map);
            });
        });


    }catch (error) {
        console.error("Erreur:", error);
    }


}

document.addEventListener("DOMContentLoaded", loadData);
