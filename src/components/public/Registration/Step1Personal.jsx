import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const Step1Personal = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-navy-800">Data Pribadi</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nama Lengkap *</Label>
          <Input
            id="full_name"
            value={data.full_name || ''}
            onChange={(e) => onChange('full_name', e.target.value)}
            placeholder="Masukkan nama lengkap"
            className={errors.full_name ? 'border-red-500' : ''}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nik">NIK *</Label>
          <Input
            id="nik"
            value={data.nik || ''}
            onChange={(e) => onChange('nik', e.target.value.replace(/\D/g, ''))}
            placeholder="16 digit NIK"
            maxLength={16}
            className={errors.nik ? 'border-red-500' : ''}
          />
          {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nisn">NISN *</Label>
          <Input
            id="nisn"
            value={data.nisn || ''}
            onChange={(e) => onChange('nisn', e.target.value.replace(/\D/g, ''))}
            placeholder="10 digit NISN"
            maxLength={10}
            className={errors.nisn ? 'border-red-500' : ''}
          />
          {errors.nisn && <p className="text-xs text-red-500">{errors.nisn}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_place">Tempat Lahir *</Label>
          <Input
            id="birth_place"
            value={data.birth_place || ''}
            onChange={(e) => onChange('birth_place', e.target.value)}
            placeholder="Kota/Kabupaten"
            className={errors.birth_place ? 'border-red-500' : ''}
          />
          {errors.birth_place && <p className="text-xs text-red-500">{errors.birth_place}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">Tanggal Lahir *</Label>
          <Input
            id="birth_date"
            type="date"
            value={data.birth_date || ''}
            onChange={(e) => onChange('birth_date', e.target.value)}
            className={errors.birth_date ? 'border-red-500' : ''}
          />
          {errors.birth_date && <p className="text-xs text-red-500">{errors.birth_date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin *</Label>
          <Select
            value={data.gender || ''}
            onValueChange={(val) => onChange('gender', val)}
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

        <div className="space-y-2">
          <Label htmlFor="religion">Agama *</Label>
          <Select
            value={data.religion || ''}
            onValueChange={(val) => onChange('religion', val)}
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

export default Step1Personal;