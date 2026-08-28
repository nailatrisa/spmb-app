import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
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
      <h3 className="text-lg font-semibold text-navy-800">Pilihan Jurusan</h3>
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
                  {dept.name} ({dept.code})
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
                  {dept.name} ({dept.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepDepartments;