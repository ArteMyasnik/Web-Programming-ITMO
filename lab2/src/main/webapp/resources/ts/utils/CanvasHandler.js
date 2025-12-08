class CanvasHandler {
    constructor(errorHandler) {
        this.canvas = null;
        this.ctx = null;
        this.points = [];
        this.currentR = null;
        this.CANVAS_WIDTH = 200 * 2;
        this.CANVAS_HEIGHT = 300 * 2;
        this.CENTER_X = 100 * 2;
        this.CENTER_Y = 150 * 2;
        this.GRAPH_SIZE = 160 * 2;
        this.MAX_R = 3;
        this.initializeCanvas(errorHandler);
    }
    initializeCanvas(errorHandler) {
        this.canvas = document.getElementById('area-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupEventListeners(errorHandler);
        }
    }
    setupEventListeners(errorHandler) {
        var _a;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => this.handleCanvasClick(event, errorHandler));
    }
    setCurrentR(r) {
        this.currentR = r;
        this.redrawPoints();
    }
    getPointColor(point) {
        if (!this.currentR || point.r !== this.currentR) {
            return '#808080';
        }
        return point.hit ? '#00ff00' : '#ff0000';
    }
    handleCanvasClick(event, errorHandler) {
        if (!this.canvas || !this.currentR) {
            if (!this.currentR) {
                errorHandler.showError("error-r", "Please select radius R first!");
            }
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        console.log("handle canvas click", clickX, clickY);
        const graphX = (clickX - this.CENTER_X) / scale;
        const graphY = (this.CENTER_Y - clickY) / scale;
        console.log("handle canvas graph", graphX, graphY);
        this.submitPointToServer(graphX, graphY, this.currentR);
    }
    submitPointToServer(x, y, r) {
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'post';
        hiddenForm.action = 'controller';
        hiddenForm.style.display = 'none';
        const hiddenX = document.createElement('input');
        hiddenX.type = 'hidden';
        hiddenX.name = 'x';
        hiddenX.value = parseFloat(x.toFixed(2)).toString();
        hiddenForm.appendChild(hiddenX);
        const hiddenY = document.createElement('input');
        hiddenY.type = 'hidden';
        hiddenY.name = 'y';
        hiddenY.value = parseFloat(y.toFixed(2)).toString();
        hiddenForm.appendChild(hiddenY);
        const hiddenR = document.createElement('input');
        hiddenR.type = 'hidden';
        hiddenR.name = 'radius';
        hiddenR.value = r.toString();
        hiddenForm.appendChild(hiddenR);
        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
    }
    drawPoint(point) {
        if (!this.ctx || !this.currentR)
            return;
        const scale = this.GRAPH_SIZE / (this.MAX_R * 2);
        const canvasX = this.CENTER_X + point.x * scale * point.r / this.currentR;
        const canvasY = this.CENTER_Y - point.y * scale * point.r / this.currentR;
        // const normalizedX = point.x / point.r;
        // const normalizedY = point.y / point.r;
        // const effectiveX = normalizedX * this.currentR;
        // const effectiveY = normalizedY * this.currentR;
        // const canvasX = this.CENTER_X + effectiveX * scale;
        // const canvasY = this.CENTER_Y - effectiveY * scale;
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.getPointColor(point);
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    /* public clearPoints(): void {
        this.points = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        }
    } */
    redrawPoints() {
        if (!this.ctx)
            return;
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.points.forEach(point => {
            this.drawPoint(point);
        });
    }
    addResultPoint(x, y, r, hit) {
        const pointToAdd = { x, y, r, hit };
        this.points.push(pointToAdd);
        if (this.currentR) {
            this.drawPoint(pointToAdd);
        }
    }
}
export { CanvasHandler };
//# sourceMappingURL=CanvasHandler.js.map