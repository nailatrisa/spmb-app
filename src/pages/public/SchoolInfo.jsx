import React, { useState, useEffect } from 'react';
import { getSchoolSettings } from '../../services/settingsService';

const SchoolInfo = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSchoolSettings();
        setSettings(data);
      } catch (error) {
        console.error('Gagal ambil data sekolah:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-white rounded-xl shadow p-6 h-32" />;
  }

  if (!settings) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
        🏫 {settings.school_name}
      </h3>
      <div className="mt-3 space-y-2 text-sm text-navy-600">
        <div>📍 {settings.address}</div>
        <div>📞 {settings.phone}</div>
        <div>🆔 NPSN: {settings.npsn}</div>
      </div>
      <p className="mt-3 text-sm text-navy-500 border-t border-slate-100 pt-3">
        {settings.description || 'Sekolah unggulan dengan berbagai jurusan kompetensi.'}
      </p>
    </div>
  );
};

export default SchoolInfo;