📋 SPMB SMK NEGRI 1 PONOROGO

Sistem Penerimaan Murid Baru yang Modern, Fungsional, Responsif, dan Interaktif

📖 Daftar Isi

    Tentang Project

    Fitur

    Tech Stack

    Screenshots

    Instalasi

    Konfigurasi Supabase

    Environment Variables

    Database Setup

    Storage Setup

    Development

    Build

    Deployment

    Struktur Folder

    API & Services

    Troubleshooting

    Kontribusi

    Lisensi

🎯 Tentang Project

SPMB Modern Admission Platform adalah aplikasi web penerimaan murid baru yang menggabungkan portal informasi sekolah, pendaftaran online, pelacakan status, kartu pendaftaran, serta dashboard administrasi dalam satu sistem terintegrasi.

Visi: Membangun pengalaman pendaftaran murid baru yang cepat, jelas, profesional, dan mudah digunakan dari perangkat desktop maupun mobile.

Dibangun untuk: SMK Negeri 1 Ponorogo dan sekolah lainnya yang membutuhkan sistem penerimaan siswa baru modern.
✨ Fitur
🔹 Public (Calon Siswa)

    ✅ Landing page modern dengan Hero Section

    ✅ Live Admission Counter (real-time)

    ✅ Daftar Jurusan dengan kuota dan progress

    ✅ Detail Jurusan dengan nilai minimum

    ✅ Pengumuman sekolah

    ✅ Form Pendaftaran multi-step (7 langkah)

    ✅ Upload dokumen ke Supabase Storage

    ✅ Nomor pendaftaran unik otomatis (SPMB-2026-00001)

    ✅ Tracking status dengan timeline

    ✅ Kartu Pendaftaran dengan QR Code

    ✅ Cetak kartu pendaftaran

    ✅ FAQ Accordion

    ✅ Responsive di semua perangkat

🔹 Admin

    ✅ Login & Register (Supabase Auth)

    ✅ Protected Route

    ✅ Logout dengan konfirmasi

    ✅ Navbar admin profesional (breadcrumb, notifikasi, profile dropdown)

    ✅ Dashboard dengan statistik real-time

    ✅ Grafik pendaftaran (harian, mingguan, bulanan, tahunan)

    ✅ Progress target penerimaan

    ✅ Jurusan terpopuler

    ✅ CRUD Calon Siswa (search, filter, pagination, detail, edit, delete, ubah status)

    ✅ CRUD Jurusan (tambah, edit, hapus, aktif/nonaktif, kuota, nilai minimum)

    ✅ CRUD Asal Sekolah (tambah, edit, hapus, search)

    ✅ CRUD Pengumuman (tambah, edit, hapus, publish/unpublish, upload gambar)

    ✅ Settings Sekolah (update informasi + upload logo)

    ✅ Audit Log (placeholder)

    ✅ User Management (placeholder)

🔹 Database

    ✅ PostgreSQL dengan RLS (Row Level Security)

    ✅ Trigger nomor pendaftaran otomatis

    ✅ Policy public dan admin

🛠 Tech Stack
Kategori	Teknologi
Frontend	React.js, Vite, JavaScript
Routing	React Router DOM
Styling	Tailwind CSS, shadcn/ui
Icons	Lucide React
Backend	Supabase (PostgreSQL, Auth, Storage)
Charts	Recharts
QR Code	qrcode
Date	date-fns
Deployment	Netlify / Vercel
📸 Screenshots
Landing Page

https://screenshots/landing-page.png
Dashboard Admin

https://screenshots/dashboard.png
Form Pendaftaran

https://screenshots/registration-form.png
Kartu Pendaftaran

https://screenshots/registration-card.png
🚀 Instalasi
Prasyarat

    Node.js (v18 atau lebih baru)

    NPM atau Yarn

    Akun Supabase (gratis)

Langkah Instalasi

    Clone repository
    bash

    git clone https://github.com/nailatrisa/spmb-app.git
    cd spmb-app

    Install dependencies
    bash

    npm install

    Buat file .env
    bash

    cp .env.example .env

    Isi environment variables (lihat bagian Environment Variables)

    Setup database (lihat bagian Database Setup)

    Jalankan development server
    bash

    npm run dev

    Buka browser di http://localhost:5173

⚙️ Konfigurasi Supabase
1. Buat Akun Supabase

    Daftar di supabase.com

    Buat project baru

2. Database Setup

Jalankan SQL di Supabase SQL Editor (lihat bagian Database Setup)
3. Storage Setup

Buat bucket application-files di Supabase Storage (lihat bagian Storage Setup)
4. Authentication Setup

    Aktifkan Email Provider di Supabase Auth

    Nonaktifkan konfirmasi email untuk development (opsional)

🔐 Environment Variables

Buat file .env di root project:
env

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

