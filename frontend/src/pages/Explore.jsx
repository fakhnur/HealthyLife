import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bookmark, Play, Clock, ArrowRight } from 'lucide-react';
import { contentService, favoriteService } from '../services/api';
import { ContentImage } from '../components/common/ContentImage';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const TABS = [
 { label: 'Semua', params: {} },
 { label: 'Artikel Sehat', params: { type: 'article' } },
 { label: 'Video Edukasi', params: { type: 'video' } },
 { label: 'Panduan Gizi', params: { category: 'Nutrisi' } },
];

export const Explore = () => {
 const [searchParams, setSearchParams] = useSearchParams();
 const urlSearch = searchParams.get('search') || '';
 const navigate = useNavigate();
 const location = useLocation();
 const { isAuthenticated } = useAuth();
 const { refresh: refreshFavorites } = useFavorites();

 const [contents, setContents] = useState([]);
 const [activeTab, setActiveTab] = useState(0);
 const [searchInput, setSearchInput] = useState(urlSearch);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 // Keep the input in sync when the URL changes from elsewhere (e.g. dashboard search).
 useEffect(() => setSearchInput(urlSearch), [urlSearch]);

 // Debounce typing into the URL; the URL is the single source of truth for the query.
 useEffect(() => {
  const q = searchInput.trim();
  if (q === urlSearch) return undefined;
  const id = setTimeout(() => setSearchParams(q ? { search: q } : {}, { replace: true }), 300);
  return () => clearTimeout(id);
 }, [searchInput, urlSearch, setSearchParams]);

 useEffect(() => {
  let cancelled = false;
  const run = async () => {
   setLoading(true);
   setError('');
   try {
    const params = { ...TABS[activeTab].params };
    if (urlSearch) params.search = urlSearch;
    const res = await contentService.getContents(params);
    if (!cancelled) setContents(res.data || []);
   } catch (err) {
    if (!cancelled) setError(err.response?.data?.message || 'Gagal memuat konten.');
   } finally {
    if (!cancelled) setLoading(false);
   }
  };
  run();
  return () => {
   cancelled = true;
  };
 }, [activeTab, urlSearch]);

 const toggleFavorite = async (e, contentId) => {
  e.preventDefault();
  e.stopPropagation();
  if (!isAuthenticated) {
   navigate('/login', { state: { from: location.pathname + location.search } });
   return;
  }
  try {
   const res = await favoriteService.toggleFavorite(contentId);
   setContents((prev) => prev.map((c) => (c._id === contentId ? { ...c, isFavorited: res.isFavorited } : c)));
   refreshFavorites();
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal memperbarui favorit.');
  }
 };

 // The hero is an editorial pick: only on the unfiltered landing view.
 const showHero = !urlSearch && activeTab === 0;
 const featured = showHero ? contents.find((c) => c.isFeatured && c.type === 'article') || contents[0] : null;
 const list = featured ? contents.filter((c) => c._id !== featured._id) : contents;

 return (
  <div className="h-full flex flex-col overflow-hidden">
   <div className="shrink-0 px-5 md:px-8 pt-5 md:pt-7 pb-4 bg-[#F8FBFA] space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
     <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Jelajahi Hidup Sehat</h1>
     <p className="text-[13px] text-[#6B7280] mt-0.5">Inspirasi kecil untuk sehat setiap hari.</p>
    </div>

    <div className="relative w-full sm:w-[380px]">
     <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
     <input
      type="search"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Cari artikel, video, atau nutrisi..."
      className="w-full pl-10 pr-4 h-11 text-[13px] bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF]"
     />
    </div>
   </div>

   <div className="flex flex-wrap items-center gap-2">
    {TABS.map((t, idx) => (
     <button
      key={t.label}
      onClick={() => setActiveTab(idx)}
      className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all ${
       activeTab === idx
        ? 'bg-[#15877F] text-white'
        : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'
      }`}
     >
      {t.label}
     </button>
    ))}
   </div>

   </div>

   <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-6 space-y-6">
   {error && (
    <div role="alert" className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
     {error}
    </div>
   )}

   {featured && (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12">
     <div className="md:col-span-7 p-7 flex flex-col justify-between gap-5">
      <div>
       <span className="inline-block px-3 py-1 rounded-full bg-[#E6F7F5] text-[10px] font-bold text-[#15877F] tracking-wide mb-3">
        PILIHAN HARI INI
       </span>
       <h2 className="text-[26px] font-bold text-[#111827] leading-tight">{featured.title}</h2>
       <p className="text-[13px] text-[#6B7280] mt-2">
        {featured.category} • {featured.readTime} • Oleh {featured.author?.name || 'Tim HealthyLife'}
       </p>
      </div>
      <div>
       <Link
        to={`/content/${featured._id}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#15877F] hover:bg-[#106761] text-white text-[12px] font-bold transition-colors"
       >
        <span>{featured.type === 'video' ? 'Tonton Video' : 'Baca Artikel Lengkap'}</span>
        <ArrowRight size={14} />
       </Link>
      </div>
     </div>
     <div className="md:col-span-5 min-h-[200px] bg-[#F3F4F6]">
      <ContentImage src={featured.heroImage} alt={featured.title} className="w-full h-full object-cover" />
     </div>
    </div>
   )}

   <div className="space-y-4 pt-1">
    <h2 className="text-[17px] font-bold text-[#111827]">{urlSearch ? `Hasil untuk “${urlSearch}”` : 'Untuk Kamu'}</h2>

    {loading ? (
     <div className="py-16 text-center text-[13px] text-[#6B7280]">Memuat konten...</div>
    ) : list.length === 0 && !featured ? (
     <div className="py-16 text-center bg-white rounded-2xl border border-[#E5E7EB] text-[13px] text-[#6B7280]">
      Tidak ada konten yang cocok. Coba kata kunci atau kategori lain.
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {list.map((item) => {
       const isVideo = item.type === 'video';
       return (
        <Link
         key={item._id}
         to={`/content/${item._id}`}
         className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
        >
         <div className="relative h-44 w-full overflow-hidden bg-[#F3F4F6]">
          <ContentImage
           src={item.heroImage}
           alt={item.title}
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-[#15877F]">
           {item.category}
          </span>
          <button
           onClick={(e) => toggleFavorite(e, item._id)}
           aria-label={item.isFavorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
           className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-[#6B7280] hover:text-[#27C5B8] flex items-center justify-center"
          >
           <Bookmark size={15} className={item.isFavorited ? 'fill-[#27C5B8] text-[#27C5B8]' : ''} />
          </button>
          {isVideo && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-[#15877F] flex items-center justify-center shadow-md pl-0.5">
             <Play size={16} className="fill-current text-white" />
            </div>
           </div>
          )}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#111827]/75 text-[10px] font-semibold text-white flex items-center gap-1">
           <Clock size={10} />
           <span>{isVideo ? item.videoDuration || item.readTime : item.readTime}</span>
          </div>
         </div>

         <div className="p-4 flex-1 flex flex-col justify-between gap-2">
          <div>
           <h3 className="font-bold text-[14px] text-[#111827] group-hover:text-[#15877F] transition-colors line-clamp-2 leading-snug">
            {item.title}
           </h3>
           <p className="text-[12px] text-[#6B7280] line-clamp-2 mt-1 leading-relaxed">
            {item.excerpt || item.subtitle}
           </p>
          </div>
          <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
           <span className="truncate pr-2">{item.author?.name || 'HealthyLife'}</span>
           <span className="font-semibold text-[#15877F] shrink-0">{isVideo ? 'Tonton' : 'Baca'} →</span>
          </div>
         </div>
        </Link>
       );
      })}
     </div>
    )}
   </div>
   </div>
  </div>
 );
};
