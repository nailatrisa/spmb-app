import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  BookOpen,
  BarChart3,
  Megaphone,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchPendingCount = async () => {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (!error) setPendingCount(count || 0);
    };
    fetchPendingCount();

    const channel = supabase
      .channel('admin-pending')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: 'status=eq.pending',
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Data Pendaftar', path: '/admin/applicants' },
    { icon: FileCheck, label: 'Verifikasi Berkas', path: '/admin/verification', badge: pendingCount },
    { icon: Filter, label: 'Seleksi', path: '/admin/selection' },
    { icon: CheckCircle, label: 'Diterima', path: '/admin/accepted' },
    { icon: XCircle, label: 'Ditolak', path: '/admin/rejected' },
    { icon: UserCheck, label: 'Cadangan', path: '/admin/reserves' },
    { icon: BookOpen, label: 'Jurusan', path: '/admin/departments' },
    { icon: BarChart3, label: 'Statistik', path: '/admin/statistics' },
    { icon: Megaphone, label: 'Pengumuman', path: '/admin/announcements' },
    { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
    { icon: Database, label: 'Audit Log', path: '/admin/audit-log' },
  ];

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg flex-shrink-0">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-navy-900 whitespace-nowrap">
                SPMB<span className="text-primary-600">.</span>
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-navy-600 hover:bg-slate-100 hover:text-navy-900'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${!isSidebarOpen && 'h-6 w-6'}`} />
              {isSidebarOpen && <span className="flex-1">{item.label}</span>}
              {isSidebarOpen && item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs px-2 py-0.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <Avatar className="h-9 w-9 border-2 border-slate-200">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">
                {getInitials(user?.profile?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-800 truncate">
                  {user?.profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-navy-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-sidebar transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="font-bold text-navy-900">SPMB<span className="text-primary-600">.</span></span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-navy-600 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="ml-auto text-xs px-2 py-0.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-slate-200">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">
                {getInitials(user?.profile?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-800 truncate">
                {user?.profile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-navy-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Navbar */}
        <AdminNavbar
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;