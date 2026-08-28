import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap, LogIn, UserPlus } from 'lucide-react'
import { Button } from './ui/button'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-secondary">SPMB</span>
            <span className="text-sm font-light text-muted-foreground hidden sm:inline">| Modern Admission</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/jurusan" className="px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
              Jurusan
            </Link>
            <Link to="/pengumuman" className="px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
              Pengumuman
            </Link>
            <Link to="/status" className="px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
              Cek Status
            </Link>
            <Link to="/pendaftaran">
              <Button className="ml-2">Daftar Sekarang</Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="ml-2">
                <LogIn className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-secondary hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/jurusan"
              className="block px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Jurusan
            </Link>
            <Link
              to="/pengumuman"
              className="block px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Pengumuman
            </Link>
            <Link
              to="/status"
              className="block px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Cek Status
            </Link>
            <Link
              to="/pendaftaran"
              className="block px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors text-center"
              onClick={toggleMenu}
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/admin/login"
              className="block px-3 py-2 text-sm font-medium text-secondary hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar