import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

const StepSchool = ({ formData, updateField, errors }) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('school_origins')
          .select('id, name')
          .order('name');
        if (error) throw error;
        setSchools(data);
      } catch (error) {
        console.error('Gagal ambil data sekolah:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-800">Sekolah Asal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="school_origin_id">Asal Sekolah *</Label>
          <Select
            value={formData.school_origin_id}
            onValueChange={(val) => updateField('school_origin_id', val)}
            disabled={loading}
          >
            <SelectTrigger className={errors.school_origin_id ? 'border-red-500' : ''}>
              <SelectValue placeholder={loading ? 'Memuat...' : 'Pilih asal sekolah'} />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.school_origin_id && <p className="text-xs text-red-500">{errors.school_origin_id}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="graduation_year">Tahun Lulus *</Label>
          <Input
            id="graduation_year"
            value={formData.graduation_year}
            onChange={(e) => updateField('graduation_year', e.target.value)}
            placeholder="2024"
            className={errors.graduation_year ? 'border-red-500' : ''}
          />
          {errors.graduation_year && <p className="text-xs text-red-500">{errors.graduation_year}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepSchool;