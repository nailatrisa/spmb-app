import { useState } from 'react';

const initialFormData = {
  // Step 1: Data Pribadi
  full_name: '',
  nik: '',
  nisn: '',
  birth_place: '',
  birth_date: '',
  gender: '',
  religion: '',
  kk_number: '',
  
  // Step 2: Kontak & Alamat
  phone: '',
  email: '',
  address: '',
  village: '',
  district: '',
  regency: '',
  province: '',
  
  // Step 3: Sekolah Asal
  school_origin_id: '',
  graduation_year: '',
  
  // Step 4: Orang Tua
  father_name: '',
  mother_name: '',
  parent_phone: '',
  father_job: '',
  mother_job: '',
  parent_address: '',
  
  // Step 5: Pilihan Jurusan
  department_1: '',
  department_2: '',
  
  // Step 6: Dokumen (akan diisi dengan file objects)
  photo: null,
  family_card: null,
  birth_certificate: null,
  diploma: null,
};

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Hapus error untuk field yang sudah diisi
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateFile = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    errors,
    setErrors,
    updateField,
    updateFile,
    goToStep,
    nextStep,
    prevStep,
    resetForm,
  };
};