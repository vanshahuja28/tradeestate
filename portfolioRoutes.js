# Server
PORT=5000
JWT_SECRET=change_this_to_a_long_random_string

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/intraday_app

# Upstox API credentials (get these from https://developer.upstox.com)
UPSTOX_API_KEY=your_upstox_api_key
UPSTOX_API_SECRET=your_upstox_api_secret
UPSTOX_REDIRECT_URI=http://localhost:5000/api/upstox/callback
# Generated after OAuth login flow (see /api/upstox/login)
UPSTOX_ACCESS_TOKEN=

# Starting virtual currency given to every new user (in INR)
SIGNUP_VIRTUAL_CASH=1000000

# How often (ms) to refresh live prices from Upstox and broadcast via socket
PRICE_POLL_INTERVAL_MS=3000
