import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationByRegistrationNumber, getApplicationTimeline } from '../../services/applicationService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { Search, CheckCircle, XCircle, Clock, AlertCircle, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const CheckStatus = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!registrationNumber.trim()) {
      setError('Masukkan nomor pendaftaran.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await getApplicationByRegistrationNumber(registrationNumber.trim());
      setApplication(data);
    } catch (err) {
      if (err.code === 'PGRST116') {
        setError('Nomor pendaftaran tidak ditemukan.');
      } else {
        setError('Gagal memeriksa status. Silakan coba lagi.');
      }
      setApplication(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    pending: { label: 'Menunggu Verifikasi', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    verified: { label: 'Data Terverifikasi', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
    accepted: { label: 'Diterima', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
    rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  };

  const renderTimeline = () => {
    if (!application) return null;
    
    const timeline = getApplicationTimeline(application.status);
    const isRejected = application.status === 'rejected';

    return (
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
        {timeline.map((step, index) => {
          const isLast = index === timeline.length - 1;
          const isRejectedStep = isRejected && isLast;
          
          return (
            <div key={step.key} className="relative pl-12 pb-8 last:pb-0">
              <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.isCompleted && !isRejectedStep
                  ? 'border-green-500 bg-green-100'
                  : isRejectedStep
                  ? 'border-red-500 bg-red-100'
                  : step.isActive
                  ? 'border-primary-500 bg-primary-100 animate-pulse'
                  : 'border-slate-300 bg-slate-100'
              }`}>
                {step.isCompleted && !isRejectedStep ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : isRejectedStep ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <span className="text-sm font-bold text-slate-500">{index + 1}</span>
                )}
              </div>
              <div>
                <h4 className={`font-semibold ${
                  step.isCompleted && !isRejectedStep
                    ? 'text-green-700'
                    : isRejectedStep
                    ? 'text-red-700'
                    : step.isActive
                    ? 'text-primary-700'
                    : 'text-navy-500'
                }`}>
                  {step.label}
                </h4>
                {step.isActive && !isRejected && (
                  <p className="text-sm text-navy-500">Sedang diproses...</p>
                )}
                {isRejected && isLast && (
                  <p className="text-sm text-red-500">Mohon maaf, pendaftaran Anda tidak diterima.</p>
                )}
                {step.isCompleted && !isRejectedStep && index < timeline.length - 1 && (
                  <p className="text-sm text-green-600">✓ Selesai</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const info = statusMap[status] || statusMap.pending;
    const Icon = info.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${info.bg} ${info.color}`}>
        <Icon className="h-4 w-4" />
        {info.label}
      </span>
    );
  };

  return (
    <div className="container-custom py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-navy-900 text-center">Cek Status Pendaftaran</h1>
      <p className="text-center text-navy-500 mt-2 mb-8">
        Masukkan nomor pendaftaran untuk melacak status Anda.
      </p>

      <Card className="border-slate-200 shadow-soft">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="registrationNumber" className="sr-only">Nomor Pendaftaran</Label>
              <Input
                id="registrationNumber"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Contoh: SPMB-2026-00001"
                className="font-mono"
              />
            </div>
            <Button type="submit" className="gap-2 flex-shrink-0" disabled={loading}>
              {loading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Cek Status
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {searched && loading && (
        <div className="mt-8">
          <LoadingSpinner fullScreen={false} text="Memeriksa data..." />
        </div>
      )}

      {application && !loading && (
        <div className="mt-8 space-y-6">
          {/* Status Card */}
          <Card className="border-slate-200 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Informasi Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-navy-400">Nomor Pendaftaran</p>
                  <p className="text-lg font-bold font-mono text-primary-600">{application.registration_number}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Status</p>
                  <StatusBadge status={application.status} />
                </div>
                <div>
                  <p className="text-xs text-navy-400">Nama Lengkap</p>
                  <p className="font-medium text-navy-800">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Jurusan Pilihan 1</p>
                  <p className="font-medium text-navy-800">{application.department_1?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Asal Sekolah</p>
                  <p className="font-medium text-navy-800">{application.school_origin?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Tanggal Daftar</p>
                  <p className="font-medium text-navy-800">
                    {format(new Date(application.registered_at), 'd MMMM yyyy, HH:mm', { locale: id })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-slate-200 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTimeline()}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Cetak Status
            </Button>
            <Button
              variant="link"
              className="text-primary-600"
              onClick={() => {
                setRegistrationNumber('');
                setApplication(null);
                setSearched(false);
                setError(null);
              }}
            >
              Cek Nomor Lain
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;