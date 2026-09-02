import React, { useState, useEffect, useRef } from 'react';
import { getSchoolSettings, updateSchoolSettings } from '../../services/settingsService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, Save, Upload, X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    school_name: '',
    address: '',
    phone: '',
    npsn: '',
    academic_year: '',
    target_students: '',
    description: '',
    logo_url: '',
    registration_deadline: '', // 🔥 TAMBAHKAN
    is_open: true,              // 🔥 TAMBAHKAN
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchoolSettings();
      setSettings(data);
      setFormData({
        school_name: data.school_name || '',
        address: data.address || '',
        phone: data.phone || '',
        npsn: data.npsn || '',
        academic_year: data.academic_year || '',
        target_students: data.target_students || '',
        description: data.description || '',
        logo_url: data.logo_url || '',
        registration_deadline: data.registration_deadline || '',
        is_open: data.is_open !== false,
      });
      if (data.logo_url) {
        setLogoPreview(data.logo_url);
      }
    } catch (err) {
      setError('Gagal memuat pengaturan sekolah.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diizinkan');
        e.target.value = '';
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({ ...formData, logo_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      let logoUrl = formData.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('school-logo')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: true,
          });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('school-logo')
          .getPublicUrl(fileName);
        logoUrl = urlData.publicUrl;
      }

      const dataToUpdate = {
        ...formData,
        target_students: parseInt(formData.target_students) || 0,
        logo_url: logoUrl,
      };

      await updateSchoolSettings(settings.id, dataToUpdate);
      setSuccess(true);
      await fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pengaturan.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Pengaturan Sekolah</h2>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Informasi Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Pengaturan berhasil disimpan!
              </div>
            )}

            {/* Nama Sekolah */}
            <div className="space-y-1">
              <Label htmlFor="school_name">Nama Sekolah *</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                placeholder="SMK Negeri 1 Ponorogo"
                required
              />
            </div>

            {/* Alamat */}
            <div className="space-y-1">
              <Label htmlFor="address">Alamat *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Merdeka No. 1, Ponorogo"
                rows={2}
                required
              />
            </div>

            {/* Telepon & NPSN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(0352) 123456"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="npsn">NPSN *</Label>
                <Input
                  id="npsn"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  placeholder="12345678"
                  required
                />
              </div>
            </div>

            {/* Tahun Ajaran & Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="academic_year">Tahun Ajaran *</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  placeholder="2026/2027"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="target_students">Target Siswa *</Label>
                <Input
                  id="target_students"
                  type="number"
                  value={formData.target_students}
                  onChange={(e) => setFormData({ ...formData, target_students: e.target.value })}
                  placeholder="500"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <Label htmlFor="description">Deskripsi Sekolah</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang sekolah..."
                rows={3}
              />
            </div>

            {/* ============================================================
                🔥 TAMBAHAN: DEADLINE & STATUS PENDAFTARAN
            ============================================================ */}
            <div className="space-y-1">
              <Label htmlFor="registration_deadline">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Deadline Pendaftaran
                </div>
              </Label>
              <Input
                id="registration_deadline"
                type="datetime-local"
                value={formData.registration_deadline || ''}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
              />
              <p className="text-xs text-slate-400">
                Pendaftaran akan ditutup otomatis setelah tanggal dan jam ini.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_open"
                checked={formData.is_open}
                onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="is_open" className="cursor-pointer font-normal">
                Buka Pendaftaran (centang jika pendaftaran aktif)
              </Label>
            </div>

            {/* Logo */}
            <div className="space-y-1">
              <Label>Logo Sekolah</Label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-24 h-24 object-contain rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm cursor-pointer hover:border-primary-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-1" />
                      Upload
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="text-xs text-navy-400">
                  <p>Upload logo (max 2MB)</p>
                  <p>Format: JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="gap-2 bg-primary-600 hover:bg-primary-700" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Settings;