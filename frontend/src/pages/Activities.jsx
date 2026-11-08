import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, Dumbbell, Apple, Droplet } from 'lucide-react';
import { activityService } from '../services/api';
import { formatDate, formatTime, formatNumber, relativeDay, activityDetail } from '../utils/format';

const ACTIVE_MINUTES_GOAL = 30;

const CATEGORY_STYLE = {
 Olahraga: { icon: Dumbbell, badge: 'bg-[#E6F7F5] text-[#15877F]', icon_bg: 'bg-[#E6F7F5] text-[#15877F]' },
 Nutrisi: { icon: Apple, badge: 'bg-[#FEF3C7] text-[#B45309]', icon_bg: 'bg-[#FEF3C7] text-[#B45309]' },
 Hidrasi: { icon: Droplet, badge: 'bg-[#E0F2FE] text-[#0369A1]', icon_bg: 'bg-[#E0F2FE] text-[#0369A1]' },
 Langkah: { icon: Dumbbell, badge: 'bg-[#E6F7F5] text-[#15877F]', icon_bg: 'bg-[#E6F7F5] text-[#15877F]' },
};

const amountLabel = (a) => {
 if (a.category === 'Hidrasi') return `${formatNumber(a.amountMl)} ml`;
 return `${formatNumber(a.calories)} kkal`;
};

const ActivityRow = ({ act, showDay, onDelete }) => {
 const style = CATEGORY_STYLE[act.category] || CATEGORY_STYLE.Olahraga;
 const Icon = style.icon;
 return (
  <tr className="hover:bg-[#FAFBFB] transition-colors">
   <td className="py-3.5 px-5">
    <div className="flex items-center gap-3">
     <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.icon_bg}`}>
      <Icon size={16} />
     </div>
     <div className="min-w-0">
      <div className="font-bold text-[13px] text-[#111827] truncate">{act.title}</div>
      <div className="text-[11px] text-[#6B7280] truncate">{act.notes || activityDetail(act)}</div>
     </div>
    </div>
   </td>
   <td className="py-3.5 px-5 text-[#111827] whitespace-nowrap">
    {showDay && <span className="text-[#6B7280]">{relativeDay(act.date)} · </span>}
    {formatTime(act.date)}
   </td>
   <td className="py-3.5 px-5 font-bold text-[#15877F] whitespace-nowrap">{amountLabel(act)}</td>
   <td className="py-3.5 px-5">
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${style.badge}`}>{act.category}</span>
   </td>
   <td className="py-3.5 px-3 text-right">
    <button
     onClick={() => onDelete(act._id)}
     aria-label={`Hapus ${act.title}`}
     className="text-[#9CA3AF] hover:text-red-500 p-1"
    >
     <Trash2 size={14} />
    </button>
   </td>
  </tr>
 );
};

const ActivityTable = ({ activities, showDay, emptyText, onDelete }) => (
 <div className="overflow-x-auto">
  <table className="w-full text-left text-[12px]">
   <thead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider">
    <tr>
     <th className="py-2 px-5">Aktivitas</th>
     <th className="py-2 px-5">Waktu</th>
     <th className="py-2 px-5">Jumlah</th>
     <th className="py-2 px-5">Kategori</th>
     <th className="py-2 px-3" />
    </tr>
   </thead>
   <tbody className="divide-y divide-[#F3F4F6]">
    {activities.length === 0 ? (
     <tr>
      <td colSpan={5} className="py-10 text-center text-[#6B7280]">
       {emptyText}
      </td>
     </tr>
    ) : (
     activities.map((act) => <ActivityRow key={act._id} act={act} showDay={showDay} onDelete={onDelete} />)
    )}
   </tbody>
  </table>
 </div>
);

