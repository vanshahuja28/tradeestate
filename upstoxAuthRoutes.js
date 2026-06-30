const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    avgBuyPrice: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

holdingSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
