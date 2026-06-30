const mongoose = require('mongoose');

// Each document mirrors one real NSE-listed stock.
// "instrumentKey" is the Upstox instrument identifier used to fetch live quotes,
// e.g. "NSE_EQ|INE002A01018" for Reliance Industries.
const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, index: true }, // e.g. RELIANCE
    name: { type: String, required: true },                               // e.g. Reliance Industries Ltd
    instrumentKey: { type: String, required: true, unique: true },
    sector: { type: String, default: 'General' },
    exchange: { type: String, default: 'NSE' },

    // live fields, refreshed continuously from Upstox
    lastPrice: { type: Number, default: 0 },
    prevClose: { type: Number, default: 0 },
    dayHigh: { type: Number, default: 0 },
    dayLow: { type: Number, default: 0 },
    dayOpen: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    changePct: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