Cara mendapatkan:

    Buka Supabase Dashboard

    Pilih project

    Buka Settings → API

    Copy Project URL → VITE_SUPABASE_URL

    Copy anon public key → VITE_SUPABASE_ANON_KEY

    ⚠️ JANGAN PERNAH menyimpan service_role key di frontend!

🗄️ Database Setup

Jalankan SQL berikut di Supabase SQL Editor:
sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABEL PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. TABEL SCHOOL_SETTINGS
-- ============================================
CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name TEXT NOT NULL DEFAULT 'SMK Negeri 1 Ponorogo',
  address TEXT NOT NULL DEFAULT 'Jl. Merdeka No. 1, Ponorogo',
  phone TEXT NOT NULL DEFAULT '(0352) 123456',
  npsn TEXT NOT NULL DEFAULT '12345678',
  academic_year TEXT NOT NULL DEFAULT '2026/2027',
  logo_url TEXT,
  target_students INTEGER NOT NULL DEFAULT 500,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3. TABEL DEPARTMENTS
-- ============================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quota INTEGER NOT NULL CHECK (quota > 0),
  min_score INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4. TABEL SCHOOL_ORIGINS
-- ============================================
CREATE TABLE school_origins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  npsn TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 5. TABEL APPLICATIONS
-- ============================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  nik TEXT NOT NULL,
  nisn TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('L', 'P')),
  religion TEXT NOT NULL,
  kk_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  regency TEXT NOT NULL,
  province TEXT NOT NULL,
  school_origin_id UUID REFERENCES school_origins(id),
  graduation_year TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  father_job TEXT,
  mother_job TEXT,
  parent_address TEXT,
  department_1 UUID REFERENCES departments(id) NOT NULL,
  department_2 UUID REFERENCES departments(id),
  family_card_url TEXT,
  birth_certificate_url TEXT,
  diploma_url TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'accepted', 'rejected', 'reserve')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 6. TABEL ANNOUNCEMENTS
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 7. TABEL AUDIT_LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  admin_name TEXT,
  action TEXT NOT NULL,
  target TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 8. FUNCTION & TRIGGER REGISTRATION NUMBER
-- ============================================
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  current_year TEXT;
  next_number INTEGER;
  formatted_number TEXT;
BEGIN
  SELECT academic_year INTO current_year FROM school_settings LIMIT 1;
  IF current_year IS NULL THEN
    current_year := to_char(now(), 'YYYY');
  ELSE
    current_year := split_part(current_year, '/', 1);
  END IF;

  SELECT COALESCE(MAX(SUBSTRING(registration_number FROM '\d+$')::INTEGER), 0)
  INTO next_number
  FROM applications
  WHERE registration_number LIKE 'SPMB-' || current_year || '-%';

  next_number := next_number + 1;
  formatted_number := 'SPMB-' || current_year || '-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN formatted_number;
END;
$$;

CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.registration_number IS NULL THEN
    NEW.registration_number := generate_registration_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_registration_number
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION set_registration_number();

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_origins ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. POLICIES (lanjutkan di SQL lengkap)
-- ============================================

    📌 Untuk SQL lengkap dengan semua policies dan data awal, lihat file supabase-schema.sql di repository.

💾 Storage Setup
Buat Bucket

    Buka Supabase Dashboard → Storage

    Klik "Create bucket"

    Nama: application-files

    Public: ✅ YES (diaktifkan)

    Klik "Create bucket"

Policy untuk Bucket
sql

-- Public read
CREATE POLICY "Public read application-files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'application-files' AND public = true);

-- Authenticated upload
CREATE POLICY "Authenticated upload application-files" 
ON storage.objects FOR INSERT WITH CHECK 
(bucket_id = 'application-files' AND auth.role() = 'authenticated');

💻 Development
Jalankan Development Server
bash

npm run dev

Aplikasi akan berjalan di http://localhost:5173
Build untuk Production
bash

npm run build

Hasil build di folder dist/
Preview Build
bash

npm run preview

Lint Code
bash

npm run lint

