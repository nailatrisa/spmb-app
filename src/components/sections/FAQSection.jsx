import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const faqs = [
  {
    question: 'Apa saja jurusan yang tersedia?',
    answer: 'Kami menyediakan 5 jurusan unggulan: Rekayasa Perangkat Lunak (RPL), Teknik Komputer dan Jaringan (TKJ), Multimedia (MM), Akuntansi dan Keuangan Lembaga (AKL), dan Otomatisasi dan Tata Kelola Perkantoran (OTKP).',
  },
  {
    question: 'Kapan batas akhir pendaftaran?',
    answer: 'Pendaftaran dibuka hingga 30 Juni 2026. Namun, kuota terbatas jadi segera daftar sebelum penuh.',
  },
  {
    question: 'Apakah ada biaya pendaftaran?',
    answer: 'Pendaftaran online GRATIS. Tidak ada biaya apapun untuk mendaftar.',
  },
  {
    question: 'Bagaimana cara mengecek status pendaftaran?',
    answer: 'Gunakan menu "Cek Status" di navbar atau di halaman utama, masukkan nomor pendaftaran yang kamu terima.',
  },
  {
    question: 'Apa saja dokumen yang perlu diupload?',
    answer: 'Foto 3x4, Kartu Keluarga, Akta Kelahiran, dan Ijazah/SKL. Pastikan file dalam format JPG/PNG/PDF dan ukuran maksimal 2MB per file.',
  },
  {
    question: 'Bagaimana jika saya lupa nomor pendaftaran?',
    answer: 'Hubungi panitia SPMB melalui kontak yang tertera di website. Kami akan membantu mencari nomor pendaftaran Anda.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Pertanyaan <span className="text-primary-600">Frequently Asked</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Jawaban untuk pertanyaan yang paling sering ditanyakan.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-slate-200 rounded-lg px-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <AccordionTrigger className="text-navy-800 hover:text-primary-700 font-medium text-sm md:text-base py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-navy-600 text-sm pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;