export default class CandleSeries {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(width, height, data) {
        if (!data || data.length === 0) return { min: 0, max: 0 };

        let min = Infinity;
        let max = -Infinity;

        for (let c of data) {
            if (c.low < min) min = c.low;
            if (c.high > max) max = c.high;
        }

        const padding = (max - min) * 0.1;
        min -= padding;
        max += padding;

        const priceToY = price => {
            return height - ((price - min) / (max - min)) * height;
        };

        const count = data.length;
        const candleWidth = width / count;

        this.ctx.lineWidth = 1;

        data.forEach((c, i) => {
            const x = i * candleWidth;
            const xCenter = x + candleWidth / 2;

            const highY = priceToY(c.high);
            const lowY = priceToY(c.low);
            const openY = priceToY(c.open);
            const closeY = priceToY(c.close);

            const isUp = c.close >= c.open;
            this.ctx.strokeStyle = isUp ? "#0f0" : "#f00";
            this.ctx.fillStyle = isUp ? "#0f0" : "#f00";

            this.ctx.beginPath();
            this.ctx.moveTo(xCenter, highY);
            this.ctx.lineTo(xCenter, lowY);
            this.ctx.stroke();

            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);
            const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

            this.ctx.fillRect(
                x + candleWidth * 0.1,
                bodyTop,
                candleWidth * 0.8,
                bodyHeight
            );
        });

        return { min, max };
    }
}
