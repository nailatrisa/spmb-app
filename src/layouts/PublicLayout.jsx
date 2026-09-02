import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';
import { Menu, X, LogIn, Home, BookOpen, Megaphone, ClipboardList, Search, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [deadline, setDeadline] = useState(null);

  // ============================================================
  // 🔥 CEK STATUS PENDAFTARAN
  // ============================================================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('is_open, registration_deadline')
          .single();
        if (error) throw error;
        setIsOpen(data?.is_open !== false);
        setDeadline(data?.registration_deadline || null);
      } catch (err) {
        console.error('Gagal ambil status pendaftaran:', err);
      }
    };
    fetchStatus();
  }, []);

  // ============================================================
  // AUTO-CLOSE: Cek deadline setiap 5 menit
  // ============================================================
  useEffect(() => {
    const checkDeadline = async () => {
      if (!deadline) return;
      const now = new Date();
      const deadlineDate = new Date(deadline);
      if (now > deadlineDate && isOpen) {
        await supabase
          .from('school_settings')
          .update({ is_open: false, updated_at: new Date().toISOString() })
          .eq('id', (await supabase.from('school_settings').select('id').single()).data.id);
        setIsOpen(false);
        alert('Pendaftaran telah ditutup otomatis karena deadline telah berakhir.');
      }
    };

    const interval = setInterval(checkDeadline, 5 * 60 * 1000); // 5 menit
    return () => clearInterval(interval);
  }, [deadline, isOpen]);

  const navLinks = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/jurusan', label: 'Jurusan', icon: BookOpen },
    { to: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
    { to: '/pendaftaran', label: 'Daftar', icon: ClipboardList },
    { to: '/status', label: 'Cek Status', icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-navy-600 hover:bg-slate-100 hover:text-navy-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* 🔥 Status Pendaftaran */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium">
                {isOpen ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-green-700">Pendaftaran Dibuka</span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-red-700">Pendaftaran Ditutup</span>
                  </>
                )}
              </div>

              {/* Admin Login */}
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-slate-200">
                  <LogIn className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-2 px-4 shadow-soft animate-in slide-in-from-top-5 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-navy-600 hover:bg-slate-50 hover:text-navy-900'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              ))}
              <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full mt-2 justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login Admin
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-navy-500">
            <div className="flex items-center gap-2">
              <Logo showText={false} />
              <span className="font-medium text-navy-700">SPMB Modern Admission</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/jurusan" className="hover:text-primary-600 transition-colors">Jurusan</Link>
              <Link to="/pengumuman" className="hover:text-primary-600 transition-colors">Pengumuman</Link>
              <Link to="/pendaftaran" className="hover:text-primary-600 transition-colors">Daftar</Link>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>{isOpen ? '🟢 Dibuka' : '🔴 Ditutup'}</span>
              <span>&copy; {new Date().getFullYear()} SMK Negeri 1 Ponorogo. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;