{
  "name": "intraday-backend",
  "version": "1.0.0",
  "description": "Virtual intraday trading platform backend powered by Upstox live NSE data",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seedStocks.js"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0",
    "socket.io": "^4.7.5",
    "ws": "^8.17.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
