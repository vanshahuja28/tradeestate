const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatarSeed: { type: String, default: () => Math.random().toString(36).slice(2) },

    // Virtual trading wallet
    cashBalance: { type: Number, default: 0 },        // free cash available
    investedValue: { type: Number, default: 0 },      // cost basis currently invested
    realizedPnL: { type: Number, default: 0 },         // booked profit/loss from closed trades
    netWorth: { type: Number, default: 0 },             // cashBalance + current market value of holdings

    joinedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
