import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { BookOpen, Users, Eye, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import ErrorState from '../ErrorState';

const DepartmentsPreview = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getDepartmentsWithCount();
        setDepartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner fullScreen={false} text="Memuat jurusan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-navy-500">Belum ada jurusan yang tersedia.</p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Jurusan <span className="text-primary-600">Unggulan</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Pilih jurusan yang sesuai dengan minat dan bakatmu untuk masa depan yang cerah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.slice(0, 6).map((dept) => {
            const percentage = dept.quota > 0 ? Math.min((dept.applicant_count / dept.quota) * 100, 100) : 0;
            const isFull = percentage >= 100;

            return (
              <Card key={dept.id} className="border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-navy-800">{dept.name}</CardTitle>
                      <p className="text-xs text-navy-400 font-mono">{dept.code}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {isFull ? 'Penuh' : 'Tersedia'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-navy-500 line-clamp-2">{dept.description}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs text-navy-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dept.applicant_count} pendaftar
                      </span>
                      <span>{dept.quota} kuota</span>
                    </div>
                    <Progress value={percentage} className="h-1.5 bg-slate-100" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/jurusan/${dept.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full gap-2 border-slate-200 hover:border-primary-300">
                      <Eye className="h-4 w-4" />
                      Lihat Detail
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/jurusan">
            <Button variant="outline" className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50">
              Lihat Semua Jurusan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsPreview;