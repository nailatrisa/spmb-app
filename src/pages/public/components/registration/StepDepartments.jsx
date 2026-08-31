import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDepartments } from '@/services/departmentService';

const StepDepartments = ({ formData, updateField, errors }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
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
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code}) - Min Nilai: {dept.min_score || '-'}
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
            onValueChange={(val) => updateField('department_2', val)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jurusan cadangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tidak ada</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code}) - Min Nilai: {dept.min_score || '-'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ✅ INPUT NILAI RATA-RATA */}
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