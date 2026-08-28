import React from 'react';
import { CheckCircle, FileText, Upload, Printer, Award } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Pilih Jurusan',
    description: 'Tentukan jurusan yang sesuai dengan minat dan bakatmu.',
  },
  {
    icon: CheckCircle,
    title: 'Isi Formulir',
    description: 'Lengkapi data diri, kontak, dan informasi lainnya.',
  },
  {
    icon: Upload,
    title: 'Upload Dokumen',
    description: 'Unggah foto, KK, akta, dan ijazah/SKL.',
  },
  {
    icon: Printer,
    title: 'Cetak Kartu',
    description: 'Dapatkan kartu pendaftaran dan simpan sebagai bukti.',
  },
  {
    icon: Award,
    title: 'Ikuti Seleksi',
    description: 'Pantau pengumuman hasil seleksi melalui website.',
  },
];

const HowToApplySection = () => {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Cara <span className="text-primary-600">Mendaftar</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Ikuti langkah-langkah mudah berikut untuk menyelesaikan pendaftaran.
          </p>
        </div>

        <div className="relative">
          {/* Garis penghubung */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative z-10">
                  <div className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-3">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-white text-primary-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary-200">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-navy-800 text-sm md:text-base">{step.title}</h3>
                <p className="text-xs text-navy-500 mt-1 max-w-[140px]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToApplySection;