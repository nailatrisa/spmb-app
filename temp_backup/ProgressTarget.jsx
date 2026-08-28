import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, CheckCircle } from 'lucide-react';

const ProgressTarget = ({ total, target, accepted, rejected }) => {
  const percentage = target > 0 ? Math.min((total / target) * 100, 100) : 0;
  const remaining = Math.max(0, target - total);

  let status = 'AMAN';
  let statusColor = 'bg-green-100 text-green-700 border-green-200';
  if (percentage >= 90) {
    status = 'KUOTA HAMPIR PENUH';
    statusColor = 'bg-amber-100 text-amber-700 border-amber-200';
  }
  if (percentage >= 100) {
    status = 'KUOTA PENUH';
    statusColor = 'bg-red-100 text-red-700 border-red-200';
  }

  return (
    <Card className="border-slate-200 shadow-soft overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-navy-600">Realisasi Target Penerimaan</span>
              <Badge variant="outline" className={statusColor}>
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy-500 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-bold text-navy-900">{total}</span>
              <span>dari</span>
              <span className="font-bold text-navy-900">{target}</span>
              <span>siswa</span>
              <span className="ml-auto text-xs font-medium text-primary-600">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-navy-400 mt-1.5">
              <span>0</span>
              <span>{Math.round(target / 2)}</span>
              <span className="font-medium text-primary-600">{target}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm bg-slate-50 rounded-lg px-4 py-2 border border-slate-100 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-navy-600">Diterima:</span>
              <span className="font-bold text-navy-900">{accepted || 0}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-navy-600">Sisa:</span>
              <span className="font-bold text-amber-600 ml-1">{remaining}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTarget;