const canvas = document.getElementById("chartCanvas");
const symbolField = document.getElementById("symbolField");

const timeframeButtons = document.querySelectorAll(".timeframes button");
const toolIndicators = document.querySelectorAll(".tools button");

const indicatorCheckboxes = document.querySelectorAll(".indicators input[type='checkbox']");

const ctx = canvas.getContext("2d");

const chartState = {
    symbol: "AAPL",
    timeframe: "1D",
    data: [],
    indicators: {
        sma: false,
        ema: false,
        rsi: false,
        macd: false
    },
    activeTool: null,
    drawings: []
};

function resizeCanvas() {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

window.addEventListener("resize", () => {
    resizeCanvas();
    drawChart();
});

resizeCanvas();

function drawChart() {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    drawGrid(rect.width, rect.height);
}

function drawGrid(width, height) {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    const spacing = 50;

    for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

drawChart();

document.getElementById("loadBtn").addEventListener("click", () => {
    const value = symbolField.value.trim().toUpperCase();
    if (value) {
        chartState.symbol = value;
        fetchData();
    }
});

timeframeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        chartState.timeframe = btn.dataset.tf;

        timeframeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        fetchData();
    });
});

toolIndicators.forEach(btn => {
    btn.addEventListener("click", () => {
        chartState.activeTool = btn.dataset.tool;

        toolIndicators.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

indicatorCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const ind = checkbox.dataset.ind;
        chartState.indicators[ind] = checkbox.checked;
    });
});

const timeframeMap = {
    "1D": "1d",
    "5D": "5d",
    "1M": "1mo",
    "6M": "6mo",
    "1Y": "1y",
    "5Y": "5y"
};

async function fetchData() {
    try {
        const symbol = chartState.symbol;
        const range = timeframeMap[chartState.timeframe];
        const interval = "1d";

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

        const response = await fetch(url);
        const json = await response.json();

        if (!json.chart || !json.chart.result) {
            console.error("Bad API response", json);
            return;
        }

        const result = json.chart.result[0];
        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];

        const open = quote.open;
        const high = quote.high;
        const low = quote.low;
        const close = quote.close;
        const volume = quote.volume;

        chartState.data = [];

        for (let i = 0; i < timestamps.length; i++) {
            chartState.data.push({
                time: new Date(timestamps[i] * 1000),
                open: open[i],
                high: high[i],
                low: low[i],
                close: close[i],
                volume: volume[i]
            });
        }

        console.log("Candles loaded:", chartState.data);

        drawChart();

    } catch (err) {
        console.error("Fetch error:", err);
    }
}
