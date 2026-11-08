import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { RequireAuth, RedirectIfAuth } from './components/common/RequireAuth';
import { Sidebar } from './components/common/Sidebar';
import { BrandLogo } from './components/common/BrandLogo';
import { ActivityModal } from './components/activity/ActivityModal';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { ContentDetail } from './pages/ContentDetail';
import { Favorites } from './pages/Favorites';
import { Activities } from './pages/Activities';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F8FBFA] flex font-sans">
      {/* Desktop sidebar: flush left, full viewport height, never scrolls with content */}
      <div className="hidden md:flex shrink-0 w-[260px] h-full">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-[260px] h-full bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="md:hidden h-14 shrink-0 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 text-[#111827] rounded-lg hover:bg-[#F3F4F6]"
            aria-label="Buka menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2 font-bold text-[16px] text-[#111827]">
            <BrandLogo size={26} />
            HealthyLife
          </div>
          <div className="w-9" />
        </div>

        {/* Each page owns its fixed header and internal scroll area */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AppContent = () => {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);

  const openModal = () => setIsActivityModalOpen(true);
  const closeModal = useCallback(() => setIsActivityModalOpen(false), []);
  const handleLogged = useCallback(() => setActivityRefreshKey((k) => k + 1), []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard refreshKey={activityRefreshKey} onOpenActivityModal={openModal} />
              </RequireAuth>
            }
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/content/:id" element={<ContentDetail onOpenActivityModal={openModal} />} />
          <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
          <Route
            path="/activities"
            element={
              <RequireAuth>
                <Activities refreshKey={activityRefreshKey} onOpenActivityModal={openModal} />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={closeModal}
        onActivityLogged={handleLogged}
      />
    </BrowserRouter>
  );
};

export const App = () => (
  <AuthProvider>
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  </AuthProvider>
);

export default App;
