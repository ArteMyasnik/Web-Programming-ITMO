type ValidationResult = {
    isValid: boolean;
    errorMessage?: string;
}

type FieldValidator = {
    result: ValidationResult;
    errorId: string;
}

class Validator {
    private validateX(xValue: string): ValidationResult {
        if (!xValue.trim()) {
            return {
                isValid: false,
                errorMessage: "Please, select X coordinate"
            }
        }
        return {
            isValid: true
        }
    }

    private validateY(yValue: string): ValidationResult {
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
        if (yNumber < -3 || yNumber > 3) {
            return {
                isValid: false,
                errorMessage: "Y coordinate must be greater than -3 and less than 3"
            }
        }
        return {
            isValid: true
        }
    }

    private validateR(radiusValue: number | null): ValidationResult {
        if (radiusValue === null) {
            return {
                isValid: false,
                errorMessage: "Please, select Radius"
            }
        }
        return {
            isValid: true
        }
    }

    public validateAllFields(x: string, y: string, r: number | null): FieldValidator[] {
        const xValidation = this.validateX(x);
        const yValidation = this.validateY(y);
        const rValidation = this.validateR(r);

        return [
            {result: xValidation, errorId: "error-x"},
            {result: yValidation, errorId: "error-y"},
            {result: rValidation, errorId: "error-r"}
        ];
    }
}

export { Validator, type FieldValidator };