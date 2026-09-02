import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationForm } from '../../hooks/useRegistrationForm';
import { getDepartments } from '../../services/departmentService';
import { getSchoolOrigins } from '../../services/schoolService';
import { getSchoolSettings } from '../../services/settingsService';
import { uploadMultipleFiles } from '../../services/uploadService';
import { submitApplication } from '../../services/applicationService';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle, Clock } from 'lucide-react';

// Import step components
import StepPersonal from './components/registration/StepPersonal';
import StepContact from './components/registration/StepContact';
import StepSchool from './components/registration/StepSchool';
import StepParents from './components/registration/StepParents';
import StepDepartments from './components/registration/StepDepartments';
import StepDocuments from './components/registration/StepDocuments';
import StepReview from './components/registration/StepReview';

const steps = [
  { id: 'personal', label: 'Data Pribadi', component: StepPersonal },
  { id: 'contact', label: 'Kontak & Alamat', component: StepContact },
  { id: 'school', label: 'Sekolah Asal', component: StepSchool },
  { id: 'parents', label: 'Orang Tua', component: StepParents },
  { id: 'departments', label: 'Pilihan Jurusan', component: StepDepartments },
  { id: 'documents', label: 'Dokumen', component: StepDocuments },
  { id: 'review', label: 'Review', component: StepReview },
];

