import { supabase } from '../lib/supabase';

// ============================================================
// 1. PUBLIC - Ambil semua jurusan aktif
// ============================================================
export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
};

// ============================================================
// 2. PUBLIC - Ambil detail jurusan berdasarkan ID
// ============================================================
export const getDepartmentById = async (id) => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 3. PUBLIC - Ambil jumlah pendaftar per jurusan
// ============================================================
export const getDepartmentApplicationCounts = async () => {
  const { data: dept1, error: err1 } = await supabase
    .from('applications')
    .select('department_1', { count: 'exact', head: false })
    .not('department_1', 'is', null);
  if (err1) throw err1;

  const { data: dept2, error: err2 } = await supabase
    .from('applications')
    .select('department_2', { count: 'exact', head: false })
    .not('department_2', 'is', null);
  if (err2) throw err2;

  const countMap = {};
  dept1.forEach(item => {
    const id = item.department_1;
    countMap[id] = (countMap[id] || 0) + 1;
  });
  dept2.forEach(item => {
    const id = item.department_2;
    countMap[id] = (countMap[id] || 0) + 1;
  });
  return countMap;
};

// ============================================================
// 4. PUBLIC - Ambil semua jurusan + jumlah pendaftar
// ============================================================
export const getDepartmentsWithCounts = async () => {
  const [departments, counts] = await Promise.all([
    getDepartments(),
    getDepartmentApplicationCounts(),
  ]);
  return departments.map(dept => ({
    ...dept,
    applicant_count: counts[dept.id] || 0,
  }));
};

// ============================================================
// 5. ADMIN - Ambil semua jurusan (termasuk yang tidak aktif)
// ============================================================
export const getAllDepartmentsAdmin = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

// ============================================================
// 6. ADMIN - Tambah jurusan baru
// ============================================================
export const createDepartment = async (departmentData) => {
  const { data, error } = await supabase
    .from('departments')
    .insert([departmentData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 7. ADMIN - Update jurusan
// ============================================================
export const updateDepartment = async (id, departmentData) => {
  const { data, error } = await supabase
    .from('departments')
    .update(departmentData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 8. ADMIN - Hapus jurusan (cek relasi dulu)
// ============================================================
export const deleteDepartment = async (id) => {
  const { count, error: countError } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .or(`department_1.eq.${id},department_2.eq.${id}`);
  if (countError) throw countError;
  if (count > 0) {
    throw new Error('Jurusan masih digunakan oleh pendaftar. Tidak bisa dihapus.');
  }
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

// ============================================================
// 9. ADMIN - Toggle aktif/nonaktif jurusan
// ============================================================
export const toggleDepartmentActive = async (id, isActive) => {
  const { data, error } = await supabase
    .from('departments')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};