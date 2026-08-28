import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const UploadFile = ({ 
  label, 
  bucket = 'application-files', 
  folder = 'documents', 
  onUploadComplete, 
  onRemove,
  accept = 'image/*,.pdf',
  maxSize = 2 * 1024 * 1024, // 2MB
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validasi ukuran
    if (selectedFile.size > maxSize) {
      setError(`Ukuran file maksimal ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validasi tipe
    const fileType = selectedFile.type;
    if (!fileType.startsWith('image/') && !fileType.includes('pdf')) {
      setError('Hanya file gambar atau PDF yang diperbolehkan');
      return;
    }

    setFile(selectedFile);
    setError('');
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      setProgress(0);

      // Buat nama file unik
      const timestamp = Date.now();
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${folder}/${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      setUploadedUrl(publicUrl);
      setProgress(100);
      onUploadComplete(publicUrl);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Gagal upload file. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadedUrl('');
    setProgress(0);
    setError('');
    onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-navy-700">{label}</label>
      
      {!uploadedUrl && !uploading && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label}`}
          />
          <label htmlFor={`upload-${label}`} className="cursor-pointer block">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Klik untuk upload</p>
            <p className="text-xs text-slate-400 mt-1">Max {maxSize / 1024 / 1024}MB</p>
          </label>
        </div>
      )}

      {uploading && (
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      )}

      {uploadedUrl && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700">File terupload</span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadFile;