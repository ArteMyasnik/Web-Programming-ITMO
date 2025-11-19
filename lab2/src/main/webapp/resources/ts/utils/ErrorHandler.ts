const ERROR_DISPLAY_TIME = 5000; // 5 секунд

class ErrorHandler {
    public showError(errorId: string, message: string): void {
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

    public hideError(errorId: string): void {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }
    }

    public hideAllErrors(): void {
        const errorIds = ["error-x", "error-y", "error-r"];
        errorIds.forEach(id => this.hideError(id));
    }
}

export { ErrorHandler };