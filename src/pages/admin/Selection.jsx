import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Search,
  RefreshCw,
  Loader2,
  Eye,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  UserCheck,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import StatusBadge from '@/components/admin/StatusBadge';

const Selection = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [sortField, setSortField] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');

  // Ambil data pendaftar yang sudah diverifikasi
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const [appsResult, deptsResult] = await Promise.all([
        supabase
          .from('applications')
          .select(`
            *,
            department_1:department_1 (id, name, code, quota),
            department_2:department_2 (id, name, code),
            school_origin:school_origin_id (id, name)
          `)
          .in('status', ['verified', 'accepted', 'rejected', 'reserve'])
          .order('registered_at', { ascending: false }),
        supabase.from('departments').select('id, name, code').eq('is_active', true),
      ]);

      if (appsResult.error) throw appsResult.error;
      if (deptsResult.error) throw deptsResult.error;

      // Tambahkan ranking sementara (nanti bisa dihitung dari nilai)
      const apps = appsResult.data.map((app, index) => ({
        ...app,
        rank: index + 1,
        score: Math.floor(Math.random() * 50) + 50, // Simulasi nilai 50-100
      }));

      setApplicants(apps);
      setFilteredApplicants(apps);
      setDepartments(deptsResult.data || []);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Filter & Sorting
  useEffect(() => {
    let result = [...applicants];

    // Filter jurusan
    if (departmentFilter !== 'all') {
      result = result.filter((app) => app.department_1?.id === departmentFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.full_name.toLowerCase().includes(term) ||
          app.registration_number.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      switch (sortField) {
        case 'rank':
          valA = a.rank || 999;
          valB = b.rank || 999;
          break;
        case 'name':
          valA = a.full_name;
          valB = b.full_name;
          break;
        case 'score':
          valA = a.score || 0;
          valB = b.score || 0;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        default:
          valA = a.rank || 999;
          valB = b.rank || 999;
      }
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredApplicants(result);
  }, [searchTerm, departmentFilter, applicants, sortField, sortOrder]);

  // Buka detail
  const openDetail = (applicant) => {
    setSelectedApplicant(applicant);
    setDetailOpen(true);
  };

  // Handle seleksi
  const handleSelection = async (action) => {
    if (!selectedApplicant) return;

    setIsSubmitting(true);
    try {
      let newStatus = selectedApplicant.status;
      switch (action) {
        case 'accept':
          newStatus = 'accepted';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'reserve':
          newStatus = 'reserve';
          break;
        default:
          break;
      }

      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedApplicant.id);

      if (error) throw error;

      // Audit log
      try {
        await supabase.from('audit_logs').insert([
          {
            admin_name: 'Administrator',
            action: 'seleksi_siswa',
            target: selectedApplicant.registration_number,
            details: `${selectedApplicant.full_name} -> ${newStatus}`,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (logError) {
        console.error('Gagal simpan audit log:', logError);
      }

      await fetchApplicants();
      setDetailOpen(false);
      setSelectedApplicant(null);
      alert(`Status berhasil diperbarui menjadi ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Gagal seleksi:', error);
      alert('Gagal melakukan seleksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      verified: { label: 'Terverifikasi', className: 'bg-blue-50 text-blue-600 border-blue-200' },
      accepted: { label: 'Diterima', className: 'bg-green-50 text-green-600 border-green-200' },
      rejected: { label: 'Ditolak', className: 'bg-red-50 text-red-600 border-red-200' },
      reserve: { label: 'Cadangan', className: 'bg-purple-50 text-purple-600 border-purple-200' },
    };
    const info = map[status] || map.verified;
    return <Badge className={info.className}>{info.label}</Badge>;
  };

  // Toggle sort
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Seleksi Calon Siswa</h2>
          <p className="text-sm text-navy-500">Lakukan seleksi dan tentukan kelulusan calon siswa</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchApplicants} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <Input
            placeholder="Cari nama atau nomor pendaftaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter Jurusan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jurusan</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabel */}
      <Card className="border-slate-200 shadow-soft">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 cursor-pointer" onClick={() => toggleSort('rank')}>
                  <div className="flex items-center gap-1">
                    Rank
                    {sortField === 'rank' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    Nama
                    {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead>No Pendaftaran</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('score')}>
                  <div className="flex items-center gap-1">
                    Nilai
                    {sortField === 'score' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === 'status' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-navy-400">
                    Tidak ada data yang siap diseleksi.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-bold text-navy-800">{app.rank || '-'}</TableCell>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell className="font-mono text-xs">{app.registration_number}</TableCell>
                    <TableCell>{app.department_1?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary-50 text-primary-700">
                        {app.score || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary-600"
                        onClick={() => openDetail(app)}
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Award className="h-5 w-5 text-amber-500" />
              Detail Seleksi
              <Badge variant="outline" className="font-mono">
                {selectedApplicant?.registration_number}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Tinjau data calon siswa dan tentukan keputusan seleksi.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              {/* Informasi */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-navy-400">Nama Lengkap</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">NISN</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.nisn}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Jurusan Pilihan 1</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.department_1?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Nilai</p>
                  <Badge variant="outline" className="bg-primary-50 text-primary-700 text-lg px-3 py-1">
                    {selectedApplicant.score || '-'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Asal Sekolah</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.school_origin?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Status Saat Ini</p>
                  {getStatusBadge(selectedApplicant.status)}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                <Button
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setConfirmAction('accept');
                    setConfirmDialogOpen(true);
                  }}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4" />
                  Loloskan
                </Button>
                <Button
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    setConfirmAction('reserve');
                    setConfirmDialogOpen(true);
                  }}
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-4 w-4" />
                  Cadangan
                </Button>
                <Button
                  className="gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setConfirmAction('reject');
                    setConfirmDialogOpen(true);
                  }}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4" />
                  Tidak Lolos
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keputusan Seleksi</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'accept' && 'Anda akan meloloskan calon siswa ini.'}
              {confirmAction === 'reserve' && 'Anda akan memasukkan calon siswa ini ke daftar cadangan.'}
              {confirmAction === 'reject' && 'Anda akan menolak calon siswa ini.'}
              <div className="mt-2 text-sm font-medium">
                Nama: {selectedApplicant?.full_name}
              </div>
              <div className="text-sm">
                Jurusan: {selectedApplicant?.department_1?.name}
              </div>
              <div className="text-sm">
                Nilai: {selectedApplicant?.score}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSelection(confirmAction);
                setConfirmDialogOpen(false);
              }}
              className={
                confirmAction === 'accept'
                  ? 'bg-green-600 hover:bg-green-700'
                  : confirmAction === 'reserve'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Selection;