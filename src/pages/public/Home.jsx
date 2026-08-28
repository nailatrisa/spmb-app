import React from 'react';
import Hero from '../../components/public/Hero';
import AdmissionCounter from '../../components/public/AdmissionCounter';
import SchoolInfo from '../../components/public/SchoolInfo';
import Keunggulan from '../../components/public/Keunggulan';
import JurusanPreview from '../../components/public/JurusanPreview';
import CaraDaftar from '../../components/public/CaraDaftar';
import Syarat from '../../components/public/Syarat';
import AnnouncementPreview from '../../components/public/AnnouncementPreview';
import FAQ from '../../components/public/FAQ';
import CTASection from '../../components/public/CTASection';

const Home = () => {
  return (
    <>
      <Hero />
      <section className="py-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            <AdmissionCounter />
            <SchoolInfo />
          </div>
        </div>
      </section>
      <Keunggulan />
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Jurusan Unggulan</h2>
            <p className="mt-2 text-navy-500">Pilih jurusan yang sesuai dengan minat dan bakatmu.</p>
          </div>
          <JurusanPreview />
        </div>
      </section>
      <CaraDaftar />
      <Syarat />
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Pengumuman Terbaru</h2>
            <p className="mt-2 text-navy-500">Informasi penting seputar penerimaan siswa baru.</p>
          </div>
          <AnnouncementPreview />
        </div>
      </section>
      <FAQ />
      <CTASection />
    </>
  );
};

export default Home;