import {ErrorHandler} from "./ErrorHandler";

type CanvasPoint = {
    x: number;
    y: number;
    r: number;
    hit?: boolean;
}

class CanvasHandler {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private points: CanvasPoint[] = [];
    private currentR: number | null = null;

    private readonly CANVAS_WIDTH = 200 * 2;
    private readonly CANVAS_HEIGHT = 300 * 2;
    private readonly CENTER_X = 100 * 2;
    private readonly CENTER_Y = 150 * 2;
    private readonly GRAPH_SIZE = 160 * 2;
    private readonly MAX_R = 3;

    constructor(errorHandler: ErrorHandler) {
        this.initializeCanvas(errorHandler);
    }

    private initializeCanvas(errorHandler: ErrorHandler): void {
        this.canvas = document.getElementById('area-canvas') as HTMLCanvasElement;
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupEventListeners(errorHandler);
        }
    }

    private setupEventListeners(errorHandler: ErrorHandler): void {
        this.canvas?.addEventListener('click', (event) => this.handleCanvasClick(event, errorHandler));
    }

    public setCurrentR(r: number | null): void {
        this.currentR = r;
        this.redrawPoints();
    }

    private getPointColor(point: CanvasPoint): string {
        /* if (!this.currentR || point.r !== this.currentR) {
            return '#808080';
        } */
        return point.hit ? '#00ff00' : '#ff0000';
    }

    private handleCanvasClick(event: MouseEvent, errorHandler: ErrorHandler): void {
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

    private submitPointToServer(x: number, y: number, r: number): void {
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

    private drawPoint(point: CanvasPoint): void {
        if (!this.ctx || !this.currentR) return;

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

    private redrawPoints(): void {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.points.forEach(point => {
            this.drawPoint(point);
        });
    }

    public addResultPoint(x: number, y: number, r:number, hit: boolean): void {
        const pointToAdd: CanvasPoint = { x, y, r, hit };

        this.points.push(pointToAdd);
        if (this.currentR) {
            this.drawPoint(pointToAdd);
        }
    }
}

export { CanvasHandler };