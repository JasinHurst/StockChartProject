export default class Grid {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(width, height) {
        this.ctx.strokeStyle = "#333";
        this.ctx.lineWidth = 1;

        const spacing = 50;

        for (let x = 0; x < width; x += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        for (let y = 0; y < height; y += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }
}
