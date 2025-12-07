class DOMHandler {
    private xInput: HTMLSelectElement | null = null;
    private yInput: HTMLInputElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private form: HTMLFormElement | null = null;

    constructor() {
        this.initializeElements();
    }

    private initializeElements(): void {
        this.xInput = document.getElementById('coordinate-x') as HTMLSelectElement;
        this.yInput = document.getElementById('coordinate-y') as HTMLInputElement;
        this.canvas = document.getElementById('area-canvas') as HTMLCanvasElement;
        this.form = document.getElementById('coordinates-form') as HTMLFormElement;
    }

    public getFormValues(): { x: string; y: string; r: number | null } {
        return {
            x: this.xInput?.value.trim() || '',
            y: this.yInput?.value.trim() || '',
            r: this.getSelectedRadius()
        };
    }

    public getForm(): HTMLFormElement | null {
        return this.form;
    }

    public getSelectedRadius(): number | null {
        const selectedRadio = document.querySelector<HTMLInputElement>('input[name="radius"]:checked');
        return selectedRadio ? parseFloat(selectedRadio.value) : null;
    }

    public addFormSubmitListener(handler: EventListener): void {
        this.form?.addEventListener('submit', handler);
    }

    public addYInputListener(handler: EventListener): void {
        this.yInput?.addEventListener('input', handler);
    }

    public addXChangeListener(handler: EventListener): void {
        this.xInput?.addEventListener('change', handler);
    }

    public addRadiusChangeListener(handler: EventListener): void {
        const radioButtons = document.querySelectorAll('input[name="radius"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', handler);
        });
    }

    public getXInput(): HTMLSelectElement | null {
        return this.xInput;
    }

    public getYInput(): HTMLInputElement | null {
        return this.yInput;
    }

    public setRadiusValue(value: number): void {
        const radio = document.querySelector(`input[name="radius"][value="${value}"]`) as HTMLInputElement;
        if (radio) {
            radio.checked = true;
        }
    }
}

export { DOMHandler };