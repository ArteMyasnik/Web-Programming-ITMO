class CanvasHandler {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.points = [];
        this.currentR = null;
        this.CANVAS_WIDTH = 200;
        this.CANVAS_HEIGHT = 300;
        this.CENTER_X = 100;
        this.CENTER_Y = 150;
        this.GRAPH_SIZE = 160;
        this.MAX_R = 3;
        this.initializeCanvas();
    }
    initializeCanvas() {
        this.canvas = document.getElementById('area-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupEventListeners();
        }
    }
    setupEventListeners() {
        var _a;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => this.handleCanvasClick(event));
    }
    setCurrentR(r) {
        this.currentR = r;
        this.redrawPoints();
    }
    handleCanvasClick(event) {
        if (!this.canvas || !this.currentR) {
            if (!this.currentR) {
                alert('Please select radius R first!');
            }
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const graphX = (clickX - this.CENTER_X) / scale;
        const graphY = (this.CENTER_Y - clickY) / scale;
        const roundedX = Math.round(graphX * 100) / 100;
        const roundedY = Math.round(graphY * 100) / 100;
        // Отправляем данные через существующую форму
        this.submitPointToServer(roundedX, roundedY, this.currentR);
    }
    submitPointToServer(x, y, r) {
        // Находим существующую форму
        const form = document.getElementById('coordinates-form');
        if (!form)
            return;
        // Устанавливаем значения в форму
        const xInput = document.getElementById('coordinate-x');
        const yInput = document.getElementById('coordinate-y');
        if (xInput && yInput) {
            // Находим ближайшее доступное значение X
            const availableX = Array.from(xInput.options)
                .map(opt => parseFloat(opt.value))
                .filter(val => !isNaN(val));
            const closestX = availableX.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
            xInput.value = closestX.toString();
            yInput.value = y.toString();
            // Устанавливаем радиус
            const rRadio = document.querySelector(`input[name="radius"][value="${r}"]`);
            if (rRadio) {
                rRadio.checked = true;
            }
            // Отправляем форму
            form.submit();
        }
    }
    drawPoint(x, y, hit) {
        if (!this.ctx || !this.currentR)
            return;
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const canvasX = this.CENTER_X + x * scale;
        const canvasY = this.CENTER_Y - y * scale;
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = hit ? '#00ff00' : '#ff0000';
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    redrawPoints() {
        if (!this.ctx)
            return;
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.points.forEach(point => {
            if (this.currentR) {
                this.drawPoint(point.x, point.y, point.hit || false);
            }
        });
    }
    clearPoints() {
        this.points = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        }
    }
    addResultPoint(x, y, hit) {
        this.points.push({ x, y, hit });
        if (this.currentR) {
            this.drawPoint(x, y, hit);
        }
    }
}
export { CanvasHandler };
//# sourceMappingURL=CanvasHandler.js.map