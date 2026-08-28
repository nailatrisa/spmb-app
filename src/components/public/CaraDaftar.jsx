import React from 'react';

const CaraDaftar = () => {
  const steps = [
    'Buka halaman pendaftaran',
    'Isi formulir dengan data yang benar',
    'Upload dokumen persyaratan',
    'Periksa kembali data pendaftaran',
    'Kirim formulir dan simpan nomor pendaftaran'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Cara Pendaftaran
          </h2>
          <p className="mt-2 text-slate-500">
            Ikuti langkah berikut untuk melakukan pendaftaran.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200"
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <p className="text-slate-700 font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaraDaftar;
