const activites = document.querySelector("#activites-list");

// Функция для загрузки данных с сервера
async function loadData() {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error("Erreur pendand telechergement de donné");

        const data = await response.json();

        activites.innerHTML = '';

        // Заполняем таблицу данными
        data.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `
                <li>${item.idTypeActivite}, ${item.typeActivite}, ${item.activiteGenerique}</li>

            `;
            activites.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur:", error);
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener("DOMContentLoaded", loadData);