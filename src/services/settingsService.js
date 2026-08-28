import { supabase } from '../lib/supabase';

export const getSchoolSettings = async () => {
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data;
};

export const updateSchoolSettings = async (settingsData) => {
  // Ambil ID settings yang ada (biasanya hanya 1 baris)
  const { data: existing, error: fetchError } = await supabase
    .from('school_settings')
    .select('id')
    .limit(1)
    .single();
  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('school_settings')
    .update(settingsData)
    .eq('id', existing.id)
    .select()
    .single();
  if (error) throw error;
  return data;
};