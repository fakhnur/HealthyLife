import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Activity,
  Bookmark,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { Avatar } from './Avatar';
import { useFavorites } from '../../context/FavoritesContext';

export const Sidebar = () => {
  const { count: favoritesCount } = useFavorites();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Jelajah Konten', icon: Compass },
    { to: '/activities', label: 'Riwayat Aktivitas', icon: Activity },
    { to: '/favorites', label: 'Favorit', icon: Bookmark, badge: favoritesCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col h-full justify-between shrink-0 overflow-y-auto">
      {/* Top Part: Brand + Menu */}
      <div>
        {/* Brand Header with official SVG logo */}
        <div className="h-[76px] flex items-center px-6 gap-3">
          <BrandLogo size={38} />
          <div>
            <span className="font-bold text-[17px] text-[#111827] tracking-tight block">
              HealthyLife
            </span>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="px-4 py-6">
          <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-3 mb-2.5">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'bg-[#E6F7F5] text-[#15877F]'
                        : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#15877F] rounded-r" />
                      )}
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={isActive ? 'text-[#15877F]' : 'text-[#6B7280] group-hover:text-[#111827]'}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-[#15877F] text-white'
                              : 'bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#E5E7EB]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Part: Membership and Account */}
      <div className="p-4 border-t border-[#E5E7EB] space-y-3 bg-[#FCFDFD]">
        {/* Wellness Reminder Box */}
        <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
          <div className="flex items-center gap-1.5 text-[#15877F]">
            <Sparkles size={14} />
            <span className="text-[11px] font-bold">Sehat dimulai dari hal kecil.</span>
          </div>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Satu langkah baik hari ini, untuk dirimu esok hari.
          </p>
        </div>

        {/* User Card */}
        {isAuthenticated ? (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={user?.avatar} name={user?.name} className="w-9 h-9 text-[12px]" />
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#111827] truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            <NavLink
              to="/login"
              className="block w-full py-2 text-center text-xs font-bold text-white bg-[#27C5B8] hover:bg-[#15877F] rounded-xl transition-colors shadow-xs"
            >
              Masuk Akun
            </NavLink>
            <NavLink
              to="/register"
              className="block w-full py-1.5 text-center text-[11px] font-medium text-[#6B7280] hover:text-[#111827]"
            >
              Daftar Akun Baru
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