export const Activities = ({ onOpenActivityModal, refreshKey }) => {
 const [summary, setSummary] = useState(null);
 const [earlier, setEarlier] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 const load = useCallback(async () => {
  try {
   setError('');
   const [sumRes, actRes] = await Promise.all([
    activityService.getSummary(),
    activityService.getActivities({ limit: 30 }),
   ]);
   setSummary(sumRes.data);
   const todayIds = new Set(sumRes.data.todayActivities.map((a) => a._id));
   setEarlier(actRes.data.filter((a) => !todayIds.has(a._id)));
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal memuat aktivitas.');
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  load();
 }, [load, refreshKey]);

 const handleDelete = async (id) => {
  if (!window.confirm('Hapus catatan aktivitas ini?')) return;
  try {
   await activityService.deleteActivity(id);
   await load();
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal menghapus aktivitas.');
  }
 };

 const handleAddWater = async () => {
  try {
   await activityService.updateWater(250);
   await load();
  } catch (err) {
   setError(err.response?.data?.message || 'Gagal menambah asupan air.');
  }
 };

 const today = summary?.today;
 const stepPct = today ? Math.min(100, (today.steps / today.targetSteps) * 100) : 0;
 const glassesLeft = today ? Math.max(0, Math.ceil((today.targetWaterMl - today.waterMl) / 250)) : 0;
 const streak = summary?.streak || 0;

 return (
  <div className="h-full flex flex-col overflow-hidden">
   <div className="shrink-0 px-5 md:px-8 pt-5 md:pt-7 pb-4 bg-[#F8FBFA] space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
     <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Dashboard Aktivitas</h1>
     <p className="text-[13px] text-[#6B7280] mt-0.5">
      {formatDate(new Date(), 'long')} • Pantau kemajuan pola hidup sehatmu.
     </p>
    </div>
    <button
     onClick={onOpenActivityModal}
     className="h-11 px-6 rounded-xl bg-[#15877F] hover:bg-[#106761] text-white text-[13px] font-bold shadow-sm transition-all active:scale-95"
    >
     + Catat Aktivitas
    </button>
   </div>

   {summary?.weekStrip && (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-sm overflow-x-auto">
       <div className="grid grid-cols-7 gap-2 min-w-[560px]">
        {summary.weekStrip.map((d) => (
         <div
          key={d.date}
          className={`py-2.5 px-2 rounded-xl flex flex-col items-center justify-center ${
           d.isToday
            ? 'bg-[#15877F] text-white'
            : d.isFuture
             ? 'bg-[#FAFBFB] text-[#9CA3AF]'
             : 'bg-[#FAFBFB] text-[#6B7280]'
          }`}
         >
          <span className="text-[11px] font-semibold">{d.isToday ? `${d.dayName} (Hari Ini)` : d.dayName}</span>
          <span className={`text-[16px] font-bold mt-0.5 ${d.isToday ? 'text-white' : d.isFuture ? 'text-[#9CA3AF]' : 'text-[#111827]'}`}>
           {d.dayNumber}
          </span>
          <span
           className={`mt-1 w-1.5 h-1.5 rounded-full ${
            d.hasActivity ? (d.isToday ? 'bg-white' : 'bg-[#27C5B8]') : 'bg-transparent'
           }`}
          />
         </div>
        ))}
       </div>
      </div>

   )}
   </div>

   <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-6 space-y-6">
   {error && (
    <div role="alert" className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
     {error}
    </div>
   )}

   {loading ? (
    <div className="py-24 text-center text-[13px] text-[#6B7280]">Memuat aktivitas...</div>
   ) : (
    !!today && (
     <>
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Langkah Hari Ini</p>
        <p className="text-[28px] font-bold text-[#111827] leading-none">
         {formatNumber(today.steps)}{' '}
         <span className="text-[13px] font-normal text-[#6B7280]">/ {formatNumber(today.targetSteps)}</span>
        </p>
        <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
         <div className="h-full bg-[#15877F] rounded-full" style={{ width: `${stepPct}%` }} />
        </div>
        <p className="text-[11px] font-bold text-[#15877F]">{stepPct.toFixed(1).replace('.0', '')}% tercapai</p>
       </div>

       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Kalori Terbakar</p>
        <p className="text-[28px] font-bold text-[#111827] leading-none">
         {formatNumber(today.caloriesBurned)} <span className="text-[13px] font-normal text-[#6B7280]">kkal</span>
        </p>
        <p className="text-[12px] text-[#6B7280]">Target harian {formatNumber(today.targetCalories)} kkal</p>
        {summary.comparison?.caloriesPct != null && (
         <p className={`text-[11px] font-bold ${summary.comparison.caloriesPct >= 0 ? 'text-[#D97706]' : 'text-[#6B7280]'}`}>
          {summary.comparison.caloriesPct >= 0 ? '+' : ''}
          {summary.comparison.caloriesPct}% dari kemarin
         </p>
        )}
       </div>

       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Asupan Air Minum</p>
        <p className="text-[28px] font-bold text-[#111827] leading-none">
         {(today.waterMl / 1000).toFixed(1)}{' '}
         <span className="text-[13px] font-normal text-[#6B7280]">/ {(today.targetWaterMl / 1000).toFixed(1)} Liter</span>
        </p>
        <div className="flex items-center gap-3 pt-1">
         <button
          onClick={handleAddWater}
          className="px-3 py-1.5 rounded-lg bg-[#E6F7F5] hover:bg-[#D4EFEB] text-[#15877F] text-[11px] font-bold transition-colors"
         >
          +250ml
         </button>
         <span className="text-[11px] text-[#6B7280]">
          {glassesLeft > 0 ? `Tersisa ${glassesLeft} gelas` : 'Target tercapai'}
         </span>
        </div>
       </div>

       <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-2">
        <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Waktu Aktif Fisik</p>
        <p className="text-[28px] font-bold text-[#111827] leading-none">
         {today.activeMinutes} <span className="text-[13px] font-normal text-[#6B7280]">menit</span>
        </p>
        <p className="text-[12px] text-[#6B7280]">Target: {ACTIVE_MINUTES_GOAL} mnt</p>
        <p className="text-[11px] font-bold text-[#15877F]">
         {today.activeMinutes >= ACTIVE_MINUTES_GOAL ? 'Terus bergerak!' : 'Ayo bergerak sebentar lagi'}
        </p>
       </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
       <div className="xl:col-span-8 space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
         <div className="p-5 pb-2 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111827]">Riwayat Aktivitas Hari Ini</h2>
          <span className="text-[11px] font-semibold text-[#15877F]">
           {summary.todayActivities.length} kegiatan tercatat
          </span>
         </div>
         <ActivityTable
          activities={summary.todayActivities}
          emptyText="Belum ada aktivitas tercatat hari ini. Tekan “+ Catat Aktivitas” untuk menambahkan."
          onDelete={handleDelete}
         />
        </div>

        {earlier.length > 0 && (
         <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 pb-2">
           <h2 className="text-[16px] font-bold text-[#111827]">Aktivitas Sebelumnya</h2>
          </div>
          <ActivityTable activities={earlier} showDay onDelete={handleDelete} />
         </div>
        )}
       </div>

       <div className="xl:col-span-4 space-y-5">
        <div className="bg-[#17504B] rounded-2xl p-6 text-white space-y-3">
         <span className="inline-block px-2.5 py-1 rounded-md bg-white/15 text-[10px] font-bold tracking-wider">
          STREAK SEHAT
         </span>
         <h3 className="text-[26px] font-bold leading-tight">
          {streak > 0 ? `${streak} Hari Berturut!` : 'Mulai streak-mu!'}
         </h3>
         <p className="text-[12px] text-white/85 leading-relaxed">
          {streak > 0
           ? 'Konsistensi luar biasa! Kamu aktif mencatat kegiatan sehat setiap hari. Pertahankan ritmenya.'
           : 'Catat satu aktivitas hari ini untuk memulai rangkaian hari sehatmu.'}
         </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-3">
         <h3 className="text-[15px] font-bold text-[#111827]">Tips Hidrasi Sore</h3>
         <p className="text-[12px] text-[#6B7280] leading-relaxed">
          Minum segelas air 30 menit sebelum makan malam untuk membantu proses pencernaan dan mencegah makan berlebih.
         </p>
         <div className="pt-3 border-t border-[#F3F4F6]">
          <p className="text-[12px] font-bold text-[#15877F]">Target berikutnya:</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5">Jalan santai 15 menit malam ini.</p>
         </div>
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
