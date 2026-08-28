import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AdminNavbar = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun administrator?')) {
      const { error } = await logout();
      if (!error) {
        navigate('/admin/login');
      } else {
        alert('Gagal logout: ' + error.message);
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

  const displayName = user?.profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const userRole = user?.profile?.role || 'Admin SPMB';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-soft">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Kiri: Logo */}
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

        {/* Kanan: Profile + Logout */}
        <div className="flex items-center gap-3">
          {/* Status SPMB */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700">SPMB Aktif</span>
          </div>

          {/* Tanggal */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-navy-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span>{format(new Date(), 'EEEE, d MMM yyyy', { locale: id })}</span>
            <span className="w-px h-3 bg-slate-200" />
            <span className="font-mono">{format(new Date(), 'HH:mm')}</span>
          </div>

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
              <ChevronDown className="h-4 w-4 text-navy-400" />
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
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