import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Standard Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HealthyLife REST API Backend',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
