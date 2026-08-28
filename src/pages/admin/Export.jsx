import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText, Printer, Download, Loader2 } from 'lucide-react';

const Export = () => {
  const [format, setFormat] = useState('excel');
  const [exportType, setExportType] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulasi export
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Data berhasil diexport dalam format ${format.toUpperCase()}`);
    } catch (error) {
      alert('Gagal export data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-900">Export Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pengaturan Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Jenis Data</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Data</SelectItem>
                  <SelectItem value="applicants">Data Pendaftar</SelectItem>
                  <SelectItem value="accepted">Diterima</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="statistics">Statistik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Format</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={format === 'excel' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setFormat('excel')}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
                <Button
                  variant={format === 'pdf' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setFormat('pdf')}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant={format === 'print' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setFormat('print')}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>

            <Button
              className="w-full gap-2 bg-primary-600 hover:bg-primary-700"
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {loading ? 'Memproses...' : 'Export Data'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-navy-600">
            <p>📊 Data akan diexport sesuai dengan filter yang berlaku.</p>
            <p>📋 Format Excel (.xlsx) untuk pengolahan data lanjutan.</p>
            <p>📄 Format PDF untuk laporan resmi.</p>
            <p>🖨️ Print untuk mencetak langsung.</p>
            <p className="text-xs text-navy-400 mt-4">
              * Export menggunakan filter yang aktif pada halaman data terkait.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;