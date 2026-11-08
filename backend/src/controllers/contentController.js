import { Content } from '../models/Content.js';
import { Favorite } from '../models/Favorite.js';

export const getContents = async (req, res, next) => {
  try {
    const { category, type, search, featured } = req.query;
    const filter = {};

    if (category && category !== 'Semua') {
      filter.category = category;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (search && search.trim() !== '') {
      const q = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subtitle: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const contents = await Content.find(filter).sort({ isFeatured: -1, createdAt: -1 });

    // Enrich with isFavorited if user is authenticated
    let favoritedSet = new Set();
    if (req.user) {
      const favorites = await Favorite.find({ user: req.user._id }).select('content');
      favoritedSet = new Set(favorites.map((f) => f.content.toString()));
    }

    const enriched = contents.map((item) => ({
      ...item.toObject(),
      isFavorited: favoritedSet.has(item._id.toString()),
    }));

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.',
      });
    }

    let isFavorited = false;
    if (req.user) {
      const fav = await Favorite.findOne({ user: req.user._id, content: content._id });
      isFavorited = !!fav;
    }

    // Related content in same category or popular fallback
    let related = await Content.find({
      _id: { $ne: content._id },
      category: content.category,
    })
      .limit(3)
      .select('title category type readTime videoDuration heroImage');

    if (related.length < 3) {
      const existingIds = [content._id, ...related.map((r) => r._id)];
      const additional = await Content.find({
        _id: { $nin: existingIds },
      })
        .limit(3 - related.length)
        .select('title category type readTime videoDuration heroImage');
      related = [...related, ...additional];
    }

    res.json({
      success: true,
      data: {
        ...content.toObject(),
        isFavorited,
        related,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { name: 'Semua', label: 'Semua Konten' },
      { name: 'Nutrisi', label: 'Nutrisi & Makanan' },
      { name: 'Olahraga', label: 'Olahraga & Kebugaran' },
      { name: 'Hidup Sehat', label: 'Pola Hidup Sehat' },
      { name: 'Hidrasi', label: 'Air & Hidrasi' },
      { name: 'Pola Tidur', label: 'Istirahat & Tidur' },
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
