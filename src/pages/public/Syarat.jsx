import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileCheck, Calendar, Clock } from 'lucide-react';

const syaratList = [
  'Fotokopi Kartu Keluarga (KK) yang masih berlaku',
  'Fotokopi Akta Kelahiran',
  'Fotokopi Ijazah/SKL SMP/MTs (bagi yang sudah lulus) atau Surat Keterangan Lulus (SKL) sementara',
  'Pas foto terbaru ukuran 3x4 (2 lembar) dengan latar merah',
  'Fotokopi NISN',
  'Fotokopi rapor semester 1-5 (untuk verifikasi nilai)',
  'Surat keterangan sehat dari dokter',
  'Mengisi formulir pendaftaran online dengan lengkap dan benar',
];

const Syarat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Persyaratan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Syarat <span className="text-blue-600">Pendaftaran</span>
          </h2>
          <p className="mt-3 text-slate-500 text-lg">
            Pastikan Anda memenuhi semua persyaratan sebelum mendaftar. Pendaftaran dibuka mulai <strong>1 Januari 2026</strong>.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="font-semibold text-slate-800 flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <span>Lihat Persyaratan Lengkap</span>
            </span>
            {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>

          {isOpen && (
            <div className="p-6 pt-0 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
              <ul className="space-y-3 text-sm text-slate-700">
                {syaratList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700 flex items-start gap-3">
                <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Periode Pendaftaran:</strong> 1 Januari 2026 – 31 Maret 2026
                  <br />
                  <span className="text-xs text-blue-600">*Dokumen asli akan diverifikasi saat daftar ulang.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Syarat;