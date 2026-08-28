import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { getApplicationByRegistrationNumber } from '../../services/applicationService';
import { getSchoolSettings } from '../../services/settingsService';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const RegistrationCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [appData, schoolData] = await Promise.all([
          getApplicationByRegistrationNumber(id),
          getSchoolSettings(),
        ]);
        
        setApplication(appData);
        setSchool(schoolData);

        // Generate QR Code
        const qrUrl = `${window.location.origin}/status?registration=${appData.registration_number}`;
        const qrData = await QRCode.toDataURL(qrUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrl(qrData);
      } catch (err) {
        if (err.code === 'PGRST116') {
          setError('Kartu tidak ditemukan. Nomor pendaftaran tidak valid.');
        } else {
          setError('Gagal memuat kartu pendaftaran.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const statusMap = {
    pending: { label: 'Menunggu Verifikasi', color: 'text-amber-600', bg: 'bg-amber-100' },
    verified: { label: 'Terverifikasi', color: 'text-blue-600', bg: 'bg-blue-100' },
    accepted: { label: 'Diterima', color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-100' },
  };

  if (loading) return <LoadingSpinner fullScreen text="Memuat kartu..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/status')} />;
  if (!application || !school) return <ErrorState message="Data tidak ditemukan." onRetry={() => navigate('/')} />;

  const statusInfo = statusMap[application.status] || statusMap.pending;

  return (
    <div className="container-custom py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/status')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="gap-2 bg-primary-600 hover:bg-primary-700">
            <Printer className="h-4 w-4" />
            Cetak Kartu
          </Button>
        </div>
      </div>

      {/* Kartu Pendaftaran */}
      <div 
        ref={cardRef}
        className="bg-white rounded-xl shadow-card border border-slate-200 p-6 md:p-8 print:shadow-none print:border print:border-slate-300"
        id="registration-card"
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          {school.logo_url ? (
            <img src={school.logo_url} alt={school.school_name} className="h-16 w-16 object-contain" />
          ) : (
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl">
              {school.school_name?.charAt(0) || 'S'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-navy-900">{school.school_name}</h1>
            <p className="text-sm text-navy-500">{school.address}</p>
            <p className="text-xs text-navy-400">NPSN: {school.npsn} | Telp: {school.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-navy-400">Tahun Ajaran</p>
            <p className="font-semibold text-navy-700">{school.academic_year}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-primary-600">KARTU PENDAFTARAN</h2>
          <p className="text-sm text-navy-500">Sistem Penerimaan Murid Baru</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Left: Photo & QR */}
          <div className="flex flex-col items-center gap-3">
            {application.photo_url ? (
              <img 
                src={application.photo_url} 
                alt={application.full_name} 
                className="w-32 h-40 object-cover rounded-lg border-2 border-slate-200"
                onError={(e) => {
                  e.target.src = '';
                  e.target.alt = 'Foto tidak tersedia';
                }}
              />
            ) : (
              <div className="w-32 h-40 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
                Foto
              </div>
            )}
            {qrCodeDataUrl && (
              <div className="mt-2">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-24 h-24" />
                <p className="text-[10px] text-navy-400 text-center mt-1">Scan untuk cek status</p>
              </div>
            )}
          </div>

          {/* Middle: Data Diri */}
          <div className="md:col-span-2 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-navy-400">Nomor Pendaftaran</p>
                <p className="font-bold font-mono text-primary-600">{application.registration_number}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Status</p>
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-navy-400">Nama Lengkap</p>
                <p className="font-medium text-navy-800">{application.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">NISN</p>
                <p className="font-medium text-navy-800">{application.nisn}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Jurusan Pilihan 1</p>
                <p className="font-medium text-navy-800">{application.department_1?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Jurusan Pilihan 2</p>
                <p className="font-medium text-navy-800">{application.department_2?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Asal Sekolah</p>
                <p className="font-medium text-navy-800">{application.school_origin?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400">Tanggal Daftar</p>
                <p className="font-medium text-navy-800">
                  {format(new Date(application.registered_at), 'd MMMM yyyy', { locale: id })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 mt-2 text-center text-xs text-navy-400">
          <p>Kartu ini adalah bukti pendaftaran resmi. Harap disimpan dengan baik.</p>
          <p className="mt-1">
            {school.school_name} - {school.address}
          </p>
        </div>
      </div>

      {/* Print-only watermark */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #registration-card, #registration-card * {
            visibility: visible;
          }
          #registration-card {
            position: absolute;
            left: 0;
            top: 0;
            margin: 20px;
            padding: 20px;
            width: 100%;
            max-width: 800px;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #e2e8f0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationCard;