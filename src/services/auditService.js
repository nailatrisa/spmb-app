import { supabase } from '@/lib/supabase';

/**
 * Audit Log Service
 * Mencatat semua aktivitas admin ke dalam tabel audit_log
 */

// Pastikan tabel audit_log ada di database
// Jalankan SQL ini jika belum:
// CREATE TABLE IF NOT EXISTS audit_log (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   admin_id UUID REFERENCES auth.users(id),
//   admin_name TEXT,
//   action TEXT NOT NULL,
//   target_type TEXT,
//   target_id TEXT,
//   target_name TEXT,
//   details JSONB,
//   ip_address TEXT,
//   user_agent TEXT,
//   created_at TIMESTAMPTZ DEFAULT now()
// );

export const logAudit = async ({
  adminId,
  adminName,
  action,
  targetType,
  targetId,
  targetName,
  details,
  ipAddress,
  userAgent,
}) => {
  try {
    // Jika adminId tidak disediakan, coba ambil dari session
    if (!adminId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        adminId = session.user.id;
        // Coba ambil nama dari profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', adminId)
          .single();
        adminName = profile?.full_name || adminName;
      }
    }

    const { error } = await supabase
      .from('audit_log')
      .insert({
        admin_id: adminId,
        admin_name: adminName,
        action,
        target_type: targetType,
        target_id: targetId,
        target_name: targetName,
        details: details || {},
        ip_address: ipAddress || null,
        user_agent: userAgent || navigator?.userAgent || null,
      });

    if (error) {
      console.error('Audit log error:', error);
    }
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

// Fungsi untuk mengambil audit log dengan filter
export const getAuditLogs = async ({
  limit = 50,
  offset = 0,
  action,
  targetType,
  adminId,
  startDate,
  endDate,
}) => {
  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.eq('action', action);
  if (targetType) query = query.eq('target_type', targetType);
  if (adminId) query = query.eq('admin_id', adminId);
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

// Fungsi untuk mendapatkan aktivitas terbaru (untuk dashboard)
export const getRecentActivities = async (limit = 10) => {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};