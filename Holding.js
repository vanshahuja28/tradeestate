require('dotenv').config();
const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const upstox = require('../services/upstoxService');
const { buildUniverse } = require('./stockUniverse');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB. Seeding stock universe...');

  const universe = buildUniverse();
  console.log(`Universe size: ${universe.length} symbols`);

  let instrumentMaster = null;
  if (process.env.UPSTOX_ACCESS_TOKEN) {
    try {
      console.log('Downloading Upstox instrument master to resolve real instrument keys...');
      instrumentMaster = await upstox.downloadInstrumentMaster();
      console.log(`Instrument master loaded: ${instrumentMaster.length} entries`);
    } catch (err) {
      console.warn('Could not download instrument master, will seed with placeholder keys:', err.message);
    }
  } else {
    console.log('No UPSTOX_ACCESS_TOKEN set — seeding with placeholder instrument keys. Prices will run in simulation mode.');
  }

  const lookup = {};
  if (instrumentMaster) {
    for (const item of instrumentMaster) {
      if (item.segment === 'NSE_EQ' && item.trading_symbol) {
        lookup[item.trading_symbol] = item.instrument_key;
      }
    }
  }

  const ops = universe.map(({ symbol, sector }) => {
    const instrumentKey = lookup[symbol] || `NSE_EQ|PLACEHOLDER_${symbol}`;
    // seed a plausible starting price so simulation mode looks realistic immediately
    const seedPrice = +(50 + Math.random() * 3000).toFixed(2);
    return {
      updateOne: {
        filter: { symbol },
        update: {
          $setOnInsert: {
            symbol,
            name: `${symbol} Ltd`,
            sector,
            exchange: 'NSE',
            instrumentKey,
            lastPrice: seedPrice,
            prevClose: seedPrice,
            dayOpen: seedPrice,
            dayHigh: seedPrice,
            dayLow: seedPrice,
            volume: 0
          }
        },
        upsert: true
      }
    };
  });

  const result = await Stock.bulkWrite(ops);
  console.log('Seed complete:', result.upsertedCount, 'new stocks inserted.');

  const total = await Stock.countDocuments();
  console.log(`Total stocks in DB: ${total}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
