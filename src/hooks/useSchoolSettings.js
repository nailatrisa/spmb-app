import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSchoolSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching school settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};