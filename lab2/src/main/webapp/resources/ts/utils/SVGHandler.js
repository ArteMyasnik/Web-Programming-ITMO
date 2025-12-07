class SVGHandler {
    constructor() {
        this.currentR = 1;
        this.scale = 53;
        this.centerX = 200;
        this.centerY = 300;
        this.initializeSVG();
    }
    initializeSVG() {
        const selectedRadio = document.querySelector('input[name="radius"]:checked');
        if (selectedRadio) {
            this.updateSVGWithR(parseFloat(selectedRadio.value));
        }
        const radiusInputs = document.querySelectorAll('input[name="radius"]');
        radiusInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const target = event.target;
                if (target.checked) {
                    this.updateSVGWithR(parseFloat(target.value));
                }
            });
        });
    }
    updateSVGWithR(R) {
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
    setCurrentR(R) {
        this.updateSVGWithR(R);
    }
}
export { SVGHandler };
//# sourceMappingURL=SVGHandler.js.map