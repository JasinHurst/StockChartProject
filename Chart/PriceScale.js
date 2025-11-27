export default class PriceScale {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(width, height, min, max) {
        if (!isFinite(min) || !isFinite(max) || min === max) return;

        this.ctx.fillStyle = "#fbf2f2";
        this.ctx.font = "12px Arial";

        const steps = 5;
        for (let i = 0; i <= steps; i++) {
            const price = min + (i * (max - min) / steps);
            const y = height - (i * (height / steps));
            this.ctx.fillText(price.toFixed(2), width - 60, y);
        }
    }
}