🚢 Deployment
Deployment ke Netlify

    Push ke GitHub
    bash

    git add .
    git commit -m "Initial commit"
    git push origin main

    Connect ke Netlify

        Login ke netlify.com

        Klik "New site from Git"

        Pilih GitHub

        Pilih repository spmb-app

        Build settings:

            Build command: npm run build

            Publish directory: dist

        Environment Variables:

            VITE_SUPABASE_URL

            VITE_SUPABASE_ANON_KEY

        Klik "Deploy site"

    SPA Redirect (untuk React Router)

        Buat file _redirects di folder public/ atau dist/

        Isi:
        text

        /* /index.html 200

Deployment ke Vercel
bash

npm install -g vercel
vercel

Ikuti petunjuk di terminal.
📁 Struktur Folder
text

spmb-app/
├── public/
│   └── _redirects
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── ProgressTarget.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── public/
│   │   │   ├── Hero.jsx
│   │   │   ├── AdmissionCounter.jsx
│   │   │   ├── SchoolInfo.jsx
│   │   │   ├── Keunggulan.jsx
│   │   │   ├── JurusanPreview.jsx
│   │   │   ├── CaraDaftar.jsx
│   │   │   ├── Syarat.jsx
│   │   │   ├── AnnouncementPreview.jsx
│   │   │   ├── FAQ.jsx
│   │   │   └── CTASection.jsx
│   │   ├── ui/ (shadcn/ui components)
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── SkeletonCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useRegistrationForm.js
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── DepartmentDetail.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── AnnouncementDetail.jsx
│   │   │   ├── Registration.jsx
│   │   │   ├── RegistrationSuccess.jsx
│   │   │   ├── CheckStatus.jsx
│   │   │   ├── RegistrationCard.jsx
│   │   │   └── components/registration/
│   │   │       ├── StepPersonal.jsx
│   │   │       ├── StepContact.jsx
│   │   │       ├── StepSchool.jsx
│   │   │       ├── StepParents.jsx
│   │   │       ├── StepDepartments.jsx
│   │   │       ├── StepDocuments.jsx
│   │   │       └── StepReview.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Applicants.jsx
│   │       ├── ApplicantDetail.jsx
│   │       ├── Departments.jsx
│   │       ├── Schools.jsx
│   │       ├── Announcements.jsx
│   │       ├── Settings.jsx
│   │       ├── Statistics.jsx
│   │       ├── AuditLog.jsx
│   │       ├── Users.jsx
│   │       ├── Export.jsx
│   │       ├── Reserves.jsx
│   │       └── (placeholder pages)
│   ├── services/
│   │   ├── applicationService.js
│   │   ├── departmentService.js
│   │   ├── schoolService.js
│   │   ├── announcementService.js
│   │   ├── settingsService.js
│   │   └── uploadService.js
│   ├── utils/
│   │   └── (helper functions)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── vite.config.js
└── tailwind.config.js

🔌 API & Services
Service	File	Deskripsi
Applications	applicationService.js	CRUD pendaftaran, statistik, status
Departments	departmentService.js	CRUD jurusan, jumlah pendaftar
Schools	schoolService.js	CRUD asal sekolah
Announcements	announcementService.js	CRUD pengumuman, publish
Settings	settingsService.js	Update pengaturan sekolah
Upload	uploadService.js	Upload file ke Supabase Storage
Auth	AuthContext.jsx	Login, register, logout, session
🐛 Troubleshooting
Masalah	Solusi
Failed to resolve import	Pastikan file yang diimport sudah ada. Jalankan npm install
Supabase connection error	Periksa .env dan pastikan URL & ANON KEY benar
NS_ERROR_CORRUPTED_CONTENT	Hapus cache Vite: rm -rf .vite node_modules/.vite
Logout tidak muncul	Pastikan AdminNavbar.jsx sudah dibuat dan diimport di AdminLayout
TabsTrigger not found	Buat file src/components/ui/tabs.jsx dan install @radix-ui/react-tabs
Build failed	Jalankan npm run build -- --force untuk melihat error detail
React Router tidak berfungsi di deploy	Tambahkan file _redirects di public/ dengan isi /* /index.html 200
Error Umum & Solusi

1. Filter is not defined
jsx

// Tambahkan di import Dashboard.jsx
import { Filter } from 'lucide-react';

2. logout is not a function
jsx

// Pastikan di AuthContext.jsx:
const logout = async () => { ... };
const value = { ..., logout };

3. Cannot read properties of null
jsx

// Gunakan optional chaining:
user?.profile?.full_name || 'Administrator'

4. Failed to load url /src/components/ui/tabs
bash

npm install @radix-ui/react-tabs
# Buat file src/components/ui/tabs.jsx

5. JWT issued at future

    Sinkronkan waktu komputer

    Logout dan login ulang

    Hapus local storage Supabase

👥 Kontribusi

Kontribusi selalu diterima! Berikut langkah-langkahnya:

    Fork repository

    Buat branch baru: git checkout -b fitur-anda

    Commit perubahan: git commit -m 'Tambah fitur X'

    Push: git push origin fitur-anda

    Buat Pull Request

Aturan Kontribusi

    Ikuti struktur kode yang ada

    Gunakan komponen reusable

    Pastikan responsive

    Tambahkan dokumentasi jika diperlukan

    Test fitur sebelum push

📄 Lisensi

Copyright © 2026 SPMB Modern Admission Platform

Hak cipta dilindungi undang-undang.
🙏 Kredit

    Developer: Tim Pengembang SPMB

    Framework: React.js, Vite, Tailwind CSS

    Backend: Supabase

    UI Components: shadcn/ui

    Icons: Lucide React

    Charts: Recharts

📞 Kontak

    Website: spmb-school.com

    Email: info@spmb-school.com

    GitHub: nailatrisa/spmb-app

⭐ Beri bintang di GitHub jika project ini bermanfaat!