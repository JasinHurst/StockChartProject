export default class Timeframe {
    constructor() {
        this.mapDays = {
            "5D": 5,
            "1M": 30,
            "6M": 182,
            "1Y": 365,
            "5Y": 365 * 5,
            "ALL": Infinity
        };
    }

    apply(fullData, timeframe) {
        if (!fullData || fullData.length === 0) return [];

        if (!(timeframe in this.mapDays)) {
            return fullData.slice();
        }

        if (timeframe === "ALL") {
            return fullData.slice();
        }

        const days = this.mapDays[timeframe];
        const latestTime = fullData[fullData.length - 1].time;
        const msPerDay = 1000 * 60 * 60 * 24;

        return fullData.filter(candle => {
            const diffDays = (latestTime - candle.time) / msPerDay;
            return diffDays <= days;
        });
    }
}
