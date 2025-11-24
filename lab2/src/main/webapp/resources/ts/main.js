import { DOMHandler } from "./utils/DOMHandler";
import { ErrorHandler } from "./utils/ErrorHandler";
import { Validator } from "./utils/Validation";
import { CanvasHandler } from "./utils/CanvasHandler";
class MainApplication {
    constructor() {
        this.domHandler = new DOMHandler();
        this.errorHandler = new ErrorHandler();
        this.validator = new Validator();
        this.canvasHandler = new CanvasHandler();
        this.initializeEventListeners();
        this.initializeResultPoints();
    }
    handleRadiusChange() {
        const r = this.domHandler.getSelectedRadius();
        this.canvasHandler.setCurrentR(r);
    }
    initializeResultPoints() {
        // Инициализация точек из истории результатов
        const resultRows = document.querySelectorAll('.result-row');
        resultRows.forEach(row => {
            const cells = row.querySelectorAll('.result-cell');
            if (cells.length >= 4) {
                const x = parseFloat(cells[0].textContent || '');
                const y = parseFloat(cells[1].textContent || '');
                const r = parseFloat(cells[2].textContent || '');
                const hit = cells[3].textContent === 'Yes';
                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    this.canvasHandler.addResultPoint(x, y, hit);
                }
            }
        });
        // Устанавливаем текущий радиус если есть в истории
        const firstResult = document.querySelector('.result-row');
        if (firstResult) {
            const rCell = firstResult.querySelector('.result-cell:nth-child(3)');
            if (rCell) {
                const r = parseFloat(rCell.textContent || '');
                if (!isNaN(r)) {
                    this.domHandler.setRadiusValue(r);
                    this.canvasHandler.setCurrentR(r);
                }
            }
        }
    }
    initializeEventListeners() {
        var _a;
        this.domHandler.addYInputListener((e) => this.handleYInput(e));
        this.domHandler.addXChangeListener(() => this.hideError('error-x'));
        this.domHandler.addRadiusChangeListener(() => this.handleRadiusChange());
        (_a = this.domHandler.getForm()) === null || _a === void 0 ? void 0 : _a.reset();
        this.domHandler.addFormSubmitListener((e) => this.handleFormSubmit(e));
    }
    handleFormSubmit(event) {
        var _a;
        event.preventDefault();
        const formValues = this.domHandler.getFormValues();
        console.log("formValues", formValues);
        const validations = this.validator.validateAllFields(formValues.x, formValues.y, formValues.r);
        if (this.handleValidationResults(validations)) {
            (_a = this.domHandler.getForm()) === null || _a === void 0 ? void 0 : _a.submit();
        }
    }
    handleYInput(event) {
        const input = event.target;
        input.value = input.value.replace(/[^0-9.-]/g, '');
        this.errorHandler.hideError('error-y');
    }
    handleValidationResults(validations) {
        this.errorHandler.hideAllErrors();
        return validations.every(validation => {
            if (!validation.result.isValid) {
                this.errorHandler.showError(validation.errorId, validation.result.errorMessage);
                return false;
            }
            return true;
        });
    }
    hideError(errorId) {
        this.errorHandler.hideError(errorId);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new MainApplication();
});
//# sourceMappingURL=main.js.map