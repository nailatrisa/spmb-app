import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedAnnouncements } from '../../services/announcementService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublishedAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Gagal memuat pengumuman. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Memuat pengumuman..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!announcements.length) return <EmptyState title="Belum ada pengumuman" description="Belum ada pengumuman yang dipublikasikan saat ini." />;

  return (
    <div className="container-custom py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900">Pengumuman</h1>
        <p className="mt-2 text-navy-500">Informasi terbaru seputar penerimaan siswa baru.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((item) => {
          // Pastikan slug ada, jika tidak pakai id
          const slug = item.slug || item.id;
          return (
            <Link key={item.id} to={`/pengumuman/${slug}`} className="block">
              <Card className="border-slate-200 shadow-soft card-hover h-full flex flex-col">
                {item.image_url && (
                  <div className="w-full h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-navy-400 mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(item.published_at || item.created_at), 'd MMMM yyyy', { locale: id })}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-navy-800 line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-navy-600 line-clamp-3">{item.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 h-auto text-primary-600 gap-1">
                    Baca Selengkapnya <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Announcements;