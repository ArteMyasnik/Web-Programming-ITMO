class DOMHandler {
    constructor() {
        this.xInput = null;
        this.yInput = null;
        this.canvas = null;
        this.form = null;
        this.initializeElements();
    }
    initializeElements() {
        this.xInput = document.getElementById('coordinate-x');
        this.yInput = document.getElementById('coordinate-y');
        this.canvas = document.getElementById('area-canvas');
        this.form = document.getElementById('coordinates-form');
    }
    getFormValues() {
        var _a, _b;
        return {
            x: ((_a = this.xInput) === null || _a === void 0 ? void 0 : _a.value.trim()) || '',
            y: ((_b = this.yInput) === null || _b === void 0 ? void 0 : _b.value.trim()) || '',
            r: this.getSelectedRadius()
        };
    }
    getForm() {
        return this.form;
    }
    getSelectedRadius() {
        const selectedRadio = document.querySelector('input[name="radius"]:checked');
        return selectedRadio ? parseFloat(selectedRadio.value) : null;
    }
    addFormSubmitListener(handler) {
        var _a;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', handler);
    }
    addYInputListener(handler) {
        var _a;
        (_a = this.yInput) === null || _a === void 0 ? void 0 : _a.addEventListener('input', handler);
    }
    addXChangeListener(handler) {
        var _a;
        (_a = this.xInput) === null || _a === void 0 ? void 0 : _a.addEventListener('change', handler);
    }
    addRadiusChangeListener(handler) {
        const radioButtons = document.querySelectorAll('input[name="radius"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', handler);
        });
    }
    getXInput() {
        return this.xInput;
    }
    getYInput() {
        return this.yInput;
    }
    setRadiusValue(value) {
        const radio = document.querySelector(`input[name="radius"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
}
export { DOMHandler };
//# sourceMappingURL=DOMHandler.js.map