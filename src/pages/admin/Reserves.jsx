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
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Reserves = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          department_1:department_1 (name, code),
          school_origin:school_origin_id (name)
        `)
        .eq('status', 'reserve')
        .order('registered_at', { ascending: false });
      if (error) throw error;
      setApplicants(data || []);
    } catch (error) {
      console.error('Gagal ambil data cadangan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = applicants.filter(
    (app) =>
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold text-navy-900">Daftar Cadangan</h2>
          <p className="text-sm text-navy-500">Calon siswa yang masuk daftar cadangan</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <Input
          placeholder="Cari nama atau nomor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-navy-400">
                    Belum ada siswa cadangan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">{app.registration_number}</TableCell>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.department_1?.name || '-'}</TableCell>
                    <TableCell>{app.school_origin?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-300">
                        Cadangan
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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

export default Reserves;