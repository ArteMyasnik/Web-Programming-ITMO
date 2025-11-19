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

    private readonly CANVAS_WIDTH = 200;
    private readonly CANVAS_HEIGHT = 300;
    private readonly CENTER_X = 100;
    private readonly CENTER_Y = 150;
    private readonly GRAPH_SIZE = 160;
    private readonly MAX_R = 3;

    constructor() {
        this.initializeCanvas();
    }

    private initializeCanvas(): void {
        this.canvas = document.getElementById('area-canvas') as HTMLCanvasElement;
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupEventListeners();
        }
    }

    private setupEventListeners(): void {
        this.canvas?.addEventListener('click', (event) => this.handleCanvasClick(event));
    }

    public setCurrentR(r: number | null): void {
        this.currentR = r;
        this.redrawPoints();
    }

    private handleCanvasClick(event: MouseEvent): void {
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

        // Конвертация в графические координаты
        const graphX = (clickX - this.CENTER_X) / scale;
        const graphY = (this.CENTER_Y - clickY) / scale;

        // Сохраняем точку куда нажал (для отображения после ответа сервера)
        this.lastClickedPoint = { x: graphX, y: graphY };

        // Отправляем данные через существующую форму
        this.submitPointToServer(graphX, graphY, this.currentR);
    }

    private submitPointToServer(x: number, y: number, r: number): void {
        // Находим существующую форму
        const form = document.getElementById('coordinates-form') as HTMLFormElement;
        if (!form) return;

        // Устанавливаем значения в форму
        const xInput = document.getElementById('coordinate-x') as HTMLSelectElement;
        const yInput = document.getElementById('coordinate-y') as HTMLInputElement;

        if (xInput && yInput) {
            // Находим ближайшее доступное значение X
            const availableX = Array.from(xInput.options)
                .map(opt => parseFloat(opt.value))
                .filter(val => !isNaN(val));

            const closestX = availableX.reduce((prev, curr) =>
                Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
            );

            xInput.value = closestX.toString();
            yInput.value = y.toString();

            // Устанавливаем радиус
            const rRadio = document.querySelector(`input[name="radius"][value="${r}"]`) as HTMLInputElement;
            if (rRadio) {
                rRadio.checked = true;
            }

            // Отправляем форму
            form.submit();
        }
    }

    private drawPoint(x: number, y: number, hit: boolean): void {
        if (!this.ctx || !this.currentR) return;

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

    private redrawPoints(): void {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.points.forEach(point => {
            if (this.currentR) {
                this.drawPoint(point.x, point.y, point.hit || false);
            }
        });
    }

    public clearPoints(): void {
        this.points = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        }
    }

    // ФИКС: Добавляем точку с координатами куда нажал, а не из формы
    public addResultPoint(x: number, y: number, hit: boolean): void {
        // Используем последние координаты клика или переданные координаты
        const pointToAdd = this.lastClickedPoint ? 
            { ...this.lastClickedPoint, hit } : 
            { x, y, hit };
            
        this.points.push(pointToAdd);
        if (this.currentR) {
            this.drawPoint(pointToAdd.x, pointToAdd.y, hit);
        }
        
        // Сбрасываем последнюю точку клика
        this.lastClickedPoint = null;
    }

    private lastClickedPoint: { x: number; y: number } | null = null;
}

export { CanvasHandler };
