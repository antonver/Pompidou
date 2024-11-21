const tableBody = document.querySelector("#data-table tbody");

// Функция для загрузки данных с сервера
async function loadData() {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error("Ошибка при загрузке данных");

        const data = await response.json();

        tableBody.innerHTML = '';

        // Заполняем таблицу данными
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener("DOMContentLoaded", loadData);