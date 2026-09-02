import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, FileText, Users, CheckCircle } from 'lucide-react';

const faqData = [
  {
    q: 'Kapan pendaftaran SPMB dibuka?',
    a: 'Pendaftaran SPMB dibuka mulai **1 Januari 2026** hingga **31 Maret 2026**. Pendaftaran dilakukan secara online melalui website resmi SPMB.',
    icon: Calendar,
  },
  {
    q: 'Bagaimana cara mendaftar SPMB?',
    a: '1. Kunjungi website SPMB\n2. Pilih jurusan yang diinginkan\n3. Isi formulir pendaftaran dengan lengkap\n4. Upload dokumen yang diperlukan\n5. Submit pendaftaran dan cetak kartu pendaftaran',
    icon: FileText,
  },
  {
    q: 'Apa saja persyaratan pendaftaran?',
    a: '1. Fotokopi Kartu Keluarga (KK)\n2. Fotokopi Akta Kelahiran\n3. Fotokopi Ijazah/SKL SMP/MTs\n4. Pas foto terbaru ukuran 3x4 (2 lembar)\n5. Fotokopi NISN\n6. Surat keterangan sehat dari dokter',
    icon: CheckCircle,
  },
  {
    q: 'Berapa biaya pendaftaran SPMB?',
    a: 'Pendaftaran SPMB **GRATIS**, tidak dipungut biaya apapun.',
    icon: Users,
  },
  {
    q: 'Kapan pengumuman hasil seleksi?',
    a: 'Pengumuman hasil seleksi akan dilakukan pada **15 April 2026**. Hasil dapat dilihat melalui website SPMB dengan memasukkan nomor pendaftaran.',
    icon: Calendar,
  },
  {
    q: 'Apa saja jurusan yang tersedia?',
    a: 'Jurusan yang tersedia: **Rekayasa Perangkat Lunak (RPL)**, **Teknik Komputer dan Jaringan (TKJ)**, **Multimedia (MM)**, **Akuntansi dan Keuangan Lembaga (AKL)**, dan **Otomatisasi dan Tata Kelola Perkantoran (OTKP)**.',
    icon: Users,
  },
  {
    q: 'Bagaimana cara cek status pendaftaran?',
    a: 'Masukkan nomor pendaftaran di halaman **Cek Status** pada website SPMB. Status akan ditampilkan secara real-time.',
    icon: Clock,
  },
  {
    q: 'Apa yang harus dilakukan jika lolos seleksi?',
    a: 'Jika lolos seleksi, calon siswa wajib melakukan **daftar ulang** pada tanggal yang ditentukan dan melengkapi berkas persyaratan administrasi.',
    icon: CheckCircle,
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Tanya Jawab
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Pertanyaan <span className="text-blue-600">Umum</span>
          </h2>
          <p className="mt-3 text-slate-500 text-lg">
            Temukan jawaban atas pertanyaan yang sering diajukan seputar pendaftaran SPMB.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1 font-medium text-slate-800 text-base">
                    {item.q}
                  </span>
                  {openIndex === idx ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm whitespace-pre-line border-t border-slate-200/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Masih memiliki pertanyaan? Hubungi panitia SPMB di <strong className="text-slate-600">(0352) 123456</strong> atau email <strong className="text-slate-600">info@spmb-school.com</strong></p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;