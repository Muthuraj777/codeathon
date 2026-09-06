import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedAdminUser } from './config/seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { responseTimeTracker, apiLimiter } from './middleware/performanceMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Seed Single Admin
connectDB().then(() => {
  seedAdminUser();
});

// Performance & Security Middleware
app.use(responseTimeTracker);
app.use(compression());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'] : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate Limiting for API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students', skillGapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized Error Handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Optimized Server running on port ${PORT}`);
  });
}

export default app;
