import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const requirements = [
  'Foto terbaru ukuran 3x4 (minimal 300KB, format JPG/PNG)',
  'Kartu Keluarga (scan/photo, maks 2MB)',
  'Akta Kelahiran (scan/photo, maks 2MB)',
  'Ijazah/SKL SMP/MTs (scan/photo, maks 2MB)',
  'NISN (diisi dengan benar)',
  'Nomor WhatsApp/telepon aktif',
];

const RequirementsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Syarat <span className="text-primary-600">Pendaftaran</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Pastikan semua dokumen dan data sudah siap sebelum mendaftar.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-50 rounded-xl p-6 md:p-8 shadow-soft border border-slate-100">
          <ul className="space-y-3">
            {requirements.slice(0, isExpanded ? requirements.length : 4).map((req, index) => (
              <li key={index} className="flex items-start gap-3 text-navy-700">
                <CheckCircle2 className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>

          {requirements.length > 4 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 text-sm text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  Sembunyikan <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Lihat semua syarat <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;