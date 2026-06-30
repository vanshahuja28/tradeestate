import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import MarketTicker from './components/MarketTicker';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Leaderboard from './pages/Leaderboard';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      {user && <NavBar />}
      {user && <MarketTicker />}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/market" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/market" /> : <Signup />} />
          <Route path="/market" element={<Protected><Market /></Protected>} />
          <Route path="/portfolio" element={<Protected><Portfolio /></Protected>} />
          <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="*" element={<Navigate to={user ? '/market' : '/login'} />} />
        </Routes>
      </main>
    </div>
  );
}
