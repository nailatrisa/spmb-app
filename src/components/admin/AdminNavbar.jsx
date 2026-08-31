import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  Activity,
  LogOut,
  School,
  Menu,
  X,
  Home,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const AdminNavbar = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun administrator?')) {
      try {
        const { error } = await logout();
        if (!error) {
          navigate('/admin/login');
        } else {
          alert('Gagal logout: ' + error.message);
        }
      } catch (err) {
        alert('Terjadi kesalahan saat logout.');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.profile?.full_name || user?.email?.split('@')[0] || 'Administrator';
  const userRole = user?.profile?.role || 'Admin SPMB';

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return [{ label: 'Dashboard', path: '/admin/dashboard', isLast: true }];
    const breadcrumbs = [];
    let currentPath = '';
    segments.forEach((seg, index) => {
      currentPath += '/' + seg;
      const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      breadcrumbs.push({
        label: index === 0 && seg === 'admin' ? 'Dashboard' : label,
        path: currentPath,
        isLast: index === segments.length - 1,
      });
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-soft">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Kiri: Logo + Hamburger */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-navy-600"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-1.5 rounded-lg shadow-md">
              <School className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-navy-900 text-sm tracking-tight">
                SPMB<span className="text-primary-600">.</span>
              </span>
              <p className="text-[10px] text-navy-400 leading-none font-medium">
                Sistem Penerimaan Murid Baru
              </p>
            </div>
          </Link>
        </div>

        {/* Tengah: Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <Home className="h-3.5 w-3.5 text-navy-400" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-navy-300 text-xs">/</span>}
              {crumb.isLast ? (
                <span className="font-medium text-navy-700 text-xs">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-navy-500 hover:text-primary-600 text-xs transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Kanan: Status, Notifikasi, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Status SPMB */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700">SPMB Aktif</span>
          </div>

          {/* Tanggal & Jam */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-navy-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span>{format(new Date(), 'EEEE, d MMM yyyy', { locale: id })}</span>
            <span className="w-px h-3 bg-slate-200" />
            <span className="font-mono">{format(new Date(), 'HH:mm')}</span>
          </div>

          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-navy-500 hover:text-navy-700 hover:bg-slate-100 rounded-full h-9 w-9"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h4 className="font-semibold text-navy-800 text-sm">Notifikasi</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                    <p className="text-sm text-navy-700">📄 Pendaftar baru masuk</p>
                    <p className="text-xs text-navy-400">2 menit lalu</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                    <p className="text-sm text-navy-700">📋 Dokumen perlu diverifikasi</p>
                    <p className="text-xs text-navy-400">15 menit lalu</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <p className="text-sm text-navy-700">🎯 Kuota TKJ hampir penuh</p>
                    <p className="text-xs text-navy-400">1 jam lalu</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <Link to="/admin/notifications" className="text-xs text-primary-600 hover:underline font-medium">
                    Lihat semua notifikasi
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bantuan */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-navy-500 hover:text-navy-700 hover:bg-slate-100 rounded-full h-9 w-9"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 hover:bg-slate-50 rounded-lg px-2.5 py-1.5 transition-colors border border-transparent hover:border-slate-200"
            >
              <Avatar className="h-8 w-8 border-2 border-primary-100">
                <AvatarFallback className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 text-xs font-bold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-navy-800 leading-tight">{displayName}</p>
                <p className="text-[10px] text-navy-400 leading-tight">{userRole}</p>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-navy-400 transition-transform duration-200",
                isProfileOpen && "rotate-180"
              )} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-semibold text-navy-800 text-sm">{displayName}</p>
                  <p className="text-xs text-navy-500">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] bg-primary-50 text-primary-700 border-primary-200">
                    {userRole}
                  </Badge>
                </div>
                <div className="py-1">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profil Saya
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </Link>
                  <Link
                    to="/admin/audit-log"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Activity className="h-4 w-4" />
                    Aktivitas Saya
                  </Link>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;