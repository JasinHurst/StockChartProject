import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const intervalMap = {
    "1m":  { interval: "1m",  range: "1d" },
    "5m":  { interval: "5m",  range: "5d" },
    "15m": { interval: "15m", range: "1mo" },
    "1h":  { interval: "60m", range: "3mo" },
    "1d":  { interval: "1d",  range: "5y" },
    "1w":  { interval: "1wk", range: "10y" },
    "1mo": { interval: "1mo", range: "max" }
};

app.get("/api/stock", async (req, res) => {
    try {
        const ticker = req.query.ticker?.toUpperCase();
        const tfRaw = req.query.interval || "1d";
        const tf = tfRaw.toLowerCase();

        const mapEntry = intervalMap[tf] || intervalMap["1d"];
        const { interval, range } = mapEntry;

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`;
        console.log("YAHOO REQUEST:", url);

        const yahooRes = await fetch(url);
        const text = await yahooRes.text();

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error("YAHOO JSON ERROR:", e);
            return res.status(500).json({ error: "Invalid JSON from Yahoo" });
        }

        const result = json.chart?.result?.[0];
        if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
            console.error("NO RESULT DATA:", json);
            return res.status(400).json({
                error: "Yahoo returned no data for this ticker/timeframe"
            });
        }

        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];

        const candles = timestamps.map((t, i) => ({
            time: new Date(t * 1000),
            open: quotes.open[i],
            high: quotes.high[i],
            low: quotes.low[i],
            close: quotes.close[i],
            volume: quotes.volume[i]
        })).filter(c => c.open != null && c.high != null && c.low != null && c.close != null);

        res.json(candles);
    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () =>
    console.log("Market Data API Running on Port 3000")
);
