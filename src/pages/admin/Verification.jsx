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
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  RefreshCw,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  User,
  Calendar,
  School,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import StatusBadge from '@/components/admin/StatusBadge';

const Verification = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Ambil data pendaftar yang menunggu verifikasi
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('applications')
        .select(`
          *,
          department_1:department_1 (id, name, code),
          department_2:department_2 (id, name, code),
          school_origin:school_origin_id (id, name)
        `)
        .in('status', ['pending', 'verified', 'doc-incomplete'])
        .order('registered_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setApplicants(data || []);
      setFilteredApplicants(data || []);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Filter
  useEffect(() => {
    let result = applicants;
    if (statusFilter !== 'all') {
      result = result.filter((app) => app.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.full_name.toLowerCase().includes(term) ||
          app.registration_number.toLowerCase().includes(term)
      );
    }
    setFilteredApplicants(result);
  }, [searchTerm, statusFilter, applicants]);

  // Buka detail
  const openDetail = (applicant) => {
    setSelectedApplicant(applicant);
    setVerificationNote('');
    setDetailOpen(true);
  };

  // Handle verifikasi
  const handleVerify = async (action) => {
    if (!selectedApplicant) return;
    
    setIsSubmitting(true);
    try {
      let newStatus = selectedApplicant.status;
      let note = verificationNote;

      switch (action) {
        case 'accept':
          newStatus = 'verified';
          note = note || 'Dokumen lengkap dan valid.';
          break;
        case 'reject':
          newStatus = 'rejected';
          note = note || 'Dokumen tidak memenuhi syarat.';
          break;
        case 'incomplete':
          newStatus = 'doc-incomplete';
          note = note || 'Dokumen tidak lengkap, silakan perbaiki.';
          break;
        default:
          break;
      }

      // Update status di database
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedApplicant.id);

      if (error) throw error;

      // Simpan catatan ke audit log (jika tabel ada)
      try {
        await supabase.from('audit_logs').insert([
          {
            admin_name: 'Administrator',
            action: 'verifikasi_dokumen',
            target: selectedApplicant.registration_number,
            details: `${selectedApplicant.full_name}: ${note}`,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (logError) {
        console.error('Gagal simpan audit log:', logError);
      }

      // Refresh data
      await fetchApplicants();
      setDetailOpen(false);
      setSelectedApplicant(null);
      setVerificationNote('');
      
      alert(`Status berhasil diperbarui menjadi ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Gagal verifikasi:', error);
      alert('Gagal memverifikasi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format status
  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Menunggu', variant: 'outline', className: 'bg-amber-50 text-amber-600 border-amber-200' },
      verified: { label: 'Terverifikasi', variant: 'outline', className: 'bg-green-50 text-green-600 border-green-200' },
      'doc-incomplete': { label: 'Dokumen Tidak Lengkap', variant: 'outline', className: 'bg-red-50 text-red-600 border-red-200' },
      rejected: { label: 'Ditolak', variant: 'outline', className: 'bg-red-50 text-red-600 border-red-200' },
    };
    const info = map[status] || map.pending;
    return <Badge className={info.className}>{info.label}</Badge>;
  };

  // Loading state
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
          <h2 className="text-2xl font-bold text-navy-900">Verifikasi Berkas</h2>
          <p className="text-sm text-navy-500">Periksa dan verifikasi dokumen calon siswa</p>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="verified">Terverifikasi</SelectItem>
            <SelectItem value="doc-incomplete">Tidak Lengkap</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabel */}
      <Card className="border-slate-200 shadow-soft">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No Pendaftaran</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-navy-400">
                    Tidak ada data yang perlu diverifikasi.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">{app.registration_number}</TableCell>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.department_1?.name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      {format(new Date(app.registered_at), 'dd/MM/yyyy', { locale: id })}
                    </TableCell>
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
              Verifikasi Dokumen
              <Badge variant="outline" className="font-mono">
                {selectedApplicant?.registration_number}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Periksa kelengkapan dan keabsahan dokumen calon siswa.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              {/* Informasi Calon Siswa */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-navy-400">Nama Lengkap</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">NIK</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.nik}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">NISN</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.nisn}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Status</p>
                  {getStatusBadge(selectedApplicant.status)}
                </div>
                <div>
                  <p className="text-xs text-navy-400">Jurusan Pilihan 1</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.department_1?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400">Asal Sekolah</p>
                  <p className="font-medium text-navy-800">{selectedApplicant.school_origin?.name || '-'}</p>
                </div>
              </div>

              {/* Dokumen yang Diupload */}
              <div className="space-y-2">
                <h4 className="font-semibold text-navy-800">Dokumen</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApplicant.photo_url && (
                    <a href={selectedApplicant.photo_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <FileText className="h-4 w-4" />
                        Pas Foto
                      </Button>
                    </a>
                  )}
                  {selectedApplicant.family_card_url && (
                    <a href={selectedApplicant.family_card_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <FileText className="h-4 w-4" />
                        Kartu Keluarga
                      </Button>
                    </a>
                  )}
                  {selectedApplicant.birth_certificate_url && (
                    <a href={selectedApplicant.birth_certificate_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <FileText className="h-4 w-4" />
                        Akta Lahir
                      </Button>
                    </a>
                  )}
                  {selectedApplicant.diploma_url && (
                    <a href={selectedApplicant.diploma_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <FileText className="h-4 w-4" />
                        Ijazah/SKL
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Catatan Verifikasi */}
              <div className="space-y-1">
                <Label htmlFor="note">Catatan Verifikasi</Label>
                <Textarea
                  id="note"
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Tambahkan catatan jika ada..."
                  rows={2}
                />
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
                  Verifikasi & Terima
                </Button>
                <Button
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    setConfirmAction('incomplete');
                    setConfirmDialogOpen(true);
                  }}
                  disabled={isSubmitting}
                >
                  <AlertCircle className="h-4 w-4" />
                  Minta Perbaikan
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
                  Tolak
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
            <AlertDialogTitle>Konfirmasi Verifikasi</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'accept' && 'Anda akan memverifikasi dan menerima dokumen calon siswa ini.'}
              {confirmAction === 'incomplete' && 'Anda akan meminta perbaikan dokumen calon siswa ini.'}
              {confirmAction === 'reject' && 'Anda akan menolak dokumen calon siswa ini.'}
              <div className="mt-2 text-sm font-medium">
                Nama: {selectedApplicant?.full_name}
              </div>
              <div className="text-sm">
                No. Pendaftaran: {selectedApplicant?.registration_number}
              </div>
              {verificationNote && (
                <div className="mt-2 text-sm text-navy-600 bg-slate-50 p-2 rounded">
                  <strong>Catatan:</strong> {verificationNote}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleVerify(confirmAction);
                setConfirmDialogOpen(false);
              }}
              className={
                confirmAction === 'accept'
                  ? 'bg-green-600 hover:bg-green-700'
                  : confirmAction === 'incomplete'
                  ? 'bg-amber-600 hover:bg-amber-700'
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

export default Verification;