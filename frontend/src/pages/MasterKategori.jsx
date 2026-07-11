import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, FolderPlus, Tag, Edit3, X, Check } from "lucide-react";

export default function MasterKategori({ role, setRole, onLogout, onNavigate, currentPage }) {
  // Mock Data
  const [kategoriList, setKategoriList] = useState([
    { id: 1, kode: "ELK", nama: "Elektronik", ket: "Laptop, Proyektor, WebCam, Pointer, dll." },
    { id: 2, kode: "FUR", nama: "Furnitur", ket: "Kursi Kuliah, Meja Dosen, Lemari Arsip, dll." },
  ]);

  // State Input Form
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [ket, setKet] = useState("");

  // State Baru untuk Manajemen Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fungsi saat tombol Edit di tabel diklik
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setKode(item.kode);
    setNama(item.nama);
    setKet(item.ket);
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setKode("");
    setNama("");
    setKet("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kode || !nama) {
      alert("Kode dan Nama Kategori wajib diisi!");
      return;
    }

    if (isEditing) {
      // LOGIKA UPDATE DATA
      setKategoriList(
        kategoriList.map((item) =>
          item.id === editId ? { ...item, kode: kode.toUpperCase(), nama: nama, ket: ket || "-" } : item,
        ),
      );
      handleCancelEdit(); // Reset form & keluar dari mode edit
    } else {
      // LOGIKA TAMBAH DATA (Sama seperti sebelumnya)
      const baru = {
        id: Date.now(),
        kode: kode.toUpperCase(),
        nama: nama,
        ket: ket || "-",
      };
      setKategoriList([...kategoriList, baru]);
      setKode("");
      setNama("");
      setKet("");
    }
  };

  const handleDelete = (id) => {
    // Jika sedang mengedit item tersebut, batalkan dulu sebelum dihapus
    if (isEditing && editId === id) {
      handleCancelEdit();
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setKategoriList(kategoriList.filter((item) => item.id !== id));
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
          {/* Form Tambah / Edit Kategori */}
          <form
            onSubmit={handleSubmit}
            className={`lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm space-y-4 transition-colors ${isEditing ? "border-amber-300 bg-amber-50/10" : "border-slate-200"}`}
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FolderPlus size={16} /> {isEditing ? "Ubah Kategori" : "Tambah Kategori"}
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Kode Kategori (Max 3 Huruf)
              </label>
              <input
                type="text"
                maxLength={3}
                placeholder="Contoh: ELK"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                  <th className="px-6 py-3">Kode</th>
                  <th className="px-6 py-3">Nama Kategori</th>
                  <th className="px-6 py-3">Deskripsi</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {kategoriList.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition ${isEditing && editId === item.id ? "bg-amber-50/40" : "hover:bg-slate-50/80"}`}
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">{item.kode}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.nama}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{item.ket}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
