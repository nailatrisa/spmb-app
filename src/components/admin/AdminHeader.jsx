import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  School,
  Menu,
  X,
  HelpCircle,
  Home,
  ChevronRight,
  Calendar,
  Users,
  FileCheck,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  BookOpen,
  BarChart3,
  Megaphone,
  Database,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Mapping route ke breadcrumb
const breadcrumbMap = {
  '/admin/dashboard': ['Dashboard'],
  '/admin/applicants': ['Penerimaan', 'Data Pendaftar'],
  '/admin/applicants/:id': ['Penerimaan', 'Data Pendaftar', 'Detail'],
  '/admin/verification': ['Penerimaan', 'Verifikasi Berkas'],
  '/admin/selection': ['Penerimaan', 'Seleksi'],
  '/admin/accepted': ['Penerimaan', 'Diterima'],
  '/admin/rejected': ['Penerimaan', 'Ditolak'],
  '/admin/reserves': ['Penerimaan', 'Cadangan'],
  '/admin/departments': ['Pengaturan', 'Jurusan'],
  '/admin/statistics': ['Laporan', 'Statistik'],
  '/admin/announcements': ['Konten', 'Pengumuman'],
  '/admin/settings': ['Sistem', 'Pengaturan'],
  '/admin/audit-log': ['Sistem', 'Audit Log'],
  '/admin/users': ['Sistem', 'User Admin'],
  '/admin/export': ['Laporan', 'Export Data'],
};

const AdminHeader = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [greeting, setGreeting] = useState('Selamat Datang');
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const statusRef = useRef(null);

  // Ambil data sekolah untuk status periode
  useEffect(() => {
    const fetchSchoolSettings = async () => {
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        setSchoolSettings(data);
      }
    };
    fetchSchoolSettings();
  }, []);

  // Set greeting berdasarkan waktu
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 18) setGreeting('Selamat Siang');
    else setGreeting('Selamat Malam');
  }, []);

  // Close dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fungsi logout
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

  // Breadcrumb dinamis
  const getBreadcrumb = () => {
    const path = location.pathname;
    // Coba cari di map
    let parts = breadcrumbMap[path];
    if (!parts) {
      // Fallback: buat dari path
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return [{ label: 'Dashboard', path: '/admin/dashboard' }];
      parts = segments.map((seg, idx) => {
        const label = seg
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return label;
      });
      // Hapus 'Admin' jika ada di awal
      if (parts[0] === 'Admin') parts.shift();
      if (parts.length === 0) parts = ['Dashboard'];
    }
    // Buat breadcrumb items
    const items = [];
    let currentPath = '';
    parts.forEach((label, idx) => {
      if (idx === 0) {
        currentPath = '/admin/dashboard';
      } else if (idx === 1) {
        // Untuk level kedua, coba cari path yang sesuai
        const found = Object.keys(breadcrumbMap).find(key => breadcrumbMap[key]?.[1] === label);
        if (found) currentPath = found;
        else currentPath = '/admin/' + label.toLowerCase().replace(/\s/g, '-');
      } else {
        currentPath += '/' + label.toLowerCase().replace(/\s/g, '-');
      }
      items.push({
        label,
        path: currentPath,
        isLast: idx === parts.length - 1,
      });
    });
    return items;
  };

  const breadcrumbs = getBreadcrumb();

  // Ambil inisial user
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

  // Notifikasi dummy (nanti bisa diintegrasi dengan database)
  const notifications = [
    { id: 1, title: 'Pendaftar baru', desc: 'Ahmad Fauzan mendaftar SPMB', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Verifikasi dokumen', desc: '3 dokumen menunggu pemeriksaan', time: '15 menit lalu', unread: true },
    { id: 3, title: 'Kuota penerimaan', desc: 'TKJ telah mencapai 80% kuota', time: '1 jam lalu', unread: false },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-soft">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        {/* KIRI: Logo dan brand */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-navy-600 flex-shrink-0"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-1.5 rounded-lg shadow-md flex-shrink-0">
              <School className="h-5 w-5" />
            </div>
            <div className="hidden sm:block overflow-hidden">
              <span className="font-bold text-navy-900 text-sm tracking-tight">
                SPMB<span className="text-primary-600">.</span>
              </span>
              <p className="text-[10px] text-navy-400 leading-none font-medium truncate">
                Sistem Penerimaan Murid Baru
              </p>
            </div>
          </Link>
        </div>

        {/* TENGAH: Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm flex-1 justify-center px-4" aria-label="Breadcrumb">
          <Home className="h-3.5 w-3.5 text-navy-400 flex-shrink-0" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-navy-300 flex-shrink-0" />}
              {crumb.isLast ? (
                <span className="font-medium text-navy-700 text-xs truncate">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-navy-500 hover:text-primary-600 text-xs transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* KANAN: Status, Notifikasi, Bantuan, Profile */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Status Periode SPMB */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-100 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                SPMB {schoolSettings?.academic_year || '2026/2027'}
              </span>
              <Badge variant="outline" className="text-[9px] bg-emerald-100 text-emerald-700 border-emerald-200 px-1.5 py-0">
                AKTIF
              </Badge>
            </button>

            {/* Dropdown Status */}
            {isStatusOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h4 className="font-semibold text-navy-800 text-sm">Periode Pendaftaran</h4>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-navy-500">Tahun Ajaran</span>
                    <span className="font-medium text-navy-800">{schoolSettings?.academic_year || '2026/2027'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500">Status</span>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">AKTIF</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500">Kuota</span>
                    <span className="font-medium text-navy-800">{schoolSettings?.target_students || 500} siswa</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifikasi */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-navy-500 hover:text-navy-700 hover:bg-slate-100 rounded-full h-9 w-9"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* Dropdown Notifikasi */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-semibold text-navy-800 text-sm">Notifikasi</h4>
                  <span className="text-xs text-primary-600 hover:underline cursor-pointer">Tandai semua dibaca</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={cn(
                      "px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                      notif.unread && "bg-primary-50/30"
                    )}>
                      <p className="text-sm font-medium text-navy-700">{notif.title}</p>
                      <p className="text-xs text-navy-500">{notif.desc}</p>
                      <p className="text-[10px] text-navy-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
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
            className="hidden sm:flex text-navy-500 hover:text-navy-700 hover:bg-slate-100 rounded-full h-9 w-9"
            asChild
          >
            <Link to="/admin/help">
              <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>

          {/* Profile */}
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
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-navy-800 leading-tight">{displayName}</p>
                <p className="text-[10px] text-navy-400 leading-tight">{userRole}</p>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-navy-400 transition-transform duration-200",
                isProfileOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Profile */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-semibold text-navy-800 text-sm">{displayName}</p>
                  <p className="text-xs text-navy-500 truncate">{user?.email}</p>
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

export default AdminHeader;