import React from 'react';

const keunggulanData = [
  { icon: '📚', title: 'Kurikulum Terbaru', desc: 'Menggunakan kurikulum merdeka yang relevan dengan industri.' },
  { icon: '👨‍🏫', title: 'Guru Profesional', desc: 'Pengajar berpengalaman dan bersertifikasi.' },
  { icon: '🏆', title: 'Prestasi Nasional', desc: 'Siswa berprestasi di berbagai kompetisi.' },
  { icon: '💡', title: 'Inovasi Digital', desc: 'Pembelajaran berbasis teknologi modern.' },
  { icon: '🌐', title: 'Koneksi Industri', desc: 'Kerjasama dengan perusahaan terkemuka.' },
  { icon: '✨', title: 'Lingkungan Nyaman', desc: 'Fasilitas lengkap dan suasana belajar kondusif.' },
];

const Keunggulan = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Keunggulan Sekolah</h2>
          <p className="mt-3 text-navy-500">Mengapa memilih kami?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {keunggulanData.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl shadow p-6 border border-slate-100 hover:shadow-lg transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-navy-800">{item.title}</h3>
              <p className="text-sm text-navy-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Keunggulan;