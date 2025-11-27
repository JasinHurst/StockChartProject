export default class DateScale {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(width, height, data) {
        if (!data || data.length === 0) return;

        const spacing = 150;
        const candleWidth = width / data.length;

        this.ctx.fillStyle = "#fbf2f2";
        this.ctx.font = "12px Arial";

        for (let x = 0; x < width; x += spacing) {
            const index = Math.floor(x / candleWidth);
            if (index >= data.length) break;

            const d = data[index].time;
            const label = `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;

            this.ctx.fillText(label, x + 5, height - 5);
        }
    }
}
