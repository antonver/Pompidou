
const type_ = document.querySelector("#type");
const success = document.querySelector("#success");
async function loadData() {
    try {
        const response3 = await fetch('/data3');
        const response4 = await fetch('/data4');
        if (!response3.ok || !response4.ok) {
            throw new Error("Erreur pendant le téléchargement des données");
        }

        const data3 = await response3.json();
        const data4 = await response4.json();
        data3.forEach(item => {
            const option = document.createElement('option');
            option.value = item.idTypeActivite;
            option.textContent = item.typeActivite;
            type_.appendChild(option);
        });

        data4.forEach(item => {
            const option = document.createElement('option');
            option.value = item.mail;
            option.textContent = item.mail;
            mail.appendChild(option);
        });

        document.getElementById('createActivityForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Останавливаем стандартное поведение формы

            const form = event.target;
            const formData = new FormData(form);

            const jsonData = Object.fromEntries(formData.entries());


            try {
                const response = await fetch('/creer_activite_form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                });

                if (response.ok) {
                    success.textContent = "Activité était crée"
                    success.className = "alert alert-success";
                }else{
                success.textContent = "Activité n'était pas crée";
                success.className = "alert alert-danger";
                }

            } catch (error) {
                console.error("Erreur", error);
            }
        });


    } catch (error) {
        console.error("Erreur:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadData);

