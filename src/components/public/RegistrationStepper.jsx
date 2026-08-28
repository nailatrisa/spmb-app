import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  'Data Pribadi',
  'Kontak & Alamat',
  'Sekolah Asal',
  'Orang Tua',
  'Pilihan Jurusan',
  'Dokumen',
  'Review'
];

const RegistrationStepper = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Garis penghubung */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200 -z-10" />
        <div 
          className="absolute left-0 top-5 h-0.5 bg-primary-500 transition-all duration-500 -z-10"
          style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isFuture = idx > currentStep;
          
          return (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary-500 text-white'
                    : isActive
                    ? 'bg-primary-500 text-white ring-4 ring-primary-200'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : idx + 1}
              </div>
              <span className={`text-xs mt-2 text-center hidden md:block ${
                isActive ? 'text-primary-600 font-medium' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationStepper;