import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Kategori aktivitas wajib diisi'],
      enum: ['Olahraga', 'Nutrisi', 'Hidrasi', 'Langkah'],
      default: 'Olahraga',
    },
    title: {
      type: String,
      required: [true, 'Nama aktivitas wajib diisi'],
      trim: true,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    amountMl: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model('Activity', activitySchema);
