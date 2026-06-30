import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api';

const COLORS = ['#7c5cff', '#00c853', '#ff3d57', '#ffb300', '#29b6f6', '#ab47bc', '#26a69a', '#ef5350'];

export default function Portfolio() {
  const [data, setData] = useState(null);

  const load = () => api.get('/portfolio').then((res) => setData(res.data));

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center py-20 text-gray-500">Loading portfolio…</div>;

  const pieData = data.holdings.map((h) => ({ name: h.symbol, value: h.value }));

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">My Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Net Worth', value: data.netWorth, color: 'text-accent' },
          { label: 'Cash Balance', value: data.cashBalance, color: 'text-gray-200' },
          { label: 'Market Value', value: data.marketValue, color: 'text-gray-200' },
          { label: 'Realized P&L', value: data.realizedPnL, color: data.realizedPnL >= 0 ? 'text-bull' : 'text-bear' }
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-panel border border-white/10 rounded-2xl p-5"
          >
            <p className="text-xs text-gray-400">{card.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${card.color}`}>
              ₹{Number(card.value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel border border-white/10 rounded-2xl p-5">
          <h2 className="font-bold mb-4">Holdings</h2>
          {data.holdings.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven't bought any properties yet. Visit the Market to start trading.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-400 text-left">
                <tr>
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Avg Buy</th>
                  <th className="pb-2">LTP</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {data.holdings.map((h) => (
                  <tr key={h.symbol} className="border-t border-white/5">
                    <td className="py-2 font-semibold">{h.symbol}</td>
                    <td className="py-2">{h.quantity}</td>
                    <td className="py-2">₹{h.avgBuyPrice.toFixed(2)}</td>
                    <td className="py-2">₹{h.ltp.toFixed(2)}</td>
                    <td className="py-2">₹{h.value.toLocaleString('en-IN')}</td>
                    <td className={`py-2 font-semibold ${h.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString('en-IN')} ({h.pnlPct}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-panel border border-white/10 rounded-2xl p-5">
          <h2 className="font-bold mb-4">Allocation</h2>
          {pieData.length === 0 ? (
            <p className="text-gray-500 text-sm">No holdings to visualize yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
