const success = document.querySelector("#success");
async function loadData() {
    try {
        document.getElementById('createUtilisateurForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Останавливаем стандартное поведение формы

            const form = event.target;
            const formData = new FormData(form);

            const jsonData = Object.fromEntries(formData.entries());


            try {
                const response = await fetch('/creer_utilisateur_form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                });

                if (response.ok) {
                    success.textContent = "Utilisateur était crée"
                    success.className = "alert alert-success";
                }else{
                    success.textContent = "Utilisateur n'était pas crée";
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

