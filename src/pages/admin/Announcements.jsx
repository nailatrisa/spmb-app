import React, { useState, useEffect, useRef } from 'react';
import {
  getAllAnnouncementsAdmin,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementPublish,
  generateSlug,
} from '@/services/announcementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: false,
    was_published: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncementsAdmin();
      setAnnouncements(data);
    } catch (err) {
      setError('Gagal memuat data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.title && !editingAnnouncement) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, editingAnnouncement]);

  const openForm = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title || '',
        slug: announcement.slug || '',
        excerpt: announcement.excerpt || '',
        content: announcement.content || '',
        image_url: announcement.image_url || '',
        is_published: announcement.is_published || false,
        was_published: announcement.is_published || false,
      });
      if (announcement.image_url) setImagePreview(announcement.image_url);
    } else {
      setEditingAnnouncement(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', image_url: '', is_published: false, was_published: false });
      setImagePreview('');
      setImageFile(null);
    }
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert('Maks 2MB'); return; }
      if (!file.type.startsWith('image/')) { alert('Hanya gambar'); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData({ ...formData, image_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = { ...formData, slug: formData.slug.toLowerCase().replace(/\s+/g, '-') };
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, dataToSubmit, imageFile);
      } else {
        await createAnnouncement(dataToSubmit, imageFile);
      }
      await fetchData();
      setFormOpen(false);
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      alert(err.message || 'Gagal menyimpan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await toggleAnnouncementPublish(id, !currentStatus);
      await fetchData();
    } catch (err) {
      alert('Gagal mengubah status.');
    }
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteAnnouncement(announcementToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      alert('Gagal menghapus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Pengumuman</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
          <Button onClick={() => openForm()}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-xs font-mono">{item.slug}</TableCell>
                  <TableCell><Badge variant={item.is_published ? 'default' : 'secondary'}>{item.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                  <TableCell>{item.published_at ? format(new Date(item.published_at), 'dd/MM/yyyy', { locale: id }) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(item.id, item.is_published)}>
                      {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openForm(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setAnnouncementToDelete(item); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingAnnouncement ? 'Edit' : 'Tambah'} Pengumuman</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div><Label>Judul *</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
              <div><Label>Slug *</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required /></div>
              <div><Label>Ringkasan *</Label><Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} required /></div>
              <div><Label>Konten *</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={6} required /></div>
              <div>
                <Label>Gambar</Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded border" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-6 w-6" />
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <Label>Publikasikan sekarang</Label>
              </div>
            </div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setFormOpen(false)}>Batal</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}Simpan</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle><AlertDialogDescription>Yakin ingin menghapus?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAnnouncements;