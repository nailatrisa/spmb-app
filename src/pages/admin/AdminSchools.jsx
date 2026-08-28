import React, { useState, useEffect } from 'react';
import {
  getAllSchools,
  createSchoolOrigin,
  updateSchoolOrigin,
  deleteSchoolOrigin,
} from '../../services/schoolService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent } from '../../components/ui/card';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  Search,
  School,
} from 'lucide-react';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    npsn: '',
    address: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllSchools();
      setSchools(data);
      setFilteredSchools(data);
    } catch (err) {
      setError('Gagal memuat data sekolah.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSchools(schools);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = schools.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        (s.npsn && s.npsn.includes(term))
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  const openForm = (school = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name || '',
        npsn: school.npsn || '',
        address: school.address || '',
      });
    } else {
      setEditingSchool(null);
      setFormData({ name: '', npsn: '', address: '' });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSchool) {
        await updateSchoolOrigin(editingSchool.id, formData);
      } else {
        await createSchoolOrigin(formData);
      }
      await fetchData();
      setFormOpen(false);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!schoolToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteSchoolOrigin(schoolToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setSchoolToDelete(null);
    } catch (err) {
      alert(err.message || 'Gagal menghapus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Asal Sekolah</h2>
        <Button onClick={() => openForm()}><Plus className="mr-2 h-4 w-4" /> Tambah</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <Input placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Sekolah</TableHead>
                <TableHead>NPSN</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell><School className="inline mr-2 h-4 w-4" />{school.name}</TableCell>
                  <TableCell>{school.npsn || '-'}</TableCell>
                  <TableCell>{school.address || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openForm(school)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setSchoolToDelete(school); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingSchool ? 'Edit' : 'Tambah'} Sekolah</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div><Label>Nama Sekolah *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div><Label>NPSN</Label><Input value={formData.npsn} onChange={e => setFormData({...formData, npsn: e.target.value})} /></div>
              <div><Label>Alamat</Label><Textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
            </div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setFormOpen(false)}>Batal</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}Simpan</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Sekolah?</AlertDialogTitle><AlertDialogDescription>Yakin ingin menghapus {schoolToDelete?.name}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Schools;