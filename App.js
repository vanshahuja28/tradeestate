import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../context/LiveDataContext';
import TradeModal from './TradeModal';

const sectorGradients = {
  Banking: 'from-blue-600/30 to-blue-900/10',
  IT: 'from-purple-600/30 to-purple-900/10',
  Auto: 'from-orange-600/30 to-orange-900/10',
  Pharma: 'from-emerald-600/30 to-emerald-900/10',
  FMCG: 'from-pink-600/30 to-pink-900/10',
  Energy: 'from-yellow-600/30 to-yellow-900/10',
  Metal: 'from-slate-500/30 to-slate-900/10',
  Default: 'from-accent/20 to-ink'
};

export default function StockCard({ stock }) {
  const { prices, flashes } = useLiveData();
  const [open, setOpen] = useState(false);
  const live = prices[stock.symbol] || stock;
  const flash = flashes[stock.symbol];
  const gradient = sectorGradients[stock.sector] || sectorGradients.Default;
  const up = (live.changePct ?? 0) >= 0;

  return (
    <>
      <motion.div
        layout
        whileHover={{ y: -4, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        onClick={() => setOpen(true)}
        className={`relative cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-br ${gradient} p-4 overflow-hidden ${
          flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{stock.symbol}</h3>
            <p className="text-xs text-gray-400">{stock.name}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-white/10 text-gray-300">
            {stock.sector}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-extrabold tabular-nums">₹{live.lastPrice?.toFixed(2)}</p>
            <p className={`text-sm font-semibold ${up ? 'text-bull' : 'text-bear'}`}>
              {up ? '▲' : '▼'} {Math.abs(live.changePct ?? 0).toFixed(2)}%
            </p>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-accent hover:shadow-glow transition">
            Trade
          </button>
        </div>
      </motion.div>

      {open && <TradeModal stock={stock} live={live} onClose={() => setOpen(false)} />}
    </>
  );
}
