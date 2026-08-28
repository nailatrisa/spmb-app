import React, { useState, useEffect } from 'react';
import {
  getApplicationStats,
  getApplicationsByDepartment,
} from '../../services/applicationService';
import { getSchoolSettings } from '../../services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Loader2, RefreshCw } from 'lucide-react';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [target, setTarget] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, deptData, settings] = await Promise.all([
        getApplicationStats(),
        getApplicationsByDepartment(),
        getSchoolSettings(),
      ]);
      setStats(statsData);
      setDeptStats(deptData);
      setTarget(settings?.target_students || 500);
    } catch (err) {
      setError('Gagal memuat data statistik.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusData = stats
    ? [
        { name: 'Menunggu', value: stats.pending || 0 },
        { name: 'Terverifikasi', value: stats.verified || 0 },
        { name: 'Diterima', value: stats.accepted || 0 },
        { name: 'Ditolak', value: stats.rejected || 0 },
      ].filter((item) => item.value > 0)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={fetchData}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy-900">Statistik Lengkap</h2>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-navy-500">Total Pendaftar</p>
            <p className="text-2xl font-bold text-navy-900">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-navy-500">Target</p>
            <p className="text-2xl font-bold text-navy-900">{target}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-navy-500">Hari Ini</p>
            <p className="text-2xl font-bold text-primary-600">{stats?.today || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-navy-500">Bulan Ini</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.month || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-center text-navy-400 py-8">Belum ada data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Jurusan Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            {deptStats.length === 0 ? (
              <p className="text-center text-navy-400 py-8">Belum ada data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={deptStats.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Jumlah Pendaftar" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-soft">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Detail Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-medium text-navy-500">Status</th>
                  <th className="text-right py-2 font-medium text-navy-500">Jumlah</th>
                  <th className="text-right py-2 font-medium text-navy-500">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'pending', label: 'Menunggu' },
                  { key: 'verified', label: 'Terverifikasi' },
                  { key: 'accepted', label: 'Diterima' },
                  { key: 'rejected', label: 'Ditolak' },
                ].map((item) => {
                  const count = stats?.[item.key] || 0;
                  const total = stats?.total || 1;
                  const percentage = ((count / total) * 100).toFixed(1);
                  return (
                    <tr key={item.key} className="border-b border-slate-100">
                      <td className="py-2">{item.label}</td>
                      <td className="text-right py-2">{count}</td>
                      <td className="text-right py-2">{percentage}%</td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-slate-50">
                  <td className="py-2">Total</td>
                  <td className="text-right py-2">{stats?.total || 0}</td>
                  <td className="text-right py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;