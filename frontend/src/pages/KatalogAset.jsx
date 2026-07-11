import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

export default function KatalogAset({ role, setRole, onLogout, onNavigate }) {
  const [assets, setAssets] = useState([
    {
      id: 1,
      kode: "AST-ELK-001",
      nama: "Proyektor Epson X500",
      kategori: "Elektronik",
      lokasi: "Lab Komputer A",
      status: "Tersedia",
      kondisi: "Baik",
    },
    {
      id: 2,
      kode: "AST-ELK-002",
      nama: "PC Desktop ASUS Core i7",
      kategori: "Elektronik",
      lokasi: "Lab Komputer B",
      status: "Dipinjam",
      kondisi: "Baik",
    },
    {
      id: 3,
      kode: "AST-FUR-001",
      nama: "Kursi Kuliah Chitose",
      kategori: "Furnitur",
      lokasi: "Ruang Dosen 1",
      status: "Tersedia",
      kondisi: "Rusak Ringan",
    },
    {
      id: 4,
      kode: "AST-ELK-003",
      nama: "Printer HP Laserjet",
      kategori: "Elektronik",
      lokasi: "Tata Usaha FTI",
      status: "Rusak",
      kondisi: "Rusak Berat",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategori: "Elektronik",
    lokasi: "Lab Komputer A",
    status: "Tersedia",
    kondisi: "Baik",
  });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === "Semua" || asset.kategori === selectedKategori;
    const matchesStatus = selectedStatus === "Semua" || asset.status === selectedStatus;

    if (role === "Pengguna Biasa") {
      return matchesSearch && matchesKategori && asset.status === "Tersedia";
    }
    return matchesSearch && matchesKategori && matchesStatus;
  });

  const openAddModal = () => {
    if (role === "Pengguna Biasa") return;
    setEditingAsset(null);
    // Default form untuk aset baru sesuai PRD
    setFormData({
      kode: "",
      nama: "",
      kategori: "Elektronik",
      lokasi: "Lab Komputer A",
      status: "Tersedia",
      kondisi: "Baik",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (asset) => {
    if (role === "Pengguna Biasa") return;
    setEditingAsset(asset);
    setFormData({ ...asset });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (role !== "Super Admin") {
      alert("Akses Ditolak: Hanya Super Admin yang dapat menghapus aset.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus aset ini dari inventaris?")) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
  };

  // --- LOGIKA SIMPAN DI-UPDATE SESUAI ALUR PRD ---
  const handleSave = (e) => {
    e.preventDefault();
    if (editingAsset) {
      // Jalur Edit/Update
      setAssets(assets.map((item) => (item.id === editingAsset.id ? { ...item, ...formData } : item)));
    } else {
      // Jalur Penambahan Aset Baru Sesuai PRD:
      // 1. Generate Kode Unik Otomatis (Format: AST-[3 Huruf Kategori]-[3 Digit Nomor Acak])
      const prefixKategori = formData.kategori.substring(0, 3).toUpperCase();
      const nomorAcak = Math.floor(100 + Math.random() * 900); // Generate 3 digit angka unik tiruan
      const generatedKode = `AST-${prefixKategori}-${nomorAcak}`;

      const newAsset = {
        id: Date.now(),
        kode: generatedKode, // Sistem auto-generate kode unik
        nama: formData.nama,
        kategori: formData.kategori,
        lokasi: formData.lokasi,
        kondisi: formData.kondisi,
        status: "Tersedia", // PRD: Wajib berstatus "Tersedia" di awal masuk inventaris
      };
      setAssets([...assets, newAsset]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      <Sidebar
        currentRole={role}
        changeRole={setRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="Katalog Aset"
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Katalog Aset & Inventaris</h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kode barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Furnitur">Furnitur</option>
              </select>

              {role !== "Pengguna Biasa" && (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Dipinjam">Dipinjam</option>
                  <option value="Rusak">Rusak</option>
                </select>
              )}

              {role !== "Pengguna Biasa" && (
                <button
                  onClick={openAddModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md shadow-blue-100 transition"
                >
                  <Plus size={18} />
                  Tambah Aset
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Kode Aset</th>
                  <th className="px-6 py-4">Nama Aset</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Kondisi</th>
                  <th className="px-6 py-4">Status</th>
                  {role !== "Pengguna Biasa" && <th className="px-6 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 font-bold">{asset.kode}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{asset.nama}</td>
                      <td className="px-6 py-4 text-slate-600">{asset.kategori}</td>
                      <td className="px-6 py-4 text-slate-600">{asset.lokasi}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            asset.kondisi === "Baik"
                              ? "bg-green-50 text-green-700"
                              : asset.kondisi === "Rusak Ringan"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {asset.kondisi}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            asset.status === "Tersedia"
                              ? "bg-emerald-100 text-emerald-800"
                              : asset.status === "Dipinjam"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>

                      {role !== "Pengguna Biasa" && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(asset)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Aset"
                            >
                              <Edit size={16} />
                            </button>

                            {role === "Super Admin" && (
                              <button
                                onClick={() => handleDelete(asset.id)}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Hapus Aset"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role !== "Pengguna Biasa" ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data aset yang cocok dengan pencarian atau filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- FORMS MODAL KONDISIONAL (TAMBAH VS EDIT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">
                {editingAsset ? "Edit Aset & Kondisi" : "Tambah Aset Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* KOLOM KODE: Hanya muncul & dibaca saat EDIT ASET */}
              {editingAsset && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kode Aset</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed font-mono font-bold"
                    value={formData.kode}
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    *Kode aset bersifat permanen dan tidak dapat diubah.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nama Aset</label>
                <input
                  type="text"
                  required
                  placeholder="Nama barang..."
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Elektronik">Elektronik</option>
                    <option value="Furnitur">Furnitur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Lokasi</label>
                  <select
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Lab Komputer A">Lab Komputer A</option>
                    <option value="Lab Komputer B">Lab Komputer B</option>
                    <option value="Ruang Dosen 1">Ruang Dosen 1</option>
                    <option value="Tata Usaha FTI">Tata Usaha FTI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kondisi Fisik</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>

                {/* KOLOM STATUS KETERSEDIAAN: Di-render hanya saat EDIT ASET */}
                {editingAsset ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Dipinjam">Dipinjam</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status Awal</label>
                    <div className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold text-center">
                      Otomatis: Tersedia
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-100 transition"
                >
                  {editingAsset ? "Simpan Perubahan" : "Tambah Barang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
