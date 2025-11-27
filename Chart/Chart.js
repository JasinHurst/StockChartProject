import CandleSeries from "./CandleSeries.js";
import PriceScale from "./PriceScale.js";
import DateScale from "./DateScale.js";
import Grid from "./Grid.js";

export default class Chart {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.data = [];        
        this.fullData = [];    
        this.timeframe = "ALL";

        
        this.candles = new CandleSeries(this.ctx);
        this.priceScale = new PriceScale(this.ctx);
        this.dateScale = new DateScale(this.ctx);
        this.grid = new Grid(this.ctx);

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.canvas.style.width = rect.width + "px";
        this.canvas.style.height = rect.height + "px";

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.draw();
    }

    setData(fullData, filteredData, timeframe) {
        this.fullData = fullData || [];
        this.data = filteredData || [];
        this.timeframe = timeframe;
        this.draw();
    }

    draw() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);

        this.grid.draw(rect.width, rect.height);
        const { min, max } = this.candles.draw(rect.width, rect.height, this.data);
        this.priceScale.draw(rect.width, rect.height, min, max);
        this.dateScale.draw(rect.width, rect.height, this.data, this.timeframe);

    }
}
