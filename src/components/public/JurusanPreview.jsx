import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../../services/departmentService';

const JurusanPreview = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts.slice(0, 4));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 bg-slate-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => {
          const percentage =
            dept.quota > 0
              ? Math.min((0 / dept.quota) * 100, 100)
              : 0;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow border border-slate-100 p-5 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-navy-800">
                {dept.name}
              </h3>

              <p className="text-xs text-navy-500 mt-1 line-clamp-2">
                {dept.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-navy-600">
                  0 / {dept.quota}
                </span>

                <span className="text-xs font-medium text-blue-600">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <Link
                to={`/jurusan/${dept.id}`}
                className="text-blue-600 text-sm font-medium hover:underline block mt-3"
              >
                Lihat Detail ?
              </Link>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/jurusan"
          className="inline-block border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50 transition"
        >
          Lihat Semua Jurusan
        </Link>
      </div>
    </div>
  );
};

export default JurusanPreview;
