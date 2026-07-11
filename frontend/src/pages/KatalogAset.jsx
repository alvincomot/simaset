import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";

export default function KatalogAset({ role, setRole, onLogout, onNavigate }) {
  // 1. Data Palsu
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

  // 2. State untuk Pencarian dan Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // 3. Logika Filter Data Otomatis
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === "Semua" || asset.kategori === selectedKategori;
    const matchesStatus = selectedStatus === "Semua" || asset.status === selectedStatus;

    if (role === "Pengguna Biasa") {
      return matchesSearch && matchesKategori && matchesStatus && asset.status === "Tersedia";
    }

    return matchesSearch && matchesKategori && matchesStatus;
  });

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      {/* Sidebar tetap kita bawa */}
      <Sidebar
        currentRole={role}
        changeRole={setRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="Katalog Aset"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Katalog Aset & Inventaris</h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Konten Utama */}
        <main className="p-8 flex-1 overflow-y-auto">
          {/* Baris Fitur: Search, Filter, dan Tombol Tambah */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Input Search */}
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

            {/* Dropdown Filter Kategori & Status */}
            <div className="flex items-center gap-3 Check-fields">
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Furnitur">Furnitur</option>
              </select>

              {/* Filter status disembunyikan untuk Pengguna Biasa karena mereka cuma boleh lihat yang 'Tersedia' */}
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

              {/* Tombol Tambah Barang: Cuma muncul buat Super Admin & Manajer Aset */}
              {role !== "Pengguna Biasa" && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md shadow-blue-100 transition">
                  <Plus size={18} />
                  Tambah Aset
                </button>
              )}
            </div>
          </div>

          {/* Tabel Data Barang */}
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
                      {/* Tombol Aksi edit/delete khusus Admin/Manajer */}
                      {role !== "Pengguna Biasa" && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {role === "Super Admin" && (
                              <button
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Hapus"
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
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data aset yang cocok dengan pencarian atau filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
