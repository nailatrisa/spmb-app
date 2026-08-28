import React, { useState, useEffect } from 'react';
import { getApplicationCount } from '../../services/applicationService';
import { getSchoolSettings } from '../../services/settingsService';

const AdmissionCounter = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countData, settings] = await Promise.all([
          getApplicationCount(),
          getSchoolSettings(),
        ]);
        setCount(countData || 0);
        setTarget(settings?.target_students || 500);
      } catch (error) {
        console.error('Gagal mengambil data counter:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const percentage = target > 0 ? Math.min((count / target) * 100, 100) : 0;

  if (loading) {
    return <div className="bg-white rounded-xl shadow p-6 animate-pulse h-32" />;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      <div className="flex items-center gap-2 text-sm text-navy-500 mb-2">
        <span>📊 Pendaftar Aktif</span>
      </div>
      <div className="flex items-end gap-4 flex-wrap">
        <span className="text-4xl font-bold text-navy-900">{count}</span>
        <span className="text-lg text-navy-400">/ {target}</span>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium ml-auto">
          {percentage.toFixed(0)}% terisi
        </span>
      </div>
      <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-700" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default AdmissionCounter;