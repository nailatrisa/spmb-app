import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import Departments from './pages/public/Departments';
import DepartmentDetail from './pages/public/DepartmentDetail';
import Announcements from './pages/public/Announcements';
import AnnouncementDetail from './pages/public/AnnouncementDetail';
import Registration from './pages/public/Registration';
import RegistrationSuccess from './pages/public/RegistrationSuccess';
import CheckStatus from './pages/public/CheckStatus';
import RegistrationCard from './pages/public/RegistrationCard';

// Admin Auth Pages
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';

// Admin Pages (yang sudah ada)
import Dashboard from './pages/admin/Dashboard';
import Applicants from './pages/admin/Applicants';
import AdminDepartments from './pages/admin/Departments';
import Schools from './pages/admin/Schools';
import AdminAnnouncements from './pages/admin/Announcements';
import Settings from './pages/admin/Settings';
import Statistics from './pages/admin/Statistics';
import AuditLog from './pages/admin/AuditLog';
import Users from './pages/admin/Users';
import Export from './pages/admin/Export';
import Reserves from './pages/admin/Reserves';
import ApplicantDetail from './pages/admin/ApplicantDetail';

// Placeholder baru - kita buat sementara sebagai fungsi inline agar tidak perlu file terpisah
// Untuk sementara, kita langsung definisikan di sini untuk menghindari file hilang
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
    <p className="text-navy-500 mt-2">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

const Verification = () => <PlaceholderPage title="Verifikasi Berkas" />;
const Selection = () => <PlaceholderPage title="Seleksi" />;
const Accepted = () => <PlaceholderPage title="Daftar Diterima" />;
const Rejected = () => <PlaceholderPage title="Daftar Ditolak" />;
const Waves = () => <PlaceholderPage title="Gelombang Pendaftaran" />;
const Requirements = () => <PlaceholderPage title="Persyaratan" />;
const Schedule = () => <PlaceholderPage title="Jadwal SPMB" />;
const PrintProof = () => <PlaceholderPage title="Cetak Bukti Pendaftaran" />;
const PrintCard = () => <PlaceholderPage title="Cetak Kartu Peserta" />;
const AnnouncementLetter = () => <PlaceholderPage title="Surat Pengumuman" />;
const ReportMajor = () => <PlaceholderPage title="Rekap Per Jurusan" />;
const FAQ = () => <PlaceholderPage title="FAQ" />;
const Info = () => <PlaceholderPage title="Informasi SPMB" />;
const Roles = () => <PlaceholderPage title="Role & Permission" />;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jurusan" element={<Departments />} />
            <Route path="/jurusan/:id" element={<DepartmentDetail />} />
            <Route path="/pengumuman" element={<Announcements />} />
            <Route path="/pengumuman/:slug" element={<AnnouncementDetail />} />
            <Route path="/pendaftaran" element={<Registration />} />
            <Route path="/pendaftaran/berhasil" element={<RegistrationSuccess />} />
            <Route path="/status" element={<CheckStatus />} />
            <Route path="/kartu/:id" element={<RegistrationCard />} />
          </Route>

          {/* Admin Auth */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/admin/applicants/:id" element={<ProtectedRoute><ApplicantDetail /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute><AdminDepartments /></ProtectedRoute>} />
          <Route path="/admin/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute><AdminAnnouncements /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          <Route path="/admin/audit-log" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/admin/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
          <Route path="/admin/reserves" element={<ProtectedRoute><Reserves /></ProtectedRoute>} />
          
          {/* Routes baru dengan placeholder inline */}
          <Route path="/admin/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
          <Route path="/admin/selection" element={<ProtectedRoute><Selection /></ProtectedRoute>} />
          <Route path="/admin/accepted" element={<ProtectedRoute><Accepted /></ProtectedRoute>} />
          <Route path="/admin/rejected" element={<ProtectedRoute><Rejected /></ProtectedRoute>} />
          <Route path="/admin/waves" element={<ProtectedRoute><Waves /></ProtectedRoute>} />
          <Route path="/admin/requirements" element={<ProtectedRoute><Requirements /></ProtectedRoute>} />
          <Route path="/admin/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/admin/print-proof" element={<ProtectedRoute><PrintProof /></ProtectedRoute>} />
          <Route path="/admin/print-card" element={<ProtectedRoute><PrintCard /></ProtectedRoute>} />
          <Route path="/admin/announcement-letter" element={<ProtectedRoute><AnnouncementLetter /></ProtectedRoute>} />
          <Route path="/admin/report-major" element={<ProtectedRoute><ReportMajor /></ProtectedRoute>} />
          <Route path="/admin/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
          <Route path="/admin/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;