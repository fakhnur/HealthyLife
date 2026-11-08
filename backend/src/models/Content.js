import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul wajib diisi'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      enum: ['Nutrisi', 'Olahraga', 'Hidrasi', 'Pola Tidur', 'Hidup Sehat'],
      index: true,
    },
    type: {
      type: String,
      enum: ['article', 'video', 'guide'],
      default: 'article',
      index: true,
    },
    author: {
      name: { type: String, default: 'Tim Ahli HealthyLife' },
      role: { type: String, default: 'Spesialis Kesehatan' },
      bio: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    readTime: {
      type: String,
      default: '3 mnt baca',
    },
    videoDuration: {
      type: String,
      default: '',
    },
    heroImage: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    steps: [stepSchema],
    quote: {
      type: String,
      default: '',
    },
    advice: {
      type: String,
      default: '',
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

export const Content = mongoose.model('Content', contentSchema);
