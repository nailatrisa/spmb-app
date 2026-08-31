import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

const Rejected = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsResult, deptsResult] = await Promise.all([
        supabase
          .from('applications')
          .select(`
            *,
            department_1:department_1 (id, name, code),
            school_origin:school_origin_id (id, name)
          `)
          .eq('status', 'rejected')
          .order('registered_at', { ascending: false }),
        supabase.from('departments').select('id, name, code').eq('is_active', true),
      ]);

      if (appsResult.error) throw appsResult.error;
      if (deptsResult.error) throw deptsResult.error;

      setApplicants(appsResult.data || []);
      setFilteredApplicants(appsResult.data || []);
      setDepartments(deptsResult.data || []);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = applicants;
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
    setFilteredApplicants(result);
  }, [searchTerm, departmentFilter, applicants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Daftar Ditolak</h2>
          <p className="text-sm text-navy-500">Calon siswa yang tidak lolos seleksi</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <Input
            placeholder="Cari nama atau nomor..."
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
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-slate-200 shadow-soft">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No Pendaftaran</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-navy-400">
                    Belum ada siswa yang ditolak.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">{app.registration_number}</TableCell>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.department_1?.name || '-'}</TableCell>
                    <TableCell>{app.school_origin?.name || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(app.updated_at), 'dd/MM/yyyy', { locale: id })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rejected;