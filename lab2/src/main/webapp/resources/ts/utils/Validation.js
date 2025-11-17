class Validator {
    validateX(xValue) {
        if (!xValue.trim()) {
            return {
                isValid: false,
                errorMessage: "Please, select X coordinate"
            };
        }
        return {
            isValid: true
        };
    }
    validateY(yValue) {
        if (!yValue.trim()) {
            return {
                isValid: false,
                errorMessage: "Please, enter the Y coordinate"
            };
        }
        const yNumber = parseFloat(yValue);
        if (isNaN(yNumber)) {
            return {
                isValid: false,
                errorMessage: "Y coordinate must be number"
            };
        }
        if (yNumber < -3 || yNumber > 3) {
            return {
                isValid: false,
                errorMessage: "Y coordinate must be greater than -3 and less than 3"
            };
        }
        return {
            isValid: true
        };
    }
    validateR(radiusValue) {
        if (radiusValue === null) {
            return {
                isValid: false,
                errorMessage: "Please, select Radius"
            };
        }
        return {
            isValid: true
        };
    }
    validateAllFields(x, y, r) {
        const xValidation = this.validateX(x);
        const yValidation = this.validateY(y);
        const rValidation = this.validateR(r);
        return [
            { result: xValidation, errorId: "error-x" },
            { result: yValidation, errorId: "error-y" },
            { result: rValidation, errorId: "error-r" }
        ];
    }
}
export { Validator };
//# sourceMappingURL=Validation.js.map