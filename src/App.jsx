import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { supabase } from './lib/supabase';

// ============================================================
// PUBLIC PAGES
// ============================================================
import Home from './pages/public/Home';
import Departments from './pages/public/Departments';
import DepartmentDetail from './pages/public/DepartmentDetail';
import Announcements from './pages/public/Announcements';
import AnnouncementDetail from './pages/public/AnnouncementDetail';
import Registration from './pages/public/Registration';
import RegistrationSuccess from './pages/public/RegistrationSuccess';
import CheckStatus from './pages/public/CheckStatus';
import RegistrationCard from './pages/public/RegistrationCard';

// ============================================================
// ADMIN AUTH PAGES
// ============================================================
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';

// ============================================================
// ADMIN PROTECTED PAGES
// ============================================================
import Dashboard from './pages/admin/Dashboard';
import Applicants from './pages/admin/Applicants';
import ApplicantDetail from './pages/admin/ApplicantDetail';
import Verification from './pages/admin/Verification';
import Selection from './pages/admin/Selection';
import Accepted from './pages/admin/Accepted';
import Rejected from './pages/admin/Rejected';
import Reserves from './pages/admin/Reserves';
import AdminDepartments from './pages/admin/Departments';
import Schools from './pages/admin/Schools';
import AdminAnnouncements from './pages/admin/Announcements';
import Statistics from './pages/admin/Statistics';
import Settings from './pages/admin/Settings';
import AuditLog from './pages/admin/AuditLog';
import Users from './pages/admin/Users';
import Export from './pages/admin/Export';

function App() {
  // ============================================================
  // 🔥 AUTO-CLOSE: CEK DEADLINE SAAT APLIKASI DIMUAT
  // ============================================================
  useEffect(() => {
    const checkDeadline = async () => {
      try {
        // Ambil data deadline dan status dari database
        const { data, error } = await supabase
          .from('school_settings')
          .select('registration_deadline, is_open')
          .single();

        if (error) {
          console.error('❌ Gagal ambil data deadline:', error.message);
          return;
        }

        if (data?.registration_deadline) {
          const now = new Date();
          const deadline = new Date(data.registration_deadline);

          // Jika sudah melewati deadline dan pendaftaran masih terbuka
          if (now > deadline && data.is_open) {
            await supabase
              .from('school_settings')
              .update({
                is_open: false,
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.id);

            console.log('✅ Pendaftaran ditutup otomatis karena deadline telah berakhir.');
          }
        }
      } catch (err) {
        console.error('❌ Gagal cek deadline:', err);
      }
    };

    // Jalankan saat aplikasi dimuat
    checkDeadline();

    // Cek setiap 5 menit (300.000 ms)
    const interval = setInterval(checkDeadline, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // ROUTING
  // ============================================================
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES (tanpa auth)
          ========================================== */}
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

          {/* ==========================================
              ADMIN AUTH ROUTES (tanpa layout)
          ========================================== */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* ==========================================
              PROTECTED ADMIN ROUTES (dengan AdminLayout)
          ========================================== */}

          {/* Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Manajemen Calon Siswa */}
          <Route
            path="/admin/applicants"
            element={
              <ProtectedRoute>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applicants/:id"
            element={
              <ProtectedRoute>
                <ApplicantDetail />
              </ProtectedRoute>
            }
          />

          {/* Verifikasi & Seleksi */}
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute>
                <Verification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/selection"
            element={
              <ProtectedRoute>
                <Selection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accepted"
            element={
              <ProtectedRoute>
                <Accepted />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rejected"
            element={
              <ProtectedRoute>
                <Rejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reserves"
            element={
              <ProtectedRoute>
                <Reserves />
              </ProtectedRoute>
            }
          />

          {/* Master Data */}
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools"
            element={
              <ProtectedRoute>
                <Schools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />

          {/* Laporan & Statistik */}
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/export"
            element={
              <ProtectedRoute>
                <Export />
              </ProtectedRoute>
            }
          />

          {/* Pengaturan & Sistem */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-log"
            element={
              <ProtectedRoute>
                <AuditLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;