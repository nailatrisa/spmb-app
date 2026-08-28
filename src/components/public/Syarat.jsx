import React from 'react';

const Syarat = () => {
  const requirements = [
    'Fotokopi atau scan kartu keluarga',
    'Fotokopi atau scan akta kelahiran',
    'Ijazah atau surat keterangan lulus',
    'Pas foto terbaru',
    'Dokumen pendukung lainnya sesuai ketentuan sekolah'
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Syarat Pendaftaran
          </h2>
          <p className="mt-2 text-slate-500">
            Persiapkan dokumen berikut sebelum melakukan pendaftaran.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6">
          <ul className="space-y-4">
            {requirements.map((item, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                  ?
                </span>
                <span className="text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Syarat;
