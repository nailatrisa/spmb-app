import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  FileText,
  CheckCircle,
  Printer,
  Award,
  Calendar,
} from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Cek Jadwal',
    desc: 'Pastikan Anda mendaftar pada periode yang telah ditentukan: 1 Januari – 31 Maret 2026.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: ClipboardList,
    title: 'Pilih Jurusan',
    desc: 'Tentukan jurusan yang sesuai dengan minat dan bakat Anda. Perhatikan kuota dan nilai minimum.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Isi Form & Upload Dokumen',
    desc: 'Lengkapi data pribadi, orang tua, dan unggah dokumen persyaratan secara online.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: CheckCircle,
    title: 'Verifikasi & Seleksi',
    desc: 'Data akan diverifikasi oleh admin, kemudian dilakukan seleksi berdasarkan nilai SKL dan kuota.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Printer,
    title: 'Cetak Kartu Pendaftaran',
    desc: 'Setelah pendaftaran berhasil, cetak kartu pendaftaran sebagai bukti dan simpan nomor pendaftaran.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Award,
    title: 'Pengumuman Hasil',
    desc: 'Hasil seleksi akan diumumkan pada 15 April 2026. Cek status melalui website SPMB.',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const CaraDaftar = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Panduan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Cara <span className="text-blue-600">Mendaftar</span>
          </h2>
          <p className="mt-3 text-slate-500 text-lg">
            Ikuti 6 langkah mudah di bawah ini untuk menyelesaikan pendaftaran SPMB Anda.
          </p>
        </div>

        <div className="relative">
          {/* Garis vertikal di tengah (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 -translate-x-1/2" />

          <div className="space-y-8 md:space-y-0 relative">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = step.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Konten */}
                  <div className={`md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${step.color} mb-4`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                    </div>
                  </div>

                  {/* Nomor Step */}
                  <div className="flex items-center justify-center md:w-16">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="md:w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaraDaftar;