import React from 'react';

const AdmissionCounter = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-navy-900">
        Penerimaan Murid Baru
      </h2>
      <p className="mt-2 text-slate-500">
        Segera daftarkan dirimu dan jadilah bagian dari sekolah kami.
      </p>

      <div className="grid grid-cols-3 gap-3 mt-6 text-center">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">24</div>
          <div className="text-xs text-slate-500 mt-1">Hari</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-xs text-slate-500 mt-1">Jam</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">30</div>
          <div className="text-xs text-slate-500 mt-1">Menit</div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCounter;
