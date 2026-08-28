import React, { useState, useEffect } from 'react';
import {
  getAllDepartmentsForAdmin,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
  getDepartmentApplicationCounts,
} from '../../services/departmentService';
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
import { Badge } from '../../components/ui/badge';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    quota: '',
    image_url: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [depts, countsData] = await Promise.all([
        getAllDepartmentsForAdmin(),
        getDepartmentApplicationCounts(),
      ]);
      setDepartments(depts);
      setCounts(countsData);
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

  // Filter berdasarkan search
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openCreateDialog = () => {
    setEditingDepartment(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      quota: '',
      image_url: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (dept) => {
    setEditingDepartment(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      description: dept.description,
      quota: dept.quota.toString(),
      image_url: dept.image_url || '',
      is_active: dept.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        quota: parseInt(formData.quota),
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active,
      };

      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, data);
      } else {
        await createDepartment(data);
      }
      await fetchData();
      setDialogOpen(false);
    } catch (err) {
      console.error('Gagal simpan jurusan:', err);
      alert('Gagal menyimpan data jurusan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept) => {
    try {
      await toggleDepartmentStatus(dept.id, dept.is_active);
      await fetchData();
    } catch (err) {
      console.error('Gagal toggle status:', err);
      alert('Gagal mengubah status.');
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
      console.error('Gagal hapus jurusan:', err);
      alert(err.message || 'Gagal menghapus jurusan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={fetchData}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy-900">Kelola Jurusan</h2>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Jurusan
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <Input
          placeholder="Cari kode atau nama jurusan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card className="border-slate-200 shadow-soft">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center">Kuota</TableHead>
                <TableHead className="text-center">Pendaftar</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-navy-400">
                    Tidak ada data jurusan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((dept, idx) => (
                  <TableRow key={dept.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-mono text-xs">{dept.code}</TableCell>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{dept.description}</TableCell>
                    <TableCell className="text-center">{dept.quota}</TableCell>
                    <TableCell className="text-center">{counts[dept.id] || 0}</TableCell>
                    <TableCell className="text-center">
                      {dept.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" /> Aktif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                          <XCircle className="h-3 w-3 mr-1" /> Nonaktif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(dept)}
                          title={dept.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {dept.is_active ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(dept)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => {
                            setDepartmentToDelete(dept);
                            setDeleteDialogOpen(true);
                          }}
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Tambah/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? 'Ubah data jurusan yang sudah ada.'
                : 'Isi data jurusan baru untuk ditambahkan.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="code">Kode *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="RPL"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Nama *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Rekayasa Perangkat Lunak"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Deskripsi jurusan..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="quota">Kuota *</Label>
                <Input
                  id="quota"
                  name="quota"
                  type="number"
                  value={formData.quota}
                  onChange={handleFormChange}
                  placeholder="100"
                  required
                  min="1"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleFormChange}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="is_active" className="text-sm font-normal">
                Aktif (ditampilkan di halaman publik)
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingDepartment ? 'Simpan Perubahan' : 'Tambah Jurusan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jurusan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jurusan <strong>{departmentToDelete?.name}</strong> (Kode: {departmentToDelete?.code})? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDepartments;