import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Footprints,
  Flame,
  Droplet,
  Timer,
  Bookmark,
  CheckCircle2,
  Calendar,
  Search,
  Play,
  Clock,
  Utensils,
  Activity as ActivityIcon,
  Check,
} from 'lucide-react';
import { ContentImage } from '../components/common/ContentImage';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { activityService, contentService, favoriteService } from '../services/api';
import { formatDate, formatTime, formatNumber, getGreeting, activityDetail, relativeDay } from '../utils/format';

const ACTIVE_MINUTES_GOAL = 30;

const categoryIcon = { Olahraga: ActivityIcon, Nutrisi: Utensils, Hidrasi: Droplet, Langkah: Footprints };

const goalStatus = (pct) => {
  if (pct >= 100) return 'Target tercapai, kerja bagus!';
  if (pct >= 50) return 'Sedikit lagi, kamu bisa!';
  return 'Ayo mulai bergerak hari ini!';
};

export const Dashboard = ({ onOpenActivityModal, refreshKey }) => {
  const { user } = useAuth();
  const { refresh: refreshFavorites } = useFavorites();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [summary, setSummary] = useState(null);
  const [contents, setContents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [editingSteps, setEditingSteps] = useState(false);
  const [stepsInput, setStepsInput] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setError('');
        const [summaryRes, contentRes] = await Promise.all([
          activityService.getSummary(),
          contentService.getContents({}),
        ]);
        if (cancelled) return;
        setSummary(summaryRes.data);
        setContents(contentRes.data || []);
        setUpdatedAt(new Date());
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Gagal memuat dashboard. Coba muat ulang halaman.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Cmd/Ctrl+K focuses the search box (the badge in the field advertises it).
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const today = summary?.today;
  const stepPct = today ? Math.min(100, Math.round((today.steps / today.targetSteps) * 100)) : 0;
  const waterPct = today ? Math.min(100, Math.round((today.waterMl / today.targetWaterMl) * 100)) : 0;

  const recommendations = useMemo(() => {
    const articles = contents.filter((c) => c.type === 'article');
    const videos = contents.filter((c) => c.type === 'video');
    if (categoryFilter === 'Semua') return [articles[0], videos[0]].filter(Boolean);
    return contents.filter((c) => c.category === categoryFilter).slice(0, 2);
  }, [contents, categoryFilter]);

  const handleAddWater = async () => {
    try {
      const res = await activityService.updateWater(250);
      setSummary((s) => ({ ...s, today: { ...s.today, waterMl: res.data.waterMl } }));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah asupan air.');
    }
  };

  const handleSaveSteps = async (e) => {
    e.preventDefault();
    try {
      const res = await activityService.updateSteps(Number(stepsInput));
      setSummary((s) => ({ ...s, today: { ...s.today, steps: res.data.steps } }));
      setEditingSteps(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Jumlah langkah tidak valid.');
    }
  };

  const handleToggleFavorite = async (e, contentId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await favoriteService.toggleFavorite(contentId);
      setContents((prev) => prev.map((c) => (c._id === contentId ? { ...c, isFavorited: res.isFavorited } : c)));
      refreshFavorites();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui favorit.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/explore?search=${encodeURIComponent(q)}` : '/explore');
  };

  const firstName = user?.name?.split(' ')[0];
  const recent = (summary?.recentActivities || []).slice(0, 3);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed top bar */}
      <div className="shrink-0 px-5 md:px-8 pt-5 md:pt-7 pb-4 bg-[#F8FBFA] flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[410px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari inspirasi hidup sehat..."
            className="w-full pl-10 pr-14 h-11 text-[13px] bg-white border border-[#E5E7EB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-[5px] bg-[#F9FAFB] border border-[#E5E7EB] text-[10px] font-semibold text-[#6B7280] font-sans">
            ⌘K
          </kbd>
        </form>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-[#6B7280] font-medium">
            <Calendar size={15} />
            <span>{formatDate(new Date(), 'short')}</span>
          </div>
          <button
            onClick={onOpenActivityModal}
            className="h-11 px-5 rounded-[10px] bg-[#27C5B8] hover:bg-[#15877F] text-white text-[13px] font-semibold tracking-wide shadow-sm shadow-[#27C5B8]/20 transition-all active:scale-95"
          >
            + Catat Aktivitas
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-6 space-y-6">
      {error && (
        <div role="alert" className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-[13px] text-[#6B7280]">Memuat dashboard...</div>
      ) : (
        !!today && (
          <>
            {/* Welcome banner */}
            <div
              className="rounded-2xl p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[#D4EFEB]/60 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #DCF5EF 0%, #F0FAF7 100%)' }}
            >
              <div className="space-y-2 flex-1">
                <h1 className="text-[29px] font-bold text-[#111827] tracking-tight leading-tight">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">
                  “Tubuh yang sehat dimulai dari kebiasaan kecil yang baik.”
                </p>
                <p className="text-[12px] text-[#15877F] font-medium">
                  Terus bergerak, versi terbaikmu semakin dekat.
                </p>
              </div>

              <div className="w-full lg:w-[324px] bg-white/70 rounded-[14px] p-5 border border-white/60 space-y-2.5 shrink-0 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#15877F] text-[12px] font-semibold">
                  <CheckCircle2 size={15} />
                  <span>{goalStatus(stepPct)}</span>
                </div>
                <p className="text-[13px] font-medium text-[#111827]">
                  Target langkah harianmu tercapai {stepPct}%
                </p>
                <div className="w-full h-1.5 rounded-full bg-[#D4EFEB] overflow-hidden">
                  <div className="h-full bg-[#27C5B8] rounded-full transition-all duration-500" style={{ width: `${stepPct}%` }} />
                </div>
              </div>
            </div>

            {/* Daily summary */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-[#111827]">Ringkasan Kesehatan Hari Ini</h2>
                {updatedAt && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27C5B8]" />
                    <span>Diperbarui {formatTime(updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Steps */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-[11px] font-medium">
                    <Footprints size={15} />
                    <span>Langkah</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 min-h-[36px]">
                    {editingSteps ? (
                      <form onSubmit={handleSaveSteps} className="flex items-center gap-1.5 flex-1">
                        <input
                          type="number"
                          min="0"
                          autoFocus
                          value={stepsInput}
                          onChange={(e) => setStepsInput(e.target.value)}
                          className="w-full min-w-0 px-2.5 py-1 text-[13px] font-bold border border-[#27C5B8] rounded-lg focus:outline-none"
                        />
                        <button type="submit" aria-label="Simpan langkah" className="p-1.5 rounded-lg bg-[#27C5B8] text-white">
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSteps(false)}
                          aria-label="Batal"
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] text-xs font-bold"
                        >
                          ✕
                        </button>
                      </form>
                    ) : (
                      <div
                        onClick={() => {
                          setStepsInput(String(today.steps));
                          setEditingSteps(true);
                        }}
                        title="Klik untuk mengubah jumlah langkah"
                        className="text-[22px] font-bold text-[#111827] leading-none cursor-pointer hover:text-[#15877F] transition-colors"
                      >
                        {formatNumber(today.steps)}{' '}
                        <span className="text-[12px] text-[#6B7280] font-normal">/ {formatNumber(today.targetSteps)}</span>
                      </div>
                    )}

                    {/* Geometrically centered SVG circular progress ring */}
                    <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="stroke-[#D4EFEB]"
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="stroke-[#27C5B8] transition-all duration-500"
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={2 * Math.PI * 15 * (1 - stepPct / 100)}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#15877F] leading-none">
                        {stepPct}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px]">
                    {summary.comparison?.stepsPct != null ? (
                      <p className="text-[#15877F] font-semibold">
                        {summary.comparison.stepsPct >= 0 ? '↗ +' : '↘ '}
                        {summary.comparison.stepsPct}% vs kemarin
                      </p>
                    ) : (
                      <p className="text-[#6B7280]">Belum ada data kemarin</p>
                    )}
                  </div>
                </div>

                {/* Calories */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-[11px] font-medium">
                    <Flame size={15} />
                    <span>Kalori</span>
                  </div>
                  <div className="text-[22px] font-bold text-[#111827]">
                    {formatNumber(today.caloriesBurned)}{' '}
                    <span className="text-[12px] text-[#6B7280] font-normal">kkal</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280]">terbakar hari ini</p>
                </div>

                {/* Hydration */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-[11px] font-medium">
                    <Droplet size={15} />
                    <span>Hidrasi</span>
                  </div>
                  <div className="text-[22px] font-bold text-[#111827]">
                    {(today.waterMl / 1000).toFixed(1)}{' '}
                    <span className="text-[12px] text-[#6B7280] font-normal">/ {(today.targetWaterMl / 1000).toFixed(1)} L</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-[10px] text-[#6B7280]">{waterPct}% dari target</p>
                    <button
                      onClick={handleAddWater}
                      className="px-2.5 py-1 rounded-[10px] bg-[#E6F7F5] hover:bg-[#D4EFEB] text-[#15877F] text-[11px] font-bold transition-colors"
                    >
                      +250ml
                    </button>
                  </div>
                </div>

                {/* Active minutes */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[#6B7280] text-[11px] font-medium">
                    <Timer size={15} />
                    <span>Durasi Aktif</span>
                  </div>
                  <div className="text-[22px] font-bold text-[#111827]">
                    {today.activeMinutes} <span className="text-[12px] text-[#6B7280] font-normal">mnt</span>
                  </div>
                  {today.activeMinutes >= ACTIVE_MINUTES_GOAL ? (
                    <div className="flex items-center gap-1 text-[10px] text-[#15877F] font-semibold">
                      <CheckCircle2 size={13} />
                      <span>Target {ACTIVE_MINUTES_GOAL} mnt tercapai</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#6B7280]">
                      Kurang {ACTIVE_MINUTES_GOAL - today.activeMinutes} mnt dari target {ACTIVE_MINUTES_GOAL} mnt
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Recommendations + recent activity */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-8 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[18px] text-[#111827] tracking-tight">Rekomendasi Pola Hidup</h2>
                  <div className="flex items-center gap-1.5">
                    {['Semua', 'Nutrisi', 'Olahraga'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          categoryFilter === c
                            ? 'bg-[#27C5B8] text-white'
                            : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {recommendations.length === 0 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center text-[13px] text-[#6B7280]">
                    Belum ada rekomendasi untuk kategori ini.
                  </div>
                )}

                {recommendations.map((item) => {
                  const isVideo = item.type === 'video';
                  return (
                    <Link
                      key={item._id}
                      to={`/content/${item._id}`}
                      className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-[148px] group"
                    >
                      <div className="w-[200px] sm:w-[240px] h-full relative overflow-hidden bg-[#F3F4F6] shrink-0">
                        <ContentImage src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                        {isVideo && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg pl-0.5">
                                <Play size={17} className="fill-current text-[#111827]" />
                              </div>
                            </div>
                            {item.videoDuration && (
                              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[5px] bg-[#111827]/75 text-[10px] font-semibold text-white">
                                {item.videoDuration}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="p-5 flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#15877F] tracking-wide uppercase">
                              {item.category} · {isVideo ? 'Video Edukasi' : 'Artikel'}
                            </span>
                            <button
                              onClick={(e) => handleToggleFavorite(e, item._id)}
                              aria-label={item.isFavorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                              className="text-[#6B7280] hover:text-[#27C5B8]"
                            >
                              <Bookmark size={15} className={item.isFavorited ? 'fill-[#27C5B8] text-[#27C5B8]' : ''} />
                            </button>
                          </div>
                          <h3 className="text-[17px] font-semibold text-[#111827] group-hover:text-[#15877F] transition-colors leading-snug line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-[12px] text-[#6B7280] line-clamp-1 mt-1">{item.excerpt || item.subtitle}</p>
                        </div>
                        {isVideo ? (
                          <span className="text-[12px] font-semibold text-[#15877F] group-hover:underline">Mulai bergerak →</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                            <Clock size={12} />
                            <span>
                              {item.readTime} · {item.author?.name || 'Tim HealthyLife'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Recent activity */}
              <div className="xl:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col min-h-[308px] xl:mt-[44px]">
                <h2 className="text-[16px] font-bold text-[#111827] tracking-tight">Riwayat Aktivitas Terbaru</h2>
                <p className="text-[12px] text-[#6B7280] mt-0.5">Setiap kebiasaan baikmu tercatat di sini.</p>

                <div className="flex-1 space-y-3.5 pt-4">
                  {recent.length === 0 ? (
                    <p className="text-[12px] text-[#6B7280] py-6 text-center">
                      Belum ada aktivitas. Tekan “+ Catat Aktivitas” untuk memulai.
                    </p>
                  ) : (
                    recent.map((a) => {
                      const Icon = categoryIcon[a.category] || ActivityIcon;
                      return (
                        <div key={a._id} className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-[#E6F7F5] flex items-center justify-center text-[#15877F] shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] text-[#9CA3AF] leading-none mb-1">
                              {relativeDay(a.date)} · {formatTime(a.date)}
                            </div>
                            <div className="text-[13px] font-bold text-[#111827] truncate leading-tight">
                              {a.title}
                            </div>
                            <div className="text-[11px] text-[#6B7280] leading-none mt-1">
                              {activityDetail(a)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-[#E5E7EB]">
                  <Link to="/activities" className="text-[12px] font-semibold text-[#15877F] hover:underline block">
                    Lihat Semua Aktivitas →
                  </Link>
                </div>
              </div>
            </div>
          </>
        )
      )}
      </div>
    </div>
  );
};
