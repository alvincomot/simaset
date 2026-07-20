import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, FolderPlus, Tag, Edit3, X, Check } from "lucide-react";

export default function MasterKategori({ role, setRole, onLogout, onNavigate, currentPage }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/masters/categories");
      setKategoriList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil kategori", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [nama, setNama] = useState("");
  const [ket, setKet] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // tombol Edit
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item.id);

    setNama(item.namaKategori);
    setKet(item.deskripsi || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNama("");
    setKet("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama) {
      alert("Nama kategori wajib diisi");
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/masters/categories/${editId}`, {
          namaKategori: nama,
          deskripsi: ket,
        });

        handleCancelEdit();
      } else {
        await api.post("/masters/categories", {
          namaKategori: nama,
          deskripsi: ket,
        });

        setNama("");
        setKet("");
      }

      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori?")) return;

    try {
      await api.delete(`/masters/categories/${id}`);

      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus kategori");
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
            <Tag size={20} className="text-blue-600" /> Master Kategori Aset
          </h2>
          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        <main className="p-8 flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Add & Edit Kategori */}
          <form
            onSubmit={handleSubmit}
            className={`lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm space-y-4 transition-colors ${isEditing ? "border-amber-300 bg-amber-50/10" : "border-slate-200"}`}
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FolderPlus size={16} /> {isEditing ? "Ubah Kategori" : "Tambah Kategori"}
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Kategori</label>
              <input
                type="text"
                placeholder="Contoh: Elektronik"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keterangan</label>
              <textarea
                rows="2"
                placeholder="Deskripsi singkat jenis barang..."
                value={ket}
                onChange={(e) => setKet(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                {isEditing ? "Perbarui" : "Simpan Kategori"}
              </button>
            </div>
          </form>

          {/* Tabel Daftar Kategori */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nama Kategori</th>
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
                ) : kategoriList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Belum ada kategori
                    </td>
                  </tr>
                ) : (
                  kategoriList.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isEditing && editId === item.id ? "bg-amber-50/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-blue-600">{item.id}</td>

                      <td className="px-6 py-4 font-semibold text-slate-800">{item.namaKategori}</td>

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
