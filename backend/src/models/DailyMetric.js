import mongoose from 'mongoose';

const dailyMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    steps: {
      type: Number,
      default: 0,
    },
    targetSteps: {
      type: Number,
      default: 10000,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    targetCalories: {
      type: Number,
      default: 500,
    },
    waterMl: {
      type: Number,
      default: 0,
    },
    targetWaterMl: {
      type: Number,
      default: 2000,
    },
    activeMinutes: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

dailyMetricSchema.index({ user: 1, date: 1 }, { unique: true });

export const DailyMetric = mongoose.model('DailyMetric', dailyMetricSchema);
