export default class DataLoader {
    constructor() {}

    /**
     * CSV format:
     *   date,open,high,low,close,volume
     *   2024-10-10,182.50,184.20,180.00,183.70,51300000
     *   2024-10-11,183.70,186.40,183.60,185.20,42000000
     */
    fromCSV(text) {
        const rows = text.trim().split("\n");
        const output = [];

        // assume first row is header
        for (let i = 1; i < rows.length; i++) {
            const line = rows[i].trim();
            if (!line) continue;

            const [date, open, high, low, close, volume] = line.split(",");

            if (!date) continue;

            output.push({
                time: new Date(date),
                open: parseFloat(open),
                high: parseFloat(high),
                low: parseFloat(low),
                close: parseFloat(close),
                volume: volume !== undefined ? parseInt(volume) : null
            });
        }

        return output;
    }
}
