import { supabase } from '../lib/supabase';

// ============================================================
// 1. SUBMIT PENDAFTARAN
// ============================================================
export const submitApplication = async (formData, fileUrls) => {
  // Siapkan data untuk insert
  const applicationData = {
    full_name: formData.full_name,
    nik: formData.nik,
    nisn: formData.nisn,
    birth_place: formData.birth_place,
    birth_date: formData.birth_date,
    gender: formData.gender,
    religion: formData.religion,
    kk_number: formData.kk_number,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    village: formData.village,
    district: formData.district,
    regency: formData.regency,
    province: formData.province,
    school_origin_id: formData.school_origin_id || null,
    graduation_year: formData.graduation_year,
    father_name: formData.father_name,
    mother_name: formData.mother_name,
    parent_phone: formData.parent_phone,
    father_job: formData.father_job || '',
    mother_job: formData.mother_job || '',
    parent_address: formData.parent_address || '',
    department_1: formData.department_1,
    department_2: formData.department_2 || null,
    status: 'pending',
    // File URLs dari upload
    photo_url: fileUrls.photo_url || null,
    family_card_url: fileUrls.family_card_url || null,
    birth_certificate_url: fileUrls.birth_certificate_url || null,
    diploma_url: fileUrls.diploma_url || null,
  };

  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select('registration_number, id')
    .single();

  if (error) {
    console.error('Submit error:', error);
    throw error;
  }

  return data;
};

// ============================================================
// 2. CEK STATUS BERDASARKAN NOMOR PENDAFTARAN
// ============================================================
export const getApplicationByRegistrationNumber = async (registrationNumber) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      department_1:department_1 (id, name, code),
      department_2:department_2 (id, name, code),
      school_origin:school_origin_id (id, name)
    `)
    .eq('registration_number', registrationNumber)
    .single();

  if (error) throw error;
  return data;
};

// ============================================================
// 3. TIMELINE UNTUK TRACKING STATUS
// ============================================================
export const getApplicationTimeline = (status) => {
  const steps = [
    { key: 'pending', label: 'Formulir Diterima', icon: '📋' },
    { key: 'verified', label: 'Data Diperiksa', icon: '🔍' },
    { key: 'accepted', label: 'Diterima', icon: '✅' },
    { key: 'rejected', label: 'Ditolak', icon: '❌' },
  ];

  const statusIndex = steps.findIndex(s => s.key === status);
  const currentIndex = statusIndex >= 0 ? statusIndex : 0;

  return steps.map((step, index) => ({
    ...step,
    isCompleted: index <= currentIndex && status !== 'rejected',
    isActive: index === currentIndex,
    isRejected: status === 'rejected' && index === steps.length - 1,
  }));
};

// ============================================================
// 4. JUMLAH PENDAFTAR (UNTUK COUNTER)
// ============================================================
export const getApplicationCount = async () => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
};

// ============================================================
// 5. STATISTIK UNTUK ADMIN DASHBOARD
// ============================================================
export const getApplicationStats = async () => {
  // Total
  const total = await getApplicationCount();

  // Per status
  const statuses = ['pending', 'verified', 'accepted', 'rejected'];
  const statusCounts = {};
  for (const status of statuses) {
    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);
    if (error) throw error;
    statusCounts[status] = count;
  }

  // Hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount, error: todayError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .gte('registered_at', today.toISOString());
  if (todayError) throw todayError;

  // Bulan ini
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const { count: monthCount, error: monthError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .gte('registered_at', monthStart.toISOString());
  if (monthError) throw monthError;

  // Tahun ini
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const { count: yearCount, error: yearError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .gte('registered_at', yearStart.toISOString());
  if (yearError) throw yearError;

  return {
    total,
    today: todayCount,
    month: monthCount,
    year: yearCount,
    ...statusCounts,
  };
};

// ============================================================
// 6. STATISTIK PER JURUSAN (UNTUK GRAFIK)
// ============================================================
export const getApplicationsByDepartment = async () => {
  // Ambil semua aplikasi dengan department_1 dan department_2
  const { data, error } = await supabase
    .from('applications')
    .select('department_1, department_2');
  if (error) throw error;

  // Hitung per department_1
  const counts = {};
  data.forEach(app => {
    if (app.department_1) {
      counts[app.department_1] = (counts[app.department_1] || 0) + 1;
    }
    if (app.department_2) {
      counts[app.department_2] = (counts[app.department_2] || 0) + 1;
    }
  });

  // Ambil nama jurusan
  const deptIds = Object.keys(counts);
  if (deptIds.length === 0) return [];

  const { data: depts, error: deptError } = await supabase
    .from('departments')
    .select('id, name, code')
    .in('id', deptIds);
  if (deptError) throw deptError;

  // Gabungkan
  return depts.map(dept => ({
    ...dept,
    count: counts[dept.id] || 0,
  })).sort((a, b) => b.count - a.count);
};

// ============================================================
// 7. ADMIN CRUD – AMBIL SEMUA APLIKASI
// ============================================================
export const getAllApplications = async (filters = {}) => {
  let query = supabase
    .from('applications')
    .select(`
      *,
      department_1:department_1 (id, name, code),
      department_2:department_2 (id, name, code),
      school_origin:school_origin_id (id, name)
    `)
    .order('registered_at', { ascending: false });

  // Filter status
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  // Filter jurusan
  if (filters.department) {
    query = query.eq('department_1', filters.department);
  }

  // Search (nama atau nomor pendaftaran)
  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,registration_number.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// ============================================================
// 8. ADMIN CRUD – UPDATE STATUS
// ============================================================
export const updateApplicationStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 9. ADMIN CRUD – HAPUS APLIKASI
// ============================================================
export const deleteApplication = async (id) => {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

// ============================================================
// 10. AMBIL SATU APLIKASI BERDASARKAN ID (UNTUK DETAIL ADMIN)
// ============================================================
export const getApplicationById = async (id) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      department_1:department_1 (id, name, code),
      department_2:department_2 (id, name, code),
      school_origin:school_origin_id (id, name)
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};