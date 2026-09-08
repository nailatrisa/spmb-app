import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDepartmentsWithCounts } from '@/services/departmentService';

const formatScore = (value) => value === null || value === undefined || value === '' ? '-' : value;

const StepDepartments = ({ formData, updateField, errors }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDepartments = departments.filter((department) =>
    [formData.department_1, formData.department_2].includes(String(department.id))
  );

  const getProgress = (department) => {
    if (!department.quota) return 0;
    return Math.min(Math.round(((department.applicant_count || 0) / department.quota) * 100), 100);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartmentsWithCounts();
        setDepartments(data);
      } catch (error) {
        console.error('Gagal ambil jurusan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Pilihan Jurusan & Nilai</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="department_1">Jurusan Pilihan 1 *</Label>
          <Select
            value={formData.department_1}
            onValueChange={(val) => updateField('department_1', val)}
            disabled={loading}
          >
            <SelectTrigger className={errors.department_1 ? 'border-red-500' : ''}>
              <SelectValue placeholder={loading ? 'Memuat...' : 'Pilih jurusan utama'} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  <span className="font-medium">{dept.name}</span> ({dept.code}) - Min. {formatScore(dept.min_score)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department_1 && <p className="text-xs text-red-500">{errors.department_1}</p>}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="department_2">Jurusan Pilihan 2 (Opsional)</Label>
          <Select
            value={formData.department_2}
            onValueChange={(val) => updateField('department_2', val === 'none' ? '' : val)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jurusan cadangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tidak ada</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  <span className="font-medium">{dept.name}</span> ({dept.code}) - Min. {formatScore(dept.min_score)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDepartments.length > 0 && (
        <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Ringkasan pilihan jurusan</p>
            <p className="text-xs text-slate-500">Pastikan pilihan dan nilai minimum sudah sesuai.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {selectedDepartments.map((department) => {
              const progress = getProgress(department);
              return (
                <div key={department.id} className="rounded-lg border border-white bg-white p-3 shadow-sm">
                  <p className="font-semibold text-slate-800">{department.name}</p>
                  <p className="text-xs font-medium text-blue-700">Kode: {department.code}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <span>Min. nilai: <strong className="text-slate-800">{formatScore(department.min_score)}</strong></span>
                    <span>Kuota: <strong className="text-slate-800">{formatScore(department.quota)}</strong></span>
                  </div>
                  {department.quota && (
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                        <span>Progress pendaftar</span><span>{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INPUT NILAI RATA-RATA */}
      <div className="space-y-1">
        <Label htmlFor="average_score">
          Nilai Rata-rata Rapor / SKL *
          <span className="text-xs text-slate-400 ml-1">
            (rata-rata rapor semester 1-5 atau nilai SKL, skala 0-100)
          </span>
        </Label>
        <Input
          id="average_score"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={formData.average_score}
          onChange={(e) => updateField('average_score', e.target.value)}
          placeholder="Contoh: 85.5"
          className={errors.average_score ? 'border-red-500' : ''}
        />
        {errors.average_score && <p className="text-xs text-red-500">{errors.average_score}</p>}
        <p className="text-xs text-slate-400">
          ℹ️ Nilai akan dibandingkan dengan nilai minimum jurusan yang dipilih.
        </p>
      </div>
    </div>
  );
};

export default StepDepartments;