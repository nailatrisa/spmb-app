import React from 'react';
import { CheckCircle, User, Phone, School, Users, BookOpen, FileText, Award } from 'lucide-react';

const StepReview = ({ formData, departments, schools }) => {
  const getDepartmentName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept ? `${dept.name} (${dept.code})` : '-';
  };

  const getDepartmentMinScore = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept?.min_score || '-';
  };

  const getSchoolName = (id) => {
    const school = schools.find(s => s.id === id);
    return school ? school.name : '-';
  };

  const renderSection = (title, icon, fields) => {
    const hasData = Object.values(fields).some(v => v);
    if (!hasData) return null;
    
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
          {icon} {title}
        </h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {Object.entries(fields).map(([key, value]) => {
            if (!value) return null;
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={key} className="flex flex-col">
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd className="font-medium text-slate-700">{value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  };

  const personalFields = {
    'Nama Lengkap': formData.full_name,
    NIK: formData.nik,
    NISN: formData.nisn,
    'Tempat Lahir': formData.birth_place,
    'Tanggal Lahir': formData.birth_date,
    'Jenis Kelamin': formData.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    Agama: formData.religion,
    'No. KK': formData.kk_number,
  };

  const contactFields = {
    'No. HP': formData.phone,
    Email: formData.email,
    Alamat: formData.address,
    Kelurahan: formData.village,
    Kecamatan: formData.district,
    Kabupaten: formData.regency,
    Provinsi: formData.province,
  };

  const schoolFields = {
    'Asal Sekolah': getSchoolName(formData.school_origin_id),
    'Tahun Lulus': formData.graduation_year,
  };

  const parentsFields = {
    'Nama Ayah': formData.father_name,
    'Pekerjaan Ayah': formData.father_job,
    'Nama Ibu': formData.mother_name,
    'Pekerjaan Ibu': formData.mother_job,
    'No. HP Orang Tua': formData.parent_phone,
    'Alamat Orang Tua': formData.parent_address,
  };

  // ✅ TAMBAHKAN NILAI RATA-RATA & SYARAT
  const deptFields = {
    'Jurusan 1': getDepartmentName(formData.department_1),
    'Nilai Minimum Jurusan 1': getDepartmentMinScore(formData.department_1),
    'Jurusan 2': formData.department_2 ? getDepartmentName(formData.department_2) : '-',
    'Nilai Minimum Jurusan 2': formData.department_2 ? getDepartmentMinScore(formData.department_2) : '-',
    'Nilai Rata-rata Rapor / SKL': formData.average_score || '-',
  };

  // ✅ CEK KELULUSAN SYARAT
  const getSyaratStatus = () => {
    const score = parseFloat(formData.average_score);
    const minScore = formData.department_1 ? getDepartmentMinScore(formData.department_1) : '-';
    if (!score || minScore === '-') return 'Belum ada nilai';
    return score >= parseFloat(minScore) ? '✅ Memenuhi syarat' : '❌ Tidak memenuhi syarat';
  };

  const docFields = {
    Pasfoto: formData.photo ? '✓ Terupload' : '✗ Belum',
    'Kartu Keluarga': formData.family_card ? '✓ Terupload' : '✗ Belum',
    'Akta Lahir': formData.birth_certificate ? '✓ Terupload' : '✗ Belum',
    Ijazah: formData.diploma ? '✓ Terupload' : '✗ Belum',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        Review Data Pendaftaran
      </h3>
      <p className="text-sm text-slate-500">Periksa kembali data Anda sebelum submit.</p>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {renderSection('Data Pribadi', <User className="h-4 w-4" />, personalFields)}
        {renderSection('Kontak & Alamat', <Phone className="h-4 w-4" />, contactFields)}
        {renderSection('Sekolah Asal', <School className="h-4 w-4" />, schoolFields)}
        {renderSection('Orang Tua', <Users className="h-4 w-4" />, parentsFields)}
        {renderSection('Pilihan Jurusan & Nilai', <BookOpen className="h-4 w-4" />, deptFields)}
        
        {/* ✅ TAMPILKAN STATUS SYARAT */}
        {formData.average_score && formData.department_1 && (
          <div className={`rounded-lg p-3 ${parseFloat(formData.average_score) >= parseFloat(getDepartmentMinScore(formData.department_1)) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">Status Nilai</p>
                <p className="text-sm">
                  {getSyaratStatus()}
                  <span className="text-xs text-slate-400 ml-2">
                    (Nilai: {formData.average_score} | Min: {getDepartmentMinScore(formData.department_1)})
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {renderSection('Dokumen', <FileText className="h-4 w-4" />, docFields)}
      </div>
    </div>
  );
};

export default StepReview;