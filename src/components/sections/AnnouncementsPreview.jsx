import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementService } from '../../services/announcementService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, ArrowRight, Megaphone } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import ErrorState from '../ErrorState';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AnnouncementsPreview = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getPublishedAnnouncements(3);
        setAnnouncements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner fullScreen={false} text="Memuat pengumuman..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-navy-500">Belum ada pengumuman.</p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            Pengumuman <span className="text-primary-600">Terbaru</span>
          </h2>
          <p className="mt-3 text-navy-600">
            Informasi dan berita terbaru seputar penerimaan siswa baru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Link key={announcement.id} to={`/pengumuman/${announcement.slug}`}>
              <Card className="h-full border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                {announcement.image_url && (
                  <div className="h-40 overflow-hidden rounded-t-xl">
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-navy-800 line-clamp-2">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-navy-500 line-clamp-2">{announcement.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-navy-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {announcement.published_at
                        ? format(new Date(announcement.published_at), 'dd MMMM yyyy', { locale: id })
                        : format(new Date(announcement.created_at), 'dd MMMM yyyy', { locale: id })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/pengumuman">
            <Button variant="outline" className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50">
              Lihat Semua Pengumuman
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsPreview;