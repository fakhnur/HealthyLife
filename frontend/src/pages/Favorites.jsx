import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, Compass, Play } from 'lucide-react';
import { favoriteService } from '../services/api';
import { ContentImage } from '../components/common/ContentImage';
import { useFavorites } from '../context/FavoritesContext';

const TABS = [
 { id: 'all', label: 'Semua' },
 { id: 'article', label: 'Artikel' },
 { id: 'video', label: 'Video' },
];

export const Favorites = () => {
 const { refresh: refreshFavorites } = useFavorites();

 const [favorites, setFavorites] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [format, setFormat] = useState('all');
 const [search, setSearch] = useState('');

 useEffect(() => {
  let cancelled = false;
  setLoading(true);
  favoriteService
   .getFavorites({ type: format })
   .then((res) => !cancelled && setFavorites(res.data || []))
   .catch((err) => !cancelled && setError(err.response?.data?.message || 'Gagal memuat favorit.'))
   .finally(() => !cancelled && setLoading(false));
  return () => {
   cancelled = true;
  };
 }, [format]);

 const removeFavorite = async (e, id) => {
  e.preventDefault();
  e.stopPropagation();
  try {
   await favoriteService.toggleFavorite(id);
   setFavorites((prev) => prev.filter((item) => item._id !== id));
   refreshFavorites();
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal menghapus favorit.');
  }
 };

 const q = search.trim().toLowerCase();
 const filtered = q ? favorites.filter((f) => f.title.toLowerCase().includes(q)) : favorites;

 return (
  <div className="h-full flex flex-col overflow-hidden">
   <div className="shrink-0 px-5 md:px-8 pt-5 md:pt-7 pb-4 bg-[#F8FBFA] space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
     <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Koleksi Favorit</h1>
     <p className="text-[13px] text-[#6B7280] mt-0.5">Koleksi artikel dan panduan olahraga pilihanmu.</p>
    </div>

    <div className="relative w-full sm:w-[340px]">
     <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={15} />
     <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Cari di antara favorit..."
      className="w-full pl-10 pr-4 h-11 text-[13px] bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF]"
     />
    </div>
   </div>

   <div className="flex items-center gap-2">
    {TABS.map((tab) => (
     <button
      key={tab.id}
      onClick={() => setFormat(tab.id)}
      className={`px-5 py-2 rounded-full text-[12px] font-semibold transition-all ${
       format === tab.id
        ? 'bg-[#15877F] text-white'
        : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
      }`}
     >
      {tab.label}
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

   {loading ? (
    <div className="py-20 text-center text-[13px] text-[#6B7280]">Memuat koleksi favorit...</div>
   ) : filtered.length === 0 ? (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] px-8 py-14 text-center space-y-4 max-w-[600px] mx-auto mt-8">
     <div className="w-24 h-24 rounded-full bg-[#E2F9F7] flex items-center justify-center text-[#27C5B8] mx-auto">
      <Bookmark size={38} className="stroke-[1.5]" />
     </div>
     {q ? (
      <>
       <h3 className="text-[22px] font-bold text-[#183D3A]">Tidak Ditemukan</h3>
       <p className="text-[13px] text-[#6B7280]">Tidak ada favorit yang cocok dengan “{search.trim()}”.</p>
      </>
     ) : (
      <>
       <h3 className="text-[22px] font-bold text-[#183D3A]">Belum Ada Favorit</h3>
       <p className="text-[13px] text-[#6B7280] max-w-sm mx-auto leading-relaxed">
        Tandai artikel atau video yang kamu sukai agar mudah ditemukan kembali di sini.
       </p>
       <Link
        to="/explore"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#27C5B8] hover:bg-[#16877F] text-white text-[13px] font-bold transition-colors"
       >
        <Compass size={16} />
        <span>Jelajahi Konten</span>
       </Link>
      </>
     )}
    </div>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
     {filtered.map((item) => {
      const isVideo = item.type === 'video';
      return (
       <Link
        key={item._id}
        to={`/content/${item._id}`}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group"
       >
        <div className="relative h-[170px] rounded-xl overflow-hidden bg-[#F3F4F6]">
         <ContentImage src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
         {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-11 h-11 rounded-full bg-[#15877F] flex items-center justify-center pl-0.5 shadow-md">
            <Play size={16} className="fill-current text-white" />
           </div>
          </div>
         )}
        </div>
        <div className="flex-1 space-y-1.5">
         <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E6F7F5] text-[10px] font-bold text-[#15877F]">
          {item.category}
         </span>
         <h3 className="text-[15px] font-bold text-[#111827] group-hover:text-[#15877F] transition-colors leading-snug line-clamp-2">
          {item.title}
         </h3>
         <p className="text-[12px] text-[#6B7280]">
          {isVideo ? item.videoDuration || item.readTime : item.readTime} •{' '}
          {isVideo ? 'Video Panduan' : item.author?.name || 'HealthyLife'}
         </p>
        </div>
        <div className="flex justify-end">
         <button
          onClick={(e) => removeFavorite(e, item._id)}
          aria-label="Hapus dari favorit"
          title="Hapus dari favorit"
          className="text-[#15877F] hover:text-red-500 transition-colors"
         >
          <Bookmark size={18} className="fill-current" />
         </button>
        </div>
       </Link>
      );
     })}
    </div>
   )}
   </div>
  </div>
 );
};
