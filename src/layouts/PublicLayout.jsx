import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';
import { Menu, X, LogIn, Home, BookOpen, Megaphone, ClipboardList, Search } from 'lucide-react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              {/* Admin Login Button */}
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
            <p className="text-xs">
              &copy; {new Date().getFullYear()} SMK Negeri 1 Ponorogo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;