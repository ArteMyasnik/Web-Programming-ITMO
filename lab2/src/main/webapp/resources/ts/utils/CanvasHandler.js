import { ErrorHandler } from "./ErrorHandler";
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
        this.errorHandler = new ErrorHandler();
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
    getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    handleCanvasClick(event) {
        if (!this.canvas || !this.currentR) {
            if (!this.currentR) {
                this.errorHandler.showError("error-r", "Please select radius R first!");
            }
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const graphX = (clickX - this.CENTER_X) / scale;
        const graphY = (this.CENTER_Y - clickY) / scale;
        console.log("handle canvas click", graphX, graphY);
        this.submitPointToServer(graphX, graphY, this.currentR);
    }
    submitPointToServer(x, y, r) {
        // Создаем скрытую форму для точных координат
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'post';
        hiddenForm.action = 'controller';
        hiddenForm.style.display = 'none';
        // Скрытое поле для точного X
        const hiddenX = document.createElement('input');
        hiddenX.type = 'hidden';
        hiddenX.name = 'x';
        hiddenX.value = parseFloat(x.toFixed(2)).toString();
        hiddenForm.appendChild(hiddenX);
        // Скрытое поле для точного Y
        const hiddenY = document.createElement('input');
        hiddenY.type = 'hidden';
        hiddenY.name = 'y';
        hiddenY.value = parseFloat(y.toFixed(2)).toString();
        hiddenForm.appendChild(hiddenY);
        // Скрытое поле для радиуса
        const hiddenR = document.createElement('input');
        hiddenR.type = 'hidden';
        hiddenR.name = 'radius';
        hiddenR.value = r.toString();
        hiddenForm.appendChild(hiddenR);
        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    }
    drawPoint(x, y, hit) {
        if (!this.ctx || !this.currentR)
            return;
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const canvasX = this.CENTER_X + x * scale;
        const canvasY = this.CENTER_Y - y * scale;
        console.log("draw point", x, y, hit);
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.getRandomColor();
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    clearPoints() {
        this.points = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        }
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
    addResultPoint(x, y, hit) {
        const pointToAdd = { x, y, hit };
        console.log("pointToAdd", pointToAdd);
        this.points.push(pointToAdd);
        if (this.currentR) {
            this.drawPoint(pointToAdd.x, pointToAdd.y, hit);
        }
        console.log("points", this.points);
    }
}
export { CanvasHandler };
//# sourceMappingURL=CanvasHandler.js.map