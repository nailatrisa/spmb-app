import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'application-files';

// Upload single file
export const uploadFile = async (file, folder, fileName) => {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const filePath = `${folder}/${fileName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// Upload multiple files
export const uploadMultipleFiles = async (files) => {
  const uploadPromises = [];
  const results = {};

  // Map file fields to folder names
  const fileMap = {
    photo: { folder: 'photos', field: 'photo_url' },
    family_card: { folder: 'family_cards', field: 'family_card_url' },
    birth_certificate: { folder: 'birth_certificates', field: 'birth_certificate_url' },
    diploma: { folder: 'diplomas', field: 'diploma_url' },
  };

  for (const [key, file] of Object.entries(files)) {
    if (file && fileMap[key]) {
      const { folder, field } = fileMap[key];
      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const fileName = `${timestamp}_${random}`;
      
      uploadPromises.push(
        uploadFile(file, folder, fileName).then(url => {
          results[field] = url;
        })
      );
    }
  }

  await Promise.all(uploadPromises);
  return results;
};