import React, { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus, deleteApplication } from '../../services/applicationService';
import { getDepartments } from '../../services/departmentService';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apps, depts] = await Promise.all([
        getAllApplications(),
        getDepartments(),
      ]);
      setApplicants(apps);
      setFiltered(apps);
      setDepartments(depts);
      setError(null);
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
    let result = applicants;
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.full_name.toLowerCase().includes(s) ||
          a.registration_number.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, applicants]);

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status === 'pending' ? 'Menunggu' :
         status === 'verified' ? 'Terverifikasi' :
         status === 'accepted' ? 'Diterima' : 'Ditolak'}
      </span>
    );
  };

  const getDeptName = (id) => {
    const d = departments.find((dept) => dept.id === id);
    return d ? d.name : '-';
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    try {
      await updateApplicationStatus(selected.id, newStatus);
      await fetchData();
      setShowStatusDialog(false);
      setSelected(null);
    } catch (err) {
      alert('Gagal update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApplication(deleteId);
      await fetchData();
      setShowDeleteDialog(false);
      setDeleteId(null);
    } catch (err) {
      alert('Gagal hapus data');
    }
  };

  if (loading) return <div className="text-center py-10">Memuat...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error} <button onClick={fetchData} className="ml-2 underline">Refresh</button></div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calon Siswa</h2>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari nama / nomor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="verified">Terverifikasi</option>
          <option value="accepted">Diterima</option>
          <option value="rejected">Ditolak</option>
        </select>
        <button onClick={fetchData} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Refresh
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Pendaftaran</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jurusan 1</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
            ) : (
              filtered.map((app, idx) => (
                <tr key={app.id}>
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono">{app.registration_number}</td>
                  <td className="px-4 py-3 text-sm font-medium">{app.full_name}</td>
                  <td className="px-4 py-3 text-sm">{getDeptName(app.department_1)}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(app.status)}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => { setSelected(app); setShowDetail(true); }}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => { setSelected(app); setNewStatus(app.status); setShowStatusDialog(true); }}
                      className="text-green-600 hover:underline"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => { setDeleteId(app.id); setShowDeleteDialog(true); }}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Sederhana */}
      {showDetail && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Detail Pendaftar</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">No. Pendaftaran:</span> {selected.registration_number}</p>
              <p><span className="font-semibold">Nama:</span> {selected.full_name}</p>
              <p><span className="font-semibold">NIK:</span> {selected.nik}</p>
              <p><span className="font-semibold">NISN:</span> {selected.nisn}</p>
              <p><span className="font-semibold">Tempat Lahir:</span> {selected.birth_place}</p>
              <p><span className="font-semibold">Tanggal Lahir:</span> {selected.birth_date}</p>
              <p><span className="font-semibold">Jenis Kelamin:</span> {selected.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              <p><span className="font-semibold">Agama:</span> {selected.religion}</p>
              <p><span className="font-semibold">No. HP:</span> {selected.phone}</p>
              <p><span className="font-semibold">Email:</span> {selected.email}</p>
              <p><span className="font-semibold">Alamat:</span> {selected.address}, {selected.village}, {selected.district}, {selected.regency}, {selected.province}</p>
              <p><span className="font-semibold">Asal Sekolah:</span> {selected.school_origin?.name || '-'}</p>
              <p><span className="font-semibold">Tahun Lulus:</span> {selected.graduation_year}</p>
              <p><span className="font-semibold">Jurusan 1:</span> {getDeptName(selected.department_1)}</p>
              <p><span className="font-semibold">Jurusan 2:</span> {selected.department_2 ? getDeptName(selected.department_2) : '-'}</p>
              <p><span className="font-semibold">Ayah:</span> {selected.father_name} ({selected.father_job || '-'})</p>
              <p><span className="font-semibold">Ibu:</span> {selected.mother_name} ({selected.mother_job || '-'})</p>
              <p><span className="font-semibold">No. HP Orang Tua:</span> {selected.parent_phone}</p>
              <p><span className="font-semibold">Status:</span> {getStatusBadge(selected.status)}</p>
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Dialog Ubah Status */}
      {showStatusDialog && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Ubah Status</h3>
            <p className="mb-2">Nama: <strong>{selected.full_name}</strong></p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="pending">Menunggu</option>
              <option value="verified">Terverifikasi</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowStatusDialog(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Hapus */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Hapus Data?</h3>
            <p className="mb-4">Yakin ingin menghapus data ini? Tindakan tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;