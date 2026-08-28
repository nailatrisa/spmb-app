import { z } from 'zod';

// Validasi data pribadi
export const personalSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit').regex(/^\d+$/, 'NIK harus angka'),
  nisn: z.string().length(10, 'NISN harus 10 digit').regex(/^\d+$/, 'NISN harus angka'),
  birth_place: z.string().min(2, 'Tempat lahir wajib diisi'),
  birth_date: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  religion: z.string().min(2, 'Agama wajib diisi'),
  kk_number: z.string().min(5, 'Nomor KK wajib diisi'),
});

// Validasi kontak & alamat
export const contactSchema = z.object({
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^\d+$/, 'Harus angka'),
  email: z.string().email('Format email tidak valid'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  village: z.string().min(2, 'Kelurahan/desa wajib diisi'),
  district: z.string().min(2, 'Kecamatan wajib diisi'),
  regency: z.string().min(2, 'Kabupaten/kota wajib diisi'),
  province: z.string().min(2, 'Provinsi wajib diisi'),
});

// Validasi sekolah asal
export const schoolSchema = z.object({
  school_origin_id: z.string().min(1, 'Pilih asal sekolah'),
  graduation_year: z.string().min(4, 'Tahun lulus wajib diisi').regex(/^\d{4}$/, 'Format tahun tidak valid'),
});

// Validasi orang tua
export const parentSchema = z.object({
  father_name: z.string().min(3, 'Nama ayah wajib diisi'),
  mother_name: z.string().min(3, 'Nama ibu wajib diisi'),
  parent_phone: z.string().min(10, 'Nomor telepon orang tua minimal 10 digit').regex(/^\d+$/, 'Harus angka'),
  father_job: z.string().optional(),
  mother_job: z.string().optional(),
  parent_address: z.string().optional(),
});

// Validasi pilihan jurusan
export const departmentSchema = z.object({
  department_1: z.string().min(1, 'Pilih jurusan pertama'),
  department_2: z.string().optional(),
});

// Validasi dokumen (opsional, karena bisa upload nanti)
export const documentSchema = z.object({
  photo_url: z.string().optional(),
  family_card_url: z.string().optional(),
  birth_certificate_url: z.string().optional(),
  diploma_url: z.string().optional(),
});

// Gabungan semua schema
export const registrationSchema = personalSchema
  .merge(contactSchema)
  .merge(schoolSchema)
  .merge(parentSchema)
  .merge(departmentSchema)
  .merge(documentSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;