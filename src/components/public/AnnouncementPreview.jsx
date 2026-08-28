import React from 'react';
import { Link } from 'react-router-dom';

const AnnouncementPreview = () => {
  const announcements = [
    {
      id: 1,
      title: 'Pembukaan Pendaftaran Murid Baru',
      date: '2026-08-01'
    },
    {
      id: 2,
      title: 'Informasi Persyaratan Pendaftaran',
      date: '2026-08-05'
    },
    {
      id: 3,
      title: 'Jadwal Seleksi Penerimaan Murid Baru',
      date: '2026-08-10'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {announcements.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <span className="text-sm text-blue-600 font-medium">
            {item.date}
          </span>

          <h3 className="mt-3 text-lg font-bold text-navy-900">
            {item.title}
          </h3>

          <Link
            to={`/pengumuman/${item.id}`}
            className="inline-block mt-4 text-blue-600 font-medium hover:underline"
          >
            Baca Selengkapnya ?
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementPreview;
