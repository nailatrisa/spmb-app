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
  CheckCircle,
  XCircle,
  UserCheck,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

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
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);

  // Ambil data pendaftar yang sudah diverifikasi
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const [appsResult, deptsResult] = await Promise.all([
        supabase
          .from('applications')
          .select(`
            *,
            department_1:department_1 (id, name, code, quota, min_score),
            department_2:department_2 (id, name, code),
            school_origin:school_origin_id (id, name)
          `)
          .in('status', ['verified', 'accepted', 'rejected', 'reserve'])
          .order('registered_at', { ascending: false }),
        supabase.from('departments').select('id, name, code').eq('is_active', true),
      ]);

      if (appsResult.error) throw appsResult.error;
      if (deptsResult.error) throw deptsResult.error;

      // Tambahkan ranking berdasarkan nilai
      const apps = appsResult.data
        .filter(app => app.average_score !== null)
        .sort((a, b) => (b.average_score || 0) - (a.average_score || 0))
        .map((app, index) => ({
          ...app,
          rank: index + 1,
        }));

      // Tambahkan yang belum punya nilai di akhir
      const noScoreApps = appsResult.data
        .filter(app => app.average_score === null)
        .map((app, index) => ({
          ...app,
          rank: apps.length + index + 1,
        }));

      setApplicants([...apps, ...noScoreApps]);
      setFilteredApplicants([...apps, ...noScoreApps]);
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

    if (departmentFilter !== 'all') {
      result = result.filter((app) => app.department_1?.id === departmentFilter);
    }

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
          valA = a.average_score || 0;
          valB = b.average_score || 0;
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

  const openDetail = (applicant) => {
    setSelectedApplicant(applicant);
    setDetailOpen(true);
  };

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

  // 🔥 SELEKSI OTOMATIS BERDASARKAN NILAI & KUOTA
  const handleAutoSelection = async () => {
    if (!window.confirm('Lakukan seleksi otomatis berdasarkan nilai dan kuota?')) return;

    setIsAutoSelecting(true);
    try {
      // Ambil semua siswa yang sudah diverifikasi
      const { data: verifiedStudents, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          department_1:department_1 (id, name, quota, min_score)
        `)
        .eq('status', 'verified');

      if (fetchError) throw fetchError;

      if (!verifiedStudents || verifiedStudents.length === 0) {
        alert('Tidak ada siswa yang siap diseleksi.');
        setIsAutoSelecting(false);
        return;
      }

      let acceptedCount = 0;
      let rejectedCount = 0;
      let reserveCount = 0;
      let skippedCount = 0;

      // Kelompokkan berdasarkan jurusan
      const byDepartment = {};
      for (const student of verifiedStudents) {
        const deptId = student.department_1;
        if (!deptId) continue;
        if (!byDepartment[deptId]) {
          byDepartment[deptId] = {
            dept: student.department_1,
            students: [],
          };
        }
        byDepartment[deptId].students.push(student);
      }

      // Proses setiap jurusan
      for (const deptId of Object.keys(byDepartment)) {
        const { dept, students } = byDepartment[deptId];
        // Urutkan siswa berdasarkan nilai tertinggi
        students.sort((a, b) => (b.average_score || 0) - (a.average_score || 0));

        let accepted = 0;

        for (const student of students) {
          // Cek apakah nilai memenuhi min_score
          if (student.average_score === null || student.average_score < dept.min_score) {
            // Nilai tidak memenuhi -> ditolak
            await supabase
              .from('applications')
              .update({ status: 'rejected', updated_at: new Date().toISOString() })
              .eq('id', student.id);
            rejectedCount++;
            continue;
          }

          // Cek kuota
          if (accepted < dept.quota) {
            // Terima
            await supabase
              .from('applications')
              .update({ status: 'accepted', updated_at: new Date().toISOString() })
              .eq('id', student.id);
            accepted++;
            acceptedCount++;
          } else {
            // Kuota penuh -> cadangan
            await supabase
              .from('applications')
              .update({ status: 'reserve', updated_at: new Date().toISOString() })
              .eq('id', student.id);
            reserveCount++;
          }
        }
      }

      alert(`Seleksi otomatis selesai!\n✅ Diterima: ${acceptedCount}\n📋 Cadangan: ${reserveCount}\n❌ Ditolak: ${rejectedCount}`);
      await fetchApplicants();
    } catch (error) {
      console.error('Gagal seleksi otomatis:', error);
      alert('Terjadi kesalahan saat seleksi otomatis.');
    } finally {
      setIsAutoSelecting(false);
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
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seleksi Calon Siswa</h2>
          <p className="text-sm text-slate-500">Lakukan seleksi dan tentukan kelulusan calon siswa berdasarkan nilai SKL</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAutoSelection} 
            className="gap-2 bg-slate-800 text-white hover:bg-slate-700"
            disabled={isAutoSelecting}
          >
            {isAutoSelecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {isAutoSelecting ? 'Memproses...' : 'Seleksi Otomatis'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchApplicants} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
      <Card className="border-slate-200 shadow-sm">
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
                    Nilai SKL
                    {sortField === 'score' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead>Min Score</TableHead>
                <TableHead>Syarat</TableHead>
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
                  <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                    Tidak ada data yang siap diseleksi.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((app) => {
                  const isEligible = app.average_score !== null && 
                                     app.department_1?.min_score !== null && 
                                     app.average_score >= app.department_1.min_score;
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-bold text-slate-800">{app.rank || '-'}</TableCell>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell className="font-mono text-xs">{app.registration_number}</TableCell>
                      <TableCell>{app.department_1?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {app.average_score || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600">
                          {app.department_1?.min_score || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.average_score && app.department_1?.min_score ? (
                          isEligible ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">✅ Memenuhi</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 border-red-200">❌ Tidak Memenuhi</Badge>
                          )
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-blue-600"
                          onClick={() => openDetail(app)}
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
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
                  <p className="text-xs text-slate-400">Nama Lengkap</p>
                  <p className="font-medium text-slate-800">{selectedApplicant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">NISN</p>
                  <p className="font-medium text-slate-800">{selectedApplicant.nisn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Jurusan Pilihan 1</p>
                  <p className="font-medium text-slate-800">{selectedApplicant.department_1?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Nilai SKL</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-lg px-3 py-1">
                    {selectedApplicant.average_score || '-'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Nilai Minimum</p>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 text-lg px-3 py-1">
                    {selectedApplicant.department_1?.min_score || '-'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status Saat Ini</p>
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
                Nilai SKL: {selectedApplicant?.average_score}
              </div>
              <div className="text-sm">
                Min Score: {selectedApplicant?.department_1?.min_score}
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