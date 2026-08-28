import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnouncementBySlug } from '../../services/announcementService';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AnnouncementDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jika slug tidak ada, redirect ke halaman pengumuman
    if (!slug) {
      navigate('/pengumuman');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncementBySlug(slug);
        if (!data) {
          setError('Pengumuman tidak ditemukan.');
          setLoading(false);
          return;
        }
        setAnnouncement(data);
      } catch (err) {
        // Jika error karena data tidak ditemukan, tampilkan pesan
        if (err.code === 'PGRST116') {
          setError('Pengumuman tidak ditemukan.');
        } else {
          setError('Gagal memuat pengumuman.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (loading) return <LoadingSpinner fullScreen text="Memuat pengumuman..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/pengumuman')} />;
  if (!announcement) return <ErrorState message="Pengumuman tidak ditemukan." onRetry={() => navigate('/pengumuman')} />;

  return (
    <div className="container-custom py-12">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/pengumuman')}>
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Pengumuman
      </Button>

      <article className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
        {announcement.image_url && (
          <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
            <img 
              src={announcement.image_url} 
              alt={announcement.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(announcement.published_at || announcement.created_at), 'd MMMM yyyy', { locale: id })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(announcement.published_at || announcement.created_at), 'HH:mm', { locale: id })}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
            {announcement.title}
          </h1>

          <div className="prose prose-slate max-w-none">
            <div 
              className="text-navy-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: announcement.content.replace(/\n/g, '<br />') }}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => navigate('/pengumuman')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Pengumuman
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AnnouncementDetail;