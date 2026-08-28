import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Kapan pendaftaran siswa baru dibuka?',
      answer: 'Pendaftaran siswa baru dibuka sesuai jadwal yang telah ditentukan oleh sekolah.'
    },
    {
      question: 'Bagaimana cara melakukan pendaftaran?',
      answer: 'Klik menu Pendaftaran, kemudian isi formulir pendaftaran dengan data yang benar dan lengkap.'
    },
    {
      question: 'Apa saja syarat pendaftaran?',
      answer: 'Syarat pendaftaran dapat dilihat pada bagian Syarat Pendaftaran di halaman utama.'
    },
    {
      question: 'Bagaimana cara mengecek status pendaftaran?',
      answer: 'Gunakan menu Cek Status dan masukkan nomor pendaftaran untuk melihat status pendaftaran.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-navy-500">
            Temukan jawaban dari pertanyaan seputar penerimaan siswa baru.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-navy-900 hover:bg-slate-50"
              >
                <span>{faq.question}</span>
                <span className="text-xl">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 text-slate-600">
                  {faq.answer}
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
