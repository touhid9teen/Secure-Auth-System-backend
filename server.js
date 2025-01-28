const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Enable security headers but allow API calls from localhost:5173 (your frontend) and Electron's localhost URL
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173", "http://localhost:3000"], // Allow API, frontend, and Electron renderer
        },
      },
    })
);

// Enable CORS for frontend and Electron's renderer process
app.use(
    cors({
      origin: [
        "http://localhost:5173", // Frontend React app
        "http://localhost:3000", // Electron's renderer process (for development)
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
