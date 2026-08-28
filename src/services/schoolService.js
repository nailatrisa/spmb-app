import { supabase } from '../lib/supabase';

// ============================================================
// 1. PUBLIC - Ambil semua sekolah (untuk dropdown form)
// ============================================================
export const getSchoolOrigins = async () => {
  const { data, error } = await supabase
    .from('school_origins')
    .select('id, name')
    .order('name');
  if (error) throw error;
  return data;
};

// ============================================================
// 2. ADMIN - Ambil semua sekolah dengan detail lengkap
// ============================================================
export const getAllSchools = async () => {
  const { data, error } = await supabase
    .from('school_origins')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

// ============================================================
// 3. ADMIN - Ambil detail sekolah berdasarkan ID
// ============================================================
export const getSchoolOriginById = async (id) => {
  const { data, error } = await supabase
    .from('school_origins')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 4. ADMIN - Cari sekolah berdasarkan nama atau NPSN
// ============================================================
export const searchSchoolOrigins = async (query) => {
  if (!query || query.trim() === '') {
    return getAllSchools();
  }
  
  const { data, error } = await supabase
    .from('school_origins')
    .select('*')
    .or(`name.ilike.%${query}%,npsn.ilike.%${query}%`)
    .order('name');
  if (error) throw error;
  return data;
};

// ============================================================
// 5. ADMIN - Tambah sekolah asal baru
// ============================================================
export const createSchoolOrigin = async (schoolData) => {
  const { data, error } = await supabase
    .from('school_origins')
    .insert([schoolData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 6. ADMIN - Update data sekolah asal
// ============================================================
export const updateSchoolOrigin = async (id, schoolData) => {
  const { data, error } = await supabase
    .from('school_origins')
    .update(schoolData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 7. ADMIN - Hapus sekolah asal (cek relasi dulu)
// ============================================================
export const deleteSchoolOrigin = async (id) => {
  // Cek apakah sekolah masih digunakan di tabel applications
  const { count, error: countError } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('school_origin_id', id);
  
  if (countError) throw countError;
  
  if (count > 0) {
    throw new Error('Sekolah masih digunakan oleh pendaftar. Tidak bisa dihapus.');
  }
  
  const { error } = await supabase
    .from('school_origins')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

// ============================================================
// 8. ADMIN - Get total count sekolah (untuk statistik)
// ============================================================
export const getSchoolCount = async () => {
  const { count, error } = await supabase
    .from('school_origins')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
};