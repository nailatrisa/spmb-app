import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  {
    q: 'Kapan pendaftaran dibuka?',
    a: 'Pendaftaran dibuka mulai 1 Januari 2026 hingga kuota terpenuhi.',
  },
  {
    q: 'Berapa biaya pendaftaran?',
    a: 'Pendaftaran gratis, tidak dipungut biaya apapun.',
  },
  {
    q: 'Bagaimana cara cek status pendaftaran?',
    a: 'Masukkan nomor pendaftaran di halaman Cek Status.',
  },
  {
    q: 'Apa saja jurusan yang tersedia?',
    a: 'Rekayasa Perangkat Lunak, Teknik Komputer dan Jaringan, Multimedia, Akuntansi, dan Otomatisasi Perkantoran.',
  },
  {
    q: 'Apakah ada tes masuk?',
    a: 'Ya, akan ada tes seleksi yang diumumkan kemudian.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Pertanyaan Umum (FAQ)</h2>
          <p className="mt-2 text-navy-500">Temukan jawaban atas pertanyaan yang sering diajukan.</p>
        </div>
        <div className="space-y-3">
          {faqData.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-soft">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100 transition-colors"
              >
                <span className="font-medium text-navy-800">{item.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-navy-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-navy-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-sm text-navy-600 animate-in slide-in-from-top-2 duration-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;