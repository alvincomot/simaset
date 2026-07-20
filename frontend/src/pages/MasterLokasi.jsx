import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, MapPin, Building, Edit3, X, Check } from "lucide-react";

export default function MasterLokasi({ role, setRole, onLogout, onNavigate, currentPage }) {
  const [lokasiList, setLokasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await api.get("/masters/locations");
      setLokasiList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil lokasi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const [namaLokasi, setNamaLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // tombol Edit
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item.id);

    setNamaLokasi(item.namaLokasi);
    setDeskripsi(item.deskripsi);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNamaLokasi("");
    setDeskripsi("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaLokasi) {
      alert("Nama Lokasi wajib diisi!");
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/masters/locations/${editId}`, {
          namaLokasi: namaLokasi,
          deskripsi: deskripsi,
        });

        handleCancelEdit();
      } else {
        await api.post("/masters/locations", {
          namaLokasi: namaLokasi,
          deskripsi: deskripsi,
        });

        setNamaLokasi("");
        setDeskripsi("");
      }

      fetchLocations();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus lokasi?")) return;

    try {
      await api.delete(`/masters/locations/${id}`);

      fetchLocations();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus lokasi");
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      <Sidebar
        currentRole={role}
        changeRole={setRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" /> Master Lokasi Aset
          </h2>
          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        <main className="p-8 flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Add & Edit Lokasi */}
          <form
            onSubmit={handleSubmit}
            className={`lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm space-y-4 transition-colors ${isEditing ? "border-amber-300 bg-amber-50/10" : "border-slate-200"}`}
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building size={16} /> {isEditing ? "Ubah Lokasi Ruangan" : "Tambah Lokasi Baru"}
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lokasi</label>
              <input
                type="text"
                placeholder="Contoh: Lab Komputer 1"
                value={namaLokasi}
                onChange={(e) => setNamaLokasi(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deskripsi</label>
              <input
                type="text"
                placeholder="Contoh: Gedung FTI Lantai 2"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <X size={14} /> Batal
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-sm cursor-pointer text-white ${isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isEditing ? <Check size={14} /> : <Plus size={14} />}
                {isEditing ? "Perbarui" : "Simpan Lokasi"}
              </button>
            </div>
          </form>

          {/* Tabel Daftar Lokasi */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Nama Lokasi</th>
                  <th className="px-6 py-3">Deskripsi</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : lokasiList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Belum ada lokasi
                    </td>
                  </tr>
                ) : (
                  lokasiList.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isEditing && editId === item.id ? "bg-amber-50/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">{item.namaLokasi}</td>

                      <td className="px-6 py-4 text-slate-500 text-xs">{item.deskripsi}</td>

                      <td className="px-6 py-4 text-center flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition cursor-pointer"
                          title="Edit Data"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
