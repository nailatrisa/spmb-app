import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, File } from 'lucide-react';

const StepDocuments = ({ formData, updateFile, errors }) => {
  const fileInputs = {
    photo: useRef(null),
    family_card: useRef(null),
    birth_certificate: useRef(null),
    diploma: useRef(null),
  };

  const fileLabels = {
    photo: 'Pas Foto (3x4)',
    family_card: 'Kartu Keluarga',
    birth_certificate: 'Akta Kelahiran',
    diploma: 'Ijazah/SKL',
  };

  const fileAccept = {
    photo: 'image/*',
    family_card: 'image/*,.pdf',
    birth_certificate: 'image/*,.pdf',
    diploma: 'image/*,.pdf',
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        e.target.value = '';
        return;
      }
      updateFile(field, file);
    }
  };

  const removeFile = (field) => {
    updateFile(field, null);
    if (fileInputs[field]?.current) {
      fileInputs[field].current.value = '';
    }
  };

  const getFilePreview = (file) => {
    if (!file) return null;
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-800">Upload Dokumen</h3>
      <p className="text-sm text-navy-500">Upload dokumen yang diperlukan (maksimal 2MB per file)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(fileLabels).map((key) => {
          const file = formData[key];
          const preview = getFilePreview(file);
          const isImage = file?.type?.startsWith('image/');
          
          return (
            <div key={key} className="space-y-1">
              <Label>{fileLabels[key]} {key === 'photo' ? '*' : ''}</Label>
              <div className="relative">
                {file ? (
                  <div className="border-2 border-slate-200 rounded-lg p-3 flex items-center gap-3 bg-slate-50">
                    {isImage && preview ? (
                      <img src={preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <File className="h-8 w-8 text-slate-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-700 truncate">{file.name}</p>
                      <p className="text-xs text-navy-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => removeFile(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-20 border-dashed border-2 border-slate-300 hover:border-primary-400 flex flex-col items-center justify-center gap-1"
                    onClick={() => fileInputs[key].current?.click()}
                  >
                    <Upload className="h-5 w-5 text-slate-400" />
                    <span className="text-xs text-slate-500">Klik untuk upload</span>
                  </Button>
                )}
                <input
                  ref={fileInputs[key]}
                  type="file"
                  accept={fileAccept[key]}
                  className="hidden"
                  onChange={(e) => handleFileChange(key, e)}
                />
              </div>
              {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepDocuments;