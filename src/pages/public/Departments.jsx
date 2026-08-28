import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDepartmentsWithCounts } from '@/services/departmentService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { BookOpen, Users, ChevronRight, CheckCircle, XCircle, Award } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartmentsWithCounts();
      setDepartments(data);
    } catch (err) {
      setError('Gagal memuat data jurusan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Memuat jurusan..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!departments.length) return <EmptyState title="Belum ada jurusan" description="Belum ada jurusan yang tersedia saat ini." />;

  return (
    <div className="container-custom py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900">Daftar Jurusan</h1>
        <p className="mt-2 text-navy-500">Pilih jurusan yang sesuai dengan minat dan bakatmu.</p>
        <p className="mt-1 text-sm text-navy-400">Setiap jurusan memiliki syarat nilai minimum yang harus dipenuhi.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const percentage = dept.quota > 0 ? Math.min((dept.applicant_count / dept.quota) * 100, 100) : 0;
          const isFull = dept.applicant_count >= dept.quota;
          return (
            <Card key={dept.id} className="border-slate-200 shadow-soft card-hover flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-navy-800">{dept.name}</CardTitle>
                    <p className="text-xs text-navy-400 font-mono">{dept.code}</p>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isFull ? <XCircle className="h-3 w-3 inline mr-1" /> : <CheckCircle className="h-3 w-3 inline mr-1" />}
                    {isFull ? 'Penuh' : 'Tersedia'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-navy-600 line-clamp-3">{dept.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-navy-500 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {dept.applicant_count} / {dept.quota} pendaftar
                  </span>
                  <span className="font-medium text-primary-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="mt-1 w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {/* ⭐ BADGE NILAI MINIMUM */}
                {dept.min_score && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Nilai min: {dept.min_score}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to={`/jurusan/${dept.id}`} className="w-full">
                  <Button variant="outline" className="w-full gap-2 border-slate-300 hover:border-primary-500">
                    Lihat Detail <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;