import {ErrorHandler} from "./ErrorHandler";

type CanvasPoint = {
    x: number;
    y: number;
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

    private getRandomColor(): string {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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

        const graphX = (clickX - this.CENTER_X) / scale;
        const graphY = (this.CENTER_Y - clickY) / scale;

        console.log("handle canvas click", graphX, graphY);

        this.submitPointToServer(graphX, graphY, this.currentR);
    }

    private submitPointToServer(x: number, y: number, r: number): void {
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

    private drawPoint(x: number, y: number, hit: boolean): void {
        if (!this.ctx || !this.currentR) return;

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

    public clearPoints(): void {
        this.points = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        }
    }

    private redrawPoints(): void {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.points.forEach(point => {
            if (this.currentR) {
                this.drawPoint(point.x, point.y, point.hit || false);
            }
        });
    }

    public addResultPoint(x: number, y: number, hit: boolean): void {
        const pointToAdd = { x, y, hit };

        console.log("pointToAdd", pointToAdd);

        this.points.push(pointToAdd);
        if (this.currentR) {
            this.drawPoint(pointToAdd.x, pointToAdd.y, hit);
        }
        console.log("points", this.points)
    }
}

export { CanvasHandler };