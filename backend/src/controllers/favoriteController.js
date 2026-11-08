import { Favorite } from '../models/Favorite.js';
import { Content } from '../models/Content.js';

export const getFavorites = async (req, res, next) => {
  try {
    const { category, type } = req.query;

    const favorites = await Favorite.find({ user: req.user._id })
      .populate('content')
      .sort({ createdAt: -1 });

    // Filter out any favorites whose content might have been removed
    let items = favorites
      .filter((fav) => fav.content != null)
      .map((fav) => ({
        ...fav.content.toObject(),
        favoriteId: fav._id,
        isFavorited: true,
        savedAt: fav.createdAt,
      }));

    if (category && category !== 'Semua') {
      items = items.filter((item) => item.category === category);
    }

    if (type && type !== 'all') {
      items = items.filter((item) => item.type === type);
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.',
      });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      content: contentId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({
        success: true,
        isFavorited: false,
        message: 'Konten dihapus dari favorit.',
      });
    } else {
      await Favorite.create({
        user: req.user._id,
        content: contentId,
      });
      return res.status(201).json({
        success: true,
        isFavorited: true,
        message: 'Konten disimpan ke favorit.',
      });
    }
  } catch (error) {
    next(error);
  }
};
