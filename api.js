import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-accent text-white shadow-glow' : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ink/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-xl font-bold"
        >
          <span className="text-accent">Trade</span>
          <span>Estate</span>
          <span className="text-xs font-normal text-gray-400 ml-2 hidden sm:inline">
            Virtual NSE Trading Realm
          </span>
        </motion.div>

        <nav className="flex items-center gap-2">
          <NavLink to="/market" className={linkClass}>Properties</NavLink>
          <NavLink to="/portfolio" className={linkClass}>My Portfolio</NavLink>
          <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold">{user?.name}</span>
            <span className="text-xs text-gray-400">₹{Number(user?.cashBalance || 0).toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-bear/60 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
