import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, User, Phone, MapPin, School, Users, BookOpen, FileText, Clock, Edit, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from '@/components/admin/StatusBadge';

const ApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            department_1:department_1 (id, name, code, description),
            department_2:department_2 (id, name, code),
            school_origin:school_origin_id (id, name, npsn, address)
          `)
          .eq('id', id)
          .single();
        if (error) throw error;
        setApplicant(data);
      } catch (err) {
        setError('Data pendaftar tidak ditemukan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Data tidak ditemukan.'}</p>
        <Button className="mt-4" onClick={() => navigate('/admin/applicants')}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/admin/applicants')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <h2 className="text-2xl font-bold text-navy-900">Detail Pendaftar</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Utama */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Informasi Pendaftaran</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {applicant.registration_number}
                  </Badge>
                  <StatusBadge status={applicant.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-navy-400">Nama Lengkap</p>
                  <p className="font-medium text-navy-800">{applicant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">NISN</p>
                  <p className="font-medium text-navy-800">{applicant.nisn}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">NIK</p>
                  <p className="font-medium text-navy-800">{applicant.nik}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">No. KK</p>
                  <p className="font-medium text-navy-800">{applicant.kk_number}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Tempat, Tanggal Lahir</p>
                  <p className="font-medium text-navy-800">
                    {applicant.birth_place}, {format(new Date(applicant.birth_date), 'd MMMM yyyy', { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Jenis Kelamin</p>
                  <p className="font-medium text-navy-800">
                    {applicant.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Agama</p>
                  <p className="font-medium text-navy-800">{applicant.religion}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Tanggal Daftar</p>
                  <p className="font-medium text-navy-800">
                    {format(new Date(applicant.registered_at), 'd MMMM yyyy, HH:mm', { locale: id })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontak & Alamat */}
          <Card className="border-slate-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Kontak & Alamat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-navy-400">No. HP</p>
                  <p className="font-medium text-navy-800">{applicant.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Email</p>
                  <p className="font-medium text-navy-800">{applicant.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-navy-400">Alamat</p>
                <p className="font-medium text-navy-800">
                  {applicant.address}, {applicant.village}, {applicant.district}, {applicant.regency}, {applicant.province}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Orang Tua */}
          <Card className="border-slate-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Data Orang Tua / Wali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-navy-400">Nama Ayah</p>
                  <p className="font-medium text-navy-800">{applicant.father_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Pekerjaan Ayah</p>
                  <p className="font-medium text-navy-800">{applicant.father_job || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Nama Ibu</p>
                  <p className="font-medium text-navy-800">{applicant.mother_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Pekerjaan Ibu</p>
                  <p className="font-medium text-navy-800">{applicant.mother_job || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">No. HP Orang Tua</p>
                  <p className="font-medium text-navy-800">{applicant.parent_phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-navy-400">Alamat Orang Tua</p>
                <p className="font-medium text-navy-800">{applicant.parent_address || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Kanan */}
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pilihan Jurusan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-navy-400">Jurusan Pilihan 1</p>
                <p className="font-medium text-navy-800">
                  {applicant.department_1?.name || '-'} ({applicant.department_1?.code || '-'})
                </p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Jurusan Pilihan 2</p>
                <p className="font-medium text-navy-800">
                  {applicant.department_2?.name || '-'} ({applicant.department_2?.code || '-'})
                </p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Asal Sekolah</p>
                <p className="font-medium text-navy-800">{applicant.school_origin?.name || '-'}</p>
                {applicant.school_origin?.npsn && (
                  <p className="text-xs text-navy-400">NPSN: {applicant.school_origin.npsn}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-navy-400">Tahun Lulus</p>
                <p className="font-medium text-navy-800">{applicant.graduation_year}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4" />
                Verifikasi
              </Button>
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4" />
                Loloskan
              </Button>
              <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
                <XCircle className="h-4 w-4" />
                Tolak
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Catatan Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;