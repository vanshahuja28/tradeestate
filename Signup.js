@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: radial-gradient(circle at top left, #161c2c 0%, #0b0f19 60%);
  color: #e6e9f0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: #2a3146; border-radius: 8px; }

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0px rgba(124,92,255,0.0); }
  50% { box-shadow: 0 0 18px rgba(124,92,255,0.45); }
}
.glow-pulse { animation: pulseGlow 2.4s ease-in-out infinite; }

@keyframes flashGreen {
  0% { background-color: rgba(0,200,83,0.35); }
  100% { background-color: transparent; }
}
@keyframes flashRed {
  0% { background-color: rgba(255,61,87,0.35); }
  100% { background-color: transparent; }
}
.flash-up { animation: flashGreen 0.7s ease-out; }
.flash-down { animation: flashRed 0.7s ease-out; }
