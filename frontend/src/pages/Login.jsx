import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Mohon masukkan email dan kata sandi.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password, rememberMe);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau kata sandi yang Anda masukkan salah.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('budi@healthylife.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex items-center justify-center p-0">
      <div className="w-full min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Editorial Section (Figma #22:6478 with transparent gradient overlay) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-neutral-900 overflow-hidden flex-col justify-between p-16 text-white">
          {/* Background hero image */}
          <img
            src="/figma/login-hero.png"
            alt="Healthy lifestyle"
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
            {/* SENANG BERTEMU LAGI badge */}
            <div className="inline-block px-3.5 py-1.5 rounded-lg bg-black/35 backdrop-blur-md border border-white/20">
              <span className="text-[11px] font-bold text-[#27C5B8] tracking-widest uppercase">
                SENANG BERTEMU LAGI
              </span>
            </div>

            <h1 className="text-[40px] font-bold leading-tight tracking-tight text-white drop-shadow-md">
              Selamat Datang<br />Kembali
            </h1>

            <p className="text-[14px] text-white/90 leading-relaxed drop-shadow-sm">
              Lanjutkan langkah sehatmu hari ini. Catat kemajuan dan tetap konsisten!
            </p>

            {/* 3 Bullet pills */}
            <div className="flex items-center gap-6 pt-2 text-[12px] text-white/95 font-medium drop-shadow-sm">
              <span>• 8.750 Target Langkah</span>
              <span>• 1.8L Target Hidrasi</span>
              <span>• 45 Mnt Aktif</span>
            </div>
          </div>
        </div>

        {/* Right Form Section (Figma #22:6502) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-16 py-12 bg-white">
          <div className="max-w-[400px] w-full mx-auto space-y-6">
            <div>
              <h2 className="text-[26px] font-bold text-[#111827] tracking-tight">
                Masuk ke Akun Anda
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-1.5">
                Masukkan email dan kata sandi yang telah terdaftar.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-[12px] bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {/* Evaluator Quick Demo Fill Pill */}
            <div className="p-3.5 rounded-xl bg-[#E6F7F5] border border-[#27C5B8]/40 flex items-center justify-between gap-3 shadow-xs">
              <div className="text-[11px] text-[#111827]">
                <span className="font-bold block text-[#15877F]">Akun Pengujian Evaluasi:</span>
                <span className="text-[#6B7280]">budi@healthylife.com</span>
              </div>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="px-3.5 py-1.5 bg-[#27C5B8] hover:bg-[#15877F] rounded-lg text-[11px] font-bold text-white transition-colors shrink-0 shadow-xs"
              >
                Isi Otomatis
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Alamat Email */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              {/* Kata Sandi */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-[#374151]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-4 py-3 pr-10 text-[13px] bg-[#FAFBFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27C5B8]/40 focus:border-[#27C5B8] text-[#111827] placeholder:text-[#9CA3AF] transition-all"
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

              {/* Ingat saya & Lupa kata sandi */}
              <div className="flex items-center justify-between text-[12px]">
                <label className="flex items-center gap-2 cursor-pointer text-[#6B7280]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#27C5B8] focus:ring-[#27C5B8]"
                  />
                  <span>Ingat saya</span>
                </label>
                <span className="text-[#15877F] font-semibold hover:underline cursor-pointer">
                  Lupa kata sandi?
                </span>
              </div>

              {/* Submit Button (Figma "Masuk") */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#15877F] hover:bg-[#106761] text-white font-bold text-[14px] shadow-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Masuk</span>}
              </button>
            </form>

            {/* Belum punya akun? Daftar */}
            <p className="text-center text-[12px] text-[#6B7280] pt-2">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold text-[#15877F] hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
