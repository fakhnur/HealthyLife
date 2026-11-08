import { Activity } from '../models/Activity.js';
import { DailyMetric } from '../models/DailyMetric.js';
import { dayKey, dayRange, addDays, weekdayOf } from '../utils/date.js';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const CATEGORIES = ['Olahraga', 'Nutrisi', 'Hidrasi', 'Langkah'];
const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const defaultMetric = (userId, date) => ({
  user: userId,
  date,
  steps: 0,
  targetSteps: 10000,
  caloriesBurned: 0,
  targetCalories: 500,
  waterMl: 0,
  targetWaterMl: 2000,
  activeMinutes: 0,
});

// Atomic upsert: parallel first requests of the day must not hit the unique index.
export const getOrCreateMetric = (userId, date = dayKey()) =>
  DailyMetric.findOneAndUpdate(
    { user: userId, date },
    { $setOnInsert: defaultMetric(userId, date) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

// Only workouts burn calories / count as active time; meals and water do not.
const metricDelta = (activity) => ({
  caloriesBurned: activity.category === 'Olahraga' ? activity.calories : 0,
  activeMinutes: activity.category === 'Olahraga' ? activity.durationMinutes : 0,
  waterMl: activity.category === 'Hidrasi' ? activity.amountMl : 0,
});

const nonNegative = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

export const getActivities = async (req, res, next) => {
  try {
    const { category, date } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = { user: req.user._id };

    if (category && category !== 'Semua') {
      filter.category = category;
    }

    if (date) {
      if (!DAY_KEY_RE.test(date)) {
        return res.status(400).json({ success: false, message: 'Format tanggal harus YYYY-MM-DD.' });
      }
      const { start, end } = dayRange(date);
      filter.date = { $gte: start, $lt: end };
    }

    const activities = await Activity.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const { title, category = 'Olahraga', notes = '', date } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Nama aktivitas wajib diisi.' });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: 'Kategori aktivitas tidak valid.' });
    }

    const durationMinutes = nonNegative(req.body.durationMinutes ?? 0);
    const calories = nonNegative(req.body.calories ?? 0);
    const amountMl = nonNegative(req.body.amountMl ?? 0);
    if (durationMinutes === null || calories === null || amountMl === null) {
      return res.status(400).json({
        success: false,
        message: 'Durasi, kalori, dan jumlah air tidak boleh negatif.',
      });
    }

    const activityDate = date ? new Date(date) : new Date();
    if (Number.isNaN(activityDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Tanggal aktivitas tidak valid.' });
    }

    const activity = await Activity.create({
      user: req.user._id,
      title: String(title).trim(),
      category,
      durationMinutes,
      calories,
      amountMl,
      notes: String(notes).trim(),
      date: activityDate,
    });

    const delta = metricDelta(activity);
    const metric = await DailyMetric.findOneAndUpdate(
      { user: req.user._id, date: dayKey(activityDate) },
      { $setOnInsert: defaultMetric(req.user._id, dayKey(activityDate)) },
      { upsert: true, new: true }
    );
    metric.caloriesBurned += delta.caloriesBurned;
    metric.activeMinutes += delta.activeMinutes;
    metric.waterMl += delta.waterMl;
    metric.completed = metric.steps >= metric.targetSteps;
    await metric.save();

    res.status(201).json({
      success: true,
      message: 'Aktivitas berhasil dicatat.',
      data: { activity, metric },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, user: req.user._id });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Aktivitas tidak ditemukan.' });
    }

    await activity.deleteOne();

    const metric = await DailyMetric.findOne({ user: req.user._id, date: dayKey(activity.date) });
    if (metric) {
      const delta = metricDelta(activity);
      metric.caloriesBurned = Math.max(0, metric.caloriesBurned - delta.caloriesBurned);
      metric.activeMinutes = Math.max(0, metric.activeMinutes - delta.activeMinutes);
      metric.waterMl = Math.max(0, metric.waterMl - delta.waterMl);
      await metric.save();
    }

    res.json({ success: true, message: 'Aktivitas berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

export const getActivitySummary = async (req, res, next) => {
  try {
    const todayStr = dayKey();
    const todayMetric = await getOrCreateMetric(req.user._id, todayStr);

    // Current week, Monday → Sunday, to match the calendar strip design.
    const weekdayIdx = (weekdayOf(todayStr) + 6) % 7; // Monday = 0
    const weekStart = addDays(todayStr, -weekdayIdx);
    const weekKeys = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // Look back far enough to compute the streak as well.
    const lookbackStart = addDays(todayStr, -60);
    const metrics = await DailyMetric.find({
      user: req.user._id,
      date: { $gte: lookbackStart, $lte: todayStr },
    });
    const byDate = new Map(metrics.map((m) => [m.date, m]));
    const hasActivity = (key) => {
      const m = byDate.get(key);
      return !!m && (m.steps > 0 || m.caloriesBurned > 0 || m.activeMinutes > 0 || m.waterMl > 0);
    };

    const weekStrip = weekKeys.map((key) => {
      const m = byDate.get(key);
      return {
        date: key,
        dayName: DAY_NAMES[weekdayOf(key)],
        dayNumber: Number(key.slice(8)),
        isToday: key === todayStr,
        isFuture: key > todayStr,
        hasActivity: hasActivity(key),
        isCompleted: !!m && m.steps >= m.targetSteps,
      };
    });

    // Streak: consecutive days with any activity, ending today (or yesterday if today is still empty).
    let cursor = hasActivity(todayStr) ? todayStr : addDays(todayStr, -1);
    let streak = 0;
    while (hasActivity(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }

    const yesterday = byDate.get(addDays(todayStr, -1));
    const pctVsYesterday = (now, before) =>
      before && before > 0 ? Math.round(((now - before) / before) * 100) : null;

    const { start, end } = dayRange(todayStr);
    const todayActivities = await Activity.find({ user: req.user._id, date: { $gte: start, $lt: end } })
      .sort({ date: -1, createdAt: -1 });

    const recentActivities = await Activity.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        today: todayMetric,
        comparison: {
          stepsPct: pctVsYesterday(todayMetric.steps, yesterday?.steps),
          caloriesPct: pctVsYesterday(todayMetric.caloriesBurned, yesterday?.caloriesBurned),
        },
        streak,
        weekStrip,
        todayActivities,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateWaterIntake = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount ?? 250);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
      return res.status(400).json({ success: false, message: 'Jumlah air tidak valid.' });
    }

    const metric = await getOrCreateMetric(req.user._id);
    metric.waterMl += Math.round(amount);
    await metric.save();

    res.json({
      success: true,
      message: `Asupan air berhasil ditambahkan (${Math.round(amount)} ml).`,
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSteps = async (req, res, next) => {
  try {
    const steps = Number(req.body.steps);
    if (req.body.steps === undefined || !Number.isFinite(steps) || steps < 0) {
      return res.status(400).json({ success: false, message: 'Jumlah langkah tidak valid.' });
    }

    const metric = await getOrCreateMetric(req.user._id);
    metric.steps = Math.round(steps);
    metric.completed = metric.steps >= metric.targetSteps;
    await metric.save();

    res.json({ success: true, message: 'Langkah harian berhasil diperbarui.', data: metric });
  } catch (error) {
    next(error);
  }
};
