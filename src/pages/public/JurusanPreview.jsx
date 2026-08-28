import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '@/services/departmentService';
import { getDepartmentApplicationCounts } from '@/services/departmentService';
import { Button } from '@/components/ui/button';
import SkeletonCard from '@/components/SkeletonCard';
import { BookOpen, Users, ChevronRight, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const JurusanPreview = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);

        const countMap = {};
        for (const dept of depts) {
          const { count, error } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .or(`department_1.eq.${dept.id},department_2.eq.${dept.id}`);
          if (!error) {
            countMap[dept.id] = count || 0;
          }
        }
        setCounts(countMap);
      } catch (error) {
        console.error('Gagal ambil jurusan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} type="department" />)}
      </div>
    );
  }

  const display = departments.slice(0, 4);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {display.map((dept) => {
          const count = counts[dept.id] || 0;
          const percentage = dept.quota > 0 ? Math.min((count / dept.quota) * 100, 100) : 0;
          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 card-hover">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold text-navy-800">{dept.name}</h3>
              </div>
              <p className="text-xs text-navy-500 mt-1 line-clamp-2">{dept.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-navy-600">
                  <Users className="h-3 w-3 inline mr-1" />
                  {count} / {dept.quota}
                </span>
                <span className="text-xs font-medium text-primary-600">{percentage.toFixed(0)}%</span>
              </div>
              <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
              </div>
              {/* ⭐ BADGE NILAI MINIMUM */}
              {dept.min_score && (
                <div className="mt-2 flex items-center gap-1">
                  <Award className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    min {dept.min_score}
                  </span>
                </div>
              )}
              <Link to={`/jurusan/${dept.id}`}>
                <Button variant="link" size="sm" className="mt-3 p-0 h-auto text-primary-600 gap-1">
                  Lihat Detail <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-8">
        <Link to="/jurusan">
          <Button variant="outline" className="gap-2">
            Lihat Semua Jurusan <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JurusanPreview;