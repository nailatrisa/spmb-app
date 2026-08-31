import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  Activity,
  LogOut,
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
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { getApplicationStats, getApplicationsByDepartment } from '@/services/applicationService';
import { getSchoolSettings } from '@/services/settingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ============================================================
// STATS CARD (REUSABLE)
// ============================================================
const StatsCard = ({ title, value, icon: Icon, color = 'primary', onClick, navLabel }) => {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <Card
      className={cn(
        "border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {value?.toLocaleString() || 0}
            </p>
            {navLabel && (
              <p className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {navLabel} →
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================
// PROGRESS TARGET
// ============================================================
const ProgressTarget = ({ total, target, accepted = 0 }) => {
  const percentage = target > 0 ? Math.min((total / target) * 100, 100) : 0;
  const remaining = Math.max(0, target - total);

  let status = 'AMAN';
  let statusColor = 'bg-green-100 text-green-700 border-green-200';
  if (percentage >= 90 && percentage < 100) {
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
              <span className="text-sm font-medium text-slate-600">Realisasi Target Penerimaan</span>
              <Badge variant="outline" className={statusColor}>
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span className="font-bold text-slate-900">{total}</span>
              <span>dari</span>
              <span className="font-bold text-slate-900">{target}</span>
              <span>siswa</span>
              <span className="ml-auto text-xs font-medium text-blue-600">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>0</span>
              <span>{Math.round(target / 2)}</span>
              <span className="font-medium text-blue-600">{target}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm bg-slate-50 rounded-lg px-4 py-2 border border-slate-100 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-slate-600">Diterima:</span>
              <span className="font-bold text-slate-900">{accepted || 0}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-600">Sisa:</span>
              <span className="font-bold text-amber-600 ml-1">{remaining}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================
// DASHBOARD UTAMA
// ============================================================
const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  // ========== GREETING & JAM ==========
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

  // ========== FETCH DATA ==========
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

  // ========== FETCH CHART ==========
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

  // ========== LOGOUT ==========
  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun administrator?')) {
      const { error } = await logout();
      if (!error) {
        navigate('/admin/login');
      } else {
        alert('Gagal logout: ' + error.message);
      }
    }
  };

  // ========== NAVIGASI CARD ==========
  const handleCardClick = (key) => {
    const navMap = {
      total: '/admin/applicants',
      today: '/admin/applicants?filter=today',
      month: '/admin/statistics?period=month',
      year: '/admin/statistics?period=year',
      pending: '/admin/applicants?status=pending',
      verified: '/admin/applicants?status=verified',
      accepted: '/admin/applicants?status=accepted',
      rejected: '/admin/applicants?status=rejected',
    };
    if (navMap[key]) {
      navigate(navMap[key]);
    }
  };

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-500">Memuat dashboard...</p>
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

  const percentage = target > 0 ? Math.min((stats.total / target) * 100, 100) : 0;

  const statCards = [
    { key: 'total', title: 'Total Pendaftar', value: stats.total, icon: Users, color: 'primary' },
    { key: 'today', title: 'Hari Ini', value: stats.today, icon: UserPlus, color: 'emerald' },
    { key: 'month', title: 'Bulan Ini', value: stats.month, icon: Calendar, color: 'purple' },
    { key: 'year', title: 'Tahun Ini', value: stats.year, icon: TrendingUp, color: 'indigo' },
    { key: 'pending', title: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
    { key: 'verified', title: 'Terverifikasi', value: stats.verified, icon: CheckCircle, color: 'blue' },
    { key: 'accepted', title: 'Diterima', value: stats.accepted, icon: Award, color: 'green' },
    { key: 'rejected', title: 'Ditolak', value: stats.rejected, icon: XCircle, color: 'red' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ===== HEADER + LOGOUT ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {greeting}, <span className="text-blue-600">Administrator</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Selamat datang kembali di dashboard SPMB. Berikut ringkasan data penerimaan siswa baru.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-soft">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-600">
              Target: <strong className="text-slate-900">{target}</strong> siswa
            </span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {percentage.toFixed(0)}%
            </Badge>
            <div className="w-px h-6 bg-slate-200" />
            <Activity className="h-4 w-4 text-slate-400" />
            <span className="font-mono text-sm text-slate-500">{currentTime}</span>
          </div>
          {/* 🔥 TOMBOL LOGOUT */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* ===== PROGRESS TARGET ===== */}
      <ProgressTarget
        total={stats.total}
        target={target}
        accepted={stats.accepted}
      />

      {/* ===== STATISTIK CARD ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            onClick={() => handleCardClick(card.key)}
            navLabel="Lihat Detail →"
          />
        ))}
      </div>

      {/* ===== GRAFIK & JURUSAN TERPOPULER ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-soft lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
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
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
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

        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Jurusan Terpopuler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topDepartments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
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
                          <span className="text-xs font-bold text-slate-400 w-5">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-800 truncate">
                            {dept.name}
                          </span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {dept.code}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
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

      {/* ===== TOMBOL REFRESH ===== */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          className="gap-2 border-slate-200 hover:border-blue-300"
        >
          <Loader2 className="h-3 w-3" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;