import React, { useState, useEffect } from 'react';
import { X, Dumbbell, Apple, Droplet, Loader2 } from 'lucide-react';
import { activityService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Olahraga', icon: Dumbbell, placeholder: 'Contoh: Jalan pagi, Yoga 15 mnt', defaults: { durationMinutes: '30', calories: '120' } },
  { name: 'Nutrisi', icon: Apple, placeholder: 'Contoh: Makan salad buah', defaults: { calories: '250' } },
  { name: 'Hidrasi', icon: Droplet, placeholder: 'Contoh: Segelas air putih', defaults: { amountMl: '250' } },
];

const EMPTY = { title: '', durationMinutes: '', calories: '', amountMl: '', notes: '' };

const inputCls =
  'w-full px-3.5 py-2.5 text-sm bg-hl-surface border border-hl-border rounded-xl focus:outline-none focus:ring-2 focus:ring-hl-teal/40 focus:border-hl-teal text-hl-dark placeholder:text-hl-muted/70';

export const ActivityModal = ({ isOpen, onClose, onActivityLogged }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState('Olahraga');
  const [form, setForm] = useState({ ...EMPTY, ...CATEGORIES[0].defaults });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = CATEGORIES.find((c) => c.name === category);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectCategory = (c) => {
    setCategory(c.name);
    setForm((f) => ({ ...EMPTY, title: f.title, notes: f.notes, ...c.defaults }));
  };

  // Always start a fresh, valid form when the dialog opens; Esc closes it.
  useEffect(() => {
    if (!isOpen) return undefined;
    setCategory('Olahraga');
    setForm({ ...EMPTY, ...CATEGORIES[0].defaults });
    setError('');
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      onClose();
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (!form.title.trim()) {
      setError('Mohon masukkan nama aktivitas.');
      return;
    }

    const payload = { title: form.title.trim(), category, notes: form.notes.trim() };
    if (category === 'Olahraga') {
      payload.durationMinutes = parseInt(form.durationMinutes, 10) || 0;
      payload.calories = parseInt(form.calories, 10) || 0;
    } else if (category === 'Nutrisi') {
      payload.calories = parseInt(form.calories, 10) || 0;
    } else {
      payload.amountMl = parseInt(form.amountMl, 10) || 0;
    }

    try {
      setLoading(true);
      await activityService.createActivity(payload);
      onActivityLogged?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan aktivitas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hl-dark/50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
        className="bg-white rounded-2xl w-full max-w-lg border border-hl-border shadow-2xl overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hl-border">
          <div>
            <h3 id="activity-modal-title" className="font-bold text-lg text-hl-dark">Catat Aktivitas</h3>
            <p className="text-xs text-hl-muted">Simpan progres gaya hidup sehatmu hari ini</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-hl-mint-light hover:bg-hl-mint flex items-center justify-center text-hl-muted hover:text-hl-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700">{error}</div>
          )}

          <div>
            <span className="block text-xs font-semibold text-hl-dark mb-2">Kategori</span>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectCategory(c)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-hl-teal text-white border-hl-teal'
                        : 'bg-hl-surface text-hl-muted border-hl-border hover:bg-hl-mint-light hover:text-hl-dark'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-hl-dark mb-1.5">
              Nama Aktivitas <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              required
              autoFocus
              value={form.title}
              onChange={set('title')}
              placeholder={config.placeholder}
              className={inputCls}
            />
          </label>

          {category === 'Olahraga' && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-hl-dark mb-1.5">Durasi (menit)</span>
                <input type="number" min="0" value={form.durationMinutes} onChange={set('durationMinutes')} className={inputCls} />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-hl-dark mb-1.5">Kalori terbakar (kkal)</span>
                <input type="number" min="0" value={form.calories} onChange={set('calories')} className={inputCls} />
              </label>
            </div>
          )}

          {category === 'Nutrisi' && (
            <label className="block">
              <span className="block text-xs font-semibold text-hl-dark mb-1.5">Kalori asupan (kkal)</span>
              <input type="number" min="0" value={form.calories} onChange={set('calories')} className={inputCls} />
            </label>
          )}

          {category === 'Hidrasi' && (
            <label className="block">
              <span className="block text-xs font-semibold text-hl-dark mb-1.5">Jumlah air (ml)</span>
              <input type="number" min="0" step="50" value={form.amountMl} onChange={set('amountMl')} className={inputCls} />
            </label>
          )}

          <label className="block">
            <span className="block text-xs font-semibold text-hl-dark mb-1.5">Catatan (opsional)</span>
            <textarea
              rows={2}
              value={form.notes}
              onChange={set('notes')}
              placeholder="Catatan tambahan perasaan atau rute aktivitas..."
              className={`${inputCls} resize-none`}
            />
          </label>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-hl-muted hover:text-hl-dark hover:bg-hl-mint-light transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-hl-teal hover:bg-hl-teal-deep text-white font-semibold text-xs tracking-wide transition-all disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Simpan ke Riwayat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
