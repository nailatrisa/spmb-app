import React, { useState, useEffect } from 'react';
import {
  getAllDepartmentsAdmin,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentActive,
} from '@/services/departmentService';
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
  Power,
  PowerOff,
  Search,
} from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    quota: '',
    image_url: '',
    is_active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDepartmentsAdmin();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (err) {
      setError('Gagal memuat data jurusan.');
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
      setFilteredDepartments(departments);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.code.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term))
    );
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  const openForm = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        code: department.code || '',
        name: department.name || '',
        description: department.description || '',
        quota: department.quota || '',
        image_url: department.image_url || '',
        is_active: department.is_active ?? true,
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        quota: '',
        image_url: '',
        is_active: true,
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        quota: parseInt(formData.quota) || 0,
      };
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, dataToSubmit);
      } else {
        await createDepartment(dataToSubmit);
      }
      await fetchData();
      setFormOpen(false);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan data jurusan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleDepartmentActive(id, !currentStatus);
      await fetchData();
    } catch (err) {
      alert('Gagal mengubah status jurusan.');
    }
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteDepartment(departmentToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (err) {
      alert(err.message || 'Gagal menghapus jurusan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Jurusan</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
          <Button onClick={() => openForm()}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
        </div>
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
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kuota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-mono">{dept.code}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.quota}</TableCell>
                  <TableCell><Badge variant={dept.is_active ? 'default' : 'secondary'}>{dept.is_active ? 'Aktif' : 'Nonaktif'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(dept.id, dept.is_active)}>
                      {dept.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openForm(dept)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setDepartmentToDelete(dept); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDepartment ? 'Edit' : 'Tambah'} Jurusan</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div><Label>Kode *</Label><Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required /></div>
              <div><Label>Nama *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div><Label>Deskripsi *</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
              <div><Label>Kuota *</Label><Input type="number" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} required /></div>
              <div><Label>Gambar URL</Label><Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
            </div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setFormOpen(false)}>Batal</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}Simpan</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Jurusan?</AlertDialogTitle><AlertDialogDescription>Yakin ingin menghapus {departmentToDelete?.name}?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Departments;