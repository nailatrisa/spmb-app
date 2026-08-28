import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { Progress } from '../ui/progress';
import { Users, Target } from 'lucide-react';

const AdmissionCounter = () => {
  const [stats, setStats] = useState({ total: 0, target: 500, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await applicationService.getAdmissionStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admission stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh setiap 30 detik
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 border border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-2/3"></div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6 border border-slate-100 transition-all hover:shadow-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-navy-600">
          <Users className="h-4 w-4 text-primary-600" />
          <span className="font-medium">Pendaftar</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-navy-600">
          <Target className="h-4 w-4 text-primary-600" />
          <span className="font-medium">Target {stats.target} siswa</span>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-navy-900">{stats.total}</span>
        <span className="text-sm text-navy-400 pb-1">/ {stats.target}</span>
        <span className="ml-auto text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {Math.round(stats.percentage)}%
        </span>
      </div>

      <Progress value={stats.percentage} className="h-2 mt-3 bg-slate-100" />

      <p className="text-xs text-navy-400 mt-3">
        {stats.percentage >= 100 
          ? '🎉 Kuota telah terpenuhi!' 
          : `Masih tersedia ${stats.target - stats.total} kursi`}
      </p>
    </div>
  );
};

export default AdmissionCounter;