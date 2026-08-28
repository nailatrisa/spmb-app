import React from 'react';
import { Building2, MapPin, Phone, Award } from 'lucide-react';

const SchoolInfoSection = ({ settings }) => {
  if (!settings) return null;

  const infoItems = [
    { icon: Building2, label: 'NPSN', value: settings.npsn },
    { icon: MapPin, label: 'Alamat', value: settings.address },
    { icon: Phone, label: 'Telepon', value: settings.phone },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
              <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-navy-800 font-medium">{item.value || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolInfoSection;