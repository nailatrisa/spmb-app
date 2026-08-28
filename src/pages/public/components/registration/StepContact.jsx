import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const StepContact = ({ formData, updateField, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-800">Kontak & Alamat</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="phone">Nomor HP *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="08123456789"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="email@domain.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="address">Alamat Lengkap *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Jalan, RT/RW, Kelurahan"
            rows={2}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="village">Kelurahan/Desa *</Label>
          <Input
            id="village"
            value={formData.village}
            onChange={(e) => updateField('village', e.target.value)}
            placeholder="Kelurahan/Desa"
            className={errors.village ? 'border-red-500' : ''}
          />
          {errors.village && <p className="text-xs text-red-500">{errors.village}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="district">Kecamatan *</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => updateField('district', e.target.value)}
            placeholder="Kecamatan"
            className={errors.district ? 'border-red-500' : ''}
          />
          {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="regency">Kabupaten/Kota *</Label>
          <Input
            id="regency"
            value={formData.regency}
            onChange={(e) => updateField('regency', e.target.value)}
            placeholder="Kabupaten/Kota"
            className={errors.regency ? 'border-red-500' : ''}
          />
          {errors.regency && <p className="text-xs text-red-500">{errors.regency}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="province">Provinsi *</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => updateField('province', e.target.value)}
            placeholder="Provinsi"
            className={errors.province ? 'border-red-500' : ''}
          />
          {errors.province && <p className="text-xs text-red-500">{errors.province}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepContact;