import React, { useMemo } from 'react';
import { useLiveData } from '../context/LiveDataContext';

export default function MarketTicker() {
  const { prices } = useLiveData();
  const items = useMemo(() => Object.values(prices).slice(0, 60), [prices]);

  if (!items.length) {
    return (
      <div className="bg-panel border-b border-white/5 text-xs text-gray-500 py-2 px-4">
        Connecting to live market feed…
      </div>
    );
  }

  return (
    <div className="bg-panel border-b border-white/5 overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-[scroll_40s_linear_infinite] py-2">
        {[...items, ...items].map((s, i) => (
          <span key={i} className="mx-4 text-xs font-mono">
            <span className="text-gray-300 font-semibold">{s.symbol}</span>{' '}
            <span className={s.changePct >= 0 ? 'text-bull' : 'text-bear'}>
              ₹{s.lastPrice?.toFixed(2)} ({s.changePct >= 0 ? '+' : ''}{s.changePct}%)
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
