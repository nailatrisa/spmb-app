import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Loader2,
  Eye,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { getApplicationStats, getApplicationsByDepartment } from '@/services/applicationService';
import { getSchoolSettings } from '@/services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/admin/StatsCard';
import ProgressTarget from '@/components/admin/ProgressTarget';

// Warna gradient untuk card statistik
const STAT_COLORS = {
  total: 'from-blue-500 to-blue-600',
  today: 'from-emerald-500 to-emerald-600',
  month: 'from-purple-500 to-purple-600',
  year: 'from-indigo-500 to-indigo-600',
  pending: 'from-amber-500 to-amber-600',
  verified: 'from-cyan-500 to-cyan-600',
  accepted: 'from-green-500 to-green-600',
  rejected: 'from-red-500 to-red-600',
};

const STAT_ICONS = {
  total: Users,
  today: UserPlus,
  month: Calendar,
  year: TrendingUp,
  pending: Clock,
  verified: CheckCircle,
  accepted: Award,
  rejected: XCircle,
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    month: 0,
    year: 0,
    pending: 0,
    verified: 0,
    accepted: 0,
    rejected: 0,
  });
  const [target, setTarget] = useState(500);
  const [topDepartments, setTopDepartments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('Selamat Datang');
  const [currentTime, setCurrentTime] = useState('');

  // Set greeting berdasarkan waktu
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 18) setGreeting('Selamat Siang');
    else setGreeting('Selamat Malam');

    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, deptStats, settings] = await Promise.all([
        getApplicationStats(),
        getApplicationsByDepartment(),
        getSchoolSettings(),
      ]);

      setStats(statsData);
      setTopDepartments(deptStats.slice(0, 5));
      setTarget(settings?.target_students || 500);
      await fetchChartData(period);
    } catch (err) {
      setError('Gagal memuat data dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data chart
  const fetchChartData = async (selectedPeriod) => {
    try {
      let startDate;
      const now = new Date();

      switch (selectedPeriod) {
        case 'daily':
          startDate = subDays(now, 30);
          break;
        case 'weekly':
          startDate = subWeeks(now, 12);
          break;
        case 'monthly':
          startDate = subMonths(now, 12);
          break;
        case 'yearly':
          startDate = subYears(now, 5);
          break;
        default:
          startDate = subDays(now, 30);
      }

      const { data, error: queryError } = await supabase
        .from('applications')
        .select('registered_at')
        .gte('registered_at', startDate.toISOString())
        .order('registered_at', { ascending: true });

      if (queryError) throw queryError;

      const grouped = {};
      data.forEach((item) => {
        const date = new Date(item.registered_at);
        let key;
        switch (selectedPeriod) {
          case 'daily':
            key = format(date, 'dd MMM');
            break;
          case 'weekly':
            key = `Minggu ${format(date, 'w')}`;
            break;
          case 'monthly':
            key = format(date, 'MMM yyyy');
            break;
          case 'yearly':
            key = format(date, 'yyyy');
            break;
          default:
            key = format(date, 'dd MMM');
        }
        grouped[key] = (grouped[key] || 0) + 1;
      });

      const chartArray = Object.keys(grouped).map((key) => ({
        label: key,
        count: grouped[key],
      }));
      chartArray.sort((a, b) => a.label.localeCompare(b.label));
      setChartData(chartArray);
    } catch (err) {
      console.error('Gagal ambil data chart:', err);
      setChartData([]);
    }
  };

  useEffect(() => {
    if (period) fetchChartData(period);
  }, [period]);

  useEffect(() => {
    fetchData();
  }, []);

  const percentage = target > 0 ? Math.min((stats.total / target) * 100, 100) : 0;

  // Statistik card data
  const statCards = [
    { key: 'total', title: 'Total Pendaftar', value: stats.total },
    { key: 'today', title: 'Hari Ini', value: stats.today },
    { key: 'month', title: 'Bulan Ini', value: stats.month },
    { key: 'year', title: 'Tahun Ini', value: stats.year },
    { key: 'pending', title: 'Menunggu', value: stats.pending },
    { key: 'verified', title: 'Terverifikasi', value: stats.verified },
    { key: 'accepted', title: 'Diterima', value: stats.accepted },
    { key: 'rejected', title: 'Ditolak', value: stats.rejected },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-navy-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button className="mt-4" onClick={fetchData}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER / WELCOME SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
            {greeting}, <span className="text-primary-600">Administrator</span> 👋
          </h1>
          <p className="text-navy-500 text-sm mt-1">
            Selamat datang kembali di dashboard SPMB. Berikut ringkasan data penerimaan siswa baru.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-soft">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-navy-600">
              Target: <strong className="text-navy-900">{target}</strong> siswa
            </span>
            <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
              {percentage.toFixed(0)}%
            </Badge>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2 text-sm text-navy-500">
            <Activity className="h-4 w-4 text-navy-400" />
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* TARGET PROGRESS */}
      <ProgressTarget
        total={stats.total}
        target={target}
        accepted={stats.accepted}
        rejected={stats.rejected}
      />

      {/* STATISTIK CARD GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = STAT_ICONS[card.key] || Users;
          const colorKey = card.key;
          const gradient = STAT_COLORS[colorKey] || STAT_COLORS.total;

          return (
            <Card
              key={card.key}
              className="border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-navy-500 font-medium mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-navy-900 tracking-tight">
                      {card.value?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'p-3 rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110 duration-300',
                      gradient
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* GRAFIK & JURUSAN TERPOPULER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Utama */}
        <Card className="border-slate-200 shadow-soft lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-500" />
              Grafik Pendaftaran
            </CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 h-8 text-xs border-slate-200">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-navy-400 text-sm">
                Belum ada data untuk periode ini.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    interval={period === 'daily' ? 3 : period === 'weekly' ? 1 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    allowDecimals={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value) => [`${value} pendaftar`, 'Jumlah']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorCount)"
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Jurusan Terpopuler */}
        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Jurusan Terpopuler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topDepartments.length === 0 ? (
              <p className="text-sm text-navy-400 text-center py-8">
                Belum ada data pendaftar.
              </p>
            ) : (
              <div className="space-y-3">
                {topDepartments.map((dept, idx) => {
                  const colors = [
                    'bg-blue-500',
                    'bg-emerald-500',
                    'bg-purple-500',
                    'bg-amber-500',
                    'bg-rose-500',
                  ];
                  const color = colors[idx % colors.length];
                  const maxCount = topDepartments[0]?.count || 1;
                  const barWidth = (dept.count / maxCount) * 100;

                  return (
                    <div key={dept.id} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-navy-400 w-5">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-navy-800 truncate">
                            {dept.name}
                          </span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {dept.code}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-navy-900">
                          {dept.count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${color} transition-all duration-700 ease-out`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TOMBOL REFRESH */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          className="gap-2 border-slate-200 hover:border-primary-300"
        >
          <Loader2 className="h-3 w-3" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;