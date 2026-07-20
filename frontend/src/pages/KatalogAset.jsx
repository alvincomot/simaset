import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import api from "../services/api";

export default function KatalogAset({ role, setRole, onLogout, onNavigate }) {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategori: "Elektronik",
    lokasi: "Lab Komputer A",
    status: "Tersedia",
    kondisi: "Baik",
  });

  // 1. get
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setErrorFetch("");

      const response = await api.get("/assets");

      const dataAset = response.data.data || response.data;

      if (Array.isArray(dataAset)) {
        setAssets(dataAset);
      } else {
        console.error("Data dari server bukan berbentuk array:", response.data);
        setAssets([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data aset:", err);
      setErrorFetch("Gagal memuat data inventaris aset dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchMasterData();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      (asset.namaAset?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (asset.kodeAset?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === "Semua" || Number(asset.categoryId) === Number(selectedKategori);
    const matchesStatus = selectedStatus === "Semua" || asset.statusKetersediaan === selectedStatus;

    if (role !== "SUPER_ADMIN" && role !== "STAFF") {
      return matchesSearch && matchesKategori && asset.statusKetersediaan === "TERSEDIA";
    }
    return matchesSearch && matchesKategori && matchesStatus;
  });

  // 2. create
  const openAddModal = () => {
    if (role === "USER") return;
    setEditingAsset(null);
    setFormData({
      namaAset: "",
      categoryId: 1,
      locationId: 1,
      kondisi: "BAIK",
      statusKetersediaan: "TERSEDIA",
    });
    setIsModalOpen(true);
  };

  // 3. update
  const openEditModal = (asset) => {
    if (role === "USER") return;
    setEditingAsset(asset);
    setFormData({
      kodeAset: asset.kodeAset,
      namaAset: asset.namaAset,
      categoryId: asset.categoryId,
      locationId: asset.locationId,
      kondisi: asset.kondisi,
      statusKetersediaan: asset.statusKetersediaan,
    });
    setIsModalOpen(true);
  };

  // 4. delete
  const handleDelete = async (id) => {
    if (role !== "SUPER_ADMIN") {
      alert("Akses Ditolak: Hanya Super Admin yang dapat menghapus aset.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus aset ini dari inventaris?")) {
      try {
        await api.delete(`/assets/${id}`);
        setAssets(assets.filter((asset) => asset.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus aset dari database.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const backendPayload = {
      namaAset: formData.namaAset,
      categoryId: formData.categoryId,
      locationId: formData.locationId,
      kondisi: formData.kondisi,
      statusKetersediaan: formData.statusKetersediaan,
    };

    try {
      if (editingAsset) {
        await api.put(`/assets/${editingAsset.id}`, backendPayload);
      } else {
        await api.post("/assets", backendPayload);
      }

      await fetchAssets();

      setIsModalOpen(false);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [categoryRes, locationRes] = await Promise.all([
        api.get("/masters/categories"),
        api.get("/masters/locations"),
      ]);

      setCategories(categoryRes.data.data);
      setLocations(locationRes.data.data);
    } catch (err) {
      console.error("Gagal mengambil master data", err);
    }
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
          {errorFetch && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {errorFetch}
            </div>
          )}

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
              {role !== "USER" && (
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm"
                >
                  <option value="Semua">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.namaKategori}
                    </option>
                  ))}
                </select>
              )}

              {role !== "USER" && (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none shadow-sm"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="TERSEDIA">Tersedia</option>
                  <option value="DIPINJAM">Dipinjam</option>
                  <option value="PEMELIHARAAN">Pemeliharaan</option>
                </select>
              )}

              {role !== "USER" && (
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
                  {role !== "USER" && <th className="px-6 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={role !== "USER" ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                      Memuat data aset dari server...
                    </td>
                  </tr>
                ) : filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 font-bold">{asset.kodeAset}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{asset.namaAset}</td>
                      <td className="px-6 py-4 text-slate-600">{asset.category?.namaKategori}</td>
                      <td className="px-6 py-4 text-slate-600">{asset.location?.namaLokasi}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            asset.kondisi === "BAIK"
                              ? "bg-green-50 text-green-700"
                              : asset.kondisi === "RUSAK"
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
                            asset.statusKetersediaan === "TERSEDIA"
                              ? "bg-emerald-100 text-emerald-800"
                              : asset.statusKetersediaan === "DIPINJAM"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {asset.statusKetersediaan}
                        </span>
                      </td>

                      {role !== "USER" && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(asset)}
                              className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition cursor-pointer"
                              title="Edit Aset"
                            >
                              <Edit size={16} />
                            </button>

                            {role === "SUPER_ADMIN" && (
                              <button
                                onClick={() => handleDelete(asset.id)}
                                className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
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
                    <td colSpan={role !== "USER" ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data aset yang cocok dengan pencarian atau filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- modal add + edit */}
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
              {editingAsset && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kode Aset</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed font-mono font-bold"
                    value={formData.kodeAset}
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
                  disabled={submitLoading}
                  placeholder="Nama barang..."
                  value={formData.namaAset}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      namaAset: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.namaKategori}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Lokasi</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.namaLokasi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kondisi Fisik</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="BAIK">Baik</option>
                    <option value="RUSAK">Rusak</option>
                  </select>
                </div>

                {editingAsset ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                    <select
                      value={formData.statusKetersediaan}
                      disabled={submitLoading}
                      onChange={(e) => setFormData({ ...formData, statusKetersediaan: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="TERSEDIA">Tersedia</option>
                      <option value="DIPINJAM">Dipinjam</option>
                      <option value="PEMELIHARAAN">Pemeliharaan</option>
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
                  disabled={submitLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-100 transition disabled:opacity-50"
                >
                  {submitLoading ? "Menyimpan..." : editingAsset ? "Simpan Perubahan" : "Tambah Barang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
