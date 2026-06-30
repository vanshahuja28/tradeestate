import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      navigate('/market');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="bg-panel border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-glow"
      >
        <h1 className="text-2xl font-bold mb-1"><span className="text-accent">Trade</span>Estate</h1>
        <p className="text-sm text-gray-400 mb-6">
          Create an account and receive ₹10,00,000 virtual cash to start trading instantly.
        </p>

        <input
          placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 bg-ink border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent"
        />
        <input
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 bg-ink border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent"
        />
        <input
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 bg-ink border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent"
        />

        {error && <p className="text-bear text-sm mb-3">{error}</p>}

        <button className="w-full py-3 rounded-xl bg-accent font-bold hover:opacity-90 transition">
          Create account
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-accent">Login</Link>
        </p>
      </motion.form>
    </div>
  );
}
