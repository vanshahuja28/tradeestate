import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const { user } = useAuth();

  const load = () => api.get('/leaderboard').then((res) => setRows(res.data));

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2">Global Leaderboard</h1>
      <p className="text-gray-400 text-sm mb-6">Ranked live by net worth across every trader who has ever joined TradeEstate.</p>

      <div className="bg-panel border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs text-gray-400 border-b border-white/5">
          <span className="col-span-2">Rank</span>
          <span className="col-span-5">Trader</span>
          <span className="col-span-3 text-right">Net Worth</span>
          <span className="col-span-2 text-right">Return</span>
        </div>
        <AnimatePresence>
          {rows.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid grid-cols-12 items-center px-5 py-3 border-b border-white/5 ${
                r.name === user?.name ? 'bg-accent/10' : ''
              }`}
            >
              <span className="col-span-2 font-bold text-lg">
                {medals[r.rank - 1] || `#${r.rank}`}
              </span>
              <span className="col-span-5 flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-800 flex items-center justify-center text-xs font-bold"
                >
                  {r.name?.[0]?.toUpperCase()}
                </span>
                {r.name}
              </span>
              <span className="col-span-3 text-right font-semibold tabular-nums">
                ₹{r.netWorth.toLocaleString('en-IN')}
              </span>
              <span className={`col-span-2 text-right font-semibold ${r.returnPct >= 0 ? 'text-bull' : 'text-bear'}`}>
                {r.returnPct >= 0 ? '+' : ''}{r.returnPct}%
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
