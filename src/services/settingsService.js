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

export const updateSchoolSettings = async (id, data) => {
  const { data: result, error } = await supabase
    .from('school_settings')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result;
};