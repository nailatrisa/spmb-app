import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getPublishedAnnouncements } from '@/services/announcementService';
import { Button } from '@/components/ui/button';
import SkeletonCard from '@/components/SkeletonCard';
import { Calendar, ChevronRight } from 'lucide-react';

const AnnouncementPreview = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublishedAnnouncements(3);
        setAnnouncements(data);
      } catch (error) {
        console.error('Gagal ambil pengumuman:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <SkeletonCard key={i} type="announcement" />)}
      </div>
    );
  }

  if (!announcements.length) {
    return <p className="text-navy-500">Belum ada pengumuman.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.map((item) => (
          <Link key={item.id} to={`/pengumuman/${item.slug}`} className="block">
            <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 card-hover h-full">
              <h3 className="font-semibold text-navy-800 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-navy-500 mt-1 line-clamp-3">{item.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-navy-400 mt-3">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(item.published_at || item.created_at), 'd MMM yyyy', { locale: id })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/pengumuman">
          <Button variant="outline" className="gap-2">
            Lihat Semua Pengumuman <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementPreview;