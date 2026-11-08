import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
 Share2,
 Bookmark,
 CheckCircle2,
 Clock,
 Play,
 ArrowLeft,
 Check,
 Tag,
 Sparkles,
} from 'lucide-react';
import { contentService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { ContentImage } from '../components/common/ContentImage';
import { Avatar } from '../components/common/Avatar';
import { formatPublishDate } from '../utils/format';

export const ContentDetail = ({ onOpenActivityModal }) => {
 const { id } = useParams();
 const navigate = useNavigate();
 const location = useLocation();
 const { isAuthenticated } = useAuth();
 const { refresh: refreshFavorites } = useFavorites();

 const scrollRef = useRef(null);
 const [content, setContent] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [copied, setCopied] = useState(false);
 const [isFavorited, setIsFavorited] = useState(false);
 const [isPlayingVideo, setIsPlayingVideo] = useState(false);

 useEffect(() => {
  let cancelled = false;
  setLoading(true);
  setError('');
  setContent(null);
  setIsPlayingVideo(false);
  scrollRef.current?.scrollTo(0, 0);

  contentService
   .getContentById(id)
   .then((res) => {
    if (cancelled) return;
    setContent(res.data);
    setIsFavorited(!!res.data.isFavorited);
   })
   .catch((err) => {
    if (!cancelled) setError(err.response?.status === 404 ? '' : err.response?.data?.message || 'Gagal memuat konten.');
   })
   .finally(() => !cancelled && setLoading(false));

  return () => {
   cancelled = true;
  };
 }, [id]);

 const handleToggleFavorite = async () => {
  if (!isAuthenticated) {
   navigate('/login', { state: { from: location.pathname } });
   return;
  }
  try {
   const res = await favoriteService.toggleFavorite(id);
   setIsFavorited(res.isFavorited);
   refreshFavorites();
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal memperbarui favorit.');
  }
 };

 const handleShare = async () => {
  try {
   await navigator.clipboard.writeText(window.location.href);
   setCopied(true);
   setTimeout(() => setCopied(false), 2000);
  } catch {
   setError('Tautan tidak dapat disalin otomatis. Salin dari bilah alamat browser.');
  }
 };

 const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
 };

 const getStepsHeading = (category, type) => {
  if (type === 'video' || category === 'Olahraga') return 'Panduan Gerakan, Langkah demi Langkah';
  if (category === 'Nutrisi') return 'Susun piring, langkah demi langkah';
  if (category === 'Hidrasi') return 'Panduan Jadwal Minum Harian';
  if (category === 'Pola Tidur') return 'Rutinitas Tidur, Langkah demi Langkah';
  return 'Panduan Langkah demi Langkah';
 };

 const getAdviceHeading = (category) => {
  if (category === 'Nutrisi') return 'Jangan lupakan air putih';
  if (category === 'Olahraga') return 'Tips Keamanan & Pemulihan';
  if (category === 'Hidrasi') return 'Perhatikan Kebutuhan Tubuh';
  if (category === 'Pola Tidur') return 'Ciptakan Lingkungan Tidur Nyaman';
  return 'Saran & Rekomendasi Ahli';
 };

 const getRelatedTip = (category) => {
  if (category === 'Nutrisi') {
   return {
    tag: 'Tips Kebugaran Terkait',
    title: 'Kombinasikan dengan Kardio 15 Menit',
    desc: 'Setelah makan seimbang, beri jeda 1 jam sebelum melakukan peregangan atau jalan santai untuk penyerapan optimal.',
   };
  }
  if (category === 'Olahraga') {
   return {
    tag: 'Tips Nutrisi Terkait',
    title: 'Penuhi Protein Pasca-Latihan',
    desc: 'Konsumsi sumber protein dan segelas air putih dalam 30–45 menit setelah latihan untuk mempercepat pemulihan serat otot.',
   };
  }
  if (category === 'Hidrasi') {
   return {
    tag: 'Tips Olahraga Terkait',
    title: 'Hidrasi Sebelum Bergerak',
    desc: 'Minum 200–250 ml air sekitar 30 menit sebelum sesi olahraga agar elastisitas sendi terjaga dan terhindar dari kram otot.',
   };
  }
  if (category === 'Pola Tidur') {
   return {
    tag: 'Tips Relaksasi Terkait',
    title: 'Redupkan Cahaya 30 Menit Sebelum Tidur',
    desc: 'Jauhkan layar ponsel dan redupkan lampu kamar agar hormon melatonin bekerja optimal membawa Anda ke fase deep sleep.',
   };
  }
  return {
   tag: 'Tips Pola Hidup Terkait',
   title: 'Konsistensi Kebiasaan Kecil',
   desc: 'Kesehatan prima dibangun dari kebiasaan sederhana yang dilakukan berulang kali secara konsisten setiap hari.',
  };
 };

 if (loading) {
  return (
   <div className="py-20 text-center text-[13px] text-[#6B7280]">
    Memuat konten...
   </div>
  );
 }

 if (!content) {
  return (
   <div className="py-20 text-center space-y-4">
    <p className="text-[16px] font-bold text-[#111827]">{error || 'Konten tidak ditemukan'}</p>
    <Link to="/explore" className="text-[12px] font-semibold text-[#15877F] hover:underline">
     Kembali ke Jelajah Konten
    </Link>
   </div>
  );
 }

 const embedUrl = getYouTubeEmbedUrl(content.videoUrl);
 const isVideo = content.type === 'video';
 const relatedTip = getRelatedTip(content.category);
 const authorBio =
  content.author?.bio ||
  'Membantu ratusan keluarga dan individu mencapai gaya hidup aktif, bugar, dan bernutrisi seimbang secara berkelanjutan.';

 return (
  <div className="h-full flex flex-col overflow-hidden">
   {/* Pinned action bar */}
   <div className="shrink-0 px-5 md:px-8 pt-5 md:pt-7 pb-4 bg-[#F8FBFA] flex items-center justify-between">
    <button
     onClick={() => navigate('/explore')}
     className="text-[13px] font-semibold text-[#15877F] hover:underline flex items-center gap-1.5"
    >
     <ArrowLeft size={16} />
     <span>Kembali ke Jelajahi</span>
    </button>

    <div className="flex items-center gap-3">
     <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[12px] font-semibold text-[#111827] hover:bg-[#F9FAFB] shadow-sm transition-colors"
     >
      {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
      <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
     </button>

     <button
      onClick={handleToggleFavorite}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold shadow-sm transition-colors ${
       isFavorited
        ? 'bg-[#15877F] text-white hover:bg-[#106761]'
        : 'bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]'
      }`}
     >
      <Bookmark size={14} className={isFavorited ? 'fill-white' : ''} />
      <span>{isFavorited ? 'Tersimpan' : 'Simpan'}</span>
     </button>
    </div>
   </div>

   <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-6 space-y-6">
   {error && (
    <div role="alert" className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
     {error}
    </div>
   )}

   {/* Main 2-Column Content Grid */}
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    {/* Left Column: Main Article / Video Content (Figma #22:6301, width ~685px) */}
    <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
     {/* Hero Media (Image or Embedded Video Player) */}
     <div className="relative w-full bg-[#111827] overflow-hidden">
      {isVideo && isPlayingVideo && embedUrl ? (
       <div className="aspect-video w-full">
        <iframe
         src={embedUrl}
         title={content.title}
         className="w-full h-full border-0"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowFullScreen
        />
       </div>
      ) : (
       <div className="relative h-[300px] w-full group">
        <ContentImage src={content.heroImage} alt={content.title} className="w-full h-full object-cover" />
        {isVideo && (
         <div
          onClick={() => {
           if (embedUrl) {
            setIsPlayingVideo(true);
           }
          }}
          className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center cursor-pointer hover:bg-black/45 transition-colors"
         >
          <div className="w-16 h-16 rounded-full bg-white text-[#111827] flex items-center justify-center shadow-2xl pl-1 hover:scale-105 transition-transform">
           <Play size={26} className="fill-current text-[#111827]" />
          </div>
          <span className="mt-3 px-3 py-1 rounded-full bg-black/60 text-white text-[12px] font-semibold backdrop-blur-xs">
           Tonton Video ({content.videoDuration || content.readTime})
          </span>
         </div>
        )}
       </div>
      )}
     </div>

     <div className="p-8 space-y-6">
      {/* Category Pill */}
      <div className="flex items-center gap-2">
       <span className="inline-block px-3 py-1 rounded-full bg-[#E6F7F5] text-[11px] font-bold text-[#15877F]">
        {content.category}
       </span>
       {isVideo && (
        <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[11px] font-semibold text-[#4B5563]">
         Video Panduan
        </span>
       )}
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-bold text-[#111827] leading-tight tracking-tight">
       {content.title}
      </h1>

      {/* Author Meta Line */}
      <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
       <div className="flex items-center gap-1 font-medium text-[#111827]">
        <CheckCircle2 size={14} className="text-[#15877F]" />
        <span>{content.author?.name || 'Tim Ahli HealthyLife'}</span>
       </div>
       <span>•</span>
       <span>{formatPublishDate(content.createdAt)}</span>
       <span>•</span>
       <div className="flex items-center gap-1">
        <Clock size={13} />
        <span>{isVideo ? (content.videoDuration || content.readTime) : content.readTime}</span>
       </div>
      </div>

      {/* Lead / Excerpt */}
      {content.excerpt && (
       <p className="text-[15px] font-medium text-[#1F2937] leading-relaxed bg-[#FAFBFB] p-4 rounded-xl border border-[#F3F4F6]">
        {content.excerpt}
       </p>
      )}

      {/* Body Content */}
      {content.body && (
       <div className="space-y-3.5 text-[14px] text-[#374151] leading-relaxed">
        {content.body.split('\n\n').map((paragraph, idx) => (
         <p key={idx}>{paragraph}</p>
        ))}
       </div>
      )}

      {/* Steps Section */}
      {content.steps && content.steps.length > 0 && (
       <div className="space-y-3 pt-3 border-t border-[#F3F4F6]">
        <h3 className="text-[16px] font-bold text-[#111827]">
         {getStepsHeading(content.category, content.type)}
        </h3>
        <div className="space-y-2.5 text-[13px] text-[#374151] leading-relaxed">
         {content.steps.map((st, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
           <span className="w-1.5 h-1.5 rounded-full bg-[#15877F] mt-2 shrink-0" />
           <p>
            <strong className="font-bold text-[#111827]">{st.title}:</strong>{' '}
            <span>{st.description}</span>
           </p>
          </div>
         ))}
        </div>
       </div>
      )}

      {/* Highlighted Quote Box */}
      {content.quote && (
       <div className="p-5 rounded-xl bg-[#E6F7F5] border-l-4 border-[#15877F] my-4">
        <p className="text-[13px] font-semibold text-[#15877F] italic leading-relaxed">
         {content.quote}
        </p>
       </div>
      )}

      {/* Advice / Expert Tips */}
      {content.advice && (
       <div className="space-y-1.5 pt-2">
        <h3 className="text-[15px] font-bold text-[#111827]">
         {getAdviceHeading(content.category)}
        </h3>
        <p className="text-[13px] text-[#374151] leading-relaxed">
         {content.advice}
        </p>
       </div>
      )}

      {/* Tags Pills */}
      {content.tags && content.tags.length > 0 && (
       <div className="pt-2 flex flex-wrap items-center gap-1.5">
        {content.tags.map((t, idx) => (
         <span
          key={idx}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[11px] text-[#6B7280]"
         >
          <Tag size={10} />
          <span>{t}</span>
         </span>
        ))}
       </div>
      )}

      {/* CTA Button: Catat aktivitas ke tracker */}
      <div className="pt-4 border-t border-[#F3F4F6]">
       <button
        onClick={onOpenActivityModal}
        className="w-full py-3.5 px-4 rounded-xl bg-[#15877F] hover:bg-[#106761] text-white font-bold text-[13px] tracking-wide transition-all duration-150 text-center shadow-sm"
       >
        Catat aktivitas ke tracker
       </button>
      </div>
     </div>
    </div>

    {/* Right Column: Author Bio & Related Cards (Figma #22:6321, width ~355px) */}
    <div className="lg:col-span-4 lg:sticky lg:top-0 space-y-6">
     {/* Author Bio Card */}
     <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3.5">
       <Avatar src={content.author?.avatar} name={content.author?.name} className="w-12 h-12 text-[16px]" />
       <div className="min-w-0">
        <h4 className="text-[14px] font-bold text-[#111827] truncate">
         {content.author?.name || 'Tim Ahli HealthyLife'}
        </h4>
        <p className="text-[11px] text-[#6B7280] truncate">
         {content.author?.role || 'Spesialis Kesehatan & Kebugaran'}
        </p>
       </div>
      </div>
      <p className="text-[12px] text-[#6B7280] leading-relaxed">
       {authorBio}
      </p>
     </div>

     {/* Related Guides / Content ("Panduan Terkait" - Figma #22:6331) */}
     {content.related && content.related.length > 0 && (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3.5">
       <h3 className="text-[14px] font-bold text-[#111827]">
        Panduan Terkait
       </h3>
       <div className="space-y-3">
        {content.related.map((rel) => (
         <Link
          key={rel._id}
          to={`/content/${rel._id}`}
          className="flex gap-3 group items-center p-1.5 -mx-1.5 rounded-xl hover:bg-[#F9FAFB] transition-colors"
         >
          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-[#FAFBFB] shrink-0 border border-[#E5E7EB]">
           <ContentImage src={rel.heroImage} alt={rel.title} className="w-full h-full object-cover" />
           {rel.type === 'video' && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
             <Play size={12} className="fill-white text-white" />
            </div>
           )}
          </div>
          <div className="flex-1 min-w-0">
           <h5 className="text-[12px] font-semibold text-[#111827] group-hover:text-[#15877F] transition-colors line-clamp-1">
            {rel.title}
           </h5>
           <p className="text-[10px] text-[#6B7280] mt-0.5">
            {rel.type === 'video'
             ? `${rel.videoDuration || rel.readTime} • Video ${rel.category}`
             : `${rel.readTime} • Artikel ${rel.category}`}
           </p>
          </div>
         </Link>
        ))}
       </div>
      </div>
     )}

     {/* Contextual Tips Card */}
     <div className="bg-gradient-to-br from-[#E6F7F5] to-[#F1FBF5] border border-[#D4EFEB] rounded-2xl p-5 space-y-2">
      <span className="text-[11px] font-bold text-[#15877F] uppercase tracking-wide flex items-center gap-1.5">
       <Sparkles size={13} />
       <span>{relatedTip.tag}</span>
      </span>
      <h4 className="text-[14px] font-bold text-[#111827]">
       {relatedTip.title}
      </h4>
      <p className="text-[12px] text-[#6B7280] leading-relaxed">
       {relatedTip.desc}
      </p>
     </div>
    </div>
   </div>
   </div>
  </div>
 );
};
