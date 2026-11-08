import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { seedDatabase } from './src/seeds/seedData.js';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log('[HealthyLife] Starting server...');
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[HealthyLife] REST API Server running on http://0.0.0.0:${PORT}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n[HealthyLife] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await mongoose.disconnect();
        console.log('[HealthyLife] Server closed and MongoDB disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error(`[HealthyLife] Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
