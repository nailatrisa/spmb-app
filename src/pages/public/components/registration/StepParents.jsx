import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const StepParents = ({ formData, updateField, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-800">Data Orang Tua / Wali</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="father_name">Nama Ayah *</Label>
          <Input
            id="father_name"
            value={formData.father_name}
            onChange={(e) => updateField('father_name', e.target.value)}
            placeholder="Nama ayah kandung"
            className={errors.father_name ? 'border-red-500' : ''}
          />
          {errors.father_name && <p className="text-xs text-red-500">{errors.father_name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="father_job">Pekerjaan Ayah</Label>
          <Input
            id="father_job"
            value={formData.father_job}
            onChange={(e) => updateField('father_job', e.target.value)}
            placeholder="Pekerjaan ayah"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="mother_name">Nama Ibu *</Label>
          <Input
            id="mother_name"
            value={formData.mother_name}
            onChange={(e) => updateField('mother_name', e.target.value)}
            placeholder="Nama ibu kandung"
            className={errors.mother_name ? 'border-red-500' : ''}
          />
          {errors.mother_name && <p className="text-xs text-red-500">{errors.mother_name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="mother_job">Pekerjaan Ibu</Label>
          <Input
            id="mother_job"
            value={formData.mother_job}
            onChange={(e) => updateField('mother_job', e.target.value)}
            placeholder="Pekerjaan ibu"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="parent_phone">Nomor HP Orang Tua *</Label>
          <Input
            id="parent_phone"
            value={formData.parent_phone}
            onChange={(e) => updateField('parent_phone', e.target.value)}
            placeholder="08123456789"
            className={errors.parent_phone ? 'border-red-500' : ''}
          />
          {errors.parent_phone && <p className="text-xs text-red-500">{errors.parent_phone}</p>}
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="parent_address">Alamat Orang Tua</Label>
          <Textarea
            id="parent_address"
            value={formData.parent_address}
            onChange={(e) => updateField('parent_address', e.target.value)}
            placeholder="Alamat lengkap orang tua (jika berbeda)"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default StepParents;