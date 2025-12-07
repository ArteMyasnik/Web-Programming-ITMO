import {DOMHandler} from "./utils/DOMHandler";
import {ErrorHandler} from "./utils/ErrorHandler";
import {FieldValidator, Validator} from "./utils/Validation";
import {CanvasHandler} from "./utils/CanvasHandler";
import {SVGHandler} from "./utils/SVGHandler";

class MainApplication {
    private domHandler: DOMHandler;
    private errorHandler: ErrorHandler;
    private validator: Validator;
    private canvasHandler: CanvasHandler;
    private svgHandler: SVGHandler;

    constructor() {
        this.domHandler = new DOMHandler();
        this.errorHandler = new ErrorHandler();
        this.validator = new Validator();
        this.canvasHandler = new CanvasHandler(this.errorHandler);
        this.svgHandler = new SVGHandler();

        this.initializeEventListeners();
        this.initializeResultPoints();
    }

    private handleRadiusChange(): void {
        const r = this.domHandler.getSelectedRadius();
        if (r !== null) {
            this.canvasHandler.setCurrentR(r);
            this.svgHandler.setCurrentR(r);
        }
    }

    private initializeResultPoints(): void {
        const resultRows = document.querySelectorAll('.result-row');
        resultRows.forEach(row => {
            const cells = row.querySelectorAll('.result-cell');
            if (cells.length >= 4) {
                const x = parseFloat(cells[0].textContent || '');
                const y = parseFloat(cells[1].textContent || '');
                const r = parseFloat(cells[2].textContent || '');
                const hit = cells[3].textContent === 'Yes';

                if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                    this.canvasHandler.addResultPoint(x, y, r, hit);
                }
            }
        });

        const firstResult = document.querySelector('.result-row');
        if (firstResult) {
            const rCell = firstResult.querySelector('.result-cell:nth-child(3)');
            if (rCell) {
                const r = parseFloat(rCell.textContent || '');
                if (!isNaN(r)) {
                    this.domHandler.setRadiusValue(r);
                    this.canvasHandler.setCurrentR(r);
                    this.svgHandler.setCurrentR(r);
                }
            }
        }
    }

    private initializeEventListeners(): void {
        this.domHandler.addYInputListener((e) => this.handleYInput(e));
        this.domHandler.addXChangeListener(() => this.hideError('error-x'));
        this.domHandler.addRadiusChangeListener(() => this.handleRadiusChange());
        this.domHandler.getForm()?.reset();
        this.domHandler.addFormSubmitListener((e) => this.handleFormSubmit(e));
    }

    private handleFormSubmit(event: Event): void {
        event.preventDefault();
        const formValues = this.domHandler.getFormValues();
        const validations = this.validator.validateAllFields(formValues.x, formValues.y, formValues.r);

        if (this.handleValidationResults(validations)) {
            this.domHandler.getForm()?.submit();
        }
    }

    private handleYInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9.-]/g, '');
        this.errorHandler.hideError('error-y');
    }

    private handleValidationResults(validations: FieldValidator[]): boolean {
        this.errorHandler.hideAllErrors();
        return validations.every(validation => {
            if (!validation.result.isValid) {
                this.errorHandler.showError(validation.errorId, validation.result.errorMessage!);
                return false;
            }
            return true;
        });
    }

    private hideError(errorId: string): void {
        this.errorHandler.hideError(errorId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MainApplication();
});