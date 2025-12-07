class SVGHandler {
    private currentR: number = 1;
    private readonly scale: number = 53;
    private readonly centerX: number = 200;
    private readonly centerY: number = 300;

    constructor() {
        this.initializeSVG();
    }

    private initializeSVG(): void {
        const selectedRadio = document.querySelector<HTMLInputElement>('input[name="radius"]:checked');
        if (selectedRadio) {
            this.updateSVGWithR(parseFloat(selectedRadio.value));
        }

        const radiusInputs = document.querySelectorAll('input[name="radius"]');
        radiusInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.updateSVGWithR(parseFloat(target.value));
                }
            });
        });
    }

    public updateSVGWithR(R: number): void {
        this.currentR = R;

        const R_HALF = (R / 2) * this.scale;
        const R_FULL = R * this.scale;

        const rectangle = document.getElementById('rectangle');
        if (rectangle) {
            rectangle.setAttribute('x', (this.centerX - R_HALF).toString());
            rectangle.setAttribute('y', (this.centerY - R_FULL).toString());
            rectangle.setAttribute('width', R_HALF.toString());
            rectangle.setAttribute('height', R_FULL.toString());
        }

        const quarterCircle = document.getElementById('quarter-circle');
        if (quarterCircle) {
            const quarterCirclePath = `M${this.centerX},${this.centerY} 
                L${this.centerX},${this.centerY - R_FULL} 
                A${R_FULL},${R_FULL} 0 0,1 ${this.centerX + R_FULL},${this.centerY} 
                L${this.centerX},${this.centerY} Z`;
            quarterCircle.setAttribute('d', quarterCirclePath);
        }

        const triangle = document.getElementById('triangle');
        if (triangle) {
            const trianglePoints = `${this.centerX},${this.centerY} 
                ${this.centerX + R_HALF},${this.centerY} 
                ${this.centerX},${this.centerY + R_HALF}`;
            triangle.setAttribute('points', trianglePoints);
        }
    }

    public setCurrentR(R: number): void {
        this.updateSVGWithR(R);
    }
}

export { SVGHandler };