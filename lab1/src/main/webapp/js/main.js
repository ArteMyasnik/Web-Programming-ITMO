const SERVER_ENDPOINT = "/fcgi-bin/FastCGIServer-1.0-SNAPSHOT-jar-with-dependencies.jar";
let currentSessionId = null;

// Сообщения об ошибках
function showError(errorId, message) {
    let error = document.getElementById(errorId);
    error.innerHTML = message;
    error.style.color = "red";
    error.style.fontSize = "medium";
    setTimeout(() => hideError(errorId), 5000);
}

function hideError(errorId) {
    document.getElementById(errorId).innerHTML = "";
}

// Валидация и отправка данных на сервер
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка истории из localStorage
    loadFromStorage();

    const form = document.getElementById('coordinates-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Получение значений из формы
        const x = document.getElementById('coordinate-x').value;
        const y = document.getElementById('coordinate-y').value;
        const r = document.getElementById('radius').value;

        // Валидация данных
        if (!validateXValue(x) || !validateYValue(y) || !validateRValue(r)) {
            return;
        }

        // Отправка данных на сервер
        sendData(x, y, r);
    });

    // Обработчики для скрытия ошибок при изменении значений
    document.getElementById('coordinate-x').addEventListener('change', function() {
        hideError("error-x");
    });

    document.getElementById('coordinate-y').addEventListener('input', function() {
        hideError("error-y");
    });

    document.getElementById('radius').addEventListener('change', function() {
        hideError("error-r");
    });

    // Валидация ввода в реальном времени для целых чисел
    document.getElementById('coordinate-y').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9-]/g, '');
    });

    document.getElementById('radius').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

// Функция валидации данных
// Валидация X
function validateXValue(x) {
    if (x === '' || x === null) {
        showError("error-x" , 'Please select X coordinate');
        return false;
    }
    return true;
}

// Валидация Y
function validateYValue(y) {
    const yNum = parseInt(y);
    if (isNaN(yNum) || yNum < -3 || yNum > 3 || y.toString().includes('.')) {
        showError("error-y" , 'Y must be an INTEGER number between -3 and 3');
        document.getElementById('coordinate-y').focus();
        return false;
    }
    return true;
}

// Валидация R
function validateRValue(r) {
    const correctR = ["1", "2", "3", "4"];
    if (!correctR.includes(r)) {
        showError("error-r", 'R must be one of: 1, 2, 3, 4');
        document.getElementById('radius').focus();
        return false;
    }
    return true;
}

// Отправка данных на сервер
function sendData(x, y, r) {
    const data = {
        x: x,
        y: parseInt(y),
        r: parseInt(r)
    };

    if (currentSessionId) {
        data.session_id = currentSessionId;
    }

    const startTime = performance.now();

    fetch(SERVER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status=${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.session_id) {
                currentSessionId = result.session_id;
                sessionStorage.setItem('session_id', currentSessionId);
                migrateLocalStorageToSession();
            }
            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);

            // Конвертируем микросекунды в миллисекунды для отображения
            const serverExecutionTime = result.execution_time ? (result.execution_time / 1000).toFixed(2) : executionTime;

            // Добавление результата в таблицу
            addResultToTable(result.x || x, result.y || y, result.r || r, result.hit,
                result.current_time || result.currentTime, serverExecutionTime);

            saveToSessionStorage(result);

            // Сброс ошибок
            hideError("error-x");
            hideError("error-y");
            hideError("error-r");
        })
        .catch(error => {
            console.error('Error:', error);
            showError("error-x", error.message);
        });
}

function migrateLocalStorageToSession() {
    const localResults = JSON.parse(localStorage.getItem("pointResults") || "[]");
    if (localResults.length > 0) {
        localStorage.removeItem("pointResults");
        localResults.forEach(result => {
            saveToSessionStorage(result);
        });
        console.log(`Migrated ${localResults.length} results from localStorage to session`);
    }
}

// Добавление результата в таблицу
function addResultToTable(x, y, r, hit, currentTime, executionTime) {
    const table = document.getElementById('results-table');

    // Создание новой строки
    const newRow = document.createElement('tr');

    // Форматирование данных
    const xFormatted = parseFloat(x).toFixed(1);
    const yFormatted = parseFloat(y).toFixed(1);
    const rFormatted = parseFloat(r).toFixed(1);
    const hitFormatted = hit ? "Yes" : "No";

    newRow.innerHTML = `
        <td>${xFormatted}</td>
        <td>${yFormatted}</td>
        <td>${rFormatted}</td>
        <td>${hitFormatted}</td>
        <td>${currentTime}</td>
        <td>${executionTime} ms</td>
    `;

    // Добавление строки в начало таблицы
    if (table.rows.length > 1) {
        table.insertBefore(newRow, table.rows[1]);
    } else {
        table.appendChild(newRow);
    }
}

function saveToSessionStorage(result) {
    let results = JSON.parse(sessionStorage.getItem("sessionResults") || "[]");
    results.unshift(result);
    if (results.length > 50) {
        results = results.slice(0, 50);
    }
    sessionStorage.setItem("sessionResults", JSON.stringify(results));
}

function loadFromStorage() {
    currentSessionId = sessionStorage.getItem('session_id');

    if (currentSessionId) {
        loadSessionHistory();
    } else {
        const localResults = JSON.parse(localStorage.getItem("pointResults") || "[]");
        const sessionResults = JSON.parse(sessionStorage.getItem("sessionResults") || "[]");

        if (sessionResults.length > 0) {
            sessionResults.forEach((result) => {
                if (result.x !== undefined && result.y !== undefined && result.r !== undefined) {
                    addResultToTable(result.x, result.y, result.r, result.hit,
                        result.current_time || result.currentTime,
                        result.execution_time || result.executionTime);
                }
            });
        }
        else if (localResults.length > 0) {
            localResults.forEach((result) => {
                if (result.x !== undefined && result.y !== undefined && result.r !== undefined) {
                    addResultToTable(result.x, result.y, result.r, result.hit,
                        result.current_time || result.currentTime,
                        result.execution_time || result.executionTime);
                }
            });
        }
    }
}

// Загрузка истории из действующей сессии
function loadSessionHistory() {
    if (!currentSessionId) return;

    fetch(SERVER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'get_history',
            session_id: currentSessionId
        })
    })
        .then(response => response.json())
        .then(data => {
            // Очищаем таблицу
            const table = document.getElementById('results-table');
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            // Добавляем результаты из сессии
            if (data.history) {
                data.history.forEach(result => {
                    addResultToTable(
                        result.x, result.y, result.r,
                        result.hit, result.current_time,
                        result.execution_time
                    );
                });
            }
        })
        .catch(error => {
            console.error('Error loading session history:', error);
        });
}