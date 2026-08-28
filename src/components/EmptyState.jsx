import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'Belum ada data', description = 'Data akan muncul di sini setelah tersedia.', icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800">{title}</h3>
      <p className="text-sm text-navy-500 max-w-sm mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;