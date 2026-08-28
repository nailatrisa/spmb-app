import React from 'react';

const steps = [
  { icon: '📋', title: 'Pilih Jurusan', desc: 'Tentukan jurusan sesuai minat.' },
  { icon: '📝', title: 'Isi Form', desc: 'Lengkapi data dan unggah dokumen.' },
  { icon: '✅', title: 'Verifikasi', desc: 'Data diperiksa admin.' },
  { icon: '🖨️', title: 'Cetak Kartu', desc: 'Dapatkan kartu pendaftaran.' },
  { icon: '🏅', title: 'Seleksi', desc: 'Ikuti proses seleksi.' },
];

const CaraDaftar = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Cara Daftar</h2>
          <p className="mt-3 text-navy-500">Ikuti langkah-langkah mudah di bawah ini.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">{step.icon}</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-2 mb-2">{idx + 1}</div>
              <h3 className="font-semibold text-navy-800">{step.title}</h3>
              <p className="text-xs text-navy-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaraDaftar;