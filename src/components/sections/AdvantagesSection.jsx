import React from 'react';
import { Shield, Zap, Users, BookOpen, Award, Clock } from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: 'Terakreditasi A',
    description: 'Sekolah dengan akreditasi unggulan dan kurikulum berkualitas.',
  },
  {
    icon: Users,
    title: 'Guru Profesional',
    description: 'Tenaga pengajar berpengalaman dan bersertifikasi.',
  },
  {
    icon: BookOpen,
    title: 'Kurikulum Modern',
    description: 'Mengikuti perkembangan industri dan teknologi terkini.',
  },
  {
    icon: Award,
    title: 'Prestasi Nasional',
    description: 'Siswa berprestasi di berbagai kompetisi tingkat nasional.',
  },
  {
    icon: Zap,
    title: 'Fasilitas Lengkap',
    description: 'Laboratorium, perpustakaan, dan sarana olahraga modern.',
  },
  {
    icon: Clock,
    title: 'Ekstrakurikuler Aktif',
    description: 'Berbagai kegiatan pengembangan minat dan bakat siswa.',
  },
];

const AdvantagesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Keunggulan <span className="text-primary-600">Sekolah</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Berbagai keunggulan yang menjadikan sekolah kami pilihan terbaik untuk masa depanmu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-navy-800">{item.title}</h3>
              <p className="text-sm text-navy-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;