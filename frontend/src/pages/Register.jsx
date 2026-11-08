import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Mohon lengkapi semua kolom pendaftaran.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    if (!agreed) {
      setError('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex items-center justify-center p-0">
      <div className="w-full min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Editorial Section (Figma #22:6529 with transparent gradient overlay) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-neutral-900 overflow-hidden flex-col justify-between p-16 text-white">
          <img
            src="/figma/register-hero.png"
            alt="Healthy life register"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          {/* Transparent soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#183D3A]/85 via-[#183D3A]/30 to-black/15 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3.5">
            <BrandLogo size={44} />
            <div>
              <span className="font-bold text-[22px] tracking-tight block text-white drop-shadow-sm">
                HealthyLife
              </span>
            </div>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-10 space-y-5 max-w-xl">
            {/* GAYA HIDUP SEHAT badge */}
            <div className="inline-block px-3.5 py-1.5 rounded-lg bg-black/35 backdrop-blur-md border border-white/20">
              <span className="text-[11px] font-bold text-[#27C5B8] tracking-widest uppercase">
                GAYA HIDUP SEHAT
              </span>
            </div>

            <h1 className="text-[38px] font-bold leading-tight tracking-tight text-white drop-shadow-md">
              Mulai Langkah Sehatmu<br />Hari Ini Bersama Kami
            </h1>

            <p className="text-[14px] text-white/90 leading-relaxed drop-shadow-sm">
              “Bukan soal makan sempurna, tetapi kebiasaan baik yang bisa kamu ulangi”
            </p>

            {/* 3 Bullet pills */}
            <div className="flex items-center gap-6 pt-2 text-[12px] text-white/95 font-medium drop-shadow-sm">
              <span>• Pemantauan Nutrisi</span>
              <span>• Tracker Aktivitas</span>
              <span>• Edukasi Ahli Gizi</span>
            </div>
          </div>
        </div>

        {/* Right Form Section (Figma #22:6542) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-16 py-10 bg-white">
          <div className="max-w-[400px] w-full mx-auto space-y-5">
            <div>
              <h2 className="text-[26px] font-bold text-[#111827] tracking-tight">
                Daftar Akun Baru
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-1">
                Lengkapi data diri untuk memulai gaya hidup sehat.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2.5 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              {/* Alamat Email */}
              <div className="space-y-1">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              {/* Kata Sandi */}
              <div className="space-y-1">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 pr-10 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div className="space-y-1">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan ulang kata sandi"
                  className="w-full px-4 py-2.5 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-2 pt-1 text-[11px] text-[#6B7280] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#27C5B8] focus:ring-[#27C5B8]"
                />
                <span>
                  Saya menyetujui <span className="text-[#15877F] font-bold">Syarat & Ketentuan</span> serta{' '}
                  <span className="text-[#15877F] font-bold">Kebijakan Privasi</span>.
                </span>
              </label>

              {/* Submit Button (Figma "Daftar Akun") */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#15877F] hover:bg-[#106761] text-white font-bold text-[14px] shadow-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Daftar Akun</span>}
              </button>
            </form>

            <p className="text-center text-[12px] text-[#6B7280] pt-1">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-bold text-[#15877F] hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
