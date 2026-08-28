import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Upload, X, Loader2, FileCheck } from 'lucide-react';

const FileUpload = ({ 
  label, 
  bucket = 'application-files', 
  folder = 'documents',
  accept = 'image/*',
  maxSize = 2, // MB
  onUploadComplete,
  onError,
  value = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState(value);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > maxSize * 1024 * 1024) {
      onError?.('Ukuran file maksimal ' + maxSize + ' MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(percent);
          },
        });

      if (error) throw error;

      // Ambil URL publik
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      onUploadComplete?.(publicUrl);
      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error.message || 'Gagal upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFileUrl('');
    onUploadComplete?.('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-navy-700">{label}</label>
      
      {!fileUrl ? (
        <div className="relative">
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploading ? 'border-primary-300 bg-primary-50' : 'border-slate-300 hover:border-primary-400'
          }`}>
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto" />
                <p className="text-sm text-navy-600">Mengupload... {Math.round(progress)}%</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-navy-400 mx-auto mb-2" />
                <p className="text-sm text-navy-600">Klik atau drag & drop untuk upload</p>
                <p className="text-xs text-navy-400">Maksimal {maxSize} MB</p>
              </>
            )}
            <input
              type="file"
              accept={accept}
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <FileCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700 flex-1 truncate">File terupload</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-navy-400 hover:text-red-600"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;