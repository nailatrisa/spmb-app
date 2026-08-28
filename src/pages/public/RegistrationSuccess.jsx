import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { CheckCircle, Printer, Search } from 'lucide-react';

const RegistrationSuccess = () => {
  const [searchParams] = useSearchParams();
  const registrationNumber = searchParams.get('registration_number');

  useEffect(() => {
    // Scroll ke atas saat halaman dimuat
    window.scrollTo(0, 0);
  }, []);

  if (!registrationNumber) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-900">Pendaftaran Berhasil!</h2>
        <p className="text-navy-500 mt-2">Silakan cek email Anda untuk informasi lebih lanjut.</p>
        <Link to="/">
          <Button className="mt-6">Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 max-w-2xl">
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-navy-900">Pendaftaran Berhasil!</h1>
        <p className="text-navy-600 mt-2">Selamat, Anda telah berhasil mendaftar.</p>

        <div className="bg-slate-50 rounded-lg p-4 mt-6">
          <p className="text-sm text-navy-500">Nomor Pendaftaran</p>
          <p className="text-2xl font-bold text-primary-600 font-mono">{registrationNumber}</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link to={`/kartu/${registrationNumber}`}>
            <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
              <Printer className="h-4 w-4" />
              Cetak Kartu
            </Button>
          </Link>
          <Link to="/status">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Cek Status
            </Button>
          </Link>
        </div>

        <p className="text-sm text-navy-400 mt-4">
          Simpan nomor pendaftaran Anda untuk melacak status dan mencetak kartu.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link to="/">
            <Button variant="ghost">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;