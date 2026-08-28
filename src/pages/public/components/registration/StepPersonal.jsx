import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StepPersonal = ({ formData, updateField, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-800">Data Pribadi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="full_name">Nama Lengkap *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
            placeholder="Nama sesuai ijazah"
            className={errors.full_name ? 'border-red-500' : ''}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="nik">NIK *</Label>
          <Input
            id="nik"
            value={formData.nik}
            onChange={(e) => updateField('nik', e.target.value)}
            placeholder="16 digit"
            maxLength={16}
            className={errors.nik ? 'border-red-500' : ''}
          />
          {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="nisn">NISN *</Label>
          <Input
            id="nisn"
            value={formData.nisn}
            onChange={(e) => updateField('nisn', e.target.value)}
            placeholder="Nomor Induk Siswa Nasional"
            className={errors.nisn ? 'border-red-500' : ''}
          />
          {errors.nisn && <p className="text-xs text-red-500">{errors.nisn}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="kk_number">Nomor KK *</Label>
          <Input
            id="kk_number"
            value={formData.kk_number}
            onChange={(e) => updateField('kk_number', e.target.value)}
            placeholder="Nomor Kartu Keluarga"
            className={errors.kk_number ? 'border-red-500' : ''}
          />
          {errors.kk_number && <p className="text-xs text-red-500">{errors.kk_number}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="birth_place">Tempat Lahir *</Label>
          <Input
            id="birth_place"
            value={formData.birth_place}
            onChange={(e) => updateField('birth_place', e.target.value)}
            placeholder="Kota/Kabupaten"
            className={errors.birth_place ? 'border-red-500' : ''}
          />
          {errors.birth_place && <p className="text-xs text-red-500">{errors.birth_place}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="birth_date">Tanggal Lahir *</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => updateField('birth_date', e.target.value)}
            className={errors.birth_date ? 'border-red-500' : ''}
          />
          {errors.birth_date && <p className="text-xs text-red-500">{errors.birth_date}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="gender">Jenis Kelamin *</Label>
          <Select
            value={formData.gender}
            onValueChange={(val) => updateField('gender', val)}
          >
            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="religion">Agama *</Label>
          <Select
            value={formData.religion}
            onValueChange={(val) => updateField('religion', val)}
          >
            <SelectTrigger className={errors.religion ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih agama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Islam">Islam</SelectItem>
              <SelectItem value="Kristen">Kristen</SelectItem>
              <SelectItem value="Katolik">Katolik</SelectItem>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Buddha">Buddha</SelectItem>
              <SelectItem value="Konghucu">Konghucu</SelectItem>
            </SelectContent>
          </Select>
          {errors.religion && <p className="text-xs text-red-500">{errors.religion}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepPersonal;