import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import connectDB from './db/db.js';
import routes from './routes/routes.js';
import requestLogger from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import Logger from './utils/Logger.js';

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ENV.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or if origin is in allowedOrigins
      if (!origin || allowedOrigins.includes(origin) || ENV.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 and Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Database initialization and server startup
await connectDB();

const port = ENV.PORT;
app.listen(port, () => {
  Logger.info(`Portfolio BFF running on port ${port}`, {
    port,
    env: ENV.NODE_ENV,
    url: `http://localhost:${port}`,
  });
});

export default app;
