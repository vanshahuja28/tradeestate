const Stock = require('../models/Stock');
const upstox = require('./upstoxService');

let io = null;
let timer = null;

function attachSocket(socketIoInstance) {
  io = socketIoInstance;
}

/**
 * Pulls real live prices from Upstox when UPSTOX_ACCESS_TOKEN is configured.
 * If no token is present (e.g. during local dev before OAuth setup), it
 * falls back to a realistic random-walk simulation seeded from each
 * stock's last known prevClose, so the UI is always "live" end to end.
 */
async function tick() {
  const stocks = await Stock.find({}, 'symbol instrumentKey lastPrice prevClose dayHigh dayLow dayOpen');
  if (!stocks.length) return;

  const hasToken = !!process.env.UPSTOX_ACCESS_TOKEN;
  let liveQuotes = null;

  if (hasToken) {
    try {
      const keys = stocks.map((s) => s.instrumentKey);
      // Upstox caps batch size; chunk into groups of 200
      const chunks = [];
      for (let i = 0; i < keys.length; i += 200) chunks.push(keys.slice(i, i + 200));
      liveQuotes = {};
      for (const chunk of chunks) {
        const res = await upstox.getLiveQuotes(chunk);
        Object.assign(liveQuotes, res);
      }
    } catch (err) {
      console.error('[priceEngine] Upstox fetch failed, falling back to simulation:', err.message);
      liveQuotes = null;
    }
  }

  const bulkOps = [];
  const broadcastPayload = [];

  for (const stock of stocks) {
    let lastPrice, dayHigh, dayLow, dayOpen, prevClose, volume;

    const quote = liveQuotes && liveQuotes[stock.instrumentKey];
    if (quote) {
      lastPrice = quote.last_price;
      dayHigh = quote.ohlc?.high ?? stock.dayHigh;
      dayLow = quote.ohlc?.low ?? stock.dayLow;
      dayOpen = quote.ohlc?.open ?? stock.dayOpen;
      prevClose = quote.ohlc?.close ?? stock.prevClose;
      volume = quote.volume ?? 0;
    } else {
      // Simulation fallback: small realistic tick around previous price
      const base = stock.lastPrice || stock.prevClose || 100;
      const driftPct = (Math.random() - 0.5) * 0.006; // +-0.3% per tick
      lastPrice = +(base * (1 + driftPct)).toFixed(2);
      prevClose = stock.prevClose || base;
      dayOpen = stock.dayOpen || base;
      dayHigh = Math.max(stock.dayHigh || lastPrice, lastPrice);
      dayLow = stock.dayLow ? Math.min(stock.dayLow, lastPrice) : lastPrice;
      volume = (stock.volume || 0) + Math.floor(Math.random() * 5000);
    }

    const changePct = prevClose ? +(((lastPrice - prevClose) / prevClose) * 100).toFixed(2) : 0;

    bulkOps.push({
      updateOne: {
        filter: { _id: stock._id },
        update: { lastPrice, dayHigh, dayLow, dayOpen, prevClose, changePct, volume, updatedAt: new Date() }
      }
    });

    broadcastPayload.push({
      symbol: stock.symbol,
      lastPrice,
      changePct,
      dayHigh,
      dayLow,
      dayOpen,
      volume
    });
  }

  if (bulkOps.length) await Stock.bulkWrite(bulkOps);
  if (io) io.emit('priceUpdate', broadcastPayload);
}

function start() {
  const interval = parseInt(process.env.PRICE_POLL_INTERVAL_MS || '3000', 10);
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    tick().catch((e) => console.error('[priceEngine] tick error', e.message));
  }, interval);
  console.log(`[priceEngine] started, polling every ${interval}ms`);
}

module.exports = { start, attachSocket, tick };
