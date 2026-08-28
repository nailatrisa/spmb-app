import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary-600 text-white p-1.5 rounded-lg">
        <GraduationCap className="h-6 w-6" />
      </div>
      {showText && (
        <span className="font-bold text-lg tracking-tight text-navy-900">
          SPMB<span className="text-primary-600">.</span>
        </span>
      )}
    </div>
  );
};

export default Logo;