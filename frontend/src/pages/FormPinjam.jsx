import React, { useEffect, useState } from "react";
import api from "../services/api"; // Memakai instance Axios/API Anda
import Sidebar from "../components/Sidebar";
import { Calendar, Info, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export default function FormPinjam({ role, setRole, onLogout, onNavigate, currentPage }) {
  // State untuk Form Input
  const [barangId, setBarangId] = useState("");
  const [tenggatKembali, setTenggatKembali] = useState("");
  const [tujuan, setTujuan] = useState("");

  // State untuk Menampung Data dari Database
  const [barangTersedia, setBarangTersedia] = useState([]);
  const [riwayatSaya, setRiwayatSaya] = useState([]);

  // State untuk Status Loading & Notifikasi
  const [pesanSukses, setPesanSukses] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchRiwayat();
  }, []);

  // 1. get data from backend (tersedia)
  const fetchAssets = async () => {
    try {
      const response = await api.get("/assets");
      const tersedia = response.data.data.filter((asset) => asset.statusKetersediaan === "TERSEDIA");
      setBarangTersedia(tersedia);
    } catch (error) {
      console.error("Gagal mengambil data aset:", error);
    }
  };

  // 2. get data from user
  const fetchRiwayat = async () => {
    try {
      const response = await api.get("/borrowing");
      setRiwayatSaya(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat peminjaman:", error);
    }
  };

  // 3. Handler Submit Formulir ke Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesanSukses("");
    setPesanError("");

    if (!barangId || !tenggatKembali || !tujuan) {
      alert("Semua kolom form wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/borrowing/request", {
        assetId: barangId,
        tenggatWaktu: tenggatKembali,
        catatan: tujuan,
      });

      if (response.data.status === "success") {
        setPesanSukses("Permintaan peminjaman berhasil dikirim! Menunggu persetujuan.");

        // Reset Input Form
        setBarangId("");
        setTenggatKembali("");
        setTujuan("");

        // Refresh data terbaru dari database
        fetchRiwayat();
        fetchAssets();
      }
    } catch (error) {
      console.error(error);
      setPesanError(error.response?.data?.message || "Gagal mengajukan pinjaman ke server.");
    } finally {
      setLoading(false);
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
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Area Peminjaman Aset</h2>
          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Konten Utama Grid 2 Kolom */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI: FORMULIR PENGAJUAN */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Buat Pengajuan Baru</h3>

            <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3.5 rounded-xl flex gap-3 text-xs leading-relaxed">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p>Pengajuan memerlukan waktu persetujuan maksimal 1x24 jam oleh Manajer Aset.</p>
            </div>

            {pesanSukses && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs font-medium">
                {pesanSukses}
              </div>
            )}

            {pesanError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-medium">
                {pesanError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Pilih Barang Aset
                </label>
                <select
                  value={barangId}
                  onChange={(e) => setBarangId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangTersedia.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.kodeAset} - {b.namaAset}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tenggat Kembali
                </label>
                <input
                  type="date"
                  value={tenggatKembali}
                  onChange={(e) => setTenggatKembali(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tujuan Peminjaman / Catatan
                </label>
                <textarea
                  rows="3"
                  placeholder="Kebutuhan kelas/tugas..."
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-sm cursor-pointer ${
                  loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: STATUS & RIWAYAT SAYA */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Riwayat & Status Peminjaman Saya
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {riwayatSaya.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <RotateCcw className="mx-auto opacity-40 animate-spin" size={24} />
                  <p className="text-xs">Belum ada riwayat peminjaman.</p>
                </div>
              ) : (
                riwayatSaya.map((item) => {
                  // Cek apakah status peminjaman terlambat berdasarkan hari ini
                  const hariIni = new Date().toISOString().split("T")[0];
                  const tenggatFormat = new Date(item.tenggatWaktu).toISOString().split("T")[0];
                  const tglPinjamFormat = new Date(item.tanggalPinjam).toLocaleDateString("id-ID");

                  // Terlambat jika status AKTIF namun sudah melewati tenggat waktu kembali
                  const apakahTerlambat = item.statusPeminjaman === "AKTIF" && hariIni > tenggatFormat;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-slate-800">
                          {item.asset?.namaAset || "Aset Tidak Diketahui"}
                        </h4>
                        <p
                          className={`text-xs flex items-center gap-1 ${apakahTerlambat ? "text-rose-600 font-bold" : "text-slate-400"}`}
                        >
                          <Calendar size={12} /> {tglPinjamFormat} s/d{" "}
                          {new Date(item.tenggatWaktu).toLocaleDateString("id-ID")}
                          {apakahTerlambat && " (Terlambat!)"}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          apakahTerlambat
                            ? "bg-rose-100 text-rose-700 border border-rose-300"
                            : item.statusPeminjaman === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : item.statusPeminjaman === "AKTIF"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : item.statusPeminjaman === "DITOLAK"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {apakahTerlambat
                          ? "Terlambat"
                          : item.statusPeminjaman === "PENDING"
                            ? "Menunggu"
                            : item.statusPeminjaman === "AKTIF"
                              ? "Disetujui"
                              : item.statusPeminjaman === "DITOLAK"
                                ? "Ditolak"
                                : "Dikembalikan"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
