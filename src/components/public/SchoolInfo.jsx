import React from 'react';

const SchoolInfo = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-navy-900">
        Tentang Sekolah
      </h2>

      <p className="mt-3 text-slate-500 leading-relaxed">
        Sekolah kami berkomitmen memberikan pendidikan berkualitas,
        membangun karakter, serta mengembangkan potensi setiap peserta didik.
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <div className="text-2xl font-bold text-blue-600">20+</div>
          <div className="text-sm text-slate-500">Tahun Berdiri</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-blue-600">1000+</div>
          <div className="text-sm text-slate-500">Alumni</div>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfo;
