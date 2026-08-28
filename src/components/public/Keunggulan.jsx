import React from 'react';

const Keunggulan = () => {
  const features = [
    {
      title: 'Pendidikan Berkualitas',
      description: 'Pembelajaran yang mendukung perkembangan akademik dan keterampilan siswa.'
    },
    {
      title: 'Fasilitas Lengkap',
      description: 'Fasilitas pembelajaran yang nyaman untuk menunjang kegiatan sekolah.'
    },
    {
      title: 'Guru Profesional',
      description: 'Didukung tenaga pendidik yang berpengalaman dan kompeten.'
    },
    {
      title: 'Pengembangan Bakat',
      description: 'Berbagai kegiatan untuk mengembangkan minat, bakat, dan kreativitas siswa.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Mengapa Memilih Kami?
          </h2>
          <p className="mt-2 text-slate-500">
            Lingkungan pendidikan yang mendukung prestasi dan masa depan siswa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <h3 className="mt-4 font-bold text-navy-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Keunggulan;
