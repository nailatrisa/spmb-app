import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { getSchoolSettings } from '../../services/settingsService';

const Hero = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSchoolSettings();
        setSettings(data);
      } catch (error) {
        console.error('Gagal mengambil data pendaftaran:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isOpen = settings?.is_open ?? true;
  const deadline = settings?.registration_deadline;
  const deadlineText = formatDate(deadline);

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="container-custom py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Status & Periode Badge */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-medium">
              Penerimaan Murid Baru
            </span>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isOpen
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {isOpen ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Pendaftaran Dibuka
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Pendaftaran Ditutup
                </>
              )}
            </div>

            {/* Deadline Badge */}
            {deadlineText && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                {deadlineText}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Raih Masa Depanmu
            <span className="block text-blue-400">
              Bersama Sekolah Kami
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Daftarkan dirimu dan jadilah bagian dari sekolah yang
            mendukung potensi, kreativitas, dan prestasimu.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/pendaftaran"
              className={`inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition ${
                isOpen
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-600 cursor-not-allowed opacity-50'
              }`}
              onClick={(e) => !isOpen && e.preventDefault()}
            >
              {isOpen ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
            </Link>

            <Link
              to="/jurusan"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3 font-semibold hover:bg-white/10 transition"
            >
              Lihat Jurusan
            </Link>
          </div>

          {/* Informasi deadline tambahan */}
          {deadlineText && isOpen && (
            <p className="mt-4 text-sm text-slate-400">
              Pendaftaran dibuka hingga <span className="font-semibold text-slate-200">{deadlineText}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
