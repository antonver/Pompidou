const activites = document.querySelector("#activites-list");
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


        activites.innerHTML = '';


        data1.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.descriptif}`;
            activites.appendChild(li);
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
        event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        // Получаем данные из формы
        const form = event.target;
        const formData = new FormData(form); // Собираем данные формы

        // Преобразуем FormData в JSON-объект
        const jsonData = Object.fromEntries(formData.entries())
        try {
            // Отправляем POST-запрос на сервер
            const response4 = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData), // Передаём данные в формате JSON
            });

            if (!response4.ok) {
                throw new Error("Erreur lors de la recherche");
            }

            // Читаем данные ответа
            const data4 = await response4.json();
                activites.innerHTML = '';
            data4.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `${item.descriptif}`;
                activites.appendChild(li);
            });


        } catch (error) {
            console.error("Ошибка при обработке запроса:", error);
        }
    });

}


document.addEventListener("DOMContentLoaded", loadData);
