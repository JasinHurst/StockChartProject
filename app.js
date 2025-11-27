import Chart from "./Chart/Chart.js";
import Timeframe from "./Chart/Timeframe.js";

const canvas = document.getElementById("chartCanvas");
const tickerInput = document.getElementById("tickerInput");
const loadTickerBtn = document.getElementById("loadTicker");
const tfButtons = document.querySelectorAll(".timeframes button");

const chart = new Chart(canvas);
const timeframe = new Timeframe();

let fullData = [];
let currentTF = "1d";

const backendTFMap = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "1d": "1d",
    "1w": "1w",
    "1mo": "1mo",
    "5D": "1d",
    "1M": "1d",
    "6M": "1d",
    "1Y": "1w",
    "5Y": "1mo",
    "ALL": "1mo"
};

async function loadFromNode(ticker, tf) {
    const backendTF = backendTFMap[tf] || "1d";
    const url = `http://localhost:3000/api/stock?ticker=${ticker}&interval=${backendTF}`;
    console.log("FETCH:", url);

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (!Array.isArray(json)) {
            console.warn("BACKEND ERROR:", json);
            alert(json.error || "Failed to load stock data.");
            return [];
        }

        return json.map(r => ({
            time: new Date(r.time),
            open: r.open,
            high: r.high,
            low: r.low,
            close: r.close,
            volume: r.volume
        }));
    } catch (err) {
        console.error("FRONTEND FETCH ERROR:", err);
        alert("Cannot reach backend. Is server running?");
        return [];
    }
}

function updateChart() {
    if (!fullData.length) {
        chart.setData([], [], currentTF);
        return;
    }

    const filtered = timeframe.apply(fullData, currentTF);
    chart.setData(fullData, filtered, currentTF);
}

loadTickerBtn.addEventListener("click", async () => {
    const symbol = tickerInput.value.trim().toUpperCase();
    if (!symbol) return;

    fullData = await loadFromNode(symbol, currentTF);
    tfButtons.forEach(b => b.classList.remove("active"));
    updateChart();
});

tickerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadTickerBtn.click();
});

tfButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const symbol = tickerInput.value.trim().toUpperCase();
        if (!symbol) return;

        tfButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentTF = btn.dataset.tf;

        fullData = await loadFromNode(symbol, currentTF);
        updateChart();
    });
});

updateChart();
