import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';
import mongoose from 'mongoose';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] Standalone seed script finished.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Fatal error: ${error.message}`);
    process.exit(1);
  }
};

run();
