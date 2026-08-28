import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ schoolName = 'SPMB' }) => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
              Selamat Datang di <span className="text-blue-600">{schoolName}</span>
            </h1>
            <p className="text-lg md:text-xl text-navy-600">
              Sistem Penerimaan Murid Baru yang modern, cepat, dan transparan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pendaftaran" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg">
                Daftar Sekarang
              </Link>
              <Link to="/status" className="bg-white hover:bg-slate-50 text-navy-700 border border-slate-300 px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg">
                Cek Status
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl shadow-lg flex items-center justify-center text-white text-4xl font-bold p-8">
              {schoolName}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;