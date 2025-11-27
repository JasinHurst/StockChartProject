export default class DateScale {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(width, height, data, timeframe) {
        if (!data || data.length === 0) return;

        const first = data[0].time.getTime();
        const last = data[data.length - 1].time.getTime();
        const range = last - first;
        if (range <= 0) return;

        let spacing;

        if (["1m", "5m", "15m"].includes(timeframe)) spacing = 80;
        else if (["1h"].includes(timeframe)) spacing = 100;
        else if (["1d"].includes(timeframe)) spacing = 120;
        else if (["1w"].includes(timeframe)) spacing = 150;
        else spacing = 200;

        this.ctx.fillStyle = "#fbf2f2";
        this.ctx.font = "12px Arial";

        let lastX = -Infinity;

        for (let i = 0; i < data.length; i++) {
            const t = data[i].time.getTime();
            const x = ((t - first) / range) * width;

            if (x - lastX < spacing) continue;
            lastX = x;

            const d = data[i].time;
            let label;

            if (["1m", "5m", "15m"].includes(timeframe)) {
                label = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } else if (timeframe === "1h") {
                label = d.getHours().toString().padStart(2, "0") + ":00";
            } else if (timeframe === "1d") {
                label = (d.getMonth() + 1) + "/" + d.getDate();
            } else if (timeframe === "1w") {
                const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
                label = (d.getMonth() + 1) + "/W" + week;
            } else if (["1mo", "6M", "1Y"].includes(timeframe)) {
                label = d.toLocaleDateString([], { month: "short", year: "numeric" });
            } else if (["5Y", "ALL"].includes(timeframe)) {
                label = d.getFullYear();
            } else {
                label = (d.getMonth() + 1) + "/" + d.getDate();
            }

            this.ctx.fillText(label, x + 2, height - 5);
        }
    }
}
