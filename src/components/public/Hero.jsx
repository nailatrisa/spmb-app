import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="container-custom py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-sm font-medium mb-5">
            Penerimaan Murid Baru
          </span>

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
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Daftar Sekarang
            </Link>

            <Link
              to="/jurusan"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3 font-semibold hover:bg-white/10 transition"
            >
              Lihat Jurusan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
