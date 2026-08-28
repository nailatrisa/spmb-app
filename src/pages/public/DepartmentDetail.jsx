import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDepartmentById, getDepartmentApplicationCounts } from '@/services/departmentService';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import { ArrowLeft, Users, CheckCircle, XCircle, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dept = await getDepartmentById(id);
        if (!dept) {
          setError('Jurusan tidak ditemukan.');
          setLoading(false);
          return;
        }
        setDepartment(dept);

        const counts = await getDepartmentApplicationCounts();
        setApplicantCount(counts[dept.id] || 0);
      } catch (err) {
        setError('Gagal memuat detail jurusan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen text="Memuat detail jurusan..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/jurusan')} />;
  if (!department) return <ErrorState message="Jurusan tidak ditemukan." onRetry={() => navigate('/jurusan')} />;

  const percentage = department.quota > 0 ? Math.min((applicantCount / department.quota) * 100, 100) : 0;
  const isFull = applicantCount >= department.quota;

  return (
    <div className="container-custom py-12">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/jurusan')}>
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Jurusan
      </Button>

      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-navy-900">{department.name}</h1>
              <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded-full text-navy-500">{department.code}</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {isFull ? <XCircle className="h-3 w-3 inline mr-1" /> : <CheckCircle className="h-3 w-3 inline mr-1" />}
                {isFull ? 'Penuh' : 'Tersedia'}
              </span>
            </div>
            <p className="mt-4 text-navy-600 max-w-2xl">{department.description}</p>
          </div>
          {department.image_url && (
            <img src={department.image_url} alt={department.name} className="w-32 h-32 object-cover rounded-lg" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-navy-500">Kuota</p>
            <p className="text-2xl font-bold text-navy-900">{department.quota} siswa</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-navy-500 flex items-center gap-1">
              <Users className="h-4 w-4" /> Pendaftar
            </p>
            <p className="text-2xl font-bold text-navy-900">{applicantCount}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-navy-500">Progress kuota</span>
            <span className="font-medium text-primary-600">{percentage.toFixed(0)}%</span>
          </div>
          <div className="mt-1 w-full bg-slate-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* ⭐ SYARAT NILAI MINIMUM */}
        {department.min_score && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Syarat Nilai Minimum</p>
                <p className="text-sm text-amber-700">
                  Calon siswa harus memiliki nilai rata-rata rapor minimal <strong>{department.min_score}</strong> untuk dapat diterima di jurusan ini.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/pendaftaran">
            <Button className="gap-2 shadow-soft">
              Daftar Sekarang
            </Button>
          </Link>
          <Button variant="outline" onClick={() => navigate('/jurusan')}>
            Lihat Jurusan Lain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;