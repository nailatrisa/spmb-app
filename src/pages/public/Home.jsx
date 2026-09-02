import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, Building, Award } from 'lucide-react';

// Import komponen existing
import Hero from '../../components/public/Hero';
import AdmissionCounter from '../../components/public/AdmissionCounter';
import SchoolInfo from '../../components/public/SchoolInfo';
import Keunggulan from '../../components/public/Keunggulan';
import JurusanPreview from '../../components/public/JurusanPreview';
import CaraDaftar from '../../components/public/CaraDaftar';
import Syarat from '../../components/public/Syarat';
import AnnouncementPreview from '../../components/public/AnnouncementPreview';
import FAQ from '../../components/public/FAQ';
import CTASection from '../../components/public/CTASection';

// Import services
import { getApplicationCount } from '../../services/applicationService';
import { getDepartments } from '../../services/departmentService';
import { getSchoolSettings } from '../../services/settingsService';

// ============================================================
// ANIMASI VARIANTS
// ============================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

// ============================================================
// SECTION HEADER COMPONENT - Reusable & Professional
// ============================================================
const SectionHeader = ({ badge, title, highlight, description, badgeColor = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  };

  const gradientMap = {
    blue: 'from-blue-600 to-blue-400',
    emerald: 'from-emerald-600 to-emerald-400',
    amber: 'from-amber-600 to-amber-400',
    rose: 'from-rose-600 to-rose-400',
    purple: 'from-purple-600 to-purple-400',
    indigo: 'from-indigo-600 to-indigo-400',
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
    >
      <motion.div
        className={`inline-block text-xs md:text-sm font-bold ${colorMap[badgeColor]} px-4 md:px-5 py-2 rounded-full mb-4 md:mb-6 shadow-sm`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {badge}
      </motion.div>
      
      <motion.h2 
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        {title}{' '}
        <span className={`bg-gradient-to-r ${gradientMap[badgeColor]} bg-clip-text text-transparent`}>
          {highlight}
        </span>
      </motion.h2>
      
      <motion.p 
        className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

// ============================================================
// STATS HIGHLIGHT COMPONENT - Data dari Supabase
// ============================================================
const StatsHighlight = () => {
  const [stats, setStats] = useState([
    { icon: Users, value: '0', label: 'Total Pendaftar', color: 'from-blue-500 to-blue-600', order: 0 },
    { icon: Building, value: '0', label: 'Jurusan Unggulan', color: 'from-emerald-500 to-emerald-600', order: 1 },
    { icon: Award, value: '0', label: 'Prestasi Siswa', color: 'from-amber-500 to-amber-600', order: 2 },
    { icon: GraduationCap, value: '0', label: 'Alumni Sukses', color: 'from-purple-500 to-purple-600', order: 3 },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appCount, departments, settings] = await Promise.all([
          getApplicationCount().catch(() => 0),
          getDepartments().catch(() => []),
          getSchoolSettings().catch(() => ({})),
        ]);

        setStats(prevStats =>
          prevStats.map(stat => {
            if (stat.order === 0) return { ...stat, value: String(appCount || 0) };
            if (stat.order === 1) return { ...stat, value: String(departments.length || 0) };
            if (stat.order === 2) return { ...stat, value: settings?.total_awards ? String(settings.total_awards) : '50+' };
            if (stat.order === 3) return { ...stat, value: settings?.total_alumni ? String(settings.total_alumni) : '1000+' };
            return stat;
          })
        );
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto -mt-8 md:-mt-12 lg:-mt-16 relative z-10 px-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg border border-white/40 p-4 md:p-6 text-center hover:shadow-2xl hover:border-white/60 transition-all duration-300">
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-2 md:mb-3 shadow-md`}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </motion.div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-slate-600 mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-slate-600 font-medium line-clamp-2">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN HOME COMPONENT
// ============================================================
const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-hidden"
    >
      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Hero />
      </motion.div>

      {/* ============================================================
          STATS HIGHLIGHT SECTION
      ============================================================ */}
      <StatsHighlight />

      {/* ============================================================
          ADMISSION COUNTER & SCHOOL INFO
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden"
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-40 pointer-events-none" />
        
        <div className="container-custom relative">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <motion.div
              variants={slideInLeft}
              className="h-full"
            >
              <AdmissionCounter />
            </motion.div>
            <motion.div
              variants={scaleIn}
              transition={{ delay: 0.15 }}
              className="h-full"
            >
              <SchoolInfo />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          KEUNGGULAN SEKOLAH SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        {/* Subtle decorative pattern via gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-transparent opacity-50 pointer-events-none" />
        
        <div className="container-custom relative">
          <SectionHeader
            badge="✨ Mengapa Memilih Kami"
            title="Keunggulan"
            highlight="Sekolah"
            description="Fasilitas modern, kurikulum berkualitas, dan program pengembangan karakter yang komprehensif untuk masa depan cerah siswa."
            badgeColor="blue"
          />
          <motion.div variants={staggerContainer}>
            <Keunggulan />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          JURUSAN UNGGULAN SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-slate-50/70 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full -translate-y-1/2 -translate-x-1/4 blur-3xl opacity-40 pointer-events-none" />
        
        <div className="container-custom relative">
          <SectionHeader
            badge="🎓 Pilihan Program"
            title="Jurusan"
            highlight="Unggulan"
            description="Pilih jurusan yang sesuai dengan potensi dan aspirasi karir Anda untuk masa depan gemilang."
            badgeColor="emerald"
          />
          <motion.div variants={staggerContainer}>
            <JurusanPreview />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 md:mt-10"
          >
            <Link
              to="/jurusan"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group"
            >
              Lihat Semua Jurusan
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          CARA DAFTAR SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-50/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-amber-50 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl opacity-40 pointer-events-none" />
        
        <div className="container-custom relative">
          <SectionHeader
            badge="📋 Panduan Lengkap"
            title="Cara"
            highlight="Mendaftar"
            description="Ikuti langkah-langkah sederhana dan sistematis untuk menyelesaikan pendaftaran Anda dengan mudah."
            badgeColor="amber"
          />
          <motion.div variants={staggerContainer}>
            <CaraDaftar />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          SYARAT PENDAFTARAN SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-slate-50/70 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl opacity-40 pointer-events-none" />
        
        <div className="container-custom max-w-4xl relative">
          <SectionHeader
            badge="📄 Kelengkapan Dokumen"
            title="Syarat"
            highlight="Pendaftaran"
            description="Pastikan semua dokumen yang diperlukan sudah disiapkan untuk memudahkan proses verifikasi."
            badgeColor="rose"
          />
          <motion.div variants={staggerContainer}>
            <Syarat />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          PENGUMUMAN TERBARU SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-50 rounded-full translate-y-1/2 blur-3xl opacity-40 pointer-events-none" />
        
        <div className="container-custom relative">
          <SectionHeader
            badge="📢 Informasi Terkini"
            title="Pengumuman"
            highlight="Terbaru"
            description="Pantau perkembangan terbaru dan informasi penting seputar penerimaan siswa baru kami."
            badgeColor="purple"
          />
          <motion.div variants={staggerContainer}>
            <AnnouncementPreview />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 md:mt-10"
          >
            <Link
              to="/pengumuman"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
            >
              Lihat Semua Pengumuman
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          FAQ SECTION
      ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-slate-50/70 backdrop-blur-sm relative overflow-hidden"
      >
        <div className="container-custom max-w-4xl relative">
          <SectionHeader
            badge="❓ Pertanyaan Umum"
            title="Jawaban"
            highlight="FAQ"
            description="Temukan jawaban atas pertanyaan yang sering diajakan seputar pendaftaran dan program kami."
            badgeColor="indigo"
          />
          <motion.div variants={staggerContainer}>
            <FAQ />
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================================
          CALL TO ACTION SECTION
      ============================================================ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <CTASection />
      </motion.div>
    </motion.div>
  );
};

export default Home;