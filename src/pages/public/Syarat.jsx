import React, { useState } from 'react';

const syaratList = [
  'Fotokopi Kartu Keluarga (KK)',
  'Fotokopi Akta Kelahiran',
  'Fotokopi Ijazah/SKL SMP/MTs',
  'Pas foto terbaru 3x4 (2 lembar)',
  'Fotokopi NISN',
  'Fotokopi rapor semester 1-5',
  'Surat keterangan sehat dari dokter',
];

const Syarat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Syarat Pendaftaran</h2>
          <p className="mt-2 text-navy-500">Pastikan semua dokumen disiapkan.</p>
        </div>
        <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition">
            <span className="font-medium text-navy-800 flex items-center gap-2">📋 Lihat Persyaratan</span>
            <span>{isOpen ? '▲' : '▼'}</span>
          </button>
          {isOpen && (
            <div className="p-5 pt-0 border-t border-slate-100">
              <ul className="space-y-2 text-sm text-navy-700">
                {syaratList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Syarat;