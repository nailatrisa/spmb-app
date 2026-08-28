import { supabase } from '../lib/supabase';
import { uploadFile } from './uploadService';

// ============================================================
// 1. PUBLIC - Ambil semua pengumuman yang sudah dipublish
// ============================================================
export const getPublishedAnnouncements = async (limit = null) => {
  let query = supabase
    .from('announcements')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// ============================================================
// 2. PUBLIC - Ambil detail pengumuman berdasarkan slug
// ============================================================
export const getAnnouncementBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 3. ADMIN - Ambil semua pengumuman (termasuk draft)
// ============================================================
export const getAllAnnouncementsAdmin = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// ============================================================
// 4. ADMIN - Ambil detail pengumuman berdasarkan ID
// ============================================================
export const getAnnouncementById = async (id) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 5. ADMIN - Tambah pengumuman baru (dengan upload gambar)
// ============================================================
export const createAnnouncement = async (announcementData, imageFile = null) => {
  let imageUrl = announcementData.image_url || null;
  
  // Upload gambar jika ada
  if (imageFile) {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const fileName = `announcement_${timestamp}_${random}`;
      imageUrl = await uploadFile(imageFile, 'announcements', fileName);
    } catch (error) {
      console.error('Gagal upload gambar:', error);
      throw new Error('Gagal upload gambar pengumuman.');
    }
  }

  const dataToInsert = {
    title: announcementData.title,
    slug: announcementData.slug,
    excerpt: announcementData.excerpt,
    content: announcementData.content,
    image_url: imageUrl,
    is_published: announcementData.is_published || false,
    published_at: announcementData.is_published ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from('announcements')
    .insert([dataToInsert])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 6. ADMIN - Update pengumuman (dengan upload gambar)
// ============================================================
export const updateAnnouncement = async (id, announcementData, imageFile = null) => {
  let imageUrl = announcementData.image_url || null;
  
  // Upload gambar baru jika ada
  if (imageFile) {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const fileName = `announcement_${timestamp}_${random}`;
      imageUrl = await uploadFile(imageFile, 'announcements', fileName);
    } catch (error) {
      console.error('Gagal upload gambar:', error);
      throw new Error('Gagal upload gambar pengumuman.');
    }
  }

  const dataToUpdate = {
    title: announcementData.title,
    slug: announcementData.slug,
    excerpt: announcementData.excerpt,
    content: announcementData.content,
    image_url: imageUrl,
    is_published: announcementData.is_published || false,
    updated_at: new Date().toISOString(),
  };

  // Jika dipublish dan sebelumnya tidak, set published_at
  if (announcementData.is_published && !announcementData.was_published) {
    dataToUpdate.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('announcements')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 7. ADMIN - Hapus pengumuman
// ============================================================
export const deleteAnnouncement = async (id) => {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

// ============================================================
// 8. ADMIN - Toggle publish/unpublish
// ============================================================
export const toggleAnnouncementPublish = async (id, isPublished) => {
  const updateData = {
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };
  
  if (isPublished) {
    updateData.published_at = new Date().toISOString();
  } else {
    updateData.published_at = null;
  }

  const { data, error } = await supabase
    .from('announcements')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
// 9. Utility - Generate slug dari judul
// ============================================================
export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
};