// Consts and interfaces

interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

interface Coordinates {
    x: number;
    y: number;
    r: number;
}

interface FormValues {
    x: string;
    y: string;
    r: number | null;
}

const VALIDATION_RULES = {
    X: { min: -3, max: 5 },
    Y: { min: -3, max: 3 },
    R: { values: [1, 1.5, 2, 2.5, 3] as number[] }
} as const;

const ERROR_DISPLAY_TIME = 5000;


// Functions for form
function getElement<T extends HTMLElement>(elementId: string): T | null {
    const element = document.getElementById(elementId);
    return element as T | null;
}

function hideError(errorId: string): void {
    const errorElement = getElement<HTMLSpanElement>(errorId);
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function showError(errorId: string, message: string): void {
    const errorElement = getElement<HTMLSpanElement>(errorId);
    if (!errorElement) {
        console.warn(`Элемент с ID '${errorId}' не найден на странице`);
        return;
    }

    errorElement.textContent = message;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "small";

    setTimeout(() => {
        hideError(errorId);
    }, ERROR_DISPLAY_TIME);
}

function getSelectedRadius(): number | null {
    const selectedRadio = document.querySelector<HTMLInputElement>('input[name=radius]:checked') as HTMLInputElement | null;
    if (!selectedRadio?.value) {
        return null;
    }
    const radiusValue = parseFloat(selectedRadio.value);
    const isValidRadius = VALIDATION_RULES.R.values.indexOf(radiusValue) !== -1;

    return isValidRadius ? radiusValue : null;
}

function getFormValues(): FormValues {
    const xInput = getElement<HTMLInputElement>('coordinate-x');
    const yInput = getElement<HTMLInputElement>('coordinate-y');

    return {
        x: xInput?.value.trim() || '',
        y: yInput?.value.trim() || '',
        r: getSelectedRadius()
    };
}

// Functions for validation
function validateX(xValue: string): ValidationResult {
    if (!xValue.trim()) {
        return {
            isValid: false,
            errorMessage: "Please, select X coordinate"
        }
    }
    const xNumber = parseFloat(xValue);
    if (isNaN(xNumber)) {
        return {
            isValid: false,
            errorMessage: "X coordinate must be number"
        }
    }
    if (!Number.isInteger(xNumber)) {
        return {
            isValid: false,
            errorMessage: "X coordinate must be integer"
        }
    }
    if (xNumber < VALIDATION_RULES.X.min || xNumber > VALIDATION_RULES.X.max) {
        return {
            isValid: false,
            errorMessage: `X coordinate must be greater than ${VALIDATION_RULES.X.min} and less than ${VALIDATION_RULES.X.max}`
        }
    }
    return {
        isValid: true
    }
}

function validateY(yValue: string): ValidationResult {
    if (!yValue.trim()) {
        return {
            isValid: false,
            errorMessage: "Please, enter the Y coordinate"
        }
    }
    const yNumber = parseFloat(yValue);
    if (isNaN(yNumber)) {
        return {
            isValid: false,
            errorMessage: "Y coordinate must be number"
        }
    }
    if (!Number.isInteger(yNumber)) {
        return {
            isValid: false,
            errorMessage: "Y coordinate must be integer"
        }
    }
    if (yNumber < VALIDATION_RULES.Y.min || yNumber > VALIDATION_RULES.Y.max) {
        return {
            isValid: false,
            errorMessage: `Y coordinate must be greater than ${VALIDATION_RULES.Y.min} and less than ${VALIDATION_RULES.Y.max}`
        }
    }
    return {
        isValid: true
    }
}

function validateR(radiusValue: number | null): ValidationResult {
    if (radiusValue === null) {
        return {
            isValid: false,
            errorMessage: "Please, select Radius"
        }
    }
    if (VALIDATION_RULES.R.values.indexOf(radiusValue) === -1) {
        return {
            isValid: false,
            errorMessage: "Select the correct Radius"
        }
    }
    return {
        isValid: true
    }
}

function validateAllFields(x: string, y: string, r: number | null): boolean {
    const xValidation = validateX(x);
    const yValidation = validateY(y);
    const rValidation = validateR(r);
    const validations = [
        {result: xValidation, errorId: "error-x"},
        {result: yValidation, errorId: "error-y"},
        {result: rValidation, errorId: "error-r"}
    ];

    let isValidAllFields = true;
    for (const validation of validations) {
        if (!validation.result.isValid) {
            showError(validation.errorId, validation.result.errorMessage!);
            isValidAllFields = false;
            if (validation.errorId === "error-y") {
                getElement<HTMLInputElement>("coordinate-y")?.focus();
            }
        }
    }
    return isValidAllFields;
}

// Functions for handling events
function handleFormSubmit(event: Event) {
    event.preventDefault();
    const {x, y, r} = getFormValues();
    if (validateAllFields(x, y, r)) {
        const form = getElement<HTMLFormElement>('coordinates-form');
        form?.submit();
    }
}

function handleYInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.-]/g, '');
    hideError('error-y');
}

function initApp(): void {
    const form = getElement<HTMLFormElement>('coordinates-form');
    const xInput = getElement<HTMLInputElement>('coordinate-x');
    const yInput = getElement<HTMLInputElement>('coordinate-y');
    const radioButtons = document.querySelectorAll('input[name="radius"]');

    if (!form || !xInput || !yInput) return;

    form.addEventListener('submit', handleFormSubmit);
    xInput.addEventListener('change', () => hideError('error-x'));

    yInput.addEventListener('input', handleYInput);
    yInput.addEventListener('input', () => hideError('error-y'));

    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => hideError('error-r'))
    })
}

document.addEventListener("DOMContentLoaded", initApp);