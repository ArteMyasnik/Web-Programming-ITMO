const ERROR_DISPLAY_TIME = 5000; // 5 секунд
class ErrorHandler {
    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (!errorElement) {
            console.warn(`Элемент с ID '${errorId}' не найден на странице`);
            return;
        }
        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.style.fontSize = "small";
        errorElement.style.display = 'block';
        setTimeout(() => {
            this.hideError(errorId);
        }, ERROR_DISPLAY_TIME);
    }
    hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }
    }
    hideAllErrors() {
        const errorIds = ["error-x", "error-y", "error-r"];
        errorIds.forEach(id => this.hideError(id));
    }
}
export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map