const Registration = () => {
  const navigate = useNavigate();
  const {
    formData,
    currentStep,
    errors,
    updateField,
    updateFile,
    nextStep,
    prevStep,
    resetForm,
    setErrors,
  } = useRegistrationForm();

  const [departments, setDepartments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, schs, settingsData] = await Promise.all([
          getDepartments(),
          getSchoolOrigins(),
          getSchoolSettings().catch(() => null),
        ]);
        setDepartments(depts);
        setSchools(schs);
        setSettings(settingsData);
      } catch (error) {
        console.error('Gagal ambil data:', error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchData();
  }, []);

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 0: // Personal
        if (!formData.full_name.trim()) { newErrors.full_name = 'Nama lengkap wajib diisi'; isValid = false; }
        if (!formData.nik.trim() || formData.nik.length < 16) { newErrors.nik = 'NIK harus 16 digit'; isValid = false; }
        if (!formData.nisn.trim()) { newErrors.nisn = 'NISN wajib diisi'; isValid = false; }
        if (!formData.kk_number.trim()) { newErrors.kk_number = 'Nomor KK wajib diisi'; isValid = false; }
        if (!formData.birth_place.trim()) { newErrors.birth_place = 'Tempat lahir wajib diisi'; isValid = false; }
        if (!formData.birth_date) { newErrors.birth_date = 'Tanggal lahir wajib diisi'; isValid = false; }
        if (!formData.gender) { newErrors.gender = 'Jenis kelamin wajib dipilih'; isValid = false; }
        if (!formData.religion) { newErrors.religion = 'Agama wajib dipilih'; isValid = false; }
        break;
      case 1: // Contact
        if (!formData.phone.trim()) { newErrors.phone = 'Nomor HP wajib diisi'; isValid = false; }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email tidak valid'; isValid = false; }
        if (!formData.address.trim()) { newErrors.address = 'Alamat wajib diisi'; isValid = false; }
        if (!formData.village.trim()) { newErrors.village = 'Kelurahan wajib diisi'; isValid = false; }
        if (!formData.district.trim()) { newErrors.district = 'Kecamatan wajib diisi'; isValid = false; }
        if (!formData.regency.trim()) { newErrors.regency = 'Kabupaten wajib diisi'; isValid = false; }
        if (!formData.province.trim()) { newErrors.province = 'Provinsi wajib diisi'; isValid = false; }
        break;
      case 2: // School
        if (!formData.school_origin_id) { newErrors.school_origin_id = 'Asal sekolah wajib dipilih'; isValid = false; }
        if (!formData.graduation_year.trim()) { newErrors.graduation_year = 'Tahun lulus wajib diisi'; isValid = false; }
        break;
      case 3: // Parents
        if (!formData.father_name.trim()) { newErrors.father_name = 'Nama ayah wajib diisi'; isValid = false; }
        if (!formData.mother_name.trim()) { newErrors.mother_name = 'Nama ibu wajib diisi'; isValid = false; }
        if (!formData.parent_phone.trim()) { newErrors.parent_phone = 'Nomor HP orang tua wajib diisi'; isValid = false; }
        break;
      case 4: // Departments
        if (!formData.department_1) { newErrors.department_1 = 'Pilih minimal 1 jurusan'; isValid = false; }
        break;
      case 5: // Documents
        if (!formData.photo) { newErrors.photo = 'Pas foto wajib diupload'; isValid = false; }
        if (!formData.family_card) { newErrors.family_card = 'Kartu Keluarga wajib diupload'; isValid = false; }
        if (!formData.birth_certificate) { newErrors.birth_certificate = 'Akta Lahir wajib diupload'; isValid = false; }
        if (!formData.diploma) { newErrors.diploma = 'Ijazah/SKL wajib diupload'; isValid = false; }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    // Validasi semua step
    for (let i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        // Jika ada error, pindah ke step yang error
        // Tapi kita sudah di step review, jadi kita tampilkan alert
        alert('Ada data yang belum lengkap. Silakan periksa kembali.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Upload semua dokumen
      const fileFields = {
        photo: formData.photo,
        family_card: formData.family_card,
        birth_certificate: formData.birth_certificate,
        diploma: formData.diploma,
      };
      const fileUrls = await uploadMultipleFiles(fileFields);

      // 2. Submit data ke database
      const result = await submitApplication(formData, fileUrls);

      // 3. Reset form dan redirect ke halaman sukses
      resetForm();
      navigate(`/pendaftaran/berhasil?registration_number=${result.registration_number}`);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="container-custom py-12 max-w-4xl">
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Form Pendaftaran</h1>
        <p className="text-navy-500 text-sm mb-6">Lengkapi data di bawah ini dengan benar.</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 ${idx <= currentStep ? 'text-primary-600' : 'text-slate-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  idx < currentStep ? 'bg-primary-600 text-white' :
                  idx === currentStep ? 'bg-primary-100 text-primary-700 border-2 border-primary-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
                </span>
                <span className={`text-sm font-medium hidden sm:inline ${
                  idx === currentStep ? 'text-navy-800' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-primary-600' : 'bg-slate-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Registration Status Banner */}
        {!loadingSettings && settings && (
          <div className={`mb-6 p-4 md:p-5 rounded-lg border flex items-start gap-3 ${
            settings.is_open
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className={`flex-shrink-0 mt-0.5 ${
              settings.is_open ? 'text-blue-600' : 'text-red-600'
            }`}>
              {settings.is_open ? (
                <Clock className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {settings.is_open ? (
                <>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Pendaftaran Dibuka
                  </p>
                  <p className="text-sm text-blue-800">
                    Pendaftaran dibuka hingga{' '}
                    <span className="font-semibold">
                      {settings.registration_deadline
                        ? new Date(settings.registration_deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'tanggal yang ditentukan'}
                    </span>
                    . Pastikan Anda menyelesaikan pendaftaran sebelum batas waktu.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Pendaftaran Ditutup
                  </p>
                  <p className="text-sm text-red-800">
                    Mohon maaf, periode pendaftaran telah berakhir. Silakan hubungi sekolah untuk informasi lebih lanjut.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="min-h-[400px]">
          <CurrentStepComponent
            formData={formData}
            updateField={updateField}
            updateFile={updateFile}
            errors={errors}
            departments={departments}
            schools={schools}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-primary-600 hover:bg-primary-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit Pendaftaran
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Selanjutnya
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;