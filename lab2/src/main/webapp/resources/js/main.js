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

// Валидация и обработка формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('coordinates-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Получение значений из формы
        const x = document.getElementById('coordinate-x').value;
        const y = document.getElementById('coordinate-y').value;
        const r = getSelectedRadius();

        // Валидация данных
        if (!validateXValue(x) || !validateYValue(y) || !validateRValue(r)) {
            return;
        }

        // Если валидация прошла успешно, форма отправится обычным способом
        // (через action и method, указанные в форме)
        form.submit();
    });

    // Обработчики для скрытия ошибок при изменении значений
    document.getElementById('coordinate-x').addEventListener('change', function() {
        hideError("error-x");
    });

    document.getElementById('coordinate-y').addEventListener('input', function() {
        hideError("error-y");
    });

    // Обработчик для radio кнопок
    const radioButtons = document.querySelectorAll('input[name="radius"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            hideError("error-r");
        });
    });

    // Валидация ввода в реальном времени для координаты Y
    document.getElementById('coordinate-y').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9.-]/g, '');
    });
});

// Функция для получения выбранного значения радиуса
function getSelectedRadius() {
    const selectedRadio = document.querySelector('input[name="radius"]:checked');
    return selectedRadio ? selectedRadio.value : null;
}

// Функции валидации данных
// Валидация X
function validateXValue(x) {
    if (x === '' || x === null) {
        showError("error-x", 'Please select X coordinate');
        return false;
    }

    const xNum = parseFloat(x);
    if (isNaN(xNum) || xNum < -3 || xNum > 5) {
        showError("error-x", 'X must be a number between -3 and 5');
        return false;
    }

    return true;
}

// Валидация Y
function validateYValue(y) {
    const yNum = parseFloat(y);
    if (isNaN(yNum) || yNum < -3 || yNum > 3) {
        showError("error-y", 'Y must be a number between -3 and 3');
        document.getElementById('coordinate-y').focus();
        return false;
    }
    return true;
}

// Валидация R
function validateRValue(r) {
    const correctR = ["1", "1.5", "2", "2.5", "3"];
    if (!r || !correctR.includes(r)) {
        showError("error-r", 'Please select a radius value');
        return false;
    }
    return true;
}