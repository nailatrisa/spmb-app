import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = ({ schoolName = 'SMK Negeri 1 Ponorogo', academicYear = '2026/2027' }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-navy-900 text-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="container-custom relative py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Tahun Ajaran {academicYear}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {schoolName}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
            Sistem Penerimaan Murid Baru yang modern, cepat, dan transparan. Daftar sekarang dan bergabung dengan sekolah unggulan kami.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/pendaftaran">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 text-base gap-2">
                Daftar Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/status">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-base">
                Cek Status
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-white/90" />
              <span>Pendaftaran online</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-white/90" />
              <span>Proses cepat</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-white/90" />
              <span>Informasi realtime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;